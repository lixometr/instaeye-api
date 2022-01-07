import { ParseAccountExtractedResult } from '../../types/parse-account-extracted-result.type';
import { accountGalleryExtracter } from './parse-account-photo.extracter';

export const accountExtractor = (user: any): ParseAccountExtractedResult => {
  const username = user.username;
  const description = user.biography;
  const followers = user.edge_followed_by?.count;
  const subscriptions = user.edge_follow?.count;
  const name = user.full_name;
  const photo = user.profile_pic_url_hd || user.profile_pic_url;
  const isBusiness = user.is_business_account;
  const isProffessional = user.is_professional_account;
  const businessCategory = user.business_category_name;
  const categoryName = user.category_name;
  const isPrivate = user.is_private;
  const isVerified = user.is_verified;
  const galleryInfo = user.edge_owner_to_timeline_media;
  const postsCount = galleryInfo.count;
  const photosArr = galleryInfo.edges || [];
  const gallery = accountGalleryExtracter(photosArr);
  const userId = user.id;
  return {
    postsCount,
    gallery,
    description,
    followers,
    subscriptions,
    name,
    photo,
    isBusiness,
    isProffessional,
    businessCategory,
    categoryName,
    isPrivate,
    username,
    userId,
  };
};
