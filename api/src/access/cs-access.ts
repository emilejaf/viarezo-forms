import { PersonType, User } from 'src/auth/entities/user.entity';
import { Access } from './access';

export class CSAccess extends Access {
  private cs_student_filter = [
    PersonType.STUDENT_CENTRALESUPELEC,
    PersonType.STUDENT_CS_INTERNATIONAL_GAPYEAR_DD,
  ];

  public authorize(request: any) {
    const user: User | undefined = request.user;

    if (!user) return false; // auth is required

    return this.cs_student_filter.includes(user.personType);
  }

  public updateAction(): void | Promise<void> {}
  public createAction(): void | Promise<void> {}
}
