/**
 * @todo 
 * MANEJO DE USUARIOS
 * INDICAR QUE USUARIO A ENVIADO QUE MENSAJE -> CAMBIAR BD -> SI ERES TU QUE EL MENSAJE SALGA A LA DERECHA
RECOGER LA SALA A LA CUAL SEN ENVIA LOS MENSAJES, MANEJAR QUIEN ENVIA EL MENSAJE, EN ESTE CASO DEBERIA DE SER EL USUARIO QUE ESTA LOGEADO

*/

import express from "express"; 
import logger from "morgan";
import path from 'path';


import { Server } from "socket.io";
import {createServer} from "node:http"

import mysql from 'mysql2/promise';

import 'dotenv/config';

import { methods as autentificador } from "./controllers/autentificador.js";
import { Console } from "console";

let resultsDatabase;

/**
 * @tutorial 
 * CONEXION A LA BASE DE DATOS LOCAL
 */
// const connection = await mysql.createConnection({
//     host: '127.0.0.1',
//     port: 3306,
//     user: 'root',
//     password: '',
//     database: 'prueba',
//     authPlugins: ['mysql_native_password'] // Add this line
// });

/**
 * @tutorial 
 * CONEXION A LA BASE DE DATOS EN LA NUVE **RAILWAY**
 */
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
const port = process.env.PORT ?? 3000;

const app = express()

//ASESTS --> /resources = 'ruta proporcionada' --> para que se vean los estilos en las plantillas
const staticPath = path.join(process.cwd(), '/webComponents/');
const staticPath2 = path.join(process.cwd(), '/cliente/');

app.use('/resources', express.static(staticPath));
app.use('/resources', express.static(staticPath2));

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

    socket.on("chat message", async (msg,username2,fecha,id_sala)=>{
        let result
        const username = socket.handshake.auth.username ?? 'anonymous'
        // const username2 = socket.handshake.auth.username2
        // result = await connection.query('INSERT INTO mensajes (id_usuarioEnvia, id_usuarioRecibe,contenido, id_sala) VALUES (?,?,?,?);', [username,username2, msg,id_sala])
        try {
            result = await connection.query('INSERT INTO mensajes (id_usuarioEnvia, id_usuarioRecibe, contenido, id_sala) VALUES (?,?,?,?);', [username, username2, msg, id_sala]);
        } catch (error) {
            console.error('Error al insertar mensaje:', error);
            // Maneja el error aquí, por ejemplo, enviando una respuesta de error o notificando al cliente
        }
        io.to(id_sala).emit("chat message", msg, result.lastInsertRowid,username, fecha)
    })
    
    socket.on("chat charge", async (username)=>{
        const prueba = await query(username[0], username[1],"0")
        try {
            prueba[0].forEach(row => {
                socket.emit( "chat message" , row.contenido, row.id_mensaje, row.id_usuarioEnvia, row.fecha_envio)
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

    // CONEXION A LA SALAS SOCKET.IO
    socket.on('solicitarSala', (idSala) => {
        // Unir al cliente a la sala especificada
        socket.join(idSala);

        console.log(`Cliente ${socket.id} se unió a la sala ${idSala}`);

        // Opcional: Enviar una respuesta al cliente confirmando la unión a la sala
        socket.emit('salaUnida', idSala);
    });
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
app.get('/decks', (req, res)=>{
    res.sendFile(process.cwd()+"/views/decks.html")
})
app.get('/login', (req, res)=>{
    res.sendFile(process.cwd()+"/cliente/login.html")
})
app.get('/register', (req, res)=>{
    res.sendFile(process.cwd()+"/cliente/register.html")
})

// LLAMADAS API DE LA BASE DE DATOS
app.post('/api/login', autentificador.login)
app.post('/api/register', autentificador.register)
app.post('/api/usuarios', autentificador.sacarUsuariosChat)
app.post('/api/usuarioExistente', autentificador.sacarUsuarios)
app.post('/api/crearMazo', autentificador.crearMazo)
app.post('/api/idSalaChat', autentificador.recuperarSala)
app.post('/api/ultimoIdChat', autentificador.ultimoIdChat)

server.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})

// Para mostrar los chats
async function query(idUser1,idUser2,variable){
    try {
        // CHECK A ROOM EXIST WHIT THE USERS
        resultsDatabase = await connection.query( //->> ESTO DEVULEVE LA CONSULTA Y DATOS DE LA TABLA, --OJO AL MANEJAR LOS DATOS--
            // "SELECT * FROM mensajes WHERE (id_usuarioEnvia = ? AND id_usuarioRecibe = ?) OR (id_usuarioEnvia = ? AND id_usuarioRecibe = ?) AND id_mensaje > ? ORDER BY fecha_envio",[idUser1,idUser2,idUser2,idUser1,variable ?? 0]
            "SELECT id_sala FROM salas_chat WHERE (id_usuario1 = ? AND id_usuario2 = ?) OR (id_usuario1 = ? AND id_usuario2 = ?)",[idUser1,idUser2,idUser2,idUser1]
        );
        // IF THERE IS NO ROOM WITH INTERACTING USERS, A NEW ROOM WILL BE CREATED
        let id_sala;
        
        if (resultsDatabase && resultsDatabase[0].length > 0 && resultsDatabase[0]) {
            id_sala = resultsDatabase[0][0].id_sala
        } else {
            resultsDatabase = await connection.query('INSERT INTO salas_chat (id_usuario1, id_usuario2) VALUES (?,?);', [idUser1, idUser2]);
            id_sala = resultsDatabase[0].insertId
        }
        // GET THE MESSAGES OF THAT ROOM
        resultsDatabase = await connection.query( //->> ESTO DEVULEVE LA CONSULTA Y DATOS DE LA TABLA, --OJO AL MANEJAR LOS DATOS--
            "SELECT * FROM mensajes WHERE id_sala = ? ORDER BY fecha_envio",[id_sala]
        );
        return resultsDatabase
    } catch (err) {
        console.log(err);
    }
}

