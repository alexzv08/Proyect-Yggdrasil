
let mazo = {
    "eggDeck": {},
    "deck": {}
};
let mostarEstadisticasToogle = true;
let mostarEstadisticasToogleMovil = true;
window.onload = async() => {
    desplegaDetalle.addEventListener("click", ocultarEstadisticas)
    desplegaDetalleMovil.addEventListener("click", ocultarEstadisticasMovil)
    guardarMazoB.addEventListener("click" , guardarMazo)
    guardarMazoBM.addEventListener("click" , guardarMazo)
    limpiarMazoB.addEventListener("click" , limpiarMazo)
    imgCartas()
}

function ocultarEstadisticas(){
    if(mostarEstadisticasToogle){
        detalles.style.display = "none"
        infoMazo.style.height = "10px"
        desplegaDetalle.style.top ="0px"
        mostarEstadisticasToogle =false
    }else{
        detalles.style.display = "flex"
        infoMazo.style.height = "120px"
        desplegaDetalle.style.top ="110px"
        mostarEstadisticasToogle =true

    }
    console.log("hey")
}
function ocultarEstadisticasMovil(){
    if(mostarEstadisticasToogleMovil){
        detallesMovil.style.display = "none"
        infoMazoMovil.style.height = "0px"
        infoMazoMovil.style.margin = "0px"
        infoMazoMovil.style.padding = "0px"
        desplegaDetalleMovil.style.top ="0px"
        mostarEstadisticasToogleMovil =false
    }else{
        detallesMovil.style.display = "flex"
        infoMazoMovil.style.height = "270px"
        desplegaDetalleMovil.style.top ="255px"
        infoMazoMovil.style.padding = "10px"
        mostarEstadisticasToogleMovil =true
    }
    console.log("hey")
}

function imgCartas(){
    fetch("https://digimoncard.io/api-public/search.php?n=Agumon&sort=power&series=Digimon Card Game")
    .then(data => data.json())
    .then(data =>{
        console.log(data)
        data.forEach(element => {
            cargarImg(element)
        });
        // imgCard.src = data[0].image_url
    })  
}

function cargarImg(element){
    let div = document.createElement("div")
    div.addEventListener("click", añadirCartaMazo)
    div.dataset.nombre =  element.name 
    div.dataset.cardnumber =  element.cardnumber 
    div.dataset.color =  element.color
    div.dataset.type =  element.type
    let img = document.createElement("img")
    img.src = element.image_url
    containerCartas.appendChild(div)
    div.appendChild(img)
}

let eggDeck = 0;
let deck = 0;
function añadirCartaMazo() {
        if (this.dataset.type == "Digi-Egg" && eggDeck < 5) {
            if (typeof mazo["eggDeck"][this.dataset.cardnumber] !== 'number') {
                mazo["eggDeck"][this.dataset.cardnumber] = 0;
                actualizarDeck(this);
            }
            if (mazo["eggDeck"][this.dataset.cardnumber] < 4) {
                mazo["eggDeck"][this.dataset.cardnumber] += 1;
                eggDeck++;
                console.log(eggDeck);
                document.getElementById(this.dataset.cardnumber).innerText =  this.dataset.nombre + " " + this.dataset.cardnumber + " X "+mazo["eggDeck"][this.dataset.cardnumber]
            }
        } else if(this.dataset.type != "Digi-Egg" && deck < 50){
            if (typeof mazo["deck"][this.dataset.cardnumber] !== 'number') {
                mazo["deck"][this.dataset.cardnumber] = 0;
                actualizarDeck(this);
            }
            if (mazo["deck"][this.dataset.cardnumber] < 4) {
                mazo["deck"][this.dataset.cardnumber] += 1;
                deck++;
                console.log(mazo["deck"]);
                document.getElementById(this.dataset.cardnumber).innerText =  this.dataset.nombre + " " + this.dataset.cardnumber + " X "+mazo["deck"][this.dataset.cardnumber]
            }
        }
}

function actualizarDeck(cardElement) {
    let div = document.createElement("div");
    div.style.backgroundColor = cardElement.dataset.color;
    div.id = cardElement.dataset.cardnumber
    listDeck.appendChild(div);
}

function guardarMazo(){
    for (const element in mazo.eggDeck) {
        sql = 'INSERT INTO listaCartasMazo ("idMazo", "DG","'+element.split("-")[0]+'", "'+element.split("-")[1]+'","'+mazo.eggDeck[element]+'")'  
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