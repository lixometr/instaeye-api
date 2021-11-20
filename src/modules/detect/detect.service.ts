import { ImageDetect } from './imageDetect.service';
import { Injectable } from '@nestjs/common';
import * as canvas from 'canvas';
import * as path from 'path';
import * as faceapi from 'face-api.js';
const imagePath =
  'https://instagram.fhrk6-1.fna.fbcdn.net/v/t51.2885-15/e35/256409919_1068741570565870_4897846760101420930_n.jpg?_nc_ht=instagram.fhrk6-1.fna.fbcdn.net&_nc_cat=110&_nc_ohc=Z5CXc2ByRsMAX8fxK8i&edm=AP_V10EBAAAA&ccb=7-4&oh=f81ae0a960dbf959c7593374e4a15f04&oe=619EF825&_nc_sid=4f375e';

@Injectable()
export class DetectService {
  constructor(private readonly imageDetect: ImageDetect) {}
  async detect(imagePath: string) {
    const detections = await this.imageDetect.detect(imagePath);
    console.log('done', detections);

    return {
      age: Math.round(detections.age),
      gender: detections.gender,
    };
  }
}
