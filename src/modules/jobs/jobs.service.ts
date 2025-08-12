import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JobsRepository } from './jobs.repository';
import { ApiProvider2Service } from './integrations/api-provider-2/api-provider-2.service';
import { ApiProvider1Service } from './integrations/api-provider-1/api-provider-1.service';
import { JobFilterDto } from './dto/job-filter.dto';
import { IJob } from './interfaces/jobs.interface';
import fetchWithRetry from 'src/common/utils/retry.util';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private readonly jobsRepository: JobsRepository,
    private readonly apiProvider1Service: ApiProvider1Service,
    private readonly apiProvider2Service: ApiProvider2Service,
  ) { }

  private async syncJobs(source: string, provider: () => Promise<Partial<IJob>[]>) {
    try {
      this.logger.log(`Fetching jobs from ${source}`);
      const jobs = await fetchWithRetry(
        () => provider(),
        {
          maxRetries: 3,
          initialDelay: 1000
        }
      );
      this.logger.log(`Fetched ${jobs.length} jobs from ${source}`);

      // Process jobs in batches to avoid overloading the database
      const batchSize = 50;
      for (let i = 0; i < jobs.length; i += batchSize) {
        const batch = jobs.slice(i, i + batchSize);

        const results = await Promise.allSettled(
          batch.map(job => this.jobsRepository.upsertJob(job))
        );
        results.forEach((result, idx) => {
          if (result.status === 'rejected') {
            this.logger.error(`Failed to upsert job ${batch[idx].id}: ${result.reason}`);
          }
        });

        this.logger.log(`Processed batch ${i / batchSize + 1}/${Math.ceil(jobs.length / batchSize)} from ${source}`);
      }

      return jobs.length;
    } catch (error) {
      this.logger.error(`Error synchronizing jobs from ${source}: ${error.message}`);
      return 0;
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async syncJobsFromProvider1() {
    return await this.syncJobs('source1', () => this.apiProvider1Service.fetchJobs())
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async syncJobsFromProvider2() {
    return await this.syncJobs('source2', () => this.apiProvider2Service.fetchJobs())
  }

  async findAll(filterDto: JobFilterDto) {
    return this.jobsRepository.findAll(filterDto);
  }
}