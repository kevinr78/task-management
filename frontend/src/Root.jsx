import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProjectContext } from "./Store/ProjectContextProvider";
import { useContext } from "react";
import NoProjectSelected from "./components/Projects/NoProjectSelected";
import NewProject from "./components/Projects/NewProject";
import SelectedProject from "./components/Projects/SelectedProject";
import Registration from "./components/Registration/Registration";

export default function Root() {
  const { projectData, ...operations } = useContext(ProjectContext);

  const router = createBrowserRouter([
    {
      path: "/home",
      element: <App />,
      children: [
        {
          path: "",
          element: (
            <NoProjectSelected onStartAddProject={operations.startAddProject} />
          ),
          index: true,
        },
        {
          path: "newProject",
          element: (
            <NewProject
              onSave={operations.addNewProject}
              onCancel={operations.noProjectSelected}
            />
          ),
        },
        {
          path: "project/:projectId",
          element: <SelectedProject onDelete={operations.deleteProject} />,
        },
      ],
    },
    {
      path: "/",
      element: <Registration />,
    },
  ]);
  return <RouterProvider router={router} />;
}
