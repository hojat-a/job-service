import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  ValidateNested,
  MinLength,
  MaxLength,
  IsInt,
  Min,
  Max,
} from 'class-validator';

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
  @MinLength(3)
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({ example: 'New York', description: 'City' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ example: 'NY', description: 'State' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
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
  @Min(1, { message: 'Page must be at least 1' })
  @Max(1000, { message: 'Page cannot be greater than 1000' })
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Number of items per page' })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot be greater than 100' })
  limit?: number;
}
