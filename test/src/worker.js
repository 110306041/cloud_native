import EventEmitter from 'events';
import { v4 as uuidv4 } from 'uuid';
import Agent from './agent.js';
import { languageConfigs } from "./config/config.js";
import Runner from "./runner.js";

class Worker {
    constructor(wServerUrl, config = {}) {
        this.config = {
            maxCPU: config.maxCPU || 4,         // 總CPU核心數
            maxMemory: config.maxMemory || 4096, // 總記憶體(MB)
            maxQueueSize: config.maxQueueSize || 100
        };

        this.taskQueue = [];
        this.activeTasks = new Map();
        this.events = new EventEmitter();
        this.workerId = uuidv4();
        this.status = 'initializing';

        // 資源追蹤
        this.resources = {
            usedCPU: 0,
            usedMemory: 0
        };

        // agent initialize
        this.agent = new Agent(wServerUrl, this.handleWebSocketMessage.bind(this))

        this.on('taskCompleted', (result) => {
            console.log('Task completed:', result);
            this.agent.sendMessage(result);
        });

        this.on('taskError', (error) => {
            console.error('Task error:', error);
        });

        this.on('status', (status) => {
            console.log('Worker status:', status);
        });
    }

    async handleWebSocketMessage(event) {
        await this.initialize();

        try {
            console.log(event.data);
            const result = await this.submitTask(JSON.parse(event.data));
            console.log('Task submitted:', result);
        } catch (error) {
            console.error('Failed to submit task:', error);
        }
    }

    async initialize() {
        this.status = 'ready';
        this.startTaskProcessing();
        this.emit('status', this.getStatus());
    }

    async submitTask(task) {
        if (!this.validateTask(task)) {
            throw new Error('Invalid task format');
        }

        const taskId = uuidv4();
        const fullTask = {
            id: taskId,
            ...task,
            status: 'pending',
            submitTime: new Date(),
            resourceNeeds: this.calculateResourceNeeds(task.language)
        };

        if (this.taskQueue.length >= this.config.maxQueueSize) {
            throw new Error('Task queue is full');
        }

        this.taskQueue.push(fullTask);
        this.emit('status', this.getStatus());

        return { taskId, status: 'queued' };
    }

    calculateResourceNeeds(language) {
        const langConfig = languageConfigs[language];
        console.log(`this is memoryLimit: ${langConfig.memoryLimit}`)
        return {
            cpu: langConfig.cpuLimit,
            // memory: this.parseMemoryToMB(langConfig.memoryLimit)
            memory: langConfig.memoryLimit,
        };
    }

    // parseMemoryToMB(memoryStr) {
    //     if (typeof memoryStr !== 'string') {
    //         return memoryStr; // If not a string, return as-is (assumed to be a number in MB)
    //     }
    //     const units = { 'k': 1 / 1024, 'm': 1, 'g': 1024 };
    //     const match = memoryStr.toLowerCase().match(/^(\d+)([kmg])/);
    //     if (!match) return parseInt(memoryStr);
    //     return parseInt(match[1]) * units[match[2]];
    // }

    hasAvailableResources(resourceNeeds) {
        return (this.resources.usedCPU + resourceNeeds.cpu <= this.config.maxCPU) &&
            (this.resources.usedMemory + resourceNeeds.memory <= this.config.maxMemory);
    }

    startTaskProcessing() {
        setInterval(() => {
            this.processNextTasks();
        }, 100);
    }

    async processNextTasks() {
        if (this.taskQueue.length === 0) return;

        // 嘗試執行佇列中所有可以執行的任務
        const executableTasks = this.taskQueue.filter(task =>
            this.hasAvailableResources(task.resourceNeeds)
        );

        for (const task of executableTasks) {
            this.taskQueue = this.taskQueue.filter(t => t.id !== task.id);
            this.executeTask(task);
        }
    }

    async executeTask(task) {
        console.log('Executing task:', task);
        console.log('Resource needs:', task.resourceNeeds);

        const langConfig = languageConfigs[task.language];
        console.log('Language Config:', langConfig);

        // 確認型別
        if (typeof langConfig.memoryLimit !== 'number') {
            console.error('MemoryLimit is invalid:', langConfig.memoryLimit);
        }

        // 分配資源
        this.resources.usedCPU += task.resourceNeeds.cpu;
        this.resources.usedMemory += task.resourceNeeds.memory;

        try {
            const runner = new Runner({
                id: `runner-${task.id}`,
                workDir: `./temp/${task.id}`
            });

            this.activeTasks.set(task.id, {
                task,
                startTime: new Date(),
                resources: task.resourceNeeds
            });

            const result = await runner.run(task.language, task.code);
            // this.handleTaskCompletion(task.id, result);
            this.handleTaskCompletion(task, result);
        } catch (error) {
            this.handleTaskError(task.id, error);
        } finally {
            // 釋放資源
            this.resources.usedCPU -= task.resourceNeeds.cpu;
            this.resources.usedMemory -= task.resourceNeeds.memory;
            this.emit('status', this.getStatus());
        }
    }

    handleTaskCompletion(task, result) {
        const taskInfo = this.activeTasks.get(task.id);
        if (!taskInfo) return;

        const executionTime = new Date() - taskInfo.startTime;

        this.emit('taskCompleted', {
            workerId: this.workerId,
            taskId: task.id,
            langConfig: languageConfigs[task.language],
            result,
            executionTime
        });

        this.activeTasks.delete(taskId);
    }

    handleTaskError(taskId, error) {
        const taskInfo = this.activeTasks.get(taskId);
        if (!taskInfo) return;

        this.emit('taskError', {
            taskId,
            error: error.message
        });

        this.activeTasks.delete(taskId);
    }

    validateTask(task) {
        return task &&
            typeof task.language === 'string' &&
            typeof task.code === 'string' &&
            languageConfigs[task.language];
    }

    getStatus() {
        return {
            workerId: this.workerId,
            status: this.status,
            activeTasks: this.activeTasks.size,
            queueLength: this.taskQueue.length,
            resources: {
                cpu: {
                    used: this.resources.usedCPU,
                    total: this.config.maxCPU
                },
                memory: {
                    used: this.resources.usedMemory,
                    total: this.config.maxMemory
                }
            },
            timestamp: new Date()
        };
    }

    on(event, callback) {
        this.events.on(event, callback);
    }

    emit(event, data) {
        this.events.emit(event, data);
    }
}

export default Worker;

const worker = new Worker('ws://localhost:4000')