import express from "express"; 
import logger from "morgan";

import { Server } from "socket.io";
import {createServer} from "node:http"

import mysql from 'mysql2/promise';
let resultsDatabase;

const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'admini',
    database: 'prueba',
    authPlugins: ['mysql_native_password'] // Add this line
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
const port = process.env.PORT ?? 3000;

const app = express()
const server = createServer(app)
const io = new Server(server, {
    connectionStateRecovery: {
        // maxDisconnectionDuration
    }
});

io.on("connection", async (socket) =>{
    console.log("a user has conected!!")

    socket.on("disconnect", ()=>{
        console.log("user disconnected");
    })

    socket.on("chat message", async (msg)=>{
        let result
        result = await connection.query('INSERT INTO messages (content) VALUES (?);', [msg])
        io.emit("chat message", msg, result.lastInsertRowid)
    })
    
    if(!socket.recovered){
       const prueba = await query()
        try {
            prueba[0].forEach(row => {
                console.log(row.id)
                socket.emit( "chat message" , row.content, row.id)
            });
        } catch (error) {
            console.error(error)
        }
    }
})

app.use(logger('dev'))

app.get('/', (req, res)=>{
    res.sendFile(process.cwd()+"/cliente/index.html")
})

server.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})


// Get the client
async function query(){
    // Create the connection to database
    // const connection = await mysql.createConnection({
    //     host: 'localhost',
    //     port: 3306,
    //     user: 'root',
    //     password: 'admini',
    //     database: 'prueba',
    //     authPlugins: ['mysql_native_password'] // Add this line
    // });

    // A simple SELECT query
    try {
    resultsDatabase = await connection.query(
        'SELECT * FROM messages;'
    );
    return resultsDatabase
    } catch (err) {
    console.log(err);
    }
}