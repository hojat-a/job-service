import { ApiProperty } from '@nestjs/swagger';
import { JobDto } from './job.dto';
import { ISuccessResponse } from '../interfaces/success-response-interface';
import { IJob } from '../interfaces/job.interface';

export class SuccessResponseDto implements ISuccessResponse {
  @ApiProperty({ type: [JobDto] })
  data: IJob[];

  @ApiProperty({ example: 42 })
  total: number;
}
