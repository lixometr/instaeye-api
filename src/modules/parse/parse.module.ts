import { AccountModule } from './../account/account.module';
import { ParseAccountInfoStrategy } from './strategy/parse-account-info/parse-account-info.strategy';
import { ParseFetchService } from './parse-fetch.service';
import { DetectModule } from './../detect/detect.module';
import { Module } from '@nestjs/common';
import { ParseService } from './parse.service';
import { ParseController } from './parse.controller';

@Module({
  imports: [DetectModule, AccountModule],
  controllers: [ParseController],
  providers: [ParseService, ParseFetchService, ParseAccountInfoStrategy],
})
export class ParseModule {}
