import mysql from 'mysql2/promise';

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

// REQUESTS CREATE DECK
// REQUES FOR LIST COLLECTIONS
async function listaColecciones(req, res){
    let [result, data] = await connection.query( //->> ESTO DEVULEVE LA CONSULTA Y DATOS DE LA TABLA, --OJO AL MANEJAR LOS DATOS--
        'SELECT * FROM coleccion'
    );
    return res.status(200).send({status: "OK", result: result})
} 
// REQUESTS FOR FILTER CARDS
async function filtroCartas(req, res){
    console.log(req.body.sql)
    let result = await connection.query(
        `${req.body.sql} `
    );
    return res.status(200).send({status: "OK", result: result})
} 
// REQUESTS FOR INSERT CARDS IN DECK
async function insertCartaMazo(req, res){
    let result = await connection.query(
        "INSERT INTO mazo_cartas (id_mazo, id_carta, id_coleccion, id_Juego, cantidad) values (?,?,?,?,?)",[req.body.idMazo,req.body.idCarta,req.body.idColeccion,req.body.idJuego,req.body.cantidad]
    );
    return res.status(200).send({status: "OK", result: result})
}
//REQUESTS FOR UPDATE CARDS IN DECK
async function updateCartaMazo(req, res){
    let result = await connection.query(
        "UPDATE mazo_cartas SET cantidad = ? WHERE id_mazo = ? AND id_carta = ? AND id_coleccion = ? AND id_Juego = ?;",[ req.body.cantidad,req.body.idMazo, req.body.idCarta, req.body.idColeccion,"DG"]
    );
    return res.status(200).send({status: "OK", result: result})
}
//REQUESTS FOR REMOVE CARDS IN DECK
async function removeCartaMazo(req, res){
    let result = await connection.query(
        "DELETE FROM mazo_cartas WHERE id_mazo = ? AND id_carta = ? AND id_coleccion = ? AND id_Juego = ?;",[req.body.idMazo, req.body.idCarta, req.body.idColeccion,"DG"]
    );
    return res.status(200).send({status: "OK", result: result})
} 
//REQUESTS FOR SHOW CARDS IN DECK
async function cartasMazo(req, res){
    let [result, data] = await connection.query(
        'SELECT mc.id_mazo, mc.id_carta, mc.cantidad, c.id_coleccion, c.id_juego, c.level, c.dp, c.name, c.type, c.color, c.stage, c.digi_type, c.attribute, c.play_cost, c.evolution_cost, c.cardrarity, c.artist, c.maineffect, c.soureeffect, c.set_name, c.image_url FROM mazo_cartas mc JOIN cartas c ON mc.id_carta = c.id_carta AND mc.id_coleccion = c.id_coleccion AND mc.id_juego = c.id_juego WHERE mc.id_mazo = ?;',[req.body.idMazo]
    );
    if(result.length == 0){
        return res.status(200).send({status: "OK", result: "vacio"})
    }else{
    }
    return res.status(200).send({status: "OK", result: result})
}
//REQUESTS FOR DELETE ALL CARDS IN DECK
async function baciarMazo(req, res){
    let result = await connection.query(
        "DELETE FROM mazo_cartas WHERE id_mazo = ?;",[req.body.idMazo]
    );
}
//REQUEST FOR COLLECTION CARDS
//REQUEST FOR ADD CARD TO COLLECTION
async function añadirAColeccion(req, res){
    console.log(req.body.user, req.body.id_coleccion, req.body.id_carta,"DG", req.body.cantidad)
    let result = await connection.query(
        "INSERT INTO usuarioColeccion (id_usuario, id_carta, id_coleccion, id_Juego, cantidad) values (?,?,?,?,?)",[req.body.user, req.body.id_carta, req.body.id_coleccion,"DG", req.body.cantidad]
    );
    return res.status(200).send({status: "OK", result: result})
} 
//REQUEST FOR UPDATE CARD TO COLLECTION
async function updateCartaColeccion(req, res){
    console.log(req.body.user, req.body.id_coleccion, req.body.id_carta,"DG", req.body.cantidad)
    let result = await connection.query(
        "UPDATE usuarioColeccion SET cantidad = ? WHERE id_usuario = ? AND id_carta = ? AND id_coleccion = ? AND id_Juego = ?;",[ req.body.cantidad,req.body.user, req.body.id_carta, req.body.id_coleccion,"DG"]
    );
    return res.status(200).send({status: "OK", result: result})
} 
//REQUEST FOR DELETE CARD TO COLLECTION
async function eliminarCartaColeccion(req, res){
    let result = await connection.query(
        "DELETE FROM usuarioColeccion WHERE id_usuario = ? AND id_carta = ? AND id_coleccion = ? AND id_Juego = ?;",[req.body.user, req.body.id_carta, req.body.id_coleccion,"DG"]
    );
    return res.status(200).send({status: "OK", result: result})
} 
//REQUEST FOR SHOW CARDS IN COLLECTION USER
async function cartasColeccionUsuario(req, res){
    let result = await connection.query(
        "SELECT * FROM usuarioColeccion WHERE id_usuario = ?;",[req.body.user]
    );
    return res.status(200).send({status: "OK", result: result})
} 
async function cartasColeccionUsuarioAllData(req, res){
    let result = await connection.query(
        `SELECT uc.*, c.* 
        FROM usuarioColeccion AS uc 
        JOIN cartas AS c ON uc.id_carta = c.id_carta 
            AND uc.id_coleccion = c.id_coleccion 
            AND uc.id_juego = c.id_juego 
        WHERE uc.id_usuario = ?`,[req.body.user]
    );
    return res.status(200).send({status: "OK", result: result})
}
// REQUESTS FOR SHOW CUANTITI OF CARDS IN COLLECTION USER
async function cartasEnPosesion(req, res){
    let result = await connection.query(
        `SELECT COUNT(*) AS cantidad
        FROM usuarioColeccion AS uc
        WHERE uc.id_usuario = ?`,[req.body.user]
    );
    return res.status(200).send({status: "OK", result: result})
}
async function cantidadTorneosActivos(req, res){
    let result = await connection.query(
        `SELECT count(*) FROM eventos WHERE CAST(fecha_inicio AS date) >= CAST(NOW() AS date);`
    );
    return res.status(200).send({status: "OK", result: result})
}
async function cantidadTorneosApuntados(req, res){
    let result = await connection.query(
        `SELECT COUNT(*) AS event_count FROM eventosDetalle AS ed JOIN eventos AS e ON ed.id_evento = e.id_evento WHERE ed.id_usuario = ? AND e.fecha_inicio > CAST(NOW() AS date);`, [req.body.user]
    );
    return res.status(200).send({status: "OK", result: result})
}

export const methods = {
    filtroCartas, 
    listaColecciones, 
    añadirAColeccion, 
    updateCartaColeccion, 
    eliminarCartaColeccion, 
    cartasColeccionUsuario,
    insertCartaMazo,
    updateCartaMazo,
    removeCartaMazo,
    cartasMazo,
    baciarMazo,
    cartasColeccionUsuarioAllData,
    cartasEnPosesion,
    cantidadTorneosActivos,
    cantidadTorneosApuntados
}