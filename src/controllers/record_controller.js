const Record = require('../models/record')

exports.createRecord = async (req,res)=>{
    const record = await Record.create({
        ...req.body,
        createdBy:req.user.id
    })

    res.status(201).json(record)
}

exports.getRecords = async (req,res)=>{
    const { type, category, startDate, endDate } = req.query

    const filter = {}

    if(type){
        filter.type = type
    }

    if(category){
        filter.category = category
    }

    if(startDate || endDate){
        filter.date = {}

        if(startDate){
            filter.date.$gte = new Date(startDate)
        }

        if(endDate){
            filter.date.$lte = new Date(endDate)
        }
    }

    const records = await Record.find(filter).sort({ date:-1 })

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