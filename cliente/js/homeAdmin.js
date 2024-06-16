// import 'dotenv/config';


window.onload = async ()=>{
    try {
        const data = await verifyAndFetch(`http://localhost3000/api/protectedRoute`);
        await addHtmlDocumentAtBeginning("./components/sideBarAdmin.html")
        await document.getElementById('home').classList.add('active')
        await navBarRediretions()
        document.querySelectorAll(".infoPerfil div buton").forEach(element => {
            element.addEventListener("click", redireccionButton)
        });
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

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
function navBarRediretions(){
    let navegacion = document.querySelectorAll(".redireccion span")
    navegacion.forEach(element => {
        element.addEventListener("click", redireccion)
    });

    navegacion = document.querySelectorAll("#containerSidebarMovil span")
    navegacion.forEach(element => {
        element.addEventListener("mouseover", cambioIconoIn)
        element.addEventListener("mouseout", cambioIconoOut)
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
    if(redireccion=="logout"){
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = "/login";
    }
    if(redireccion=="eventos" && sessionStorage.getItem("rol") == 1){
        console.log(redireccion)
        window.location.href = "/torneoAdmin";
    }
    if(window.location.pathname != ("/"+redireccion) && redireccion != "otros"){
        // window.location.href = "/"+redireccion;
    }
}
function redireccionButton(){
    let redireccion = this.querySelector("p").dataset.red
    if(window.location.pathname != ("/"+redireccion) && redireccion != "otros"){
        console.log(redireccion)
        window.location.href = "/"+redireccion;
    }
}
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