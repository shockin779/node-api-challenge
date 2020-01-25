const express = require('express');
const server = express();
const projectsRouter = require('./projects/projectsRoute');
const actionsRouter = require('./actions/actionsRoute');

server.use(express.json());
server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionsRouter);

server.get('/', (req, res) => {
    res.status(200).json({message: 'API is up and running!'});
})

module.exports = server;