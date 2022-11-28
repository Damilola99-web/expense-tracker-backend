const express = require('express');
const dbConnection = require('./dbConfig');
const userRouter = require('./routes/user');
const cors = require('cors');
const expense_router = require('./routes/expense');
const categoryRouter = require('./routes/category');

const PORT = process.env.port || 5000;

const server = express();

server.use(express.json());

server.use(cors());

server.use('/api/v1/user', userRouter);
server.use('/api/v1/expenses', expense_router);
server.use('/api/v1/categories', categoryRouter);

server.use((req, res) => {
	res.status(404).json({ message: '404 not found' });
});

dbConnection.connect((err) => {
	if (err) {
		console.log(err);
	} else {
		console.log('connected');
		server.listen(PORT);
	}
});
