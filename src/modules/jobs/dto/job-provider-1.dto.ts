import { IsString, IsObject, IsArray, IsISO8601, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DetailsDto {
  @IsString()
  location: string;

  @IsString()
  type: string;

  @IsString()
  salaryRange: string;
}

class CompanyDto {
  @IsString()
  name: string;

  @IsString()
  industry: string;
}

export class JobProvider1Dto {
  @IsString()
  jobId: string;

  @IsString()
  title: string;

  @IsObject()
  @ValidateNested()
  @Type(() => DetailsDto)
  details: DetailsDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CompanyDto)
  company: CompanyDto;

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsISO8601()
  postedDate: string;
}
