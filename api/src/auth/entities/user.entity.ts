export class User {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  promo: number;
  personType: PersonType;
  accessToken: string;
}

// TODO fill this enum
export enum PersonType {
  STUDENT_CENTRALESUPELEC = 'STUDENT_CENTRALESUPELEC',
  STUDENT_CS_INTERNATIONAL_GAPYEAR_DD = 'STUDENT_CS_INTERNATIONAL_GAPYEAR_DD',
}
