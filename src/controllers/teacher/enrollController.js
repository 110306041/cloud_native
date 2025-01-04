import { Op, Sequelize } from "sequelize";

import db from "../../../models/index.js";

const { UserCourse, User } = db;

export const getAllStudentIds = async (req, res) => {
  try {
    const teacher = await User.findOne({
      where: { ID: req.user.id, Type: "teacher" },
    });

    if (!teacher) {
      return res
        .status(403)
        .json({ error: "Only teachers are able to use this service." });
    }

    const students = await User.findAll({
      attributes: ["ID"],
      where: { Type: "student" },
    });

    res.status(200).json(students.map((student) => student.ID));
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch student IDs", details: error.message });
  }
};

export const addStudentsToCourse = async (req, res) => {
  const { courseID } = req.params;

  const { studentIds } = req.body;

  if (!Array.isArray(studentIds)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const teacher = await User.findOne({
      where: { ID: req.user.id, Type: "teacher" },
    });

    if (!teacher) {
      return res
        .status(403)
        .json({ error: "Only teachers are able to use this service." });
    }

    const validUsers = await User.findAll({
      where: { ID: studentIds, Type: "student" },
      attributes: ["ID"],
    });

    const validUserIds = validUsers.map((user) => user.ID);

    const invalidUserIds = studentIds.filter(
      (ID) => !validUserIds.includes(ID)
    );
    if (invalidUserIds.length > 0) {
      return res.status(400).json({
        error: "Some studentIDs do not exist",
        invalidUserIds,
      });
    }
    const existingRecords = await UserCourse.findAll({
        where: {
          CourseID: courseID,
          UserID: validUserIds,
        },
        attributes: ["UserID"],
      });
  
      const existingUserIds = existingRecords.map((record) => record.UserID);
  
      if (existingUserIds.length > 0) {
        return res.status(400).json({
          error: "Some students are already enrolled in the course",
          existingUserIds,
        });
      }
    const records = studentIds.map((studentId) => ({
      UserID: studentId,
      CourseID: courseID,
    }));

    await UserCourse.bulkCreate(records, { ignoreDuplicates: true });

    res
      .status(201)
      .json({ message: "Students added to the course successfully" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to add students to the course",
      details: error.message,
    });
  }
};
