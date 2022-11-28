const dbConnection = require('../dbConfig');
exports.getAllExpenses = (req, res) => {
	const { id } = req.user;
	dbConnection.query(
		'select expenses.name, expenses.id as id, expenses.date_created, expenses.last_modified, expenses.amount, categories.name as category, categories.color from expenses join categories on expenses.category_id = categories.id where expenses.user_id = ?',
		[ id ],
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
};

exports.getCategoryExpenses = (req, res) => {
	const { id } = req.user;
	const { category } = req.query;

	dbConnection.query(
		'select expenses.name, expenses.id as id, expenses.date_created, expenses.last_modified, expenses.amount, categories.name as category, categories.color from expenses join categories on expenses.category_id = categories.id where expenses.user_id = ? and categories.name = ?',
		[ id, category ],
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
};

exports.addExpense = (req, res) => {
	const { id, name, amount, category_id } = req.body;

	const date = Date.now().toString();

	if (!id || !name || !amount || !category_id) {
		return res.status(400).json({ message: 'Please fill in all fields' });
	}

	const user_id = req.user.id;

	dbConnection.query(
		'INSERT INTO expenses (id, name, amount, category_id, user_id, date_created, last_modified) VALUES (?, ?, ?, ?, ?, ?, ?)',
		[ id, name, amount, category_id, user_id, date, date ],
		(error, result) => {
			if (error) {
				return res.status(500).json({
					message : 'An error occured , please try again later'
				});
			} else {
				return res
					.status(200)
					.json({ message: 'Expense Added Successfully' });
			}
		}
	);
};

exports.deleteExpense = (req, res) => {
	const { id } = req.params;
	dbConnection.query(
		'DELETE FROM expenses WHERE id = ?',
		[ id ],
		(error, result) => {
			if (error) {
				return res.status(500).json({
					message : 'An error occured , please try again later'
				});
			} else {
				return res
					.status(200)
					.json({ message: 'Item deleted successfully' });
			}
		}
	);
};
