/**
 * @todo 
 * MANEJO DE USUARIOS
 * INDICAR QUE USUARIO A ENVIADO QUE MENSAJE -> CAMBIAR BD -> SI ERES TU QUE EL MENSAJE SALGA A LA DERECHA
 */


import express from "express"; 
import logger from "morgan";

import { Server } from "socket.io";
import {createServer} from "node:http"

import mysql from 'mysql2/promise';

import 'dotenv/config';

let resultsDatabase;

/**
 * @tutorial 
 * CONEXION A LA BASE DE DATOS LOCAL
 */
const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'admini',
    database: 'prueba',
    authPlugins: ['mysql_native_password'] // Add this line
});

/**
 * @tutorial 
 * CONEXION A LA BASE DE DATOS EN LA NUVE **RAILWAY**
 */
// const connection = await mysql.createConnection(
//     process.env.DATABASE_URL
// );

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
        const username = socket.handshake.auth.username ?? 'anonymous'

        result = await connection.query('INSERT INTO messages (user, content) VALUES (?,?);', [username, msg])
        io.emit("chat message", msg, result.lastInsertRowid, username)
    })
    
    if(!socket.recovered){
       const prueba = await query(socket.handshake.auth.serverOffset)
        try {
            prueba[0].forEach(row => {
                socket.emit( "chat message" , row.content, row.id, row.user)
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
async function query(variable){
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
    resultsDatabase = await connection.query( //->> ESTO DEVULEVE LA CONSULTA Y DATOS DE LA TABLA, --OJO AL MANEJAR LOS DATOS--
        'SELECT * FROM messages WHERE ID > ?;',[variable ?? 0]
    );
    return resultsDatabase
    } catch (err) {
    console.log(err);
    }
}