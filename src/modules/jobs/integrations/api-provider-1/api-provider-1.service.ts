import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiProvider1Mapper } from './api-provider-1.mapper';
import { firstValueFrom } from 'rxjs';

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

  async fetchJobs() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}`, {
        }),
      );

      // Map the API response to our unified job model
      return response.data.jobs.map(job => this.mapper.mapSource1(job));
    } catch (error) {
      this.logger.error(`Error fetching jobs from API Provider 1: ${error.message}`);
      throw error;
    }
  }
}