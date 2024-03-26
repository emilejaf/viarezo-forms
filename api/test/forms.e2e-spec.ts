import { INestApplication } from '@nestjs/common';
import {
  prisma,
  resetDatabase,
  setupE2ETest,
  user1,
  user2,
  user3,
} from './e2e-test-setup';
import request from 'supertest';
import { AccessType } from 'src/access/access';
import { FieldType } from '@prisma/client';

describe('Forms', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await setupE2ETest();
  });

  beforeEach(async () => {
    await resetDatabase();

    /*
    we create some sample data :
    a form (the owner is user1)
      a answer of the form (the author is user3)
      a moderator of the form (the moderator is user2)

    a inactive form

    a anonym form

    a unique answerable form
      a answer of the unique answerable form (the author is user3)

    */

    const form = {
      id: '1',
      login: user1.login,
      title: 'test',
      access: AccessType.ALL,
      active: true,
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
      data: form,
    });

    await prisma.answer.create({
      data: {
        data: JSON.stringify({ '1': '1234' }),
        by: user3.login,
        formId: '1',
      },
    });

    await prisma.moderator.create({
      data: {
        formId: '1',
        moderatorLogin: user2.login,
      },
    });

    await prisma.form.create({
      data: {
        ...form,
        id: 'inactive',
        active: false,
      },
    });

    await prisma.form.create({
      data: {
        ...form,
        id: 'anonym',
        anonym: true,
      },
    });

    await prisma.form.create({
      data: {
        ...form,
        id: 'uniqueAnswer',
        uniqueAnswer: true,
      },
    });

    await prisma.answer.create({
      data: {
        data: JSON.stringify({ '1': '1234' }),
        by: user3.login,
        formId: 'uniqueAnswer',
      },
    });
  });

  describe('/forms (POST)', () => {
    it('should create a form', async () => {
      const response = await request(app.getHttpServer())
        .post('/forms')
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          title: 'Formulaire sans titre',
          login: user1.login,
          access: AccessType.ALL,
          anonym: false,
          uniqueAnswer: false,
          active: true,
        }),
      );
    });
  });

  describe('/forms/:id (GET', () => {
    it('should not get a form that does not exist', () => {
      return request(app.getHttpServer()).get('/forms/42').expect(404);
    });

    it('should get a active form', async () => {
      const response = await request(app.getHttpServer())
        .get('/forms/1')
        .set('x-user', user2.login)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          title: 'test',
          login: user1.login,
          access: AccessType.ALL,
          anonym: false,
          uniqueAnswer: false,
          active: true,
        }),
      );
    });

    it('should not get a inactive form', () => {
      return request(app.getHttpServer())
        .get('/forms/inactive')
        .set('x-user', user2.login)
        .expect(403);
    });

    it('should not get a unique answerable form that the user has already answered', () => {
      return request(app.getHttpServer())
        .get('/forms/uniqueAnswer')
        .set('x-user', user3.login)
        .expect(403);
    });
  });

  describe('/forms/:id/edit (GET)', () => {
    it('should not get a form that does not exist', () => {
      return request(app.getHttpServer()).get('/forms/42/edit').expect(404);
    });

    it('should get a form if the user is the owner', async () => {
      const response = await request(app.getHttpServer())
        .get('/forms/1/edit')
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          title: 'test',
          login: user1.login,
          access: AccessType.ALL,
          anonym: false,
          uniqueAnswer: false,
          active: true,
        }),
      );
    });

    it('should not get a form if the user is not the owner / moderator', () => {
      return request(app.getHttpServer())
        .get('/forms/1/edit')
        .set('x-user', user3.login)
        .expect(403);
    });
  });

  describe('/forms/:id/edit (PATCH)', () => {
    const updateFormDto = {
      title: 'updated test',
      access: AccessType.ALL,
      anonym: false,
      uniqueAnswer: false,
      active: true,
    };

    it('should not update a form that does not exist', () => {
      return request(app.getHttpServer())
        .patch('/forms/42/edit')
        .send(updateFormDto)
        .expect(404);
    });

    it('should not update a form if the user is not the owner', () => {
      return request(app.getHttpServer())
        .patch('/forms/1/edit')
        .set('x-user', user2.login)
        .send(updateFormDto)
        .expect(403);
    });

    it('should update a form', async () => {
      await request(app.getHttpServer())
        .patch('/forms/1/edit')
        .send(updateFormDto)
        .expect(200);

      const response = await request(app.getHttpServer())
        .get('/forms/1/edit')
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          title: 'updated test',
        }),
      );
    });
  });

  describe('/forms/:id/edit (DELETE)', () => {
    it('should not delete a form if the user is not the owner', () => {
      return request(app.getHttpServer())
        .delete('/forms/1/edit')
        .set('x-user', user2.login)
        .expect(403);
    });

    it('should delete a form if the user is the owner', async () => {
      await request(app.getHttpServer()).delete('/forms/1/edit').expect(200);

      return request(app.getHttpServer()).get('/forms/1/edit').expect(404);
    });
  });

  describe('/forms/:id/answers (GET)', () => {
    it('should not get answers for a form that does not exist', () => {
      return request(app.getHttpServer()).get('/forms/42/answers').expect(404);
    });

    it('should not get answers for a form if the user is not the owner / moderator', () => {
      return request(app.getHttpServer())
        .get('/forms/1/answers')
        .set('x-user', user3.login)
        .expect(403);
    });

    it('should get answers for a form if the user is the owner', async () => {
      const response = await request(app.getHttpServer())
        .get('/forms/1/answers')
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
        .get('/forms/1/answers')
        .set('x-user', user2.login)
        .expect(200);
    });
  });

  describe('/forms/:id/answer (POST)', () => {
    const createFormAnswerDto = {
      data: [{ fieldId: '1', data: 'bar' }],
    };
    it('should not create an answer for a form that does not exist', () => {
      return request(app.getHttpServer())
        .post('/forms/42/answer')
        .send(createFormAnswerDto)
        .expect(404);
    });

    it('should create an answer for a form', async () => {
      await request(app.getHttpServer())
        .post('/forms/1/answer')
        .send(createFormAnswerDto)
        .expect(201);

      const response = await request(app.getHttpServer()).get(
        '/forms/1/answers',
      );

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            data: [{ fieldId: '1', data: 'bar' }],
          }),
        ]),
      );
    });

    it('should not answer an inactive form', () => {
      return request(app.getHttpServer())
        .post('/forms/inactive/answer')
        .send(createFormAnswerDto)
        .expect(403);
    });

    it('should not answer a unique answerable form if the user has already answered', () => {
      return request(app.getHttpServer())
        .post('/forms/uniqueAnswer/answer')
        .set('x-user', user3.login)
        .send(createFormAnswerDto)
        .expect(403);
    });

    it('should answer anonymously a anonym form', async () => {
      await request(app.getHttpServer())
        .post('/forms/anonym/answer')
        .send(createFormAnswerDto)
        .set('x-user', user3.login)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/forms/anonym/answers')
        .expect(200);

      expect(response.body).toEqual([
        expect.objectContaining({
          by: 'Anonyme',
        }),
      ]);
    });
  });
});
