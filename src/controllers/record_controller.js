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

    if(req.query.startDate && req.query.endDate){
        filter.date = {
            $gte:new Date(req.query.startDate),
            $lte:new Date(req.query.endDate)
        }
    }

    const records = await Record.find(filter)

    res.json(records)
}

exports.updateRecord = async (req,res)=>{
    const record = await Record.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new:true }
    )

    res.json(record)
}

exports.deleteRecord = async (req,res)=>{
    await Record.findByIdAndDelete(req.params.id)

    res.json({ message:'Deleted successfully' })
}