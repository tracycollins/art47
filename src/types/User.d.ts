interface UserItem {
  id?: string;
  sub?: string;
  image?: string;
  picture?: string;
}

export interface User extends UserItem {
  _id?: string;
}
