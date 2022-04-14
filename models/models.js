const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true,},
    password: {type: DataTypes.STRING},
    login: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    active: {type: DataTypes.BOOLEAN, defaultValue: true},
})


const Messeges = sequelize.define('messeges', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    idUserTo: {type: DataTypes.INTEGER},
    messege: {type: DataTypes.STRING},
    redackt: {type: DataTypes.BOOLEAN, defaultValue: false}
})

User.hasOne(Messeges)
Messeges.belongsTo(User)

module.exports = {
    User,
    Messeges
}





