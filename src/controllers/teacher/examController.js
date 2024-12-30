// import User from "./User.js";
// import Course from "./Course.js";
// import Assignment from "./Assignment.js";
// import UserCourse from "./UserCourse.js";
// import Exam from "./Exam.js";
// import Question from "./Question.js";
// import TestCase from "./TestCase.js";
// import Submission from "./Submission.js";
// import UserCourse from "../../../models/UserCourse.js";
// import Course from "../../../models/Course.js";
// import Assignment from "../../../models/Assignment.js";
// import Submission from "../../../models/Submission.js";
// import Exam from "../../../models/Exam.js";
import db from "../../../models/index.js";
import { Op, Sequelize } from "sequelize";

const { UserCourse, Course, Assignment, Submission, Exam, User, Question } = db;

export const createExam = async (req, res) => {
  try {
    const { courseID } = req.params;
    const { exam_name, start_date, due_date, description } = req.body;
    const teacherID = req.user.id; // Assuming authentication middleware provides the teacher ID

    if (start_date > due_date) {
      return res
        .status(400)
        .json({ error: "start_date have to less than due_date." });
    }
    // Validate if the course exists and the user is its teacher
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

    // Check if an exam with the same name already exists in the course
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

    // Create a new exam
    const newExam = await Exam.create({
      // ID: uuidv4(), // Generate a unique ID for the exam
      Name: exam_name,
      StartDate: new Date(start_date),
      DueDate: new Date(due_date),
      Description: description,
      CourseID: courseID,
    });

    // Return the created exam
    res.status(201).end();
    // .json({
    //     message: 'Exam created successfully.',
    //     exam: {
    //         id: newExam.ID,
    //         name: newExam.Name,
    //         start_date: newExam.StartDate,
    //         due_date: newExam.DueDate,
    //         description: newExam.Description,
    //         course: {
    //             id: course.ID,
    //             name: course.Name,
    //         },
    //     },
    // });
  } catch (error) {
    console.error("Error creating exam:", error);
    res.status(500).json({ error: "Failed to create exam." });
  }
};

export const deleteExam = async (req, res) => {
  const transaction = await Exam.sequelize.transaction(); // Start a transaction

  try {
    // Soft delete the Exam
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

    // Soft delete related Questions
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
      const {examID} = req.params; 
      const updatedData = req.body; 
  
      // Fields to exclude from update
      const excludedFields = ['ID', 'CreatedAt', 'DeletedAt', 'UpdatedAt', 'CourseID'];
  
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
      const [affectedRows] = await Exam.update(filteredData, {
        where: { ID: examID, DeletedAt: null }, // Only update non-deleted courses
      });
  
      if (affectedRows === 0) {
        return res.status(404).json({message: 'exam not found or already deleted.' });
      }
  
      return res.status(200).json({ message: 'exam updated successfully.' });
    } catch (error) {
      console.error('Error updating exam:', error);
      return res.status(500).json({ message: 'An error occurred while updating the exam.' });
    }
  };