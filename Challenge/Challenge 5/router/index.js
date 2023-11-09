const express = require('express');
const router = express.Router();

const users = require('./users');
const accounts = require('./accounts');
const transactions = require('./transactions');
const auth = require('./auth');

router.use(users);
router.use(accounts);
router.use(transactions);
router.use(auth);

module.exports = router;