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
const client = new Client(process.env.Database_URL);
client.connect();


// Application Setup
const app = express();
const PORT = process.env.PORT;
// (add middleware utils: logging, cors, static files from public)
// app.use(...)
app.use(morgan('dev'));
app.use(cors());
app.use(express.static('public'));

// API Routes
app.get('/api/boba', async(req, res) => { 
    try {
        const result = await client.query(` 
        SELECT
            id,
            flavor, 
            type, 
            is_milk_tea, 
            url, 
            star_rating 
        FROM bobas;    
        `);

        console.log(result.rows);
    
        res.json(result.rows);
    } catch (err) {
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