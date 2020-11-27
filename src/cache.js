const redisConnection = require('./connection');

class RedisCache {
  constructor() {
    this.client = redisConnection.getConnection();
  }

  setExpired (key = '', value = '', exprIn = 3600) {
    this.client.set(key, value, 'EX', exprIn)
      .then((reply) => {
        console.log('cache-setExpired-' + key + '-' + exprIn.toString(), reply, 'info');
      })
      .catch((err) => {
        console.log('cache-setExpired-' + key, err.name, 'error');
      });
  }

  setValue (key = '', value = '') {
    this.client.set(key, value)
      .then((reply) => {
        console.log('cache-setValue-' + key, reply, 'info');
      })
      .catch((err) => {
        console.log('cache-setValue-' + key, err.name, 'error');
      });
  }

  async getValue (key = '') {
    return await this.client.get(key)
      .then((reply) => {
        console.log('cache-getValue-'+ key, !reply?'NO CACHE':reply, 'info');
        return reply;
      })
      .catch((err) => {
        console.log('cache-getValue-' + key, err.name, 'error');
        return null;
      });
  }

  deleteValue (key = '') {
    this.client.del(key)
      .then((reply) => {
        console.log('cache-deleteValue-'+ key, !reply?'NO CACHE':reply, 'info');
      })
      .catch((err) => {
        console.log('cache-deleteValue-' + key, err.name, 'error');
      });
  }

  async checkTimeToLive (key = '') {
    return await this.client.ttl(key)
      .then((reply) => {
        console.log('cache-checkTimeToLive-' + key, reply < 1 ? 'NO CACHE':reply, 'info');
        return reply;
      })
      .catch((err) => {
        console.log('cache-checkTimeToLive-' + key, err.name, 'error');
        return null;
      });
  }

  async getKeys (params) {
    return await this.client.keys(params)
      .then((reply) => {
        console.log('cache-getKeys-' + params, reply < 1 ? 'NO CACHE':reply, 'info');
        return reply.length < 1 ? null: reply;
      })
      .catch((err) => {
        console.log('cache-getKeys-' + params, err.name, 'error');
        return null;
      });
  }

  async flushAll () {
    return await this.client.flushall()
      .then((reply) => {
        console.log('cache-flushAll', 'executed properly', 'info');
        return reply;
      })
      .catch((err) => {
        console.log('cache-flushAll', err.name, 'error');
        return null;
      });
  }

}

module.exports = RedisCache;
