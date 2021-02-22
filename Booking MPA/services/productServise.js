const Hotel = require('../models/Hotel')

function createHotel(data, _id) {
    return Hotel.create({...data, ownerCreatorId: _id })
}

function getAllHotels() {
    return new Promise((resolve, reject) => {
            let hotels = Hotel.find().lean()
            resolve(hotels)
        })
        .then(hotels => {

            let sortedHotels = hotels.sort((a, b) => {
                return b.freeRooms - a.freeRooms
            })
            console.log(sortedHotels);
            return sortedHotels
        })
        .catch(err => { console.log(`unsorted`) })




}

function getId(id) {
    return Hotel.findById(id).lean();
}

function deleteHotel(id) {
    return Hotel.deleteOne({ _id: id })
}

function postEditHotel(id, data) {

    return Hotel.updateOne({ _id: id }, {...data });

}

//  function book(hotelId, myId) {
//     console.log(hotelId);
//     console.log(myId);


//     let hotel = await Hotel.findById(hotelId)
//     let user = await User.findById(myId)

//     user.bookedHotels.push(hotelId)
//     await user.save();

//     hotel.userBookedHotels.push(myId)
//     hotel.freeRooms = --hotel.freeRooms;
//     return hotel.save();


// }

module.exports = {
    createHotel,
    getAllHotels,
    getId,
    deleteHotel,
    postEditHotel,

}