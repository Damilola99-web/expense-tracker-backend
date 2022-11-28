const validator = require('validator');
const bcrypt = require('bcrypt');
const dbConnection = require('../../dbConfig');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: 'Please Fill in all fields' });
	}

	if (!validator.isEmail(email)) {
		return res.status(400).json({ message: 'Enter a valid email' });
	}

	dbConnection.query(
		`SELECT * FROM users WHERE email = ?`,
		[ email ],
		async (error, result) => {
			if (error) {
				return res.status(400).json({
					message :
						'Could not complete request, please try again later'
				});
			}
			if (result.length < 1) {
				return res
					.status(400)
					.json({ message: 'Email does not exists' });
			} else {
				const user = result[0];

				const passwordCorrect = await bcrypt.compare(
					password,
					user.password
				);

				if (passwordCorrect) {
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
				} else {
					return res
						.status(400)
						.json({ message: 'Incorrect Password' });
				}
			}
		}
	);
};

module.exports = login;
