import { useEffect, useState } from "react";
import { message } from "antd";

import UserService from "@/provider/user.service";
import { PayslipGeneratorProp, User } from "@/types";

const usePayslipGenerator = (prop: PayslipGeneratorProp) => {
  const { userId, cashAdvance, errors } = prop;
  const userService = new UserService();
  const [user, setUser] = useState<User | null>(null);
  const [totalDeduction, setTotalDeduction] = useState(0);
  const [totalEarningWithTax, setTotalEarningWithTax] = useState(0);

  const getUser = async (_id: string) => {
    if (_id != "") {
      let {
        success,
        data,
        message: ApiMessage,
      } = await userService.getUsers({ employeeId: "true", _id: userId });

      if (success ?? false) {
        let user = data as any as User;
        setUser(user);

        setTotalDeduction(
          (user?.deductions ?? []).reduce((p, n) => p + n.amount / 2, 0)
        );

        setTotalEarningWithTax(user?.baseSalary ?? 0);
      } else message.error(ApiMessage ?? "Error in the Server");
    }
  };

  const totalError = errors.reduce((p, n) => p + n.amount, 0);
  const totalCashAdvance = cashAdvance.reduce((p, n) => p + n.amount, 0);

  const deductions = {
    error: totalError,
    totalDeduction,
    totalCashAdvance,
    total: (totalDeduction || 0) + (totalCashAdvance || 0) + (totalError || 0),
  };

  useEffect(() => {
    getUser(userId);
  }, [userId]);

  return { user, deductions, totalEarningWithTax };
};

export default usePayslipGenerator;
