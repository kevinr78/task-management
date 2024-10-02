import { useContext, useEffect, useState } from "react";
import { ProjectContext } from "../../Store/ProjectContextProvider";
import { useLoaderData, useParams } from "react-router-dom";
import Tasks from "../Tasks/Tasks";
import sendAPIRequest from "../../utils/ApiRequest";

export default function SelectedProject({ onDelete }) {
  const { projectData, ...operations } = useContext(ProjectContext);
  const { currentSelectedProject } = projectData;
  const [isLoading, setIsLoading] = useState(true);
  const { projectId } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      const { ok, data } = await sendAPIRequest(
        "POST",
        { id: projectId },
        "getProject"
      );

      if (!ok) {
        console.error("Error while getting project");
        return;
      }
      operations.selectProject(data);
      setIsLoading(false);
    };
    fetchData();
  }, [projectId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col p-4 shadow-xl rounded-md  max-h-screen">
      <header className="pb-4 mb-4 border-b-2 border-stone-300">
        <div className="flex items-center justify-between">
          <h1 className="text-5xl font-bold text-stone-600 mb-2">
            {projectData.currentSelectedProject.title}
          </h1>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete project?")) {
                operations.deleteProject();
              }
              return;
            }}
            className=" text-stone-600 hover:text-stone-950 mr-4"
          >
            ❌ Delete
          </button>
        </div>
        <p className="mb-4 text-stome-400">
          <span>Due By: </span>
          {new Date(
            projectData.currentSelectedProject.dueDate
          ).toLocaleDateString("en-us")}
        </p>
        <div className="text-stone-600 whitespace-pre-wrap">
          <p className="font-semibold">Description</p>
          <p>{projectData.currentSelectedProject.description}</p>
        </div>
      </header>
      <Tasks />
    </div>
  );
}
