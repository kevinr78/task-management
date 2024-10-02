import express from "express";
import cors from "cors";
import DB_Connect from "./DB.js";
import dotenv from "dotenv";
import projectRouter from "./routes/project.routes.js";
import userAuthRouter from "./routes/user.route.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
//app.use(express.static(''));
app.use(express.urlencoded({ extended: true }));

app.use("/", projectRouter);
app.use("/", userAuthRouter);

app.use((err, req, res, next) => {
  console.error("Error Has occured");
  res.status(500).send({ message: err.message });
});

app.listen(8080, () => {
  DB_Connect();
  console.log("server is running on port 8080");
});
