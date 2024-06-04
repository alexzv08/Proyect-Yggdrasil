// DEPENDENCIAS NECESARIAS
import { methods as windowOnLoad } from "./sideBar.js";
import { methods as notification } from "./notification.js";


window.onload = async ()=>{
    await windowOnLoad.onLoad()
    windowOnLoad.navBarRediretions()
    await document.getElementById('deckbuilder').classList.add('active')
    await document.getElementById("toogleMenu").addEventListener("click", windowOnLoad.toggleMenuChange)
    crear.addEventListener("click", crearMazo)
    recuperarMazos()
    await document.getElementById('deckbuilder2').classList.add('active')
    document.querySelector('#deckbuilder2 img').src = "src/icons/decksblack.svg"
    let img = document.querySelector('#deckbuilder2 img');
    notification.solicitarSala()
}
// FUNCION PARA INSERTAR UNA NUEVA ENTRADA EN LA BBDD CON UN NUEMO MAZO VINCULADO A UN USUARIO
async function crearMazo(){
    if(nombreMazo.value !=''){
        const res = await fetch("http://localhost:3000/api/crearMazo",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                nombre: nombreMazo.value,
                user: sessionStorage.getItem("user")
            })
        })
        const resJson = await res.json()
        console.log()
        if(resJson.redirect){
            localStorage.setItem("id_mazo", resJson.result[0].insertId)
            window.location.href = "/deckBuilder";
        }
    }else{
        alert('Tiene que darle un nombre al mazo')
    }
}
// FUNCION PARA REDIRECCIONAR A LA PAGINA DE EDICION DE MAZO CON EL ID DEL MAZO
function editarMazo(){
    let mazoContainer = this.parentElement.parentElement
    localStorage.setItem("id_mazo", mazoContainer.dataset.id_mazo)
    window.location.href = "/deckBuilder";
}
// FUNCION PARA ELIMINAR UN MAZO DE LA BBDD Y DEL HTML
async function eliminarmazo(){
    let mazoContainer = this.parentElement.parentElement
    console.log(mazoContainer)
    const res = await fetch("http://localhost:3000/api/eliminarmazo",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            id_mazo: mazoContainer.dataset.id_mazo
        })
    })
                    
    mazoContainer.remove()
    }
// FUNCION PARA RRECUPERAR LOS DISTINTOS MAZOS QUE TIENE UN USUARIO
async function recuperarMazos(){
const res = await fetch("http://localhost:3000/api/recuperarMazosUsuario",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            user: sessionStorage.getItem("user")
        })
})
const resJson = await res.json()
resJson.result[0].forEach(element => {
    crearContainerMazo(element)
});
}
// FUNCION PARA GENERAR EL CONTENEDOR DE CADA MAZO
function crearContainerMazo(element){
    let divContainer = document.createElement('div')
    divContainer.classList.add('deck')
    divContainer.dataset.id_mazo = element.id_mazo

    let divColor = document.createElement('div')
    divColor.classList.add('colorMazo')

    let hNombre = document.createElement('h3')
    hNombre.innerText = element.nombre_mazo

    let hNCartas = document.createElement('h4')
    hNCartas.innerText = 'Cartas ' + element.total_cartas + '/' + '55'

    let hFechaCre = document.createElement('h4')
    let date = element.fecha.split('T')[0]
    hFechaCre.innerText = "Creado "+date.split('-').reverse().join('/') 

    let divBotones = document.createElement('div')
    divBotones.classList.add('botonoes')

    let butn1 = document.createElement('button')
    butn1.classList.add('Editar')
    butn1.innerText ="Editar"
    butn1.addEventListener('click', editarMazo)

    let butn2 = document.createElement('button')
    butn2.addEventListener('click', eliminarmazo)
    butn2.classList.add('Eliminar')
    butn2.innerText ="Eliminar"

    decksContainer.appendChild(divContainer)
    divContainer.appendChild(divColor)
    divContainer.appendChild(hNombre)
    divContainer.appendChild(hNCartas)
    divContainer.appendChild(hFechaCre)
    divContainer.appendChild(divBotones)
    divBotones.appendChild(butn1)
    divBotones.appendChild(butn2)
}