const express = require('express')
const router = express.Router()
const {createUser, loginUser} = require('./../controllers/user.controller')
const users = require('./../middlewares/validationBody')
const validateFields = require('./../middlewares/validationResult')

router.post('/register', users, validateFields, createUser)
router.post('/login', loginUser)


module.exports = router