const router = require('express').Router()
const controller = require('../controllers/record_controller')
const auth = require('../middleware/auth')
const authorize = require('../middleware/authorize')
const validateRecord = require('../middleware/validate_record')

router.post(
    '/',
    auth,
    authorize('admin'),
    validateRecord,
    controller.createRecord
)

router.get(
    '/',
    auth,
    authorize('viewer','analyst','admin'),
    controller.getRecords
)

router.put(
    '/:id',
    auth,
    authorize('admin'),
    validateRecord,
    controller.updateRecord
)

router.delete(
    '/:id',
    auth,
    authorize('admin'),
    controller.deleteRecord
)

module.exports = router