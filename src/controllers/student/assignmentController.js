import db from "../../../models/index.js";
import { Op, Sequelize } from "sequelize";
import moment from "moment-timezone";

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
        [
          Sequelize.literal(`(
            SELECT ARRAY_AGG("ID")
            FROM "Question"
            WHERE "Question"."AssignmentID" = "Assignment"."ID"
              AND "Question"."DeletedAt" IS NULL
          )`),
          "question_ids",
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
      ],
      raw: false,
    });

    function determineAssignmentStatus(assignment, isComplete) {
      const currentTime = moment
        .tz("Asia/Taipei")
        .format("YYYY-MM-DD HH:mm:ss");
      const currentDate = moment(currentTime, "YYYY-MM-DD HH:mm:ss").format(
        "YY-MM-DD HH:mm:ss"
      );
      const startDate = moment(assignment.StartDate).format(
        "YY-MM-DD HH:mm:ss"
      );
      const dueDate = moment(assignment.DueDate).format("YY-MM-DD HH:mm:ss");

      if (isComplete) {
        return "Completed";
      }

      if (currentDate > dueDate) {
        return "overdue";
      }

      if (currentDate < startDate) {
        return "not started";
      }

      if (currentDate >= startDate && currentDate <= dueDate) {
        return "in progress";
      }

      if (currentDate < startDate) {
        return "not started";
      }

      return "Unknown";
    }

    const assignmentsWithScore = await Promise.all(
      assignments.map(async (assignment) => {
        console.log("log assingment entry");
        console.log(assignment);
        const questionIds = assignment.dataValues.question_ids || [];
        const totalQuestions = questionIds.length;
        console.log("log questionID");
        console.log(questionIds);

        const completedQuestions = new Set(
          await Submission.findAll({
            attributes: ["QuestionID"],
            where: {
              UserID: studentID,
              QuestionID: { [Op.in]: questionIds },
            },
            raw: true,
          }).then((submissions) =>
            submissions.map((submission) => submission.QuestionID)
          )
        );

        let isComplete = completedQuestions.size === totalQuestions;

        console.log(questionIds);
        const questionIdsString = questionIds.map((id) => `'${id}'`).join(",");

        const scoreResult = await Submission.sequelize.query(
          `
            SELECT AVG("maxScore") AS score
            FROM (
              SELECT MAX("Score") AS "maxScore"
              FROM public."Submission"
              GROUP BY "QuestionID", "UserID"
              HAVING "UserID" = '${studentID}'
                AND "QuestionID" IN  (${questionIdsString})
            ) AS max_scores
          `,
          {
            type: Sequelize.QueryTypes.SELECT,
          }
        );

        const score = scoreResult[0]?.score || 0;
        const status = determineAssignmentStatus(assignment, isComplete);

        return {
          id: assignment.ID,
          name: assignment.Name,
          due_date: assignment.DueDate,
          start_date: assignment.StartDate,
          question_count: totalQuestions,
          score: parseInt(score) || 0,
          status: status,
        };
      })
    );

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
      raw: false,
    });

    const examsWithActiveStatus = await Promise.all(
      exams.map(async (exam) => {
        const scoreResult = await Submission.sequelize.query(
          `
            (SELECT AVG("maxScore") AS score
            FROM (
              SELECT MAX("Score") AS "maxScore"
              FROM public."Submission"
              GROUP BY "QuestionID", "UserID"
              HAVING "UserID" = '${studentID}'
                AND "QuestionID" IN (
                  SELECT "ID"
                  FROM "Question"
                  WHERE "DeletedAt" IS NULL AND "ExamID" = '${exam.ID}'
                )
            ) AS max_scores
        )
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
            id: exam.Course?.ID || null,
            name: exam.Course?.Name || null,
          },
          is_active: new Date() >= exam.StartDate && new Date() <= exam.DueDate,
          score: parseInt(score) || 0,
        };
      })
    );

    res.status(200).json({
      assignments: assignmentsWithScore,
      exams: examsWithActiveStatus,
    });
  } catch (error) {
    console.error("Error fetching assignments and exams:", error);
    res.status(500).json({ error: "Failed to fetch assignments and exams" });
  }
};
