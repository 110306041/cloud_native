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

// fake data
export const problemsetFake = [
  {
    id: 1,
    name: 'test',
    score: 80,
    difficulty: 'Hard'
  },
  {
    id: 1,
    name: 'test',
    score: 80,
    difficulty: 'Hard'
  },
  {
    id: 1,
    name: 'test',
    score: 80,
    difficulty: 'Hard'
  },
  {
    id: 1,
    name: 'test',
    score: 80,
    difficulty: 'Hard'
  },
  {
    id: 1,
    name: 'test',
    score: 80,
    difficulty: 'Hard'
  },
  {
    id: 1,
    name: 'test',
    score: 80,
    difficulty: 'Hard'
  },
  {
    id: 1,
    name: 'test',
    score: 80,
    difficulty: 'Hard'
  },
  {
    id: 1,
    name: 'test',
    score: 80,
    difficulty: 'Hard'
  },
  {
    id: 1,
    name: 'test',
    score: 80,
    difficulty: 'Hard'
  },
  {
    id: 1,
    name: 'test',
    score: 80,
    difficulty: 'Hard'
  },
  {
    id: 1,
    name: 'test',
    score: 80,
    difficulty: 'Hard'
  },
]

export const coursesFake = [
  {
    id: 1,
    semester: '113-1',
    name: 'test',
    totalHw: 5,
    doneHw: 5, //TODO: receive total amount of hw  & finished num
    exam: 1,
  },
  {
    id: 2,
    semester: '113-1',
    name: 'test2',
    totalHw: 5,
    doneHw: 5,
    exam: 1,
  },
]

export const courseHwFake = [
  {
    id: 1,
    name: 'test',
    questions: 2,
    status: 'overdue',
    startDate: '2024/12/20',
    dueDate: '2024/12/26',
    score: 80,
  },
  {
    id: 2,
    name: 'test',
    questions: 2,
    status: 'In progress',
    startDate: '2024/12/20',
    dueDate: '2024/12/26',
    score: 80,
  }
]

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