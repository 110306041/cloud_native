import express from "express";
import morgan from "morgan";
import cors from "cors";
import User from "../models/User.js";
import authRoute from "./routes/userAuth.js";
import teacherRoute from "./routes/teacher.js";
import studentRoute from "./routes/student.js";

const app = express();
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/student", studentRoute);
app.use("/teacher", teacherRoute);

export default app;
