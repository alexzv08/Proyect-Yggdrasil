import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({

    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    authPlugins: process.env.DB_AUTH_PLUGINS
});

connection.connect((error) => {
    if (error) {
      console.error('Connection error:', error);
      // Implement appropriate error handling, e.g., retry, abort, etc.
    } else {
      console.log('Connected to database successfully!');
      // Perform database operations here using connection.query(...)
    }
});


async function filtroCartas(req, res){
    let result = await connection.query(
        `${req.body.sql}`
    );
    return res.status(200).send({status: "OK", result: result})
} 



export const methods = {
    filtroCartas
}