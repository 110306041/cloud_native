import db from "../../../models/index.js";
import { Op, Sequelize } from "sequelize";

const { UserCourse, Course, Assignment, Submission, Exam, User, Question } = db;

export const getCoursesByStudent = async (req, res) => {
  try {
    const user = req.user;
    const studentId = user.id;
    // Fetch user courses
    const userCourses = await UserCourse.findAll({
      where: { UserID: studentId, DeletedAt: null },
      include: {
        model: Course,
        attributes: ["ID", "Name", "Semester"],
        where: { DeletedAt: null }
      },
      order: [[{ model: Course }, "Semester", "DESC"]],
    });

    const courses = await Promise.all(
      userCourses.map(async (uc) => {
        const courseId = uc.CourseID;

        // Fetch teacher name
        const teacher = await UserCourse.findOne({
          where: { CourseID: courseId },
          include: {
            model: User,
            attributes: ["Name"],
          },
        });
        const teacherName = teacher?.User?.Name || "Unknown";

        // Calculate total assignments
        const totalAssignments = await Assignment.count({
          where: {
            CourseID: courseId,
            DeletedAt: null,
            // DueDate: { [Op.gte]: new Date() },
          },
        });

        const completedAssignments = await Submission.count({
          distinct: true,
          col: "QuestionID",
          where: {
            UserID: studentId,
            QuestionID: {
              [Op.in]: Sequelize.literal(`
                (SELECT "ID"
                 FROM "Question"
                 WHERE "DeletedAt" IS NULL AND "AssignmentID" IN (
                   SELECT "ID"
                   FROM "Assignment"
                   WHERE "DeletedAt" IS NULL AND "CourseID" = '${courseId}'
                 )
                )
              `),
            },
          },
        });
        console.log(completedAssignments);
        // Calculate active exams
        const activeExams = await Exam.count({
          where: {
            CourseID: courseId,
            DeletedAt: null,
            StartDate: { [Op.lte]: new Date() }, // Ensure the exam has started
            DueDate: { [Op.gte]: new Date() }, // Ensure the exam is still ongoing
          },
        });

        return {
          id: courseId,
          name: uc.Course?.Name || "Unknown",
          semester: uc.Course?.Semester || "Unknown",
          teacher_name: teacherName,
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
