import { Access } from './access';

export class AllAccess extends Access {
  protected needUserAuth = false;

  public authorize() {
    return true;
  }

  public updateAction(): void | Promise<void> {}
  public createAction(): void | Promise<void> {}
}
