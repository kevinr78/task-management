import express from "express";
import { verifyJWT } from "../utils/JWT.js";
import {
  addNewProject,
  getProjectById,
  addTaskToProject,
  removeTaskFromProject,
  getAllProjects,
  deleteProject,
} from "../controllers/project.controller.js";
const projectRouter = express.Router();

projectRouter.get("/getAllProjects", verifyJWT, getAllProjects);
projectRouter.post("/newProject", verifyJWT, addNewProject);
projectRouter.post("/deleteProject", verifyJWT, deleteProject);
projectRouter.post("/getProject", verifyJWT, getProjectById);
projectRouter.post("/addTaskToProject", verifyJWT, addTaskToProject);
projectRouter.post("/removeTaskFromProject", verifyJWT, removeTaskFromProject);

export default projectRouter;
