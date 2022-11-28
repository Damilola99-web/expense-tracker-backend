const mysql = require('mysql2');
require('dotenv').config();

console.log(process.env.USERNAMEE);

const isProduction = process.env.NODE_ENV;

const dbConfig = {
	host     : process.env.HOST,
	user     : process.env.USERNAMEE,
	password : process.env.PASSWORD,
	database : process.env.DATABASE
};

const dbConnection = mysql.createConnection(dbConfig);

module.exports = dbConnection;
