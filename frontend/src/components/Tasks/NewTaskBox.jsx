import { useEffect, useRef, useState } from "react";
import sendAPIRequest from "../../utils/ApiRequest";
import Input from "../Utils/Input";
import Button from "../Utils/Button";

export default function NewTaskBox({ onAdd }) {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const taskName = useRef();
  const username = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const { ok, users } = await sendAPIRequest("POST", null, "getUsers");

      if (!ok) {
        console.error("Error while getting users");
        return;
      }
      setUsers(users);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  function createNewTask() {
    const taskTitle = taskName.current.value;
    const assignedTo = username.current.value;

    if (taskTitle.trim() === "") {
      alert("Please fill task Name");
      return;
    }

    onAdd({ taskTitle, assignedTo });
    taskName.current.value = "";
  }

  if (isLoading) {
    return <p>Fetching Users</p>;
  }

  return (
    <div>
      <Input ref={taskName} label="Task Name" textarea={false} type="text" />
      <div className="mb-4">
        <label htmlFor="task-to-user">Choose a User: </label>
        <select
          name="task-to-user"
          id="task-to-user"
          ref={username}
          className="border-2"
        >
          <option unselectable="true"></option>
          {users.map((user, idx) => {
            return (
              <option key={idx} className="bg-stone-300" value={user._id}>
                {user.name}
              </option>
            );
          })}
        </select>
      </div>
      <span className="absolute">
        <Button onClick={createNewTask}>Add Task</Button>
      </span>
    </div>
  );
}
