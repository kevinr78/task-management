export default function NewTask({ task }) {
  return (
    <li key={task.taskId} data-id={task.taskId}>
      <div className="bg-slate-50 shadow-lg my-4 py-2 rounded-md flex jus">
        <p className="pl-2 flex-1 text-stone-600 font-semibold">{task.task}</p>
        <button
          name="clear-task"
          className="mr-2 hover:bg-stone-200 hover:px-1"
        >
          X
        </button>
        <input
          name="mark-as-completed"
          type="checkbox"
          className="mr-2 px-2 hover:bg-stone-200"
        />
      </div>
    </li>
  );
}
