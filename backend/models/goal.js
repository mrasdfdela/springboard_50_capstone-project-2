"use strict";

const db = require("../db");
const {
  NotFoundError
} = require("../expressError");

class Goal {
  /** Post new goal */
  static async new({ username, distance, calories, time, startDt, endDt }) {
    const result = await db.query(
      `INSERT INTO goals
        (username, distance, calories, moving_time, start_date, end_date)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING 
        username,
        distance,
        calories,
        moving_time AS time,
        start_date AS startDt,
        end_date AS endDt`,
      [username, distance, calories, time, startDt, endDt]
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
        calories,
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
  static async getByUser(username) {
    const goalRes = await db.query(
      `SELECT
        username,
        distance,
        calories,
        moving_time AS time,
        start_date AS startDt,
        end_date AS endDt
      FROM goals WHERE username = $1`,
      [username]
    );
    return goalRes.rows;
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