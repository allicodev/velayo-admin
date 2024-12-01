import { UserCreditData } from "@/types";

const processWithTotal = (u: UserCreditData): UserCreditData => {
  let availableCredit =
    u.history == null || u.history.length == 0
      ? u.maxCredit
      : u.history.reduce(
          (p, n) =>
            p -
            (n.status == "completed"
              ? 0
              : n.history.reduce(
                  (pp, nn) => pp + parseFloat(nn.amount.toString()),
                  0
                )),
          u.maxCredit
        );
  return { ...u, availableCredit };
};

export { processWithTotal };
