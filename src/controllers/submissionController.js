// import { performDynamicWebSocketOperation } from "../services/connectAgent.js";
// import db from "../../../models/index.js";
import db from "../../models/index.js";
import { Op, Sequelize, UUIDV4, where } from "sequelize";
import { connectedAgents, pendingTasks } from "../server.js";
import { v4 as uuidv4 } from "uuid";

const {
  UserCourse,
  Course,
  Assignment,
  Submission,
  Exam,
  User,
  sequelize,
  TestCase,
  Question,
} = db;

const languageResources = {
  python: { cpu: 0.3, memory: 128 },
  java: { cpu: 0.5, memory: 512 },
  javascript: { cpu: 0.5, memory: 256 },
};

export async function getAllVMStats() {
  const vmKeys = await redisClient.keys("worker:*");
  const vmStats = [];
  for (const key of vmKeys) {
    const vmData = await redisClient.hGetAll(key);
    vmStats.push(vmData);
  }
  return vmStats;
}

export async function updateVMStats(vm_id, stats) {
  const vmKey = `worker:${vm_id}`;
  console.log(vmKey);
  await redisClient.hSet(vmKey, stats);
}

export async function selectBestVM(allocatedCpu, allocatedMemory) {
  const vmStats = await getAllVMStats();
  console.log(allocatedCpu, allocatedMemory);
  console.log(vmStats);
  let bestVM = null;
  let bestScore = Number.MAX_SAFE_INTEGER;

  for (const vm of vmStats) {
    const availableCpu = vm.total_cpu - vm.cpu_usage;
    const availableMemory = vm.total_memory - vm.memory_usage;

    const isResourceSufficient =
      availableCpu >= allocatedCpu && availableMemory >= allocatedMemory;

    if (isResourceSufficient) {
      const score = availableCpu + availableMemory;
      if (score < bestScore) {
        bestScore = score;
        bestVM = vm;
      }
    }
  }

  return bestVM;
}

export async function handleRequest(req, res) {
  try {
    const { questionID, language, code } = req.body;
    const studentID = req.user.id;
    // const task = req.body;
    const submissionCount = await Submission.count({
      where: { UserID: studentID, QuestionID: questionID },
    });
    console.log(submissionCount);
    const question = await Question.findOne({
      where: { ID: questionID, DeletedAt: null },
      attributes: ["SubmissionLimit"],
    });
    console.log(question.SubmissionLimit);

    if (question && submissionCount >= question.SubmissionLimit) {
      // The count is greater than or equal to the submission limit
      return res.status(403).json({ error: "Submission limit reached." });
    }

    function parseInputOrOutput(value) {
      if (!value) return []; // Return an empty array for null/undefined

      const str = String(value).trim();

      try {
        // Attempt to parse as JSON
        return JSON.parse(str);
      } catch (error) {
        console.error(`Failed to parse value as JSON: ${str}`);
        return []; // Return an empty array if parsing fails
      }
    }

    const testCases = await TestCase.findAll({
      where: { QuestionID: questionID, DeletedAt: null },
      order: [["Sequence", "ASC"]],
    });
    // const formattedTestCases = testCases.map((testCase) => ({
    //   input: testCase.Input, // Assuming 'Input' is an array
    //   expected: testCase.Output, // Assuming 'Output' is an array
    // }));
    const formattedTestCases = testCases.map((testCase) => ({
      input: parseInputOrOutput(testCase.Input),
      expected: parseInputOrOutput(testCase.Output),
    }));

    // const taskId = 'rivjdfiovjdoifv';
    const taskId = uuidv4();

    const task = {
      id: taskId,
      language: language,
      code: code,
      testCases: formattedTestCases,
    };
    console.log("oooo");
    console.log(task);
    const newSubmission = await Submission.create({
      //   ID: uuidv4(),
      Score: 0 || null,
      TimeSpend: null || null,
      MemoryUsage: null,
      Code: code,
      Language: language,
      UserID: studentID,
      QuestionID: questionID,
    });
    // Suppose user is in req.user if needed:  const user = req.user;

    // 1) Resource lookup
    // const allocatedResource = languageResources[language];
    // if (!allocatedResource) {
    //   return res.status(400).json({ message: "Unsupported language" });
    // }

    // 2) Select best VM
    // const bestVM = await selectBestVM(allocatedResource.cpu, allocatedResource.memory);
    // if (!bestVM) {
    //   return res.status(503).json({ message: "No worker available" });
    // }

    // The agent ID must match bestVM.id. So your agent must have registered with the same ID.
    // const agentWs = connectedAgents.get(bestVM.id);
    const agentWs = Array.from(connectedAgents.values())[0];
    // if (!agentWs) {
    //   return res.status(503).json({ message: "Selected VM is not connected" });
    // }

    // console.log(`Selected worker: ${bestVM.id}`);

    // 3) Update VM stats (pre-allocate)
    // await updateVMStats(bestVM.id, {
    //   cpu_usage: parseFloat(bestVM.cpu_usage) + allocatedResource.cpu,
    //   memory_usage: parseFloat(bestVM.memory_usage) + allocatedResource.memory,
    //   num_runners: parseInt(bestVM.num_runners) + 1,
    // });

    // 4) Create submission data
    // const submissionData = { questionID, language, code };

    // 5) Create a unique task ID for correlation
    // const taskId = "ffjewioejweowijw";

    // 6) Create a promise to await the agent's response
    const agentPromise = new Promise((resolve, reject) => {
      pendingTasks.set(taskId, { resolve, reject });

      // Optional timeout: if agent doesn't respond in X seconds, reject
      // setTimeout(() => {
      //   if (pendingTasks.has(taskId)) {
      //     pendingTasks.delete(taskId);
      //     reject(new Error("Agent timed out"));
      //   }
      // }, 30000);
    });

    // 7) Send the request to the agent
    agentWs.send(
      JSON.stringify({
        type: "task",
        task: task,
        // taskId,
        // payload: submissionData,
      }),
      (err) => {
        if (err) {
          // If there's an error sending, remove from pendingTasks and revert usage
          pendingTasks.delete(taskId);
          // updateVMStats(bestVM.id, {
          //   cpu_usage: parseFloat(bestVM.cpu_usage),
          //   memory_usage: parseFloat(bestVM.memory_usage),
          //   num_runners: parseInt(bestVM.num_runners),
          // });
          return res
            .status(500)
            .json({ message: "Failed to send task to agent" });
        }
      }
    );

    // 8) Await the agent's response
    try {
      const response = await agentPromise;
      // This resolves when we get "taskComplete" or rejects on "taskError"

      const resultt = response;
      console.log(resultt);
      if (!resultt.success) {
        const errorDetails = resultt.data.match(/code (\d+)/);
        const lineNumber = errorDetails ? parseInt(errorDetails[1], 10) : 0;
        const errorRes = {
          error: {
            code: "EXECUTION_ERROR",
            message: "程式執行錯誤",
            details: {
              line: lineNumber, // Use extracted line number or default to 0
              error_message: resultt.data || "runtime error",
            },
          },
        };
        // const err = resultt.data;
        return res.status(400).json({ status: "error", errorRes });
      }

      // Transform test cases
      const transformedTestCases = resultt.cases.map((testCase) => {
        return {
          case_id: testCase.id,
          status: testCase.status,
          // Convert seconds to milliseconds, e.g., 0.04s -> 40ms
          execution_time: Math.round(testCase.time * 1000),
          // If you don't have memory data, you could hardcode or estimate
          memory_used: 1024, // for example, in KB
          // Convert inputs/outputs to string or keep as array — your choice
          input: JSON.stringify(testCase.input),
          expected_output: JSON.stringify(testCase.expected),
          actual_output: JSON.stringify(testCase.actual),
        };
      });

      // Calculate a score, e.g. percentage of passed test cases
      // This is an example formula, tweak as necessary
      const score = Math.round((resultt.passed / resultt.total) * 100);

      // Combine everything into the desired format
      const output = {
        test_cases: transformedTestCases,
        total_test_cases: resultt.total,
        passed_test_cases: resultt.passed,
        score: score,
        // Convert the overall execution time (seconds) to ms
        execution_time: Math.round(resultt.execution_time * 1000),
      };

      // Now `output` has the structure you described

      await newSubmission.update({
        Score: score,
        TimeSpend: output.execution_time, // or keep in seconds
        MemoryUsage: 1024, // or a real measurement if available
      });

      console.log("Received result from worker:", resultt);

      // 9) Return success to the client
      return res.json({ status: "success", output });
      // return res.status(200).json({ status: "success", output });
    } catch (error) {
      // If the agent reported a taskError or we timed out
      console.error("Agent error:", error);

      // Revert usage stats
      // await updateVMStats(bestVM.id, {
      //   cpu_usage: parseFloat(bestVM.cpu_usage),
      //   memory_usage: parseFloat(bestVM.memory_usage),
      //   num_runners: parseInt(bestVM.num_runners),
      // });

      return res.status(500).json({
        status: "error",
        message: "Error processing request: " + error.message,
      });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(400).json({ error: error.message });
  }
}
