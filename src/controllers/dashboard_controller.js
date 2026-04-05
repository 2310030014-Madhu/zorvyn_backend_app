const Record = require('../models/record')

exports.summary = async (req,res)=>{
    const totalIncome = await Record.aggregate([
        { $match:{ type:'income' }},
        { $group:{ _id:null, total:{ $sum:'$amount' }}}
    ])

    const totalExpense = await Record.aggregate([
        { $match:{ type:'expense' }},
        { $group:{ _id:null, total:{ $sum:'$amount' }}}
    ])

    res.json({
        totalIncome: totalIncome[0]?.total || 0,
        totalExpense: totalExpense[0]?.total || 0,
        netBalance:
            (totalIncome[0]?.total || 0) -
            (totalExpense[0]?.total || 0)
    })
}

exports.categorySummary = async (req,res)=>{
    const data = await Record.aggregate([
        {
            $group:{
                _id:'$category',
                total:{ $sum:'$amount' }
            }
        },
        {
            $sort:{ total:-1 }
        }
    ])

    res.json(data)
}

exports.monthlyTrends = async (req,res)=>{
    const data = await Record.aggregate([
        {
            $group:{
                _id:{
                    year:{ $year:'$date' },
                    month:{ $month:'$date' },
                    type:'$type'
                },
                total:{ $sum:'$amount' }
            }
        },
        {
            $sort:{
                '_id.year':1,
                '_id.month':1
            }
        }
    ])

    res.json(data)
}

exports.weeklyTrends = async (req,res)=>{
    const data = await Record.aggregate([
        {
            $group:{
                _id:{
                    week:{ $week:'$date' },
                    year:{ $year:'$date' },
                    type:'$type'
                },
                total:{ $sum:'$amount' }
            }
        },
        {
            $sort:{
                '_id.year':1,
                '_id.week':1
            }
        }
    ])

    res.json(data)
}


exports.recentActivity = async (req,res)=>{
    const data = await Record.find()
        .sort({ createdAt:-1 })
        .limit(5)

    res.json(data)
}