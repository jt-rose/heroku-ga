export var formatTime = function (date) {
    var hour = date.getHours();
    var AMPM = "AM";
    if (hour === 0) {
        hour = 12;
    }
    if (hour > 12) {
        hour = hour - 12;
        AMPM = "PM";
    }
    var minutes = String(date.getMinutes());
    if (minutes.length === 1) {
        minutes = "0" + minutes;
    }
    if (minutes === "00") {
        return String(hour) + " " + AMPM;
    }
    else {
        return String(hour) + ":" + String(minutes) + " " + AMPM;
    }
};
