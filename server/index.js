// IMPORTS DEPENDENCIES
import express from "express"; 
import cookieParser from 'cookie-parser';
import logger from "morgan";
import path from 'path';


import { Server } from "socket.io";
import {createServer} from "node:http"

import mysql from 'mysql2/promise';

import 'dotenv/config';

import { methods as autentificador } from "./controllers/autentificador.js";
import { methods as apiDigimon } from "./controllers/apiDigimon.js";

let resultsDatabase;

// DATABASE CONNECTION
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
// SERVER CONFIGURATION
const port = process.env.PORT ?? 3000;

const app = express()

const staticPath = path.join(process.cwd(), '/webComponents/');
const staticPath2 = path.join(process.cwd(), '/cliente/');

app.use('/resources', express.static(staticPath));
app.use('/resources', express.static(staticPath2));

const server = createServer(app)
const io = new Server(server, {
    connectionStateRecovery: {
    }
});

// CONNECTION TO THE SOCKET.IO ROOMS
// HANDLE CONNECTIONS, DISCONNECTIONS, AND MESSAGES
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
            result = await connection.query('INSERT INTO mensajes (id_usuarioEnvia, contenido, id_sala) VALUES (?,?,?);', [username, msg, id_sala]);
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

    // CONNECTION TO THE SOCKET.IO ROOMS
    socket.on('solicitarSala', (idSala) => {
        // Join the client to the specified room
        socket.join(idSala);

        console.log(`Cliente ${socket.id} se unió a la sala ${idSala}`);

        // Optional: Send a response to the client confirming the room join
        socket.emit('salaUnida', idSala);
    });
})

// configuracion
app.use(express.static(process.cwd()+"/cliente"))
app.use(cookieParser());
app.use(express.json())
app.use(logger('dev'))

//Redirection to the different pages of the application

// añadir la validacion de la cookie antes de validar la ruta, 
// si no es correcto redireccionar a login
app.get('/', (req, res)=>{
    console.log(req.cookies);
    res.sendFile(process.cwd()+"/cliente/login.html")
    
    // const isValid = verificarCookie(sessionCookie);
    // if (isValid) {
    //     res.send('Acceso concedido');
    // } else {
    //     res.status(403).send('Acceso denegado');
    // }
})
app.get('/home', (req, res)=>{
    console.log(req.cookies);

    res.sendFile(process.cwd()+"/cliente/home.html")
})
app.get('/chat', (req, res)=>{
    console.log(req.cookies);

    res.sendFile(process.cwd()+"/cliente/chat.html")
})
app.get('/deckbuilder', (req, res)=>{
    console.log(req.cookies);

    res.sendFile(process.cwd()+"/cliente/deckBuilder copy.html")
})
app.get('/decks', (req, res)=>{
    console.log(req.cookies);

    res.sendFile(process.cwd()+"/cliente/decks.html")
})
app.get('/login', (req, res)=>{
    console.log(req.cookies);

    res.sendFile(process.cwd()+"/cliente/login.html")
})
app.get('/register', (req, res)=>{
    console.log(req.cookies);

    res.sendFile(process.cwd()+"/cliente/register.html")
})
app.get('/collection', (req, res)=>{
    console.log(req.cookies);

    res.sendFile(process.cwd()+"/cliente/collection.html")
})

//API calls to the database
app.post('/api/login', autentificador.login)
app.post('/api/register', autentificador.register)
app.post('/api/usuarios', autentificador.sacarUsuariosChat)
app.post('/api/usuarioExistente', autentificador.sacarUsuarios)
app.post('/api/crearMazo', autentificador.crearMazo)
app.post('/api/recuperarMazosUsuario', autentificador.recuperarMazosUsuario)
app.post('/api/idSalaChat', autentificador.recuperarSala)
app.post('/api/ultimoIdChat', autentificador.ultimoIdChat)
app.post('/api/filtroCartas', apiDigimon.filtroCartas)
app.post('/api/listaColecciones', apiDigimon.listaColecciones)
app.post('/api/anadirAColeccion', apiDigimon.añadirAColeccion)
app.post('/api/updateCartaColeccion', apiDigimon.updateCartaColeccion)
app.post('/api/eliminarCartaColeccion', apiDigimon.eliminarCartaColeccion)
app.post('/api/cartasColeccionusuario', apiDigimon.cartasColeccionUsuario)
app.post('/api/insertCartaMazo', apiDigimon.insertCartaMazo)
app.post('/api/updateCartaMazo', apiDigimon.updateCartaMazo)
app.post('/api/removeCartaMazo', apiDigimon.removeCartaMazo)
app.post('/api/cartasMazo', apiDigimon.cartasMazo)
app.post('/api/baciarMazo', apiDigimon.baciarMazo)

//Know which port is listening
server.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})
async function verificarCookie(sessionCookie){

}
// Function to handle user messages
// This JavaScript function query fetches chat messages between two users. 
// It first checks if a chat room exists between the users, if not, it creates one. 
// Then, it retrieves all messages from that room, ordered by the message send date. 
// Any errors during this process are caught and logged.
async function query(idUser1,idUser2,variable){
    try {
        // CHECK A ROOM EXIST WHIT THE USERS
        resultsDatabase = await connection.query(
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
        resultsDatabase = await connection.query(
            "SELECT * FROM mensajes WHERE id_sala = ? ORDER BY fecha_envio",[id_sala]
        );
        return resultsDatabase
    } catch (err) {
        console.log(err);
    }
}

