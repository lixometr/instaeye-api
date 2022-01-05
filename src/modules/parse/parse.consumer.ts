import { config } from 'src/config/config';
import { NoAccountsException } from './../../helpers/exceptions/no-accounts.exception';
import { NoProxyException } from './../../helpers/exceptions/no-proxy.exception';
import { ParseAccountInfoStrategy } from './strategy/parse-account-info/parse-account-info.strategy';
import { logger } from 'src/helpers/logger';
import { ParseClientService } from './parse-client.service';
import { ParseService } from './parse.service';
import {
  Process,
  Processor,
  InjectQueue,
  OnQueueFailed,
  OnQueueError,
} from '@nestjs/bull';
import { Job, Queue } from 'bull';
interface IFollower {
  id: string;
  username: string;
  followed_by_viewer: boolean;
  requested_by_viewer: boolean;
}
@Processor('parse-accounts')
export class ParseConsumer {
  constructor(
    private readonly parseService: ParseService,
    private client: ParseClientService,
    @InjectQueue('parse-accounts') private accountsQueue: Queue,
    private parseAccountStrategy: ParseAccountInfoStrategy,
  ) {}
  @Process()
  async process(job: Job<any>) {
    const {
      username,
      count = 20,
      followers: getFollowers = true,
      followings: getFollowings = false,
      deep = 0,
      maxDeep = -1,
    } = job.data;
    let info: any = await this.parseService.parseAccount(username);
    const queueCount = await this.accountsQueue.count();
    logger.info('<Queue count> ' + queueCount);
    if (queueCount > config.accountsQueueLimit) return;
    if (maxDeep > -1 && deep >= maxDeep) return;
    if (info === 1) {
      const response = await this.parseAccountStrategy.fetch(username);
      info = { result: this.parseAccountStrategy.extract(response) } as any;
    }
    if (info) {
      let toAdd = [];
      if (getFollowers) {
        const { data: followers } = await this.client.exec('getFollowers', {
          first: count,
          userId: info.result.userId,
        });
        toAdd = toAdd.concat(followers);
      }
      if (getFollowings) {
        const { data: followings } = await this.client.exec('getFollowings', {
          first: count,
          userId: info.result.userId,
        });
        toAdd = toAdd.concat(followings);
      }

      toAdd.forEach((fol: IFollower) => {
        this.accountsQueue.add({
          username: fol.username,
          deep: deep + 1,
          maxDeep,
        });
      });
    }
  }
  @OnQueueFailed()
  onJobFail(job: Job<any>, err: any) {
    logger.error('<Job Fail> ' + JSON.stringify(err));
    console.log(err);
    if (err instanceof NoProxyException || err instanceof NoAccountsException) {
    }
    this.parseService.parsePause();
  }

  @OnQueueError()
  onQueueError(err) {}
}
