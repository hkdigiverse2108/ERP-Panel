import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { Box, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { Mutations } from "../../Api";
import { useAppDispatch, useAppSelector } from "../../Store/hooks";
import { setCompany } from "../../Store/Slices/CompanySlice";
import { useClickOutside } from "../../Utils/Hooks";

const FinancialYear = () => {
  const { financialYear, company } = useAppSelector((state) => state.company);

  const { mutate: editCompanyMutate, isPending: isEditLoading } = Mutations.useEditCompany();

  const dispatch = useAppDispatch();

  const { open, setOpen, wrapperRef } = useClickOutside();

  const financialYearData = financialYear?.find((item) => item.value === company?.financialYear);

  const handleOnSubmit = (financialYear: string) => {
    editCompanyMutate(
      { companyId: company?._id, financialYear },
      {
        onSuccess: (response) => {
          dispatch(setCompany(response?.data));
          setOpen(false);
          window.location.reload();
        },
      },
    );
  };

  // 📱 Mobile → outside click close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open && window.innerWidth < 1024) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  return (
    <Box
      ref={wrapperRef}
      className="relative group"
      onMouseEnter={() => {
        if (window.innerWidth >= 1024) setOpen(true);
      }}
      onMouseLeave={() => {
        if (window.innerWidth >= 1024) setOpen(false);
      }}
    >
      {/* Trigger */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (window.innerWidth < 1024) {
            setOpen((prev) => !prev);
          }
        }}
        className="flex items-center justify-center w-fit px-2 h-10 max-sm:text-xs text-sm text-gray-500 border border-gray-200 rounded-lg z-[99999] dark:border-gray-800 dark:text-gray-400 cursor-pointer"
      >
        {isEditLoading ? <CircularProgress color="primary" size={14} /> : financialYearData?.label || "Select Year"}
      </div>

      {/* Dropdown */}
      <div
        className={`fixed lg:absolute max-lg:left-1 max-lg:right-1 lg:right-0 mt-3 flex min-w-[200px] max-w-[330px] flex-col rounded-xl border border-gray-50 bg-white shadow-tooltip dark:border-gray-800 dark:bg-gray-dark z-50 transition-all duration-200 ease-out
        ${open ? "opacity-100 visible scale-100 translate-y-0" : "opacity-0 invisible scale-95 translate-y-2"}`}
      >
        {/* Header */}
        <div className="flex justify-center items-center p-3 mb-3 border-b border-gray-300 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Financial Year</h5>
        </div>

        {/* List */}
        <div className="px-3 pb-3 max-h-[250px] overflow-y-auto custom-scrollbar">
          <ul className="flex flex-col gap-3">
            {financialYear?.map((item, index) => (
              <li key={index} onClick={() => handleOnSubmit(item.value)} className="flex items-center gap-3 border-b py-3 border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md px-2 transition">
                <CalendarMonthOutlinedIcon className="text-gray-700 dark:text-gray-300" />
                <span className="text-gray-800 dark:text-gray-300">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Box>
  );
};

export default FinancialYear;
