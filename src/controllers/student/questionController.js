import db from "../../../models/index.js";
import { Op, Sequelize } from "sequelize";

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
    const userID = req.user.id;

    const isDeleted = await Assignment.findOne({
      where: { ID: assignmentID, DeletedAt: { [Op.ne]: null } },
    });
    if (isDeleted) {
      return res
        .status(500)
        .json({ error: "The Assignment has been deleted." });
    }

    const questions = await Question.findAll({
      where: { AssignmentID: assignmentID, DeletedAt: null },
      attributes: ["ID", "Name", "Description", "Difficulty"],
      raw: true,
    });

    const questionsWithScores = await Promise.all(
      questions.map(async (question) => {
        const highestScore = await Submission.max("Score", {
          where: { QuestionID: question.ID, UserID: userID },
        });

        return {
          id: question.ID,
          name: question.Name,
          description: question.Description,
          difficulty: question.Difficulty,
          score: highestScore || "0",
        };
      })
    );

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
    const userID = req.user.id;
    const isDeleted = await Exam.findOne({
      where: { ID: examID, DeletedAt: { [Op.ne]: null } },
    });
    if (isDeleted) {
      return res.status(500).json({ error: "The Exam has been deleted." });
    }

    const questions = await Question.findAll({
      where: { ExamID: examID, DeletedAt: null },
      attributes: ["ID", "Name", "Description", "Difficulty"],
      raw: true,
    });

    const questionsWithScores = await Promise.all(
      questions.map(async (question) => {
        const highestScore = await Submission.max("Score", {
          where: { QuestionID: question.ID, UserID: userID },
        });

        return {
          id: question.ID,
          name: question.Name,
          description: question.Description,
          difficulty: question.Difficulty,
          score: highestScore || "0",
        };
      })
    );

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

    const sampleTestCases = await TestCase.findAll({
      where: { QuestionID: questionID, DeletedAt: null },
      attributes: [
        "Input",
        "Output",
        [
          Sequelize.literal(`
            ROW_NUMBER() OVER (PARTITION BY "QuestionID" ORDER BY "Sequence" ASC)
          `),
          "Sequence",
        ],
      ],
      raw: true,
    });
    const formattedTestCases = sampleTestCases.map((testCase) => ({
      input: testCase.Input,
      expected_output: testCase.Output,
    }));
    const response = {
      id: question.ID,
      name: question.Name,
      description: question.Description,
      difficulty: question.Difficulty,
      time_limit: question.TimeLimit,
      memory_limit: question.MemoryLimit,
      constraints: question.Constraints,
      sample_test_cases: formattedTestCases,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching question details:", error);
    res.status(500).json({ error: "Failed to fetch question details" });
  }
};
