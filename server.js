// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
// (add cors, pg, and morgan...)
const cors = require('cors');
const morgan = require('morgan');
const pg = require('pg');
const server = express();

console.log(process.env);
// Database Client
const Client = pg.Client;
// (create and connect using DATABASE_URL)
const client = new Client(process.env.DATABASE_URL);
client.connect();


// Application Setup
const app = express();
const PORT = process.env.PORT;
// (add middleware utils: logging, cors, static files from public)
// app.use(...)
app.use(morgan('dev'));
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// route to Boba API
app.get('/api/boba', async(req, res) => { 
    try {
        const result = await client.query(` 
        SELECT bobas.id "bobas_id", bobas.flavor, bobas.type_id, bobas.is_milk_tea, bobas.image, bobas.star_rating, types.type FROM bobas
        JOIN types
        ON bobas.type_id = types.id;   
        `);

        console.log(result.rows);
    
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
});

//post route to create a new boba
app.post('/api/boba', async(req, res) => {
    try {
        console.log(req.body);
        const result = await client.query(`
        INSERT INTO bobas (flavor, type_id, is_milk_tea, image, star_rating)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *;
        `,
        
        //pass values into an array to sanitize for SQL. VALUES $1...also is part of the sanitizing process.
        [req.body.flavor, req.body.type_id, req.body.is_milk_tea, req.body.image, req.body.star_rating]
        );

        //returns the first result of the query
        res.json(result.rows[0]);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});

// route to boba types API
app.get('/api/types', async(req, res) => {
    try {
        const result = await client.query(`
            SELECT *
            FROM types
        `);

        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});

// http method and path...


// Start the server

app.listen(PORT, () => {
    console.log('server running on PORT', PORT);
});

//set up export for testing
module.exports = { server: server };