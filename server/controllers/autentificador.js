import mysql from 'mysql2/promise';
import bcryptjs from 'bcryptjs';

// const connection = await mysql.createConnection({
//     host: '127.0.0.1',
//     port: 3306,
//     user: 'root',
//     password: '',
//     database: 'prueba',
//     authPlugins: ['mysql_native_password'] // Add this line
// });
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

async function login(req, res){
    if(!req.body.user || !req.body.pass){
        return res.status(400).send({status: "Error", message: "Campos vacios"})
    }
    try {
        let [result, data] = await connection.query( //->> ESTO DEVULEVE LA CONSULTA Y DATOS DE LA TABLA, --OJO AL MANEJAR LOS DATOS--
            'SELECT * FROM usuarios WHERE (usuario LIKE ? OR email LIKE ?) AND password LIKE ?;',[req.body.user,req.body.user, await saltPassword(req.body.pass)]
            );
        return result.length === 0 ?  res.status(400).send({status: "Error", message: "Datos incorrectos"}) : res.status(200).send({status: "OK", message: "Datos correctos", redirect:"/"});
    } catch (err) {
        return res.status(400).send({status: "Error", message: "Error en el login"})
    }
}

async function register(req, res){
    if(!req.body.user || !req.body.pass){
        return res.status(400).send({status: "Error", message: "Campos vacios"})
    }
    try {
        if(isValidEmail(req.body.email)){

            let [result, data] = await connection.query( //->> ESTO DEVULEVE LA CONSULTA Y DATOS DE LA TABLA, --OJO AL MANEJAR LOS DATOS--
            'SELECT * FROM usuarios WHERE (usuario LIKE ? OR email LIKE ?);',[req.body.user, req.body.email]
            );
            if(result.length > 0){
                return res.status(400).send({status: "Error", message: "Usuario ya existe"});
            }else{
                
                let result = await connection.query( //->> ESTO DEVULEVE LA CONSULTA Y DATOS DE LA TABLA, --OJO AL MANEJAR LOS DATOS--
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
async function saltPassword(pass){
    const staticSalt = '$2a$10$abcdefghijklmnopqrstuvwxyz123456';
    const hashPassword = await bcryptjs.hash(pass, staticSalt)
    return hashPassword
}
function isValidEmail(email) {
    // Regular expression for checking email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function sacarUsuariosChat(req, res){

    let [result, data] = await connection.query( //->> ESTO DEVULEVE LA CONSULTA Y DATOS DE LA TABLA, --OJO AL MANEJAR LOS DATOS--
            'SELECT id_sala,CASE WHEN id_usuario1 = ? THEN id_usuario2 ELSE id_usuario1 END AS usuario_contrario FROM salas_chat WHERE (id_usuario1 = ? OR id_usuario2 = ?);',[req.body.user,req.body.user,req.body.user]
        );
    res.status(201).send({status: "OK", result: result})
    // 'SELECT * FROM chatRooms WHERE (id_usuario_1 like ? or id_usuario_2 like ?)',[req.body.user,req.body.user]
} 

async function ultimoIdChat(req, res){

    let [result, data] = await connection.query( //->> ESTO DEVULEVE LA CONSULTA Y DATOS DE LA TABLA, --OJO AL MANEJAR LOS DATOS--
            'SELECT MAX(id_sala) AS ultimo_id_sala FROM salas_chat;'
        );
    res.status(201).send({status: "OK", result: result})
    // 'SELECT * FROM chatRooms WHERE (id_usuario_1 like ? or id_usuario_2 like ?)',[req.body.user,req.body.user]
} 

async function sacarUsuarios(req, res){

    let [result, data] = await connection.query( //->> ESTO DEVULEVE LA CONSULTA Y DATOS DE LA TABLA, --OJO AL MANEJAR LOS DATOS--
            'SELECT usuario FROM usuarios WHERE usuario=?',[req.body.user]
            );
    if(result.length <= 0){
        res.status(204).send({status: "Error", result: result})
    }else{
        let [result, data] = await connection.query( //->> ESTO DEVULEVE LA CONSULTA Y DATOS DE LA TABLA, --OJO AL MANEJAR LOS DATOS--
            'SELECT usuario FROM usuarios WHERE usuario=?',[req.body.user]
            );
        res.status(200).send({status: "OK", result: result})
    }
} 

async function recuperarSala(req, res){
    let [result, data] = await connection.query( //->> ESTO DEVULEVE LA CONSULTA Y DATOS DE LA TABLA, --OJO AL MANEJAR LOS DATOS--
        // "SELECT * FROM mensajes WHERE (id_usuarioEnvia = ? AND id_usuarioRecibe = ?) OR (id_usuarioEnvia = ? AND id_usuarioRecibe = ?) AND id_mensaje > ? ORDER BY fecha_envio",[idUser1,idUser2,idUser2,idUser1,variable ?? 0]
        "SELECT id_sala FROM salas_chat WHERE (id_usuario1 = ? AND id_usuario2 = ?) OR (id_usuario1 = ? AND id_usuario2 = ?)",[req.body.user1,req.body.user2,req.body.user2,req.body.user1]
    );
    res.status(200).send({status: "OK", result: result})
}
async function crearMazo(req, res){
    // AÑADIR EL MAZO
    // Y RECOGER LA ID DE ESE MAZO AL INSERTAR PARA CUANDO SE REDIRECCIONA TENERLO GUARDADO
    let result = await connection.query( //->> ESTO DEVULEVE LA CONSULTA Y DATOS DE LA TABLA, --OJO AL MANEJAR LOS DATOS--
    'insert into mazos (id_usuario,nombre_mazo) values (?,?);',[req.body.user, req.body.nombre]
    );
    return res.status(201).send({status: "OK", result: result, message: "Mazo registrado correctamente", redirect:"/deckBuilder"})
} 
async function recuperarMazosUsuario(req, res){
    // HAY QUE AÑADIR UN CAMPO A LA TABLA PARA PONER EL NOMBRE DEL MAZO
    // AÑADIR EL MAZO
    // Y RECOGER LA ID DE ESE MAZO AL INSERTAR PARA CUANDO SE REDIRECCIONA TENERLO GUARDADO
    let result = await connection.query( //->> ESTO DEVULEVE LA CONSULTA Y DATOS DE LA TABLA, --OJO AL MANEJAR LOS DATOS--
        "SELECT * FROM mazos WHERE id_usuario = ?",[req.body.user]
    );
    return res.status(200).send({status: "OK", result: result})
} 

export const methods = {
    login, register, sacarUsuariosChat,crearMazo, recuperarMazosUsuario, sacarUsuarios, recuperarSala, ultimoIdChat
}




