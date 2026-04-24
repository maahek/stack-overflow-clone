import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/Sidebar";
import React, { ReactNode, useEffect, useState } from "react";
import RightSideBar from "@/components/RightSideBar";
interface MainlayoutProps {
  children: ReactNode;
}
const Mainlayout = ({ children }: MainlayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, []);
  const handleslidein = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen((state) => !state);
    }
  };

  return (
    <div className="bg-[#f8f9fa] text-gray-800 min-h-screen flex flex-col overflow-x-hidden">
      
      {/* This is for navbar */}
      <Navbar handleslidein={handleslidein} />

      {/* This is body of the page */}
      <div className="flex flex-1 relative w-full overflow-hidden">

        {/* This I added for mobile sidebar, so that when the sidebar is open, the rest of the page will be in backgroud and you can click main page sidebar will be closed */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-opacity-40 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed md:static top-0 left-0 z-50 h-full w-64 bg-white
            transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
          `}
        >
          <Sidebar isopen={sidebarOpen} />
        </div>
        <div className="flex flex-1">
          <main className="flex-1 p-4 lg:p-6 bg-white min-w-0">
            {children}
          </main>
          <div className="hidden lg:block w-64 border-l">
            <RightSideBar />
          </div>

        </div>
      </div>
    </div>
  );
};
export default Mainlayout;
