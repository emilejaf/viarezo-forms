import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface CotizAsso {
  id: number;
  name: string;
}

@Injectable()
export class CotizService {
  constructor(private readonly config: ConfigService) {}

  private async fetchCotiz(
    endpoint: string,
    params: Record<string, string> = {},
  ): Promise<any> {
    const API_BASE_URL = 'https://cotiz.viarezo.fr/api';

    params.secret = this.config.getOrThrow('COTIZ_SECRET_TOKEN');

    const url = new URL(API_BASE_URL + endpoint);
    url.search = new URLSearchParams(params).toString();

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error('Error while fetching Cotiz API');
    }

    const json = await response.json();

    return json;
  }

  public async getCotizAssos(): Promise<CotizAsso[]> {
    const response = await this.fetchCotiz('/asso/export');

    return response;
  }

  public async getCotizAssosForLogin(login: string): Promise<CotizAsso[]> {
    const assos = await this.getCotizAssos();

    const results = await Promise.all(
      assos.map(async (asso) => {
        const contributor: boolean = await this.fetchCotiz(
          `/asso/${asso.id}/contribution`,
          {
            login,
          },
        );
        return { asso, contributor };
      }),
    );

    return results
      .filter((result) => result.contributor)
      .map((result) => result.asso);
  }
}
