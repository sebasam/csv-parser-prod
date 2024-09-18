const request = require('supertest')
const app = require('./../index')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./../models/User')

describe('User Controller testing', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    }, 10000)

    afterAll(async () => {
        await User.deleteMany({})
        await mongoose.connection.close()
    })

    it('Debería registrar un usuario nuevo si el correo no existe en la base de datos', async () => {
        const email = 'test@test.com'
        const response = await request(app)
            .post('/api/register')
            .send({ email: email, password: '#Clave1234' })

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('msg', `${ email } created successfuly`)
    })

    // it('No debería registrar un user si el correo existe', async() => {

    // })
})