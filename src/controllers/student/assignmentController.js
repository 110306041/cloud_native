import db from "../../../models/index.js";
import { Op, Sequelize } from "sequelize";

const { UserCourse, Course, Assignment, Submission, Exam, User, Question } = db;

export const getAssignmentsAndExams = async (req, res) => {
  try {
    const { courseID } = req.params;
    const studentID = req.user.id;
    const isDeleted = await Course.findOne({
      where: { ID: courseID, DeletedAt: { [Op.ne]: null } },
    });
    if (isDeleted) {
      return res.status(500).json({ error: "The course has been deleted." });
    }

    // Fetch assignments
    const assignments = await Assignment.findAll({
      where: { CourseID: courseID, DeletedAt: null },
      attributes: [
        "ID",
        "Name",
        "DueDate",
        "StartDate",
        [
          Sequelize.fn("COUNT", Sequelize.col("Questions.ID")),
          "question_count",
        ],
      ],
      include: [
        {
          model: Question,
          attributes: [], 
          required: false,
          where: { DeletedAt: null },
        },
      ],
      group: [
        "Assignment.ID",
        "Assignment.Name",
        "Assignment.DueDate",
        "Assignment.StartDate",
      ], // Include all selected columns
    });

    console.log(assignments)

    // Map assignments to include the score
    const assignmentsWithScore = await Promise.all(
      assignments.map(async (assignment) => {
        const scoreResult = await Submission.sequelize.query(
          `
            SELECT SUM("maxScore") AS score
            FROM (
              SELECT MAX("Score") AS "maxScore"
              FROM public."Submission"
              GROUP BY "QuestionID", "UserID"
              HAVING "UserID" = '${studentID}'
                AND "QuestionID" IN (
                  SELECT "ID"
                  FROM "Question"
                  WHERE "DeletedAt" = null AND "AssignmentID" = '${assignment.ID}'
                )
            ) AS max_scores
          `,
          {
            type: Sequelize.QueryTypes.SELECT,
          }
        );

        const score = scoreResult[0]?.score || 0;

        return {
          id: assignment.ID,
          name: assignment.Name,
          due_date: assignment.DueDate,
          start_date: assignment.StartDate,
          question_count: assignment.get("question_count") || 0, // Use .get() with raw: false
          score: score || 0,
        };
      })
    );

    // Fetch exams
    const exams = await Exam.findAll({
      where: { CourseID: courseID, DeletedAt: null },
      attributes: ["ID", "Name", "StartDate", "DueDate"],
      include: [
        {
          model: Course,
          attributes: ["ID", "Name"],
          where: { DeletedAt: null },
        },
      ],
      raw: false, // Disable raw for better handling of attributes
    });

    // Map exams to include is_active field
    const examsWithActiveStatus = await Promise.all(
      exams.map(async (exam) => {
        const scoreResult = await Submission.sequelize.query(
          `
            SELECT SUM("maxScore") AS score
            FROM (
              SELECT MAX("Score") AS "maxScore"
              FROM public."Submission"
              GROUP BY "QuestionID", "UserID"
              HAVING "UserID" = '${studentID}'
                AND "QuestionID" IN (
                  SELECT "ID"
                  FROM "Question"
                  WHERE "DeletedAt" = null AND "ExamID" = '${exam.ID}'
                )
            ) AS max_scores
          `,
          {
            type: Sequelize.QueryTypes.SELECT,
          }
        );

        const score = scoreResult[0]?.score || 0;
        return {
          id: exam.ID,
          name: exam.Name,
          start_date: exam.StartDate,
          due_date: exam.DueDate,
          course: {
            id: exam.Course?.ID || null, // Use optional chaining for nested fields
            name: exam.Course?.Name || null,
          },
          is_active: new Date() >= exam.StartDate && new Date() <= exam.DueDate,
          score: score || 0,
        };
      })
    );

    // Send response
    res.status(200).json({
      assignments: assignmentsWithScore,
      exams: examsWithActiveStatus,
    });
  } catch (error) {
    console.error("Error fetching assignments and exams:", error);
    res.status(500).json({ error: "Failed to fetch assignments and exams" });
  }
};
