import request from 'supertest';
import {
  prisma,
  resetDatabase,
  setupE2ETest,
  user1,
  user2,
} from './e2e-test-setup';
import { INestApplication } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await resetDatabase();

    await prisma.form.create({
      data: {
        id: '1',
        title: 'test',
        access: 'ALL',
        login: user1.login,
        moderators: {
          create: {
            moderatorLogin: user2.login,
          },
        },
      },
    });

    app = await setupE2ETest();
  });

  describe('/ (GET)', () => {
    it('should find all owned forms', async () => {
      const response = await request(app.getHttpServer())
        .get('/')
        .set('x-user', user1.login)
        .expect(200);

      expect(response.body).toEqual([
        expect.objectContaining({
          id: '1',
          owner: null,
        }),
      ]);
    });

    it('should find all moderated forms', async () => {
      const response = await request(app.getHttpServer())
        .get('/')
        .set('x-user', user2.login)
        .expect(200);

      expect(response.body).toEqual([
        expect.objectContaining({
          id: '1',
          owner: user1.firstName + ' ' + user1.lastName,
        }),
      ]);
    });
  });
});
