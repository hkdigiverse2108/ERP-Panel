import { useAppSelector } from "../../Store/hooks";
import type { Params } from "../../Types";

export const useCompanyFinancialYears = (isoDate?: string) => {
  if (!isoDate) return [];
  const createdDate = new Date(isoDate);
  const today = new Date();

  const getFYStartYear = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return month < 3 ? year - 1 : year;
  };

  const creationFY = getFYStartYear(createdDate);
  const currentFY = getFYStartYear(today);

  const buildRange = (startYear: number) => {
    const start = new Date(Date.UTC(startYear, 3, 1));
    const end = new Date(Date.UTC(startYear + 1, 2, 31, 23, 59, 59, 999));

    return {
      label: `${startYear} - ${startYear + 1}`,
      value: `${start.toISOString()} - ${end.toISOString()}`,
    };
  };

  const years = [];

  // 🔥 CONDITION
  if (creationFY >= currentFY) {
    // 👉 Only current FY
    return [buildRange(currentFY)];
  }

  // 👉 Show full range (one year before creation)
  const startFY = creationFY - 1;

  for (let fy = startFY; fy <= currentFY; fy++) {
    years.push(buildRange(fy));
  }

  return years;
};

export const useFinancialYearsFilter = (params?: Params) => {
  const { company } = useAppSelector((state) => state.company);

  if (!company?.financialYear) return params;
  const startDate = company?.financialYear.split(" - ")[0];
  const endDate = company?.financialYear.split(" - ")[1];
  return {
    // ...(params || {}),
    startDate: params?.startDate || startDate,
    endDate: params?.endDate || endDate,
  };
};

export const useBranchFilter = (params?: Params) => {
  const { isBranch } = useAppSelector((state) => state.company);
  const { user } = useAppSelector((state) => state.auth);

  if (!isBranch || !user?.branchId?.isHeadBranch) return params;
  return {
    branchFilter: isBranch,
  };
};
