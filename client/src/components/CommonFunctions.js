const createWeekdayString = (days) => {
    //Create Weekday string for Database:
    let weekdayString = ""
    if(days.monday) {
        if(weekdayString === "") {
            weekdayString += "1"
        }
        else {
            weekdayString += " 1"
        }
    }
    if(days.tuesday) {
        if(weekdayString === "") {
            weekdayString += "2"
        }
        else {
            weekdayString += " 2"
        }
    }
    if(days.wednesday) {
        if(weekdayString === "") {
            weekdayString += "3"
        }
        else {
            weekdayString += " 3"
        }
    }
    if(days.thursday) {
        if(weekdayString === "") {
            weekdayString += "4"
        }
        else {
            weekdayString += " 4"
        }
    }
    if(days.friday) {
        if(weekdayString === "") {
            weekdayString += "5"
        }
        else {
            weekdayString += " 5"
        }
    }
    if(days.saturday) {
        if(weekdayString === "") {
            weekdayString += "6"
        }
        else {
            weekdayString += " 6"
        }
    }
    if(days.sunday) {
        if(weekdayString === "") {
            weekdayString += "0"
        }
        else {
            weekdayString += " 0"
        }
    }
    return weekdayString;
}





export {createWeekdayString};