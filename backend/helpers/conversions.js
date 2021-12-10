function calToKj(calories) {
  if(typeof calories !== 'undefined') {
    const kilojoules = calories / 1.005;
    return Math.round(kilojoules * 10) / 10;
  }
  return null;
}

function kjToCal(kj) {
  if (typeof kj !== "undefined") {
    const calories = kj * 1.005;
    return Math.round(calories * 10) / 10;
  }
  return null;
}

function metersToMiles(meters){
  if (typeof meters !== "undefined") {
    const miles = meters * 0.000621371;
    return Math.round(miles * 10) / 10;
  }
  return null;
}

function milesToMeters(miles){
  if (typeof miles !== "undefined") {
    const meters = 1609.34 * miles;
    return Math.round(meters * 10) / 10;
  }
  return null;
}

function calcEndDt(startDt, period) {
  let time = Date.parse(startDt);

  const milliseconds = 1000 * 60 * 60 * 24;
  switch (period) {
    case "day":
      time = time + 1 * milliseconds;
      break;
    case "week":
      time = time + 7 * milliseconds;
      break;
    case "month":
      time = time + 30 * milliseconds;
      break;
    case "year":
      time = time + 365 * milliseconds;
      break;
  }
  const newDate = new Date(time);
  return newDate.toISOString().substr(0, 10);
}

function timeToSeconds(time){
  if (typeof time !== "undefined") {
    let seconds;
    let timeArr = time.split(":");
    timeArr = timeArr.map((el) => parseInt(el));

    if (timeArr.length === 3) {
      seconds = (timeArr[0] * 24 + timeArr[1]) * 3600 + timeArr[2] * 60;
    } else if (timeArr.length === 2) {
      seconds = timeArr[0] * 3600 + timeArr[1] * 60;
    }
    return seconds;
  }
}

function secondsToTime(seconds){
  if (typeof seconds !== "undefined" && seconds > 0) {
  //   const hours = Math.floor(seconds / 3600);
  //   seconds = seconds % 3600;

  //   const minutes = Math.floor(seconds / 60);
  //   seconds = seconds % 60;

  //   return hours > 0
  //     ? `${minutes}:${seconds}`
  //     : `${hours}:${minutes}:${seconds}`;
  // }
  let date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(11,5);
  }
}

function datesToTimePeriod(startDt, endDt){
  if (typeof startDt != "undefined" && typeof endDt != "undefined") {
    const timeDiff = endDt - startDt;
    const dayDiff = timeDiff / ( 86400 * 1000); // 
    let timePeriod;
    
    switch(dayDiff) {
      case 1:
        timePeriod = "day";
        break;
      case 7:
        timePeriod = "week";
        break;
      case 30:
        timePeriod = "month";
        break;
      case 365:
        timePeriod = "year";
        break;
    }
    return timePeriod;
  }
}

module.exports = {
  calToKj,
  kjToCal,
  metersToMiles,
  milesToMeters,
  calcEndDt,
  timeToSeconds,
  secondsToTime,
  datesToTimePeriod
};