import { Injectable, Logger } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';
import { JobsRepository } from './jobs.repository';
import { ApiProvider2Service } from './integrations/api-provider-2/api-provider-2.service';
import { ApiProvider1Service } from './integrations/api-provider-1/api-provider-1.service';
import { JobFilterDto } from './dto/job-filter.dto';
import { IJob } from './interfaces/job.interface';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ConfigService } from '@nestjs/config';
import fetchWithRetry from 'src/common/utils/retry.util';
import { ISuccessResponse } from './interfaces/success-response-interface';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private readonly jobsRepository: JobsRepository,
    private readonly configService: ConfigService,
    private readonly apiProvider1Service: ApiProvider1Service,
    private readonly apiProvider2Service: ApiProvider2Service,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit() {
    const cron1 = this.configService.get<string>(
      'API_PROVIDER_1_CRON',
      CronExpression.EVERY_10_MINUTES,
    );
    const cron2 = this.configService.get<string>(
      'API_PROVIDER_2_CRON',
      CronExpression.EVERY_10_MINUTES,
    );

    this.registerCron('provider1Job', cron1, () =>
      this.syncJobs('source1', () => this.apiProvider1Service.fetchJobs()),
    );

    this.registerCron('provider2Job', cron2, () =>
      this.syncJobs('source2', () => this.apiProvider2Service.fetchJobs()),
    );
  }

  private registerCron(
    name: string,
    cronTime: string,
    task: () => Promise<void>,
  ) {
    this.logger.log(`Registering cron job: ${name} with schedule: ${cronTime}`);

    const job = new CronJob(cronTime, async () => {
      try {
        await task();
      } catch (err) {
        this.logger.error(`Error in job ${name}:`, err);
      }
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  private async syncJobs(
    source: string,
    provider: () => Promise<Partial<IJob>[]>,
  ): Promise<void> {
    try {
      this.logger.log(`Fetching jobs from ${source}`);
      const jobs = await fetchWithRetry(() => provider(), {
        maxRetries: 3, //TODO: Add to constants
        initialDelay: 1000, //TODO: Add to constants
      });
      this.logger.log(`Fetched ${jobs.length} jobs from ${source}`);

      // Process jobs in batches to avoid overloading the database
      const batchSize = 50; //TODO: Add to constants
      for (let i = 0; i < jobs.length; i += batchSize) {
        const batch = jobs.slice(i, i + batchSize);

        const results = await Promise.allSettled(
          batch.map((job) => this.jobsRepository.upsertJob(job)),
        );
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            this.logger.error(
              `Failed to upsert job ${batch[index].externalId}: ${result.reason}`,
            );
          }
        });

        this.logger.log(
          `Processed batch ${i / batchSize + 1}/${Math.ceil(jobs.length / batchSize)} from ${source}`,
        );
      }

      return;
    } catch (error) {
      this.logger.error(
        `Error synchronizing jobs from ${source}: ${error?.message}`,
      );
      return;
    }
  }

  async findAll(filterDto: JobFilterDto): Promise<ISuccessResponse> {
    return this.jobsRepository.findAll(filterDto);
  }
}
