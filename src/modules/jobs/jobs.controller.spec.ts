// jobs.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JobFilterDto } from './dto/job-filter.dto';
import { ISuccessResponse } from './interfaces/success-response-interface';

describe('JobsController', () => {
  let controller: JobsController;
  let jobsService: jest.Mocked<JobsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        {
          provide: JobsService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<JobsController>(JobsController);
    jobsService = module.get(JobsService);
  });

  describe('findAll', () => {
    it('should call jobsService.findAll with filterDto and return the result', async () => {
      const filterDto: JobFilterDto = { title: 'Developer', city: 'texas' };
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

      jobsService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(filterDto);

      expect(jobsService.findAll).toHaveBeenCalledWith(filterDto);
      expect(result).toEqual(mockResponse);
    });
  });
});
