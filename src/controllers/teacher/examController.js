import db from "../../../models/index.js";
import { Sequelize } from "sequelize";

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
export const createExam = async (req, res) => {
  try {
    const { courseID } = req.params;
    const { exam_name, start_date, due_date, description } = req.body;
    const teacherID = req.user.id;

    if (start_date > due_date) {
      return res
        .status(400)
        .json({ error: "start_date have to less than due_date." });
    }
    const isTeacher = await User.findOne({
      where: { ID: teacherID, Type: "teacher", DeletedAt: null },
    });
    const course = await Course.findOne({
      where: { ID: courseID, DeletedAt: null },
      include: {
        model: UserCourse,
        where: { UserID: teacherID, DeletedAt: null },
      },
    });

    if (!(course && isTeacher)) {
      return res.status(403).json({
        error:
          "You are not authorized to add exams to this course or the course does not exist.",
      });
    }

    const existingExam = await Exam.findOne({
      where: {
        CourseID: courseID,
        Name: exam_name,
        DeletedAt: null,
      },
    });

    if (existingExam) {
      return res.status(400).json({
        error: "An exam with the same name already exists in this course.",
      });
    }

    const newExam = await Exam.create({
      Name: exam_name,
      StartDate: new Date(start_date),
      DueDate: new Date(due_date),
      Description: description,
      CourseID: courseID,
    });

    res.status(201).end();
  } catch (error) {
    console.error("Error creating exam:", error);
    res.status(500).json({ error: "Failed to create exam." });
  }
};

export const deleteExam = async (req, res) => {
  const transaction = await Exam.sequelize.transaction();

  try {
    const { examID } = req.params;
    const examResult = await Exam.update(
      { DeletedAt: Sequelize.fn("NOW") },
      { where: { ID: examID, DeletedAt: null }, transaction: transaction }
    );

    if (examResult[0] === 0) {
      await transaction.rollback();
      return res
        .status(500)
        .json({ error: "error occur when deleting course." });
    }

    await Question.update(
      { DeletedAt: Sequelize.fn("NOW") },
      { where: { ExamID: examID, DeletedAt: null }, transaction: transaction }
    );

    await transaction.commit();
    res.status(200).end();
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting exam:", error);
    return res.status(500).json({ error: "error occur when deleting course." });
  }
};

export const updateExam = async (req, res) => {
  try {
    const { examID } = req.params;
    const updatedData = req.body;

    const excludedFields = [
      "ID",
      "CreatedAt",
      "DeletedAt",
      "UpdatedAt",
      "CourseID",
    ];

    const filteredData = {};
    Object.keys(updatedData).forEach((key) => {
      if (!excludedFields.includes(key)) {
        filteredData[key] = updatedData[key];
      }
    });

    filteredData.UpdatedAt = new Date();

    const [affectedRows] = await Exam.update(filteredData, {
      where: { ID: examID, DeletedAt: null },
    });

    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "exam not found or already deleted." });
    }

    return res.status(200).json({ message: "exam updated successfully." });
  } catch (error) {
    console.error("Error updating exam:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the exam." });
  }
};
