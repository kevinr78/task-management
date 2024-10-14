import express, { Router } from "express";
import { sendNotification } from "../controllers/notification.controller.js";
import { verifyJWT } from "../utils/JWT.js";
const notificationRouter = express.Router();

notificationRouter.post("/sendNotification", verifyJWT, sendNotification);

export default notificationRouter;
