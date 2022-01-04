import { InnerProxyService } from './../inner-proxy/inner-proxy.service';
import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import * as qs from 'query-string';
import { ProxyService } from './proxy.service';
import * as HttpsProxyAgent from 'https-proxy-agent';

import fetch from 'node-fetch';
@Controller('proxy')
export class ProxyController {
  constructor(
    private readonly proxyService: ProxyService,
    private innerProxyService: InnerProxyService,
  ) {}

  @Get('image/*')
  async proxyImage(
    @Param('0') path: string,
    @Query() query: any,
    @Res() response: Response,
  ) {
    const queryString = qs.stringify(query);
    const fullPath = path + '?' + queryString;
    const { host, port, username, password } =
      await this.innerProxyService.getImageProxy
      ();
    // @ts-ignore
    const httpsAgent = new HttpsProxyAgent({
      host: host,
      port: port,
      auth: `${username}:${password}`,
    });
    try {
      const res = await fetch(fullPath, { agent: httpsAgent });
      new Promise((resolve, reject) => {
        res.body.pipe(response);
        res.body.on('end', () => resolve(''));
        response.on('error', reject);
      });
    } catch (err) {}
  }
}
