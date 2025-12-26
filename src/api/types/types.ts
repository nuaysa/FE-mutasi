export interface GetAllmutationsParams {
  page?: number;
  size?: number;
  date?: string;
  type?: string;
  information?: string; // vendor / santri
}
export interface GetAllsantrisParams {
  page?: number;
  size?: number;
  search?: string;
}

export type LoginParams = {
  email: string;
  password: string;
};

export type LogoutParam = {
  refreshToken: string;
};
