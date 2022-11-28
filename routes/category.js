const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const categoryController = require('../controllers/categories/category');

const categoryRouter = express.Router();

categoryRouter.use(requireAuth);

categoryRouter.get('/', categoryController.getAllCategories);

categoryRouter.post('/', categoryController.addCategory);

categoryRouter.put('/:id', categoryController.editCategory);

categoryRouter.delete('/:id', categoryController.deleteCategory);

module.exports = categoryRouter;
