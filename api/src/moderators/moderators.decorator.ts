import { SetMetadata } from '@nestjs/common';

export const ALLOW_MODERATORS_KEY = 'allowModerators';
export const AllowModerators = () => SetMetadata(ALLOW_MODERATORS_KEY, true);
