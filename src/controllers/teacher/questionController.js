// import UserCourse from "../../../models/UserCourse.js";
// import Course from "../../../models/Course.js";
// import Assignment from "../../../models/Assignment.js";
// import Submission from "../../../models/Submission.js";
// import Exam from "../../../models/Exam.js";
// import { Op } from "sequelize";
import { Op, Sequelize } from "sequelize";

import db from "../../../models/index.js";

const {
  UserCourse,
  User,
  Course,
  Assignment,
  Submission,
  Exam,
  Question,
  TestCase,
  sequelize,
} = db;

export const getAssignmentQuestions = async (req, res) => {
  try {
    const { assignmentID } = req.params;
    const isDeleted = await Assignment.findOne({
      where: { ID: assignmentID, DeletedAt: { [Op.ne]: null } },
    });
    if (isDeleted) {
      return res
        .status(500)
        .json({ error: "The Assignment has been deleted." });
    }

    // Fetch questions for the specified assignment
    const questions = await Question.findAll({
      where: { AssignmentID: assignmentID, DeletedAt: null },
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
          highestScore: parseInt(highestScore, 10) || 0,
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
    const isDeleted = await Exam.findOne({
      where: { ID: examID, DeletedAt: { [Op.ne]: null } },
    });
    if (isDeleted) {
      return res.status(500).json({ error: "The exam has been deleted." });
    }

    // Fetch questions for the specified exam
    const questions = await Question.findAll({
      where: { ExamID: examID, DeletedAt: null },
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
          highestScore: parseInt(highestScore, 10) || 0,
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
    const isDeleted = await Question.findOne({
      where: { ID: questionID, DeletedAt: { [Op.ne]: null } },
    });
    if (isDeleted) {
      return res.status(500).json({ error: "The Question has been deleted." });
    }
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
      where: { QuestionID: questionID, DeletedAt: null },
      attributes: ["Input", "Output"],
      raw: true,
    });

    const formattedTestCases = sampleTestCases.map((testCase) => ({
      input: testCase.Input,
      expected_output: testCase.Output,
    }));

    const finishNum = await Submission.count({
      where: { QuestionID: questionID },
      distinct: true,
      col: "UserID",
    });

    const ACNum = await Submission.count({
      where: {
        QuestionID: questionID,
        Score: 100,
      },
      distinct: true,
      col: "UserID",
    });

    const response = {
      id: question.ID,
      name: question.Name,
      description: question.Description,
      difficulty: question.Difficulty,
      time_limit: question.TimeLimit,
      memory_limit: question.MemoryLimit,
      constraints: question.Constraints,
      sample_test_cases: formattedTestCases,
      finish_num: finishNum,
      AC_num: ACNum,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching question details:", error);
    res.status(500).json({ error: "Failed to fetch question details" });
  }
};

export const createQuestion = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      exam_id,
      assignment_id,
      difficulty,
      time_limit,
      memory_limit,
      submission_limit,
      description,
      test_cases,
      question_name,
    } = req.body;

    const teacherID = req.user.id;
    const isTeacher = await User.findOne({
      where: { ID: teacherID, Type: "teacher" },
    });
    if (!isTeacher) {
      return res
        .status(403)
        .json({ error: "Only teacher are able to add question" });
    }

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
        where: { ID: exam_id, DeletedAt: null },
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
        where: { ID: assignment_id, DeletedAt: null },
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
        DeletedAt: null,
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
    const newQuestion = await Question.create(
      {
        //   ID: uuidv4(),
        ExamID: exam_id || null,
        AssignmentID: assignment_id || null,
        Name: question_name,
        Difficulty: difficulty,
        TimeLimit: time_limit,
        MemoryLimit: memory_limit,
        SubmissionLimit: submission_limit,
        Description: description,
      },
      { transaction: transaction }
    );

    // Create associated test cases
    if (test_cases && Array.isArray(test_cases)) {
      const testCaseData = test_cases.map((tc, index) => ({
        QuestionID: newQuestion.ID,
        Input: tc.input,
        Output: tc.expected_output,
        Sequence: index + 1,
      }));

      await TestCase.bulkCreate(testCaseData, { transaction: transaction });
    }
    await transaction.commit();

    // Return the created question
    res.status(201).end();
    // .json({
    //   message: "Question created successfully.",
    //   question: {
    //     id: newQuestion.ID,
    //     name:question_name,
    //     difficulty: newQuestion.Difficulty,
    //     time_limit: newQuestion.TimeLimit,
    //     memory_limit:newQuestion.MemoryLimit,
    //     submission_limit: newQuestion.SubmissionLimit,
    //     due_date: newQuestion.DueDate,
    //     description: newQuestion.Description,
    //     test_cases: test_cases || [],
    //   },
    // });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating question:", error);
    res.status(500).json({ error: "Failed to create question." });
  }
};

export const deleteQuestion = async (req, res) => {
  const transaction = await Question.sequelize.transaction(); // Start a transaction

  try {
    const { questionID } = req.params;
    // Soft delete the Question
    const questionResult = await Question.update(
      { DeletedAt: Sequelize.fn("NOW") },
      { where: { ID: questionID, DeletedAt: null }, transaction: transaction }
    );

    if (questionResult[0] === 0) {
      await transaction.rollback();
      return res
        .status(500)
        .json({ error: "error occur when deleting course." });
    }

    // Soft delete related Test Cases
    await TestCase.update(
      { DeletedAt: Sequelize.fn("NOW") },
      {
        where: { QuestionID: questionID, DeletedAt: null },
        transaction: transaction,
      }
    );

    await transaction.commit();
    console.log("success");
    res.status(200).end();
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting question:", error);
    return res.status(500).json({ error: "error occur when deleting course." });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const { questionID } = req.params;
    const updatedData = req.body;

    // Fields to exclude from update
    const excludedFields = [
      "ID",
      "CreatedAt",
      "DeletedAt",
      "UpdatedAt",
      "AssignmentId",
      "ExamID",
    ];

    // Filter out excluded fields
    const filteredData = {};
    Object.keys(updatedData).forEach((key) => {
      if (!excludedFields.includes(key)) {
        filteredData[key] = updatedData[key];
      }
    });

    // Add manual UpdatedAt since timestamps are disabled in the model
    filteredData.UpdatedAt = new Date();

    // Perform the update
    const [affectedRows] = await Question.update(filteredData, {
      where: { ID: questionID, DeletedAt: null }, // Only update non-deleted courses
    });

    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "question not found or already deleted." });
    }

    return res.status(200).json({ message: "question updated successfully." });
  } catch (error) {
    console.error("Error updating assignment:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the question." });
  }
};
