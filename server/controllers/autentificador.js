import mysql from 'mysql2/promise';
import bcryptjs from 'bcryptjs';

const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
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

async function login(req, res){
    if(!req.body.user || !req.body.pass){
        return res.status(400).send({status: "Error", message: "Campos vacios"})
    }
    try {
        let [result, data] = await connection.query( //->> ESTO DEVULEVE LA CONSULTA Y DATOS DE LA TABLA, --OJO AL MANEJAR LOS DATOS--
            'SELECT * FROM usuarios WHERE (usuario LIKE ? OR email LIKE ?) AND password LIKE ?;',[req.body.user,req.body.user, await saltPassword(req.body.pass)]
            );
            console.log(await saltPassword(req.body.pass))
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
        console.log(isValidEmail(req.body.email))
        if(isValidEmail(req.body.email)){

            let [result, data] = await connection.query( //->> ESTO DEVULEVE LA CONSULTA Y DATOS DE LA TABLA, --OJO AL MANEJAR LOS DATOS--
            'SELECT * FROM usuarios WHERE (usuario LIKE ? OR email LIKE ?);',[req.body.user, req.body.email]
            );
            if(result.length > 0){
                return res.status(400).send({status: "Error", message: "Usuario ya existe"});
            }else{
                
                console.log()
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
            'SELECT DISTINCT id_usuarioRecibe AS usuario FROM mensajes WHERE id_usuarioEnvia = ? UNION SELECT DISTINCT id_usuarioEnvia AS usuario FROM mensajes WHERE id_usuarioRecibe = ?',[req.body.user, req.body.user]
            );
    res.status(201).send({status: "OK", result: result})
} 

export const methods = {
    login, register, sacarUsuariosChat
}




