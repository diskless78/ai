export interface IUser {
  email: string;
  name: string | null;
  product: string | null;
  box_number: string | null;
  phone_number: string | null;
}

export interface GetUserInfoResponse {
  data: IUser;
}
