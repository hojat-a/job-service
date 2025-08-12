import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Job } from '../modules/jobs/entities/job.entity';
import { SnakeNamingStrategy } from './snake-naming.strategy';
// Load .env file
config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST', 'localhost'),
  port: configService.get('POSTGRES_PORT', 5432),
  username: configService.get('POSTGRES_USER', 'postgres'),
  password: configService.get('POSTGRES_PASSWORD', 'postgres'),
  database: configService.get('POSTGRES_DB', 'jobdb'),
  entities: [Job],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: configService.get('NODE_ENV', 'development') === 'development',
  namingStrategy: new SnakeNamingStrategy(),
});