import { Injectable } from '@nestjs/common';
import { IJob } from '../../interfaces/job.interface';
import { JobProvider1Dto } from '../../dto/job-provider-1.dto';

@Injectable()
export class ApiProvider1Mapper {
  /**
   * Maps the API Provider 1 job data to our unified Job entity
   */
  mapSource1(data: JobProvider1Dto): Partial<IJob> {
    // Split "Austin, TX"
    const [city, state] = (data.details?.location || '')
      .split(',')
      .map((v) => v.trim());
    // Parse "$50k - $145k"
    const salaryMatch = /\$?([\d.,]+)k\s*-\s*\$?([\d.,]+)k/i.exec(
      data.details?.salaryRange || '',
    );
    const minSalary = salaryMatch ? parseInt(salaryMatch[1]) * 1000 : null;
    const maxSalary = salaryMatch ? parseInt(salaryMatch[2]) * 1000 : null;

    return {
      externalId: data.jobId,
      title: data.title,
      city,
      state,
      jobType: data.details?.type,
      minSalary,
      maxSalary,
      currency: 'USD', // default,TODO: Add to constants
      companyName: data.company?.name,
      companyIndustry: data.company?.industry,
      skills: data.skills || [],
      postedDate: new Date(data.postedDate),
      source: 'source1', //TODO: Add to constants
    };
  }
}
