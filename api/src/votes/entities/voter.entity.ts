import { SecuredFormUser } from '@prisma/client';

export class Voter {
  id: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  voted: boolean;

  constructor(voter: SecuredFormUser) {
    this.id = voter.id;
    this.email = voter.email || undefined;
    this.firstName = voter.firstName || undefined;
    this.lastName = voter.lastName || undefined;
    this.voted = voter.voted;
  }
}
