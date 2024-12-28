// import User from "./User.js";
// import Course from "../../../models/Course.js";
// import Assignment from "../../../models/Assignment.js";
// import UserCourse from "../../../models/UserCourse.js";
// import Exam from "../../../models/Exam.js";
// import User from "../../../models/User.js";
import db from "../../../models/index.js";
import { Op } from "sequelize";


const { UserCourse, Course, Assignment, Submission, Exam, User } = db;

export const getCoursesByTeacher = async (req, res) => {
  try {
    const user = req.user;
    const teacherId = user.id;
    // Fetch user courses
    const userCourses = await UserCourse.findAll({
      where: { UserID: teacherId },
      include: {
        model: Course,
        attributes: ["ID", "Name", "Semester"],
      },
    });

    const courses = await Promise.all(
      userCourses.map(async (uc) => {
        const courseId = uc.CourseID;

        // Calculate total assignments
        const totalAssignments = await Assignment.count({
          where: {
            CourseID: courseId,
            // DueDate: { [Op.gte]: new Date() },
          },
        });

        // Calculate completed assignments
        const completedAssignments = await Assignment.count({
          where: {
            CourseID: courseId,
            DueDate: { [Op.lt]: new Date() },
          },
        });

        // Calculate active exams
        const activeExams = await Exam.count({
          where: {
            CourseID: courseId,
            StartDate: { [Op.lte]: new Date() }, // Ensure the exam has started
            DueDate: { [Op.gte]: new Date() }, // Ensure the exam is still ongoing
          },
        });

        return {
          id: courseId,
          name: uc.Course?.Name || "Unknown",
          semester: uc.Course?.Semester || "Unknown",
          total_assignments: totalAssignments,
          completed_assignments: completedAssignments,
          active_exams: activeExams,
        };
      })
    );

    // return courses;
    res.status(200).json({
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses by student ID:", error);
    res.status(500).json({ error: error.message });
    // throw error; // Ensure proper error propagation
  }
};

export const createCourse = async (req, res) => {
  try {
    const { course_name, semester, student_limit } = req.body;
    const teacherID = req.user.id;

    const user = await User.findOne({ where: { ID: teacherID } });
    if (!req.user || user.Type !== "teacher") {
      return res
        .status(403)
        .json({ error: "Only teachers can create courses." });
    }

    // Create a new course
    const newCourse = await Course.create({
      // ID: uuidv4(), // Generate a unique ID for the course
      Name: course_name,
      Semester: semester,
      StudentLimit: student_limit,
    });

    await UserCourse.create({
      UserID: teacherID,
      CourseID: newCourse.ID,
    });

    res.status(201).json({
      message: "Course created successfully.",
      course: {
        id: newCourse.ID,
        name: newCourse.Name,
        semester: newCourse.Semester,
        student_limit: newCourse.StudentLimit,
      },
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Failed to create course." });
  }
};
