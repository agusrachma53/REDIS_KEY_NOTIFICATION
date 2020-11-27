const express = require('express')
const connection = require('./src/connection');
const RedisCache = require('./src/cache');
const redisCache = new RedisCache(); 
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

connection.init();

// SET KEY VALUE & EXPIRE TIME
redisCache.setExpired('agus','rachman',10);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))