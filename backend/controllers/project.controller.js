import mongoose, { get, Mongoose } from "mongoose";
import ProjectSchema from "../models/project.model.js";
import userModel from "../models/user.model.js";
import { sendNotification } from "./notification.controller.js";
import createNewError from "../utils/Error.js";
import { getIO, connectedUsers } from "../socket.js/index.js";

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
      assignedTo: [],
      by_user: user,
      tasks: [],
    });

    try {
      const newProject = await project.save();

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
  const userId = new mongoose.Types.ObjectId(req.currentUser.id);

  const user = await userModel.findById(req.currentUser.id);
  if (!user) {
    throw createNewError(404, "Efeswde");
  }
  let projects;
  if (user.role === "admin") {
    projects = await ProjectSchema.find({
      $or: [
        { by_user: userId }, // Check if by_user matches userId
        { assignedTo: userId }, // Check if assignedTo array contains userId
      ],
    }).select(["title", "_id"]);
  } else {
    projects = await ProjectSchema.find({
      assignedTo: userId,
    }).select(["title", "_id"]);
  }

  if (!projects) {
    throw createNewError("Error while getting projects");
  }

  return res
    .status(200)
    .json({ ok: true, message: "All projects", data: projects });
};

const addTaskToProject = async function (req, res, next) {
  const { id, assignedTo, taskTitle, completed } = req.body;

  try {
    const project = await ProjectSchema.findById(id);
    if (!project) {
      throw createNewError(404, "Project not found");
    }

    const user = await userModel.findById(assignedTo);

    if (!user) {
      throw createNewError(404, "User not found");
    }

    const updatedDoc = await ProjectSchema.findByIdAndUpdate(
      id,
      {
        $push: {
          tasks: {
            assignedTo,
            taskTitle,
            completed,
            username: user.name,
          },
          assignedTo,
        },
      },
      { returnDocument: "after" }
    );
    if (!updatedDoc) {
      throw createNewError(404, "Unable to add task");
    }
    const message = `Task ${taskTitle} has been added to project ${taskTitle} and assigned to ${user.name}`;
    sendNotification({
      from: project.by_user,
      to: assignedTo,
      message,
      event: "notification",
    });

    return res
      .status(200)
      .json({ ok: true, message: "Task has been added", data: updatedDoc });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async function (req, res, next) {
  const pid = req.body.id;
  const userId = req.body.userId;
  try {
    const project = await ProjectSchema.findById(pid).lean();
    const user = await userModel.findById(userId);

    if (!user) {
      throw createNewError(404, "User not found");
    }

    if (!project) {
      throw createNewError(404, "Project not found");
    }
    if (user.role === "normal") {
      project.tasks = project.tasks.filter((task) => {
        return task.assignedTo.toString() == userId.toString();
      });
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

    const tt = project.tasks.find((task) => {
      return (task._id = taskId);
    });

    if (!project) {
      throw createNewError(404, "Project not found");
    }
    const updatedDoc = await ProjectSchema.findByIdAndUpdate(
      projectId,
      {
        $pull: { tasks: { _id: new mongoose.Types.ObjectId(taskId) } },
      },
      { returnDocument: "after" }
    );
    if (!updatedDoc) {
      throw createNewError(404, "Unable to remove task");
    }

    const message = `Task ${tt.taskTitle} has been removed from project ${project.title}`;
    sendNotification({
      from: project.by_user,
      to: tt.assignedTo,
      message,
      event: "notification",
    });

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

const markTaskAsCompleted = async function (req, res, next) {
  const { pid, taskId, userId } = req.body;
  const taskIdN = new mongoose.Types.ObjectId(taskId);
  const projectId = new mongoose.Types.ObjectId(pid);
  try {
    const project = await ProjectSchema.findById(id);

    if (!project) {
      throw createNewError(404, "No project found");
    }
    debugger;
    const user = userModel.find({ _id: id });
    if (!user) {
      throw createNewError(404, "No User Found");
    }
    const task = project.tasks.find((task) => task._id.toString() === taskId);

    if (!task) {
      throw createNewError(404, "No task Found");
    }
    const updatedProject = await ProjectSchema.findOneAndUpdate(
      { _id: projectId, "tasks._id": String(taskId) },
      {
        $set: {
          "tasks.$.completed": true,
        },
      },
      { new: true }
    );

    if (!updatedProject) {
      throw createNewError(404, "Unable to update task status");
    }

    const message = `Task ${task.taskTitle} has been completed by ${user.name} `;
    const notif = sendNotification(
      {
        from: userId,
        to: project.by_user,
        message,
        event: "notification",
      },
      next
    );

    if (notif !== null) {
      next(notif);
    }

    console.log(updatedProject);
    return res.status(200).json({ ok: true, message: "Task Updated" });
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
  markTaskAsCompleted,
};
