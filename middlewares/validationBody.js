const { body } = require('express-validator')

const users = [
    body('email', 'Ups!! Email is required').notEmpty(),
    body('email', 'Email is invalid!!').normalizeEmail().isEmail(),
    body('password', 'Hey!! pasword must contain at least, uppercase, lowercase, numbers and characters').isStrongPassword()
]

module.exports = users