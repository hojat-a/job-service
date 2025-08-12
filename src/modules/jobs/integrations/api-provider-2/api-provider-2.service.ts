import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiProvider2Mapper } from './api-provider-2.mapper';
import { firstValueFrom } from 'rxjs';
import { IJob } from 'src/modules/jobs/interfaces/jobs.interface';

@Injectable()
export class ApiProvider2Service {
  private readonly logger = new Logger(ApiProvider2Service.name);
  private readonly apiUrl: string | undefined;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly mapper: ApiProvider2Mapper,
  ) {
    this.apiUrl = this.configService.get<string>('API_PROVIDER_2_URL');
  }

  async fetchJobs(): Promise<Partial<IJob>[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}`, {}),
      );
      const jobsObject: object = response.data?.data?.jobsList;
      const jobsArray: any = []
      for (const [externalId, jobData] of Object.entries(jobsObject)) {
        jobsArray.push({
          externalId,
          ...jobData,
        });
      }

      const validatedJobs: Partial<IJob>[] = [];
      for (const jobRaw of jobsArray) {

        // Map to your unified model or save as needed
        const unifiedJob = this.mapper.mapSource2(jobRaw);
        validatedJobs.push(unifiedJob);
      }

      return validatedJobs;

    } catch (error) {
      this.logger.error(`Error fetching jobs from API Provider 2: ${error.message}`);
      throw error;
    }
  }
}