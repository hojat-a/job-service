import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { IJob } from './interfaces/job.interface';
import { JobFilterDto } from './dto/job-filter.dto';

@Injectable()
export class JobsRepository {
  constructor(
    @InjectRepository(Job)
    private repository: Repository<IJob>,
  ) {}

  async findAll(
    filter: JobFilterDto,
  ): Promise<{ data: IJob[]; total: number }> {
    const query = this.repository.createQueryBuilder('job');

    if (filter.title) {
      query.andWhere('job.title ILIKE :title', { title: `%${filter.title}%` });
    }
    if (filter.city) {
      query.andWhere('job.city ILIKE :city', { city: `%${filter.city}%` });
    }
    if (filter.state) {
      query.andWhere('job.state ILIKE :state', { state: `%${filter.state}%` });
    }

    if (filter.salary) {
      if (filter.salary.min !== undefined) {
        query.andWhere('job.minSalary >= :minSalary', {
          minSalary: filter.salary.min,
        });
      }
      if (filter.salary.max !== undefined) {
        query.andWhere('job.maxSalary <= :maxSalary', {
          maxSalary: filter.salary.max,
        });
      }
    }

    // Pagination
    const page = filter?.page || 1;
    const limit = filter?.limit || 10;
    const offset = (page - 1) * limit;

    query.skip(offset).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
    };
  }

  async findBySourceAndExternalId(
    source: string,
    externalId: string,
  ): Promise<IJob | null> {
    return this.repository.findOne({
      where: {
        source,
        externalId,
      },
    });
  }

  async createJob(jobData: Partial<IJob>): Promise<IJob> {
    const job = this.repository.create({
      ...jobData,
      skills: jobData.skills || [],
    });
    return this.repository.save(job);
  }

  async updateJob(id: string, jobData: Partial<IJob>): Promise<void> {
    await this.repository.update(id, {
      ...jobData,
      skills: jobData.skills || [],
    });
  }

  async upsertJob(jobData: Partial<IJob>): Promise<void | IJob> {
    const { source, externalId } = jobData;

    if (!source || !externalId) {
      throw new Error('sourceApi and externalId are required for upsert a job');
    }
    //Check if job exists
    //todo: check if job posted date is changed
    //todo: if there is duplicate jobs, we should use lock to avoid concurrency
    const existingJob = await this.findBySourceAndExternalId(
      source,
      externalId,
    );

    if (existingJob) {
      // Update existing job
      return await this.updateJob(existingJob.id, jobData);
    } else {
      // Create new job
      return this.createJob(jobData);
    }
  }
}
