const request = require('supertest')
const app = require('./../index')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./../models/User')

describe('User Controller testing', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        console.log('beforeEach Ejecutado')
    }, 10000)

    afterAll(async () => {
        await User.deleteMany({})
        await mongoose.connection.close()
        console.log('afterAll Ejecutado y conexion cerrada')
    })

    it('Debería registrar un usuario nuevo si el correo no existe en la base de datos', async () => {
        const email = 'test@test.com'
        console.log('Supertest va a hacer la peticion POST')
        const response = await request(app)
            .post('/api/register')
            .send({ email: email, password: '#Clave1234' })
            console.log('Supertest va finalizo la peticion post la respuesta es: ', response)
        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('msg', `${ email } created successfuly`)
    })

    it('No debería registrar un user si el correo existe', async() => {
        await new User({
            email: 'test@test.com',
            password: '#Clave1234'
        }).save()

        const response = await request(app)
                        .post('/api/register')
                        .send({ email: 'test@test.com', password: '#Clave1234' })

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('ok', false)
        expect(response.body).toHaveProperty('msg', 'test@test.com is already exist in database')
    })

    it('Debería logear a un usuario con credenciales correctas', async() => {
        const password = '#Clave1234'
        const hashedPassword = bcrypt.hashSync(password, 10)
        const user = await new User({
            email: 'test@test.com',
            password: hashedPassword
        })
        user.save()
        const response = await request(app)
                            .post('/api/login')
                            .send({ email: user.email, password: password })
        console.log(response)
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('msg', `${ user.email } Bienvenido a CSV Parser!!`)
        expect(response.body).toHaveProperty('token')
    })

    it('No debería loguear al usuario con un password incorrecto', async() => {
        const password = '#Clave1234'
        const hashedPassword = bcrypt.hashSync(password, 10)
        const user = await new User({
            email: 'test@test.com',
            password: hashedPassword
        })
        user.save()
        const response = await request(app)
                    .post('/api/login')
                    .send({ email: user.email, password: 'incorrecta' })

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('msg', 'Incorrect password!!')
        expect(response.body).toHaveProperty('ok', false)
    })

    it('Debería retornar un error de servidor al hacer el login', async() => {
        jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
            throw new Error('Simulando error en base de datos')
        })

        const response = await request(app)
                        .post('/api/login')
                        .send({ email: 'juan@test.com', password: 'Clave' })

        expect(response.statusCode).toBe(500)
    })
})