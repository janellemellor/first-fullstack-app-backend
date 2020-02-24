// load connection string from .env
require('dotenv').config();
// "require" pg (after `npm i pg`)
const pg = require('pg');
// Use the pg Client
const Client = pg.Client;
// **note:** you will need to create the database!

// async/await needs to run in a function
run();

async function run() {
    // make a new pg client to the supplied url
    const client = new Client(process.env.DATABASE_URL);

    try {
        // initiate connecting to db
        await client.connect();
    
        // run a query to create tables
        await client.query(`
        CREATE TABLE bobas (
            id SERIAL PRIMARY KEY NOT NULL,
            flavor VARCHAR(256) NOT NULL,
            type VARCHAR(256) NOT NULL,
            is_milk_tea BOOLEAN NOT NULL,
            image VARCHAR(256) NOT NULL,
            star_rating INTEGER NOT NULL
            );
        
        CREATE TABLE types (
            id SERIAL PRIMARY KEY NOT NULL, 
            type VARCHAR(256) NOT NULL
            );
        `);



        console.log('create tables complete');
    }
    catch (err) {
        // problem? let's see the error...
        console.log(err);
    }
    finally {
        // success or failure, need to close the db connection
        client.end();
    }
    
}