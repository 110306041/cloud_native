import cors from 'cors';
import express from 'express';
import { createClient } from 'redis';
import WebSocket, { WebSocketServer } from 'ws';

// initiate redis client
const redis = createClient();
redis.on('error', err => console.log('Redis Client Error', err));
await redis.connect();


// express server setting
const app = express();
const PORT = 3000

// 啟動 HTTP 伺服器
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});

// 啟用 CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500', // 允許的前端來源
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));


// websocket server setting
const wss = new WebSocketServer({ port: 4000 })

let workerWs = null;

//當 WebSocket 從外部連結時執行
wss.on('connection', ws => {

    //連結時執行此 console 提示
    console.log('Client connected')
    workerWs = ws;

    //對 message 設定監聽，接收從 Client 發送的訊息
    ws.on('message', async data => {
        //data 為 Client 發送的訊息，現在將訊息原封不動發送出去
        console.log('Received data from Worker:', JSON.parse(data))

        await updateMetrics(redis, JSON.parse(data))

        const res = await redis.hGetAll(`worker:${JSON.parse(data).workerId}`)
        console.log(`from redis: ${JSON.stringify(res)}`)
    })

    //當 WebSocket 的連線關閉時執行
    ws.on('close', () => {
        console.log('Close connected')
        workerWs = null;
    })
})

// frontend connected
// 使用 Express 處理來自前端的請求
app.use(express.json());

// 當前端發送請求到 /send-task 路徑時，將數據發送給 worker
app.post('/send-task', (req, res) => {
    const data = req.body;
    console.log('Received data from client:', data);

    // 如果 worker 已連接，則將資料發送給 worker
    if (workerWs && workerWs.readyState === WebSocket.OPEN) {
        workerWs.send(JSON.stringify(data));
        res.json({ message: 'Task sent to worker' });
    } else {
        res.status(500).json({ message: 'No worker connected' });
    }
});

async function updateMetrics(redis, metrics) {
    const worker = await redis.hGetAll(`worker:${metrics.workerId}`)

    if (Object.keys(worker).length > 0) {
        console.log('Worker exists, updating...');

        await redis.hSet(`worker:${metrics.workerId}`, {
            cpu: parseFloat(worker.cpu) + metrics.langConfig.cpuLimit,
            memory: parseInt(worker.memory) + metrics.langConfig.memoryLimit,
            container: metrics.result.containerNum,
        })
    } else {
        console.log('Worker not found, initializing...');

        await redis.hSet(`worker:${metrics.workerId}`, {
            cpu: 0.9 - metrics.langConfig.cpuLimit,
            memory: 900 - metrics.langConfig.memoryLimit,
            container: metrics.result.containerNum,
        })
    }
}