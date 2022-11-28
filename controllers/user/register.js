const validator = require('validator');
const bcrypt = require('bcrypt');
const dbConnection = require('../../dbConfig');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
	const { id, username, email, password } = req.body;

	if (!id || !username || !email || !password) {
		return res.status(400).json({ message: 'Please Fill in all fields' });
	}

	if (!validator.isEmail(email)) {
		return res.status(400).json({ message: 'Enter a valid email' });
	}
	if (!validator.isStrongPassword(password)) {
		return res
			.status(400)
			.json({ message: 'Enter a very strong password' });
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	dbConnection.query(
		`SELECT * FROM users WHERE email = ?`,
		[ email ],
		(error, result) => {
			if (error) {
				return res.status(400).json({
					message :
						'Could not complete request, please try again later'
				});
			}
			if (result.length > 0) {
				return res
					.status(400)
					.json({ message: 'Email already exists' });
			} else {
				dbConnection.query(
					`INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)`,
					[ id, username, email, hashedPassword ],
					(error, result) => {
						if (error) {
							return res.status(400).json({
								message :
									'Could not complete request, please try again later'
							});
						} else {
							const response = new Promise((resolve) => {
								dbConnection.query(
									`INSERT INTO categories (id, user_id, name, color) values (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)`,
									[
										uuid.v4(),
										id,
										'Investment',
										'#ff5ff5',
										uuid.v4(),
										id,
										'Savings',
										'#f5877f',
										uuid.v4(),
										id,
										'Expense',
										'#5ff869'
									],
									(error, result) => {
										resolve(result);
									}
								);
							});

							dbConnection.query(
								'SELECT * FROM users WHERE id = ?',
								[ id ],
								async (error, result) => {
									if (error) {
										return res.status(400).json({
											message :
												'Could not complete request, please try again later'
										});
									} else {
										const user = result[0];
										const token = await jwt.sign(
											{
												email : user.email,
												id    : user.id
											},
											process.env.JWT_SECRET,
											{ expiresIn: '60d' }
										);
										return res.status(200).json({
											email    : user.email,
											username : user.username,
											id       : user.id,
											token
										});
									}
								}
							);
						}
					}
				);
			}
		}
	);
};

module.exports = register;
