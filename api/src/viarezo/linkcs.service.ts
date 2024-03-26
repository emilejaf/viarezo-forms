import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface LinkCSAsso {
  id: number;
  name: string;
}

export interface LinkCSUser {
  login: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class LinkCSService {
  constructor(private readonly config: ConfigService) {}

  // currently an accessToken is required on every request however it might change in the future so it's better to have it as an optional parameter
  private async fetchLinkCS(query: string, accessToken?: string) {
    const response = await fetch(
      `https://api.linkcs.fr/v1/graphql?query=${query}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}` || ``,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Error while fetching LinkCS API');
    }

    return (await response.json()).data;
  }

  async getUserAssos(accessToken: string): Promise<LinkCSAsso[]> {
    const query = `
    query {
      me {
        roles {
          sector {
            composition {
              association {
                id,
                name
              }
            }
          }
        }
      }
    }`;

    const response = await this.fetchLinkCS(query, accessToken);

    const roles = response.me.roles;

    const assos = new Set<LinkCSAsso>();

    roles.forEach((role: any) => {
      assos.add(role.sector.composition.association);
    });

    return Array.from(assos);
  }

  async getAssoById(id: number, accessToken: string): Promise<LinkCSAsso> {
    const query = `
      query {
        association(id: ${id}) {
          id, name
        }
      }
    `;

    const response = await this.fetchLinkCS(query, accessToken);

    return response.association;
  }

  // we need an access_token to get all assos from the API (quite strange but it's how it works)
  async searchAssos(
    search: string,
    accessToken: string,
  ): Promise<LinkCSAsso[]> {
    const query = `
      query {
        searchAssociations(term: "${search}", limit: 5) {
          id, name
        }
      }
    `;

    const response = await this.fetchLinkCS(query, accessToken);

    return response.searchAssociations;
  }

  async searchUsers(
    search: string,
    accessToken: string,
  ): Promise<LinkCSUser[]> {
    const query = `
    query {
      searchUsers(login: "${search}", name: "${search}", limit: 10) {
        user {
          login,
          firstName,
          lastName
        }
      }
    }
    `;

    const response = await this.fetchLinkCS(query, accessToken);

    return response.searchUsers.map((user: any) => user.user);
  }

  async getUsersByLogin(
    logins: string[],
    accessToken: string,
  ): Promise<LinkCSUser[]> {
    const query = `    
    query {
      ${logins
        .map(
          (login) =>
            `user${login}: user(login: "${login}") { login, firstName, lastName }`,
        )
        .join(',')}
    }
    `;

    const response = await this.fetchLinkCS(query, accessToken);

    return Object.values(response);
  }
}
