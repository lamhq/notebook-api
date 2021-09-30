import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class GoogleService {
  constructor(private readonly httpService: HttpService) {}

  getAccountEmail(token: string) {
    return lastValueFrom(
      this.httpService
        .get<{ email: string }>('https://www.googleapis.com/oauth2/v1/userinfo', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .pipe(map((resp) => resp.data.email)),
    );
  }
}
