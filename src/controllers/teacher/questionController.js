// import UserCourse from "../../../models/UserCourse.js";
// import Course from "../../../models/Course.js";
// import Assignment from "../../../models/Assignment.js";
// import Submission from "../../../models/Submission.js";
// import Exam from "../../../models/Exam.js";
// import { Op } from "sequelize";
import db from "../../../models/index.js";  

const { UserCourse, Course, Assignment, Submission, Exam, Question, TestCase } = db;

export const getAssignmentQuestions = async (req, res) => {
  try {
    const { assignmentID } = req.params;

    // Fetch questions for the specified assignment
    const questions = await Question.findAll({
      where: { AssignmentID: assignmentID },
      attributes: ["ID", "Name", "Description", "Difficulty"],
      raw: true,
    });

    // Map questions to include the highest score from the Submission table
    const questionsWithScores = await Promise.all(
      questions.map(async (question) => {
        const highestScore = await Submission.max("Score", {
          where: { QuestionID: question.ID },
        });

        return {
          id: question.ID,
          name: question.Name,
          description: question.Description,
          difficulty: question.Difficulty,
          score: highestScore || "0", // Default to '0' if no submission exists
        };
      })
    );

    // Send response
    res.status(200).json({
      questions: questionsWithScores,
    });
  } catch (error) {
    console.error("Error fetching assignment questions:", error);
    res.status(500).json({ error: "Failed to fetch assignment questions" });
  }
};

export const getExamQuestions = async (req, res) => {
  try {
    const { examID } = req.params;

    // Fetch questions for the specified exam
    const questions = await Question.findAll({
      where: { ExamID: examID },
      attributes: ["ID", "Name", "Description", "Difficulty"],
      raw: true,
    });

    // Map questions to include the highest score from the Submission table
    const questionsWithScores = await Promise.all(
      questions.map(async (question) => {
        const highestScore = await Submission.max("Score", {
          where: { QuestionID: question.ID },
        });

        return {
          id: question.ID,
          name: question.Name,
          description: question.Description,
          difficulty: question.Difficulty,
          score: highestScore || "0", // Default to '0' if no submission exists
        };
      })
    );

    // Send response
    res.status(200).json({
      questions: questionsWithScores,
    });
  } catch (error) {
    console.error("Error fetching exam questions:", error);
    res.status(500).json({ error: "Failed to fetch exam questions" });
  }
};

export const getQuestionDetails = async (req, res) => {
  try {
    const { questionID } = req.params;

    // Fetch question details
    const question = await Question.findOne({
      where: { ID: questionID },
      attributes: [
        "ID",
        "Name",
        "Description",
        "Difficulty",
        "TimeLimit",
        "MemoryLimit",
        "Constraints",
     ],
      raw: true,
    });

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Fetch sample test cases for the question
    const sampleTestCases = await TestCase.findAll({
      where: { QuestionID: questionID },
      attributes: ["Input", "Output", "Sequence"],
      raw: true,
    });

    const finishNum = await Submission.count({
      where: { QuestionID: questionID },
      distinct: true,
      col: "UserID",
    });

    const AC_num = await Submission.count({
      where: {
        QuestionID: questionID,
        Score: 100, // Assuming 'Score' field exists in the 'Submission' model
      },
      distinct: true,
      col: "UserID",
    });

    // Add test cases to the response
    question.sample_test_cases = sampleTestCases;
    question.finishNum = finishNum;
    question.AC_num = AC_num;

    // Send response
    res.status(200).json(question);
  } catch (error) {
    console.error("Error fetching question details:", error);
    res.status(500).json({ error: "Failed to fetch question details" });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const {
      exam_id,
      assignment_id,
      difficulty,
      time_limit,
      memory_limit,
      submission_limit,
      due_date,
      description,
      test_cases,
      question_name
    } = req.body;

    const teacherID = req.user.id; // Assuming authentication middleware provides the teacher ID

    // Ensure the question is linked to either an exam or an assignment, not both
    if (!exam_id && !assignment_id) {
      return res
        .status(400)
        .json({ error: "A question must be linked to an exam or assignment." });
    }
    if (exam_id && assignment_id) {
      return res.status(400).json({
        error: "A question cannot be linked to both an exam and an assignment.",
      });
    }

    // Validate the teacher's relationship with the course for the exam or assignment
    let courseID;
    // let parentDueDate; 
    if (exam_id) {
      const exam = await Exam.findOne({
        where: { ID: exam_id },
        include: {
          model: Course,
          include: {
            model: UserCourse,
            where: { UserID: teacherID },
          },
        },
      });

      if (!exam) {
        return res.status(403).json({
          error: "You are not authorized to add questions to this exam.",
        });
      }

      courseID = exam.CourseID;
      // parentDueDate = exam.DueDate;
    }

    if (assignment_id) {
      const assignment = await Assignment.findOne({
        where: { ID: assignment_id },
        include: {
          model: Course,
          include: {
            model: UserCourse,
            where: { UserID: teacherID },
          },
        },
      });

      if (!assignment) {
        return res.status(403).json({
          error: "You are not authorized to add questions to this assignment.",
        });
      }

      courseID = assignment.CourseID;
      // parentDueDate = assignment.DueDate;
    }
    const existingQuestion = await Question.findOne({
      where: {
        [exam_id ? "ExamID" : "AssignmentID"]: exam_id || assignment_id,
        Name: question_name,
      },
    });

    if (existingQuestion) {
      return res.status(400).json({
        error: `A question with the name '${question_name}' already exists in this ${
          exam_id ? "exam" : "assignment"
        }.`,
      });
    }
    // Create a new question
    const newQuestion = await Question.create({
      //   ID: uuidv4(),
      ExamID: exam_id || null,
      AssignmentID: assignment_id || null,
      Name:question_name,
      Difficulty: difficulty,
      TimeLimit: time_limit,
      MemoryLimit: memory_limit,
      SubmissionLimit: submission_limit,
      DueDate: new Date(due_date),
      Description: description,
    });

    // Create associated test cases
    if (test_cases && Array.isArray(test_cases)) {
      const testCaseData = test_cases.map((tc, index) => ({
        // ID: uuidv4(),
        QuestionID: newQuestion.ID,
        Input: tc.input,
        Output: tc.expected_output,
        Sequence: index + 1
      }));

      await TestCase.bulkCreate(testCaseData);
    }

    // Return the created question
    res.status(201).json({
      message: "Question created successfully.",
      question: {
        id: newQuestion.ID,
        name:question_name,
        difficulty: newQuestion.Difficulty,
        time_limit: newQuestion.TimeLimit,
        memory_limit:newQuestion.MemoryLimit,
        submission_limit: newQuestion.SubmissionLimit,
        due_date: newQuestion.DueDate,
        description: newQuestion.Description,
        test_cases: test_cases || [],
      },
    });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ error: "Failed to create question." });
  }
};
