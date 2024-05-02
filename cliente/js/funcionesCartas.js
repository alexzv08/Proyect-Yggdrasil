function onLoad() {
    console.log("h")
    imgCartas()    
}




function imgCartas(){
    fetch("https://digimoncard.io/api-public/search.php?sort=code&series=Digimon Card Game")
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
    div.dataset.nombre =  element.name 
    div.dataset.cardnumber =  element.cardnumber 
    div.dataset.color =  element.color
    div.dataset.type =  element.type
    let img = document.createElement("img")
    img.src = element.image_url
    containerListaCartas.appendChild(div)
    div.appendChild(img)
}

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

export const methods = {
    imgCartas: imgCartas,
    cargarImg: cargarImg,
    onLoad: onLoad
};