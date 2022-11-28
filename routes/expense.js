const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const expense_router = express.Router();
const expenseController = require('../controllers/expenses/expense.js');

expense_router.use(requireAuth);

expense_router.get('/', expenseController.getAllExpenses);

expense_router.get('/category', expenseController.getCategoryExpenses);

expense_router.post('/add', expenseController.addExpense);

expense_router.delete('/:id', expenseController.deleteExpense);

module.exports = expense_router;
