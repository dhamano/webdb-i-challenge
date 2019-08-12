const express = require('express');
const accountsRouter = require('./routes/accounts');

const server = express();

server.use(express.json());
server.use('/api/accounts', accountsRouter);

server.get('/', (req, res) => res.send(`<h2>API Running</h2>`));

module.exports = server;