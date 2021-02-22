module.exports = {
  dateFixed: function (date) {
    // ако в задачата се изисква дата на създаване на item и сортиране по дата
    let options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    };
    let newDate = new Date(date).toLocaleTimeString("en-en", options).toString();
    // console.log(newDate);
    return newDate.split(",").join(" ");
  },
  countArr: function (arr) {
      // ако трябва да рендерираме дължината на масив
    return arr.length;
  }
};
