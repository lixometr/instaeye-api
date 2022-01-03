import { ParseModule } from './../parse/parse.module';
import { InnerProxyModule } from './../inner-proxy/inner-proxy.module';
import { forwardRef, Module } from '@nestjs/common';
import { InnerAccountService } from './inner-account.service';
import { InnerAccountController } from './inner-account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { InnerAccount, InnerAccountSchema } from './inner-account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InnerAccount.name, schema: InnerAccountSchema },
    ]),
    forwardRef(() => InnerProxyModule),
    forwardRef(() => ParseModule)
  ],
  controllers: [InnerAccountController],
  providers: [InnerAccountService],
  exports: [InnerAccountService],
})
export class InnerAccountModule {}
