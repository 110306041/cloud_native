import db from "../../../models/index.js";
import { Op, Sequelize } from "sequelize";

const { UserCourse, Course, Assignment, Submission, Exam, User, Question, TestCase } = db;

export const getAssignmentQuestions = async (req, res) => {
  try {
    const { assignmentsID } = req.params;
    console.log(req.params);
    console.log(assignmentsID);

    // Fetch questions for the specified assignment
    const questions = await Question.findAll({
      where: { AssignmentID: assignmentsID },
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

    // Add test cases to the response
    question.sample_test_cases = sampleTestCases;

    // Send response
    res.status(200).json(question);
  } catch (error) {
    console.error("Error fetching question details:", error);
    res.status(500).json({ error: "Failed to fetch question details" });
  }
};
