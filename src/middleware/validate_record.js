module.exports = (req,res,next)=>{
    const { amount,type,category,date } = req.body

    if(!amount || !type || !category || !date){
        return res.status(400).json({
            message:'Missing required fields'
        })
    }

    if(amount <= 0){
        return res.status(400).json({
            message:'Amount must be positive'
        })
    }

    next()
}