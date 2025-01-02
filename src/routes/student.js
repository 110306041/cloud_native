import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { getCoursesByStudent } from "../controllers/student/courseController.js";
import { getAssignmentsAndExams } from "../controllers/student/assignmentController.js";
import {
  getAssignmentQuestions,
  getExamQuestions,
  getQuestionDetails,
} from "../controllers/student/questionController.js";
import {
  getSubmissionByStudent,
  submitCode,
} from "../controllers/student/submissioinController.js";

const router = express.Router();

router.get("/courses", authenticateToken, getCoursesByStudent);
router.get(
  "/assignments/questions/:assignmentsID",
  authenticateToken,
  getAssignmentQuestions
);
router.get("/questions/:questionID", authenticateToken, getQuestionDetails);
router.get("/exams/questions/:examID", authenticateToken, getExamQuestions);
router.get(
  "/assignmentsAndExams/:courseID",
  authenticateToken,
  getAssignmentsAndExams
);

router.get("/submissions", authenticateToken, getSubmissionByStudent);
router.post("/submissions", authenticateToken, submitCode);

export default router;
