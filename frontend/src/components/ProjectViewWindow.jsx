import { useContext } from "react";
import Sidebar from "./Sidebar";
import NewProject from "./NewProject";
import NoProjectSelected from "./NoProjectSelected";
import SelectedProject from "./SelectedProject";
import ProjectContextProvider, {
  ProjectContext,
} from "../Store/ProjectContextProvider";

export default function ProjectViewWindow() {
  const { projectData, ...operations } = useContext(ProjectContext);

  const project = projectData.projects.find(
    (project) => project.id === projectData.selectedProjectId
  );

  return (
    <div className=" h-screen my-8 flex gap-8 m-0">
      <Sidebar
        onStartAddProject={operations.startAddProject}
        projectsList={projectData.projects}
        onSelectProject={operations.selectProject}
      />
      {projectData.selectedProjectId === undefined && (
        <NoProjectSelected onStartAddProject={operations.startAddProject} />
      )}
      {projectData.selectedProjectId === null && (
        <NewProject
          onSave={operations.addNewProject}
          onCancel={operations.noProjectSelected}
        />
      )}
      {projectData.selectedProjectId && (
        <SelectedProject
          project={project}
          onDelete={operations.deleteProject}
        />
      )}
    </div>
  );
}
