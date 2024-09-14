const express = require('express');
const router = express.Router()
const user = require('./user.routes')
const file = require('./file.routes')

router.use('/api', user)
router.use('/api', file)

module.exports = router