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

const { UserCourse, Course, Assignment, Submission, Exam, User } = db;


export const createExam = async (req, res) => {
    try {
        const { courseID } = req.params;
        const { exam_name, start_date, due_date, description } = req.body;
        const teacherID = req.user.id; // Assuming authentication middleware provides the teacher ID

        // Validate if the course exists and the user is its teacher
        const course = await Course.findOne({
            where: { ID: courseID },
            include: {
                model: UserCourse,
                where: { UserID: teacherID },
            },
        });

        if (!course) {
            return res.status(403).json({ error: 'You are not authorized to add exams to this course or the course does not exist.' });
        }

        // Check if an exam with the same name already exists in the course
        const existingExam = await Exam.findOne({
            where: {
                CourseID: courseID,
                Name: exam_name,
            },
        });

        if (existingExam) {
            return res.status(400).json({ error: 'An exam with the same name already exists in this course.' });
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
        console.error('Error creating exam:', error);
        res.status(500).json({ error: 'Failed to create exam.' });
    }
};