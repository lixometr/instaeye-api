import { Injectable } from '@nestjs/common';
import { ParseAccountExtractedResult } from '../../types/parse-account-extracted-result.type';
import { ParseAccountTextResult } from '../../types/parse-account-text-result.type';
import textBlacklist from './text-blacklist';

@Injectable()
export class ParseAccountTextStrategy {
  findAge(str: string) {
    const result = str.match(/(\d+?)\s*?y\.?\s*?o\.?/im);
    if (!result) return;
    const [_, age] = result;
    return parseInt(age);
  }
  hasBlackWords(str = '') {
    return !textBlacklist.every((word) => {
      const result = str.match(new RegExp(`${word}`, 'im'));
      return !result;
    });
  }
  async exec(
    result: ParseAccountExtractedResult,
  ): Promise<ParseAccountTextResult> {
    const { username, name, description } = result;
    const age = this.findAge(description);
    let isAllowed = true;
    const hasBlackWords = [name, description]
      .map((item) => this.hasBlackWords(item))
      .includes(true);

    if (hasBlackWords) {
      isAllowed = false;
    }
    let location;
    return { age, isAllowed, location };
  }
}
