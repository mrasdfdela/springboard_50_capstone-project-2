// Goal model setup & methods
"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");

const { NotFoundError } = require("../expressError");

class Goal {
  /** Post new goal */
  // If successful, returns { username, distance, kilojoules, time, startDt, endDt }
  static async new(
    username,
    distance = 0,
    kilojoules = 0,
    movingTime = 0,
    startDt = "NOW()",
    endDt
  ) {
    const result = await db.query(
      `INSERT INTO goals
          (username, distance, kilojoules, moving_time, start_date, end_date)
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING 
          username,
          distance,
          kilojoules,
          moving_time AS time,
          start_date AS startDt,
          end_date AS endDt`,
      [
        username,
        Number.parseInt(distance),
        Number.parseInt(kilojoules),
        Number.parseInt(movingTime),
        startDt,
        endDt,
      ]
    );
    const newGoal = result.rows[0];
    return newGoal;
  }

  // Finds total goal count of user
  // Returns object { count: {{someNumber}} }
  static async getUserGoalCount(username) {
    const goalRes = await db.query(
      `SELECT count(*) FROM goals WHERE username = $1`,
      [username]
    );
    return goalRes.rows[0];
  }

  /** Finds goal by id */
  // Returns goal object {goalId, username, distance, kilojoules, time, startDt, endDt }
  // Throw NotFoundError if goal is not found
  static async getById(goalId) {
    const goalRes = await db.query(
      `SELECT
        goal_id AS goalId,
        username,
        distance,
        kilojoules,
        moving_time AS time,
        start_date AS startDt,
        end_date AS endDt
      FROM goals WHERE goal_id = $1`,
      [Number.parseInt(goalId)]
    );

    if (!goalRes.rows[0]) {
      throw new NotFoundError(`Goal not found`);
    } else {
      return goalRes.rows[0];
    }
  }

  /** Finds goals, with parameter to toggle latest vs. all goals */
  // Returns an array of goal objects {goalId, username, distance, kilojoules, time, startDt, endDt }
  // Returns an empty array for no matching goals
  static async getUserGoals(username, count, offset) {
    const goalRes = await db.query(
      `SELECT
        goal_id as goalId,
        username,
        distance,
        kilojoules,
        moving_time AS time,
        start_date AS startDt,
        end_date AS endDt
      FROM goals
      WHERE username = $1
      ORDER BY end_date DESC
      LIMIT $2 OFFSET $3`,
      [username, count, offset]
    );
    return goalRes.rows;
  }

  /** Finds all user goals */
  // Returns an array of all user goals
  // ** Deprecated **
  static async getUserGoalsByDate(
    username,
    startDt = "2009-01-01",
    endDt = "NOW()"
  ) {
    const goalRes = await db.query(
      `SELECT
        username,
        distance,
        kilojoules,
        moving_time AS time,
        start_date AS startDt,
        end_date AS endDt
      FROM goals 
      WHERE 
        username = $1 AND 
        start_date >= $2 AND
        end_date <= $3
      ORDER BY start_date DESC`,
      [username, startDt, endDt]
    );
    return goalRes.rows;
  }

  /** Updates goal by id */
  // Returns a goal object { goalId, username, distance, kilojoules, time, startDt, endDt }
  // Throws NotFoundError if goal does not exist
  static async update(goalId, data) {
    // customizes
    let { setCols } = sqlForPartialUpdate(data, {});
    let goalVals = Object.values(data);

    const result = await db.query(
      `UPDATE goals
        SET ${setCols}
        WHERE goal_id = $${goalVals.length + 1}
        RETURNING 
          goal_id as goalId,
          username,
          distance,
          kilojoules,
          moving_time as time,
          start_date as startDt,
          end_date as endDt`,
      [...goalVals, goalId]
    );
    const activity = result.rows[0];

    if (!activity) {
      throw new NotFoundError(`Goal id ${goalId} not updated`);
    } else {
      return activity;
    }
  }

  /** Deletes goal by id */
  // If successful, returns deleted goal_id
  // Throw NotFoundError if goal_id does not exist
  static async remove(goalId) {
    let result = await db.query(
      `DELETE FROM goals WHERE goal_id = $1
      RETURNING goal_id`,
      [goalId]
    );
    const deletedId = result.rows[0];
    if (!deletedId) {
      throw new NotFoundError(`ID not found; goal not deleted`);
    }
    return deletedId;
  }
}

module.exports = Goal;
