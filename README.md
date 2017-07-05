# Reporter Dashboard

What is it?

#### Always Up To Date
Reporter App -> Dropbox -> MongoDB

#### Private
User permissions stop anyone from seeing your personal data without, well, your permission.

## Setting Up The Database

## Loading Existing Data

There is a script called `load-data.js` that loads existing data into the database. First make sure your  database is up and running and the Snapshot model is up to date – the model has [changed in the past](https://gist.github.com/dbreunig/9315705#gistcomment-1191718).

1. From the Reporter App, export your data to JSON format.
2. Place the reporter-export.json file into the data directory.
3. Run `node load-data`.

## Other
This project is used [hackathon-starter](https://github.com/sahat/hackathon-starter), a boilerplate for Node.js web applications.
