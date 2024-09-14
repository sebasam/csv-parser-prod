const User = require('./../models/User')
const bcrypt = require('bcrypt')
const { generateToken } = require('./../middlewares/jwtGenerate')

const createUser = async(req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email: email })
        if(user) return res.status(400).json({
            ok: false,
            msg: `${email} is already exist in database`
        })
        const salt = bcrypt.genSaltSync()
        const dbUser = new User({
            email: email,
            password: password
        })
        dbUser.password = bcrypt.hashSync(password, salt)
        await dbUser.save()

        return res.status(201).json({
            ok: true,
            msg: `${email} created successfuly`
        })
    } catch(error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Please contact to support'
        })
    } 
}

const loginUser  = async(req, res) => {
    const { email, password } = req.body
    try {
        const dbUser =  await User.findOne({ email })
        if(!dbUser) return res.status(400).json({
            ok: false,
            msg: 'User doesnt exist!!'
        })
        const validatePassword = bcrypt.compareSync(password, dbUser.password)
        if(!validatePassword) return res.status(400).json({
            ok: false,
            msg: 'Incorrect password!!'
        })
        const token = await generateToken(dbUser._id, dbUser.email)

        return res.status(200).json({
            ok: true,
            msg: `${dbUser.email} Bienvenido a CSV Parser!!`,
            token: token
        })

    } catch(error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Please contact to development team'
        })
    }
}

module.exports = {
    createUser,
    loginUser
}