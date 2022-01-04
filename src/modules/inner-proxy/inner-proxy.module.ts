import { ConfigModule } from '@nestjs/config';
import { forwardRef, Module } from '@nestjs/common';
import { InnerProxyService } from './inner-proxy.service';
import { InnerProxyController } from './inner-proxy.controller';
import { InnerProxy, InnerProxySchema } from './inner-proxy.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { InnerAccountModule } from '../inner-account/inner-account.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InnerProxy.name, schema: InnerProxySchema },
    ]),
    forwardRef(() => InnerAccountModule),
  ],

  controllers: [InnerProxyController],
  providers: [InnerProxyService],
  exports: [InnerProxyService],
})
export class InnerProxyModule {}
