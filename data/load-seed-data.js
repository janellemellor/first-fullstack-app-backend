require('dotenv').config();
const pg = require('pg');
const Client = pg.Client;
// import seed data:
const data = require('./boba.js');
const types = require('./types.js');

run();

async function run() {
    const client = new Client(process.env.DATABASE_URL);

    try {
        await client.connect();
    
        const selectedTypes = await Promise.all(
            types.map(async type => {
                const result = await client.query(`
                    INSERT INTO types (type)
                    VALUES ($1)
                    RETURNING *;
                `,
                [type]);

                return result.rows[0];
            })
        );


        // "Promise all" does a parallel execution of async tasks
        await Promise.all(
            // map every item in the array data
            data.map(item => {
                const type = selectedTypes.find(type => {
                    return type.type === item.type;
                });
                console.log('type', type);
                console.log('item', item);
                

                // Use a "parameterized query" to insert the data,
                return client.query(`
                    INSERT INTO bobas (flavor, type_id, is_milk_tea, image, star_rating)
                    VALUES ($1, $2, $3, $4, $5);
                `,
                [item.flavor, type.id, item.is_milk_tea, item.image, item.star_rating]
                );
                // Don't forget to "return" the client.query promise!
            })
        );

        console.log('seed data load complete');
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }
    
}