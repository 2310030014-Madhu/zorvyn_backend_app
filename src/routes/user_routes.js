const router = require('express').Router()
const auth = require('../middleware/auth')
const authorize = require('../middleware/authorize')
const user = require('../controllers/user_controller')

router.get('/', auth, authorize('admin'), user.getUsers)
router.patch('/:id/status', auth, authorize('admin'), user.updateStatus)

module.exports = router