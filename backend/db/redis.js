const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
    password: 'VCgOpafE4byrudJdw0W1YkzKMitcEDK8',
    socket: {
        host: 'redis-17396.c241.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 17396
    }
});
  
  const connectRedis = async () => {
      try {
          await redisClient.connect();
          console.log('Connected to Redis Cloud');
      } catch (err) {
          console.error('Redis connection error:', err);
          process.exit(1); // Exit process if the connection fails
      }
  };
  
  module.exports = { redisClient, connectRedis };
  