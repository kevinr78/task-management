import { useRef, useState, useContext } from "react";
import NewTaskBox from "./NewTaskBox";
import NewTask from "./NewTask";
import Modal from "../Utils/Modal";
import Button from "../Utils/Button";
import { ProjectContext } from "../../Store/ProjectContextProvider";
import { userDetails } from "../../utils/user";

export default function Tasks() {
  const { projectData, ...operations } = useContext(ProjectContext);
  const modal = useRef();

  function handleCtaClick(e) {
    const ctaAction = e.target.name;
    const parentLiElement = e.target.parentElement.parentElement.parentElement;
    const elementId = parentLiElement.dataset.id;
    switch (ctaAction) {
      case "clear-task":
        removeTask(parentLiElement, elementId);
        break;
      case "mark-as-completed":
        break;
        markAsCompleted(parentLiElement, elementId);
        break;
      default:
        return;
        break;
    }
  }
  function removeTask(element, id) {
    if (window.confirm("Do you want to remove this task?")) {
      if (element.tagName === "LI") {
        operations.removeTask(id);
      }
    }
  }

  function markAsCompleted(element, id) {
    const dd = element.children[0].children[0].classList;

    operations.markTask(id);
    if (element.tagName === "LI") {
      if (!dd.contains("line-through")) {
        dd.toggle("line-through");
      } else {
        dd.remove("line-through");
      }
    }
  }

  function openModal() {
    modal.current.open();
  }

  function addTask(task) {
    operations.addProjectTask(task);
    modal.current.closeModal();
  }
  const role = userDetails.role || localStorage.getItem("role");
  return (
    <section className="overflow-auto flex-1">
      <Modal ref={modal}>
        <NewTaskBox onAdd={addTask} />
      </Modal>
      <div className="flex justify-between px-4 sticky">
        <h2 className="text-2xl font-bold mb-4">Tasks</h2>
        {role == "admin" && <Button onClick={openModal}>Add Tasks</Button>}
      </div>
      {projectData.currentSelectedProject.tasks.length === 0 ? (
        <p>No Task for projects</p>
      ) : (
        <ul onClick={handleCtaClick}>
          {projectData.currentSelectedProject.tasks.map((taskItem, idx) => {
            return <NewTask task={taskItem} key={idx} />;
          })}
        </ul>
      )}
    </section>
  );
}
