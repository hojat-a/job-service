import {
  Controller,
  Get,
  Query
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobFilterDto } from './dto/job-filter.dto';
import { ISuccessResponse } from './interfaces/success-response-interface';

@Controller({ /*path: 'jobs',*/ version: '1' })
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Get('job-offers')
  async findAll(@Query() filterDto: JobFilterDto): Promise<ISuccessResponse> {
    return this.jobsService.findAll(filterDto);
  }
}