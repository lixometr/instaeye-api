import { DataProviderService } from './../data-provider/data-provider.service';
import { Injectable } from '@nestjs/common';
import fetch, { RequestInit } from 'node-fetch';
import * as randonUserAgent from 'random-useragent';
import * as HttpsProxyAgent from 'https-proxy-agent';

@Injectable()
export class ParseFetchService {
  constructor(private dataProvider: DataProviderService) {}
  generateUserAgent() {
    return randonUserAgent.getRandom();
  }
  getProxyHeader() {
    const { username, password } = this.dataProvider.getProxy();
    const fullName = `${username}:${password}`;
    return `Basic ${Buffer.from(fullName).toString('base64')}`;
  }
  getProxyAgent() {
    const { host, port, username, password } = this.dataProvider.getProxy();
    // @ts-ignore
    const httpsAgent = new HttpsProxyAgent({
      host: host,
      port: port,
      auth: `${username}:${password}`,
    });
    return httpsAgent;
  }
  async fetch(url: string, options?: RequestInit) {
    const agent = this.getProxyAgent();
    const res = await fetch(url, {
      agent,
      ...options,
    });
    return res.json();
  }
}
