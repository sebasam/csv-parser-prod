const express = require('express')
const router = express.Router()
const { uploadFile, getFileById, getAllFiles, deleteFileById } = require('./../controllers/file.contoller')
const { upload } = require('./../middlewares/upload')
const { validateToken } = require('./../middlewares/validateToken')

router.post('/upload', validateToken, upload.single('file'), uploadFile)

router.get('/file/:id', validateToken,  getFileById)

router.get('/files', validateToken,  getAllFiles)

router.delete('/delete-file/:id', validateToken, deleteFileById)

module.exports = router