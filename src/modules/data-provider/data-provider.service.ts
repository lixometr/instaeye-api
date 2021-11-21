import { Injectable } from '@nestjs/common';

@Injectable()
export class DataProviderService {
  getProxy() {
    return {
      protocol: 'https',
      host: process.env.PROXY_HOST,
      port: parseInt(process.env.PROXY_PORT),
      username: process.env.PROXY_USERNAME,
      password: process.env.PROXY_PASSWORD,
    };
  }
  getInstagramAccount() {
    return {
      login: process.env.INSTA_LOGIN,
      password: process.env.INSTA_PASSWORD,
    };
  }
}
