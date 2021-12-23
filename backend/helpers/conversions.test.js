const {
  calToKj,
  kjToCal,
  metersToMiles,
  milesToMeters,
  calcEndDt,
  timeToSeconds,
  secondsToTime,
  datesToTimePeriod,
} = require("./conversions");

describe("test calToKj", function() {
  test("convert calories to kJ", function(){
    const result = calToKj(1005);
    expect(result).toEqual(1000);
  })
});

describe("test kjToCal", function () {
  test("convert kJ to calories", function () {
    const result = kjToCal(1000);
    expect(result).toEqual(1005);
  });
});

describe("test metersToMiles", function () {
  test("convert meters to miles", function () {
    const result = metersToMiles(1609);
    expect(result).toEqual(1);
  });
});

describe("test milesToMeters", function () {
  test("convert miles to meters", function () {
    const result = milesToMeters(1);
    expect(result).toEqual(1609.3);
  });
});

describe("test calcEndDt", function () {
  test("calculate the end date based on start date & time period", function () {
    const result = calcEndDt("01/01/1970 00:00:00", "week");
    expect(result).toEqual("1970-01-08");
  });
});

describe("test datesToTimePeriod", function () {
  test("calculate the time period based on start & end dates", 
  function () {
    const startDt = new Date("01/01/1970 00:00:00")
    const endDt = new Date("01/08/1970 00:00:00")
    const result = datesToTimePeriod(startDt, endDt);
    expect(result).toEqual("week");
  });
});

describe("test timeToSeconds", function () {
  test("convert time format x:xx to seconds", function () {
    const result = timeToSeconds("3:21");
    expect(result).toEqual(12060);
  });
});

describe("test secondsToTime", function () {
  test("convert seconds to time format x:xx", function () {
    const result = secondsToTime(1230);
    expect(result).toEqual("00:20");
  });
});