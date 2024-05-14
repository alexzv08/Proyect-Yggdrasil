import { methods as windowOnLoad} from "./sideBar.js";
let elementoDrag, copia;
let listaFiltro = {
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
let mazo = {
    "eggDeck": [],
    "deck": []
};

window.onload = async() => {
    // await windowOnLoad.addHtmlDocumentAtBeginning("./components/sideBar.html")
    await windowOnLoad.onLoad()
    await document.getElementById('deckbuilder').classList.add('active')
    await document.getElementById("toogleMenu").addEventListener("click", windowOnLoad.toggleMenuChange)
    windowOnLoad.navBarRediretions()
    await listaColecciones()
    await imgCartas() 
    document.querySelector("#search").addEventListener("click", filtroBusqueda)
}

async function imgCartas(){
    // fetch("https://digimoncard.io/api-public/search.php?sort=code&series=Digimon Card Game")
    await fetch("https://digimoncard.io/api-public/search.php?n=Agumon&sort=power&series=Digimon Card Game")
    .then(data => data.json())
    .then(data =>{
        console.log(data)
        data.forEach(element => {
            cargarImg(element)
        });
    })  
    await mostrarCartasColeccion()

}
// TODO
// REFACTORIZAR LA FORMA DE CARGAR LAS IMAGENES
function cargarImg(element){
    let div = document.createElement("div")
    div.addEventListener("click", eventoClick)
    div.classList.add("carta")
    div.dataset.nombre =  element.name
    div.dataset.cardnumber =  element.cardnumber 
    div.dataset.color =  element.color
    div.dataset.cantidad =  "0"
    let img = document.createElement("img")
    img.src = element.image_url
    img.classList.add("off")
    containerListaCartas.appendChild(div)

    let divMas = document.createElement("img")
    divMas.src = "src/icons/plus-svgrepo-com.svg"
    divMas.classList.add("button")
    divMas.classList.add("mas")
    divMas.addEventListener("click", sumarALaColeccion)
    
    let divCantidad = document.createElement("div")
    divCantidad.innerText = "0"
    divCantidad.classList.add("button")
    divCantidad.classList.add("cantidad")

    let divMenos = document.createElement("img")
    divMenos.src = "src/icons/minus-svgrepo-com.svg"
    divMenos.classList.add("button")
    divMenos.classList.add("menos")
    divMenos.addEventListener("click", restarALaColeccion)

    div.appendChild(img)
    div.appendChild(divMas)
    div.appendChild(divCantidad)
    div.appendChild(divMenos)
    
}

function cargarImg2(element){
    let div = document.createElement("div")
    div.addEventListener("click", eventoClick)
    div.classList.add("carta")
    div.dataset.nombre =  element.name
    div.dataset.cardnumber =  element.id_coleccion+"-"+element.id_carta.padStart(3, "0")
    div.dataset.color =  element.color
    div.dataset.cantidad =  "0"
    let img = document.createElement("img")
    img.src = element.image_url
    img.classList.add("off")
    containerListaCartas.appendChild(div)

    let divMas = document.createElement("img")
    divMas.src = "src/icons/plus-svgrepo-com.svg"
    divMas.classList.add("button")
    divMas.classList.add("mas")
    divMas.addEventListener("click", sumarALaColeccion)
    
    let divCantidad = document.createElement("div")
    divCantidad.innerText = "0"
    divCantidad.classList.add("button")
    divCantidad.classList.add("cantidad")

    let divMenos = document.createElement("img")
    divMenos.src = "src/icons/minus-svgrepo-com.svg"
    divMenos.classList.add("button")
    divMenos.classList.add("menos")
    divMenos.addEventListener("click", restarALaColeccion)

    div.appendChild(img)
    div.appendChild(divMas)
    div.appendChild(divCantidad)
    div.appendChild(divMenos)
    
}
function eventoClick(){
    let cantidad = añadirCartaColeccion(this)
    if(parseInt(this.dataset.cantidad) > 0){
        this.classList.remove("off")
    }
    this.dataset.calntidad = cantidad
}

async function añadirCartaColeccion(element) {
    if(parseInt(element.dataset.cantidad ) == 0){
        element.dataset.cantidad = parseInt(element.dataset.cantidad )+ 1
        const res = await fetch("http://localhost:3000/api/anadirAColeccion",{
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
        element.childNodes[2].innerText = element.dataset.cantidad

    }else if(parseInt(element.dataset.cantidad ) > 0){
        element.dataset.cantidad = parseInt(element.dataset.cantidad ) + 1
        const res = await fetch("http://localhost:3000/api/updateCartaColeccion",{
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
        element.childNodes[2].innerText = element.dataset.cantidad
    }
    return element.dataset.cantidad
}
async function quitarCartaColeccion(element) {
    if(parseInt(element.dataset.cantidad ) > 0){
        element.dataset.cantidad = parseInt(element.dataset.cantidad )- 1
        if(parseInt(element.dataset.cantidad ) > 0){
            const res = await fetch("http://localhost:3000/api/updateCartaColeccion",{
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
            const res = await fetch("http://localhost:3000/api/eliminarCartaColeccion",{
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
        element.childNodes[2].innerText = element.dataset.cantidad
    }
}

function sumarALaColeccion(event){
    event.stopPropagation()
    console.log(this.parentNode)
    añadirCartaColeccion(this.parentNode)
}
function restarALaColeccion(event){
    event.stopPropagation()
    quitarCartaColeccion(this.parentNode)
}

async function mostrarCartasColeccion(){
    const res = await fetch("http://localhost:3000/api/cartasColeccionUsuario",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            user: sessionStorage.getItem("user"),
        })
    })
    const resJson = await res.json()
    await resJson.result[0].forEach(element => {
        let allCard = document.querySelectorAll("#containerListaCartas>.carta")
        console.log(allCard)
        allCard.forEach(card => {
            console.log(card.dataset.cardnumber)

            if(card.dataset.cardnumber == (element.id_coleccion+"-"+element.id_carta)){
                card.childNodes[0].classList.remove("off")
                card.dataset.cantidad = element.cantidad
                card.childNodes[2].innerText = element.cantidad
            }
        });
    });
}

function filtroBusqueda(event){
    event.preventDefault()

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

async function creacionSentenciaSQL(listaFiltro){
        // Inicializar la parte de la sentencia SQL que siempre estará presente
        var sql = "SELECT c.* FROM cartas c WHERE 1 = 1";

        // Agregar condiciones basadas en los filtros seleccionados
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

        // Agregar filtro para mostrar solo las cartas de la colección del usuario si se especifica
        if (listaFiltro.coleccion) {
            sql += " AND (c.id_carta, c.id_coleccion, c.id_juego) IN ( SELECT id_carta, id_coleccion, id_juego FROM usuarioColeccion WHERE id_usuario = '" + sessionStorage.getItem('user') + "')";
        }
        console.log(sql);
        peticionAPIFiltro(sql)
        // HACER CONSULTA A LA API
}
async function peticionAPIFiltro(sql){
    const res = await fetch("http://localhost:3000/api/filtroCartas",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            sql: sql
        })
    })
    if(!res.ok){
        // alert("Usuario o contraseña incorrecta")
        return
    }
    const resJson = await res.json()
    containerListaCartas.innerHTML = '' 
    await resJson.result[0].forEach(element => {
        console.log(element)
        cargarImg2(element)
    });
    await mostrarCartasColeccion()
}
async function listaColecciones(){
    const res = await fetch("http://localhost:3000/api/listaColecciones",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
    })
    if(!res.ok){
        // alert("Usuario o contraseña incorrecta")
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

export const methods = {
    imgCartas: imgCartas,
    cargarImg: cargarImg,
}
