import Redis from 'redis';

const redisClient = Redis.createClient();

redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient.connect();

export const set = (key: string, value: any, expiration?: number) =>
  new Promise((resolve, reject) => {
    redisClient.set(key, JSON.stringify(value), 'EX', expiration || 3600, (err: any, reply: unknown) => {
      if (err) reject(err);
      resolve(reply);
    });
  });

export const get = (key: string) =>
  new Promise((resolve, reject) => {
    redisClient.get(key, (err: any, reply: string) => {
      if (err) reject(err);
      resolve(reply ? JSON.parse(reply) : null);
    });
  });

export default redisClient;