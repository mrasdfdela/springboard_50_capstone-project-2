"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError, BadRequestError } = require("../expressError");

class Activity {
  /** Post activity */
  static async new({ activityId, atheleteId, startDt, type, distance, calories, movingTime, desc }) {
    const duplicateCheck = await db.query(
      `SELECT activity_id FROM activities where activity_id=$1`,
      [activityId]);
    if (duplicateCheck.rows[0]) throw new BadRequestError(`Activity already exists! activity_id: ${activityId}`);

    const result = await db.query(
      `INSERT INTO activities
        (activity_id,
          athlete_id,
          start_date,
          type,
          distance,
          calories,
          moving_time,
          description)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING activity_id, athlete_id, start_date, type, distance, calories, moving_time, description`,
      [activityId, atheleteId, startDt, type, distance, calories, movingTime, desc]);
    const activity = result.rows[0];
    return activity;
  }

  /** Finds activity by id */
  static async getById(activityId){
    const actRes = await db.query(
      `SELECT
        start_date,
        type,
        distance,
        calories,
        moving_time,
        description
      FROM activities WHERE athlete_id = $1`,
      [activityId]
    );

    if (!actRes[0]) {
      throw new NotFoundError(`No activity with that ID found`);
    } else {
      return actRes[0];
    }
  }

  /** Finds all activities by user*/
  static async getByUser(username){
    const userRes = await db.query(
      `SELECT athlete_id 
      FROM users where username = $1`,
      [username]
    )
    const atheleteId = userRes.rows[0];

    const actRes = await db.query(
      `SELECT
        start_date,
        type,
        distance,
        calories,
        moving_time,
        description
      FROM activities WHERE athlete_id = $1`,
      [atheleteId]
    );
    return actRes.rows
  }

  /** Updates activity by id */
  static async update(activityId, data){
    const { setCols } = sqlForPartialUpdate(data, {});
    const result = await db.query(
      `UPDATE activities
        SET ${setCols}
        WHERE activity_id = $1
        RETURNING 
          activity_id,
          athlete_id,
          start_date,
          type,
          distance,
          calories,
          moving_time,
          description`,
      [activityId]);
    const activity = result.rows[0];

    if (!activity) {
      throw new NotFoundError(`No activity with that ID updated`);
    } else {
      return activity;
    }
  }
  /** Deletes activity by id */
  static async remove(activityId){
    let result = await db.query(
      `DELETE FROM activities WHERE activity_id = $1
      RETURNING activity_id`, 
      [activityId]
    );
    const deletedId = result.rows[0];
    if (!deletedId) {
      throw new NotFoundError(`No activity with that ID deleted`);
    }
  }
}

module.exports = Activity;