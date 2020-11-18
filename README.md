# HTML5-GAME
Multiplayer game made with HTML5 and Node.js

## What is HTML5-GAME made of
The HTML5-GAME build upon multiple libraries.
These libraries are specified in the `package.json` and can be installed with the `yarn` commando.

**Techniques used to make HTML5-GAME**
* Node - v7.0.2
* npm - v4.0.5
* Express - v4.14.0
* Socket.io - v1.7.2

## .env file
To be able to run the project some environment variables are needed. Create your own `.env` file in the root of the project and copy the content of the `.env.example` file. 

## Nodemon
For a better developing experience this project makes use of the Nodeman dependence.
Nodemon is a utility that will monitor for any changes in your source and automatically restart your server.
Running `yarn start` will run the task `nodemon server/server.js`.