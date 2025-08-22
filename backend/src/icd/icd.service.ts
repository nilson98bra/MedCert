import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IcdAuthService } from './icd-auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IcdService {
  constructor(
    private readonly http: HttpService,
    private readonly icdAuthService: IcdAuthService,
  ) {}

  private async getHeaders(): Promise<any> {
    const token = await this.icdAuthService.getToken();
    return {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Accept-Language': 'en',
      'API-Version': 'v2',
    };
  }

  async search(q: string): Promise<{ cid: string; description: string }[]> {
    const url = 'https://id.who.int/icd/entity/search';
    const headers = await this.getHeaders();

    const response = await firstValueFrom(
      this.http.get(url, { headers, params: { q, useFlexisearch: true } }),
    );

    const entities = response.data.destinationEntities || [];

    if (!entities.length) {
      return [];
    }

    return entities.map((entity) => {
      const cid = entity.theCode || entity.code || entity.id.split('/').pop();
      const rawTitle = entity.title || 'Unknown description';
      const description = rawTitle.replace(/<[^>]*>/g, '');

      return { cid, description };
    });
  }
}
