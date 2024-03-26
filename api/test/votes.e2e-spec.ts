import { INestApplication } from '@nestjs/common';
import {
  prisma,
  resetDatabase,
  setupE2ETest,
  spyOnSendMail,
  user1,
  user2,
  user3,
} from './e2e-test-setup';
import request from 'supertest';
import { SymetricKey, SymetricService } from 'src/crypto/symetric.service';
import { AsymetricService } from 'src/crypto/asymetric.service';
import { SigningService } from 'src/crypto/signing.service';
import { FieldType } from '@prisma/client';

const adminSymetricKey: SymetricKey = {
  key: Buffer.from('ldVHs4Mkx3zcBLO4PZzfuu0e6/9grXvXR28cknuB/M0=', 'base64'),
  iv: Buffer.from('mDeB8inXj3Zy+i1q+bbv5A==', 'base64'),
};

const voterSymetricKey: SymetricKey = {
  key: Buffer.from('R4z/6dAVR0yw77y1C5Y4eSzD5L6JILkqNBVk8xRuxMA=', 'base64'),
  iv: Buffer.from('Vx5rWSKuJkWV9qSWmiM1XQ==', 'base64'),
};

// Create a voter for a started vote
// We don't create a voter for every test because this function is slow
async function createVoter(
  id: number,
  symetricService: SymetricService,
  asymetricService: AsymetricService,
) {
  const voterKeyPair = await asymetricService.newKeyPair();

  await prisma.securedFormUser.create({
    data: {
      id: id,
      voteId: '2',
      email: 'test@test.fr',
      firstName: 'testFirstName',
      lastName: 'testLastName',
      voted: false,
    },
  });

  await prisma.securedFormKey.create({
    data: {
      id: id,
      voteId: '2',
      cryptedPrivate: symetricService.encrypt(
        voterKeyPair.privateKey,
        voterSymetricKey,
      ),
      cryptedPublic: symetricService.encrypt(
        voterKeyPair.publicKey,
        adminSymetricKey,
      ),
      aesChecksum: symetricService.encrypt(id.toString(), voterSymetricKey),
    },
  });

  return voterKeyPair;
}

// Create a started vote witth 2 voters, one of them has already voted
async function createStartedVote() {
  const asymetricService = new AsymetricService();
  const symetricService = new SymetricService();
  const signingService = new SigningService();

  await prisma.form.create({
    data: {
      id: '2',
      login: user1.login,
      title: 'test',
      secured: true,
      active: true,
      editable: false,
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
    },
  });

  const adminKeyPair = await asymetricService.newKeyPair();

  await prisma.securedFormAdminCredentials.create({
    data: {
      voteId: '2',
      cryptedPrivateKey: symetricService.encrypt(
        adminKeyPair.privateKey,
        adminSymetricKey,
      ),
      publicKey: Buffer.from(adminKeyPair.publicKey),
    },
  });

  const voterKeyPair = await createVoter(1, symetricService, asymetricService);

  const data = JSON.stringify({ '1': '1234' });

  const encryptedData = asymetricService.encrypt(data, adminKeyPair.publicKey);

  const signature = signingService.sign(encryptedData, voterKeyPair.privateKey);

  await prisma.answer.create({
    data: {
      formId: '2',
      cryptedBy: 1,
      data: encryptedData,
      signature: signature,
    },
  });

  await prisma.securedFormUser.update({
    where: {
      id: 1,
    },
    data: {
      voted: true,
    },
  });

  await createVoter(2, symetricService, asymetricService);
}

describe('Votes', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await setupE2ETest();
  });

  beforeEach(async () => {
    /*
     * a unstarted vote (id=1) with a voter (id=3)
     * if createStartedVote is called, it will create a started vote (id=2) with 2 voters (id=1 and id=2)
     * id=1 has already voted
     * */

    await resetDatabase();

    const unstartedVote = {
      id: '1',
      login: user1.login,
      title: 'test',
      secured: true,
      active: false,
      editable: true,
    };

    await prisma.form.create({
      data: unstartedVote,
    });

    await prisma.securedFormUser.create({
      data: {
        id: 3,
        voteId: '1',
        email: 'test@example.fr',
        firstName: 'Emile',
        lastName: 'Jaffrain',
      },
    });
  });

  describe('/votes (POST)', () => {
    it('should create a form', async () => {
      const response = await request(app.getHttpServer())
        .post('/votes')
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          title: 'Vote sans titre',
          login: user1.login,
          active: false,
          editable: true,
        }),
      );
    });
  });

  describe('/votes/:id (GET', () => {
    beforeEach(createStartedVote);

    it('should not get a vote that does not exist', () => {
      return request(app.getHttpServer()).get('/votes/42').expect(404);
    });

    it('should not get a vote if the user has already voted', () => {
      return request(app.getHttpServer())
        .get('/votes/2')
        .set('x-user', user3.login)
        .query({
          key: voterSymetricKey.key.toString('base64'),
          iv: voterSymetricKey.iv.toString('base64'),
          id: '1',
          user: 1,
        })
        .expect(403);
    });

    it('should not get a vote if the user has not the key', () => {
      return request(app.getHttpServer())
        .get('/votes/2')
        .set('x-user', user3.login)
        .query({
          key: 'invalid key',
          iv: 'invalid iv',
          id: '2',
          user: 2,
        })
        .expect(403);
    });

    it('should not be able to change user', () => {
      return request(app.getHttpServer())
        .get('/votes/2')
        .set('x-user', user3.login)
        .query({
          key: voterSymetricKey.key.toString('base64'),
          iv: voterSymetricKey.iv.toString('base64'),
          id: '1',
          user: 42,
        })
        .expect(403);
    });

    it('should get a vote if the user has the key and has not voted', async () => {
      const response = await request(app.getHttpServer())
        .get('/votes/2')
        .set('x-user', user3.login)
        .query({
          key: voterSymetricKey.key.toString('base64'),
          iv: voterSymetricKey.iv.toString('base64'),
          id: '2',
          user: 2,
        })
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          title: 'test',
        }),
      );
    });
  });

  describe('/votes/:id/edit (GET)', () => {
    it('should not get a vote that does not exist', () => {
      return request(app.getHttpServer()).get('/votes/42/edit').expect(404);
    });

    it('should get a vote if the user is the owner', async () => {
      const response = await request(app.getHttpServer())
        .get('/votes/1/edit')
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          title: 'test',
          login: user1.login,
          active: false,
          editable: true,
        }),
      );
    });

    it('should not get a form if the user is not the owner ', () => {
      return request(app.getHttpServer())
        .get('/votes/1/edit')
        .set('x-user', user3.login)
        .expect(403);
    });
  });

  describe('/votes/:id/edit (PATCH)', () => {
    const updateVoteDto = {
      title: 'updated test',
      active: true,
    };

    it('should not update a form that does not exist', () => {
      return request(app.getHttpServer())
        .patch('/votes/42/edit')
        .send(updateVoteDto)
        .expect(404);
    });

    it('should not update a form if the user is not the owner', () => {
      return request(app.getHttpServer())
        .patch('/votes/1/edit')
        .set('x-user', user2.login)
        .send(updateVoteDto)
        .expect(403);
    });

    it('should not update a running form', async () => {
      await createStartedVote();

      return request(app.getHttpServer())
        .patch('/votes/2/edit')
        .send(updateVoteDto)
        .expect(403);
    });

    it('should update a form', async () => {
      await request(app.getHttpServer())
        .patch('/votes/1/edit')
        .send(updateVoteDto)
        .expect(200);

      const response = await request(app.getHttpServer())
        .get('/votes/1/edit')
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          title: 'updated test',
        }),
      );
    });
  });

  describe('/votes/:id/edit (DELETE)', () => {
    it('should not delete a form if the user is not the owner', () => {
      return request(app.getHttpServer())
        .delete('/votes/1/edit')
        .set('x-user', user2.login)
        .expect(403);
    });

    it('should delete a form if the user is the owner', async () => {
      await request(app.getHttpServer()).delete('/votes/1/edit').expect(200);

      return request(app.getHttpServer()).get('/votes/1/edit').expect(404);
    });
  });

  describe('/votes/:id/voters (GET)', () => {
    it('should not get voters if the user is not the owner', () => {
      return request(app.getHttpServer())
        .get('/votes/1/voters')
        .set('x-user', user2.login)
        .expect(403);
    });

    it('should get voters if the user is the owner', async () => {
      const response = await request(app.getHttpServer())
        .get('/votes/1/voters')
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 3,
            voted: false,
          }),
        ]),
      );
    });

    it('should get voters of a running vote', async () => {
      await createStartedVote();

      const response = await request(app.getHttpServer())
        .get('/votes/2/voters')
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            voted: true,
          }),
          expect.objectContaining({
            id: 2,
            voted: false,
          }),
        ]),
      );
    });
  });

  describe('/votes/:id/voters (POST)', () => {
    it('should not create a voter if the user is not the owner', () => {
      return request(app.getHttpServer())
        .post('/votes/1/voters')
        .set('x-user', user2.login)
        .expect(403);
    });

    it('should not create a voter if the vote is already started', async () => {
      await createStartedVote();

      return await request(app.getHttpServer())
        .post('/votes/2/voters')
        .expect(403);
    });

    it('should create a voter if the user is the owner', () => {
      return request(app.getHttpServer()).post('/votes/1/voters').expect(201);
    });
  });

  describe('/votes/:id/voters/:id (PATCH)', () => {
    it('should not update a voter if the user is not the owner', () => {
      return request(app.getHttpServer())
        .patch('/votes/1/voters/3')
        .set('x-user', user2.login)
        .send({
          email: 'hello@test.fr',
          firstName: 'hello',
          lastName: 'world',
        })
        .expect(403);
    });

    it('should not update a voter if the vote is already started', async () => {
      await createStartedVote();
      return await request(app.getHttpServer())
        .patch('/votes/2/voters/1')
        .send({
          email: 'world@test.fr',
          firstName: 'world',
          lastName: 'hello',
        });
    });

    it('should update a voter if the user is the owner', async () => {
      await request(app.getHttpServer())
        .patch('/votes/1/voters/3')
        .send({
          email: 'world@test.fr',
          firstName: 'world',
          lastName: 'hello',
        })
        .expect(200);

      const response = await request(app.getHttpServer())
        .get('/votes/1/voters')
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 3,
            email: 'world@test.fr',
            firstName: 'world',
            lastName: 'hello',
          }),
        ]),
      );
    });
  });

  describe('/votes/:id/voters/:id (DELETE)', () => {
    it('should not delete a voter if the user is not the owner', () => {
      return request(app.getHttpServer())
        .delete('/votes/1/voters/3')
        .set('x-user', user2.login)
        .expect(403);
    });

    it('should not delete a voter if the vote is already started', async () => {
      await createStartedVote();
      return await request(app.getHttpServer())
        .delete('/votes/2/voters/1')
        .expect(403);
    });

    it('should delete a voter if the user is the owner', async () => {
      await request(app.getHttpServer())
        .delete('/votes/1/voters/3')
        .expect(200);

      const response = await request(app.getHttpServer())
        .get('/votes/1/voters')
        .expect(200);

      expect(response.body).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 3,
          }),
        ]),
      );
    });
  });

  describe('/votes/:id/start (POST)', () => {
    it('should not start a vote if the user is not the owner', () => {
      return request(app.getHttpServer())
        .post('/votes/1/start')
        .set('x-user', user2.login)
        .expect(403);
    });

    it('should start a vote if the user is the owner', async () => {
      spyOnSendMail((mail) => {
        if (mail.to == user1.email) {
          expect(mail.options).toEqual(
            expect.objectContaining({
              title: 'test',
              url: expect.stringContaining('votes/1/admin'),
            }),
          );
        } else {
          expect(mail.options).toEqual(
            expect.objectContaining({
              title: 'test',
              url: expect.stringContaining('votes/1?'),
            }),
          );
        }
      });

      await request(app.getHttpServer()).post('/votes/1/start').expect(200);
    });
  });

  describe('/votes/:id/stop (POST)', () => {
    it('should not stop a vote if the user is not the owner', () => {
      return request(app.getHttpServer())
        .post('/votes/1/stop')
        .set('x-user', user2.login)
        .expect(403);
    });

    it('shoud not stop a unstarted vote', () => {
      return request(app.getHttpServer()).post('/votes/1/stop').expect(403);
    });

    it('should stop a vote if the user is the owner', async () => {
      await createStartedVote();

      await request(app.getHttpServer()).post('/votes/2/stop').expect(200);
    });
  });

  describe('/votes/:id/answer (POST)', () => {
    beforeEach(createStartedVote);

    it('should not answer a not started vote', () => {
      return request(app.getHttpServer()).post('/votes/1/answer').expect(403);
    });

    it('should not answer a vote if the user has already voted', () => {
      return request(app.getHttpServer())
        .post('/votes/2/answer')
        .set('x-user', user3.login)
        .query({
          key: voterSymetricKey.key.toString('base64'),
          iv: voterSymetricKey.iv.toString('base64'),
          id: '1',
          user: 1,
        })
        .send({
          data: [{ fieldId: '1', data: 'test' }],
        })
        .expect(403);
    });

    it('should not anwer a vote if the user has not the key', () => {
      return request(app.getHttpServer())
        .post('/votes/2/answer')
        .set('x-user', user3.login)
        .query({
          key: 'invalid key',
          iv: 'invalid iv',
          id: '2',
          user: 2,
        })
        .send({
          data: [{ fieldId: '1', data: 'test' }],
        })
        .expect(403);
    });

    it('shoud not be able to change user', () => {
      return request(app.getHttpServer())
        .post('/votes/2/answer')
        .set('x-user', user3.login)
        .query({
          key: voterSymetricKey.key.toString('base64'),
          iv: voterSymetricKey.iv.toString('base64'),
          id: '2',
          user: 42,
        })
        .send({
          data: [{ fieldId: '1', data: 'test' }],
        })
        .expect(403);
    });

    it('should answer a vote if the user has the key and has not voted', async () => {
      await request(app.getHttpServer())
        .post('/votes/2/answer')
        .set('x-user', user3.login)
        .query({
          key: voterSymetricKey.key.toString('base64'),
          iv: voterSymetricKey.iv.toString('base64'),
          id: '2',
          user: 2,
        })
        .send({
          data: [{ fieldId: '1', data: 'bar' }],
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/votes/2/answers')
        .query({
          key: adminSymetricKey.key.toString('base64'),
          iv: adminSymetricKey.iv.toString('base64'),
        });

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            data: [{ fieldId: '1', data: 'bar' }],
          }),
        ]),
      );

      // check if the user has voted
      const voters = await request(app.getHttpServer()).get('/votes/2/voters');

      expect(voters.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 2,
            voted: true,
          }),
        ]),
      );
    });
  });

  describe('/votes/:id/answers (GET)', () => {
    beforeEach(createStartedVote);

    it('should not get answers if key is missing', () => {
      return request(app.getHttpServer())
        .get('/votes/2/answers')
        .set('x-user', user2.login)
        .expect(403);
    });

    it('should not get answers if key is invalid', () => {
      return request(app.getHttpServer())
        .get('/votes/2/answers')
        .query({
          key: 'invalid key',
          iv: 'invalid iv',
        })
        .expect(403);
    });

    it('should get answers if the user has the key', async () => {
      const response = await request(app.getHttpServer())
        .get('/votes/2/answers')
        .query({
          key: adminSymetricKey.key.toString('base64'),
          iv: adminSymetricKey.iv.toString('base64'),
        })
        .expect(200);

      expect(response.body).toEqual([
        expect.objectContaining({
          data: [{ fieldId: '1', data: '1234' }],
          signatureVerified: true,
        }),
      ]);
    });

    it('should detect signature errors', async () => {
      await prisma.answer.updateMany({
        where: {
          formId: '2',
        },
        data: {
          signature: Buffer.from('invalid signature'),
        },
      });

      const response = await request(app.getHttpServer())
        .get('/votes/2/answers')
        .query({
          key: adminSymetricKey.key.toString('base64'),
          iv: adminSymetricKey.iv.toString('base64'),
        })
        .expect(200);

      expect(response.body).toEqual([
        expect.objectContaining({
          data: [{ fieldId: '1', data: '1234' }],
          signatureVerified: false,
        }),
      ]);
    });
  });
});
