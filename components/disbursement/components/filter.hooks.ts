import { useCallback } from "react";
import {
  useDispatch,
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
} from "react-redux";
import Excel from "exceljs";
import _ from "lodash";

import { RootState } from "@/provider/redux/store";
import { updateFilter } from "@/provider/redux/filterSlice/filterSlice";
import dayjs from "dayjs";
import { message } from "antd";
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

const useDisbursementFilter = () => {
  const [reduxTeller, reduxFilter, reduxLogs] = useSelector(
    (state: RootState) => [
      state.teller.data,
      state.filter.disbursement,
      state.logs,
    ]
  );
  const dispatch = useDispatch();

  const getTellerList = useCallback(
    () =>
      (reduxTeller || []).map((e) => ({
        label: e.name,
        value: e.name,
        key: e._id,
      })),
    [reduxTeller]
  );

  const updateDisbursementFilter = (key: string, value: any) =>
    dispatch(
      updateFilter({
        key: "disbursement",
        value: { ...reduxFilter, [key]: value },
      })
    );

  const bulkUpdateDisbursementFilter = (val: Object) => {
    dispatch(
      updateFilter({
        key: "disbursement",
        value: val,
      })
    );
  };

  const exportExcel = () => {
    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet("Disbursement Report");
    const user =
      !_.isEmpty(reduxFilter) && reduxFilter.teller != null
        ? getTellerList().find((ea) => ea.key == reduxFilter.teller)
        : null;

    sheet.properties.defaultRowHeight = 20;
    sheet.mergeCells("A1:E1");
    sheet.getCell("A1").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    sheet.getCell("A1").font = {
      family: 4,
      size: 18,
      bold: true,
    };
    sheet.getCell("A1").value = `DISBURSEMENT Report (${dayjs().format(
      "MMMM DD, YYYY"
    )})${user ? ` - ${user}` : ""}`;
    sheet.getRow(2).values = ["Type", "Amount", "Reason", "Cash From", "Date"];
    sheet.columns = [
      {
        key: "subType",
        width: 20,
      },
      {
        key: "amount",
        width: 20,
      },
      {
        key: "remarks",

        width: 40,
      },
      {
        key: "cash_from",

        width: 40,
      },
      {
        key: "createdAt",

        width: 20,
      },
    ];

    (reduxLogs?.data || []).map((e: any) => {
      const attr = JSON.parse(e.attributes ?? "{}");
      sheet.addRow({
        subType: `${e.subType}${
          attr.is_initial_balance ? " (Initial Amount)" : ""
        } `,
        amount: `${e.amount?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        remarks: attr.remarks,
        cash_from: attr.cash_from,
        createdAt: dayjs(e.createdAt).format("MMMM DD, YYYY"),
      });
    });

    // styles
    (reduxLogs.data || []).map((e: any, i: number) => {
      sheet.getCell(`A${i + 3}`).alignment = {
        vertical: "middle",
      };
      sheet.getCell(`B${i + 3}`).alignment = {
        horizontal: "right",
      };
      sheet.getCell(`C${i + 3}`).alignment = {
        wrapText: true,
      };
      sheet.getCell(`D${i + 3}`).alignment = {
        wrapText: true,
      };
      sheet.getCell(`E${i + 3}`).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
    });

    let s = (str: string) =>
      sheet.getCell(
        `${str.toLocaleUpperCase()}${(reduxLogs.data || []).length + 3}`
      );
    s("a").font = {
      family: 4,
      size: 14,
      bold: true,
    };
    s("a").value = "TOTAL";
    s("b").value = `₱${(reduxLogs.data || [])
      .reduce((p: number, n: any) => p + (n.amount ?? 0), 0)
      .toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    s("b").alignment = {
      horizontal: "right",
    };
    ["A", "B", "C", "D", "E"].map((e) => {
      sheet.getCell(`${e}2`).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      sheet.getCell(`${e}2`).font = {
        family: 4,
        size: 12,
        bold: true,
      };
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `REPORT-${dayjs().format("MM/DD/YYYY")}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);

      message.success("Exported to Excel successfully");
    });
  };

  return {
    userList: getTellerList(),
    updateFilter: updateDisbursementFilter,
    bulkUpdateFilter: bulkUpdateDisbursementFilter,
    exportExcel,
  };
};

export default useDisbursementFilter;
