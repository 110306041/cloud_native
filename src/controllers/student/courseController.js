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
export const getCoursesByStudent = async (req, res) => {
  try {
    const user = req.user;
    const studentId = user.id;
    const userCourses = await UserCourse.findAll({
      where: { UserID: studentId, DeletedAt: null },
      include: {
        model: Course,
        attributes: ["ID", "Name", "Semester"],
        where: { DeletedAt: null },
      },
      order: [[{ model: Course }, "Semester", "DESC"]],
    });

    const courses = await Promise.all(
      userCourses.map(async (uc) => {
        const courseId = uc.CourseID;

        const teacher = await UserCourse.findOne({
          where: { CourseID: courseId },
          include: {
            model: User,
            attributes: ["Name"],
          },
        });
        const teacherName = teacher?.User?.Name || "Unknown";

        const assignments = await Assignment.findAll({
          where: {
            CourseID: courseId,
            DeletedAt: null,
          },
          include: {
            model: Question,
            attributes: ["ID"],
            where: { DeletedAt: null },
          },
        });

        let completedAssignments = 0;
        for (const assignment of assignments) {
          const questions = assignment.Questions;
          const totalQuestions = questions.length;
          const completedQuestions = new Set(
            await Submission.findAll({
              attributes: ["QuestionID"],
              where: {
                UserID: studentId,
                QuestionID: { [Op.in]: questions.map((q) => q.ID) },
              },
              raw: true,
            }).then((submissions) =>
              submissions.map((submission) => submission.QuestionID)
            )
          );
          if (completedQuestions.size === totalQuestions) {
            completedAssignments++;
          }
        }

        const activeExams = await Exam.count({
          where: {
            CourseID: courseId,
            DeletedAt: null,
            StartDate: { [Op.lte]: new Date() },
            DueDate: { [Op.gte]: new Date() },
          },
        });

        return {
          id: courseId,
          name: uc.Course?.Name || "Unknown",
          semester: uc.Course?.Semester || "Unknown",
          teacher_name: teacherName,
          total_assignments: assignments.length,
          completed_assignments: completedAssignments,
          active_exams: activeExams,
        };
      })
    );

    res.status(200).json({
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses by student ID:", error);
    res.status(500).json({ error: error.message });
  }
};
