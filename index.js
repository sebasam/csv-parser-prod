const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const path = require('path')
const api = require('./routes/api.routes')

dotenv.config();
const port = process.env.PORT
const databaseConnect = require('./db/config')
databaseConnect()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use('/', express.static(__dirname + '/dist/frontend-csv-parser/browser'))
app.get('/*', (req, res, next) => {
    res.sendFile(path.resolve(__dirname + '/dist/frontend-csv-parser/browser/index.html'))
})
app.use('/', api)

app.listen(port, () => {
    console.log(`Servidor conectado en el puerto ${port}`)
})