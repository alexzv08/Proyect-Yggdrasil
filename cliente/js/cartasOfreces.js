import { methods as windowOnLoad} from "./sideBar.js";
// import 'dotenv/config';

let elementoDrag, copia, listaCartas, pagina, limiteActual, limitePaginacion;
// ARRAY PARA ALMACENAR EL FILTRO DE BUSQUEDA DE LAS CARTAS
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

window.onload = async() => {
    await windowOnLoad.onLoad()
    await document.getElementById('trade').classList.add('active')
    await document.getElementById("toogleMenu").addEventListener("click", windowOnLoad.toggleMenuChange)
    windowOnLoad.navBarRediretions()
    await listaColecciones()
    await mostrarCartasColeccion() 
    // document.querySelector("#search").addEventListener("click", filtroBusqueda)
    // document.querySelectorAll("#paginacion .button")[0].addEventListener("click", paginaMenos)
    // document.querySelectorAll("#paginacion .button")[1].addEventListener("click", paginaMas)
    // iconoFiltroMovil.addEventListener("click", mostrarFiltroMovil)
}

async function listaColecciones(){
    const res = await fetch(`http://13.37.66.226:3000/api/listaColecciones`,{
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
async function mostrarCartas(){
    const res = await fetch(`http://13.37.66.226:3000/api/cartasColeccionUsuario`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            user: sessionStorage.getItem("user"),
        })
    })
    if(!res.ok){
        return
    }
    const resJson = await res.json()
    console.log(resJson.result[0])
    listaCartas = resJson.result[0]
    limitePaginacion = Math.ceil(listaCartas.length/20)
    containerListaCartas.innerHTML = '' 
    for (limiteActual; limiteActual < (pagina*20); limiteActual++) {
        cargarImg2(listaCartas[limiteActual])
    }
}
async function peticionAPIFiltro(sql){
    pagina = 1;
    limiteActual=0
    const res = await fetch(`http://13.37.66.226:3000/api/filtroCartas`,{
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
    listaCartas = resJson.result[0]
    limitePaginacion = Math.ceil(listaCartas.length/20)
    containerListaCartas.innerHTML = '' 
    // await resJson.result[0].forEach(element => {
    //     console.log(element)
    //     cargarImg2(element)
    // });
    for (limiteActual; limiteActual < (pagina*20); limiteActual++) {
        cargarImg2(listaCartas[limiteActual])
    }
}
async function mostrarCartasColeccion(){
    pagina = 1;
    limiteActual=0
    const res = await fetch(`http://13.37.66.226:3000/api/cartasEnLaColeccion`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            user: sessionStorage.getItem("user"),
        })
    })
    const resJson = await res.json()
    // console.log(resJson.result[0])
    listaCartas = resJson.result[0]
    limitePaginacion = Math.ceil(listaCartas.length/20)
    containerListaCartas.innerHTML = '' 
    for (limiteActual; limiteActual < (pagina*20); limiteActual++) {
        cargarImg2(listaCartas[limiteActual])
    }
}
function cargarImg2(element){
    console.log(element.name)
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

    let divMas = document.createElement("img")
    divMas.src = "src/icons/plus-svgrepo-com.svg"
    divMas.classList.add("button")
    divMas.classList.add("mas")
    // divMas.addEventListener("click", sumarALaColeccion)
    let divCont = document.createElement("div")
    divCont.classList.add("divCont")
    let divCantidad = document.createElement("div")
    let divCambio = element.cambio > 0 ? element.cambio : "0"
    let divTotal  = element.cantidad > 0 ? element.cantidad : "0"
    divCantidad.innerText = divCambio + "/" + divTotal

    divCantidad.classList.add("button")
    divCantidad.classList.add("cantidad")

    let divMenos = document.createElement("img")
    divMenos.src = "src/icons/minus-svgrepo-com.svg"
    divMenos.classList.add("button")
    divMenos.classList.add("menos")
    // divMenos.addEventListener("click", restarALaColeccion)

    div.appendChild(img)
    div.appendChild(divCont)
    divCont.appendChild(divMas)
    divCont.appendChild(divCantidad)
    divCont.appendChild(divMenos)
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