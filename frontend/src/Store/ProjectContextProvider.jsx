import { createContext, useContext, useEffect, useState } from "react";
import sendAPIRequest from "../utils/ApiRequest";
import { useParams } from "react-router-dom";

export const ProjectContext = createContext({
  projectData: {},
  selectProject: () => {},
  noProjectSelected: () => {},
  addNewProject: () => {},
  deleteProject: () => {},
  startAddProject: () => {},
  addProjectTask: () => {},
  removeTask: () => {},
});
export default function ProjectContextProvider({ children }) {
  const { projectId } = useParams();
  const [projectsState, setProjectsState] = useState({
    projects: [],
    selectedProjectId: undefined,
    currentSelectedProject: undefined,
  });

  useEffect(() => {
    const fetchData = async () => {
      const request = await sendAPIRequest("GET", null, "getAllProjects");

      if (!request.ok) {
        console.error("Error while getting projects");
        return;
      }
      setProjectsState({
        projects: request.data,
        selectedProjectId: undefined,
        currentSelectedProject: undefined,
      });
    };
    fetchData();
  }, []);

  async function handleSelectProject(data) {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: data._id,
        currentSelectedProject: data,
      };
    });
  }

  function showNoProjectSelected() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: undefined,
      };
    });
  }

  function handleAddNewProject(project) {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        projects: [
          ...prevState.projects,
          { _id: project.projectId, title: project.title },
        ],
      };
    });
  }

  async function handleProjectDelete() {
    console.log(projectsState);
    const request = await sendAPIRequest(
      "POST",
      { id: projectsState.selectedProjectId },
      "deleteProject"
    );

    if (!request.ok) {
      console.error("Error while deleting project");
      return;
    }

    const somet = projectsState.projects.filter((project) => {
      return project._id !== request.data._id;
    });

    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: undefined,
        projects: somet,
      };
    });
  }

  function handleStartAddProject() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: null,
      };
    });
  }

  async function handleAddProjectTasks(task) {
    const request = await sendAPIRequest(
      "POST",
      { id: projectsState.selectedProjectId, task, completed: false },
      "addTaskToProject"
    );

    if (!request.ok) {
      console.error("Error while adding tasks to project");
      return;
    }

    setProjectsState((prevState) => {
      return {
        ...prevState,
        currentSelectedProject: request.data,
      };
    });
  }

  async function removeTaskFromProject(id) {
    const request = await sendAPIRequest(
      "POST",
      { id: projectsState.selectedProjectId, taskId: id },
      "removeTaskFromProject"
    );

    if (!request.ok) {
      console.error("Error while adding tasks to project");
      return;
    }

    setProjectsState((prevState) => {
      return {
        ...prevState,
        currentSelectedProject: request.data,
      };
    });
  }

  const projectContext = {
    projectData: projectsState,
    selectProject: handleSelectProject,
    noProjectSelected: showNoProjectSelected,
    addNewProject: handleAddNewProject,
    deleteProject: handleProjectDelete,
    startAddProject: handleStartAddProject,
    addProjectTask: handleAddProjectTasks,
    removeTask: removeTaskFromProject,
  };

  return (
    <ProjectContext.Provider value={projectContext}>
      {children}
    </ProjectContext.Provider>
  );
}
