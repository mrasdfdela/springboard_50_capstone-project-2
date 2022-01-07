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
  <ul>
    <li><strong>/signup</strong></li> - User Signup 
    <li><strong>/login</strong></li> - User Login 
    <li><strong>/user-update</strong> - User Update 
      <ol>
        <li>lists Strava athlete info or links to a one-time process for linking to Strava data</li>
        <li>form to update user profile information</li>
      </ol>
    </li>
  </ul>
</details>
<details>
  <summary>Home Page</summary>
  <ul>
    <li><strong>/</strong> - displays message to sign into app or displays latest Activities and Goals w/ links to view Activities and Goals pages</li>
  </ul>
</details>
<details>
  <summary>Activities</summary>
  <ul>
    <li><strong>/activities</strong> - lists activities with stats for date, distance, and calories and navigation to view more activities</li>
    <li><strong>/activities/{{activity_id}}</strong> - lists additional activity details</li>
  </ul>
</details>
<details>  
  <summary>Goals</summary>
  <ul>
    <li><strong>/goals</strong> - list goal dates, distance, or calories, and has options to navigate and view more goals</li>
    <li><strong>/goals/{{goal_id}}</strong> - lists additional goal details</li>
    <li><strong>/goals/new</strong> - displays form for posting weekly, monthly, and yearly goals</li>
  </ul>
</details>
  
## Endpoints
<details>
<summary>/auth</summary>
  - <strong>GET /strava/callback</strong> - endpoint that Strava redirects to after Oauth verification; saves a one-time Strava auth_code for Strava token exchange
  - <strong>POST /strava/tokens</strong> - saves user's Strava refresh_token and access_token
  - <strong>POST /token</strong> - authenticates user and returns jwt to authenticate future requests
  - <strong>POST /register</strong> - registers users to app
</details>
<details>
<summary>/users</summary>
  - <strong>GET /{{username}}</strong> - returns user profile data
  - <strong>PATCH /{{username}}</strong> - updates user profile
  - <strong>GET /{{username}}/bikes</strong> - returns an array of user bikes
  - <strong>GET /{{username}}/goals</strong> - returns an array of user goals
  - <strong>GET /{{username}}/goals-count</strong> - returns an object with the number of user's goal records
  - <strong>GET /{{username}}/details</strong> - returns extra user details, including token information
</details>
<details>
<summary>/bikes</summary>
  - <strong>POST /</strong> - saves an array of bike data
  - <strong>GET /{{bike_id}}</strong> - returns bike data
  - <strong>GET /</strong> - returns an array of user's bikes
  - <strong>DELETE /{{bike_id}}</strong> - deletes the selected bike
</details>
<details>
<summary>/activities</summary>
  - <strong>POST /</strong> - saves an array of activities (of data downloaded from Strava)
  - <strong>GET /</strong> - returns an array of user's activities, using parameters to specify the size of the array and the page number (starting from 1) to retrieve 
  - <strong>GET /count</strong> - returns an object with count of user's activities
  - <strong>GET /{{activity_id}}</strong> - returns details of the selected activity
  - <strong>DELETE /{{activity_id}}</strong> - deletes the selected activity
</details>
<details>
  <summary>/goals</summary>
  - <strong>POST /</strong> - saves a new user goal
  - <strong>GET /{{goal_id}}</strong> - returns the selected user goal
  - <strong>PATCH /{{goal_id}}</strong> - updates the selected user goal
  - <strong>DELETE /{{goal_id}}</strong> - deletes the selected user goal
</details>

## Technologies
- Frontend
  - axios, create-react-app, reactstrap, bootstrap, dotenv, react-router-dom, uuid
- Backend
  - bcrypt, body-parser, cors, express, jsonschema, jsonwebtoken, node, nodemon, pg
