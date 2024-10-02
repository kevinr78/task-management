import mongoose from "mongoose";
import ProjectSchema from "../models/project.model.js";
import createNewError from "../utils/Error.js";

const addNewProject = async function (req, res, next) {
  let err;
  const { title, description, dueDate } = req.body;
  const user = req.currentUser.id;
  try {
    if (title === "" || description === "" || dueDate === "") {
      throw createNewError(401, "Please fill all the details");
    }

    const project = new ProjectSchema({
      title,
      description,
      dueDate,
      by_user: user,
      tasks: [],
    });

    try {
      const newProject = await project.save();
      console.log(newProject);
      return res.status(200).json({
        ok: true,
        message: "Successfully added project",
        data: newProject._id,
      });
    } catch (error) {
      throw createNewError(401, "Failed to add new project");
    }
  } catch (error) {
    next(error);
  }
};

const getAllProjects = async function (req, res, next) {
  const user = req.currentUser.id;
  const projects = await ProjectSchema.find({ by_user: user }).select([
    "title",
    "_id",
  ]);

  if (!projects) {
    throw createNewError("Error while getting projects");
  }

  return res
    .status(200)
    .json({ ok: true, message: "All projects", data: projects });
};

const addTaskToProject = async function (req, res, next) {
  const { id, task } = req.body;

  try {
    const project = await ProjectSchema.findById(id);
    if (!project) {
      throw createNewError(404, "Project not found");
    }

    const taskId = new mongoose.Types.ObjectId();
    const updatedDoc = await ProjectSchema.findByIdAndUpdate(
      id,
      {
        $push: { tasks: { taskId, task } },
      },
      { returnDocument: "after" }
    );
    console.log(updatedDoc);
    if (!updatedDoc) {
      throw createNewError(404, "Unable to add task");
    }

    return res
      .status(200)
      .json({ ok: true, message: "Task has been added", data: updatedDoc });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async function (req, res, next) {
  const id = req.body.id;
  try {
    const project = await ProjectSchema.findById(id);
    console.log(project);
    if (!project) {
      throw createNewError(404, "Project not found");
    }

    return res
      .status(200)
      .json({ ok: true, message: "Found Project", data: project });
  } catch (error) {
    next(error);
  }
};

const removeTaskFromProject = async function (req, res, next) {
  try {
    const { id: projectId, taskId } = req.body;
    const project = await ProjectSchema.findById(projectId);
    if (!project) {
      throw createNewError(404, "Project not found");
    }

    const updatedDoc = await ProjectSchema.findByIdAndUpdate(
      projectId,
      {
        $pull: { tasks: { taskId: new mongoose.Types.ObjectId(taskId) } },
      },
      { returnDocument: "after" }
    );
    console.log(updatedDoc);
    if (!updatedDoc) {
      throw createNewError(404, "Unable to remove task");
    }

    return res
      .status(200)
      .json({ ok: true, message: "Task has been remove", data: updatedDoc });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async function (req, res, next) {
  const { id } = req.body;
  try {
    const deletedProject = await ProjectSchema.findByIdAndDelete(id).select(
      "_id"
    );
    if (!deleteProject) {
      throw createNewError(404, "Unable to delete project");
    }

    return res.status(200).json({ ok: true, data: deletedProject });
  } catch (error) {
    next(error);
  }
};

export {
  getAllProjects,
  addNewProject,
  getProjectById,
  addTaskToProject,
  removeTaskFromProject,
  deleteProject,
};
