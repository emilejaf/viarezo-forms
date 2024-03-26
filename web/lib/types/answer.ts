export interface AbstractAnswer {
  id: number;
  createdAt: Date;
  data: FieldAnswer[];
}

export interface FieldAnswer {
  fieldId: string;
  data: string;
}

export interface FormAnswer extends AbstractAnswer {
  by?: string;
  fullname?: string;
}

export interface PapsAnswer extends AbstractAnswer {
  by?: string;
  fullname?: string;
  papsChoiceId: number;
}

export interface VoteAnswer extends AbstractAnswer {
  signatureVerified: boolean;
}
