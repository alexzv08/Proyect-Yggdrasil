import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js"
// import 'dotenv/config';


let socket = io({
    auth: {
        username: sessionStorage.getItem("user"),
        serverOffset: 0
    }
})
// MIRAR COMO HACER PARA INGRESAR EN TODAS LAS SALAS QUE ESTA EL USUARIO
// O COMO RECIBIR LA NOTIFICACION DE QUE HA RECIBIDO UN MENSAJE SIN CONECTARTE A LA SALA DIRECTAMENTE POR EL USUARIO

async function solicitarSala(){
    console.log("Solicitando sala")
    const res = await fetch(`http://localhost:3000/api/salasUsuario`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            user: sessionStorage.getItem("user"),
        })
    })
    if(res.ok){
        const resJson = await res.json()
        resJson.result[0].forEach(element => {
            console.log(element.id_sala)
            socket.emit('solicitarSala', element.id_sala, socket.auth.username);
        });
    }
}
// FUNCION PARA NOTIFICAR DE UN MENSAJE NUEVO
socket.on('notification', (msg, serverOffset, username, fecha) => {
    // alert("Mensaje de: " + username  + ": " + msg)
    notificacion.style.display = "flex"
    // GESTIONAR PARA QUE SALGA LA NOTIFICACION EN EL ICONO DE CHAT DEL SIDEBAR O EN LA BARRA DEL NAVEGADOR
})
export const methods = {
    solicitarSala
}