# Code Review Basic API [![license](https://img.shields.io/github/license/DAVFoundation/captain-n3m0.svg?style=flat-square)](https://github.com/DAVFoundation/captain-n3m0/blob/master/LICENSE)

## Summary

- a new authentication layer using JWT tokens 
and a new express middleware to create an access layer for the routes
- a new login route for the users to login, using the profile model already provided before
- small changes to the profile model. added password property to give password to each new profile
- added compression library to use the compression middleware, reducing the response size 
- completed all the APIs for a full CRUD operation (except for Profile APIs), applied the Auth Middleware to all. 
- removed unnecessary console.logs
- used try/catch for the async/await syntax, so that each error does not stop the runtime and
cause the whole application to crash
- corrected some of the responses and their statuses and empty messages for better user friendly and readable responses. 
- changed the POST /api/simulator/:profile_id to POST /api/simulator and send the profile_id via body.
- slightly changed the seed.ts scripts to initialize the DB with better random objects
- created a small script to generate random keys for the API_SECRET_KEY using 32 random bytes
- changed the package.json and removed extra and unused dependencies
- Created a Dockerfile to containerize the project.



## Code Structure
created new folders for better managing the project. namely, **middlewares** and **helpers**. as the name suggests middleware contains the express middlewares. helpers folder contains code snippets and util functions that are responsible to keep the code lesser and cleaner.


## Authentication

all the APIs were exposed to the public with no authentication whatsoever, so I have added a new express middleware in the middleware folder to help protect the APIs. I have added the standard  `jwt` library to help sign and verify users when logging in. the middleware searches for the Bearer < Token > Header from the request and verifies the token using the `jwt.verify()` function.


## Changes to Data Models

**Profile** now has a password. which is used to login with as a user.


**Favorite**'s profile_id type is changed to Schema.Types.ObjectId. it is best to tell MongoDB what type of Data we want to save, instead of plain old String


## Changes to Routes and APIs

there is a new login router that has one API. **POST /api/login** which takes the email and password from body. after making sure that there is an existing profile with this email and password. it will return a Standard JWT newly signed token for that specific user. the password used to be saved in plain text, which is a terrible security practice. i have added the `bcrypt` library to help salt,hash, and compare passwords.

there are few more new APIs related to the CRUD operations for the previous APIs.

- **POST /api/favorite/** creates a new favorite 
- **PUT /api/favorite/** edit an existing favorite
- **DELETE /api/favorite/** delete a favorite
- **POST /api/simulator/** creates a new simulator 
- **PUT /api/simulator/** edit an existing simulator
- **DELETE /api/simulator/** delete a simulator

I have delibirately removed the **POST /api/simulator/:profile_id** and replaced it with **POST /api/simulator/**
to maintain the security practice. having a MongoDB ObjectId sent into the url is not ideal. and could lead to a vulnerability.

all the api logic is simple and straightforward. it first looks for the required params (i have assumed all the models properties as required) then checks for the access layer. if the user can edit or delete an object, it will perform the task, otherwise it will respond with a message instead. each user(profile) can modfiy/delete their own data only. so user1 can create as many as simulators but can only modfiy/delete their own.

the **POST /api/profile** also was subject to security changes. the passwords are stored using salted hashes. and the email is being checked as a "Valid Email Address" using the `validateEmail()` function.


## Syntax Changes

### Async/Await is Great! if you constantly catch the errors :smiley:

I have added the try/catch block for all async operations, it is suggested to use try catch block especially in a backend service application so if by any chance an error occurs, the runtime does not stop and the service can keep functioning for other API calls. please note that i only `console.log()` the errors, and i dont send them back to the client, again for maintaining the security practice.

unnecessary `console.log()`s are removed and only errors pop in the terminal.


## Compression
I have added the `compression` library and middleware to help reduce the response sizes for a faster response.  

## Helpers

as mentioned before, i have created a new folder, **helpers**. in this folder i have a few helping functions to help me write better code. in this folder you'll find **shouldHave** and **validateEmail** files.

**shouldHave** is a simple function that takes 2 arguments and gives back 2. the first is the body and the second is the required params. as you can see in `shouldHave.ts` it will look for the required params in the provided body, and it will make a log out of the current data. so if the notFound array is not empty, that means there is a missing params in the sent body.

**validateEmail** is a function that uses RegExp to look for a valid email. it takes one argument and transforms it to string and searches that string for a valid email format.


## REST response codes and messages 

I have added HTTP response codes and messages to all of the responses to keep the APIs readable and easy to use.

## Environments and Config

the code already uses the `dotenv` library. so I have created a new `.env` file in project's root directory. I also added a new env called `API_SECRET_KEY`, which is used to sign and verify the tokens. it is best to use a 256bit Hex String. I have changed the `config.ts` file to use the default port of 3000.

## Scripts

I have slightly changed the `seed.ts` file so it will generate better data to test out. I also created **createRandomByte** in the scripts folder to generate random 32 Bytes of Hex String in order to use for the  `API_SECRET_KEY` env var.

## Dependencies
using the [depcheck](https://www.npmjs.com/package/depcheck) library. i have found and deleted the unused dependencies
this results in a faster build and a smaller bundle size. 


Unused dependencies
- @types/express-handlebars
- chart.js
- lodash
- express-handlebars
- luxon


I have also added few other dependencies which i have used in the code 
added dependencies
- @types/jsonwebtoken
- jsonwebtoken
- compression
- bcrypt


## Containerization

adding `docker` is always fun and entertaining for me. there's a new `Dockerfile` paired with a `.dockerignore` to ship the code into a docker image.


## RUN

please note that `.env` is empty, and it needs to have entries to run.**DBURL** and **API_SECRET_KEY**.
provide these in a separate `.env` file before running the project.

after cloning the project, and configuring the env file, run the following commands in the project root directory.

```bash
$ docker build -t <any_name> ./
$ docker run -p <your_local_port>:3000 -v <static_path_to_your_env>:/app/.env -d <any_name>
```

please note that 3000 is the default configured port. you should use the configured port if you already supplied the `PORT` env variable in the separate `.env` file.

You can alternatively run the `npm run dev` to run the project without compiling it
or build it using `npm run build` then run it with `npm start`


## Other Ideas for Improving the Code
there are few other options that could be tweaked to shape this project into a better "production-ready" one.

- Logging Information by an Advanced Logger Service
- Unit and Integration Tests using Testing Frameworks
- Availability and Advanced Performance Tests 
