interface UserItem {
  id?: string;
  sub?: string;
}

export interface User extends UserItem {
  _id?: string;
}
