const validateName = name => {
    const minLength = 4;

    if(name.length < minLength) {
        throw { message: `Hotel name must be at least ${minLength} chars long!`}
    }

    return name;
};

const validateCity = city => {
    const minLength = 3;

    if(city.length < minLength) {
        throw { message: `City name must be at least ${minLength} chars long!`}
    }

    return city;
};

const validateRooms = rooms => {
    const min = 1;
    const max = 100;

    const regEx = /^\d+$/;

    if(!regEx.test(rooms)) {
        throw { message: 'Free rooms field must be a number!' };
    }

    const roomsNum = Number(rooms);

    if(roomsNum < min || roomsNum > max) {
        throw { message: `Free rooms field must be a number between ${min} and ${max}!`}
    }

    return roomsNum;
};

const validateUrl = url => {
    const regEx = /^https|http/;
    if(!regEx.test(url)) {
        throw { message: 'Image URL must start with either http or https!'}
    }

    return url;
};

module.exports = {
    validateName,
    validateCity,
    validateRooms,
    validateUrl
}