import { useRef } from "react";
import Input from "./Input";
import Button from "./Button";

export default function NewTaskBox({ onAdd }) {
  const taskName = useRef();
  function createNewTask() {
    const taskTitle = taskName.current.value;
    if (taskTitle.trim() === "") {
      alert("Please fill task Name");
      return;
    }

    onAdd({ id: Date.now(), task: taskTitle });
    taskName.current.value = "";
  }
  return (
    <div>
      <Input ref={taskName} label="Task Name" textarea={false} type="text" />
      <span className="absolute">
        <Button onClick={createNewTask}>Add Task</Button>
      </span>
    </div>
  );
}
