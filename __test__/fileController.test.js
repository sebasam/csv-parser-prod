const request = require('supertest')
const app = require('./../index')
const mongoose = require('mongoose')
const File = require('./../models/File')
const { generateToken } = require('./../middlewares/jwtGenerate')
const path = require('path')

describe('File Controller Tests', () => {
    let token
    beforeAll(async () => {
        await File.deleteMany()
        token = generateToken('test@test.com')
    }, 10000)

    afterAll(async() => {
        await mongoose.connection.close()
    })

    it('Debería subir un archivo CSV y guardarlo en base de datos', async() => {
        const filePath = path.resolve(__dirname, 'customers-100.csv')
        console.log(filePath)
        const response = await request(app)
                        .post('/api/upload')
                        .set('Authorization', `Bearer ${ token }`)
                        .attach('file', filePath)

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('msg', 'File:customers-100.csv created!!')
    })

    it('No debería subir un file si no se adjunta', async() => {
        const response = await request(app)
                        .post('/api/upload')
                        .set('Authorization', `Bearer ${ token }`)

        expect(response.statusCode).toBe(400)
    })

    
})