"use strict";

const db = require("../db");
const {
  NotFoundError
} = require("../expressError");

class Goal {
  /** Post new goal */
  static async new({
    username,
    distance,
    kilojoules = 0,
    movingTime = 0,
    startDt = "NOW()",
    endDt,
  }) {
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
      [username, distance, kilojoules, movingTime, startDt, endDt]
    );
    const newGoal = result.rows[0];
    return newGoal;
  }

  /** Finds goal by id */
  static async getById(goalId) {
    const goalRes = await db.query(
      `SELECT
        goal_id AS goalId
        username,
        distance,
        kilojoules,
        moving_time AS time,
        start_date AS startDt,
        end_date AS endDt
      FROM goals WHERE goal_id = $1`,
      [goalId]
    );

    if (!goalRes[0]) {
      throw new NotFoundError(`Goal not found`);
    } else {
      return goalRes[0];
    }
  }

  /** Finds all user goals */
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
        end_date <= $3`,
      [username, startDt, endDt]
    );
    return goalRes.rows;
  }

  /** Updates goal by id */
  static async update(goalId, data) {
    const { setCols } = sqlForPartialUpdate(data, {});
    const result = await db.query(
      `UPDATE goals
        SET ${setCols}
        WHERE goal_id = $1
        RETURNING 
          goal_id,
          username,
          distance,
          kilojoules,
          moving_time,
          start_date,
          end_date`,
      [goalId]
    );
    const activity = result.rows[0];

    if (!activity) {
      throw new NotFoundError(`Goal id ${goalId} not updated`);
    } else {
      return activity;
    }
  }

  /** Deletes goal by id */
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
  }
}

module.exports = Goal;