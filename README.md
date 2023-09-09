# open-music

The aim of this project is to simulate how a music streaming service handles adding a song and/or album to its platform, and how a user create a playlist based on those songs, allowing other users to collab with each other to create their favorite playlist.

This project uses `node.js` and `HAPI` framework at its core, `PostgreSQL` for its database, and `JWT` token for authentication & authorization. The purpose of this project is to help me understand how a backend service interact with its databases and the authentication/authorization flow of a project.

## Setup

1. clone this repo
2. create a `.env` file based on `.env.example` and fill out your configs
3. run `npm install`
4. run `npm run migrate up`
5. run `npm start` or `npm run start`

<sup>Base url: http://localhost:5000 (if you haven't modified the port)</sup>

