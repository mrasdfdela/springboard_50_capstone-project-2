function calToKj(calories) {
  const kilojoules = calories / 1.005;
  return Math.round(kilojoules * 10) / 10;
}

function kjToCal(kj) {
  const calories = kj * 1.005;
  return Math.round(calories * 10) / 10;
}

function metersToMiles(meters){
  const miles = meters * 0.000621371;
  return Math.round(miles * 10) / 10;
}

function milesToMeters(miles){
  const meters = 1609.34 * miles;
  return Math.round(meters * 10) / 10;
}

function calcEndDt(startDt, period) {
  let time = Date.parse(startDt);
  const milliseconds = 1000 * 60 * 60 * 24
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
  }
  const newDate = new Date(time);
  return newDate.toISOString().substr(0, 10);
}

function timeToSeconds(time){
  let seconds;
  let timeArr = time.split(':');
  timeArr = timeArr.map((el) => parseInt(el));
  
  if (timeArr.length === 3){
    seconds = (timeArr[0]*24 + timeArr[1])*3600 + timeArr[2] * 60; 
  } else if (timeArr.length === 2) {
    seconds = timeArr[0] * 3600 + timeArr[1] * 60;
  }
  return seconds;
}

module.exports = {
  calToKj,
  kjToCal,
  metersToMiles,
  milesToMeters,
  calcEndDt,
  timeToSeconds
};