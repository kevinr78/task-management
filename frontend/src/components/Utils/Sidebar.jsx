import { useContext } from "react";
import Button from "./Button";
import { ProjectContext } from "../../Store/ProjectContextProvider";
import { useNavigate, useLoaderData } from "react-router-dom";

export default function Sidebar({ onStartAddProject }) {
  const { projectData, ...operations } = useContext(ProjectContext);
  const navigate = useNavigate();

  function handleCurrentSelectedProject(id) {
    operations.selectProject(id);
  }

  return (
    <aside className="w-1/3 px-8 py-16 bg-stone-900 text-stone-50 md:w-72 flex flex-col">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Welcome, {localStorage.getItem("name").split(" ")[0]}
        </h2>
      </div>
      <div>
        <Button
          onClick={() => {
            navigate("/home/newProject");
          }}
        >
          + Add New Project
        </Button>
      </div>
      <h2 className="text-stone-200 md:text-xl mt-5 font-bold mb-4  uppercase">
        Your Projects
      </h2>
      <ul className="mt-8 flex-1">
        {projectData.projects.length === 0 && <p>No projects yet</p>}
        {projectData.projects.map((project, idx) => {
          let cssClasses =
            "w-full my-1 text-stone-400 text-left px-2 py-1 rounded-sm hover:bg-stone-500 hover:text-stone-200";

          if (project._id === projectData.selectedProjectId) {
            cssClasses += " bg-stone-500 text-stone-200";
          } else {
            cssClasses += " text-stone-400";
          }

          return (
            <li key={project._id}>
              <button
                onClick={() => {
                  console.log(project);
                  navigate(`/home/project/${project._id}`);
                }}
                className={cssClasses}
              >
                {project.title}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="w-full">
        <button
          className="w-full bg-stone-700 py-2 rounded-md hover:bg-stone-600"
          onClick={() => {
            localStorage.removeItem("name");
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
