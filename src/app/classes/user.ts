import { Profile } from './profile';
import { Roles } from './roles';

export interface User {
  uid: string;
  email: string;
}


export interface DBUser {
  profile?: Profile;
  roles?: Roles;
}
