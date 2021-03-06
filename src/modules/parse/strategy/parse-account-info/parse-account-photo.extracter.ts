import { ParseAccountGalleryItem } from './../../types/parse-account-extracted-result.type';

export enum UserPhotoImageType {
  'GraphSidecar' = 'GraphSidecar',
  'GraphImage' = 'GraphVideo',
  'GraphVideo' = 'GraphVideo',
}
export const accountPhotoExtracter = (photo: any): ParseAccountGalleryItem => {
  const url = photo.display_url;
  const likes = photo.edge_liked_by.count;
  const type = photo.__typename;
  // id, name, slug
  const locationInfo = photo.location;
  const locationName = locationInfo?.name;
  // const locationSlug = locationInfo?.slug;
  // const locationId = locationInfo?.id;

  return {
    url,
    likes,
    location: locationName,
  };
};
export const accountGalleryExtracter = (photos: any[]) => {
  let checked = 0;
  const result = [];
  for (let i = 0; i < photos.length; i++) {
    if (checked >= 3) break;
    const item = photos[i];
    const itemInfo = item.node;
    if (itemInfo.__typename === UserPhotoImageType.GraphVideo) continue;
    result.push(accountPhotoExtracter(item.node));
    checked++;
  }
  return result;
};
