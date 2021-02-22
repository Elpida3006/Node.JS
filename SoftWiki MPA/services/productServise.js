const Article = require('../models/Article')
    // const {  } = require('../validators/productValidator')
const User = require('../models/User')

function createArticle(data, _id) {
    //validation
    // const { title, description } = {...data }

    return Article.create({...data, ownerCreatorId: _id, creationData: Date.now() })
}

function getAllArticles() {
    // const userId = req.user._id
    // console.log(userId);
    return new Promise((resolve, reject) => {
            let articles = Article.find().lean()
                // .sort({ creationDate: -1 })
                .limit(3)

            resolve(articles)
        })
        .catch(err => { console.log(`unlisted`) })

}

function search(req, res) {
    const { search } = req.query;
    const userId = req.user._id

    let query = {};

    if (search) {
        query = {...query, title: { $regex: search } };
    }

    Promise.all([
        userModel.findById(userId),
        articleModel.find(query)
    ]).then(([user, articles]) => {
        res.render('search', { user, articles, search });
    });
}
// function getAllArticles() {
//     return new Promise((resolve, reject) => {
//             let articles = Article.find().lean()
//             resolve(articles)
//         })
//         .then(articles => {

//             let sortedarticles= articles.sort((a, b) => {
//                 return b.creationDate - a.creationDate
//             })
//             console.log(sortedarticles);
//             return sortedarticles
//         })
//         .catch(err => { console.log(`unsorted`) })
// }

function getId(id) {
    return Article.findById(id).lean();
}

function deleteArticle(id) {

    return Article.deleteOne({ _id: id })
}

function postEditArticle(id, data) {
    console.log(data);
    return Article.updateOne({ _id: id }, {...data });

}



module.exports = {
    createArticle,
    getAllArticles,
    getId,
    deleteArticle,
    postEditArticle,
    search

}