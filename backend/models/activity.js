"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError, BadRequestError } = require("../expressError");

class Activity {
  /** Post activity */
  static async new(
    activityId,
    atheleteId,
    startDt,
    type,
    distance,
    kilojoules,
    movingTime,
    desc,
    trainer
  ) {
    // First checks if the activity/activity_id exists in the database
    const duplicateCheck = await db.query(
      `SELECT activity_id FROM activities where activity_id=$1`,
      [activityId]
    );
    if (duplicateCheck.rows[0])
      throw new BadRequestError(
        `Activity already exists! activity_id: ${activityId}`
      );

    const result = await db.query(
      `INSERT INTO activities
        (activity_id,
          athlete_id,
          start_date,
          type,
          distance,
          kilojoules,
          moving_time,
          description,
          trainer)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING 
        activity_id, 
        athlete_id, 
        start_date, 
        type, 
        distance, 
        kilojoules,
        moving_time, 
        description,
        trainer`,
      [
        activityId,
        atheleteId,
        startDt,
        type,
        distance,
        kilojoules,
        movingTime,
        desc,
        trainer
      ]
    );
    const activity = result.rows[0];
    return activity;
  }

  /** Check if activity exists by id */
  static async activityExists(activityId) {
    const actRes = await db.query(
      `SELECT activity_id FROM activities WHERE activity_id = $1`,
      [activityId]
    );
    return actRes.rowCount === 0 ? false : true;
  }

  static async getCount(athleteId){
    const countRes = await db.query(
      `SELECT COUNT(*) FROM activities WHERE athlete_id = $1`,
      [athleteId]
    );
    return countRes;
  }

  /** Finds activity by id */
  static async getById(activityId) {
    const actRes = await db.query(
      `SELECT
        activity_id, athlete_id, start_date, type, distance, kilojoules, moving_time, description
      FROM activities WHERE activity_id = $1`,
      [activityId]
    );

    if (!actRes.rows[0]) {
      throw new NotFoundError(`No activity with that ID found`);
    } else {
      return actRes.rows[0];
    }
  }

  /** Finds activity by date */
  static async getByDates(athleteId, startDt, endDt="NOW()") {
    const res = await db.query(
      `SELECT
        start_date,
        type,
        distance,
        kilojoules,
        moving_time,
        description
      FROM activities 
      WHERE athlete_id = $1
        AND start_date BETWEEN $2 AND $3`,
      [athleteId, startDt, endDt]
    );
    return res.rows;
  }

  /** Finds all activities by user*/
  static async getByAthlete(athleteId, count, offset) {
    const userRes = await db.query(
      `SELECT 
        activity_id as activityId,
        athlete_id as athleteId,
        start_date as date,
        type,
        distance as meters,
        kilojoules,
        moving_time as time,
        description,
        trainer
      FROM activities 
      WHERE athlete_id = $1
      ORDER BY date DESC
      LIMIT $2 OFFSET $3
      `,
      [athleteId, count, offset]
    );
    return userRes.rows;
  }

  /** Updates activity by id */
  static async update(activityId, data) {
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
          kilojoules,
          moving_time,
          description`,
      [activityId]
    );
    const activity = result.rows[0];

    if (!activity) {
      throw new NotFoundError(`No activity with that ID updated`);
    } else {
      return activity;
    }
  }
  /** Deletes activity by id */
  static async remove(activityId) {
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