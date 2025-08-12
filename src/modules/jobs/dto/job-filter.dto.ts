import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsString, ValidateNested } from 'class-validator';

class SalaryFilter {
  @IsOptional()
  @Type(() => Number) // Convert query param to number
  @IsInt()
  max?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  min?: number;
}

export class JobFilterDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SalaryFilter)
  salary?: SalaryFilter;

  @IsOptional()
  @IsInt()
  page?: number;

  @IsOptional()
  @IsInt()
  limit?: number;
}
