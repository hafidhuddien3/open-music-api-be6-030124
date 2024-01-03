const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  s3: {
    bucketName: process.env.AWS_BUCKET_NAME,
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },
  redis: {
    host: process.env.REDIS_SERVER,
  },
};

module.exports = config;
/*
  contoh

  const redis = require('redis');
const config = require('../../utils/config.js')

class CacheService {
  constructor() {
    this._client = redis.createClient({
      host: config.redis.host,
    });

    // … kode lain disembunyikan
  }

  // … kode lain disembunyikan
}

module.exports = CacheService; */
