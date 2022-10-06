const express = require('express');

// Controllers
const {
  createUser,
  login,
  getAllProductsMe,
  updateUser,
  deleteUser,
  getAllShoppingMe,
  getOrderById,
  getAllUsers,
} = require('../controllers/users.controller');

// Middlewares
const {
  createUserValidators,
} = require('../middlewares/validators.middlewares');

const { userExists } = require('../middlewares/users.middlewares');
const { orderExists } = require('../middlewares/orders.middleware');

const {
  protectSession,
  protectUsersAccount,
} = require('../middlewares/auth.middlewares');

const usersRouter = express.Router();

usersRouter.post('/', createUserValidators, createUser);

usersRouter.post('/login', login);

usersRouter.use(protectSession);

usersRouter.get('/', getAllUsers);

usersRouter.get('/me', getAllProductsMe);

usersRouter.get('/orders', getAllShoppingMe);

usersRouter.get('/orders/:id', orderExists, getOrderById);

usersRouter
.use('/:id', userExists)
.route('/:id')
.patch(protectUsersAccount, updateUser)
.delete(protectUsersAccount, deleteUser);

module.exports = { usersRouter };