import { INestApplication } from '@nestjs/common';
import {
  prisma,
  resetDatabase,
  setupE2ETest,
  user1,
  user2,
  user3,
} from './e2e-test-setup';
import { AccessType } from 'src/access/access';
import request from 'supertest';
import { FieldType } from '@prisma/client';

describe('Paps', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await setupE2ETest();
  });

  beforeEach(async () => {
    await resetDatabase();

    // we create some sample data :
    // a form with id 1 that has started (the owner is user1)
    // a form with id 2 that hasn't started
    // a answer of the form (the author is user3)
    // a moderator of the form (the moderator is user2)

    const pastStart = new Date();
    pastStart.setTime(Date.now() - 42 * 60 * 60 * 1000); // pastStart is 42 hours is the past from now

    const paps = {
      id: '1',
      login: user1.login,
      title: 'test',
      access: AccessType.CS,
      active: true,
      paps: true,
      papsStart: pastStart,
      papsChoices: {
        createMany: {
          data: [
            {
              id: 1,
              name: 'test-paps1',
              size: 42,
            },
          ],
        },
      },
      fields: {
        create: [
          {
            id: '1',
            type: FieldType.longq,
            required: false,
            index: 0,
          },
        ],
      },
    };

    await prisma.form.create({
      data: paps,
    });

    const futureStart = new Date();
    futureStart.setTime(Date.now() + 42 * 60 * 60 * 1000); // futureStart is 42 hours is the future from now

    await prisma.form.create({
      data: {
        ...paps,
        id: '2',
        papsStart: futureStart,
        papsChoices: {
          createMany: {
            data: [
              {
                id: 2,
                name: 'test-paps1',
                size: 42,
              },
            ],
          },
        },
      },
    });

    await prisma.answer.create({
      data: {
        data: JSON.stringify({ '1': '1234' }),
        by: user3.login,
        formId: '1',
        papsChoiceId: 1,
      },
    });

    await prisma.moderator.create({
      data: {
        formId: '1',
        moderatorLogin: user2.login,
      },
    });
  });

  describe('/paps (POST)', () => {
    it('should create a form', async () => {
      const response = await request(app.getHttpServer())
        .post('/paps')
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          title: 'PAPS sans titre',
          login: user1.login,
          access: AccessType.CS,
          active: true,
        }),
      );
    });
  });

  describe('/paps/:id (GET', () => {
    it('should not get a form that does not exist', () => {
      return request(app.getHttpServer()).get('/paps/42').expect(404);
    });

    it('should get a form', async () => {
      const response = await request(app.getHttpServer())
        .get('/paps/1')
        .set('x-user', user2.login)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          title: 'test',
          login: user1.login,
          access: AccessType.CS,
          active: true,
          choices: [
            expect.objectContaining({
              id: 1,
            }),
          ],
        }),
      );
    });
  });

  describe('/paps/:id/edit (GET)', () => {
    it('should not get a form that does not exist', () => {
      return request(app.getHttpServer()).get('/paps/42/edit').expect(404);
    });

    it('should get a form if the user is the owner', async () => {
      const response = await request(app.getHttpServer())
        .get('/paps/1/edit')
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          title: 'test',
          login: user1.login,
          access: AccessType.CS,
          choices: [
            expect.objectContaining({
              id: 1,
            }),
          ],
        }),
      );
    });

    it('should not get a form if the user is not the owner / moderator', () => {
      return request(app.getHttpServer())
        .get('/paps/1/edit')
        .set('x-user', user3.login)
        .expect(403);
    });
  });

  describe('/paps/:id/edit (PATCH)', () => {
    const updateFormDto = {
      title: 'updated test',
      access: AccessType.CS,
      active: true,
    };

    it('should not update a form that does not exist', () => {
      return request(app.getHttpServer())
        .patch('/paps/42/edit')
        .send(updateFormDto)
        .expect(404);
    });

    it('should not update a form if the user is not the owner', () => {
      return request(app.getHttpServer())
        .patch('/paps/1/edit')
        .set('x-user', user2.login)
        .send(updateFormDto)
        .expect(403);
    });

    it('should update a form', async () => {
      await request(app.getHttpServer())
        .patch('/paps/1/edit')
        .send(updateFormDto)
        .expect(200);

      const response = await request(app.getHttpServer())
        .get('/paps/1/edit')
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          title: 'updated test',
        }),
      );
    });
  });

  describe('/paps/:id/edit (DELETE)', () => {
    it('should not delete a form if the user is not the owner', () => {
      return request(app.getHttpServer())
        .delete('/paps/1/edit')
        .set('x-user', user2.login)
        .expect(403);
    });

    it('should delete a form if the user is the owner', async () => {
      await request(app.getHttpServer()).delete('/paps/1/edit').expect(200);

      return request(app.getHttpServer()).get('/paps/1/edit').expect(404);
    });
  });

  describe('/paps/:id/answers (GET)', () => {
    it('should not get answers for a form that does not exist', () => {
      return request(app.getHttpServer()).get('/paps/42/answers').expect(404);
    });

    it('should not get answers for a form if the user is not the owner / moderator', () => {
      return request(app.getHttpServer())
        .get('/paps/1/answers')
        .set('x-user', user3.login)
        .expect(403);
    });

    it('should get answers for a form if the user is the owner', async () => {
      const response = await request(app.getHttpServer())
        .get('/paps/1/answers')
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            data: [{ fieldId: '1', data: '1234' }],
            by: user3.login,
          }),
        ]),
      );
    });

    it('should get answers for a form if the user is a moderator', () => {
      return request(app.getHttpServer())
        .get('/paps/1/answers')
        .set('x-user', user2.login)
        .expect(200);
    });
  });

  describe('/paps/:id/answer (POST)', () => {
    const createPapsAnswerDto = {
      data: [{ fieldId: '1', data: 'bar' }],
      choiceId: 1,
    };
    it('should not create an answer for a form that does not exist', () => {
      return request(app.getHttpServer())
        .post('/paps/42/answer')
        .send(createPapsAnswerDto)
        .expect(404);
    });

    it('should create an answer for a paps', async () => {
      await request(app.getHttpServer())
        .post('/paps/1/answer')
        .send(createPapsAnswerDto)
        .expect(201);

      const response = await request(app.getHttpServer()).get(
        '/paps/1/answers',
      );

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            data: [{ fieldId: '1', data: 'bar' }],
          }),
        ]),
      );
    });

    it('should not let the user answer twice a paps', async () => {
      await request(app.getHttpServer())
        .post('/paps/1/answer')
        .set('x-user', user3.login) // user3 has already answer the form once in beforeEach
        .send(createPapsAnswerDto)
        .expect(403);
    });

    it("shoud not let the user answer a paps that hasn't started", () => {
      return request(app.getHttpServer())
        .post('/paps/2/answer')
        .send(createPapsAnswerDto)
        .expect(403);
    });
  });

  describe('/paps/:id/answer (GET)', () => {
    it('should not get the position for a form that does not exist', () => {
      return request(app.getHttpServer()).get('/paps/42/answer').expect(404);
    });

    it('should get the position in paps for a form if the user has answered it', async () => {
      const response = await request(app.getHttpServer())
        .get('/paps/1/answer')
        .set('x-user', user3.login)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          position: 0, // user3 is the first to answer
        }),
      );
    });

    it('should get null for the position of a form if the user has not answered it', () => {
      return request(app.getHttpServer())
        .get('/paps/1/answer')
        .set('x-user', user1.login)
        .expect(200)
        .expect('null');
    });
  });

  describe('/paps/:id/answer (DELETE)', () => {
    it('should not delete a answer of a form that does not exist', () => {
      return request(app.getHttpServer()).delete('/paps/42/answer').expect(404);
    });

    it('should not delete an answer if the user has not answer it', () => {
      return request(app.getHttpServer()).delete('/paps/1/answer').expect(404);
    });

    it('should delete an answer if the user has answer it', async () => {
      await request(app.getHttpServer())
        .delete('/paps/1/answer')
        .set('x-user', user3.login)
        .expect(200);

      // the user should have depaps
      return request(app.getHttpServer())
        .get('/paps/1/answer')
        .set('x-user', user3.login)
        .expect(200)
        .expect('null');
    });
  });
});
