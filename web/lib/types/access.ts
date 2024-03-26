import { AccessType } from "./form";

export interface LinkCSAsso {
  id: number;
  name: string;
}

export interface LinkCSUser {
  login: string;
  firstName: string;
  lastName: string;
}

export interface CotizAsso {
  id: number;
  name: string;
}

export interface AccessAccordionProps {
  access: AccessType;
  title: string;
  children: React.ReactNode;
}

export interface AccessChildrenProps {
  accessMeta?: string;
  saveAccessMeta: (accessMeta: string | undefined) => Promise<void>;
}
