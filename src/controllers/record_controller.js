const Record = require('../models/record')

exports.createRecord = async (req,res)=>{
    const record = await Record.create({
        ...req.body,
        createdBy:req.user.id
    })

    res.status(201).json(record)
}

exports.getRecords = async (req,res)=>{
    const filter = {}

    if(req.query.type) filter.type = req.query.type
    if(req.query.category) filter.category = req.query.category

    const records = await Record.find(filter)

    res.json(records)
}