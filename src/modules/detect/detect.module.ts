import { ImageDetect } from './imageDetect.service';
import { Module, OnModuleInit } from '@nestjs/common';
import { DetectService } from './detect.service';
import { DetectController } from './detect.controller';

@Module({
  controllers: [DetectController],
  providers: [DetectService, ImageDetect],
  exports: [DetectService],
})
export class DetectModule implements OnModuleInit {
  constructor(private readonly imageDetect: ImageDetect) {}
  async onModuleInit() {
    await this.imageDetect.init();
    console.log('init detection');
  }
}
