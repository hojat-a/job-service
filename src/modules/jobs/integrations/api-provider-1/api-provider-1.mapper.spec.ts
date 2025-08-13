import { ApiProvider1Mapper } from './api-provider-1.mapper';
import { JobProvider1Dto } from '../../dto/job-provider-1.dto';

describe('ApiProvider1Mapper', () => {
  let mapper: ApiProvider1Mapper;

  beforeEach(() => {
    mapper = new ApiProvider1Mapper();
  });

  it('should correctly map job data', () => {
    const input: JobProvider1Dto = {
      jobId: '123',
      title: 'Software Engineer',
      details: {
        location: 'Austin, TX',
        salaryRange: '$50k - $145k',
        type: 'Full-time',
      },
      company: {
        name: 'TechCorp',
        industry: 'Software',
      },
      skills: ['JavaScript', 'NestJS'],
      postedDate: '2023-08-01T00:00:00Z',
    };

    const result = mapper.mapSource1(input);

    expect(result).toEqual({
      externalId: '123',
      title: 'Software Engineer',
      city: 'Austin',
      state: 'TX',
      jobType: 'Full-time',
      minSalary: 50000,
      maxSalary: 145000,
      currency: 'USD',
      companyName: 'TechCorp',
      companyIndustry: 'Software',
      skills: ['JavaScript', 'NestJS'],
      postedDate: new Date('2023-08-01T00:00:00Z'),
      source: 'source1',
    });
  });

  it('should handle missing optional fields gracefully', () => {
    const input = {
      jobId: '456',
      title: 'QA Engineer',
      details: {}, // no location, salaryRange, type
      company: {}, // no name, industry
      skills: [],
      postedDate: '2023-08-05T00:00:00Z',
    } as unknown as JobProvider1Dto;

    const result = mapper.mapSource1(input);

    expect(result).toEqual({
      externalId: '456',
      title: 'QA Engineer',
      city: '',
      state: undefined,
      jobType: undefined,
      minSalary: null,
      maxSalary: null,
      currency: 'USD',
      companyName: undefined,
      companyIndustry: undefined,
      skills: [],
      postedDate: new Date('2023-08-05T00:00:00Z'),
      source: 'source1',
    });
  });
});
