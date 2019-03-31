import { User } from './user';


/**
 * Class that will hold the Authentication Response data once the user is logged in.
 */
export class AuthenticationResponse {
  success: boolean;
  token?: string;
  user?: User;
  msg?: string;
}

/**
 * Class that will hold the login information upon login
 */
export class UserInformation {
  username: string;
  password: string;
}
