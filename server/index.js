// IMPORTS DEPENDENCIES
// DEPENDENCIAS NECESARIAS PARA EL FUNCIONAMIENTO DE LA APLICACION
import express from "express"; 
import cookieParser from 'cookie-parser';
import logger from "morgan";
import path from 'path';


import { Server } from "socket.io";
import {createServer} from "node:http"

import mysql from 'mysql2/promise';

import 'dotenv/config';

// IMPORTS DE FUNCIONES DE OTROS ARCHIVOS, LOS CUALES SE ENCARGAN DE REALIZAR LAS PETICIONES A LA BASE DE DATOS
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

// VERIFICACION DE LA CONEXION A LA BASE DE DATOS, SABER SI SE A REALIZADO CORRECTAMENTE LA CONECXION
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
// DARLE UN PUERTO LIBRE AL LADO DEL SERVIDOR AL DESPLEGARSE, Y SI NO ENCUENTRA UN PUERTO LIBRE LE ASIGNA EL PUERTO :3000
const port = process.env.PORT ?? 80;

const app = express()

// STATIC PATHS, HACER QUE LOS ARCHIVOS ESTATICOS FUNCIONEN
const staticPath = path.join(process.cwd(), '/webComponents/');
const staticPath2 = path.join(process.cwd(), '/cliente/');

app.use('/resources', express.static(staticPath));
app.use('/resources', express.static(staticPath2));
app.use(express.static(path.join(process.cwd(), 'public')));

// CREACION DEL SERVIDOR
const server = createServer(app)

// CREACION DEL SOCKET.IO EN EL SERVIDOR, PARA PODER REALIZAR LA CONEXION ENTRE EL SERVIDOR Y EL CLIENTE Y CONFIGURADO PARA QUE SEPA EN QUE MOMENTO EL USUARIO SE CONECTA Y DESCONECTA
const io = new Server(server, {
    connectionStateRecovery: {
    }
});

// CONNECTION TO THE SOCKET.IO ROOMS
// HANDLE CONNECTIONS, DISCONNECTIONS, AND MESSAGES
// COMPRUEBA SI EL USUARIO SE CONECTA O DESCONECTA AL SERVIDOR, Y SI SE ENVIA UN MENSAJE
io.on("connection", async (socket) =>{
    console.log("a user has conected!!")
    socket.on("disconnect", ()=>{
        console.log("user disconnected");
    })
    // MANEJO DE LOS MENSAJES QUE ENVIA EL CLIENTE Y SE INSERTAN DENTRO DE LA BBDD
    
    socket.on("chat message", async (msg,username2,fecha,id_sala)=>{
        let result
        const username = socket.handshake.auth.username ?? 'anonymous'
        // result = await connection.query('INSERT INTO mensajes (id_usuarioEnvia, id_usuarioRecibe,contenido, id_sala) VALUES (?,?,?,?);', [username, username2, msg, id_sala])
        try {
            result = await connection.query('INSERT INTO mensajes (id_usuarioEnvia, contenido, id_sala) VALUES (?,?,?);', [username, msg, id_sala]);
        } catch (error) {
            console.error('Error al insertar mensaje:', error);
        }
        // EMITE EL MENSAJE A TODOS LOS USUARIOS QUE ESTEN EN LA SALA, PARA QUE SE LES MUESTRE EL MENSAJE
        console.log(id_sala)
        io.to(id_sala).emit("chat message", msg, result.lastInsertRowid,username, fecha)

        io.to(username2).emit("notification", msg, result.lastInsertRowid,username, fecha)

    })
    // AL CARGAR EN ESPECIFICO UNA SALE QUE SE MUESTREN TODOS LOS MENSAJES QUE HAY EN ELLA
    socket.on("chat charge", async (username)=>{
        const prueba = await query(username[0], username[1],"0")
        try {
            prueba[0][0].forEach(row => {
                socket.emit( "chat message" , row.contenido, row.id_mensaje, row.id_usuarioEnvia, row.fecha_envio)
            });
        } catch (error) {
            console.error(error)
        }
    })

    // CONNECTION TO THE SOCKET.IO ROOMS
    socket.on('solicitarSala', (idSala, user) => {
        // Join the client to the specified room
        socket.join(user);
        socket.join(idSala);
        console.log(`Cliente ${socket.id} se unió a la sala ${idSala} - user: ${user}`);
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
    res.sendFile(process.cwd()+"/cliente/login.html")
})
app.get('/home',(req, res)=>{
    res.sendFile(process.cwd()+"/cliente/home.html")
})
app.get('/homeAdmin',(req, res)=>{
    res.sendFile(process.cwd()+"/cliente/homeAdmin.html")
})
app.get('/chat', (req, res)=>{
    res.sendFile(process.cwd()+"/cliente/chat.html")
})
app.get('/deckbuilder', (req, res)=>{
    res.sendFile(process.cwd()+"/cliente/deckBuilder copy.html")
})
app.get('/decks', (req, res)=>{
    res.sendFile(process.cwd()+"/cliente/decks.html")
})
app.get('/login', (req, res)=>{
    res.sendFile(process.cwd()+"/cliente/login.html")
})
app.get('/register', (req, res)=>{
    res.sendFile(process.cwd()+"/cliente/register.html")
})
app.get('/eventos', (req, res)=>{
    res.sendFile(process.cwd()+"/cliente/torneos.html")
})
app.get('/torneoAdmin', (req, res)=>{
    res.sendFile(process.cwd()+"/cliente/torneosAdmin.html")
})
app.get('/collection', (req, res)=>{
    res.sendFile(process.cwd()+"/cliente/collection.html")
})
app.get('/perfil', (req, res)=>{
    res.sendFile(process.cwd()+"/cliente/perfil.html")
})
app.get('/trade', (req, res)=>{
    res.sendFile(process.cwd()+"/cliente/tradeCards.html")
})
app.get('/cartasOfreces', (req, res)=>{
    res.sendFile(process.cwd()+"/cliente/cartasOfreces.html")
})
app.get('/cartasBuscas', (req, res)=>{
    res.sendFile(process.cwd()+"/cliente/cartasBuscas.html")
})
app.get('/logout', (req, res)=>{
    res.sendFile(process.cwd()+"/cliente/login.html")
})
app.get('/api/verify/:token', async (req, res) => {
    const { token } = req.params;
    try {
        // Intenta llamar a la función verifyUsuario
        const response = await autentificador.verifyUsuario(token);
        console.log(response);
        // Si la verificación es exitosa, envía el archivo login.html
        console.log(process.cwd()+"/cliente/login.html")
        res.redirect('/login');
        // res.sendFile(path.join(process.cwd(), 'cliente', 'login.html'));

    } catch (error) {
        // Maneja el error
        if (error.status === 404) {
            // La función verifyUsuario no está definida o no se encontró el usuario
            console.error('Usuario no encontrado:', error);
            res.status(404).json({ message: 'Usuario no encontrado.' });
        } else {
            // Otro tipo de error
            console.error('Error al verificar el token:', error);
            res.status(500).json({ message: 'Error al verificar el token.' });
        }
    }
});


//API calls to the database
// LLAMADAS EN ESPECIFICO PARA COMPROBAR QUE EL USUARIO LOGEADO TIENE ACCESO A LA RUTA PROTEGIDA
app.get('/api/protectedRoute', autentificador.verifyToken, async (req, res) => {
    let userData = req.user;
    res.status(200).json({ message: 'Ruta protegida accesible', user: userData});
})
// CALLS RELATED TO THE USER
app.post('/api/login', autentificador.login)
app.post('/api/register', autentificador.register)
app.post('/api/usuarios', autentificador.sacarUsuariosChat)
app.post('/api/registerEmpresa', autentificador.registerEmpresa)
app.post('/api/usuarioExistente', autentificador.sacarUsuarios)
app.post('/api/crearMazo', autentificador.crearMazo)
app.post('/api/eliminarmazo', autentificador.eliminarmazo)
app.post('/api/recuperarMazosUsuario', autentificador.recuperarMazosUsuario)
app.post('/api/idSalaChat', autentificador.recuperarSala)
app.post('/api/ultimoIdChat', autentificador.ultimoIdChat)
app.post('/api/salasUsuario', autentificador.salasUsuario)
app.post('/api/registrarEvento', autentificador.registrarEvento)
app.post('/api/cambiarContraseña', autentificador.registrarEvento)

// CALLS RELATED TO THE GAME CARDS
app.post('/api/cartasEnPosesion', apiDigimon.cartasEnPosesion)
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
app.post('/api/cartasEnLaColeccion', apiDigimon.cartasColeccionUsuarioAllData)
app.post('/api/cantidadTorneosActivos', apiDigimon.cantidadTorneosActivos)
app.post('/api/cantidadTorneosApuntados', apiDigimon.cantidadTorneosApuntados)




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

        return [resultsDatabase, id_sala]
    } catch (err) {
        console.log(err);
    }
}

