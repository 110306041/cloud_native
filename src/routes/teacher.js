import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { handleRequest } from "../controllers/submissionController.js";
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
// import { getCoursesByTeacher } from "../controllers/teacher/courseController.js";

const router = express.Router();

// Route that triggers the dynamic WebSocket operation
// router.post('/send-websocket',authenticateToken, handleRequest);
router.post("/courses", authenticateToken, createCourse);
router.post("/assignments/:courseID", authenticateToken, createAssignment);
router.post("/exams/:courseID", authenticateToken, createExam);
router.post("/questions/", authenticateToken, createQuestion);

router.get("/courses", authenticateToken, getCoursesByTeacher);
router.get(
  "/assignmentsAndExams/:courseID",
  authenticateToken,
  getAssignmentsAndExams
);
router.put("/courses/:courseID", authenticateToken, updateCourse);
router.delete("/courses/:courseID", authenticateToken, deleteCourse);
router.put("/assignments/:assignmentID", authenticateToken, updateAssignment);
router.delete(
  "/assignments/:assignmentID",
  authenticateToken,
  deleteAssignment
);
router.put("/questions/:questionID", authenticateToken, updateQuestion);
router.delete("/questions/:questionID", authenticateToken, deleteQuestion);
router.put("/exams/:examID", authenticateToken, updateExam);
router.delete("/exams/:examID", authenticateToken, deleteExam);

router.get("/questions/:questionID", authenticateToken, getQuestionDetails);
router.get("/assignments/questions/:assignmentID", authenticateToken, getAssignmentQuestions);
router.get("/exams/questions/:examID", authenticateToken, getExamQuestions);



// assignments/questions/{assignmentID} 和exams

router.put("");

export default router;
