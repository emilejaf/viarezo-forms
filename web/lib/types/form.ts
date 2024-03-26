import { Field } from "./field";

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export enum FormType {
  FORM = "FORM",
  PAPS = "PAPS",
  VOTE = "VOTE",
}

export const formTypeHelper = {
  [FormType.FORM]: {
    url: "forms",
    label: "Formulaire",
  },
  [FormType.PAPS]: {
    url: "paps",
    label: "PAPS",
  },
  [FormType.VOTE]: {
    url: "votes",
    label: "Vote",
  },
};

export interface AbstractForm {
  id: string;
  login: string;
  title: string;
  description?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  backgroundUrl?: string;
  logoUrl?: string;
  fields: Field[];

  type: FormType;

  owner?: string | null;
}

export interface Form extends AbstractForm {
  access: AccessType;
  accessMeta?: string | null;
  anonym: boolean;
  uniqueAnswer: boolean;
}

export interface Paps extends AbstractForm {
  access: AccessType;
  accessMeta?: string | null;
  start: Date | null; // paps_start in database schema
  choices: PapsChoice[];
}

export interface PapsChoice {
  id: number;
  name: string;
  size: number;

  answersCount: number;
}

export interface Vote extends AbstractForm {
  editable: boolean;
  // TODO ADD VOTER EMAILS
}

export enum AccessType {
  ALL = "ALL",
  PROMO = "PROMO",
  ASSO = "ASSO",
  COTIZ = "COTIZ",
  RESTRICTED = "RESTRICTED",
  CS = "CS",
  ADVANCED = "ADVANCED",
  LINK = "LINK",
}
