// DEPENDENCIAS NECESARIAS PARA EL FUNCIONAMIENTO DE LA APLICACION
import { methods as windowOnLoad} from "./sideBar.js";
import { methods as notification } from "./notification.js";

// import 'dotenv/config';

let elementoDrag, copia, listaCartas, pagina, limiteActual, limitePaginacion;
// ARRAY PARA ALMACENAR EL FILTRO DE BUSQUEDA DE LAS CARTAS
let listaFiltro = {
    freeLetra: "",
    Nombre: "",
    coleccion: Boolean,
    ListaEdiciones: [],
    numCarta: "",
    textoCarta: "",
    rarezas: [],
    tipoCarta:[],
    level: [],
    colores: [],
    efectEvolve: [],
    formaEvo: [],
    atributo: [],
    minDP: [],
    maxDP: [],
    minCost: [],
    maxCost: [],
}

window.onload = async() => {
    // await windowOnLoad.addHtmlDocumentAtBeginning("./components/sideBar.html")
    await windowOnLoad.onLoad()
    await document.getElementById('deckbuilder').classList.add('active')
    await document.getElementById("toogleMenu").addEventListener("click", windowOnLoad.toggleMenuChange)
    windowOnLoad.navBarRediretions()
    notification.solicitarSala()

    await listaColecciones()
    await imgCartas() 
    document.querySelector("#search").addEventListener("click", filtroBusqueda)
    document.querySelector("#clear").addEventListener("click", clearForm)

    document.querySelectorAll("#paginacion .button")[0].addEventListener("click", paginaMenos)
    document.querySelectorAll("#paginacion .button")[1].addEventListener("click", paginaMas)

    iconoFiltroMovil.addEventListener("click", mostrarFiltroMovil)
}
function mostrarFiltroMovil() {
    if (filtroEscritorio.style.display === 'none' || filtroEscritorio.style.display === '') {
        filtroEscritorio.style.display = 'flex';

        let divCapa = document.createElement("div")
        divCapa.id ="capa"
        divCapa.addEventListener("click", () => {
            divCapa.remove()
            filtroEscritorio.style.display = 'none';
        })
        document.querySelector("#main-container").appendChild(divCapa)

    } else {
      filtroEscritorio.style.display = 'none';
    }
  }
// FUNCION EN LA QUE REALIZA UNA PETICION A LA API PARA OBTENER TODAS LAS CARTAS ALMACENADAS Y MOSTRARLAS EN LA PAGINA
async function imgCartas(){
    var sql = `SELECT c.*, COALESCE(uc.cantidad, 0) AS cantidad
    FROM cartas c
    LEFT JOIN usuarioColeccion uc ON c.id_coleccion = uc.id_coleccion AND c.id_carta = uc.id_carta
    AND uc.id_usuario = '${sessionStorage.getItem('user')}'
    WHERE 1 = 1
    ORDER BY c.id_coleccion ASC, c.id_carta ASC`;
    await peticionAPIFiltro(sql)
    await mostrarCartasColeccion()

}

function cargarImg2(element){
    console.log(element)
    let div = document.createElement("div")
    div.addEventListener("click", expandirCarta)
    div.classList.add("carta")
    div.dataset.nombre =  element.name
    div.dataset.cardnumber =  element.id_coleccion+"-"+element.id_carta.padStart(3, "0")
    div.dataset.color =  element.color
    div.dataset.cantidad =  element.cantidad > 0 ? element.cantidad : "0"
    let img = document.createElement("img")
    img.src = element.image_url
    element.cantidad > 0 ? img.classList.add("on") : img.classList.add("off")
    containerListaCartas.appendChild(div)

    let divContainer = document.createElement("div")
    divContainer.classList.add("containerButtons")

    let divMas = document.createElement("img")
    divMas.src = "src/icons/plus-svgrepo-com.svg"
    divMas.classList.add("button")
    divMas.classList.add("mas")
    divMas.addEventListener("click", sumarALaColeccion)
    
    let divCantidad = document.createElement("div")
    divCantidad.innerText = element.cantidad > 0 ? element.cantidad : "0"
    divCantidad.classList.add("button")
    divCantidad.classList.add("cantidad")

    let divMenos = document.createElement("img")
    divMenos.src = "src/icons/minus-svgrepo-com.svg"
    divMenos.classList.add("button")
    divMenos.classList.add("menos")
    divMenos.addEventListener("click", restarALaColeccion)

    div.appendChild(img)
    div.appendChild(divContainer)
    divContainer.appendChild(divMas)
    divContainer.appendChild(divCantidad)
    divContainer.appendChild(divMenos)
}

// FUNCION QUE AÑADE LA CARTA PINCHADA Y QUE GESTIONA LA CANTIDAD DE CARTAS QUE POSE EL USUARIO DE DICHA CARTA
async function añadirCartaColeccion(element) {
    if(parseInt(element.dataset.cantidad ) == 0){
        element.dataset.cantidad = parseInt(element.dataset.cantidad )+ 1
        const res = await fetch(`http://localhost:3000/api/anadirAColeccion`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                user: sessionStorage.getItem("user"),
                id_coleccion: element.dataset.cardnumber.split("-")[0],
                id_carta: element.dataset.cardnumber.split("-")[1],
                cantidad: element.dataset.cantidad
            })
        })
        element.childNodes[0].classList.remove("off")
        element.childNodes[1].childNodes[1].innerText = element.dataset.cantidad

    }else if(parseInt(element.dataset.cantidad ) > 0){
        element.dataset.cantidad = parseInt(element.dataset.cantidad ) + 1
        const res = await fetch(`http://localhost:3000/api/updateCartaColeccion`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                user: sessionStorage.getItem("user"),
                id_coleccion: element.dataset.cardnumber.split("-")[0],
                id_carta: element.dataset.cardnumber.split("-")[1],
                cantidad: element.dataset.cantidad
            })
        })
        element.childNodes[1].childNodes[1].innerText = element.dataset.cantidad
    }
    return element.dataset.cantidad
}
// FUNCION PARA RESTAR CARTAS A LA COLECCION O ELIMINAR CARTAS DE LA COLECCION
async function quitarCartaColeccion(element) {
    if(parseInt(element.dataset.cantidad ) > 0){
        element.dataset.cantidad = parseInt(element.dataset.cantidad )- 1
        if(parseInt(element.dataset.cantidad ) > 0){
            const res = await fetch(`http://localhost:3000/api/updateCartaColeccion`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    user: sessionStorage.getItem("user"),
                    id_coleccion: element.dataset.cardnumber.split("-")[0],
                    id_carta: element.dataset.cardnumber.split("-")[1],
                    cantidad: element.dataset.cantidad
                })
            })
        }else if(parseInt(element.dataset.cantidad ) == 0){
            const res = await fetch(`http://localhost:3000/api/eliminarCartaColeccion`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    user: sessionStorage.getItem("user"),
                    id_coleccion: element.dataset.cardnumber.split("-")[0],
                    id_carta: element.dataset.cardnumber.split("-")[1],
                })
            })
            element.childNodes[0].classList.add("off")
        }
        element.childNodes[1].childNodes[1].innerText = element.dataset.cantidad

    }
}
// FUNCION PARA AÑADIR 1 CARTA A LA COLECCION ATRAVES DEL BOTON DE SUMAR
function sumarALaColeccion(event){
    event.stopPropagation()
    añadirCartaColeccion(this.parentNode.parentNode)
}
// FUNCION PARA RESTAR 1 CARTA A LA COLECCION ATRAVES DEL BOTON DE RESTAR, SI LLEGA A 0 CARTAS SE ELIMINA DE LA COLECCION
function restarALaColeccion(event){
    event.stopPropagation()
    quitarCartaColeccion(this.parentNode.parentNode)
}
// FUNCION PARA RECUPERAR QUE CARTAS TIENE EL USUARIO EN SU COLECCION Y MOSTRAR LAS CARTAS QUE POSEE
async function mostrarCartasColeccion(){
    const res = await fetch(`http://localhost:3000/api/cartasColeccionUsuario`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            user: sessionStorage.getItem("user"),
        })
    })
    const resJson = await res.json()
    console.log(resJson)
    await resJson.result[0].forEach(element => {
        let allCard = document.querySelectorAll("#containerListaCartas>.carta")
        allCard.forEach(card => {
            if(card.dataset.cardnumber == (element.id_coleccion+"-"+element.id_carta)){
                card.childNodes[0].classList.remove("off")
                card.dataset.cantidad = element.cantidad
                card.childNodes[1].childNodes[1].innerText = element.cantidad ? element.cantidad : "0"
            }
        });
    });
}
// FUNCION PARA RELLENAR EL ARRAY CON LOS DATOS DEL FILTRO
function filtroBusqueda(event){
    event.preventDefault()

    // listaFiltro.freeLetra = document.querySelector("#freeLetra").value
    listaFiltro.nombre = document.querySelector("#nombre").value

    document.querySelectorAll("#FiltroEdicion input").forEach(element => {
        if(element.checked){
            listaFiltro.ListaEdiciones.push(element.value);
        }
    });
    listaFiltro.coleccion = document.querySelector("#coleccion div input").checked
    listaFiltro.numCarta = numCarta.value
    listaFiltro.textoCarta = textoCarta.value
    document.querySelectorAll("#rarezas div input").forEach(element => {
        if(element.checked){
            listaFiltro.rarezas.push(element.value);
        }
    });
    document.querySelectorAll("#tipoCarta div input").forEach(element => {
        if(element.checked){
            listaFiltro.tipoCarta.push(element.value);
        }
    });
    document.querySelectorAll("#level div input").forEach(element => {
        if(element.checked){
            listaFiltro.level.push(element.value);
        }
    });
    document.querySelectorAll("#colores div input").forEach(element => {
        if(element.checked){
            listaFiltro.colores.push(element.value);
        }
    });
    listaFiltro.efectEvolve = efectEvolve.value
    document.querySelectorAll("#formaEvo div input").forEach(element => {
        if(element.checked){
            listaFiltro.formaEvo.push(element.value);
        }
    });
    document.querySelectorAll("#atributo div input").forEach(element => {
        if(element.checked){
            listaFiltro.atributo.push(element.value);
        }
    });
    listaFiltro.minDP = minDP.value
    listaFiltro.maxDP = maxDP.value
    listaFiltro.minCost = minCost.value
    listaFiltro.maxCost = maxCost.value

    creacionSentenciaSQL(listaFiltro)
}
// FUNTION FOR CREATE SQL SENTENCE
async function creacionSentenciaSQL(listaFiltro){

        var sql = "SELECT c.* FROM cartas c WHERE 1 = 1";

        if (listaFiltro.nombre !== "") {
            sql += " AND name = '" + listaFiltro.nombre + "'";
        }

        if (listaFiltro.ListaEdiciones.length > 0) {
            sql += " AND id_coleccion IN ('" + listaFiltro.ListaEdiciones.join("','") + "')";
        }
        if (listaFiltro.numCarta !== "") {
            sql += " AND id_carta = '" + listaFiltro.numCarta + "'";
        }
        if (listaFiltro.textoCarta !== "") {
            sql += " AND maineffect LIKE '%" + listaFiltro.textoCarta + "%'";
        }
        if (listaFiltro.rarezas.length > 0) {
            sql += " AND cardrarity IN ('" + listaFiltro.rarezas.join("','") + "')";
        }
        if (listaFiltro.tipoCarta.length > 0) {
            sql += " AND type IN ('" + listaFiltro.tipoCarta.join("','") + "')";
        }
        if (listaFiltro.level.length > 0) {
            sql += " AND level IN ('" + listaFiltro.level.join("','") + "')";
        }
        if (listaFiltro.colores.length > 0) {
            sql += " AND color IN ('" + listaFiltro.colores.join("','") + "')";
        }
        if (listaFiltro.formaEvo.length > 0) {
            sql += " AND stage IN ('" + listaFiltro.formaEvo.join("','") + "')";
        }
        if (listaFiltro.atributo.length > 0) {
            sql += " AND digi_type IN ('" + listaFiltro.atributo.join("','") + "')";
        }
        if (listaFiltro.minDP !== "" && listaFiltro.maxDP !== "") {
            sql += " AND dp BETWEEN " + listaFiltro.minDP + " AND " + listaFiltro.maxDP;
        }
        if (listaFiltro.minCost !== "" && listaFiltro.maxCost !== "") {
            sql += " AND play_cost BETWEEN " + listaFiltro.minCost + " AND " + listaFiltro.maxCost;
        }

        if (listaFiltro.coleccion) {
            sql += " AND (c.id_carta, c.id_coleccion, c.id_juego) IN ( SELECT id_carta, id_coleccion, id_juego FROM usuarioColeccion WHERE id_usuario = '" + sessionStorage.getItem('user') + "')";
        }
        sql += " ORDER BY c.id_coleccion ASC, c.id_carta ASC";
        console.log(sql);
        peticionAPIFiltro(sql)
}
// FUNCION PARA REALIZAR LA PETICION A LA API CON LA SENTENCIA SQL Y FILTRAR LAS CARTAS DEPENDIENDO DE LOS FILTROS
async function peticionAPIFiltro(sql){
    pagina = 1;
    limiteActual=0
    const res = await fetch(`http://localhost:3000/api/filtroCartas`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            sql: sql
        })
    })
    if(!res.ok){
        return
    }
    const resJson = await res.json()
    console.log(resJson)
    listaCartas = resJson.result[0]
    limitePaginacion = Math.ceil(listaCartas.length/20)
    containerListaCartas.innerHTML = '' 
    for (let limiteActual = 0; limiteActual < listaCartas.length && limiteActual < (pagina * 20); limiteActual++) {
        console.log(limiteActual);
        cargarImg2(listaCartas[limiteActual]);
        containerListaCartas.scrollTop = 0;
    }
    await mostrarCartasColeccion()
}

async function listaColecciones(){
    const res = await fetch(`http://localhost:3000/api/listaColecciones`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
    })
    if(!res.ok){
        return
    }
    const resJson = await res.json()
    containerListaCartas.innerHTML = '' 
    await resJson.result.forEach(element => {
        let label = document.createElement("label")
        label.innerText = element.id_coleccion

        let input = document.createElement("input")
        input.type = "checkbox"
        input.value = element.id_coleccion

        label.appendChild(input)
        FiltroEdicion.appendChild(label)
    });
}
async function paginaMas() {
    if (pagina >= limitePaginacion) {
        return;
    }
    containerListaCartas.innerHTML = '';

    pagina++;
    
    let limiteInferior = (pagina - 1) * 20;
    let limiteSuperior = Math.min(pagina * 20, listaCartas.length);

    for (let i = limiteInferior; i < limiteSuperior; i++) {
        cargarImg2(listaCartas[i]);
    }
    document.querySelector("#pagina").innerText = pagina;
    containerListaCartas.scrollTop = 0;
}

async function paginaMenos() {
    if (pagina <= 1) {
        return;
    }
    containerListaCartas.innerHTML = '';

    pagina--;
    
    let limiteInferior = (pagina - 1) * 20;
    let limiteSuperior = Math.min(pagina * 20, listaCartas.length);

    for (let i = limiteInferior; i < limiteSuperior; i++) {
        cargarImg2(listaCartas[i]);
    }
    document.querySelector("#pagina").innerText = pagina;
    containerListaCartas.scrollTop = 0;

}

function expandirCarta(){
    let divCapa = document.createElement("div")
    divCapa.id ="capa"
    divCapa.addEventListener("click", () => {
        divCapa.remove()
    })

    let divCarta = document.createElement("div")
    divCarta.id = "cartaMostrar"

    let img = document.createElement("img")
    img.src = this.querySelector("img").src

    document.querySelector("#main-container").appendChild(divCapa)
    divCapa.appendChild(divCarta)
    divCarta.appendChild(img)
}
function clearForm(event) {
    event.preventDefault()
    document.getElementById("myform").reset();
}

export const methods = {
    imgCartas: imgCartas,
}


