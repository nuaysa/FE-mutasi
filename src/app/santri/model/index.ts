import { Mutation } from "@/app/_mutation/model";

export interface Santri {
  id?: string;
  name: string;
  grade: string;
  status: string;
  generation: number;
  deposit?: number;
  debt?: debt[];
  totalDebt?: number;
  transactions?: Mutation[];
}

export interface debt {
  id: string;
  info: string;
  totalAmount: string;
  remainingAmount: string;
  createdAt: string;
  status: string;
}

