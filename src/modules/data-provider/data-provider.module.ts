import { Module } from '@nestjs/common';
import { DataProviderService } from './data-provider.service';
import { DataProviderController } from './data-provider.controller';

@Module({
  controllers: [DataProviderController],
  providers: [DataProviderService],
  exports: [DataProviderService],
})
export class DataProviderModule {}
