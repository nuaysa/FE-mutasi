export interface GetAllmutationsParams {
  page?: number;
  size?: number;
  date?: string;
  type?: string;
  vendorId?: string; // vendor / santri
  categoryId?: string;
}

export interface InputMutationParams {
  date: string;
  type: "income" | "expense";
  purpose: "deposit_topup" |"deposit_withdrawal" |  "debt_created" | "debt_payment" | "other";
  amount: number;
  description?: string;
  categoryId: string;
  santriId?: string | null;
  debtId?: string | null;
  vendorId?: string | null;
}

export interface InputSantriParams {
  id?: string;
  name: string;
  grade: string;
  generation: number;
  status: string;
}

export interface InputUserParams {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface GetAllsantrisParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  generation?: string;
}

export type LoginParams = {
  data: string;
  password: string;
};

export type LogoutParam = {
  token: string;
};

export type profileParam = {
  id: string;
};

export type debt = {
  id: string;
  remainingAmount: string;
  totalAmount: string;
  createdAt: string;
};

export type settingsParam = {
  name: string;
};
