import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('JobsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/job-offers (GET)', () => {
    it('should return job offers with correct structure', async () => {
      const query = {
        title: 'Developer',
        city: 'New York',
      };

      const response = await request(app.getHttpServer())
        .get('/job-offers')
        .query(query)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');

      // Data array checks
      expect(Array.isArray(response.body?.data)).toBe(true);
      if (response.body?.data.length > 0) {
        const job = response.body?.data[0];
        expect(job).toHaveProperty('id');
        expect(job).toHaveProperty('title');
        expect(job).toHaveProperty('companyName');
        expect(job).toHaveProperty('remote');
        expect(job).toHaveProperty('postedDate');
      }
    });

    it('should return 400 for invalid query params', async () => {
      const invalidQuery = {
        page: 'abc', // should be number
      };

      const response = await request(app.getHttpServer())
        .get('/job-offers')
        .query(invalidQuery)
        .expect(400);

      expect(response.body?.message).toEqual(
        expect.arrayContaining(['page must be an integer number']),
      );
    });
  });
});
