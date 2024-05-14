import mysql from 'mysql2/promise';

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

// PETICIONES CREAR MAZO
async function listaColecciones(req, res){
    let [result, data] = await connection.query( //->> ESTO DEVULEVE LA CONSULTA Y DATOS DE LA TABLA, --OJO AL MANEJAR LOS DATOS--
        'SELECT * FROM coleccion'
    );
    return res.status(200).send({status: "OK", result: result})
} 

async function filtroCartas(req, res){
    let result = await connection.query(
        `${req.body.sql}`
    );
    return res.status(200).send({status: "OK", result: result})
} 

// PETICIONES COLEECION
async function añadirAColeccion(req, res){
    console.log(req.body.user, req.body.id_coleccion, req.body.id_carta,"DG", req.body.cantidad)
    let result = await connection.query(
        "INSERT INTO usuarioColeccion (id_usuario, id_carta, id_coleccion, id_Juego, cantidad) values (?,?,?,?,?)",[req.body.user, req.body.id_carta, req.body.id_coleccion,"DG", req.body.cantidad]
    );
    return res.status(200).send({status: "OK", result: result})
} 
async function updateCartaColeccion(req, res){
    console.log(req.body.user, req.body.id_coleccion, req.body.id_carta,"DG", req.body.cantidad)
    let result = await connection.query(
        "UPDATE usuarioColeccion SET cantidad = ? WHERE id_usuario = ? AND id_carta = ? AND id_coleccion = ? AND id_Juego = ?;",[ req.body.cantidad,req.body.user, req.body.id_carta, req.body.id_coleccion,"DG"]
    );
    return res.status(200).send({status: "OK", result: result})
} 
async function eliminarCartaColeccion(req, res){
    let result = await connection.query(
        "DELETE FROM usuariocoleccion WHERE id_usuario = ? AND id_carta = ? AND id_coleccion = ? AND id_Juego = ?;",[req.body.user, req.body.id_carta, req.body.id_coleccion,"DG"]
    );
    return res.status(200).send({status: "OK", result: result})
} 
async function cartasColeccionUsuario(req, res){
    let result = await connection.query(
        "SELECT * FROM usuariocoleccion WHERE id_usuario = ?;",[req.body.user]
    );
    return res.status(200).send({status: "OK", result: result})
} 

export const methods = {
    filtroCartas, listaColecciones, añadirAColeccion, updateCartaColeccion, eliminarCartaColeccion, cartasColeccionUsuario
}