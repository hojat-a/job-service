import { Injectable } from '@nestjs/common';
import { IJob } from 'src/modules/jobs/interfaces/jobs.interface';

@Injectable()
export class ApiProvider2Mapper {
  /**
   * Maps the API Provider 2 job data to our unified Job entity
   */
  mapSource2(data: any): Partial<IJob> {
    return {
      externalId: data.externalId,
      title: data.position,
      city: data.location?.city,
      state: data.location?.state,
      remote: data.location?.remote ?? false,
      minSalary: data.compensation?.min,
      maxSalary: data.compensation?.max,
      currency: data.compensation?.currency,
      companyName: data.employer?.companyName,
      experience: data.requirements?.experience,
      skills: data.requirements?.technologies || [],
      postedDate: new Date(data.datePosted),
      source: 'source2',
      metadata: {
        companyWebsite: data.employer?.website,
      }
    };
  }
}