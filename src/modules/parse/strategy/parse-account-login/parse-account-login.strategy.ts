import * as HttpsProxyAgent from 'https-proxy-agent';
import { DataProviderService } from './../../../data-provider/data-provider.service';
import { ParseFetchService } from './../../parse-fetch.service';
import { Injectable } from '@nestjs/common';
import { IgApiClient } from 'instagram-private-api';
@Injectable()
export class ParseAccountLoginStrategy {
  constructor(
    private parseFetch: ParseFetchService,
    private dataProvider: DataProviderService,
  ) {}
  async login() {
    const ig = new IgApiClient();
    const proxy = this.dataProvider.getProxy();
    const creds = this.dataProvider.getInstagramAccount();
    ig.state.generateDevice(creds.login);
    ig.request.defaults.agent = this.parseFetch.getProxyAgent()
    ig.request.defaults.baseUrl = undefined;
    const response = await ig.request.send(
      {
        baseUrl: 'http://instaeye.lixometr.com/parse/13',
        uri: '/',
        strictSSL: false,
        // proxy: `https://${proxy.host}:${proxy.port}`,
        // headers: {
        //   'Proxy-Authorization': this.parseFetch.getProxyHeader(),
        // },
      },
      true,
    );

    return response;
    // await ig.simulate.preLoginFlow();
    // const loggedInUser = await ig.account.login(creds.login, creds.password);
    // console.log(loggedInUser);
    // ig.state.cookieCsrfToken;
    // process.nextTick(async () => await ig.simulate.postLoginFlow());
  }
}
