import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  getCoursesByTeacher,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/teacher/courseController.js";
import {
  createAssignment,
  getAssignmentsAndExams,
  updateAssignment,
  deleteAssignment,
} from "../controllers/teacher/assignmentController.js";
import {
  createExam,
  updateExam,
  deleteExam,
} from "../controllers/teacher/examController.js";
import {
  createQuestion,
  getAssignmentQuestions,
  getExamQuestions,
  getQuestionDetails,
  updateQuestion,
  deleteQuestion,
} from "../controllers/teacher/questionController.js";

import {
  getAllStudentIds,
  addStudentsToCourse,
} from "../controllers/teacher/enrollController.js";
import {
  checkCourseOwnership,
  checkAssignmentOwnership,
  checkExamOwnership,
  checkAssignmentORExamOwnership,
  checkQuestionOwnership,
} from "../middlewares/checkOwnership.js";

const router = express.Router();

router.post("/courses", authenticateToken, createCourse);
router.post(
  "/assignments/:courseID",
  authenticateToken,
  checkCourseOwnership,
  createAssignment
);
router.post(
  "/exams/:courseID",
  authenticateToken,
  checkCourseOwnership,
  createExam
);
router.post(
  "/questions/",
  authenticateToken,
  checkAssignmentORExamOwnership,
  createQuestion
);

router.get("/courses", authenticateToken, getCoursesByTeacher);
router.get(
  "/assignmentsAndExams/:courseID",
  authenticateToken,
  checkCourseOwnership,
  getAssignmentsAndExams
);
router.put(
  "/courses/:courseID",
  authenticateToken,
  checkCourseOwnership,
  updateCourse
);
router.delete(
  "/courses/:courseID",
  authenticateToken,
  checkCourseOwnership,
  deleteCourse
);
router.put(
  "/assignments/:assignmentID",
  authenticateToken,
  checkAssignmentOwnership,
  updateAssignment
);
router.delete(
  "/assignments/:assignmentID",
  authenticateToken,
  checkAssignmentOwnership,
  deleteAssignment
);
router.put(
  "/questions/:questionID",
  authenticateToken,
  checkQuestionOwnership,
  updateQuestion
);
router.delete(
  "/questions/:questionID",
  authenticateToken,
  checkQuestionOwnership,
  deleteQuestion
);
router.put("/exams/:examID", authenticateToken, checkExamOwnership, updateExam);
router.delete(
  "/exams/:examID",
  authenticateToken,
  checkExamOwnership,
  deleteExam
);

router.get(
  "/questions/:questionID",
  authenticateToken,
  checkQuestionOwnership,
  getQuestionDetails
);
router.get(
  "/assignments/questions/:assignmentID",
  authenticateToken,
  checkAssignmentOwnership,
  getAssignmentQuestions
);
router.get(
  "/exams/questions/:examID",
  authenticateToken,
  checkExamOwnership,
  getExamQuestions
);

router.get("/enroll/students", authenticateToken, getAllStudentIds);
router.post(
  "/enroll/students/:courseID",
  authenticateToken,
  checkCourseOwnership,
  addStudentsToCourse
);

export default router;
