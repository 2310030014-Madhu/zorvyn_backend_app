const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth_routes')
const userRoutes = require('./routes/user_routes')
const recordRoutes = require('./routes/record_routes')
const dashboardRoutes = require('./routes/dashboard_routes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/records', recordRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use((err,req,res,next)=>{
    res.status(err.status || 500).json({
        message: err.message || 'Server Error'
    })
})

module.exports = app