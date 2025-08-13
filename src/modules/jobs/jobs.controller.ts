import { Controller, Get, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobFilterDto } from './dto/job-filter.dto';
import { ISuccessResponse } from './interfaces/success-response-interface';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SuccessResponseDto } from './dto/success-response.dto';

@ApiTags('jobs')
@Controller({ /*path: 'jobs',*/ version: '1' })
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ApiOperation({ summary: 'Get all job offers' })
  @ApiQuery({ name: 'filter', type: JobFilterDto })
  @ApiResponse({
    status: 200,
    description: 'List of job offers retrieved successfully.',
    type: SuccessResponseDto,
  })
  @Get('job-offers')
  async findAll(@Query() filterDto: JobFilterDto): Promise<ISuccessResponse> {
    return this.jobsService.findAll(filterDto);
  }
}
