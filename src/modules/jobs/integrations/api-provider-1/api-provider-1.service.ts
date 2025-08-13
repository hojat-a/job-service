import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiProvider1Mapper } from './api-provider-1.mapper';
import { firstValueFrom } from 'rxjs';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { JobProvider1Dto } from '../../dto/job-provider-1.dto';
import { IJob } from '../../interfaces/job.interface';

@Injectable()
export class ApiProvider1Service {
  private readonly logger = new Logger(ApiProvider1Service.name);
  private readonly apiUrl: string | undefined;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly mapper: ApiProvider1Mapper,
  ) {
    this.apiUrl = this.configService.get<string>('API_PROVIDER_1_URL');
  }

  async fetchJobs(): Promise<Partial<IJob>[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}`, {}),
      );
      const rawJobs = response?.data?.jobs;
      const validatedJobs: Partial<IJob>[] = [];

      for (const rawJob of rawJobs) {
        const jobDto = plainToInstance(JobProvider1Dto, rawJob);

        const errors = await validate(jobDto);
        if (errors.length > 0) {
          this.logger.warn(
            `Validation failed for job ${rawJob.jobId}: ${errors}`,
          );
          continue; // skip invalid job
        }

        // If valid, map the job data
        const unifiedJob = this.mapper.mapSource1(rawJob);
        validatedJobs.push(unifiedJob);
      }

      return validatedJobs;
    } catch (error) {
      this.logger.error(
        `Error fetching jobs from API Provider 1: ${error.message}`,
      );
      throw error;
    }
  }
}
