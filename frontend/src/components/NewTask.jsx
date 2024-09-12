import { useContext } from "react";
import { ProjectContext } from "../Store/ProjectContextProvider";

export default function NewTask({ task }) {
  console.log(task.id);
  const { projectsState, ...operations } = useContext(ProjectContext);
  function removeTask(e) {
    const id = e.target.id;
    console.log(id);
    operations.removeTask(id);
  }

  function markAsCompleted(e) {
    const id = e.target.id;
    operations.markAsCompleted(id);
  }
  return (
    <li key={task.id}>
      <div className="bg-slate-50 shadow-lg my-4 py-2 rounded-md flex jus">
        <p className="pl-2 flex-1 text-stone-600 font-semibold">{task.task}</p>
        <button
          className="mr-2 hover:bg-stone-200 hover:px-1"
          onClick={removeTask}
        >
          X
        </button>
        <span
          className="mr-2 px-2 hover:bg-stone-200"
          onClick={markAsCompleted}
        >
          ✅
        </span>
      </div>
    </li>
  );
}
