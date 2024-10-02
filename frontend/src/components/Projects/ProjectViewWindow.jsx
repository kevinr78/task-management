import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Utils/Sidebar";
import ProjectContextProvider from "../../Store/ProjectContextProvider";

export default function ProjectViewWindow() {
  return (
    <div className="h-screen w-full flex gap-8 m-0">
      <ProjectContextProvider>
        <Sidebar />
        <div className="flex-1 w-2/3">
          <Outlet />
        </div>
      </ProjectContextProvider>
    </div>
  );
}
