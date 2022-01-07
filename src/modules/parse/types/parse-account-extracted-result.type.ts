import { ParsePhotoLocation } from './parse-account-photo-result.type';
export interface ParseAccountGalleryItem {
  url: string;
  location: ParsePhotoLocation;
  likes: number
}
export class ParseAccountExtractedResult {
  postsCount: number;
  gallery: ParseAccountGalleryItem[];
  description: string;
  followers: number;
  subscriptions: number;
  name: string;
  photo: string;
  isBusiness: boolean;
  isProffessional: boolean;
  businessCategory: string;
  categoryName: string;
  isPrivate: boolean;
  username: string;
  userId: string;
}
