import { methods as funcionesCartas } from "./funcionesCartas.js";
import { methods as funcionesFiltro } from "./funcionesFiltroCartas.js";
import { methods as notification } from "./notification.js";
// import 'dotenv/config';

let ocultoMenu, ocultoChatHamburger=false;
let ocultoChat=false;

async function verifyAndFetch(url, options = {}) {
    const token = sessionStorage.getItem("token");
    console.log(token)
    if (!token) {
        // Si no hay token, redirigir al login
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        window.location.href = "/login";
        return;
    }

    // Agregar el token a los encabezados de la solicitud
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) {
        // Manejar errores, por ejemplo, redirigir al login si el token es inválido
        alert("No autorizado, por favor inicia sesión nuevamente.");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        window.location.href = "/login";
        return;
    }

    return res.json();
}
window.onload = async()=>{
    try {
        const data = await verifyAndFetch(`http://13.37.66.226:3000/api/protectedRoute`);
        if(sessionStorage.getItem("rol") == 1){
            await addHtmlDocumentAtBeginning("./components/sideBar.html")
            await document.getElementById("otros").addEventListener("click", mostrarOtros)
        }else{
            await addHtmlDocumentAtBeginning("./components/sideBarAdmin.html")
        }
        await document.getElementById('home').classList.add('active')
        await document.getElementById("toogleMenu").addEventListener("click", toggleMenuChange)
        navBarRediretions()
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
    notification.solicitarSala()
}
async function onLoad(){
    const data = await verifyAndFetch(`http://13.37.66.226:3000/api/protectedRoute`);
    if(sessionStorage.getItem("rol") == 1){
        await addHtmlDocumentAtBeginning("./components/sideBar.html")
        await document.getElementById("otros").addEventListener("click", mostrarOtros)
    }else{
        await addHtmlDocumentAtBeginning("./components/sideBarAdmin.html")
    }
    await navBarRediretions()
    await document.getElementById("toogleMenu").addEventListener("click", toggleMenuChange)
}
async function insertCartas(){
    contenidoWeb.innerHTML =""
    await fetch("seccionCartas.html")
    .then(data => data.text())
    .then(data =>{
        contenidoWeb.insertAdjacentHTML("beforeend", data)
    })
    funcionesCartas.imgCartas()
    console.log("hola")
}

function mostrarOtros(){
    if(desplegableNavBar.style.visibility == "hidden" || desplegableNavBar.style.visibility == ""){
        desplegableNavBar.style.visibility="visible"
    }else{
        desplegableNavBar.style.visibility="hidden"
    }
}
function toggleMenuChange(){
    console.log("as")
    let titulos = document.querySelectorAll("span h3")


    if(!ocultoMenu){
        titulos.forEach(element => {
            element.style.display = "block"
        });
        toogleMenu.style.left="255px";
        containerSidebar.classList.remove("menuOculto")
        containerSidebar.classList.add("menuDesplegado")
        document.querySelector("#toogleMenu img").src = "src/icons/arrow-left.svg"

        ocultoMenu=true
    }else{
        titulos.forEach(element => {
            element.style.display = "none"
        });
        containerSidebar.classList.add("menuOculto")
        containerSidebar.classList.remove("menuDesplegado")
        toogleMenu.style.left="85px";
        document.querySelector("#toogleMenu img").src = "src/icons/arrow-rigth.svg"

        ocultoMenu=false
    }
}

function navBarRediretions(){
    let navegacion = document.querySelectorAll(".redireccion span")
    console.log(navegacion)
    navegacion.forEach(element => {
        element.addEventListener("click", redireccion)
    });

    navegacion = document.querySelectorAll("#containerSidebarMovil span")
    navegacion.forEach(element => {
        element.addEventListener("mouseover", cambioIconoIn)
        element.addEventListener("mouseout", cambioIconoOut)
    });
    navegacion = document.querySelectorAll("#desplegableNavBar span")
    navegacion.forEach(element => {
        element.addEventListener("mouseover", cambioIconoIn)
        element.addEventListener("mouseout", cambioIconoOut)
        element.addEventListener("click", redireccion)
    });
}
function cambioIconoIn(){
    if(!this.classList.contains("active")){
        this.querySelector("img").src = "./src/icons/"+this.querySelector("h3").innerText+"black.svg"
    }
}
function cambioIconoOut(){
    if(!this.classList.contains("active")){
        this.querySelector("img").src = "./src/icons/"+this.querySelector("h3").innerText+"white.svg"
    }
}
function redireccion(){
    let redireccion = this.querySelector("h3").innerText.replace(/\s/g, "").toLowerCase()
    console.log(redireccion)
    if(redireccion=="logout"){
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = "/login";
    }
    if(redireccion=="eventos" && sessionStorage.getItem("rol") == 2){
        console.log(redireccion)
        window.location.href = "/torneoAdmin";
    }
    else if(window.location.pathname != ("/"+redireccion) && redireccion != "otros"){
        window.location.href = "/"+redireccion;
    }
}

// Función para cargar y añadir la sección de HTML
async function addHtmlDocumentAtBeginning(url) {
    try {
        // Cargar el documento HTML desde la URL proporcionada
        const response = await fetch(url);
        const htmlContent = await response.text();

        // Crear un elemento div temporal y asignar el contenido HTML cargado
        const tempElement = document.createElement('div');
        tempElement.innerHTML = htmlContent;

        // Seleccionar el cuerpo del documento destino
        const body = document.body;

        // Insertar todo el contenido del archivo HTML cargado al principio del body
        while (tempElement.firstChild) {
            body.insertBefore(tempElement.firstChild, body.firstChild);
        }
    } catch (error) {
        console.error('Error al cargar o añadir el documento HTML:', error);
    }
}


export const methods = {
    toggleMenuChange,
    navBarRediretions,
    addHtmlDocumentAtBeginning, 
    onLoad
}