// DEPENDENIAS NECESARIAS
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js"
import { methods as windowOnLoad } from "./sideBar.js";
// import 'dotenv/config';

let tamañoPantalla = false
// INFORMACION QUE CONTIENE Socket.IO AL ENVIAR AL SERVIDOR POR PARTE DEL CLIENTE
let socket = io({
    auth: {
        username: sessionStorage.getItem("user"),
        serverOffset: 0
    }
})
// SABER EL TAMAÑO DE LA PANTALLA EN CADA MOMENTO
window.onresize = reportWindowSize;
// MODIFICAR EL DISEÑO DE LA PAGINA DEPENDIENDO DEL TAMAÑO DE LA PANTALLA
function reportWindowSize() {
    if(window.innerWidth<=400){
        document.getElementById("chat-mensajes").style.display = "none"
    }
    if(window.innerWidth > 400){
        console.log("mayor")
        document.getElementById("chat-mensajes").style.display = "flex"
        document.getElementById("chat-mensajes").style.flexDirection = "column"

        document.querySelector(".friends").style.display = "flex"
        document.querySelector(".friends").style.flexDirection = "column"
    }
}

window.onload= async ()=>{
    await windowOnLoad.onLoad()
    await cargarUsuarios()
    await document.getElementById('chatSide').classList.add('active')
    await document.getElementById("toogleMenu").addEventListener("click", windowOnLoad.toggleMenuChange)
    windowOnLoad.navBarRediretions()
    añadirChat()
    let user=document.querySelectorAll('.user');
    user.forEach(element => {
        element.addEventListener("click", cargarChat)   
    });

    if(window.innerWidth<=400){
        tamañoPantalla = true
        console.log(tamañoPantalla)
    }
    document.querySelector("#infoChat #atrasChat").addEventListener("click", atras)
}
function atras(){
        console.log("click")
        document.getElementById("chat-mensajes").style.display = "none"
        document.querySelector(".friends").style.display = "flex"
}
// Function to load the chat with the selected user
async function cargarChat(user){
    localStorage.setItem('id_actual',this.dataset.id_sala)
    socket.emit('solicitarSala', this.dataset.id_sala, socket.auth.username);
    await cargarnombre(this.querySelector('.name-user').firstElementChild.innerText)
    message.innerText=''
    if(user!=''){
        localStorage.setItem('usuarioEnviarMensaje',this.querySelector('.name-user').firstElementChild.innerText)
    }
    socket.emit('chat charge', ([socket.auth.username,this.querySelector('.name-user').firstElementChild.innerText]))

    if(window.innerWidth <= 400){
        document.getElementById("chat-mensajes").style.display = "flex"
        document.querySelector(".friends").style.display = "none"
    }
}
function cargarnombre(nombre){
    document.querySelector(".nombre").innerText = nombre
}
const form = document.getElementById("form")
const input = document.getElementById("input")
const messages = document.getElementById("message")
// CARGAR LOS MENSAJES EN EL CHAT CUANDO LOS RECIBE EL SOCKET
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
// EMISION DEL MENSAJE
form.addEventListener("submit", async (e) =>{
    e.preventDefault()
    if(input.value){
        let fecha = new Date
        await recuperarSala(socket.auth.username, localStorage.getItem('usuarioEnviarMensaje'))
        socket.emit("chat message", input.value, localStorage.getItem('usuarioEnviarMensaje'), fecha, localStorage.getItem('id_actual'))
        input.value = ""
    }
})
// FUNCION PARA CARGAR LOS DISTINTOS CHATS ACTIVOS QUE DISPONE EL USUARIO
async function cargarUsuarios(){
    const res = await fetch(`http://alexfullstack.net/api/usuarios`,{
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
        console.log(resJson)

        resJson.result.forEach(element => {
            let div = document.createElement("div")
            div.classList.add("user")
            div.dataset.id_sala = element.id_sala

            let div2 = document.createElement("div")
            div2.classList.add("icon-user")                    

            let img = document.createElement("img")
            img.src="src/icons/perfilwhite.svg"

            let div3 = document.createElement("div")
            div3.classList.add("name-user") 

            let h = document.createElement("h3")
            h.innerText=element.usuario_contrario
            
            document.querySelector("#friends-list").appendChild(div)
            div.appendChild(div2)
            div2.appendChild(img)
            div.appendChild(div3)
            div3.appendChild(h)
        });
    }
}
// FUNCION PARA FORMATEAR LA FECHA RECIBIDA DEL SERVIDO A UN FORMATO MAS CORRECTO
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
// FUNCION DE BUSCAR UN USUARIO Y CARGAR UN CHAT CON ESE USUARIO. COMPRONBAMOS SI EL USUARIO EXISE O NO. GENERAMOS UNA SALA QUE VINCULA A LOS DOS USUARIOS
// SI YA TENEMOS UN CHAT ACTIVO CON ESE USUARIO LO QUE HACE ES CARGAR ESA SALA EN LA ZONA DEL CHAT
function añadirChat(){
    document.getElementById("addFriend").addEventListener("submit", async (e)=>{
        e.preventDefault();
        if(e.target.children[0].value==='' || e.target.children[0].value == sessionStorage.getItem('user')){
            alert("Inserte un usuario valido")
            return
        }

        const res = await fetch(`http://alexfullstack.net/api/usuarioExistente`,{
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
                
                document.querySelector("#friends-list").appendChild(div)
                div.appendChild(div2)
                div2.appendChild(img)
                div.appendChild(div3)
                div3.appendChild(h)

            }else{
                // ABRIR EL CHAT DEL USUARIO AL CUAL SE A BUSCADO Y YA SE TIENE UN CHAT ACTIVO
                cargarChat(e.target.children[0].value)
            }
            return
        }
    })
}
// FUNCION PARA RECUPERAR LA SALA VINCULADA A 2 USUARIOS
async function recuperarSala(user1, user2){
    console.log(user1,user2)
    const res = await fetch(`http://alexfullstack.net/api/idSalaChat`,{
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
    console.log(resJson.result[0].id_sala)
    return resJson.result[0].id_sala
}
// FUNCION PARA RECUPERAR EL ULTIMO ID DE UNA SALA POSIBLE Y ASI PODER AÑADIR UNA SALA VALIDA
async function ultimoIdSalaPosible(user1,user2){
    console.log(user1,user2)
    const res = await fetch(`http://alexfullstack.net/api/ultimoIdChat`,{
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