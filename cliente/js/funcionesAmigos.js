import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js"
import { methods as windowOnLoad } from "./sideBar.js";

console.log(sessionStorage.getItem("user"))
let socket = io({
    auth: {
        username: sessionStorage.getItem("user"),
        serverOffset: 0
    }
})
window.onload= async ()=>{
    await cargarUsuarios()
    toogleMenu.addEventListener("click", windowOnLoad.toggleMenuChange)
    windowOnLoad.navBarRediretions()
    añadirChat()
    
    
    let user=document.querySelectorAll('.user');
    user.forEach(element => {
        element.addEventListener("click", cargarChat)   
    });
}

function cargarChat(){
    message.innerText=''
    localStorage.setItem('usuarioEnviarMensaje',this.querySelector('.name-user').firstElementChild.innerText)
    // socket.auth.username2 = this.lastElementChild.firstElementChild.innerText
    console.log(this.querySelector('.name-user').firstElementChild.innerText)
    socket.emit('chat charge', ([socket.auth.username,localStorage.getItem('usuarioEnviarMensaje')]))
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
    console.log(fecha)
    socket.emit("chat message", input.value,localStorage.getItem('usuarioEnviarMensaje'),fecha)
    input.value = ""
    }
})

async function cargarUsuarios(){
    // PETICION POR SERVIDOR AWS
    // const res = await fetch("http://35.181.125.245:3000/api/usuarios",{
    // PETICION POR SERVIDOR LOCAL
    const res = await fetch("http://localhost:3000/api/usuarios",{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body: JSON.stringify({
        user: sessionStorage.getItem("user")
    })
    })
    if(res.ok){
        const resJson = await res.json()
        console.log(resJson)
        resJson.result.forEach(element => {
            let div = document.createElement("div")
            div.classList.add("user")

            let div2 = document.createElement("div")
            div2.classList.add("icon-user")                    

            let img = document.createElement("img")
            img.src="src/icons/user-alt-1-svgrepo-com.svg"

            let div3 = document.createElement("div")
            div3.classList.add("name-user") 

            let h = document.createElement("h3")
            h.innerText=element.usuario

            let divMore = document.createElement("div")
            divMore.classList.add("more")
            let img2 = document.createElement("img")
            img2.src="src/icons/more-horizontal-svgrepo-com.svg"
            
            document.querySelector("#friends-list").appendChild(div)
            div.appendChild(div2)
            div2.appendChild(img)
            div.appendChild(div3)
            div3.appendChild(h)
            div.appendChild(divMore)
            divMore.appendChild(img2)


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

        // PETICION POR SERVIDOR AWS
        // const res = await fetch("http://35.181.125.245:3000/api/login",{
        // PETICION POR SERVIDOR LOCAL
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
                div.addEventListener("click", cargarChat)
                
                let div2 = document.createElement("div")
                div2.classList.add("icon-user")                    
                
                let img = document.createElement("img")
                img.src="src/icons/user-alt-1-svgrepo-com.svg"
                
                let div3 = document.createElement("div")
                div3.classList.add("name-user") 
                
                let h = document.createElement("h3")
                h.innerText=e.target.children[0].value
                
                let divMore = document.createElement("div")
                divMore.classList.add("more")
                let img2 = document.createElement("img")
                img2.src="src/icons/more-horizontal-svgrepo-com.svg"
                


                document.querySelector("#friends-list").appendChild(div)
                div.appendChild(div2)
                div2.appendChild(img)
                div.appendChild(div3)
                div3.appendChild(h)
                div.appendChild(divMore)
                divMore.appendChild(img2)
            }
            return
        }
    })
}
