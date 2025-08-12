import { Injectable } from '@nestjs/common';
import { IJob } from 'src/modules/jobs/interfaces/jobs.interface';

@Injectable()
export class ApiProvider1Mapper {
  /**
   * Maps the API Provider 1 job data to our unified Job entity
   */
  mapSource1(data: any): Partial<IJob> {
    // Split "Austin, TX"
    const [city, state] = (data.details?.location || '').split(',').map(v => v.trim());
    // Parse "$50k - $145k"
    const salaryMatch = /\$?([\d.,]+)k\s*-\s*\$?([\d.,]+)k/i.exec(data.details?.salaryRange || '');
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
      currency: 'USD', // default
      companyName: data.company?.name,
      companyIndustry: data.company?.industry,
      skills: data.skills || [],
      postedDate: new Date(data.postedDate),
      source: 'source1'
    };
  }
}