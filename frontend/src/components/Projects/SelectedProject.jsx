import { useContext, useEffect, useState } from "react";
import { ProjectContext } from "../../Store/ProjectContextProvider";
import { useParams } from "react-router-dom";
import Tasks from "../Tasks/Tasks";
import { userDetails } from "../../utils/user";
import sendAPIRequest from "../../utils/ApiRequest";
import refresh from "../../assets/refresh.svg";
import deleteImg from "../../assets/delete.svg";

export default function SelectedProject({ onDelete }) {
  const { projectData, selectProject, deleteProject } =
    useContext(ProjectContext);
  const { currentSelectedProject } = projectData;
  const [isLoading, setIsLoading] = useState(true);
  const { projectId } = useParams();

  const fetchData = async () => {
    const userId = userDetails.id || localStorage.getItem("id");
    const { ok, data } = await sendAPIRequest(
      "POST",
      { id: projectId, userId },
      "getProject"
    );

    if (!ok) {
      console.error("Error while getting project");
      return;
    }
    selectProject(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();

    return () => {
      setIsLoading(true);
    };
  }, [projectId, selectProject]);

  if (isLoading || !currentSelectedProject) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col p-4 shadow-xl rounded-md max-h-screen">
      <header className="pb-4 mb-4 border-b-2 border-stone-300">
        <div className="flex items-center justify-between">
          <h1 className="text-5xl font-bold text-stone-600 mb-2">
            {currentSelectedProject.title}
          </h1>
          <div className="flex justify-center items-center">
            <button
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete project?")
                ) {
                  deleteProject();
                }
              }}
              className="text-stone-600  hover:text-stone-950 "
            >
              <img src={deleteImg} alt="Delete Icon" srcset="" />
            </button>
            <div className="divider divider-horizontal m-0">|</div>
            <button onClick={fetchData}>
              <img src={refresh} />
            </button>
          </div>
        </div>
        <p className="mb-4 text-stome-400">
          <span>Due By: </span>
          {new Date(currentSelectedProject.dueDate).toLocaleDateString("en-us")}
        </p>
        <div className="text-stone-600 whitespace-pre-wrap">
          <p className="font-semibold">Description</p>
          <p>{currentSelectedProject.description}</p>
        </div>
      </header>
      <Tasks />
    </div>
  );
}
