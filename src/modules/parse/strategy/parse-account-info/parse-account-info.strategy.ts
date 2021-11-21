import { DetectService } from './../../../detect/detect.service';
import { ParseFetchService } from './../../parse-fetch.service';
import { accountExtractor } from './parse-account-info.extractor';

import { urlAccountInfo } from '../../parse-url';
import { Injectable, Logger } from '@nestjs/common';
import { logger } from 'src/helpers/logger';
@Injectable()
export class ParseAccountInfoStrategy {
  constructor(
    private parseFetch: ParseFetchService,
    private detectService: DetectService,
  ) {}
  async fetch(username: string) {
    const response = await this.parseFetch.fetch(urlAccountInfo(username));
    return response;
  }
  // add text blacklist word filter and
  async exec(username: string) {
    logger.info(`START <ParseAccountInfoStrategy> for ${username}`);
    logger.info('Fetching ' + username);
    const response = await this.fetch(username);
    logger.info('Fetched ' + username);

    const result = this.extract(response);
    logger.info('Start analyze photo ' + username);
    const photoInfo = await this.analyzePhotos(result);

    const textAnalyze = this.analyzeTexts(result);
    const fullResult = { ...result, ...photoInfo };
    const isAllowed = this.isAllowed(fullResult);
    logger.info(`END <ParseAccountInfoStrategy> Allowed: ${isAllowed}`);
    return {
      isAllowed,
      result: fullResult,
    };
  }
  isAllowed(result) {
    if (!result.age || result.age < 14) return false;
    return true;
  }
  analyzeTexts(result) {}
  async analyzePhotos(result) {
    let activePhoto = -1;
    let location = {};
    let info = await this.getAgeAndGender(result.photo);
    logger.info('First photo info', info);
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
        if (!Object.keys(location).length) {
          location = currentPhoto.location;
        } else {
          // location?.name === currentPhoto.location.name;
        }
      }
      if (Object.keys(location).length && info) break;
    }
    return { ...info, activePhoto, location };
  }
  async getAgeAndGender(photo: string) {
    return this.detectService.detect(photo);
  }
  extract(response: any) {
    const result = accountExtractor(response.graphql.user);
    return result;
  }
}
