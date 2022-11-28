const express = require('express');
const dbConnection = require('../dbConfig');
const requireAuth = require('../middleware/requireAuth');
const uuid = require('uuid');

const categoryRouter = express.Router();

categoryRouter.use(requireAuth);

categoryRouter.get('/', async (req, res) => {
	const user = req.user;

	dbConnection.query(
		'SELECT * FROM categories WHERE user_id = ?',
		[ user.id ],
		(error, result) => {
			if (error) {
				return res.status(500).json({
					message : 'An error occured , please try again later'
				});
			} else {
				return res.status(200).json(result);
			}
		}
	);
});

categoryRouter.post('/', (req, res) => {
	const user_id = req.user.id;
	const { name, color } = req.body;

	if (!name || !color) {
		return res.status(400).json({ message: 'Please fill in all fields' });
	}

	dbConnection.query(
		`INSERT INTO categories (id, user_id, name, color) values (?, ?, ?, ?)`,
		[ uuid.v4(), user_id, name, color ],
		(error, result) => {
			if (error) {
				return res.status(500).json({
					message : 'An error occured , please try again later'
				});
			} else {
				return res
					.status(200)
					.json({ message: 'Category Added successfully' });
			}
		}
	);
});

categoryRouter.put('/:id', (req, res) => {
	const id = req.params.id;
	const { name, color } = req.body;

	if (!name || !color) {
		return res.status(400).json({ messsage: 'Please fill in all fields' });
	}

	dbConnection.query(
		'UPDATE categories SET name = ?, color = ? WHERE id = ? AND user_id = ?',
		[ name, color, id , req.user.id],
		(error, result) => {
			if (error) {
				return res.status(500).json({
					message : 'An error occured , please try again later'
				});
			} else {
				return res
					.status(200)
					.json({ message: 'Category updated successfully' });
			}
		}
	);
});

categoryRouter.delete('/:id', (req, res) => {
	const id = req.params.id;

	dbConnection.query(
		'DELETE FROM categories WHERE id = ? AND user_id = ?',
		[ id, req.user.id ],
		(error, result) => {
			if (error) {
				return res.status(500).json({
					message : 'An error occured , please try again later'
				});
			} else {
				return res
					.status(200)
					.json({ message: 'Category deleted successfully' });
			}
		}
	);
});

module.exports = categoryRouter;
