import { ConfigModule } from '@nestjs/config';
import { InnerProxyModule } from './../inner-proxy/inner-proxy.module';
import { ParseConsumer } from './parse.consumer';
import { ParseClientService } from './parse-client.service';
import { ParseAccountLoginStrategy } from './strategy/parse-account-login/parse-account-login.strategy';
import { AccountModule } from './../account/account.module';
import { ParseAccountInfoStrategy } from './strategy/parse-account-info/parse-account-info.strategy';
import { DetectModule } from './../detect/detect.module';
import { forwardRef, Module } from '@nestjs/common';
import { ParseService } from './parse.service';
import { ParseController } from './parse.controller';
import { BullModule } from '@nestjs/bull';
import { InnerAccountModule } from '../inner-account/inner-account.module';

@Module({
  imports: [
    DetectModule,
    AccountModule,
    BullModule.registerQueue({
      name: 'parse-accounts',
    }),
    forwardRef(() => InnerAccountModule),
    forwardRef(() => InnerProxyModule),
    ConfigModule,
  ],
  controllers: [ParseController],
  providers: [
    ParseService,
    ParseClientService,
    ParseAccountInfoStrategy,
    ParseAccountLoginStrategy,
    ParseConsumer,
  ],
  exports: [ParseClientService],
})
export class ParseModule {
  constructor(private readonly client: ParseClientService) {}
  async onModuleInit() {
    await this.client.init();
  }
}
