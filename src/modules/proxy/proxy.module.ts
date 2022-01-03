import { InnerProxyModule } from './../inner-proxy/inner-proxy.module';
import { Module } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { ProxyController } from './proxy.controller';

@Module({
  imports: [InnerProxyModule],
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}
