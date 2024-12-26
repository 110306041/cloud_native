import Docker from 'dockerode';
import { promises as fs } from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { languageConfigs } from './config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Runner {
    constructor(config = {}) {
        this.docker = new Docker();
        this.config = {
            id: config.id || 'unknown',
            workDir: path.resolve(config.workDir || path.join(__dirname, '../../temp'))
        };
    }

    async run(language, code) {
        const langConfig = languageConfigs[language];
        if (!langConfig) throw new Error(`Unsupported language: ${language}`);

        const executionId = Date.now().toString();
        const executionDir = path.join(this.config.workDir, executionId);
        const logDir = path.join(this.config.workDir, 'logs');

        try {
            await fs.mkdir(executionDir, { recursive: true });
            await fs.mkdir(logDir, { recursive: true });

            const filename = `main${langConfig.fileExtension}`;
            await fs.writeFile(path.join(executionDir, filename), code);

            const containerConfig = {
                Image: langConfig.image,
                WorkingDir: '/code',
                Cmd: ['/bin/sh', '-c', `${langConfig.runCommand.join(' ')} ${filename} 2>&1 | tee /logs/${executionId}.log`],
                HostConfig: {
                    // Memory: this.parseMemoryLimit(langConfig.memoryLimit),
                    Memory: langConfig.memoryLimit * 1024 * 1024,
                    NanoCPUs: Math.floor(langConfig.cpuLimit * 1e9),
                    Binds: [
                        `${executionDir}:/code`,
                        `${logDir}:/logs`
                    ],
                    NetworkMode: 'none'
                }
            };

            const container = await this.docker.createContainer(containerConfig);
            return await this.runContainer(container, langConfig.timeout, executionId, logDir);
        } catch (error) {
            throw error;
        } finally {
            await fs.rm(executionDir, { recursive: true, force: true }).catch(() => { });
        }
    }

    async runContainer(container, timeout, executionId, logDir) {
        try {
            await container.start();
            const stats = await this.resourceStats(container);

            console.log('continue.................')
            const executionResult = await Promise.race([
                container.wait(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Execution timeout')), timeout)
                )
            ]);

            let output;
            try {
                const logs = await container.logs({
                    stdout: true,
                    stderr: true,
                    follow: true,
                    tail: 'all'
                });
                output = Buffer.from(logs).toString('utf8').replace(/\x01|\x02|\x00/g, '');
            } catch (error) {
                const logContent = await fs.readFile(path.join(logDir, `${executionId}.log`), 'utf8')
                    .catch(() => 'Failed to get execution output');
                output = logContent;
            }

            // const containerNum = await this.docker.listContainers({ all: true }, function (err, containers) {
            //     console.log('ALL: ' + containers.length);
            //     return containers.length;
            // });
            const containerNum = await this.getContainerNum()

            return {
                success: executionResult.StatusCode === 0,
                output,
                exitCode: executionResult.StatusCode,
                cpuUsed: stats.cpuUsed,
                memoryUsed: stats.memoryUsed,
                containerNum,
            };
        } catch (error) {
            if (error.message === 'Execution timeout') {
                return {
                    success: false,
                    output: 'Execution timed out',
                    exitCode: 124
                };
            }
            throw error;
        } finally {
            await container.remove({ force: true }).catch(() => { });
        }
    }

    async resourceStats(container) {
        return new Promise((resolve, reject) => {
            container.stats((err, stream) => {
                if (err) {
                    return reject(new Error("Error fetching stats: " + err));
                }

                let lastStats = null;
                let rawData = '';
                stream.on('data', (chunk) => {
                    // 拼接接收到的資料流
                    rawData += chunk.toString();
                    try {
                        // 解析 JSON 並提取 cpu_stats
                        const stats = JSON.parse(rawData);
                        console.log("CPU Stats:", stats.cpu_stats.cpu_usage.total_usage);
                        console.log("Memory Stats:", stats.memory_stats.max_usage)
                        rawData = ''; // 清空數據，準備接收下一次的流
                        if (stats.cpu_stats.cpu_usage.total_usage != 0) {
                            lastStats = {
                                cpuUsed: stats.cpu_stats.cpu_usage.total_usage * 0.000000001,
                                memoryUsed: stats.memory_stats.max_usage / (1024 * 1024),
                            }
                        } else {
                            resolve(lastStats);
                        }
                    } catch (parseError) {
                        reject(parseError)
                    }
                })
            })
        })
    }



    async getContainerNum() {
        return new Promise((resolve, reject) => {
            this.docker.listContainers({ all: true }, function (err, containers) {
                console.log('ALL: ' + containers.length);
                resolve(containers.length);
            })
        })
    }


    parseMemoryLimit(limit) {
        const units = { 'k': 1024, 'm': 1024 * 1024, 'g': 1024 * 1024 * 1024 };
        const match = limit.toLowerCase().match(/^(\d+)([kmg])?$/);
        if (!match) throw new Error('Invalid memory limit format');
        const [, num, unit] = match;
        return parseInt(num) * (units[unit] || 1);
    }
}

export default Runner;