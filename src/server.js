const app = require('./src/app')
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('DB Connected')
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`)
    })
})
.catch(err => console.log(err))