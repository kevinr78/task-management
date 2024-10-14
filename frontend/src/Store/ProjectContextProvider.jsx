import { createContext, useEffect, useState, useCallback, useRef } from "react";
import sendAPIRequest from "../utils/ApiRequest";
import { useParams, useNavigate } from "react-router-dom";
/* import io, { socket } from "../utils/socket"; */
import io from "socket.io-client";
import { toast } from "react-toastify";
import { userDetails } from "../utils/user";

export const ProjectContext = createContext({
  projectData: {},
  selectProject: () => {},
  noProjectSelected: () => {},
  addNewProject: () => {},
  deleteProject: () => {},
  startAddProject: () => {},
  addProjectTask: () => {},
  removeTask: () => {},
  markTask: () => {},
});

const SOCKET_SERVER_URL = "http://localhost:8080";

export default function ProjectContextProvider({ children }) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projectsState, setProjectsState] = useState({
    projects: [],
    selectedProjectId: undefined,
    currentSelectedProject: null,
  });
  const id = localStorage.getItem("id");

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);
    socketRef.current.on("connect", () => {
      console.log("Connected IO");
    });
    socketRef.current.on("disconnect", () => {
      console.log("DisConnected IO");
    });

    socketRef.current.on("notification", (data) => {
      toast.info(data);
      fetchAllProjects();
    });

    socketRef.current.emit("register", id);

    return () => {
      socketRef.current.off("connect", () => {
        console.log(" Off Connected IO");
      });
      socketRef.current.off("notification");
      socketRef.current.off("disconnect", () => {
        socketRef.current.log("DIsConnected IO");
      });
    };
  }, []);

  const fetchAllProjects = async () => {
    const request = await sendAPIRequest("GET", null, "getAllProjects");

    if (!request.ok) {
      toast.error("Error while getting projects");

      return;
    }

    setProjectsState((prevState) => ({
      ...prevState,
      projects: request.data,
    }));
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  /* useEffect(() => {
    if (!projectId) return;

    const fetchSelectedProject = async () => {
      const { ok, data } = await sendAPIRequest(
        "POST",
        { id: projectId, userId: localStorage.getItem("id") },
        "getProject"
      );

      if (!ok) {
        console.error("Error while getting project");
        return;
      }

      setProjectsState((prevState) => ({
        ...prevState,
        selectedProjectId: projectId,
        currentSelectedProject: data,
      }));
    };

    fetchSelectedProject();
  }, [projectId]); */

  const handleSelectProject = useCallback((data) => {
    setProjectsState((prevState) => ({
      ...prevState,
      selectedProjectId: data._id,
      currentSelectedProject: data,
    }));
  }, []);

  const showNoProjectSelected = useCallback(() => {
    setProjectsState((prevState) => ({
      ...prevState,
      selectedProjectId: undefined,
    }));
  }, []);

  const handleAddNewProject = useCallback((project) => {
    setProjectsState((prevState) => ({
      ...prevState,
      projects: [
        ...prevState.projects,
        { _id: project.projectId, title: project.title },
      ],
    }));
  }, []);

  const handleProjectDelete = useCallback(async () => {
    const request = await sendAPIRequest(
      "POST",
      { id: projectsState.selectedProjectId },
      "deleteProject"
    );

    if (!request.ok) {
      toast.error("Error while deleting project");
      return;
    }

    const updatedProjects = projectsState.projects.filter(
      (project) => project._id !== request.data._id
    );

    socketRef.current.emit("projectDelete", { id });
    socketRef.current.disconnect();
    navigate("/home");
    setProjectsState((prevState) => ({
      ...prevState,
      selectedProjectId: undefined,
      currentSelectedProject: null,
      projects: updatedProjects,
    }));
  }, [projectsState.selectedProjectId, projectsState.projects]);

  const handleStartAddProject = useCallback(() => {
    setProjectsState((prevState) => ({
      ...prevState,
      selectedProjectId: null,
    }));
  }, []);

  const handleAddProjectTasks = useCallback(
    async ({ taskTitle, assignedTo }) => {
      const request = await sendAPIRequest(
        "POST",
        {
          id: projectsState.selectedProjectId,
          assignedTo,
          taskTitle,
          completed: false,
        },
        "addTaskToProject"
      );

      if (!request.ok) {
        toast.error("Error while adding tasks to project");
        return;
      }
      const tasks = request.data.tasks;
      const message = `Task ${taskTitle} has been added to project ${
        request.data.title
      } and assigned to ${tasks[tasks.length - 1].username}`;

      /*   const sendNotificationRequest = await sendAPIRequest(
        "POST",
        {
          from: request.data.by_user,
          to: assignedTo,
          message,
        },
        "sendNotification"
      );

      if (!sendNotificationRequest.ok) {
        console.error("Error while sending notification");
        return;
      } */

      socketRef.current.emit("notification", {
        from: request.data.by_user,
        to: assignedTo,
        message,
      });
      socketRef.current.disconnect();

      setProjectsState((prevState) => ({
        ...prevState,
        currentSelectedProject: request.data,
      }));
    },
    [projectsState.selectedProjectId]
  );

  const removeTaskFromProject = useCallback(
    async (id) => {
      const request = await sendAPIRequest(
        "POST",
        { id: projectsState.selectedProjectId, taskId: id },
        "removeTaskFromProject"
      );

      if (!request.ok) {
        toast.error("Error while removing task from project");
        return;
      }

      socketRef.current.emit("removeTask", {
        from: request.data.by_user,
        pid: projectsState.selectedProjectId,
        taskId: id,
      });
      socketRef.current.disconnect();

      setProjectsState((prevState) => ({
        ...prevState,
        currentSelectedProject: {
          ...prevState.currentSelectedProject,
          tasks: prevState.currentSelectedProject.tasks.filter((task) => {
            return task._id !== id;
          }),
        },
      }));
    },
    [projectsState.currentSelectedProject]
  );

  const markTaskAsCompleted = async (id, isChecked) => {
    const userId = userDetails.id || localStorage.getItem("id");
    const request = await sendAPIRequest(
      "POST",
      { pid: projectsState.selectedProjectId, taskId: id, userId, isChecked },
      "markTaskAsCompleted"
    );

    if (!request.ok) {
      toast.error("Error while marking task as completed");
      return;
    }

    
  };

  const projectContext = {
    projectData: projectsState,
    selectProject: handleSelectProject,
    noProjectSelected: showNoProjectSelected,
    addNewProject: handleAddNewProject,
    deleteProject: handleProjectDelete,
    startAddProject: handleStartAddProject,
    addProjectTask: handleAddProjectTasks,
    removeTask: removeTaskFromProject,
    markTask: markTaskAsCompleted,
  };

  return (
    <ProjectContext.Provider value={projectContext}>
      {children}
    </ProjectContext.Provider>
  );
}
