import Redis from "ioredis";

const redisClient = new Redis({
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || "127.0.0.1",

  // comment when run local
  password: process.env.REDIS_PASSWORD,
  tls: {
    rejectUnauthorized: false,
  },

  enableReadyCheck: true,

  reconnectOnError: (err) => {
    const targetErrors = ["READONLY", "CONN_HOST_ERROR", "EPIPE", "ETIMEDOUT"];
    if (targetErrors.some((targetError) => err.message.includes(targetError))) {
      return true;
    }
    return false;
  },

  retryStrategy: (times) => {
    const delay = Math.min(times * 100, 2000);
    return delay;
  },
});

redisClient.on("connect", () => {
  console.log("Redis client connected successfully.");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});

export default redisClient;
