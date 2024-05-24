/**
 * @todo 
 * ADMINISTRAR LOS CHATS EN LA BSE DE DATOS
 *      ->CREAR TABLE DONDE SE CREEN LAS SALAS DE LOS DISTINTOS CHATS CON LOS USUARIOS 
 *          -> ID_CHAT, USUARIO_1, USUARIO_2
 *      ->MODIFICAR LA TABLA DE CHAT ACTUAL
 *          -> ID_CHAT, USUARIO_ENVIA, MENSAJE, FECHA, VISTO
 * AL CARGAR LOS DISTINTOS CHATS ALMACENAR EL ID DE LA SALA PARA PODER ACCEDER A ELLA
 *      ->CARGAR LOS MENSAJES DE DICHA SALA 
 * AL INICIAR CONVERSACION NUEVA, CON UN NUEVO USUARIO
 *      ->COGER EL ULTIMO ID/ HACERLO AUTO INCREMENT
 *      ->CORREGUIR POSIBLE ERROR BUSCA UN NUEVO USUARIO QUE NO SE GENERE NUEVO ID
 * MODIFICAR LA FORMA DE ENVIAR LOS MENSAJES 
 *      ->ENVIARLOS APARTIR DEL ID DE LA SALA
 *      ->ENVIAR TAMBIEN LA INFORMACION DE USUARIO QUE ENVIA, CONTENIDO
 * VER COMO HACER PARA QUE SALGAN NOTIDICACIONES DE LOS NUEVOS MENSAJES
 *      ->DETRO DEL CHAT NOTIDICACION DE NUEVO MENSAJE
 *      ->CUALQUIR OTRA PARTE, BADGE DE NUEVO MENSAJE/CANTIDAD DE MENSAJES NUEVOS¿?
 * 
 * PARA LOS MENSAJES INFORMARSE QUE ES MEJOR ROOM'S O HACER JOIN DE LOS USUARIOS
 *      ->JOIN INPORTA EL ORDEN DE LOS USUARIOS QUE SE CONECTAN¿?
 *      ->ROOM VERIFICACION QUE AL CREAR UNA SALA NO EXISTE NINGUNA OTRA CON LOS MISMOS USUARIOS
 */


import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js"
import { methods as windowOnLoad } from "./sideBar.js";

console.log(sessionStorage.getItem("user"))
let socket = io({
    auth: {
        username: sessionStorage.getItem("user"),
        serverOffset: 0
    }
})
const heightOutput = document.querySelector("#height");
const widthOutput = document.querySelector("#width");

window.onresize = reportWindowSize;
let tamañoPantalla = false
function reportWindowSize() {
    if(document.querySelector("#width")<=400){
        tamañoPantalla = true
        console.log(tamañoPantalla)
    }
}

window.onload= async ()=>{
    windowOnLoad.onLoad()
    // await windowOnLoad.addHtmlDocumentAtBeginning("./components/sideBar.html")
    await cargarUsuarios()
    await document.getElementById('chatSide').classList.add('active')
    await document.getElementById("toogleMenu").addEventListener("click", windowOnLoad.toggleMenuChange)
    windowOnLoad.navBarRediretions()
    añadirChat()
    let user=document.querySelectorAll('.user');
    user.forEach(element => {
        element.addEventListener("click", cargarChat)   
    });

    if(document.querySelector("#width")<=400){
        tamañoPantalla = true
        console.log(tamañoPantalla)
    }

    atrasChat.addEventListener("click",()=>{
        document.getElementById("chat-mensajes").style.display = "none"
        document.querySelector(".friends").style.display = "flex"
    })
}

function cargarChat(user){
    localStorage.setItem('id_actual',this.dataset.id_sala)
    socket.emit('solicitarSala', this.dataset.id_sala);
    message.innerText=''
    if(user!=''){
        localStorage.setItem('usuarioEnviarMensaje',this.querySelector('.name-user').firstElementChild.innerText)
    }
    socket.emit('chat charge', ([socket.auth.username,this.querySelector('.name-user').firstElementChild.innerText]))

    if(tamañoPantalla){
        document.getElementById("chat-mensajes").style.display = "flex"
        document.querySelector(".friends").style.display = "none"
    }
}

const form = document.getElementById("form")
const input = document.getElementById("input")
const messages = document.getElementById("message")

socket.on('chat message', (msg, serverOffset, username, fecha) => {
    let item = `<li`;
    if (socket.auth.username === username) {
        item += ` class='propio'`;
    }
    item += `>
        <p>${msg}</p>
        <small>${formatearFecha(fecha)}</small>
    </li>`;
        messages.insertAdjacentHTML( 'beforeend',item)
        socket.auth.serverOffset = serverOffset
    messages.scrollTop = messages.scrollHeight
})

form.addEventListener("submit", (e) =>{
    e.preventDefault()
    if(input.value){
    // localStorage.setItem('usuarioEnviarMensaje',this.lastElementChild.firstElementChild.innerText)
    let fecha = new Date
    recuperarSala(socket.auth.username, localStorage.getItem('usuarioEnviarMensaje'))
    socket.emit("chat message", input.value,localStorage.getItem('usuarioEnviarMensaje'),fecha, localStorage.getItem('id_actual'))
    input.value = ""
    }
})

async function cargarUsuarios(){
    const res = await fetch("http://localhost:3000/api/usuarios",{
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
        resJson.result.forEach(element => {
            let div = document.createElement("div")
            div.classList.add("user")
            div.dataset.id_sala = element.id_sala

            let div2 = document.createElement("div")
            div2.classList.add("icon-user")                    

            let img = document.createElement("img")
            img.src="src/icons/user-alt-1-svgrepo-com.svg"

            let div3 = document.createElement("div")
            div3.classList.add("name-user") 

            let h = document.createElement("h3")
            h.innerText=element.usuario_contrario

            // let divMore = document.createElement("div")
            // divMore.classList.add("more")
            // let img2 = document.createElement("img")
            // img2.src="src/icons/more-horizontal-svgrepo-com.svg"
            
            document.querySelector("#friends-list").appendChild(div)
            div.appendChild(div2)
            div2.appendChild(img)
            div.appendChild(div3)
            div3.appendChild(h)
            // div.appendChild(divMore)
            // divMore.appendChild(img2)
        });
    }
}

function formatearFecha(fechaF){
    const fecha = new Date(fechaF);

    let dia = fecha.getDate().toString();
    let mes = (fecha.getMonth() + 1).toString(); // Se agrega 1 porque los meses en JavaScript van de 0 a 11
    let año = fecha.getFullYear().toString();
    let hora = fecha.getHours().toString();
    let minutos = fecha.getMinutes().toString();

    if(dia<10){dia='0'+dia}
    if(mes<10){mes='0'+mes}
    if(minutos<10){minutos='0'+minutos}
    if(hora<10){hora='0'+hora}

    const fechaNormal = `${dia}/${mes}/${año} ${hora}:${minutos}`;

    return fechaNormal.toString()
}

function añadirChat(){
    document.getElementById("addFriend").addEventListener("submit", async (e)=>{
        e.preventDefault();
        if(e.target.children[0].value==='' || e.target.children[0].value == sessionStorage.getItem('user')){
            alert("Inserte un usuario valido")
            return
        }

        const res = await fetch("http://localhost:3000/api/usuarioExistente",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                user: e.target.children[0].value
            })
        })
        if(res.status == 204){
            alert("El usuario no existe")
            return
        }
        if(res.status == 200){
            let usuarioExistentesChat = document.querySelectorAll(".user .name-user h3");
            let pintarUsuario = true;
            usuarioExistentesChat.forEach(element => {
                if(element.innerText==e.target.children[0].value){
                    pintarUsuario = false
                }
            });
            if(pintarUsuario){
                let div = document.createElement("div")
                div.classList.add("user")
                div.dataset.id_sala = await ultimoIdSalaPosible(sessionStorage.getItem("user"),e.target.children[0].value)
                div.addEventListener("click", cargarChat)
                
                let div2 = document.createElement("div")
                div2.classList.add("icon-user")                    
                
                let img = document.createElement("img")
                img.src="src/icons/user-alt-1-svgrepo-com.svg"
                
                let div3 = document.createElement("div")
                div3.classList.add("name-user") 
                
                let h = document.createElement("h3")
                h.innerText=e.target.children[0].value
                
                // let divMore = document.createElement("div")
                // divMore.classList.add("more")
                // let img2 = document.createElement("img")
                // img2.src="src/icons/more-horizontal-svgrepo-com.svg"
                
                document.querySelector("#friends-list").appendChild(div)
                div.appendChild(div2)
                div2.appendChild(img)
                div.appendChild(div3)
                div3.appendChild(h)
                // div.appendChild(divMore)
                // divMore.appendChild(img2)
            }else{
                // ABRIR EL CHAT DEL USUARIO AL CUAL SE A BUSCADO Y YA SE TIENE UN CHAT ACTIVO
                cargarChat(e.target.children[0].value)
            }
            return
        }
    })
}

async function recuperarSala(user1, user2){
    const res = await fetch("http://localhost:3000/api/idSalaChat",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            user1: user1,
            user2: user2
        })
    })
    const resJson = await res.json()
    return resJson.result[0].id_sala
}

async function ultimoIdSalaPosible(user1,user2){
    console.log(user1,user2)
    const res = await fetch("http://localhost:3000/api/ultimoIdChat",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                user1: user1,
                user2: user2
            })
        })
    const data = await res.json()
    return data.result
}