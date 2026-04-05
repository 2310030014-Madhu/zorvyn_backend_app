const router = require('express').Router()
const controller = require('../controllers/recordController')
const auth = require('../middleware/auth')
const authorize = require('../middleware/authorize')

router.post('/', auth, authorize('admin'), controller.createRecord)
router.get('/', auth, authorize('viewer','analyst','admin'), controller.getRecords)

module.exports = router