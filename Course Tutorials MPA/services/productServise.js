const Course = require('../models/Course')


function create(data, _id) {
    //validation

    const { title, description, imageUrl, isPublic } = {...data }
    let isChecked = isPublic

    console.log(`isChecked is ${isChecked}`);
 
    data = new Date()
        .toString().split('GMT')[0]
    console.log(data);
    return Course.create({ title, description, imageUrl, isPublic: Boolean(isPublic), createdAt: data, creatorId: _id })
}

function getAll(req) {
    let search = req.query.search
    if (search) {
        console.log(search);
        return Course.find({ title: { $regex: search, $options: 'i' } }).lean().sort({ createdAt: "desc" })

    }
    //sort one string in object
    return req.user ? Course.find().lean().sort({ createdAt: "desc" }) : Course.find().lean().sort({ userBookedEnrolled: "desc" }).limit(3)
    return new Promise((resolve, reject) => {
            //array sort: userBookedEnrolled example
            let courses = Course.find().lean()
            resolve(courses)
        })
        .then(courses => {

            let sortedcourses = courses
                .sort((a, b) => {
                    return b.userBookedEnrolled - a.userBookedEnrolled
                })
            console.log(sortedcourses);
            return sortedcourses
        })
        .catch(err => { console.log(`unsorted`) })

}

function getId(id) {
    return Course.findById(id).lean();
}

function deleted(id) {
    return Course.deleteOne({ _id: id })
}

function postEdit(id, data) {
    let isChecked = data.isPublic;
    const { title, description, imageUrl, isPublic } = {...data }
    console.log(isPublic);
    console.log(isChecked);
    return Course.updateOne({ _id: id }, { title, description, imageUrl, isPublic: Boolean(isPublic) });

}



module.exports = {
    create,
    getAll,
    getId,
    deleted,
    postEdit,

}