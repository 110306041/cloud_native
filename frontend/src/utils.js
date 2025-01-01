export const userType = ["Student", "Teacher"];

export const tagsData = [
  "Binary Search",
  "Bitmasks",
  "Bruteforce",
  "Combinatorics",
  "Constructive Algorithms",
  "Data Structures",
  "DFS and Similar",
  "Divide and Conquer",
  "Dynamic Programming",
  "DSU",
  "Flows",
  "Games",
  "Graphs",
  "Greedy",
  "Implementation",
  "Math",
  "Number Theory",
  "Shortest Paths",
  "Sortings",
  "Ternary Search",
  "Trees",
  "Two Pointers",
];

export const getDifficulty = (problem) => {
  if (problem.countTotal === 0) {
    return "Hard";
  } else {
    let ratio = problem.countAC / problem.countTotal;
    if (ratio > 0.7) return "Easy";
    else if (ratio > 0.3) return "Medium";
    else return "Hard";
  }
};

export const getDateTime = (value) => {
  const date =
    new Date(value).toLocaleString("default", {
      month: "short",
    }) +
    " " +
    new Date(value).getDate() +
    ", " +
    new Date(value).getFullYear();
  const time = new Date(value).toLocaleTimeString();
  return date + " " + time;
};

export const mockHws = [
  {
    id: 1,
    name: "Assignment 1",
    question_count: 10,
    status: "completed", // 測試狀態
    due_date: "2024-01-15T23:59:59",
    score: 85,
    description:
      "a;eifja;weifja;weoifja;wefija;woeifaj;weoifja;woeifja;weoifa;woeifja;oewifja;woeifja;oewifja;woeifj",
  },
  {
    id: 2,
    name: "Assignment 2",
    question_count: 8,
    status: "in progress", // 測試狀態
    due_date: "2024-01-20T23:59:59",
    score: 70,
  },
  {
    id: 3,
    name: "Assignment 3",
    question_count: 12,
    status: "overdue", // 測試狀態
    due_date: "2024-01-10T23:59:59",
    score: 50,
  },
];

export const problemFake = {
  id: 1,
  name: "Merge Strings Alternately",
  description: "hahahahhahahahahaha",
  timeLimit: 60, // sec
  memoryLimit: 500, // mb
  sampleTestcases: [
    {
      input: "case",
      output: "output",
      explanation: "this is ....\n next line",
    },
    {
      input: "case",
      output: "output",
      explanation: "this is ....\n next line",
    },
  ],
  constraints: "constraints",
  // difficulty: '',
  // submissionLimit: 3,
};

export const resultFake = {
  success: true,
  output: "result output",
  cpuUsage: 0.5,
  memoryUsage: 80,
  executionTime: 0.7,
};

// table column
// courses
export const courses = [
  { id: "id", label: "#", minWidth: 30, maxWidth: 50, align: "center" },
  {
    id: "semester",
    label: "Semester",
    minWidth: 120,
    maxWidth: 150,
    align: "left",
  },
  { id: "name", label: "Course Name", minWidth: 250, align: "left" },
  {
    id: "hw",
    label: "Homework",
    minWidth: 100,
    maxWidth: 120,
    align: "center",
  },
  {
    id: "exam",
    label: "Active Exam",
    minWidth: 100,
    maxWidth: 120,
    align: "center",
  },
];

// courseHw
export const courseHwStudentColumn = [
  { id: "id", label: "#", minWidth: 50, maxWidth: 70, align: "center" },
  { id: "name", label: "Assignment Name", minWidth: 150, align: "left" },
  {
    id: "question_count",
    label: "Question amount",
    minWidth: 100,
    maxWidth: 120,
    align: "center",
  },
  {
    id: "status",
    label: "Status",
    minWidth: 100,
    maxWidth: 120,
    align: "center",
  },

  {
    id: "dueDate",
    label: "Due Date",
    minWidth: 120,
    maxWidth: 150,
    align: "center",
  },
  {
    id: "score",
    label: "Score",
    minWidth: 100,
    maxWidth: 120,
    align: "center",
  },
];

export const courseHwTeacherColumn = [
  { id: "id", label: "#", minWidth: 50, maxWidth: 70, align: "center" },
  { id: "name", label: "Assignment Name", minWidth: 150, align: "left" },
  {
    id: "description",
    label: "Description",
    minWidth: 150,
    maxWidth: 200,
    align: "left",
  },
  {
    id: "question_count",
    label: "Question amount",
    minWidth: 100,
    maxWidth: 120,
    align: "center",
  },

  {
    id: "dueDate",
    label: "Due Date",
    minWidth: 120,
    maxWidth: 150,
    align: "center",
  },
];

// courseExam
export const courseExamStudentColumn = [
  { id: "id", label: "#", minWidth: 50, maxWidth: 70, align: "center" },
  { id: "name", label: "Exam Name", minWidth: 150, align: "left" },
  {
    id: "startDate",
    label: "Start Date",
    minWidth: 120,
    maxWidth: 150,
    align: "center",
  },
  {
    id: "dueDate",
    label: "Due Date",
    minWidth: 120,
    maxWidth: 150,
    align: "center",
  },
  {
    id: "score",
    label: "Score",
    minWidth: 100,
    maxWidth: 120,
    align: "center",
  },
];

export const courseExamTeacherColumn = [
  { id: "id", label: "#", minWidth: 50, maxWidth: 70, align: "center" },
  { id: "name", label: "Exam Name", minWidth: 150, align: "left" },
  {
    id: "startDate",
    label: "Start Date",
    minWidth: 120,
    maxWidth: 150,
    align: "center",
  },
  {
    id: "dueDate",
    label: "Due Date",
    minWidth: 120,
    maxWidth: 150,
    align: "center",
  },
];

// problemSet
// 學生的欄位配置
export const problemsetStudentColumn = [
  {
    id: "id",
    label: "#",
    width: 50,
    align: "center",
  },
  {
    id: "name",
    label: "Problem Name",
    width: 200,
    align: "left",
  },
  {
    id: "description",
    label: "Description",
    minWidth: 200,
    maxWidth: 400, // Add maxWidth
    align: "left",
  },
  {
    id: "difficulty",
    label: "Difficulty",
    width: 120,
    align: "center",
  },
  {
    id: "score",
    label: "Score",
    width: 100,
    align: "center",
  },
];

// Similar update for teacher columns:
export const problemsetTeacherColumn = [
  {
    id: "id",
    label: "#",
    width: 50,
    align: "center",
  },
  {
    id: "name",
    label: "Problem Name",
    width: 150,
    align: "left",
  },
  {
    id: "description",
    label: "Description",
    minWidth: 200,
    maxWidth: 400, // Add maxWidth
    align: "left",
  },
  {
    id: "difficulty",
    label: "Difficulty",
    width: 120,
    align: "center",
  },
];
