import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import { createClient } from 'redis';

const redisPassword = process.env.REDIS_PASSWORD;
const app = express();
const port = 3000;

// Using the provided Redis Cloud connection code:
const client = createClient({
    password: redisPassword,
    socket: {
        host: 'redis-13130.c17.us-east-1-4.ec2.cloud.redislabs.com',
        port: 13130
    }
});
client.on('error', (err: Error) => {
    console.error('Redis error:', err);
});

app.use(express.json());

app.post('/set', async (req: Request, res: Response) => {
    const { key, value } = req.body;
    try {
        await client.hSet(key, value);
        res.send('OK');
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        } else {
            res.status(500).send('An unknown error occurred.');
        }
        
    }
});

app.get('/get/:key', async (req: Request, res: Response) => {
    const { key } = req.params;
    try {
        const value = await client.hGetAll(key);
        if (value) {
            console.log(value);
            res.send(value);
        } else {
            res.status(404).send('Key not found');
        }
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
            res.status(500).send(err.message);
        } else {
            res.status(500).send('An unknown error occurred.');
        }
        
    }
});


async function startServer() {
    try {
        // Wait for the Redis client to connect
        await client.connect();

        // Start the Express server
        app.listen(port, () => {
            console.log(`API server started on http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Failed to connect to Redis:", err);
        process.exit(1);  // Exit the process with an error code
    }
}

// Call the function to start the server
startServer();

