import { Access, FormAccess, AccessType } from './access';
import { AdvancedAccess } from './advanced-access';
import { AllAccess } from './all-access';
import { AssoAccess } from './asso-access';
import { CotizAccess } from './cotiz-access';
import { CSAccess } from './cs-access';
import { LinkAccess } from './link-access';
import { PromoAccess } from './promo-access';
import { RestrictedAccess } from './restricted-access';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { LinkCSService } from 'src/viarezo/linkcs.service';
import { CotizService } from 'src/viarezo/cotiz.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractForm, FormType } from '../abstract-forms/entities/form.entity';
import { VotesAccess } from '../votes/votes.access';
import { SymetricService } from 'src/crypto/symetric.service';
import { FormsAccess } from 'src/forms/forms.access';
import { FormsService } from 'src/forms/forms.service';
import { PapsAccess } from 'src/paps/paps.access';
import { PapsService } from 'src/paps/paps.service';
import { MailingService } from 'src/mailing/mailing.service';

@Injectable()
export class AccessService {
  private readonly access;
  private readonly formAccess;

  constructor(
    linkcsService: LinkCSService,
    cotizService: CotizService,
    prismaService: PrismaService,
    symetricService: SymetricService,
    mailingService: MailingService,
    @Inject(forwardRef(() => FormsService))
    formsService: FormsService,
    @Inject(forwardRef(() => PapsService))
    papsService: PapsService,
  ) {
    this.access = {
      ALL: new AllAccess(),
      PROMO: new PromoAccess(),
      ASSO: new AssoAccess(linkcsService),
      COTIZ: new CotizAccess(cotizService),
      RESTRICTED: new RestrictedAccess(prismaService),
      CS: new CSAccess(),
      ADVANCED: new AdvancedAccess(linkcsService, cotizService),
      LINK: new LinkAccess(prismaService, mailingService),
    } as Record<AccessType, Access>;

    this.formAccess = {
      FORM: new FormsAccess(formsService),
      PAPS: new PapsAccess(papsService),
      VOTE: new VotesAccess(prismaService, symetricService),
    } as Record<FormType, FormAccess | null>;
  }

  public async authorize(form: AbstractForm, request: any): Promise<boolean> {
    const isAccessAuthorized = await this.isAccessAuthorized(form, request);

    const accessInstance = this.formAccess[form.type];

    const isFormTypeAccessAuthorized = accessInstance
      ? await accessInstance.authorize(request, form)
      : true;

    return isAccessAuthorized && isFormTypeAccessAuthorized;
  }

  private async isAccessAuthorized(form: AbstractForm, request: any) {
    if (!('access' in form)) return true;

    return await this.access[form.access as AccessType].authorize(
      request,
      'accessMeta' in form ? (form.accessMeta as string) : '',
    );
  }

  public async createAction(form: AbstractForm) {
    if (!('access' in form)) return;

    return await this.access[form.access as AccessType].createAction(form);
  }

  public async updateAction(form: AbstractForm) {
    if (!('access' in form)) return;

    return await this.access[form.access as AccessType].updateAction(form);
  }
}
