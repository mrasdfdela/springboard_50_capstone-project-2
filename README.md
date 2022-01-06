# Strava Capstone Project

2nd Capstone Project for Springboard

## Introduction

This project uses the [Strava API](https://developers.strava.com/docs/reference). Strava is a social network for endurance athletes that I use to track mine and my friends' workout activities. This project utilizes Node/Express & PostgreSQL on the backend, React/use-react-app on the frontend, and Strava's API.

## Libraries & Installation

- The app is split into frontend and backend directories. Their respective libraries are located in the `package.json` files. To install, create separate directories with the `package.json` files and run a `npm install`
- 
## API
This project utilizes [Oauth2](https://developers.strava.com/docs/authentication/) to access Strava data. Once a user saves codes/tokens to their account, the app uses a number of API calls to download Stravav data to the PostgreSQL database so that uses can view the data.
- https://developers.strava.com/docs/authentication, https://developers.strava.com/playground, https://developers.strava.com/playground/

<details>
  <summary>Activities</summary>
  <strong>GET activities</strong>
</details>
<details>
  <summary>Bikes</summary>
  <strong>GET bikes</strong>
</details>

This project also utilizes the [World Time API](http://worldtimeapi.org/) to reference at what time (in GMT) that a Strava `access_token` was utilized, which expires 6 hours after it is issued.
- http://worldtimeapi.org/api/timezone/

## Pages
- Home Page (latest Activities and Goals & links to view Activities and Goals pages)
- Activities
  - Activities page (list of activities with stats for date, distance, and calories and navigation to view more activities)
  - ActivityDetail page (for listing additional activity details)
- Goals
  - Goals page (with previously input goals for date, distance, or calories, and navigation to view more goals)
  - GoalDetail page (for listing additional goal details)
  - Goal Setting page (to post weekly, monthly, and yearly goals)
- User
  - Signup
  - Login
  - User Update (lists Strava athlete info or options to link/download strava data & form to update user profile information)

## Endpoints
- User
- Activities
- Bikes
- Goals

## Technologies
- Backend
  - node, express, body-parser, jsonschema, pg, bcrypt, jsonschema
- Frontend
  - create-react-app, reactstrap, bootstrap, react-router-dom, axios
