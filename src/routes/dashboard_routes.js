const router = require('express').Router()
const auth = require('../middleware/auth')
const authorize = require('../middleware/authorize')
const dashboard = require('../controllers/dashboard_controller')

router.get('/summary', auth, authorize('analyst','admin'), dashboard.summary)

module.exports = router