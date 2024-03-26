import { Test } from '@nestjs/testing';
import { AccessService } from './access.service';
import { LinkCSService } from 'src/viarezo/linkcs.service';
import { CotizService } from 'src/viarezo/cotiz.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { SymetricService } from 'src/crypto/symetric.service';
import { PapsService } from 'src/paps/paps.service';
import { FormsService } from 'src/forms/forms.service';
import { MailingService } from 'src/mailing/mailing.service';
import { PersonType, User } from 'src/auth/entities/user.entity';
import {
  AnswerableForm,
  FormType,
} from 'src/abstract-forms/entities/form.entity';
import { AccessType } from './access';
import { UnauthorizedException } from '@nestjs/common';

describe('AccessService', () => {
  let accessService: AccessService;

  let prismaService: DeepMockProxy<PrismaService>;
  let mailingService: DeepMockProxy<MailingService>;

  const user: User = {
    id: 1,
    email: 'test@test.fr',
    firstName: 'test',
    lastName: 'test',
    promo: 2021,
    personType: PersonType.STUDENT_CENTRALESUPELEC,
    login: 'user',
    accessToken: 'token',
  };

  const form = {
    id: '1',
    access: 'ALL',
    accessMeta: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    type: 'NONE' as FormType, // we want to test only access
    active: true,
    login: 'test',
    title: 'test',
    toAnswerableForm: () => ({}) as AnswerableForm,
  };

  beforeEach(async () => {
    const linkcsService = {
      getUserAssos: jest.fn(async () => [{ id: 1 }]),
    };

    const cotizService = {
      getCotizAssosForLogin: jest.fn(async () => [{ id: 1 }]),
    };

    prismaService = mockDeep<PrismaService>();
    mailingService = mockDeep<MailingService>();

    // we will not use them
    const symetricService = {};
    const papsService = {};
    const formsService = {};

    const moduleRef = await Test.createTestingModule({
      providers: [
        AccessService,
        {
          provide: LinkCSService,
          useValue: linkcsService,
        },
        {
          provide: CotizService,
          useValue: cotizService,
        },
        {
          provide: PrismaService,
          useValue: prismaService,
        },
        {
          provide: MailingService,
          useValue: mailingService,
        },
        {
          provide: SymetricService,
          useValue: symetricService,
        },
        {
          provide: FormsService,
          useValue: formsService,
        },
        {
          provide: PapsService,
          useValue: papsService,
        },
      ],
    }).compile();

    accessService = moduleRef.get<AccessService>(AccessService);
  });

  it('should be defined', () => {
    expect(accessService).toBeDefined();
  });

  describe('ADVANCED access', () => {
    it('should return false if all of OU is false', async () => {
      form.access = AccessType.ADVANCED;
      form.accessMeta = 'OU(NOT(ALL), NOT(ALL))';
      const isAuthorized = await accessService.authorize(form, { user });

      expect(isAuthorized).toBeFalsy();
    });

    it('should return true if one of OU is true', async () => {
      form.access = AccessType.ADVANCED;
      form.accessMeta = 'OU(ALL, NOT(ALL))';
      const isAuthorized = await accessService.authorize(form, { user });

      expect(isAuthorized).toBeTruthy();
    });

    it('should return false if one of ET is false', async () => {
      form.access = AccessType.ADVANCED;
      form.accessMeta = 'ET(ALL, NOT(ALL))';
      const isAuthorized = await accessService.authorize(form, { user });

      expect(isAuthorized).toBeFalsy();
    });

    it('should return true if all of ET is true', async () => {
      form.access = AccessType.ADVANCED;
      form.accessMeta = 'ET(ALL, ALL)';
      const isAuthorized = await accessService.authorize(form, { user });

      expect(isAuthorized).toBeTruthy();
    });

    it('should return false if NOT is true', async () => {
      form.access = AccessType.ADVANCED;
      form.accessMeta = 'NOT(ALL)';
      const isAuthorized = await accessService.authorize(form, { user });

      expect(isAuthorized).toBeFalsy();
    });

    it('should return false if ! is used', async () => {
      form.access = AccessType.ADVANCED;

      form.accessMeta = '!ALL';
      const isAuthorized = await accessService.authorize(form, { user });

      expect(isAuthorized).toBeFalsy();
    });

    it('should parse arguments correctly', async () => {
      form.access = AccessType.ADVANCED;
      form.accessMeta = 'PROMO[2021]';
      const isAuthorized = await accessService.authorize(form, { user });

      expect(isAuthorized).toBeTruthy();
    });
  });

  describe('ALL access', () => {
    it('should return true', async () => {
      form.access = AccessType.ALL;

      const isAuthorized = await accessService.authorize(form, {});

      expect(isAuthorized).toBeTruthy();
    });
  });

  describe('ASSO access', () => {
    it('should need authentication', async () => {
      form.access = AccessType.ASSO;

      const isAuthorized = await accessService.authorize(form, {});

      expect(isAuthorized).toBeFalsy();
    });

    it('should return false if user is not in the asso', async () => {
      form.access = AccessType.ASSO;
      form.accessMeta = '2';
      const isAuthorized = await accessService.authorize(form, { user });

      expect(isAuthorized).toBeFalsy();
    });

    it('should return true', async () => {
      form.access = AccessType.ASSO;
      form.accessMeta = '1';
      const isAuthorized = await accessService.authorize(form, { user });

      expect(isAuthorized).toBeTruthy();
    });
  });

  describe('COTIZ access', () => {
    it('should need authentication', async () => {
      form.access = AccessType.COTIZ;

      const isAuthorized = await accessService.authorize(form, {});

      expect(isAuthorized).toBeFalsy();
    });

    it('should return false if user is not in the cotiz', async () => {
      form.access = AccessType.COTIZ;
      form.accessMeta = '2';
      const isAuthorized = await accessService.authorize(form, { user });

      expect(isAuthorized).toBeFalsy();
    });

    it('should return true', async () => {
      form.access = AccessType.COTIZ;
      form.accessMeta = '1';
      const isAuthorized = await accessService.authorize(form, { user });

      expect(isAuthorized).toBeTruthy();
    });
  });

  describe('CS access', () => {
    it('should need authentication', async () => {
      form.access = AccessType.CS;

      const isAuthorized = await accessService.authorize(form, {});

      expect(isAuthorized).toBeFalsy();
    });

    it('should return true', async () => {
      form.access = AccessType.CS;
      const isAuthorized = await accessService.authorize(form, { user });

      expect(isAuthorized).toBeTruthy();
    });
  });

  describe('LINK access', () => {
    const link = {
      formId: form.id,
      active: true,
      key: '1',
      pass: 'test',
      name: null,
      expireAt: null,
    };

    it('should return false if link is not found', async () => {
      form.access = AccessType.LINK;

      prismaService.uniqueLink.findUnique.mockResolvedValueOnce(null);

      const isAuthorized = await accessService.authorize(form, {
        params: { formId: form.id },
        query: { key: '1' },
      });

      expect(isAuthorized).toBeFalsy();
    });

    it('should thrown UnauthorizedException if link is not active', async () => {
      form.access = AccessType.LINK;

      link.active = false;
      prismaService.uniqueLink.findUnique.mockResolvedValueOnce(link);

      await expect(
        accessService.authorize(form, {
          params: { formId: form.id },
          query: { key: '1' },
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return true', async () => {
      form.access = AccessType.LINK;

      link.active = true;
      prismaService.uniqueLink.findUnique.mockResolvedValueOnce(link);

      const isAuthorized = await accessService.authorize(form, {
        params: { formId: form.id },
        query: { key: '1' },
      });

      expect(isAuthorized).toBeTruthy();
    });
  });

  describe('PROMO access', () => {
    it('should need authentication', async () => {
      form.access = AccessType.PROMO;

      const isAuthorized = await accessService.authorize(form, {});

      expect(isAuthorized).toBeFalsy();
    });

    it('should return false if user is not in the promo', async () => {
      form.access = AccessType.PROMO;
      form.accessMeta = '2022';
      const isAuthorized = await accessService.authorize(form, { user });

      expect(isAuthorized).toBeFalsy();
    });

    it('should return true', async () => {
      form.access = AccessType.PROMO;
      form.accessMeta = '2021';
      const isAuthorized = await accessService.authorize(form, { user });

      expect(isAuthorized).toBeTruthy();
    });
  });

  describe('RESTRICTED access', () => {
    it('should need authentication', async () => {
      form.access = AccessType.RESTRICTED;

      const isAuthorized = await accessService.authorize(form, {
        params: { id: form.id },
      });

      expect(isAuthorized).toBeFalsy();
    });

    it('should return false if user is not the owner', async () => {
      form.access = AccessType.RESTRICTED;
      form.login = 'test2';

      prismaService.canAnswer.findUnique.mockResolvedValueOnce(null);

      const isAuthorized = await accessService.authorize(form, {
        user,
        params: { id: form.id },
      });

      expect(isAuthorized).toBeFalsy();
    });

    it('should return true', async () => {
      form.access = AccessType.RESTRICTED;

      prismaService.canAnswer.findUnique.mockResolvedValueOnce({
        userId: user.login,
        formId: form.id,
      });

      const isAuthorized = await accessService.authorize(form, {
        user,
        params: { id: form.id },
      });

      expect(isAuthorized).toBeTruthy();
    });
  });
});
