// DEPENDENCIAS NECESARIAS
import { methods as windowOnLoad } from "./sideBar.js";

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
    console.log(element)
    let divContainer = document.createElement('div')
    divContainer.classList.add('deck')

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

    let butn2 = document.createElement('button')
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