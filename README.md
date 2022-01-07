# My-Strava

Jerry's 2nd Capstone Project for Springboard

## Introduction

This project uses the [Strava API](https://developers.strava.com/docs/reference). Strava is a social network for endurance athletes that I use to track mine and my friends' cycling workouts. This project utilizes Node/Express & PostgreSQL on the backend, React/use-react-app on the frontend, and Strava's API to access workout data.

## Libraries & Installation

- The app is split into frontend and backend directories. Their respective libraries are located in the `package.json` files. To install, create separate directories with the `package.json` files and run a `npm install`

## API
This project utilizes [Oauth2](https://developers.strava.com/docs/authentication/) to access Strava data. Once a user saves codes/tokens to their account, the app uses a number of API calls to download Strava data to a PostgreSQL db for later access.

<details>
  <summary>OAuth</summary>
  <strong>[Strava Authentication](https://developers.strava.com/docs/authentication/)</strong>
  This app connects to Strava using Oauth once (saving the generated auth_code), exchanges credentials for access & refresh tokens, and uses those tokens to download user activity data on subsequent sign-ins. A full explanation for this process is detailed in the [Strava Developers documentation](https://developers.strava.com/docs/authentication/)
</details>
<details>
  <summary>Athlete</summary>
  <strong>[GET /athlete](https://developers.strava.com/playground/#/Athletes/getLoggedInAthlete)</strong>
  The athlete route returns profile data for Strava athletes. This app saves the athlete id and their bikes from the returned object.
</details>
<details>
  <summary>Athlete Activities</summary>
  <strong>[GET /athlete/activities](https://developers.strava.com/playground/#/Activities/getLoggedInAthleteActivities)</strong>
</details>
The athlete activities route returns an array of activiy objects, each of which include details of the activity and a reference to the associated athlete. Activities are downloaded using query parameters for batching (page & per_page) and filtering by date (after the last recorded activity). This app saves activity name, date, type, distance, kilojoules, moving_time, and trainer (T/F) data.

- https://developers.strava.com/docs/authentication
- https://developers.strava.com/playground

This project also utilizes the [World Time API](http://worldtimeapi.org/) to reference at what time (in GMT) that a Strava `access_token` was utilized, which expires 6 hours after it is issued.
- http://worldtimeapi.org/api/timezone/

## Pages
<details>
  <summary>User</summary>
  - Signup <strong>/signup</strong>
  - Login **/login**
  - User Update **/user-login** - 1) lists Strava athlete info or links to a one-time process for linking to Strava data & 2) form to update user profile information
</details>
<details>
  <summary>Home Page</summary>
  - **/** - displays message to sign into app or displays latest Activities and Goals w/ links to view Activities and Goals pages
</details>
<details>
  <summary>Activities</summary>
  - Activities page **/activities** - list of activities with stats for date, distance, and calories and navigation to view more activities
  - ActivityDetail page **/activities/{{activity_id}} - for listing additional activity details- 
</details>
<details>  
  <summary>Goals</summary>
  - Goals page **/goals** - with previously input goals for date, distance, or calories, and navigation to view more goals)
  - GoalDetail page **/goals/{{goal_id}} - for listing additional goal details
  - Goal Setting page **/goals/new** - to post weekly, monthly, and yearly goals
</details>
  
## Endpoints
<details>
<summary>/auth</summary>
  - GET /strava/callback - endpoint that Strava redirects to after Oauth verification; saves a one-time Strava auth_code for Strava token exchange
  - POST /strava/tokens - saves user's Strava refresh_token and access_token
  - POST /token - authenticates user and returns jwt to authenticate future requests
  - POST /register - registers users to app
</details>
<details>
<summary>/users</summary>
  - GET /{{username}} - returns user profile data
  - PATCH /{{username}} - updates user profile
  - GET /{{username}}/bikes - returns an array of user bikes
  - GET /{{username}}/goals - returns an array of user goals
  - GET /{{username}}/goals-count - returns an object with the number of user's goal records
  - GET /{{username}}/details - returns extra user details, including token information
</details>
<details>
<summary>/bikes</summary>
  - POST / - saves an array of bike data
  - GET /{{bike_id}} - returns bike data
  - GET / - returns an array of user's bikes
  - DELETE /{{bike_id}} - deletes the selected bike
</details>
<details>
<summary>/activities</summary>
  - POST / - saves an array of activities (of data downloaded from Strava)
  - GET / - returns an array of user's activities, using parameters to specify the size of the array and the page number (starting from 1) to retrieve 
  - GET /count - returns an object with count of user's activities
  - GET /{{activity_id}} - returns details of the selected activity
  - DELETE /{{activity_id}} - deletes the selected activity
</details>
<details>
  <summary>/goals</summary>
  - POST / - saves a new user goal
  - GET /{{goal_id}} - returns the selected user goal
  - PATCH /{{goal_id}} - updates the selected user goal
  - DELETE /{{goal_id}} - deletes the selected user goal
</details>

## Technologies
- Frontend
  - axios, create-react-app, reactstrap, bootstrap, dotenv, react-router-dom, uuid
- Backend
  - bcrypt, body-parser, cors, express, jsonschema, jsonwebtoken, node, nodemon, pg
