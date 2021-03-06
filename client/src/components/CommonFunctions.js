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


const extractDays = (weekday) => {

    // Setting Display Variables    
    let displayDate = "Every ";
    if(weekday.includes("1")) {
        displayDate += "M";
    }
    if(weekday.includes("2")) {
        if(displayDate.length > 6) {
            displayDate += "-"
        }
        displayDate += "T";
    }
    if(weekday.includes("3")) {
        if(displayDate.length > 6) {
            displayDate += "-"
        }
        displayDate += "W";
    }
    if(weekday.includes("4")) {
        if(displayDate.length > 6) {
            displayDate += "-"
        }
    displayDate += "TH";
    }
    if(weekday.includes("5")) {
        if(displayDate.length > 6) {
            displayDate += "-"
        }
        displayDate += "F";
    }
    if(weekday.includes("6")) {
        if(displayDate.length > 6) {
            displayDate += "-"
        }
        displayDate += "SAT";
    }
    if(weekday.includes("0")) {
        if(displayDate.length > 6) {
            displayDate += "-"
        }
        displayDate += "SUN";
    }

    return displayDate;
}




export {
    createWeekdayString,
    extractDays
};