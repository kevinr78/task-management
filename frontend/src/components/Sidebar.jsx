import React from "react";
import Button from "./Button";

export default function Sidebar({
  onStartAddProject,
  projectsList,
  onSelectProject,
  selectedProjectId,
}) {
  return (
    <aside className="w-1/3 px-8 py-16 bg-stone-900 text-stone-50 md:w-72 rounded-r-xl">
      <div>
        <Button onClick={onStartAddProject}>+ Add New Project</Button>
      </div>
      <h2 className="text-stone-200 md:text-xl mt-5 font-bold mb-4  uppercase">
        Your Projects
      </h2>
      <ul className="mt-8">
        {}
        {projectsList.map((project, idx) => {
          let cssClasses =
            "w-full my-1 text-stone-400 text-left px-2 py-1 rounded-sm hover:bg-stone-500 hover:text-stone-200";

          if (project.id === selectedProjectId) {
            cssClasses += " bg-stone-500 text-stone-200";
          } else {
            cssClasses += " text-stone-400";
          }

          return (
            <li key={project.id}>
              <button
                onClick={() => {
                  onSelectProject(project.id);
                }}
                className={cssClasses}
              >
                {project.title}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
