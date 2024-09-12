import { useRef, useState, useContext } from "react";
import NewTaskBox from "./NewTaskBox";
import NewTask from "./NewTask";
import Modal from "./Modal";
import Button from "./Button";
import { ProjectContext } from "../Store/ProjectContextProvider";

export default function Tasks() {
  const { projectData, ...operations } = useContext(ProjectContext);
  const modal = useRef();
  function openModal() {
    modal.current.open();
  }

  const project = projectData.projects.find((project) => {
    return project.id === projectData.selectedProjectId;
  });

  function addTask(task) {
    operations.addProjectTask(task);
    modal.current.closeModal();
  }
  return (
    <section>
      <Modal ref={modal}>
        <NewTaskBox onAdd={addTask} />
      </Modal>
      <div className="flex justify-between px-4">
        <h2 className="text-2xl font-bold mb-4">Tasks</h2>
        <Button onClick={openModal}>Add Tasks</Button>
      </div>
      {project.tasks.length === 0 ? (
        <p>No Task for projects</p>
      ) : (
        <ul>
          {project.tasks.map((taskItem) => {
            return <NewTask task={taskItem} />;
          })}
        </ul>
      )}
    </section>
  );
}
