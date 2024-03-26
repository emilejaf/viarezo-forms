import { Controller, Get, Query } from '@nestjs/common';
import { LinkCSService } from './linkcs.service';
import { CotizService } from './cotiz.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('viarezo')
export class ViarezoController {
  constructor(
    private readonly linkcsService: LinkCSService,
    private readonly cotizService: CotizService,
  ) {}

  @Get('search-assos')
  searchAssos(@Query('search') search: string, @CurrentUser() user: User) {
    return this.linkcsService.searchAssos(search, user.accessToken);
  }

  @Get('asso')
  findAssoById(@Query('id') id: string, @CurrentUser() user: User) {
    return this.linkcsService.getAssoById(parseInt(id), user.accessToken);
  }

  @Get('search-users')
  searchUsers(@Query('search') search: string, @CurrentUser() user: User) {
    return this.linkcsService.searchUsers(search, user.accessToken);
  }

  @Get('users')
  findUsersByLogin(@Query('logins') logins: string, @CurrentUser() user: User) {
    return this.linkcsService.getUsersByLogin(
      logins.split(','),
      user.accessToken,
    );
  }

  @Get('cotiz-assos')
  findCotizAssos() {
    return this.cotizService.getCotizAssos();
  }
}
