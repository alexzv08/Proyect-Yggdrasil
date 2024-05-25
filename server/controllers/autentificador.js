import mysql from 'mysql2/promise';
import bcryptjs from 'bcryptjs';

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
// REQUESTS LOGIN
async function login(req, res){
    if(!req.body.user || !req.body.pass){
        return res.status(400).send({status: "Error", message: "Campos vacios"})
    }
    try {
        let [result, data] = await connection.query(
            'SELECT * FROM usuarios WHERE (usuario LIKE ? OR email LIKE ?) AND password LIKE ?;',[req.body.user,req.body.user, await saltPassword(req.body.pass)]
            );
        return result.length === 0 ?  res.status(400).send({status: "Error", message: "Datos incorrectos"}) : res.status(200).send({status: "OK", message: "Datos correctos", redirect:"/"});
    } catch (err) {
        return res.status(400).send({status: "Error", message: "Error en el login"})
    }
}
// REQUESTS REGISTER
async function register(req, res){
    if(!req.body.user || !req.body.pass){
        return res.status(400).send({status: "Error", message: "Campos vacios"})
    }
    try {
        if(isValidEmail(req.body.email)){

            let [result, data] = await connection.query(
            'SELECT * FROM usuarios WHERE (usuario LIKE ? OR email LIKE ?);',[req.body.user, req.body.email]
            );
            if(result.length > 0){
                return res.status(400).send({status: "Error", message: "Usuario ya existe"});
            }else{
                
                let result = await connection.query(
                'insert into usuarios (usuario,password,email) values (?,?,?);',[req.body.user, await saltPassword(req.body.pass),req.body.email]
                );
                return res.status(201).send({status: "OK", message: "Usuario registrado", redirect:"/"})
            }
        }else{
            return res.status(400).send({status: "Error", message: "Email erroneo"});
        }

    } catch (err) {
        console.log(err)
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

    let [result, data] = await connection.query(
            'SELECT id_sala,CASE WHEN id_usuario1 = ? THEN id_usuario2 ELSE id_usuario1 END AS usuario_contrario FROM salas_chat WHERE (id_usuario1 = ? OR id_usuario2 = ?);',[req.body.user,req.body.user,req.body.user]
        );
    res.status(201).send({status: "OK", result: result})
    // 'SELECT * FROM chatRooms WHERE (id_usuario_1 like ? or id_usuario_2 like ?)',[req.body.user,req.body.user]
} 
// FUNCTION TO SHOW THE LAST CHAT ROOM ID
async function ultimoIdChat(req, res){
    let result = await connection.query(
            // 'SELECT MAX(id_sala) AS ultimo_id_sala FROM salas_chat;'
            'INSERT INTO salas_chat (id_usuario1, id_usuario2) VALUES (?,?);', [req.body.user1, req.body.user2]
        );
    res.status(201).send({status: "OK", result: result[0].insertId})
    // 'SELECT * FROM chatRooms WHERE (id_usuario_1 like ? or id_usuario_2 like ?)',[req.body.user,req.body.user]
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
        // "SELECT * FROM mensajes WHERE (id_usuarioEnvia = ? AND id_usuarioRecibe = ?) OR (id_usuarioEnvia = ? AND id_usuarioRecibe = ?) AND id_mensaje > ? ORDER BY fecha_envio",[idUser1,idUser2,idUser2,idUser1,variable ?? 0]
        "SELECT id_sala FROM salas_chat WHERE (id_usuario1 = ? AND id_usuario2 = ?) OR (id_usuario1 = ? AND id_usuario2 = ?)",[req.body.user1,req.body.user2,req.body.user2,req.body.user1]
    );
    res.status(200).send({status: "OK", result: result})
}
// REQUESTS FOR CREATE DECK
async function crearMazo(req, res){
    // AÑADIR EL MAZO
    // Y RECOGER LA ID DE ESE MAZO AL INSERTAR PARA CUANDO SE REDIRECCIONA TENERLO GUARDADO
    let result = await connection.query(
    'insert into mazos (id_usuario,nombre_mazo) values (?,?);',[req.body.user, req.body.nombre]
    );
    return res.status(201).send({status: "OK", result: result, message: "Mazo registrado correctamente", redirect:"/deckBuilder"})
} 
// REQUESTS FOR SHOW DECKS FOR A USER
async function recuperarMazosUsuario(req, res){
    // HAY QUE AÑADIR UN CAMPO A LA TABLA PARA PONER EL NOMBRE DEL MAZO
    // AÑADIR EL MAZO
    // Y RECOGER LA ID DE ESE MAZO AL INSERTAR PARA CUANDO SE REDIRECCIONA TENERLO GUARDADO
    // sacar la cantidad total de cartas que tiene el mazo
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
    ultimoIdChat
}




