const mongoose = require('mongoose');


module.exports = (dbConnectionString) => {
    //връща промис, затова използваме ртърн
    return mongoose.connect(dbConnectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });

}