const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.get('/userList', userController.getAll)
router.post('/delite', userController.deliteOne)
router.post('/updateActive', userController.activeOne)

module.exports = router
