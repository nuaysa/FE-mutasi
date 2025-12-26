export interface Mutation {
  id?: string;
  date: string;
  type?: "income" | "outcome";

  amount: number;
  information: string; // vendor / santri
  description?: string;
  category: string; // kategori / sumber
}
