const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models');

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        const {email, password, login, role } = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('incorrect email or password'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('User with this email already exists'))
        }
        const candidate2 = await User.findOne({where: {login}})
        if (candidate2) {
            return next(ApiError.badRequest('User with this Login already exists'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, role,login, password : hashPassword})
        //const basket = await Basket.create({userId: user.id})
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('User not found'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Passvord not correct'))
        }
        if (!user.active) {
            return next(ApiError.internal('User blok'))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async check(req, res, next) {
        if (!req.user) {
            return next(ApiError.internal('User not found'))
        }
        if (!req.user.active) {
            return next(ApiError.internal('User blok'))
        }
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }

    async getAll(req, res) {
        const users = await User.findAll({
            attributes: ['id', 'email', 'login', 'role','active']
          })
        return res.json(users)
    }
    
    async deliteOne(req, res) {
        const {id} = req.body
        console.log(id);
        User.destroy({where: {id}})
        const users = await User.findAll({
            attributes: ['id', 'email', 'login', 'role','active']
          })
        return res.json(users)    
    }

    async activeOne(req, res) {
        const {id} = req.body
        const user = await User.findOne({where: {id}})
        let activeLocal=(user.active) ? false : true;
        User.update(
            {active: activeLocal},
            {where: {id}}
            )
        const users = await User.findAll({
                attributes: ['id', 'email', 'login', 'role','active']
              })
        return res.json(users)   
    }
}

module.exports = new UserController()
