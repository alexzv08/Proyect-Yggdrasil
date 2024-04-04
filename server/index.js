/**
 * @todo 
 * MANEJO DE USUARIOS
 * INDICAR QUE USUARIO A ENVIADO QUE MENSAJE -> CAMBIAR BD -> SI ERES TU QUE EL MENSAJE SALGA A LA DERECHA
 */


import express from "express"; 
import logger from "morgan";
import path from 'path';


import { Server } from "socket.io";
import {createServer} from "node:http"

import mysql from 'mysql2/promise';

import 'dotenv/config';

import { methods as autentificador } from "./controllers/autentificador.js";

let resultsDatabase;

/**
 * @tutorial 
 * CONEXION A LA BASE DE DATOS LOCAL
 */
const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
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

//ASESTS --> /resources = 'ruta proporcionada' --> para que se vean los estilos en las plantillas
const staticPath = path.join(process.cwd(), '/webComponents/');
const staticPath2 = path.join(process.cwd(), '/cliente/');

app.use('/resources', express.static(staticPath));
app.use('/resources', express.static(staticPath2));

console.log(staticPath)

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

    socket.on("chat message", async (msg,username2,fecha)=>{
        let result
        const username = socket.handshake.auth.username ?? 'anonymous'
        // const username2 = socket.handshake.auth.username2
        result = await connection.query('INSERT INTO mensajes (id_usuarioEnvia, id_usuarioRecibe,contenid) VALUES (?,?,?);', [username,username2, msg])
        console.log(fecha)
        io.emit("chat message", msg, result.lastInsertRowid,username, fecha)
        
    })
    
    socket.on("chat charge", async (username)=>{
        // console.log("cargando chat")
        // console.log(username[0])

        const prueba = await query(username[0], username[1],"0")
        // console.log(prueba)
        try {
            prueba[0].forEach(row => {
                socket.emit( "chat message" , row.contenid, row.id_mensaje, row.id_usuarioEnvia, row.fecha_envio)
            });
        } catch (error) {
            console.error(error)
        }
    })


    // if(!socket.recovered){
    //     console.log(socket.handshake.auth)
    //     const prueba = await query(socket.handshake.auth.username,socket.handshake.auth.username2,socket.handshake.auth.serverOffset)
    //     try {
    //         prueba[0].forEach(row => {
    //             socket.emit( "chat message" , row.contenid, row.id_mensaje, row.id_usuarioEnvia)
    //         });
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }
})

// configuracion
app.use(express.static(process.cwd()+"/cliente"))

app.use(express.json())
app.use(logger('dev'))

// ESTO PARA QUE SE VEA EL CHAT SOLO
app.get('/', (req, res)=>{
    res.sendFile(process.cwd()+"/cliente/login.html")

})
app.get('/home', (req, res)=>{
    res.sendFile(process.cwd()+"/cliente/home.html")
})
app.get('/chat', (req, res)=>{
    res.sendFile(process.cwd()+"/cliente/chat.html")
})
app.get('/deckbuilder', (req, res)=>{
    res.sendFile(process.cwd()+"/cliente/deckBuilder.html")
})
app.get('/login', (req, res)=>{
    res.sendFile(process.cwd()+"/cliente/login.html")
})
app.get('/register', (req, res)=>{
    res.sendFile(process.cwd()+"/cliente/register.html")
})
app.post('/api/login', autentificador.login)
app.post('/api/register', autentificador.register)
app.post('/api/usuarios', autentificador.sacarUsuariosChat)

server.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})


// Para mostrar los chats
async function query(idUser1,idUser2,variable){
    // A simple SELECT query
    try {
        console.log(idUser1,idUser2,variable)
        resultsDatabase = await connection.query( //->> ESTO DEVULEVE LA CONSULTA Y DATOS DE LA TABLA, --OJO AL MANEJAR LOS DATOS--
            // 'SELECT * FROM mensajes WHERE id_mensaje > ? and ;',[variable ?? 0]
            "SELECT * FROM mensajes WHERE (id_usuarioEnvia = ? AND id_usuarioRecibe = ?) OR (id_usuarioEnvia = ? AND id_usuarioRecibe = ?) AND id_mensaje > ? ORDER BY fecha_envio",[idUser1,idUser2,idUser2,idUser1,variable ?? 0]
        );
    return resultsDatabase
    } catch (err) {
        console.log(err);
    }
}

