const validateUrl = url => {
    const regEx = /^https|http/;
    if (!regEx.test(url)) {
        throw { message: 'Image URL must start with either http or https!' }
    }

    return url;
};


module.exports = {

    validateUrl,

}