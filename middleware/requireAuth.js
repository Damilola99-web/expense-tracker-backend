const jwt = require('jsonwebtoken');
const dbConnection = require('../dbConfig');

const requireAuth = async (req, res, next) => {
	const { authorization } = req.headers;

	if (!authorization) {
		return res.status(401).json({ message: 'Authorization token required' });
	}

	const token = authorization;

	try {
		const { id } = jwt.verify(token, process.env.JWT_SECRET);
		const user = await new Promise((resolve) => {
			dbConnection.query(
				'SELECT * FROM users WHERE id = ?',
				[ id ],
				(error, result) => {
					if (error) {
						console.log(error);
					}
					else if (result.length < 1) {
						return res.status(400).json({message : "Invalid authentication token."})
					}
					else {
						resolve(result);
					}
				}
			);
		});

		req.user = user[0]
		next();
	} catch (error) {
		res.status(401).json({ message: 'Request is not authorized' });
	}
};

module.exports = requireAuth;
