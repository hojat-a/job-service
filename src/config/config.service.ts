import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get<T>(key: string, defaultValue?: T): T | undefined {
    const value = this.configService.get<T>(key);
    return value !== undefined ? value : defaultValue;
  }
}
