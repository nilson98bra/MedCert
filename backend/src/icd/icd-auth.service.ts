import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IcdAuthService {
  private token: string | null = null;
  private tokenExpiresAt: number | null = null;

  constructor(private readonly http: HttpService) {}

  async getToken(): Promise<string> {
    if (this.token && this.tokenExpiresAt && Date.now() < this.tokenExpiresAt) {
      return this.token;
    }

    const tokenUrl = 'https://icdaccessmanagement.who.int/connect/token';
    const payload = new URLSearchParams({
      client_id: process.env.ICD_CLIENT_ID || '',
      client_secret: process.env.ICD_CLIENT_SECRET || '',
      scope: 'icdapi_access',
      grant_type: 'client_credentials',
    });

    const response = (await firstValueFrom(
      this.http.post<{ access_token: string; expires_in?: number }>(
        tokenUrl,
        payload.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      ),
    )) as { data: { access_token: string; expires_in?: number } };

    this.token = response.data.access_token;

    const expiresIn = response.data.expires_in || 3600;
    this.tokenExpiresAt = Date.now() + expiresIn * 1000 - 60_000;

    return this.token;
  }
}
