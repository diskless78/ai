import type { Roles } from '../common/models.enum';

export interface ILoginRequest {
  email: string | null;
  password: string | null;
}

export interface ILoginResponse {
  token: string;
  expiration: string;
  user: {
    accountId: string;
    email: string;
    firstName: string;
    isActive: boolean;
    lastName: string;
    role: Roles;
    username: string;
  };
}

export type IUserLogin = ILoginResponse;

export interface IUpdatePasswordReq {
  oldPassword?: string;
  newPassword: string;
  confirmPassword?: string;
}
