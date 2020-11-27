const redis = require('redis');
const asyncRedis = require('async-redis');

// broker
// currently, the publisher is redis keys-event-notifier
const Subscriber = require('./subscribers');

const redisClient = () => {
  const redisConfig = {
      host:'localhost',
      port:6379,
      password:''
  };
  const options = {
    host: redisConfig.host,
    port: redisConfig.port,
    password: !redisConfig.password ? undefined : redisConfig.password,
    retry_strategy: function (options) {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        // End reconnecting on a specific error and flush all commands with
        // a individual error
        return new Error('The server refused the connection');
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        // End reconnecting after a specific timeout and flush all commands
        // with a individual error
        return new Error('Retry time exhausted');
      }
      if (options.attempt > 10) {
        // End reconnecting with built in error
        return undefined;
      }
      // reconnect after
      return Math.min(options.attempt * 100, 3000);
    }
  };
  return redis.createClient(options);
};

const init = () => {
  const client = redisClient();
  client.on('error', (err) => {
    console.log(err)
  });
  //set notify-keyspace-events as publisher
  client.send_command('CONFIG', ['set', 'notify-keyspace-events', 'Ex'], (err, reply) => {
    if (err) {
        console.lgg(err.message)
    }
    console.log(reply);

    const sub = redisClient();
    const subscriber = new Subscriber(sub);
    subscriber.init();
  });

  client.on('error', (err) => {
    console.log(`=====================${err}`)
  });

};

// decorate redis client to async style
const getConnection = () => {
  return asyncRedis.decorate(redisClient());
};

module.exports = {
  init,
  getConnection
};


