import { methods as windowOnLoad } from "./sideBar.js";
let elementoDrag,copia;
let mazo = {
    "eggDeck": [],
    "deck": []
};
window.onload = async() => {
    await windowOnLoad.addHtmlDocumentAtBeginning("./components/sideBar.html")
    await document.getElementById('deckbuilder').classList.add('active')
    await document.getElementById("toogleMenu").addEventListener("click", windowOnLoad.toggleMenuChange)
    await document.getElementById("dropZone").addEventListener("drop", drop)
    await document.getElementById("dropZone").addEventListener("dragover", allowDrop)

    windowOnLoad.navBarRediretions()
    imgCartas()    
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
    console.log(eggDeck)
    console.log(element)
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
            eggDeck++;
        }
    }else if(element.dataset.type != "Digi-Egg"){
        if(deck<50){
            if (typeof mazo["deck"][element.dataset.cardnumber] !== 'number') {
                mazo["deck"][element.dataset.cardnumber] = 1;
                copia = element
                copia.draggable = "false"
                copia.removeEventListener("click",añadirCartaMazo)
                copia.removeEventListener("dragstart", drag);
                copia.removeEventListener("drop", drop);
                copia.classList.add('no-drop');
                copia.removeEventListener("click",añadirCartaMazo)
                copia.removeEventListener("dragstart", drop)
                copia.addEventListener("click", restarCartaMazo)
                dropZone.appendChild(copia.cloneNode(true));
                deck++;
            }else if (mazo["deck"][element.dataset.cardnumber] < 4) {
                mazo["deck"][element.dataset.cardnumber] += 1;
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
// REALIZAR EL DRAG AND DROP
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    elementoDrag = this;
}

function drop(ev) {
    ev.preventDefault();
    console.log(elementoDrag)
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