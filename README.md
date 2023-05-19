# War Penguins
War penguins is a multiplayer game made with HTML5 and Node.js

![Screenshot of War Pengiuns](/app/public/img/screenshot.png)

## How to run the project
To run the project you need to have [Node.js](https://nodejs.org/en/) installed on your computer.

1. Clone the project
2. Run `yarn` to install the dependencies
3. Run `yarn start` or `yarn start:nodemon` to start the server
4. Open your browser and go to `http://localhost:3000`
5. Enjoy!

## What is HTML5-GAME made of
The HTML5-GAME build upon multiple libraries.
These libraries are specified in the `package.json` and can be installed with the `yarn` commando.

## .env file
To be able to run the project some environment variables are needed. Create your own `.env` file in the root of the project and copy the content of the `.env.example` file. 

## Nodemon
For a better developing experience this project makes use of the Nodeman dependence.
Nodemon is a utility that will monitor for any changes in your source and automatically restart your server.
Running `yarn start` will run the task `nodemon server/server.js`.