import db from "../../../models/index.js";
import { Op, Sequelize } from "sequelize";

const {
  UserCourse,
  Course,
  Assignment,
  Submission,
  Exam,
  User,
  Question,
  TestCase,
} = db;

export const getSubmissionByStudent = async (req, res) => {
  try {
    const studentID = req.user.id;

    const submissions = await Submission.findAll({
      where: { UserID: studentID},
    });


    res.status(200).json({
      submissions: submissions,
    });
  } catch (error) {
    console.error("Error fetching submission :", error);
    res.status(500).json({ error: "Failed to fetch submission" });
  }
};
