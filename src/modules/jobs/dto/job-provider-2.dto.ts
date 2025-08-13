import {
  IsString,
  IsObject,
  IsBoolean,
  IsNumber,
  IsArray,
  IsISO8601,
  ValidateNested,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsBoolean()
  remote: boolean;
}

class CompensationDto {
  @IsNumber()
  min: number;

  @IsNumber()
  max: number;

  @IsString()
  currency: string;
}

class EmployerDto {
  @IsString()
  companyName: string;

  @IsUrl()
  website: string;
}

class RequirementsDto {
  @IsNumber()
  experience: number;

  @IsArray()
  @IsString({ each: true })
  technologies: string[];
}

export class JobProvider2Dto {
  @IsString()
  externalId: string;

  @IsString()
  position: string;

  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CompensationDto)
  compensation: CompensationDto;

  @IsObject()
  @ValidateNested()
  @Type(() => EmployerDto)
  employer: EmployerDto;

  @IsObject()
  @ValidateNested()
  @Type(() => RequirementsDto)
  requirements: RequirementsDto;

  @IsISO8601()
  datePosted: string;
}
