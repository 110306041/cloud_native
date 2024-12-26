import express from "express";
import morgan from "morgan";
import User from "../models/User.js";
import submissionRoute from "./routes/submission.js";
import authRoute from "./routes/userAuth.js"
// import Assignment from "../models/Assignment.js";
// import COurse from

const app = express();
app.use(morgan("tiny"));
app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Hello");
// });

app.use("/api", submissionRoute);
app.use("/api", authRoute);
// app.get("/users", async (req, res) => {
//   try {
//     const users = await User.findAll();
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get("/users", async (req, res) => {
//   try {
//     const users = await User.findAll();
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

export default app; // ES module export
