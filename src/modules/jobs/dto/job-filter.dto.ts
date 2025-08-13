import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsString, ValidateNested } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

class SalaryFilter {
  @ApiPropertyOptional({ example: 107000, description: 'Maximum salary' })
  @IsOptional()
  @Type(() => Number) // Convert query param to number
  @IsInt()
  max?: number;

  @ApiPropertyOptional({ example: 79000, description: 'Minimum salary' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  min?: number;
}

export class JobFilterDto {
  @ApiPropertyOptional({
    example: 'Software Engineer',
    description: 'Job title',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'New York', description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'NY', description: 'State' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    example: { min: 79000, max: 107000 },
    description: 'Salary range',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SalaryFilter)
  salary?: SalaryFilter;

  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @IsInt()
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Number of items per page' })
  @IsOptional()
  @IsInt()
  limit?: number;
}
