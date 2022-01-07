import { ImageDetect } from './imageDetect.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DetectService {
  constructor(private readonly imageDetect: ImageDetect) {}
  async detect(imagePath: string) {
    const detections = await this.imageDetect.detect(imagePath);
    if (detections) {
      return {
        age: Math.round(detections.age),
        gender: detections.gender && detections.gender === 'male' ? 1 : 2,
      };
    } else {
      return null;
    }
  }
}
