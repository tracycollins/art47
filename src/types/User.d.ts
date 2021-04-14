interface UserItem {
  id?: string;
  sub?: string;
  oauthID?: string;
  image?: string;
  picture?: string;
}

export interface User extends UserItem {
  _id?: string;
}
