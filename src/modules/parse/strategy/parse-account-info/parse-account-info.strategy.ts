import { ParseAccountPhotoResult } from './../../types/parse-account-photo-result.type';
import { ParseAccountTextStrategy } from '../parse-account-text/parse-account-text.strategy';
import { ParseAccountExtractedResult } from './../../types/parse-account-extracted-result.type';
import { ParseAccountFullResult } from './../../types/parse-account-full-result.type';
import { ParseClientService } from './../../parse-client.service';
import { DetectService } from './../../../detect/detect.service';
import { accountExtractor } from './parse-account-info.extractor';

import { urlAccountInfo } from '../../parse-url';
import { Injectable, Logger } from '@nestjs/common';
import { logger } from 'src/helpers/logger';
import { ParseAccountTextResult } from '../../types/parse-account-text-result.type';
@Injectable()
export class ParseAccountInfoStrategy {
  constructor(
    private client: ParseClientService,
    private detectService: DetectService,
    private parseTextStrategy: ParseAccountTextStrategy,
  ) {}
  async fetch(username: string) {
    const response = await this.client.exec('getUserByUsername', { username });
    return response;
  }
  // add text blacklist word filter and
  async exec(username: string) {
    // logger.info(`START <ParseAccountInfoStrategy> for ${username}`);
    logger.info('Fetching ' + username);
    const response = await this.fetch(username);
    logger.info('Fetched ' + username);
    const result = this.extract(response);
    logger.info('Start analyze photo ' + username);
    const photoResult = await this.analyzePhotos(result);

    const textResult = await this.analyzeTexts(result);
    const fullResult: ParseAccountExtractedResult & ParseAccountPhotoResult = { ...result, ...photoResult };
    const allowResult = this.isAllowed(fullResult);
    // logger.info(`END <ParseAccountInfoStrategy> Allowed: ${isAllowed}`);
    const rr = this.mergeResults(result, photoResult, textResult, allowResult);
    return rr;
  }
  mergeResults(
    extractResult: ParseAccountExtractedResult,
    photoResult: ParseAccountPhotoResult,
    textResult: ParseAccountTextResult,
    allowResult: boolean,
  ) {
    let result = { ...extractResult, ...photoResult };
    let isAllowed = textResult.isAllowed && allowResult;
    if (textResult.age) result.age = textResult.age;
    if (textResult.location) result.location = textResult.location;
    if(photoResult.activePhoto > -1) {
      result.photo = result.gallery[photoResult.activePhoto].url
      result.gallery.splice(photoResult.activePhoto, 1)
    }
    return {
      isAllowed,
      result,
    };
  }
  isAllowed(result:  ParseAccountExtractedResult & ParseAccountPhotoResult) {
    if (!result.age || result.age < 14) return false;
    return true;
  }
  async analyzeTexts(result: ParseAccountExtractedResult) {
    return this.parseTextStrategy.exec(result);
  }
  async analyzePhotos(result: ParseAccountExtractedResult) {
    let activePhoto = -1;
    let location = '';
    let info = await this.getAgeAndGender(result.photo);
    for (let i = 0; i < result.gallery.length; i++) {
      const currentPhoto = result.gallery[i];
      if (!currentPhoto) continue;
      if (!info && i < 3) {
        info = await this.getAgeAndGender(currentPhoto.url);
        if (info) {
          activePhoto = i;
        }
      }

      if (currentPhoto.location) {
        if (!location) {
          location = currentPhoto.location;
        } else {
          // location?.name === currentPhoto.location.name;
        }
      }
      if (location && info) break;
    }
    return { ...info, activePhoto, location };
  }
  async getAgeAndGender(photo: string) {
    return this.detectService.detect(photo);
  }
  extract(response: any) {
    const result = accountExtractor(response);
    return result;
  }
}
