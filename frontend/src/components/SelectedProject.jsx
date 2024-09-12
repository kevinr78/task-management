import React from "react";
import Button from "./Button";
import Tasks from "./Tasks";

export default function SelectedProject({ project, onDelete }) {
  return (
    <div className="w-full px-4">
      <header className="pb-4 mb-4 border-b-2 border-stone-300">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-stone-600 mb-2">
            {project.title}
          </h1>
          <button
            onClick={() => {
              onDelete(project.id);
            }}
            className="text-stone-600 hover:text-stome-950 mr-4"
          >
            Delete
          </button>
        </div>
        <p className="mb-4 text-stome-400">
          {new Date(project.dueDate).toLocaleDateString()}
        </p>
        <div className="text-stone-600 whitespace-pre-wrap">
          <p className="font-semibold">Description</p>
          <p>{project.description}</p>
        </div>
      </header>
      <Tasks />
    </div>
  );
}
