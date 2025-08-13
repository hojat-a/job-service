import { ApiProvider2Mapper } from './api-provider-2.mapper';
import { JobProvider2Dto } from '../../dto/job-provider-2.dto';

describe('ApiProvider2Mapper', () => {
  let mapper: ApiProvider2Mapper;

  beforeEach(() => {
    mapper = new ApiProvider2Mapper();
  });

  it('should correctly map job data', () => {
    const input: JobProvider2Dto = {
      externalId: 'job-840',
      position: 'Data Scientist',
      location: {
        city: 'San Francisco',
        state: 'NY',
        remote: false,
      },
      compensation: {
        min: 79000,
        max: 107000,
        currency: 'USD',
      },
      employer: {
        companyName: 'BackEnd Solutions',
        website: 'https://backendsolutions.com',
      },
      requirements: {
        experience: 3,
        technologies: ['HTML', 'CSS', 'Vue.js'],
      },
      datePosted: '2025-08-01',
    };

    const result = mapper.mapSource2(input);

    expect(result).toEqual({
      externalId: 'job-840',
      title: 'Data Scientist',
      city: 'San Francisco',
      state: 'NY',
      remote: false,
      minSalary: 79000,
      maxSalary: 107000,
      currency: 'USD',
      companyName: 'BackEnd Solutions',
      skills: ['HTML', 'CSS', 'Vue.js'],
      experience: 3,
      postedDate: new Date('2025-08-01'),
      source: 'source2',
      metadata: {
        companyWebsite: 'https://backendsolutions.com',
      },
    });
  });

  it('should handle missing optional fields gracefully', () => {
    const input = {
      externalId: '456',
      position: 'QA Engineer',
      location: {},
      compensation: {},
      datePosted: '2023-08-05T00:00:00Z',
    } as unknown as JobProvider2Dto;

    const result = mapper.mapSource2(input);

    expect(result).toEqual({
      city: undefined,
      companyName: undefined,
      currency: undefined,
      experience: undefined,
      externalId: '456',
      maxSalary: undefined,
      metadata: { companyWebsite: undefined },
      minSalary: undefined,
      postedDate: new Date('2023-08-05T00:00:00Z'),
      remote: false,
      skills: [],
      source: 'source2',
      state: undefined,
      title: 'QA Engineer',
    });
  });
});
