import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataTestUtils } from '../../test/utils/data-test.utils';
import { TestUtils } from '../../test/utils/test-utils';
import { StatusCodes } from 'http-status-codes';

describe('NotificationController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    app = await TestUtils.getTestApp();
    await DataTestUtils.seedData(app);
  });

  afterAll(async () => {
    await DataTestUtils.clearData(app);
    await TestUtils.closeApp(app);
  });

  describe('POST /auth/login', () => {
    it('should grant user authorization', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'mateo@example.com', password: 'password' })
        .expect(StatusCodes.CREATED);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body.data.user).toBeInstanceOf(Object);
      expect(response.body.data.meta).toBeInstanceOf(Object);
      expect(response.body.data.meta.access_token).toBeDefined();
      expect(response.body.success).toBe(true);
      accessToken = response.body.data.meta.access_token;
    });
  });

  describe('POST /notifications/event-emit', () => {
    it('should emit the notification event', async () => {
      const response = await request(app.getHttpServer())
        .post('/notifications/event-emit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          event_type: 'invoice.created',
          title: 'New Invoice Created (#{invoiceId})',
          body: 'Your invoice #{invoiceId} has been created. The amount is #{amount}',
          channel: 'in_app',
          metadata: {
            invoiceId: '812345',
            amount: 5000,
          },
        })
        .expect(StatusCodes.CREATED);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body.success).toBe(true);
      expect(response.body.statusCode).toBe(StatusCodes.OK);
      expect(response.body.message).toBeDefined();
      expect(response.body.message).toBe(
        'Notification successfully queued for processing',
      );
    });
  });

  describe('GET /notifications/in-app', () => {
    it('should get in-app notifications', async () => {
      const response = await request(app.getHttpServer())
        .get('/notifications/in-app')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(StatusCodes.OK);
      expect(response.body.success).toBe(true);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body.message).toBe('Notification successfully retrieved');
      expect(response.body.data.notifications).toBeInstanceOf(Array);
      expect(response.body.data.meta).toBeInstanceOf(Object);
      expect(response.body.data.meta.total).toBeDefined();
      expect(response.body.data.meta.page).toBeDefined();
      expect(response.body.data.meta.lastPage).toBeDefined();
    });
  });

  describe('GET /notifications/admin', () => {
    it('should get admin notifications', async () => {
      const response = await request(app.getHttpServer())
        .get('/notifications/admin')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(StatusCodes.OK);
      expect(response.body.success).toBe(true);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body.message).toBe('Notification successfully retrieved');
      expect(response.body.data.notifications).toBeInstanceOf(Array);
      expect(response.body.data.meta).toBeInstanceOf(Object);
      expect(response.body.data.meta.total).toBeDefined();
      expect(response.body.data.meta.page).toBeDefined();
      expect(response.body.data.meta.lastPage).toBeDefined();
    });
  });
});
