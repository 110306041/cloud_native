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

import {
  checkCourseOwnership,
  checkAssignmentOwnership,
  checkExamOwnership,
  checkQuestionOwnership,
} from "../middlewares/checkOwnership.js";

const router = express.Router();

router.get("/courses", authenticateToken, getCoursesByStudent);
router.get(
  "/assignments/questions/:assignmentID",
  authenticateToken,
  checkAssignmentOwnership,
  getAssignmentQuestions
);
router.get(
  "/questions/:questionID",
  authenticateToken,
  checkQuestionOwnership,
  getQuestionDetails
);
router.get(
  "/exams/questions/:examID",
  authenticateToken,
  checkExamOwnership,
  getExamQuestions
);
router.get(
  "/assignmentsAndExams/:courseID",
  authenticateToken,
  checkCourseOwnership,
  getAssignmentsAndExams
);

router.get("/submissions", authenticateToken, getSubmissionByStudent);
router.post(
  "/submissions",
  authenticateToken,
  checkQuestionOwnership,
  submitCode
);

export default router;
