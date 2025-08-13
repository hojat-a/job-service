import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IJob } from '../interfaces/job.interface';

export class JobDto implements IJob {
  @ApiProperty({
    example: 'b7f9d1c2-1234-4a56-9abc-1234567890ab',
    description: 'Unique job identifier',
  })
  id: string;

  @ApiProperty({
    example: 'EXT-12345',
    description: 'External system job identifier',
  })
  externalId: string;

  @ApiProperty({
    example: 'Senior Backend Developer',
    description: 'Job title',
  })
  title: string;

  @ApiPropertyOptional({
    example: 'New York',
    description: 'City where the job is located',
  })
  city?: string | null;

  @ApiPropertyOptional({
    example: 'NY',
    description: 'State or province where the job is located',
  })
  state?: string | null;

  @ApiProperty({ example: true, description: 'Whether the job is remote' })
  remote: boolean;

  @ApiPropertyOptional({
    example: 'Full-time',
    description: 'Type of employment',
  })
  jobType?: string | null;

  @ApiPropertyOptional({ example: 60000, description: 'Minimum salary' })
  minSalary?: number | null;

  @ApiPropertyOptional({ example: 90000, description: 'Maximum salary' })
  maxSalary?: number | null;

  @ApiPropertyOptional({
    example: 'USD',
    description: 'Salary currency code (ISO 4217)',
  })
  currency?: string | null;

  @ApiProperty({
    example: 'Tech Solutions Inc.',
    description: 'Name of the hiring company',
  })
  companyName: string;

  @ApiPropertyOptional({
    example: 'Information Technology',
    description: 'Industry of the hiring company',
  })
  companyIndustry?: string | null;

  @ApiPropertyOptional({
    example: 5,
    description: 'Years of experience required',
  })
  experience?: number | null;

  @ApiPropertyOptional({
    example: ['Node.js', 'PostgreSQL', 'AWS'],
    description: 'List of required skills',
  })
  skills?: string[] | null;

  @ApiProperty({
    example: '2025-08-10T14:30:00.000Z',
    description: 'Date the job was posted',
  })
  @Type(() => Date)
  postedDate: Date;

  @ApiProperty({
    example: 'LinkedIn',
    description: 'Source from which the job was fetched',
  })
  source: string;

  @ApiProperty({
    example: '2025-08-13T12:00:00.000Z',
    description: 'Date when the job was created in the system',
  })
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    example: '2025-08-13T12:00:00.000Z',
    description: 'Date when the job was last updated',
  })
  @Type(() => Date)
  updatedAt: Date;

  @ApiPropertyOptional({
    example: { recruiter: 'John Doe' },
    description: 'Additional job metadata in key-value format',
  })
  metadata?: Record<string, any> | null;
}
