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
// import User from "../../../models/User.js";
import db from "../../../models/index.js";

const { UserCourse, Course, Assignment, Submission, Exam, User, Question } = db;

import { Sequelize } from "sequelize";

export const getAssignmentsAndExams = async (req, res) => {
  try {
    const { courseID } = req.params;

    // Fetch assignments for the specified course
    const assignments = await Assignment.findAll({
      where: { CourseID: courseID },
      attributes: [
        "ID",
        "Name",
        "DueDate",
        "Description",
        [
          Sequelize.fn("COUNT", Sequelize.col("Questions.ID")),
          "question_count",
        ],
      ],
      include: [
        {
          model: Course,
          attributes: ["ID", "Name"],
        },
        {
          model: Question,
          attributes: [],
        },
      ],
      group: ["Assignment.ID", "Course.ID"],
      raw: false,
    });

    // Transform assignments response
    const formattedAssignments = assignments.map((assignment) => ({
      id: assignment.ID,
      name: assignment.Name,
      due_date: assignment.DueDate,
      description: assignment.Description,
      question_count: assignment.dataValues.question_count || 0,
      course: {
        id: assignment.Course.ID,
        course_name: assignment.Course.Name,
      },
    }));

    // Fetch exams for the specified course
    const exams = await Exam.findAll({
      where: { CourseID: courseID },
      attributes: ["ID", "Name", "StartDate", "DueDate"],
      include: [
        {
          model: Course,
          attributes: ["ID", "Name"],
        },
      ],
    });

    // Transform exams response
    const formattedExams = exams.map((exam) => ({
      id: exam.ID,
      name: exam.Name,
      start_date: exam.StartDate,
      due_date: exam.DueDate,
      course: {
        id: exam.Course.ID,
        name: exam.Course.Name,
      },
    }));

    // Send response
    res.status(200).json({
      assignments: formattedAssignments,
      exams: formattedExams,
    });
  } catch (error) {
    console.error("Error fetching assignments and exams:", error);
    res.status(500).json({ error: "Failed to fetch assignments and exams" });
  }
};

export const createAssignment = async (req, res) => {
  try {
    const { courseID } = req.params;
    const { assignment_name, due_date, description } = req.body;
    const teacherID = req.user.id;

    // Validate if the course exists and the user is its teacher
    console.log(Course.associations);
    const course = await Course.findOne({
      where: { ID: courseID },
      include: [
        {
          model: UserCourse, // Ensure this is the correct model
          where: { UserID: teacherID },
        },
      ],
    });
    if (!course) {
      return res.status(403).json({
        error:
          "You are not authorized to add assignments to this course or the course does not exist.",
      });
    }

    const existingAssignment = await Assignment.findOne({
      where: {
        CourseID: courseID,
        Name: assignment_name,
      },
    });

    if (existingAssignment) {
      return res.status(400).json({
        error:
          "An assignment with the same name already exists in this course.",
      });
    }

    // Create a new assignment
    const newAssignment = await Assignment.create({
      // ID: uuidv4(), // Generate a unique ID for the assignment
      Name: assignment_name,
      DueDate: new Date(due_date),
      Description: description,
      CourseID: courseID,
    });

    // Return the created assignment
    res.status(201).json({
      message: "Assignment created successfully.",
      assignment: {
        id: newAssignment.ID,
        name: newAssignment.Name,
        due_date: newAssignment.DueDate,
        description: newAssignment.Description,
        course: {
          id: course.ID,
          name: course.Name,
        },
      },
    });
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({ error: "Failed to create assignment." });
  }
};
