import db from "../../../models/index.js";
import { Op, Sequelize } from "sequelize";

const { UserCourse, Course, Assignment, Submission, Exam, User, Question } = db;

export const getAssignmentsAndExams = async (req, res) => {
  try {
    const { courseID } = req.params;
    const studentID = req.user.id; 
    // Fetch assignments
    const assignments = await Assignment.findAll({
      where: { CourseID: courseID },
      attributes: ["ID", "Name", "DueDate", "StartDate"],
      include: [
        {
          model: Question,
          attributes: [],
        },
      ],
      group: ["Assignment.ID"],
      raw: true,
      attributes: [
        "ID",
        "Name",
        "DueDate",
        [
          Sequelize.fn("COUNT", Sequelize.col("Questions.ID")),
          "question_count",
        ],
      ],
    });

    // Map assignments to include the score
    const assignmentsWithScore = await Promise.all(
      assignments.map(async (assignment) => {
        const score = await Submission.sum("Score", {
          where: {
            // AssignmentID: assignment.id,
            QuestionID: {
              [Op.in]: Sequelize.literal(`
                                  (SELECT "Question"."ID" FROM "Question" WHERE "Question"."AssignmentID" = '${assignment.ID}')
                              `),
            },
            UserID: studentID,
          },
        });

        return {
          id: assignment.ID,
          name: assignment.Name,
          due_date: assignment.DueDate,
          start_date:assignment.StartDate,
          question_count: assignment.question_count || 0,
          score: score || 0,
        };
      })
    );

    // Fetch exams
    const exams = await Exam.findAll({
      where: { CourseID: courseID },
      attributes: ["ID", "Name", "StartDate", "DueDate"],
      include: [
        {
          model: Course,
          attributes: ["ID", "Name"],
        },
      ],
      raw: true,
    });

  

    // Map exams to include is_active field
    const examsWithActiveStatus = await Promise.all(
      exams.map(async (exam) => {
        const score = await Submission.sum("Score", {
          where: {
            QuestionID: {
              [Op.in]: Sequelize.literal(`
                (SELECT "Question"."ID" FROM "Question" WHERE "Question"."ExamID" = '${exam.ID}')
              `),
            },
            UserID: studentID,
          },
        });
    
        return {
          id: exam.ID,
          name: exam.Name,
          start_date: exam.StartDate,
          due_date: exam.DueDate,
          course: {
            id: exam["Course.ID"],
            name: exam["Course.Name"],
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
