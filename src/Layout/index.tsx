import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../Store/hooks";
import { setIsMobile } from "../Store/Slices/LayoutSlice";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  const { isExpanded, isMobileOpen, isHovered } = useAppSelector((state) => state.layout);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      dispatch(setIsMobile(isMobile));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);
  return (
    <div className="min-h-screen xl:flex overflow-hidden">
      <div>
        <Sidebar />
      </div>
      <div className={`flex-1 transition-all duration-300 ease-in-out pt-16 lg:pt-20 ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"} ${isMobileOpen ? "ml-0" : ""}`}>
        <Header />
        <div className="p-4 mx-auto md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
