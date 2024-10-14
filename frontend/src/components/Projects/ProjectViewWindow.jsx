import { useContext, useEffect } from "react";

import { Outlet } from "react-router-dom";
import Sidebar from "../Utils/Sidebar";
import ProjectContextProvider from "../../Store/ProjectContextProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProjectViewWindow() {
  return (
    <div className="h-screen w-full flex gap-8 m-0">
      <ProjectContextProvider>
        <Sidebar />
        <div className="flex-1 w-2/3">
          <Outlet />
        </div>
      </ProjectContextProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={100000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        transition:Bounce
      />
    </div>
  );
}
