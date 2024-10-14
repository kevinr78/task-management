import express, { Router } from "express";
import {
  loginController,
  registerController,
  getUsers,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../utils/JWT.js";
const userAuthRouter = express.Router();

userAuthRouter.post("/login", loginController);
userAuthRouter.post("/register", registerController);
userAuthRouter.post("/getUsers", verifyJWT, getUsers);

export default userAuthRouter;
