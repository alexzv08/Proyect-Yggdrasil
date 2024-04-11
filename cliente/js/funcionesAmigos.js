import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js"


function windowOnLoad(){
    document.getElementById("addFriend").addEventListener("submit", async (e)=>{
        e.preventDefault();

        if(e.target.children[0].value==='' || e.target.children[0].value == sessionStorage.getItem('user')){
            alert("Inserte un usuario valido")
            return
        }

        // PETICION POR SERVIDOR AWS
        // const res = await fetch("http://35.181.125.245:3001/api/login",{
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
            alert("Se a enviado peticion de amistad al usuario " + e.target.children[0].value)
            // console.log(res.result[0].usuario)
            // let usuarioExistentesChat = document.querySelector(".user .name-user h3").innerText;
            // console.log(usuarioExistentesChat)

            // let div = document.createElement("div")
            // div.classList.add("user")
            // div.addEventListener("click", cargarChat)

            // let div2 = document.createElement("div")
            // div2.classList.add("icon-user")                    

            // let img = document.createElement("img")
            // img.src="src/icons/user-alt-1-svgrepo-com.svg"

            // let div3 = document.createElement("div")
            // div3.classList.add("name-user") 

            // let h = document.createElement("h3")
            // h.innerText=e.target.children[0].value

            // document.querySelector("#friends-list").appendChild(div)
            // div.appendChild(div2)
            // div2.appendChild(img)
            // div.appendChild(div3)
            // div3.appendChild(h)
            return
        }
        // const resJson = await res.json()
        // console.log(resJson)
        
    })
}
let socket = io({
    auth: {
        username: sessionStorage.getItem("user"),
        serverOffset: 0
    }
})

function cargarChat() {
    message.innerText = '';
    var usuarioEnviarMensaje = this.lastElementChild.firstElementChild.innerText;
    localStorage.setItem('usuarioEnviarMensaje', usuarioEnviarMensaje);

    socket.auth.username2 = usuarioEnviarMensaje;

    socket.emit('chat charge', [socket.auth.username, usuarioEnviarMensaje], function(error) {
        if (error) {
            console.error('Error al emitir evento chat charge:', error);
        } else {
            console.log('Evento chat charge emitido correctamente.');
        }
    });
}

export const methods = {
    windowOnLoad
}