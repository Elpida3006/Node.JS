const Expense = require('../models/Expense')
const { validateCity } = require('../validators/productValidator')

function createE(data, _id) {
    //validation
    console.log(data);
    const { merchant, total, category, description, report } = {...data }

    let isChecked = report

    console.log(`isChecked is ${isChecked}`);

    return Expense.create({
        merchant,
        total,
        category,
        description,
        report: Boolean(report),
        ownerCreatorId: _id
    })
}

function getAll() {

    return Expense.find().lean();
}

function getId(id) {
    return Expense.findById(id).lean();
}

function deleteE(id) {
    return Expense.deleteOne({ _id: id })
}


module.exports = {
    createE,
    getAll,
    getId,
    deleteE,


}