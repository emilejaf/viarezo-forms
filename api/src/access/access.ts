import { AbstractForm } from '../abstract-forms/entities/form.entity';

export enum AccessType {
  ALL = 'ALL',
  PROMO = 'PROMO',
  ASSO = 'ASSO',
  COTIZ = 'COTIZ',
  RESTRICTED = 'RESTRICTED',
  CS = 'CS',
  ADVANCED = 'ADVANCED',
  LINK = 'LINK',
}

export abstract class Access {
  public abstract authorize(
    request: any,
    meta: string,
  ): boolean | Promise<boolean>;

  // WARNING : form does not include nested fields
  public abstract createAction(form: AbstractForm): void | Promise<void>;
  public abstract updateAction(form: AbstractForm): void | Promise<void>;
}

export abstract class FormAccess {
  public abstract authorize(
    request: any,
    form: AbstractForm,
  ): boolean | Promise<boolean>;
}
