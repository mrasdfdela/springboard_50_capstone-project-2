"use strict";

const db = require("../db");
const {
  NotFoundError,
  BadRequestError
} = require("../expressError");

class Bike {
  /** Post new bike */
  static async new({ bikeId, athleteId, distance, brand, model, desc }) {
    const duplicateCheck = await db.query(
      `SELECT bike_id FROM bikes where bike_id=$1`,
      [bikeId]);
    if (duplicateCheck.rows[0]) throw new BadRequestError(`Bike already registered! id: ${bikeId}`);

    const result = await db.query(
      `INSERT INTO activities
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

  /** Finds bike by id */
  static async getById(bikeId){
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

    if (!bikeRes[0]) {
      throw new NotFoundError(`No bike with that ID found`);
    } else {
      return bikeRes[0];
    }
  }

  /** Finds all bikes by athlete_id*/
  static async getByAthleteId(athleteId){
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
  static async update(bikeId, data){
    const { setCols } = sqlForPartialUpdate(data, {});
    const bikeRes = await db.query(
      `UPDATE activities
      SET ${setCols}
      WHERE bike_id = $1
      RETURNING 
        bike_id AS bikeId, 
        athlete_id AS athleteID, 
        distance,
        brand_name AS brand, 
        model_name AS model, 
        bike_description AS desc`,
      [bikeId]
    );
    const bike = bikeRes.rows[0];

    if (!bike) {
      throw new NotFoundError(`No bike with that ID found`);
    } else {
      return bike;
    }
  }
  /** Deletes activity by id */
  static async remove(bikeId){
    let result = await db.query(
      `DELETE FROM bikes WHERE bike_id = $1
      RETURNING bike_id`, 
      [bikeId]
    );
    const deletedId = result.rows[0];
    if (!deletedId) {
      throw new NotFoundError(`No activity with that ID deleted`);
    }
  }
}

module.exports = Bike;