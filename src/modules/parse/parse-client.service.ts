import { ConfigService } from '@nestjs/config';
import { InnerProxyService } from './../inner-proxy/inner-proxy.service';
import { InnerAccountService } from './../inner-account/inner-account.service';
import { logger } from 'src/helpers/logger';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
const Instagram = require('instagram-web-api');
const FileCookieStore = require('tough-cookie-filestore2');
@Injectable()
export class ParseClientService {
  private client: any;
  private cookieStore: any;
  constructor(
    @Inject(forwardRef(() => InnerAccountService))
    private innerAccountService: InnerAccountService,
    @Inject(forwardRef(() => InnerProxyService))
    private innerProxyService: InnerProxyService,
    private configService: ConfigService,
  ) {}
  async init() {
    try {
      logger.info('<Client start init>');
      this.cookieStore = new FileCookieStore('./cookies.json');
      const creds = await this.innerAccountService.getActiveAccount();
      const proxyUrl = await this.innerProxyService.getProxyUrl();
      this.client = new Instagram(
        {
          username: creds.username,
          password: creds.password,
          cookieStore: this.cookieStore,
        },
        { proxy: proxyUrl },
      );
      try {
        if (!this.configService.get('allowNoAuthParse')) {
          const profile = await this.client.getProfile();
          if (!profile) {
            throw null;
          }
        }

        logger.info('<Client init success>');
      } catch (err) {
        logger.info('<Client init fail>');
        await this.onError({});
      }
    } catch (err) {
      logger.error('<Client start error>');
      console.log(err);
    }
  }
  /**
   onError:
   try login -> reinit

   */
  async onError(err) {
    try {
      console.log(err);
      const { authenticated } = await this.client.login();
      if (!authenticated) {
        throw null;
      }
      logger.info('<Client login success>');
    } catch (err) {
      console.log('Login Error', err);
      if (err && typeof err === 'object' && err.statusCode) {
        logger.error('<Client Login Error> ' + err.statusCode);
        if (err.statusCode === 400) {
          // Maybe need sms approve or email approve
          // Write somewhere that this account needs approvement and approve through browser
        }
        if (err.statusCode === 429) {
          // Proxy banned for many attempts or account for many invalid logins
          // Choose another one
        }
        // if (err.statusCode === 429) {
        // await this.dataProvider.changeProxyAndAccount();
        // } else {
        //   await this.dataProvider.changeAccount();
        // }
      }
      await this.innerAccountService.changeActiveAccount(err);
      fs.unlinkSync('./cookies.json');
      await this.init();
    }
  }
  async exec(methodName: string, ...args: any[]) {
    try {
      return await this.client[methodName](...args);
    } catch (err) {
      logger.error('<Fetch Error>');

      await this.onError(err);
      return this.exec(methodName, ...args);
    }
  }
}
