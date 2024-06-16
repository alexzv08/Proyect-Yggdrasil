import { methods as windowOnLoad } from "./sideBar.js";
import { methods as notification } from "./notification.js";
// import 'dotenv/config';

window.onload = async ()=>{
    await windowOnLoad.onLoad()
    windowOnLoad.navBarRediretions()
    await document.getElementById("toogleMenu").addEventListener("click", windowOnLoad.toggleMenuChange)
    notification.solicitarSala()
    // document.querySelector(".filtroEvento img").addEventListener("click", mostrarFiltro)
    document.querySelector(".button button").addEventListener("click", mostrarNuevoTorneo)
    cover.addEventListener("click", quitarModal)
    document.querySelector("form").addEventListener('click', function(event) {
        // Detener la propagación del evento
        event.stopPropagation();
    });
    document.querySelector(".aceptar").addEventListener("click", crearTorneoApi)
    document.querySelector(".cancelar").addEventListener("click", quitarModal)

}

function mostrarFiltro(){
    let filtro = document.querySelector(".filtroEvento")
    if(filtro.style.display == "none" || filtro.style.display == ""){
        filtro.style.display = "flex"
    }else{
        filtro.style.display = "none"
    }
}
function quitarModal(e){
    e.preventDefault()
    cover.style.display = "none"
    crearTorneo.style.display = "none"
}
async function crearTorneoApi(e){
    e.preventDefault()
    let formulario = document.querySelectorAll('#formCrearTorneo input');
    let datos = []
    formulario.forEach(element => {
        datos.push(element.value)
        console.log(element.value);
    });
    document.querySelectorAll("#formCrearTorneo input").forEach(element => {
        datos.push(element.value);
    });
    datos.push(document.querySelectorAll("#formCrearTorneo textarea").value);


    const res = await fetch(`http://localhost3000/api/registrarEvento`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            nombreTorneo: datos[0],
            fecha: datos[1],
            hora: datos[2],
            participantesMax: datos[3],
            descripcion: datos[4],
            usuario: sessionStorage.getItem("user")
        })
    })
}

function mostrarNuevoTorneo(){
    cover.style.display = "block"
    crearTorneo.style.display = "flex"

}