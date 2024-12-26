import { performDynamicWebSocketOperation } from "../services/connectAgent.js";
import Submission from "../../models/Submission.js";
import redisClient from "../../connectRedis.js";
const languageResources = {
  python: { cpu: 20, memory: 500 },
  java: { cpu: 30, memory: 800 },
  javascript: { cpu: 15, memory: 300 },
  golang: { cpu: 25, memory: 600 },
  ruby: { cpu: 20, memory: 400 },
};

export async function getAllVMStats() {
  const vmKeys = await redisClient.keys("worker#*");
  const vmStats = [];
  for (const key of vmKeys) {
    const vmData = await redisClient.hGetAll(key);
    vmStats.push(vmData);
  }
  return vmStats;
}

export async function updateVMStats(vm_id, stats) {
  const vmKey = `worker#${vm_id}`;
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

    // console.log(availableCpu, availableMemory);
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
    const user = req.user;

    // console.log(req.body);
    // console.log(req.user.id);

    const allocatedRecourse = languageResources[language];
    const bestVM = await selectBestVM(
      allocatedRecourse.cpu,
      allocatedRecourse.memory
    );

    if (!bestVM) {
      return res.status(503).json({ message: "No worker available" });
    }

    const { endpoint } = bestVM;
    console.log(`Selected worker: ${bestVM.id}, Endpoint: ${endpoint}`);

    await updateVMStats(bestVM.id, {
      cpu_usage: parseFloat(bestVM.cpu_usage) + allocatedRecourse.cpu,
      memory_usage: parseFloat(bestVM.memory_usage) + allocatedRecourse.memory,
      num_runners: parseInt(bestVM.num_runners) + 1,
    });

    res
      .status(200)
      .json({ message: "Code sent to worker successfully" });
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: error.message });
  }
}
