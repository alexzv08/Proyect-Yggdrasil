import { methods as windowOnLoad } from "./sideBar.js";
import { methods as notification } from "./notification.js";

window.onload = async ()=>{
    await windowOnLoad.onLoad()
    windowOnLoad.navBarRediretions()
    await document.getElementById("toogleMenu").addEventListener("click", windowOnLoad.toggleMenuChange)
    notification.solicitarSala()
    document.querySelector(".buscador img").addEventListener("click", mostrarFiltro)
}

function mostrarFiltro(){
    let filtro = document.querySelector(".filtroEvento")
    if(filtro.style.display == "none" || filtro.style.display == ""){
        filtro.style.display = "flex"
    }else{
        filtro.style.display = "none"
    }
}