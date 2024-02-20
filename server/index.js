import express from "express"; 
import logger from "morgan";

import { Server } from "socket.io";
import {createServer} from "node:http"

import mysql from 'mysql2/promise';

const connection = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'admini',
    database: 'prueba',
    authPlugins: ['mysql_native_password'] // Add this line
});

async function getConnection() {
    try {
      return await pool.getConnection();
    } catch (error) {
      console.error('Error getting connection:', error);
      throw error; // Re-throw for proper error handling
    }
  }
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
    let connection;
    socket.on("disconnect", ()=>{
        console.log("user disconnected");
    })

    socket.on("chat message", async (msg)=>{
        let result
        connection = await getConnection();
        result = await connection.query('INSERT INTO messages (content) VALUES (?);', [msg])
        io.emit("chat message", msg, result.lastInsertRowid) 

    })
    
    if(!socket.recovered){
        try {
            const messagesResult = await connection.query('SELECT * FROM messages;');
            messagesResult.rows.forEach(row => {
                socket.emit( "chat message" , row["content"], row["id"])
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