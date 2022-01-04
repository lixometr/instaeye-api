import { ParseAccountLoginStrategy } from './strategy/parse-account-login/parse-account-login.strategy';
import { CreateAccountDto } from './../account/dto/create-account.dto';
import { AccountService } from './../account/account.service';
import { DetectService } from './../detect/detect.service';

import { urlAccountInfo } from './parse-url';
import { Injectable } from '@nestjs/common';
import { ParseAccountInfoStrategy } from './strategy/parse-account-info/parse-account-info.strategy';
import { logger } from 'src/helpers/logger';
import * as fs from 'fs';
import * as path from 'path';
import { ParseClientService } from './parse-client.service';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
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
    private parseAccountStrategy: ParseAccountInfoStrategy,
    private accountService: AccountService,
    private parseAccountLogin: ParseAccountLoginStrategy,
    private client: ParseClientService,
    @InjectQueue('parse-accounts') private accountsQueue: Queue,
  ) {}
  async test() {
    return this.parseAccountLogin.exec();
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
      return 1;
    }
    const info = await this.getAccountInfo(username);
    if (!info.isAllowed) {
      logger.info(`END Parsing account ${username}`);
      return info;
    }
    logger.info(`Creating record ${username}`);
    await this.createAccount(info.result);
    logger.info(`END Parsing account ${username}`);
    return info;
  }
  async createAccount(accountInfo) {
    const toCreate: CreateAccountDto = {
      name: accountInfo.name,
      followers: accountInfo.followers,
      username: accountInfo.username,
      photo: accountInfo.photo,
      gallery: accountInfo.gallery.map((item) => item.url),
      age: accountInfo.age,
      gender: accountInfo.gender && accountInfo.gender === 'male' ? 1 : 2,
      description: accountInfo.description,
      location: accountInfo.location,
    };
    return await this.accountService.create(toCreate);
  }
  async parsePause() {
    await this.accountsQueue.pause();
    logger.info('<Parse pause>');
    return true;
  }
  async parseContinue() {
    await this.accountsQueue.resume();
    logger.info('<Parse resume>');
    return true;
  }
  async getCount() {
    return this.accountsQueue.getJobCounts();
  }
  async parseClear() {
    await this.accountsQueue.empty();
    logger.info('<Parse clear>');
    return true;
  }
  async parseAdd(item) {
    logger.info('<Parse add> ' + JSON.stringify(item));
    return this.accountsQueue.add(item);
  }
  async getStatus() {
    const isPaused = await this.accountsQueue.isPaused();
    return !isPaused ? 'active' : 'pause';
  }
}
