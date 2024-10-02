import { useRef, useContext } from "react";
import Input from "../Utils/Input";
import Modal from "../Utils/Modal";
import { useNavigate } from "react-router-dom";
import { ProjectContext } from "../../Store/ProjectContextProvider";

import sendAPIRequest from "../../utils/ApiRequest";

export default function ({ onSave, onCancel }) {
  const { projectsState, ...operations } = useContext(ProjectContext);
  const navigate = useNavigate();

  const title = useRef();
  const description = useRef();
  const dueDate = useRef();
  const modal = useRef();

  async function createNewProject() {
    const titleValue = title.current.value.trim();
    const descriptionValue = description.current.value.trim();
    const dueDateValue = dueDate.current.value.trim();

    if (titleValue === "" || descriptionValue === "" || dueDateValue === "") {
      modal.current.open();
      return;
    }
    const data = {
      title: titleValue,
      description: descriptionValue,
      dueDate: dueDateValue,
    };
    const request = await sendAPIRequest("POST", data, "newProject");

    if (!request.ok) {
      console.error("Error while creating project");
      return;
    }

    operations.addNewProject({
      title: data.title,
      projectId: request.data,
    });

    title.current.value = "";
    description.current.value = "";
    dueDate.current.value = "";
  }
  return (
    <>
      <Modal ref={modal}>
        <h2 className="text-bold font-bold">Error</h2>
        <p>Please fill all the fields</p>
      </Modal>
      <div className="w-full mt-16 px-10">
        <menu className="flex items-center justify-end gap-4 my-4">
          <li>
            <button
              onClick={() => {
                navigate("/");
              }}
              className="text-stone-800 hover:text-stone-950"
            >
              Cancel
            </button>
          </li>
          <li>
            <button
              className="px-6 py-2 rounded-md bg-stone-800 text-stone-50 hover:bg-stone-950"
              onClick={createNewProject}
            >
              Save
            </button>
          </li>
        </menu>
        <div>
          <Input
            ref={title}
            defaultValue="Kevin"
            label="Title"
            textarea={false}
            type="text"
          />
          <Input
            ref={description}
            label="Description"
            defaultValue="Kevin"
            textarea={true}
            type="text"
          />
          <Input
            ref={dueDate}
            defaultValue="09-09-2024"
            label=" Due Date"
            textarea={false}
            type="date"
          />
        </div>
      </div>
    </>
  );
}
