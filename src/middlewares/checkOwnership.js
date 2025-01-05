import db from "../../models/index.js";
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
export const checkCourseOwnership = async (req, res, next) => {
  try {
    const { courseID } = req.params;
    const userID = req.user.id;
    const userCousre = await UserCourse.findOne({
      where: { CourseID: courseID, UserID: userID, DeletedAt: null },
    });

    if (!userCousre) {
      return res
        .status(404)
        .json({ message: "Course not found with your ownership" });
    }
    next();
  } catch (error) {
    console.error("Error checking course ownership:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while checking ownership." });
  }
};

export const checkAssignmentOwnership = async (req, res, next) => {
  try {
    const { assignmentID } = req.params;
    const userID = req.user.id;
    console.log(assignmentID);
    console.log(userID);

    const assignment = await Assignment.findOne({
      where: { ID: assignmentID, DeletedAt: null },
      include: [
        {
          model: Course,
          attributes: ["ID"],
          include: [
            {
              model: UserCourse,
              attributes: ["ID"],
              where: { UserID: userID, DeletedAt: null },
              required: true,
            },
          ],
          required: true,
        },
      ],
    });
    console.log(assignment);
    if (!assignment) {
      return res
        .status(403)
        .json({ message: "Permission Denied or Assignment not found." });
    }

    next();
  } catch (error) {
    console.error("Error checking assignment ownership:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while checking ownership." });
  }
};

export const checkExamOwnership = async (req, res, next) => {
  try {
    const { examID } = req.params;
    const userID = req.user.id;

    const exam = await Exam.findOne({
      where: { ID: examID, DeletedAt: null },
      include: [
        {
          model: Course,
          attributes: ["ID"],
          include: [
            {
              model: UserCourse,
              attributes: ["ID"],
              where: { UserID: userID },
              required: true,
            },
          ],
          required: true,
        },
      ],
    });

    if (!exam) {
      return res
        .status(403)
        .json({ message: "Permission Denied or Exam not found." });
    }

    next();
  } catch (error) {
    console.error("Error checking exam ownership:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while checking ownership." });
  }
};

export const checkAssignmentORExamOwnership = async (req, res, next) => {
  try {
    const { exam_id, assignment_id } = req.body;
    const userID = req.user.id;

    if (exam_id && assignment_id) {
      return res.status(400).json({
        message: "A question are only able to add on a assingment or Exam.",
      });
    }

    if (exam_id) {
      const exam = await Exam.findOne({
        where: { ID: exam_id, DeletedAt: null },
        include: [
          {
            model: Course,
            attributes: ["ID"],
            include: [
              {
                model: UserCourse,
                attributes: ["ID"],
                where: { UserID: userID, DeletedAt: null },
                required: true,
              },
            ],
            required: true,
          },
        ],
      });

      if (!exam) {
        return res
          .status(403)
          .json({ message: "Permission Denied or Exam not found." });
      }

      return next();
    }

    if (assignment_id) {
      const assignment = await Assignment.findOne({
        where: { ID: assignment_id, DeletedAt: null },
        include: [
          {
            model: Course,
            attributes: ["ID"],
            include: [
              {
                model: UserCourse,
                attributes: ["ID"],
                where: { UserID: userID, DeletedAt: null },
                required: true,
              },
            ],
            required: true,
          },
        ],
      });

      if (!assignment) {
        return res
          .status(403)
          .json({ message: "Permission Denied or Assignment not found." });
      }

      return next();
    }

    return res
      .status(400)
      .json({ message: "Either exam_id or assignment_id must be provided." });
  } catch (error) {
    console.error("Error checking ownership:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while checking ownership." });
  }
};

export const checkQuestionOwnership = async (req, res, next) => {
  try {
    const questionID = req.params.questionID || req.body.questionID;
    const userID = req.user.id;

    const question = await Question.findOne({
      where: { ID: questionID, DeletedAt: null },
      include: [
        {
          model: Assignment,
          attributes: ["ID"],
          include: [
            {
              model: Course,
              attributes: ["ID"],
              required: true,
              include: [
                {
                  model: UserCourse,
                  attributes: ["ID"],
                  where: { UserID: userID, DeletedAt: null },
                },
              ],
            },
          ],
        },
        {
          model: Exam,
          attributes: ["ID"],
          include: [
            {
              model: Course,
              attributes: ["ID"],
              required: true,
              include: [
                {
                  model: UserCourse,
                  attributes: ["ID"],
                  where: { UserID: userID, DeletedAt: null },
                },
              ],
            },
          ],
        },
      ],
    });

    const hasValidAssociation =
      question.Assignment !== null || question.Exam !== null;
    if (!(question && hasValidAssociation)) {
      return res
        .status(403)
        .json({ message: "Permission Denied or Question not found." });
    }

    next();
  } catch (error) {
    console.error("Error checking question ownership:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while checking ownership." });
  }
};
