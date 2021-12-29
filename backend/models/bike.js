"use strict";

const db = require("../db");
const {
  NotFoundError,
  BadRequestError
} = require("../expressError");

class Bike {
  /** Post new bike */
  static async new(bikeId, athleteId, distance, brand, model, desc) {
    const result = await db.query(
      `INSERT INTO bikes
        (bike_id, 
        athlete_id, 
        distance, 
        brand_name, 
        model_name, 
        bike_description)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING 
        bike_id AS bikeId, 
        athlete_id AS athleteID, 
        distance,
        brand_name AS brand, 
        model_name AS model, 
        bike_description AS desc`,
      [bikeId, athleteId, distance, brand, model, desc]);
    const newBike = result.rows[0];
    return newBike;
  }

  /** Checks if bike exists */
  static async bikeExists(bikeId){
    const bikeRes = await db.query(
      `SELECT bike_id from bikes WHERE bike_id = $1`, 
      [bikeId] 
    );
    return bikeRes.rowCount === 0 ? false : true;
  }

  /** Finds bike by id */
  static async getById(bikeId){
    // console.log(`finding bike: ${bikeId}`);
    const bikeRes = await db.query(
      `SELECT
        bike_id AS bikeId, 
        athlete_id AS athleteID, 
        distance,
        brand_name AS brand, 
        model_name AS model, 
        bike_description AS desc
      FROM bikes WHERE bike_id = $1`,
      [bikeId]
    );
    // console.log(bikeRes.rows);

    if (!bikeRes.rows[0]) {
      throw new NotFoundError(`No bike with that ID found`);
    } else {
      return bikeRes.rows[0];
    }
  }

  /** Finds all bikes by athlete_id*/
  static async getByAthleteId(athleteId, startDt, endDt){
    const bikeRes = await db.query(
      `SELECT
        bike_id AS bikeId, 
        athlete_id AS athleteID, 
        distance,
        brand_name AS brand, 
        model_name AS model, 
        bike_description AS desc
      FROM bikes WHERE athlete_id = $1`,
      [athleteId]
    );
    return bikeRes.rows;
  }

  /** Updates bike by id */
  // static async update(bikeId, data){
  //   const { setCols } = sqlForPartialUpdate(data, {});
  //   const bikeRes = await db.query(
  //     `UPDATE bikes
  //     SET ${setCols}
  //     WHERE bike_id = $1
  //     RETURNING 
  //       bike_id AS bikeId, 
  //       athlete_id AS athleteID, 
  //       distance,
  //       brand_name AS brand, 
  //       model_name AS model, 
  //       bike_description AS desc`,
  //     [bikeId]
  //   );
  //   const bike = bikeRes.rows[0];

  //   if (!bike) {
  //     throw new NotFoundError(`No bike with that ID found`);
  //   } else {
  //     return bike;
  //   }
  // }
  /** Deletes bike by id */
  static async remove(bikeId){
    let result = await db.query(
      `DELETE FROM bikes WHERE bike_id = $1
      RETURNING bike_id`, 
      [bikeId]
    );
    const deletedId = result.rows[0];
    if (!deletedId) {
      throw new NotFoundError(`No bike with that ID deleted`);
    }
    return deletedId;
  }
}

module.exports = Bike;