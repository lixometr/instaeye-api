export const urlAccountInfo = (username: string) => {
  return `https://instagram.com/${username}/?__a=1`;
};

export const urlLocation = (locationId: string, locationSlug: string) =>
  `https://instagram.com/explore/locations/${locationId}/${locationSlug}/?__a=1`;

export const urlFollowers = (userId: string, maxId) => {
  let url = `https://i.instagram.com/api/v1/friendships/${userId}/followers/?count=12&search_surface=follow_list_page`;
  if (!maxId) return url;
  url += `&max_id=${maxId}`;
  return url;
};
