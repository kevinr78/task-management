import { useRef } from "react";
import { userDetails } from "../../utils/user";
export default function NewTask({ task }) {
  const checkBox = useRef();
  const title = useRef();
  let classes = "pl-2 flex-1 text-stone-600 font-semibold";
  if (task.completed) {
    classes += " line-through";
  }
  let splitteUsername = task.username.split(" ");
  const userSF =
    splitteUsername[0].slice(0, 1) + splitteUsername[1].slice(0, 1);

  function markTask(e) {
    const id = e.target.dataset.id;
    operations.markTask(id, checkBox.current.checked);
    console.log(title.current.classList);
  }

  const role = userDetails.role || localStorage.getItem("role");

  return (
    <li key={task.taskId}>
      <div className="bg-slate-50 shadow-lg my-4 py-2 rounded-md flex ">
        <p ref={title} className={classes}>
          {task.taskTitle}
        </p>
        <div className="flex justify-around w-2/12">
          <div className="avatar placeholder w-8">
            <div className="bg-neutral text-neutral-content w-24 rounded-full">
              <div className="tooltip" data-tip={task.username}>
                <button className="text-1xl">{userSF}</button>
              </div>
            </div>
          </div>
          {role === "admin" && (
            <button
              name="clear-task"
              className="mr-2 hover:bg-stone-200 hover:px-1"
            >
              X
            </button>
          )}
          {role === "normal" && (
            <input
              data-id={task._id}
              ref={checkBox}
              onChange={markTask}
              name="mark-as-completed"
              type="checkbox"
              className="mr-2 px-2 hover:bg-stone-200"
            />
          )}
        </div>
      </div>
    </li>
  );
}
