import {
  INestApplication,
  ExecutionContext,
  ValidationPipe,
} from '@nestjs/common';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { PersonType, User } from 'src/auth/entities/user.entity';
import { PrismaClient } from '@prisma/client';
import { MailingService } from 'src/mailing/mailing.service';
import { LinkCSService } from 'src/viarezo/linkcs.service';

export const prisma = new PrismaClient();

export const user1: User = {
  login: 'test1',
  email: 'test1@test.fr',
  firstName: 'test',
  lastName: 'test',
  accessToken: 'test',
  promo: 42,
  personType: PersonType.STUDENT_CENTRALESUPELEC,
  id: 69,
};

export const user2: User = {
  ...user1,
  login: 'test2',
  email: 'test2@test.fr',
};

export const user3: User = {
  ...user1,
  login: 'test3',
  email: 'test3@test.fr',
};

const users = [user1, user2, user3];

const mockMailingService = {
  templates: {
    votesAdmin: {
      html: jest.fn(),
      text: jest.fn(),
    },
    votesVoter: {
      html: jest.fn(),
      text: jest.fn(),
    },
    accessLink: {
      html: jest.fn(),
      text: jest.fn(),
    },
  },
  sendMail: jest.fn(),
};

const mockLinkcsService = {
  getUsersByLogin: jest.fn((logins: string[]) =>
    logins.map((login) => users.find((u) => u.login === login)),
  ),
};

export async function setupE2ETest(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(MailingService)
    .useValue(mockMailingService)
    .overrideProvider(LinkCSService)
    .useValue(mockLinkcsService)
    .overrideProvider(AuthGuard)
    .useValue({
      canActivate: (context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();

        const userLogin = req.headers['x-user'] as string;

        const user = users.find((u) => u.login === userLogin) || user1;

        req.user = user;

        return true;
      },
    })
    .compile();

  const app = moduleFixture.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter(),
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  return app;
}

export async function resetDatabase() {
  await prisma.form.deleteMany();
}

export async function spyOnSendMail(
  onMail: (mail: { to: string; options: any }) => void,
) {
  jest
    .spyOn(mockMailingService, 'sendMail')
    .mockImplementation(async (template, to, subject, options) => {
      onMail({ to, options });
    });
  //spyOnMailFunction = onMail;
}
