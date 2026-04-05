const router = require('express').Router()
const auth = require('../middleware/auth')
const authorize = require('../middleware/authorize')
const dashboard = require('../controllers/dashboardController')

router.get('/summary', auth, authorize('analyst','admin'), dashboard.summary)
router.get('/category-summary', auth, authorize('analyst','admin'), dashboard.categorySummary)
router.get('/monthly-trends', auth, authorize('analyst','admin'), dashboard.monthlyTrends)
router.get('/weekly-trends', auth, authorize('analyst','admin'), dashboard.weeklyTrends)
router.get('/recent', auth, authorize('analyst','admin'), dashboard.recentActivity)

module.exports = router