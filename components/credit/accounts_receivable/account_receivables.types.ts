import { User } from "@/types";

export interface AccountReceivable {
  userId: string | User;
  amount: number;
  date: Date;
  description: string;
}

export interface AccountFilters {
  id?: string | null;
}
