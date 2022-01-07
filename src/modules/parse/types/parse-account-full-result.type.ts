import { ParseAccountPhotoResult } from './parse-account-photo-result.type';
import { ParseAccountExtractedResult } from './parse-account-extracted-result.type';
export type ParseAccountFullResult = ParseAccountExtractedResult &
  ParseAccountPhotoResult;
