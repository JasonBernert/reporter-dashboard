# IN PRODUCTION

Sorry. Not quite ready yet...

# Reporter Dashboard

Reporter Dashboard brings all your data from the [Reporter App](http://www.reporter-app.com/) to the browser. The Reporter Dashboard ingests your data from either a Reporter App export or directly from Dropbox to mongoDB using the current [schema](https://gist.github.com/dbreunig/9315705#gistcomment-1191718). The API endpoints deliver basic things like a summary of the data, a month summary of your wake up, sleep, and daily data. From here the data is visualized with [D3](https://d3js.org/) on your dashboard. Customize the dashboard with your data to create new endpoints and new visualizations!

#### Always Up To Date: Reporter App → Dropbox → MongoDB
If you upload your data to dropbox, you can use  `dropbox-load.js` to load all existing data to the database or run the script on your server to always keep your dashboard up to date. First, you will need a `DROPBOX_TOKEN`. Find how to get all the needed environment variables below.

#### Private
User permissions stop anyone from seeing your personal data without, well, your permission. Reporter Dashboard requires a login to see anything from the app.

## Environment Variables

There are only a few variables you need to get up and running:
- `DATABASE` see [Setting Up The Database](#setting-up-the-database)
- `DROPBOX_TOKEN` learn how to get yours  [here](http://www.iperiusbackup.net/en/create-dropbox-app-get-authentication-token/)
- `SECRET` can be any any string
- `KEY` can be any any string

There are also a few you don't really need to worry about
- `PORT` defaults to 7777.
- `DROPBOX_KEY` and `DROPBOX_SECRET` are not needed for the app, but a place to store them just in case Dropbox adds official node support down the road.

## Setting Up The Database

For this project I set up mondoDB with [mLab](https://mlab.com/) to save some time. Here's how to  get your `DATABASE` variable, if you choose to do the same.

1. [Create and account](https://mlab.com/signup/)
2. [Add a new database](https://mlab.com/create/wizard) on AWS with the Sandbox plan.
3. Add a user
4. [Copy your URI](http://docs.mlab.com/connecting/#connect-string), replacing `<dbuser>:<dbpassword>` with your user info, into `variables.env` after `DATABASE=`.

## Loading Existing Data

There is a script called `load-data.js` that loads existing data into the database. First make sure your  database is up and running and the Snapshot model is up to date – the model has [changed in the past](https://gist.github.com/dbreunig/9315705#gistcomment-1191718).

#### From the Reporter App
1. From the Reporter App, export your data to JSON format.
2. Place the reporter-export.json file into the `/data` directory.
3. Run `node load-data`.

#### From Dropbox
1. Make sure you have your Dropbox developer token in `variables.env`.
3. Run `node dropbox-load`.

## Other
This project is used [hackathon-starter](https://github.com/sahat/hackathon-starter), a boilerplate for Node.js web applications.
