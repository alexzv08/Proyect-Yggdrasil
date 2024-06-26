// DEPENDENCIAS NECESARIAS
import { methods as windowOnLoad} from "./sideBar.js";
import { methods as notification } from "./notification.js";
// import 'dotenv/config';


let elementoDrag, copia,listaCartas, pagina, limiteActual, limitePaginacion;
// ARRAY CON LOS FILTROS DE BUSQUEDA
let listaFiltro = {
    nombre: "",
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
window.onresize = reportWindowSize;

function reportWindowSize() {
    if(window.innerWidth<=800){
        filtroEscritorio.style.display = "none"    
    }
    if(window.innerWidth>800){
        filtroEscritorio.style.display = "flex"    

    }
    if(window.innerWidth > 400){
        
    }
}
window.onload = async() => {
    await windowOnLoad.addHtmlDocumentAtBeginning("./components/sideBar.html")
    await windowOnLoad.onLoad()
    await listaColecciones()
    await document.getElementById('deckbuilder').classList.add('active')
    await document.getElementById("toogleMenu").addEventListener("click", windowOnLoad.toggleMenuChange)
    await document.getElementById("dropZone").addEventListener("drop", drop)
    await document.getElementById("dropZone").addEventListener("dragover", allowDrop)
    // await document.getElementById("dropZone").addEventListener("touchend", touchEnd)
    await document.getElementById("filtroButton").addEventListener("click", mostrarFiltro)
    windowOnLoad.navBarRediretions()
    imgCartas()    
    document.querySelector("#search").addEventListener("click", filtroBusqueda);
    await document.getElementById('deckbuilder2').classList.add('active')
    document.querySelector('#deckbuilder2 img').src = "src/icons/decksblack.svg"
    clearMazo.addEventListener("click", limpiarMazo)
    await cargarMazo();
    document.querySelectorAll("#paginacion .button")[0].addEventListener("click", paginaMenos)
    document.querySelectorAll("#paginacion .button")[1].addEventListener("click", paginaMas)
    notification.solicitarSala()

}
// FUNCION PARA CARGAR LAS IMAGENES DE LAS CARTAS
function imgCartas(){
    var sql = "SELECT c.* FROM cartas c WHERE 1 = 1";
    peticionAPIFiltro(sql)
}
// FUNCION PARA CARLAS LAS IMAGENES DE LAS CARTAS
function cargarImg(element){
    // console.log(element)
    let div = document.createElement("div")
    div.addEventListener("click", expandirCarta)
    div.addEventListener("dragstart", drag)
    div.addEventListener('touchmove', touchMove)
    div.addEventListener('touchstart', touchStart)
    div.addEventListener('touchend', touchEnd)
    div.draggable="true"
    div.style.display = "block"
    div.style.cursor = "pointer"
    div.dataset.nombre =  element.name 
    div.dataset.cardnumber =  element.id_coleccion+"-"+element.id_carta.padStart(3, "0")
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
// FUNCION PARA AÑADIR LAS CARTAS AL CONTENEDOR DEL MAZO Y HACER LOS INSERTS A LA BBDD
function añadirCartaMazo(element) {
    if (element.dataset.type == "Digi-Egg" && eggDeck < 5) {
        if (typeof mazo["eggDeck"][element.dataset.cardnumber] !== 'number') {
            mazo["eggDeck"][element.dataset.cardnumber] = 1;
            copia = element.cloneNode(true)
            copia.draggable = "false"
            copia.removeEventListener("click",añadirCartaMazo)
            copia.removeEventListener("dragstart", drag);
            copia.removeEventListener("drop", drop);
            copia.classList.add('no-drop');
            // copia.addEventListener("click", restarCartaMazo)
            añadirButtons(copia,"1")
            dropZone.appendChild(copia);
            eggDeck++;
            insertCartaMazo(element.dataset.cardnumber.split("-")[1],element.dataset.cardnumber.split("-")[0])
        }else if (mazo["eggDeck"][element.dataset.cardnumber] < 4) {
            mazo["eggDeck"][element.dataset.cardnumber] += 1;
            element.querySelector(".cantidad").innerText +=1
            eggDeck++;
            updateCartaMazo(element.dataset.cardnumber.split("-")[1],element.dataset.cardnumber.split("-")[0],parseInt(mazo["eggDeck"][element.dataset.cardnumber]))
        }
    }else if(element.dataset.type != "Digi-Egg"){
        if(deck<50){
            if (typeof mazo["deck"][element.dataset.cardnumber] !== 'number') {
                mazo["deck"][element.dataset.cardnumber] = 1;
                copia = element.cloneNode(true)
                copia.draggable = "false"
                copia.removeEventListener("click",añadirCartaMazo)
                copia.removeEventListener("dragstart", drag);
                copia.removeEventListener("drop", drop);
                copia.classList.add('no-drop');
                // copia.addEventListener("click", restarCartaMazo)
                añadirButtons(copia,"1")
                dropZone.appendChild(copia);
                deck++;
                insertCartaMazo(element.dataset.cardnumber.split("-")[1],element.dataset.cardnumber.split("-")[0])
            }else if (mazo["deck"][element.dataset.cardnumber] < 4) {
                mazo["deck"][element.dataset.cardnumber] += 1;
                deck++;
                updateCartaMazo(element.dataset.cardnumber.split("-")[1],element.dataset.cardnumber.split("-")[0],parseInt(mazo["deck"][element.dataset.cardnumber]))
            }
        }
    }
}
// FUNCION DE SUMAR CANTIDAD DE CARTAS QUE SE AÑADEN AL MAZO Y MODIFICAR EN LA BBDD
function sumarCantidad(event){
    let element = event.target.parentNode;
    if(element.dataset.type == "Digi-Egg"){
        if (mazo["eggDeck"][element.dataset.cardnumber] < 4) {
            element.querySelector(".cantidad").innerText =parseInt(element.querySelector(".cantidad").innerText) + 1
            mazo["eggDeck"][element.dataset.cardnumber] = parseInt(element.querySelector(".cantidad").innerText);
            deck++;
            updateCartaMazo(element.dataset.cardnumber.split("-")[1],element.dataset.cardnumber.split("-")[0],parseInt(mazo["eggDeck"][element.dataset.cardnumber]))
        }
    }else{
        if (mazo["deck"][element.dataset.cardnumber] < 4) {
            element.querySelector(".cantidad").innerText =parseInt(element.querySelector(".cantidad").innerText) + 1
            mazo["deck"][element.dataset.cardnumber] = parseInt(element.querySelector(".cantidad").innerText);
            deck++;
            updateCartaMazo(element.dataset.cardnumber.split("-")[1],element.dataset.cardnumber.split("-")[0],parseInt(mazo["deck"][element.dataset.cardnumber]))
        }
    }
}
// FUNCION DE SUMAR CANTIDAD DE CARTAS QUE SE AÑADEN AL MAZO Y MODIFICAR O LIMINAR DE LA BBDD
function restarCantidad(event){
    let element = event.target.parentNode;

    if(element.dataset.type == "Digi-Egg"){
        if (mazo["eggDeck"][element.dataset.cardnumber] <= 4) {
            element.querySelector(".cantidad").innerText =parseInt(element.querySelector(".cantidad").innerText) - 1
            mazo["eggDeck"][element.dataset.cardnumber] = parseInt(element.querySelector(".cantidad").innerText);
            deck--;
            if(parseInt(element.querySelector(".cantidad").innerText) == 0){
                removeCartaMazo(element.dataset.cardnumber.split("-")[1],element.dataset.cardnumber.split("-")[0])
                element.remove()
                delete mazo["eggDeck"][element.dataset.cardnumber];
            }else{
                updateCartaMazo(element.dataset.cardnumber.split("-")[1],element.dataset.cardnumber.split("-")[0],parseInt(mazo["eggDeck"][element.dataset.cardnumber]))
            }
        }
    }else{
        if (mazo["deck"][element.dataset.cardnumber] <= 4) {

            element.querySelector(".cantidad").innerText =parseInt(element.querySelector(".cantidad").innerText) - 1
            mazo["deck"][element.dataset.cardnumber] = parseInt(element.querySelector(".cantidad").innerText);
            deck--;
            if(parseInt(element.querySelector(".cantidad").innerText) == 0){
                removeCartaMazo(element.dataset.cardnumber.split("-")[1],element.dataset.cardnumber.split("-")[0])
                element.remove()
                delete mazo["deck"][element.dataset.cardnumber];
            }else{
                updateCartaMazo(element.dataset.cardnumber.split("-")[1],element.dataset.cardnumber.split("-")[0],parseInt(mazo["deck"][element.dataset.cardnumber]))
            }
        }
    }
}

// FUNCIONES RELACIONADAS AL MAZO
async function insertCartaMazo(idCarta, idColeccion){
    // DATOS NECESARIOS ID_MAZO, IDCARTA, IDCOLECCION, IDJUEGO, CANTIDAD = 1
    const res = await fetch(`http://alexfullstack.net/api/insertCartaMazo`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            idMazo: localStorage.getItem("id_mazo"),
            idJuego: "DG",
            idColeccion:idColeccion,
            idCarta:idCarta,
            cantidad:"1"
        })
    })
    if(!res.ok){
        // TODO -> CONTROLAR EL ERROR SI LA CARTA NO SE A AÑADIDO A LA BASE DE DATOS NO AÑADIRLA AL CAMPO DEL MAZO 
        alert("Error al añadir la carta")
        return
    }
}
// PETICION QUE MODIFICA LA CANTIDAD DE UNA CARTA EN EL MAZO
async function updateCartaMazo(idCarta, idColeccion, cantidad){
    // DATOS NECESARIOS ID_MAZO, IDCARTA, IDCOLECCION, IDJUEGO, CANTIDAD = 1
    const res = await fetch(`http://alexfullstack.net/api/updateCartaMazo`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            idMazo: localStorage.getItem("id_mazo"),
            idColeccion:idColeccion,
            idCarta:idCarta,
            cantidad:cantidad
        })
    })
    if(!res.ok){
        // TODO -> CONTROLAR EL ERROR SI LA CARTA NO SE A AÑADIDO A LA BASE DE DATOS NO AÑADIRLA AL CAMPO DEL MAZO 
        alert("Error al añadir la carta")
        return
    }
}
// PETICION QUE ELIMINA LA CANTIDAD DE UNA CARTA EN EL MAZO
async function removeCartaMazo(idCarta, idColeccion, cantidad){
    // DATOS NECESARIOS ID_MAZO, IDCARTA, IDCOLECCION, IDJUEGO, CANTIDAD = 1
    const res = await fetch(`http://alexfullstack.net/api/removeCartaMazo`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            idMazo: localStorage.getItem("id_mazo"),
            idColeccion:idColeccion,
            idCarta:idCarta,
        })
    })
    if(!res.ok){
        // TODO -> CONTROLAR EL ERROR SI LA CARTA NO SE A AÑADIDO A LA BASE DE DATOS NO AÑADIRLA AL CAMPO DEL MAZO 
        alert("Error al añadir la carta")
        return
    }
}
// FUNCION PARA ELIMINAR LAS CARTAS QUE ESTAN GUARDADAS EN EL MAZO
async function limpiarMazo(){
    if(deck>0 || eggDeck>0){
        if(window.confirm("Se va a limpiar el mazo. ¿Estas seguro?")){
            dropZone.innerText = ''
            deck=0
            eggDeck=0
            mazo["eggDeck"]=[]
            mazo["deck"]=[]

        const res = await fetch(`http://alexfullstack.net/api/baciarMazo`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            idMazo: localStorage.getItem("id_mazo"),
        })
    })
        }
    }
}
// PETICION PARA AÑADIR LAS CARTAS YA EXISTENTES DEL MAZO AL CARGAR LA PAGINA
async function cargarMazo(){
    const res = await fetch(`http://alexfullstack.net/api/cartasMazo`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            idMazo: localStorage.getItem("id_mazo"),
        })
    })
    if(!res.ok){
        alert("Usuario o contraseña incorrecta")
        return
    }
    const resJson = await res.json()
    console.log(resJson.result.length)
    if(resJson.result == "vacio"){
        return
    }
    resJson.result.forEach(element => {
        if(element.type=="Digi-Egg"){
            mazo["eggDeck"][element.id_coleccion+"-"+element.id_carta] =parseInt(element.cantidad)
            eggDeck += parseInt(element.cantidad)
        }else{
            mazo["deck"][element.id_coleccion+"-"+element.id_carta] = element.cantidad
            deck += parseInt(element.cantidad)
        }
        cargarCartas(element)
    });
}
// FUNCION PARA CARGAR CARTAS EN LA ZONA DE MAZO
function cargarCartas(element){
    let div = document.createElement("div")
    div.dataset.nombre =  element.name 
    div.dataset.cardnumber =  element.id_coleccion+"-"+element.id_carta.padStart(3, "0")
    div.dataset.color =  element.color
    div.dataset.type =  element.type
    let img = document.createElement("img")
    img.src = element.image_url
    dropZone.appendChild(div)
    div.appendChild(img)
    añadirButtons(div,element.cantidad)
}

function expandirCarta(){
    console.log(this.dataset.cardnumber)
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

// FUNCION PARA AÑADIR BOTONES A LAS CARTAS DEL MAZO
function añadirButtons(element, cantidad){
    let divMas = document.createElement("img")
    divMas.src = "src/icons/plus-svgrepo-com.svg"
    divMas.classList.add("button")
    divMas.classList.add("mas")
    divMas.addEventListener("click", sumarCantidad)
    
    let divCantidad = document.createElement("div")
    divCantidad.innerText = cantidad
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
// FUNCION PARA FILTRAR LAS CARTAS QUE SE MUESTRAN
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
// FUNCION PARA CREAR LA SENTENCIA SQL DE LA BUSQUEDA DEPENDIENDO DE LOS DISTINTOS FILTROS SELECCIONADOS
async function creacionSentenciaSQL(listaFiltro){
        // Inicializar la parte de la sentencia SQL que siempre estará presente
        var sql = "SELECT c.* FROM cartas c WHERE 1 = 1";

        // Agregar condiciones basadas en los filtros seleccionados

        listaFiltro.nombre = document.querySelector("#nombre").value

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

        // Agregar filtro para mostrar solo las cartas de la colección del usuario si se especifica
        if (listaFiltro.coleccion) {
            sql += " AND (c.id_carta, c.id_coleccion, c.id_juego) IN ( SELECT id_carta, id_coleccion, id_juego FROM usuarioColeccion WHERE id_usuario = '" + sessionStorage.getItem('user') + "')";
        }
        sql += " ORDER BY c.id_coleccion, c.id_carta";
        console.log(sql);
        peticionAPIFiltro(sql)
}
// HACER CONSULTA A LA API
// FILTRANDO LA CONSULTA DEPENDIENDO DE LOS FILTROS SELECCIONADOS
async function peticionAPIFiltro(sql){
    pagina = 1;
    limiteActual=0

    const res = await fetch(`http://alexfullstack.net/api/filtroCartas`,{
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
    listaCartas = resJson.result[0]
    limitePaginacion = Math.ceil(listaCartas.length/20)
    containerListaCartas.innerHTML = '' 
    console.log(resJson.result[0])
    for (let limiteActual = 0; limiteActual < listaCartas.length && limiteActual < (pagina * 20); limiteActual++) {
        cargarImg(listaCartas[limiteActual]);
        containerListaCartas.scrollTop = 0;
    }

    // await resJson.result[0].forEach(element => {
    //     cargarImg(element)
    // });
    
}
// FUNCION PARA LISTAR TODAS LAS COLEECIONES EN FILTROS
async function listaColecciones(){
    const res = await fetch(`http://alexfullstack.net/api/listaColecciones`,{
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
        cargarImg(listaCartas[i]);
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
        cargarImg(listaCartas[i]);
    }
    document.querySelector("#pagina").innerText = pagina;
    containerListaCartas.scrollTop = 0;

}

function mostrarFiltro(){
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

// REALIZAR EL DRAG AND DROP
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
}

let initialX 
let initialY 
let cartaCopia
function touchStart(e) {
    initialX = this.offsetLeft;
    initialY = this.offsetTop;
    cartaCopia = this.cloneNode(true);
    cartaCopia.style.position = '';
    cartaCopia.style.left = initialX  + 'px';
    cartaCopia.style.top = initialY + 'px';
    const listaCartas = document.getElementById('containerListaCartas');
    // listaCartas.appendChild(cartaCopia);
    listaCartas.insertBefore(cartaCopia, this)
    // cartaCopia.addEventListener('touchmove', touchMove);
    // e.preventDefault();
}

function touchMove(e) {
    // const listaCartas = document.getElementById('containerListaCartas');
    // listaCartas.appendChild(cartaCopia);
    var touchLocation = e.targetTouches[0];

    // cartaCopia = this.cloneNode(true);
    // cartaCopia.style.position = 'absolute';
    // cartaCopia.style.zIndex = '9999';
    // cartaCopia.style.opacity = "0.2"; // Example of changing opacity
    this.style.position = 'absolute';
    this.style.zIndex = '500';
    this.style.left = touchLocation.pageX + 'px';
    this.style.top = touchLocation.pageY + 'px';

    cartaCopia.style.position = 'static';
    cartaCopia.style.left = initialX  + 'px';
    cartaCopia.style.top = initialY + 'px';
    const listaCartas = document.getElementById('containerListaCartas');
    // listaCartas.appendChild(cartaCopia);
  
  }
  
  function touchEnd(e) {
    console.log(initialX)
    console.log(initialY)

    // Remove the cloned element (optional)
    this.style.left = initialX  + 'px';
    this.style.top = initialY + 'px';
    this.style.zIndex = '0';
    this.style.position = '';
    cartaCopia.remove();
    const posicionFinalX = e.changedTouches[0].clientX;
    const posicionFinalY = e.changedTouches[0].clientY;
    if (seHaSoltadoEnZonaEspecifica(posicionFinalX, posicionFinalY)) {
        this.style.position = 'relative';
        this.style.top = '';
        this.style.left = '';
        this.removeEventListener("touchEnd", touchEnd)
        añadirCartaMazo(this)
    }
  }
  function seHaSoltadoEnZonaEspecifica(x, y) {
    const zonaEspecifica = document.getElementById('dropZone');
    const rectanguloZona = zonaEspecifica.getBoundingClientRect();
  
    return (
      x >= rectanguloZona.left &&
      x <= rectanguloZona.right &&
      y >= rectanguloZona.top &&
      y <= rectanguloZona.bottom
    );
  }







export const methods = {
    imgCartas: imgCartas,
    cargarImg: cargarImg,
}
