import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { handleRequest } from "../controllers/submissionController.js";
import { createCourse } from "../controllers/teacher/courseController.js";
import { createAssignment, getAssignmentsAndExams } from "../controllers/teacher/assignmentController.js";
import { createExam } from "../controllers/teacher/examController.js";
import { createQuestion, getQuestionDetails } from "../controllers/teacher/questionController.js";
import { getCoursesByTeacher } from "../controllers/teacher/courseController.js";



const router = express.Router();

// Route that triggers the dynamic WebSocket operation
// router.post('/send-websocket',authenticateToken, handleRequest);
router.post("/courses", authenticateToken, createCourse);
router.post("/assignments/:courseID", authenticateToken, createAssignment);
router.post("/exams/:courseID", authenticateToken, createExam);
router.post("/questions/", authenticateToken, createQuestion);

router.get("/courses", authenticateToken,getCoursesByTeacher);
router.get("/assignmentsAndExams/:courseID", authenticateToken, getAssignmentsAndExams);
router.get("/questions/:questionID", authenticateToken, getQuestionDetails);

export default router;
