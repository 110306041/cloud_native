import db from "../../../models/index.js";
import { Op, Sequelize } from "sequelize";

const { UserCourse, Course, Assignment, Submission, Exam, User, Question } = db;

export const getCoursesByStudent = async (req, res) => {
  try {
    const user = req.user;
    const studentId = user.id;
    // Fetch user courses
    const userCourses = await UserCourse.findAll({
      where: { UserID: studentId },
      include: {
        model: Course,
        attributes: ["ID", "Name", "Semester"],
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
            DueDate: { [Op.gte]: new Date() },
          },
        });

        // Calculate completed assignments
        const completedAssignmentGroups = await Assignment.count({
          where: { CourseID: courseId },
          include: [
            {
              model: Question,
              include: [
                {
                  model: Submission,
                  where: { UserID: studentId },
                  attributes: [],
                },
              ],
              attributes: [],
            },
          ],
          group: ["Assignment.ID"],
          having: Sequelize.literal(
            `COUNT(DISTINCT "Questions"."ID") = (
                SELECT COUNT(*) 
                FROM "Question" 
                WHERE "Question"."AssignmentID" = "Assignment"."ID"
              )`
          ),
          logging: console.log,
        });
        const completedAssignments = Array.isArray(completedAssignmentGroups)
          ? completedAssignmentGroups.length
          : 0;
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
