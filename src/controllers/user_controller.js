const User = require('../models/user')

exports.getUsers = async (req,res)=>{
    const users = await User.find().select('-password')
    res.json(users)
}

exports.updateStatus = async (req,res)=>{
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { status:req.body.status },
        { new:true }
    )

    res.json(user)
}