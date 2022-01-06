import { config } from 'src/config/config';
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
  ) {}
  async init() {
    try {
      logger.info('<Client start init>');
      this.cookieStore = new FileCookieStore(config.cookiesPath);
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
        if (!config.allowNoAuthParse) {
          const profile = await this.client.getProfile();
          if (!profile) {
            throw null;
          }
        }

        logger.info('<Client init success> using ' + creds.username);
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
    // console.log(err);
    // check is it logined
    try {
      const profile = await this.client.getProfile();
      if (profile) {
        // was logined when error happened
        throw err;
      } else {
        // wasn't logined
        const { authenticated } = await this.client.login();
        if (!authenticated) {
          await this.onLoginError(err);
        } else {
          logger.info('<Client login success>');
        }
      }
    } catch (err) {
      await this.limitError(err);
    }
  }

  async limitError(err) {
    logger.error(
      `<Limit Error> ${err.statusCode} - ${JSON.stringify(err.error)}`,
    );
    await this.innerAccountService.changeActiveAccount(err);
    await this.init();
  }
  async onLoginError(err) {
    if (err && typeof err === 'object' && err.statusCode) {
      logger.error(
        `<Client Login Error> ${err.statusCode} - ${JSON.stringify(err.error)}`,
      );
      if (err.statusCode === 400) {
        // Maybe need sms approve or email approve
        // Write somewhere that this account needs approvement and approve through browser
      }
      if (err.statusCode === 429) {
        // Proxy banned for many attempts or account for many invalid logins
        // Choose another one
      }
    }
    await this.innerAccountService.changeActiveAccount(err);
    await this.init();
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
