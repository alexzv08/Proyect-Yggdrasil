import mysql from 'mysql2/promise';
const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'admini',
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
        res.status(400).send({status: "Error", message: "Campos vacios"})
    }
    try {
        let [result, data] = await connection.query( //->> ESTO DEVULEVE LA CONSULTA Y DATOS DE LA TABLA, --OJO AL MANEJAR LOS DATOS--
            'SELECT * FROM usuario WHERE user LIKE ? AND password LIKE ?;',[req.body.user, req.body.pass]
        );
        console.log(result.length === 0 ?  res.status(400).send({status: "Error", message: "Datos incorrectos"}) : result);
    } catch (err) {
        res.status(400).send({status: "Error", message: "Error en el login"})
    }
}

function register(req, res){

}

export const methods = {
    login, register
}




