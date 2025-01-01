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

export function getAllVMStats() {
  return Array.from(connectedAgents.entries()).map(([agentId, stats]) => ({
    agentId,
    ...stats,
  }));
}

export function updateVMStats(vmId, updatedStats) {
  if (connectedAgents.has(vmId)) {
    const currentStats = connectedAgents.get(vmId);
    connectedAgents.set(vmId, { ...currentStats, ...updatedStats });
    console.log(`Updated stats for VM ${vmId}:`, connectedAgents.get(vmId));
  } else {
    console.error(`VM with ID ${vmId} not found.`);
  }
}

export function selectBestVM(requiredCpu, requiredMemory) {
  const vmStats = getAllVMStats();
  let bestVM = null;
  let bestScore = Infinity;

  for (const vm of vmStats) {
    const availableCpu = vm.total_cpu - vm.cpu_usage;
    const availableMemory = vm.total_memory - vm.memory_usage;

    if (availableCpu < requiredCpu || availableMemory < requiredMemory) {
      continue;
    }

    const normalizedCpuUtilization =
      (availableCpu - requiredCpu) / vm.total_cpu;
    const normalizedMemoryUtilization =
      (availableMemory - requiredMemory) / vm.total_memory;

    const score =
      normalizedCpuUtilization * 0.5 + normalizedMemoryUtilization * 0.5;

    if (score < bestScore) {
      bestScore = score;
      bestVM = vm;
    }
  }

  return bestVM;
}

export async function handleRequest(req, res) {
  try {
    const { questionID, language, code } = req.body;
    const studentID = req.user.id;
    const submissionCount = await Submission.count({
      where: { UserID: studentID, QuestionID: questionID },
    });
    // console.log(submissionCount);
    const question = await Question.findOne({
      where: { ID: questionID, DeletedAt: null },
      attributes: ["SubmissionLimit"],
    });
    // console.log(question.SubmissionLimit);

    if (question && submissionCount >= question.SubmissionLimit) {
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

    const taskId = uuidv4();

    const task = {
      id: taskId,
      language: language,
      code: code,
      testCases: formattedTestCases,
    };
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

    // 1) Resource lookup
    const allocatedResource = languageResources[language];
    if (!allocatedResource) {
      return res.status(400).json({ message: "Unsupported language" });
    }

    // 2) Select best VM
    const bestVM = await selectBestVM(
      allocatedResource.cpu,
      allocatedResource.memory
    );
    if (!bestVM) {
      return res.status(503).json({ message: "No worker available" });
      // --------------------------------------------------------------------------------------------------------
      // DO THE AUTO SCALING
      // --------------------------------------------------------------------------------------------------------
    }

    // ****** The agent ID must match bestVM.id. So your agent must have registered with the same ID. *******
    const agentId = bestVM.agentId; // Get the agentId
    const fullVMDetails = connectedAgents.get(agentId);
    const agentWs = fullVMDetails.endpoint;

    // VM checkpoint
    if (!agentWs) {
      return res.status(503).json({ message: "Selected VM is not connected" });
    }

    // 3) Update VM stats (pre-allocate)
    await updateVMStats(agentId, {
      cpu_usage: parseFloat(fullVMDetails.cpu_usage) + allocatedResource.cpu,
      memory_usage:
        parseFloat(fullVMDetails.memory_usage) + allocatedResource.memory,
      num_runners: parseInt(fullVMDetails.num_runners) + 1,
    });

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
      }),
      (err) => {
        if (err) {
          // If there's an error sending, remove from pendingTasks and revert usage
          pendingTasks.delete(taskId);
          updateVMStats(agentId, {
            cpu_usage: parseFloat(fullVMDetails.cpu_usage),
            memory_usage: parseFloat(fullVMDetails.memory_usage),
            num_runners: parseInt(fullVMDetails.num_runners),
          });
          return res
            .status(500)
            .json({ message: "Failed to send task to agent" });
        }
      }
    );

    // 8) Await the agent's response
    try {
      const response = await agentPromise;
      let resourcesReverted = false;

      const currentStats = connectedAgents.get(agentId);
      const revertResources = async () => {
        if (!resourcesReverted) {
          await updateVMStats(agentId, {
            cpu_usage:
              parseFloat(currentStats.cpu_usage) - allocatedResource.cpu,
            memory_usage:
              parseFloat(currentStats.memory_usage) - allocatedResource.memory,
            num_runners: parseInt(currentStats.num_runners) - 1,
          });
          resourcesReverted = true;
        }
      };

      if (!response.success) {
        const errorDetails = response.data.match(/code (\d+)/);
        const lineNumber = errorDetails ? parseInt(errorDetails[1], 10) : 0;
        const errorRes = {
          error: {
            code: "EXECUTION_ERROR",
            message: "程式執行錯誤",
            details: {
              line: lineNumber,
              error_message: response.data || "runtime error",
            },
          },
        };
        await revertResources();

        return res.status(400).json({ status: "error", errorRes });
      }
      const resultt = response.data.result;
      const metrics = response.data.metrics;

      const transformedTestCases = resultt.cases.map((testCase) => {
        return {
          case_id: testCase.id,
          status: testCase.status,
          execution_time: Math.round(testCase.time * 1000),

          input: JSON.stringify(testCase.input),
          expected_output: JSON.stringify(testCase.expected),
          actual_output: JSON.stringify(testCase.actual),
        };
      });

      const score = Math.round((resultt.passed / resultt.total) * 100);

      const output = {
        test_cases: transformedTestCases,
        total_test_cases: resultt.total,
        passed_test_cases: resultt.passed,
        score: score,
        cpu_usage: metrics.resources.cpu.used,
        memory_usage: metrics.resources.memory.used,

        execution_time: Math.round(resultt.execution_time * 1000),
      };

      await newSubmission.update({
        Score: score,
        TimeSpend: output.execution_time,
        MemoryUsage: output.memory_usage,
      });

      await revertResources();
      console.log(connectedAgents);
      console.log("end");

      return res.json({ status: "success", output });
    } catch (error) {
      console.error("Agent error:", error);

      // Revert usage stats
      if (!resourcesReverted) {
        await updateVMStats(agentId, {
          cpu_usage: parseFloat(currentStats.cpu_usage) - allocatedResource.cpu,
          memory_usage:
            parseFloat(currentStats.memory_usage) - allocatedResource.memory,
          num_runners: parseInt(currentStats.num_runners) - 1,
        });
      }

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
