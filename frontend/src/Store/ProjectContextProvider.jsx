import { createContext, useContext, useState } from "react";

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
  const [projectsState, setProjectsState] = useState({
    projects: [],
    selectedProjectId: undefined,
  });

  function handleSelectProject(id) {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: id,
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
      const newProject = {
        ...project,
        id: prevState.projects.length + 1,
      };

      return {
        ...prevState,
        projects: [...prevState.projects, newProject],
      };
    });
  }

  function handleProjectDelete() {
    console.log(projectsState);
    setProjectsState((prevState) => {
      const filteredOut = prevState.projects.filter((project) => {
        return project.id !== prevState.selectedProjectId;
      });

      return {
        ...prevState,
        selectedProjectId: undefined,
        projects: filteredOut,
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

  function handleAddProjectTasks(task) {
    const projectIndex = projectsState.projects.findIndex((project) => {
      return project.id === projectsState.selectedProjectId;
    });

    projectsState.projects[projectIndex].tasks.push(task);

    setProjectsState((prevState) => {
      return {
        ...prevState,
        projects: [...prevState.projects],
      };
    });
  }

  function removeTaskFromProject(id) {
    const projectIndex = projectsState.projects.findIndex((project) => {
      return project.id === projectsState.selectedProjectId;
    });
    projectsState.projects[projectIndex].tasks = projectsState.projects[
      projectIndex
    ].tasks.filter((task) => {
      return task.id !== id;
    });

    setProjectsState((prevState) => {
      return {
        ...prevState,
        projects: [...prevState.projects],
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
