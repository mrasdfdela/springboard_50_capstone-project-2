// Activity model setup & methods
"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError, BadRequestError } = require("../expressError");

class Activity {
  /** Posts new activity
   * If successful, returns { activity_id, athlete_id, start_date, type, distance,
   * kilojoules, moving_time, description, trainer }
   * Throws BadRequestError on duplicate **/
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
    // throw error if activity_id already exists
    if (duplicateCheck.rows[0])
      throw new BadRequestError(
        `Activity already exists! activity_id: ${activityId}`
      );
    // otherwise, creates & returns data from new activity
    const result = await db.query(
      `INSERT INTO activities
        ( activity_id, athlete_id,start_date,type,distance,
          kilojoules,moving_time,description,trainer )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING 
        activity_id, athlete_id, start_date, type, distance, 
        kilojoules, moving_time, description, trainer`,
      [
        activityId,
        atheleteId,
        startDt,
        type,
        distance,
        kilojoules,
        movingTime,
        desc,
        trainer,
      ]
    );
    const activity = result.rows[0];
    return activity;
  }

  /** Checks if activity exists by id
   * Returns an object { exists: true/false }**/
  static async activityExists(activityId) {
    const actRes = await db.query(
      `SELECT activity_id FROM activities WHERE activity_id = $1`,
      [activityId]
    );
    const exists = actRes.rowCount === 0 ? false : true;
    return { exists: exists };
  }

  // Checks activity count using athlete_id
  // Returns object { count: {{someInteger}} }
  static async getCount(athleteId) {
    const countRes = await db.query(
      `SELECT COUNT(*) FROM activities WHERE athlete_id = $1`,
      [athleteId]
    );
    return countRes.rows[0];
  }

  // Finds an activity by id
  // If successful, returns { activity_id, athlete_id, start_date, type, 
  // distance, kilojoules, moving_time, description }
  // Throw NotFoundError if activity_id does not exist
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
  // Returns an array of activities { start_date, type, distance, 
  // kilojoules, moving_time, description }
  // If no matches, returns empty array
  static async getByDates(athleteId, startDt, endDt = "NOW()") {
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

  // Finds all activities by user
  // Returns an array of activities { activityId, athleteId, date, type,
  // meters, kilojoules, time, description, trainer }
  // If no matches, returns empty array
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
  // If successful, returns an object { activity_id, athlete_id, start_date,
  // type, distance,  kilojoules, moving_time, description }
  // Throws NotFoundError if activity_id does not exist
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
  // If successful, returns the activity_id
  // Throws NotFoundError if activity_id does not exist
  static async remove(activityId) {
    let result = await db.query(
      `DELETE FROM activities WHERE activity_id = $1
      RETURNING activity_id`,
      [activityId]
    );
    if (!result.rows[0].activity_id) {
      throw new NotFoundError(`No activity with that ID deleted`);
    }
    return result.rows[0];
  }
}

module.exports = Activity;