import type { IUser } from 'src/models/user';

export interface IReduxAuthState {
  isAuthenticated: boolean;
  token: string | null;
  token_type: string | null;
  user: IUser | null;
}
