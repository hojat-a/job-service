// jobs.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { JobsRepository } from './jobs.repository';
import { ApiProvider1Service } from './integrations/api-provider-1/api-provider-1.service';
import { ApiProvider2Service } from './integrations/api-provider-2/api-provider-2.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import fetchWithRetry from 'src/common/utils/retry.util';
import { JobFilterDto } from './dto/job-filter.dto';
import { ISuccessResponse } from './interfaces/success-response-interface';

jest.mock('src/common/utils/retry.util');
jest.mock('cron');

describe('JobsService', () => {
  let service: JobsService;
  let jobsRepository: jest.Mocked<JobsRepository>;
  let configService: jest.Mocked<ConfigService>;
  let apiProvider1Service: jest.Mocked<ApiProvider1Service>;
  let apiProvider2Service: jest.Mocked<ApiProvider2Service>;
  let schedulerRegistry: jest.Mocked<SchedulerRegistry>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: JobsRepository,
          useValue: { findAll: jest.fn(), upsertJob: jest.fn() },
        },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: ApiProvider1Service, useValue: { fetchJobs: jest.fn() } },
        { provide: ApiProvider2Service, useValue: { fetchJobs: jest.fn() } },
        { provide: SchedulerRegistry, useValue: { addCronJob: jest.fn() } },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    jobsRepository = module.get(JobsRepository);
    configService = module.get(ConfigService);
    apiProvider1Service = module.get(ApiProvider1Service);
    apiProvider2Service = module.get(ApiProvider2Service);
    schedulerRegistry = module.get(SchedulerRegistry);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should call jobsRepository.findAll with filterDto and return the result', async () => {
      const filterDto: JobFilterDto = { title: 'Dev', city: 'texas' };
      const mockResponse: ISuccessResponse = {
        total: 2,
        data: [
          {
            id: 'abd7ac7a-3fdc-4427-ac36-6dbabc194a3d',
            externalId: 'P1-974',
            title: 'Frontend Developer',
            city: 'Austin',
            state: 'TX',
            remote: false,
            jobType: 'Contract',
            minSalary: 59000,
            maxSalary: 139000,
            currency: 'USD',
            companyName: 'DataWorks',
            companyIndustry: 'Technology',
            experience: null,
            skills: ['Java', 'Spring Boot', 'AWS'],
            postedDate: new Date('2025-08-07T15:24:28.469Z'),
            source: 'source1',
            createdAt: new Date('2025-08-12T12:35:15.838Z'),
            updatedAt: new Date('2025-08-12T12:35:15.838Z'),
          },
        ],
      };
      jobsRepository.findAll.mockResolvedValue(mockResponse);

      const result = await service.findAll(filterDto);

      expect(jobsRepository.findAll).toHaveBeenCalledWith(filterDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('syncJobs', () => {
    it('should fetch jobs, upsert them in batches, and return count', async () => {
      const mockJobs = Array.from({ length: 3 }, (_, i) => ({
        externalId: `job-${i}`,
      }));
      (fetchWithRetry as jest.Mock).mockResolvedValue(mockJobs);
      jobsRepository.upsertJob.mockResolvedValue(undefined);

      await service['syncJobs'](
        'source1',
        jest.fn().mockResolvedValue(mockJobs),
      );

      expect(fetchWithRetry).toHaveBeenCalled();
      expect(jobsRepository.upsertJob).toHaveBeenCalledTimes(mockJobs.length);
    });
  });

  describe('onModuleInit', () => {
    it('should register cron jobs with configured times', () => {
      configService.get
        .mockReturnValueOnce('* * * * *') // API_PROVIDER_1_CRON
        .mockReturnValueOnce('*/5 * * * *'); // API_PROVIDER_2_CRON

      service.onModuleInit();

      expect(schedulerRegistry.addCronJob).toHaveBeenCalledTimes(2);

      const calls = (schedulerRegistry.addCronJob as jest.Mock).mock.calls;
      expect(calls[0][0]).toBe('provider1Job');
      expect(calls[1][0]).toBe('provider2Job');
    });
  });
});
