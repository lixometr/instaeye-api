import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DetectService } from './detect.service';

@Controller('detect')
export class DetectController {
  constructor(private readonly detectService: DetectService) {}
  @Post('/')
  detect(@Body('img') imagePath: string) {
    return this.detectService.detect(imagePath);
  }
}
