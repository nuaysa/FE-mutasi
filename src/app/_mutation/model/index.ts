export interface Mutation {
  id: string;

  date: string;
  type: "income" | "expense";

  amount: number;
  description?: string;

  categoryId: string;
  category?: {
    id: string;
    name: string;
  };

  santriId?: string | null;
  santri?: {
    id: string;
    name: string;
  };

  vendorId?: string | null;
  vendor?: {
    id: string;
    name: string;
  };
  createdAt?: string;
  debtId?: string | null;
  purpose: "deposit_topup" | "deposit_withdrawal" | "debt_created" | "debt_payment" | "other";
}

