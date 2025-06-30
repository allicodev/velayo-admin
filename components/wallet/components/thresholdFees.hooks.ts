import { useEffect, useState } from "react";
import _ from "lodash";

import {
  ThresholdFees,
  ThresholdFeesColumn,
  ThresholdModalProps,
} from "./threshold.types";
import { Form, message } from "antd";
import FeeService from "@/provider/fee.service";

const useThresholdFees = (props: ThresholdFees) => {
  const { walletId, subType } = props ?? {};
  const [form] = Form.useForm();

  const [openThreshold, setOpenThreshold] = useState<ThresholdModalProps>({
    open: false,
    type: "new",
  });
  const [selectedThreshold, setSelectedThreshold] =
    useState<ThresholdFeesColumn | null>(null);
  const [feesThreshold, setFeesThreshold] = useState<ThresholdFeesColumn[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [trigger, setTrigger] = useState(0);

  const pushNewError = (error: string) => setErrors([...errors, error]);

  const handleNewThreshold = async (
    val: Omit<ThresholdFeesColumn, "type" | "link_id">
  ) => {
    const { minAmount, maxAmount, charge } = val ?? {};

    // basic validation
    if (minAmount > maxAmount)
      pushNewError("Invalid input. Min amount is greater than max amount");
    if ([minAmount, maxAmount, charge].some((e) => e < 0))
      pushNewError("Invalid input. Negative Input.");

    // validation if min or maximum already in range on other threshold
    if (!_.isEmpty(feesThreshold)) {
      for (let i = 0; i < feesThreshold.length; i++) {
        const ft = feesThreshold[i];

        if (
          [ft.minAmount, ft.maxAmount].includes(minAmount) ||
          [ft.minAmount, ft.maxAmount].includes(maxAmount) ||
          (minAmount > ft.minAmount && minAmount < ft.maxAmount) ||
          (maxAmount > ft.minAmount && maxAmount < ft.maxAmount)
        ) {
          pushNewError("Invalid input. Amount entered already in threshold");
          return;
        }
      }
    }

    setErrors([]);
    setOpenThreshold({ open: false, type: "new" });

    let newPayload: ThresholdFeesColumn = {
      ...val,
      subType,
      link_id: walletId!,
      type: "wallet",
    };

    let res = await FeeService.newFeeThreshold(newPayload);

    if (res?.success) {
      message.success(res?.message ?? "Success");
      setTrigger(trigger + 1);
      form.resetFields();
    } else message.error(res?.message ?? "Failed");
  };

  const handleUpdateThreshold = async (
    val: Omit<ThresholdFeesColumn, "type" | "link_id">
  ) => {
    const { minAmount, maxAmount, charge, _id } = selectedThreshold ?? {};
    if (selectedThreshold) {
      // basic validation
      if (minAmount! > maxAmount!)
        pushNewError("Invalid input. Min amount is greater than max amount");
      if ([minAmount, maxAmount, charge].some((e) => e ?? 0 < 0))
        pushNewError("Invalid input. Negative Input.");

      // validation if min or maximum already in range on other threshold
      if (!_.isEmpty(feesThreshold)) {
        for (let i = 0; i < feesThreshold.length; i++) {
          const ft = feesThreshold[i];

          if (
            ft._id != selectedThreshold._id &&
            (ft.minAmount == minAmount ||
              ft.maxAmount == maxAmount ||
              (minAmount! > ft.minAmount && minAmount! < ft.maxAmount) ||
              (maxAmount! > ft.minAmount && maxAmount! < ft.maxAmount))
          ) {
            pushNewError("Invalid input. Amount entered already in threshold");
            return;
          }
        }
      }

      setErrors([]);
      setOpenThreshold({ open: false, type: "new" });

      let newPayload: Partial<ThresholdFeesColumn> = {
        ...val,
        _id,
      };

      let res = await FeeService.newFeeThreshold(newPayload);

      if (res?.success) {
        message.success(res?.message ?? "Success");
        setTrigger(trigger + 1);
      } else message.error(res?.message ?? "Failed");
    }
  };

  const getFees = async () => {
    if (walletId)
      (async (_) => {
        let res = await _.getFeeThreshold("wallet", walletId, { subType });

        if (res?.success ?? false) setFeesThreshold(res?.data ?? []);
      })(FeeService);
  };

  useEffect(() => {
    getFees();
  }, [trigger]);

  return {
    formRef: form,
    modalOption: openThreshold,
    openModal: (type: "new" | "edit") => setOpenThreshold({ open: true, type }),
    closeModal: () => setOpenThreshold({ open: false, type: "new" }),
    handleNewThreshold,
    handleUpdateThreshold,
    errors,
    feesThreshold,
    setSelectedThreshold,
  };
};

export default useThresholdFees;
