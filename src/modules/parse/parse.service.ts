import { ParseAccountLoginStrategy } from './strategy/parse-account-login/parse-account-login.strategy';
import { CreateAccountDto } from './../account/dto/create-account.dto';
import { AccountService } from './../account/account.service';
import { ParseFetchService } from './parse-fetch.service';
import { DetectService } from './../detect/detect.service';

import { urlAccountInfo } from './parse-url';
import { Injectable } from '@nestjs/common';
import { ParseAccountInfoStrategy } from './strategy/parse-account-info/parse-account-info.strategy';
import { logger } from 'src/helpers/logger';
/**
 * account info by username
 * account photos
 * account followers list
 */
/**
 * to add:
 * post average likes
 * posts count
 * subscriptions
 */
@Injectable()
export class ParseService {
  constructor(
    private readonly detectService: DetectService,
    private parseFetch: ParseFetchService,
    private parseAccountStrategy: ParseAccountInfoStrategy,
    private accountService: AccountService,
    private parseAccountLogin: ParseAccountLoginStrategy
  ) {}
  async test() {
    return this.parseAccountLogin.login()
  }
  async parse() {
    // await getAccountInfo()
    // return res;
  }

  async crowd(usernames: string[]) {
    const start = new Date().getTime();
    logger.info('START CROWD PARSE');
    for (let i = 0; i < usernames.length; i++) {
      await this.parseAccount(usernames[i]);
    }
    const time = new Date().getTime() - start;
    logger.info('END CROWD PARSE');
    logger.info(`Time took: ${time}ms`);
    return 'done';
  }

  async getAccountInfo(username: string) {
    return await this.parseAccountStrategy.exec(username);
  }
  async parseAccount(username: string) {
    logger.info(`START Parsing account ${username}`);
    const isExist = await this.accountService.isExist(username);
    if (isExist) {
      logger.info(`Account exists ${username}`);
      return 0;
    }
    const info = await this.getAccountInfo(username);
    if (!info.isAllowed) {
      logger.info(`END Parsing account ${username}`);
      return 0;
    }
    logger.info(`Creating record ${username}`);
    await this.createAccount(info.result);
    logger.info(`END Parsing account ${username}`);
    return true;
  }
  async createAccount(accountInfo) {
    const toCreate: CreateAccountDto = {
      name: accountInfo.name,
      followers: accountInfo.followers,
      username: accountInfo.username,
      photo: accountInfo.photo,
      gallery: accountInfo.gallery.map((item) => item.url),
      age: accountInfo.age,
      gender: accountInfo.gender,
      description: accountInfo.description,
      location: accountInfo.location,
    };
    return await this.accountService.create(toCreate);
  }
}
