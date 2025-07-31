import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataTestUtils } from '../../test/utils/data-test.utils';
import { TestUtils } from '../../test/utils/test-utils';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await TestUtils.getTestApp();
    await DataTestUtils.seedData(app);
  });

  afterAll(async () => {
    await DataTestUtils.clearData(app);
    await TestUtils.closeApp(app);
  });

  describe('POST /auth/login', () => {
    it('should return all users', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'mateo@example.com', password: 'password' })
        .expect(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body.data.user).toBeInstanceOf(Object);
      expect(response.body.data.meta).toBeInstanceOf(Object);
      expect(response.body.data.meta.access_token).toBeDefined();
      expect(response.body.success).toBe(true);
    });
  });
});
