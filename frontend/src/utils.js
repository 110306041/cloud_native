export const userType = [
  "Student",
  "Professor",
]

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

const mockHws = [
  {
    id: 1,
    name: "Assignment 1",
    question_count: 10,
    status: "completed", // 測試狀態
    due_date: "2024-01-15T23:59:59",
    score: 85,
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
  name: 'Merge Strings Alternately',
  description: 'hahahahhahahahahaha',
  timeLimit: 60, // sec
  memoryLimit: 500, // mb
  sampleTestcases: [
    {
      input: 'case',
      output: 'output',
      explanation: 'this is ....\n next line'
    },
    {
      input: 'case',
      output: 'output',
      explanation: 'this is ....\n next line'
    },
  ],
  constraints: 'constraints',
  // difficulty: '',
  // submissionLimit: 3,
}

export const resultFake = {
  success: true,
  output: "result output",
  cpuUsage: 0.5,
  memoryUsage: 80,
  executionTime: 0.7,
}