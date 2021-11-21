import { DataProviderModule } from './../data-provider/data-provider.module';
import { ParseAccountLoginStrategy } from './strategy/parse-account-login/parse-account-login.strategy';
import { AccountModule } from './../account/account.module';
import { ParseAccountInfoStrategy } from './strategy/parse-account-info/parse-account-info.strategy';
import { ParseFetchService } from './parse-fetch.service';
import { DetectModule } from './../detect/detect.module';
import { Module } from '@nestjs/common';
import { ParseService } from './parse.service';
import { ParseController } from './parse.controller';

@Module({
  imports: [DetectModule, AccountModule, DataProviderModule],
  controllers: [ParseController],
  providers: [
    ParseService,
    ParseFetchService,
    ParseAccountInfoStrategy,
    ParseAccountLoginStrategy,
  ],
})
export class ParseModule {}
