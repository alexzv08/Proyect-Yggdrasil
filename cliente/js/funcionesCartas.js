import { methods as windowOnLoad} from "./sideBar.js";
let elementoDrag, copia;
let listaFiltro = {
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
    await document.getElementById("dropZone").addEventListener("drop", drop)
    await document.getElementById("dropZone").addEventListener("dragover", allowDrop)
    windowOnLoad.navBarRediretions()
    imgCartas()    
    document.querySelector("#search").addEventListener("click", filtroBusqueda)
}

function imgCartas(){
    // fetch("https://digimoncard.io/api-public/search.php?sort=code&series=Digimon Card Game")
    fetch("https://digimoncard.io/api-public/search.php?n=Agumon&sort=power&series=Digimon Card Game")
    .then(data => data.json())
    .then(data =>{
        console.log(data)
        data.forEach(element => {
            cargarImg(element)
        });
    })  
}
function cargarImg(element){
    let div = document.createElement("div")
    div.addEventListener("click", eventoClick)
    div.addEventListener("dragstart", drag)
    div.draggable="true"
    div.dataset.nombre =  element.name 
    div.dataset.cardnumber =  element.cardnumber 
    div.dataset.color =  element.color
    div.dataset.type =  element.type
    let img = document.createElement("img")
    img.src = element.image_url
    containerListaCartas.appendChild(div)
    div.appendChild(img)
}
function eventoClick(){
    añadirCartaMazo(this)
}
let eggDeck = 0;
let deck = 0;
function añadirCartaMazo(element) {
    if (element.dataset.type == "Digi-Egg" && eggDeck < 5) {
        if (typeof mazo["eggDeck"][element.dataset.cardnumber] !== 'number') {
            mazo["eggDeck"][element.dataset.cardnumber] = 1;
            copia = element
            copia.draggable = "false"
            copia.removeEventListener("click",añadirCartaMazo)
            copia.removeEventListener("dragstart", drag);
            copia.removeEventListener("drop", drop);
            copia.classList.add('no-drop');
            copia.addEventListener("click", restarCartaMazo)
            dropZone.appendChild(copia.cloneNode(true));
            eggDeck++;
        }else if (mazo["eggDeck"][element.dataset.cardnumber] < 4) {
            mazo["eggDeck"][element.dataset.cardnumber] += 1;
            this.querySelector(".cantidad").innerText +=1
            eggDeck++;
        }
    }else if(element.dataset.type != "Digi-Egg"){
        if(deck<50){
            console.log(typeof mazo["deck"][element.dataset.cardnumber])
            if (typeof mazo["deck"][element.dataset.cardnumber] !== 'number') {
                mazo["deck"][element.dataset.cardnumber] = 1;
                copia = element.cloneNode(true)
                copia.draggable = "false"
                copia.removeEventListener("click",añadirCartaMazo)
                copia.removeEventListener("dragstart", drag);
                copia.removeEventListener("drop", drop);
                copia.classList.add('no-drop');
                añadirButtons(copia)
                dropZone.appendChild(copia);
                deck++;
            }else if (mazo["deck"][element.dataset.cardnumber] < 4) {
                mazo["deck"][element.dataset.cardnumber] += 1;
                
                deck++;
            }
        }
    }
    console.log(mazo)

}
function sumarCantidad(event){
    let element = event.target.parentNode;
    if (mazo["deck"][element.dataset.cardnumber] < 4) {
        element.querySelector(".cantidad").innerText =parseInt(element.querySelector(".cantidad").innerText) + 1
        mazo["deck"][element.dataset.cardnumber] = parseInt(element.querySelector(".cantidad").innerText);
        deck++;
    }
}
function restarCantidad(event){
    let element = event.target.parentNode;
    if (mazo["deck"][element.dataset.cardnumber] > 1) {
        element.querySelector(".cantidad").innerText =parseInt(element.querySelector(".cantidad").innerText) - 1
        mazo["deck"][element.dataset.cardnumber] = parseInt(element.querySelector(".cantidad").innerText);
        deck--;
    }
}
function añadirButtons(element){
    let divMas = document.createElement("img")
    divMas.src = "src/icons/plus-svgrepo-com.svg"
    divMas.classList.add("button")
    divMas.classList.add("mas")
    divMas.addEventListener("click", sumarCantidad)
    
    let divCantidad = document.createElement("div")
    divCantidad.innerText = "1"
    divCantidad.classList.add("button")
    divCantidad.classList.add("cantidad")
    divCantidad.addEventListener("click", sumarCantidad)


    let divMenos = document.createElement("img")
    divMenos.src = "src/icons/minus-svgrepo-com.svg"
    divMenos.classList.add("button")
    divMenos.classList.add("menos")
    divMenos.addEventListener("click", restarCantidad)

    element.appendChild(divMas)
    element.appendChild(divCantidad)
    element.appendChild(divMenos)
}
function restarCartaMazo(){
    if (this.dataset.type == "Digi-Egg") {
        mazo["eggDeck"][this.dataset.cardnumber] -= 1;
    }else{
        mazo["deck"][this.dataset.cardnumber] -= 1;
    }
}

function limpiarMazo(){
    if(deck>0 || eggDeck>0){
        if(window.confirm("Se va a limpiar el mazo. ¿Estas seguro?")){
            dropZone.innerText = ''
            deck=0
            eggDeck=0
            mazo["eggDeck"]=[]
            mazo["deck"]=[]
        }
    }
}

function filtroBusqueda(event){
    event.preventDefault()
    console.log("hey")

    document.querySelectorAll("#FiltroEdicion input").forEach(element => {
        if(element.checked){
            listaFiltro.ListaEdiciones.push(element.value);
        }
    });
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

    console.log(listaFiltro)

    creacionSentenciaSQL(listaFiltro)
}

async function creacionSentenciaSQL(listaFiltro){
        // Inicializar la parte de la sentencia SQL que siempre estará presente
        var sql = "SELECT * FROM cartas WHERE 1 = 1";
    
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
        sql += oderBy.value;
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
    console.log(resJson.result[0])
    containerListaCartas.innerHTML = '' 
    await resJson.result[0].forEach(element => {
        cargarImg(element)
    });
    
}

// REALIZAR EL DRAG AND DROP{
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    elementoDrag = this;
}

function drop(ev) {
    ev.preventDefault();
    if (!elementoDrag.classList.contains('no-drop')) {
        añadirCartaMazo(elementoDrag)
    }
    // var copia = ev.dataTransfer.getData("text");
    // dropZone.appendChild(copia.cloneNode(copia));
}
export const methods = {
    imgCartas: imgCartas,
    cargarImg: cargarImg,
}
//}