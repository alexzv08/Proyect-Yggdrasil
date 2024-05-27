// DEPENDENCIAS NECESARIAS PARA EL FUNCIONAMIENTO DE LA APLICACION
import mysql from 'mysql2/promise';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    } else {
      console.log('Connected to database successfully!');
    }
});
// CLAVE SECREATA PARA EL TOKEN DEL USUARIO
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

// REQUESTS LOGIN
// FUNCION PARA REALIZAR EL LOGIN DEL USUARIO
async function login(req, res){
    console.log(req.body)
    // SI LOS CAMPOS ESTAN VACIOS SALTA UN ALERT
    if(!req.body.user || !req.body.pass){
        return res.status(400).send({status: "Error", message: "Campos vacios"})
    }
    try {
        // PETICION A LA BASE DE DATOS PARA COMPROBAR QUE EL USUARIO EXISTE EN LA APLICACION
        let [result, data] = await connection.query(
            'SELECT * FROM usuarios WHERE (usuario LIKE ? OR email LIKE ?) AND password LIKE ?;',[req.body.user,req.body.user, await saltPassword(req.body.pass)]
            );
        // SI NO EXISTE EL USUARIO EN LA BASE DE DATOS SALTA UN ALERT
        if(result.length === 0){
            return res.status(400).send({status: "Error", message: "Datos incorrectos"})
        }
        // SI EXISTE EL USUARIO SE CREA UN TOKEN PARA EL USUARIO Y SE REDIRECCIONA A LA PAGINA DE INICIO
        const token = jwt.sign({ id:req.body.user, username: req.body.user }, SECRET_KEY, { expiresIn: '100h' });
        return res.status(200).send({status: "OK", message: "Datos correctos", token: token, datos: result, redirect: "/home"});
    } catch (err) {
        console.log(err)
        return res.status(400).send({status: "Error", message: "Error en el login"})
    }
}

// Middleware verification token JWT
function verifyToken(req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).send('Acceso Denegado');

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Token no válido');
    }
}

// REQUESTS REGISTER
async function register(req, res){
    if(!req.body.user || !req.body.pass){
        // SI LOS CAMPOS ESTAN VACIOS SALTA UN ALERT
        return res.status(400).send({status: "Error", message: "Campos vacios"})
    }
    try {
        // COMPRUEBO QUE EL EMAIL INTRODUCIDO TIENE UN FORMATO VALIDO
        if(isValidEmail(req.body.email)){
            // COMPRUEBO QUE EL USUARIO NO EXISTA EN LA BASE DE DATOS
            let [result, data] = await connection.query(
            'SELECT * FROM usuarios WHERE (usuario LIKE ? OR email LIKE ?);',[req.body.user, req.body.email]
            );
            if(result.length > 0){
                return res.status(400).send({status: "Error", message: "Usuario ya existe"});
            }else{
                // SI NO EXISTE EL USUARIO SE REGISTRA EN LA BASE DE DATOS
                let result = await connection.query(
                'insert into usuarios (usuario,password,email) values (?,?,?);',[req.body.user, await saltPassword(req.body.pass),req.body.email]
                );
                return res.status(201).send({status: "OK", message: "Usuario registrado", redirect:"/"})
            }
        }else{
            return res.status(400).send({status: "Error", message: "Email erroneo"});
        }

    } catch (err) {
        res.status(400).send({status: "Error", message: "Error en el register", error: err})
    }
}
// FUNCTION TO HASH PASSWORD
async function saltPassword(pass){
    const staticSalt = '$2a$10$abcdefghijklmnopqrstuvwxyz123456';
    const hashPassword = await bcryptjs.hash(pass, staticSalt)
    return hashPassword
}
// FUNCTION TO VALIDATE EMAIL
function isValidEmail(email) {
    // Regular expression for checking email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
// REQUESTS FOR SHOW CHATS IN A ROOM
async function sacarUsuariosChat(req, res){
    // PETICION PARA RECUPERAR TODOS LOS USUARIOS QUE TIENEN UN CHAT ACTIVO CON EL USUARIO
    let [result, data] = await connection.query(
            'SELECT id_sala,CASE WHEN id_usuario1 = ? THEN id_usuario2 ELSE id_usuario1 END AS usuario_contrario FROM salas_chat WHERE (id_usuario1 = ? OR id_usuario2 = ?);',[req.body.user,req.body.user,req.body.user]
        );
    console.log(req.body.user)
    console.log(result)
    console.log(data)
    res.status(201).send({status: "OK", result: result})
} 
// FUNCTION TO SHOW THE LAST CHAT ROOM ID
async function ultimoIdChat(req, res){
    let result = await connection.query(
            'INSERT INTO salas_chat (id_usuario1, id_usuario2) VALUES (?,?);', [req.body.user1, req.body.user2]
        );
    res.status(201).send({status: "OK", result: result[0].insertId})
} 
// REQUESTS FOR SHOW USERS WHIT HAVE CHAT
async function sacarUsuarios(req, res){
    let [result, data] = await connection.query(
            'SELECT usuario FROM usuarios WHERE usuario=?',[req.body.user]
            );
    if(result.length <= 0){
        res.status(204).send({status: "Error", result: result})
    }else{
        let [result, data] = await connection.query(
            'SELECT usuario FROM usuarios WHERE usuario=?',[req.body.user]
            );
        res.status(200).send({status: "OK", result: result})
    }
} 

// FUCTION TO SHOW THE CHATS IN THE ROOM
async function recuperarSala(req, res){
    let [result, data] = await connection.query(
        "SELECT id_sala FROM salas_chat WHERE (id_usuario1 = ? AND id_usuario2 = ?) OR (id_usuario1 = ? AND id_usuario2 = ?)",[req.body.user1,req.body.user2,req.body.user2,req.body.user1]
    );
    res.status(200).send({status: "OK", result: result})
}
// REQUESTS FOR CREATE DECK
async function crearMazo(req, res){
    let result = await connection.query(
    'insert into mazos (id_usuario,nombre_mazo) values (?,?);',[req.body.user, req.body.nombre]
    );
    return res.status(201).send({status: "OK", result: result, message: "Mazo registrado correctamente", redirect:"/deckBuilder"})
} 
// REQUESTS FOR SHOW DECKS FOR A USER
async function recuperarMazosUsuario(req, res){
    let result = await connection.query(
        `SELECT m.id_mazo, m.id_usuario, m.nombre_mazo, m.fecha,
                    IFNULL(SUM(mc.cantidad), 0) AS total_cartas
             FROM mazos m
             LEFT JOIN mazo_cartas mc ON m.id_mazo = mc.id_mazo
             WHERE m.id_usuario = ?
             GROUP BY m.id_mazo, m.id_usuario, m.nombre_mazo`,[req.body.user]
    );
    return res.status(200).send({status: "OK", result: result})
} 

export const methods = {
    login, 
    register, 
    sacarUsuariosChat,
    crearMazo, 
    recuperarMazosUsuario, 
    sacarUsuarios, 
    recuperarSala, 
    ultimoIdChat,
    verifyToken
}




