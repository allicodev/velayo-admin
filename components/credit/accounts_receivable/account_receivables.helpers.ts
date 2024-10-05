import { UserCredit } from "@/types";

const getAccountName = (id: string, accounts: UserCredit[]) => {
  let account = (accounts || []).find((e) => e._id == id);

  if (account) return account.name + " " + account.lastname;
  return null;
};

export { getAccountName };
