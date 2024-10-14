import express from "express";
import cors from "cors";
import { createServer } from "http";
import DB_Connect from "./DB.js";
import { verifyJWT } from "./utils/JWT.js";
import { init } from "./socket.js/index.js";
import dotenv from "dotenv";
import projectRouter from "./routes/project.routes.js";
import userAuthRouter from "./routes/user.route.js";
import notificationRouter from "./routes/notification.route.js";

dotenv.config();

const app = express();
const server = createServer(app);

//parsing middleware
app.use(cors());
app.use(express.json());
//app.use(express.static(''));
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/", projectRouter);
app.use("/", userAuthRouter);
app.use("/", notificationRouter);

const io = init(server);

app.use((err, req, res, next) => {
  console.error("Error Has occured");
  res.status(500).send({ message: err.message });
});

server.listen(8080, () => {
  DB_Connect();
  console.log("server is running on port 8080");
});
