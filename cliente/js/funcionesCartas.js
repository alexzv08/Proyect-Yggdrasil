import { methods as windowOnLoad } from "./sideBar.js";
let elementoDrag;
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
async function onLoad() {
    await windowOnLoad.addHtmlDocumentAtBeginning("./components/sideBar.html")
    await document.getElementById('deckbuilder').classList.add('active')
    await document.getElementById("toogleMenu").addEventListener("click", windowOnLoad.toggleMenuChange)
    windowOnLoad.navBarRediretions()
    imgCartas()    
    document.getElementById("search").addEventListener("click", filtroBusqueda)
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
    div.addEventListener("click", añadirCartaMazo)
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
let eggDeck = 0;
let deck = 0;
function añadirCartaMazo() {
    if (this.dataset.type == "Digi-Egg" && eggDeck < 5) {
        if (typeof mazo["eggDeck"][this.dataset.cardnumber] !== 'number') {
            mazo["eggDeck"][this.dataset.cardnumber] = 0;
            dropZone.appendChild(this.cloneNode(true));
            eggDeck++;
        }
        if (mazo["eggDeck"][this.dataset.cardnumber] < 4) {
            mazo["eggDeck"][this.dataset.cardnumber] += 1;
            eggDeck++;
        }
    }else{
        if(deck<50){
            if (typeof mazo["deck"][this.dataset.cardnumber] !== 'number') {
                mazo["deck"][this.dataset.cardnumber] = 0;
                copia = this.cloneNode(true)
                copia.removeEventListener("click",añadirCartaMazo)
                copia.removeEventListener("dragstart", drag)
                copia.addEventListener("click", restarCartaMazo)
                dropZone.appendChild(this.cloneNode(true));
                deck++;
            }
            if (mazo["deck"][this.dataset.cardnumber] < 4) {
                mazo["deck"][this.dataset.cardnumber] += 1;
                deck++;
            }
        }
    }
    console.log(mazo)
}
function restarCartaMazo(){
    if (this.dataset.type == "Digi-Egg") {
        mazo["eggDeck"][this.dataset.cardnumber] -= 1;
    }else{
        mazo["deck"][this.dataset.cardnumber] -= 1;
    }
}
function guardarMazo(){
    for (const element in mazo.eggDeck) {
        sql = 'INSERT INTO mazo_cartas ("idMazo", "DG","'+element.split("-")[0]+'", "'+element.split("-")[1]+'","'+mazo.eggDeck[element]+'")'  
        console.log(sql)
    }
    for (const element in mazo.deck) {
        sql = 'INSERT INTO mazo_cartas ("idMazo", "DG","'+element.split("-")[0]+'", "'+element.split("-")[1]+'","'+mazo.eggDeck[element]+'")'  
        console.log(sql)
    }
}
function limpiarMazo(){
    if(deck>0 || eggDeck>0){
        if(window.confirm("Se va a limpiar el mazo. ¿Estas seguro?")){
            listDeck.innerText = ''
            deck=0
            eggDeck=0
            mazo["eggDeck"]=[]
            mazo["deck"]=[]
            console.log(mazo)
        }
    }
}

function filtroBusqueda(event){
    event.preventDefault()
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
}
// REALIZAR EL DRAG AND DROP
// function allowDrop(ev) {
//     ev.preventDefault();
// }

// function drag(ev) {
//     ev.dataTransfer.setData("text", ev.target.id);
// }

// function drop(ev) {
//     ev.preventDefault();
//     console.log("dropeado")
//     var data = ev.dataTransfer.getData("text");
//     ev.target.appendChild(document.getElementById(data));
// }
export const methods = {
    imgCartas: imgCartas,
    cargarImg: cargarImg,
    onLoad: onLoad
}