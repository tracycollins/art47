interface UserItem {
  id?: string;
  sub?: string;
  oauthID?: string;
  image?: string;
  picture?: string;
  unrated?: array;
}

export interface User extends UserItem {
  _id?: string;
}
