import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { JobsRepository } from './jobs.repository';
import { Job } from './entities/job.entity';
import { ApiProvider2Service } from './integrations/api-provider-2/api-provider-2.service';
import { ApiProvider1Service } from './integrations/api-provider-1/api-provider-1.service';
import { ApiProvider2Mapper } from './integrations/api-provider-2/api-provider-2.mapper';
import { ApiProvider1Mapper } from './integrations/api-provider-1/api-provider-1.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Job]), HttpModule],
  controllers: [JobsController],
  providers: [
    JobsService,
    JobsRepository,
    ApiProvider1Service,
    ApiProvider2Service,
    ApiProvider1Mapper,
    ApiProvider2Mapper,
  ],
  exports: [],
})
export class JobsModule {}
