// DEPENDENCIAS NECESARIAS
import { methods as windowOnLoad } from "./sideBar.js";

let colores = ["Rojo", "Azul", "Verde", "Amarillo", "Negro","Morado","Blanco"]
let keywordA = ["Alliance", "Armore Purge", "Barrier", "Blast Digivolve", "Blitz","Blocker","Decoy","De-Digivolve","Delay","Digi-Busrt","Digisorption","Draw","Fortitude","Jamming","Material Save","Mind Link","Pircing","Raid","Reboot","Recovery","Retalation","Rush","Save","Security Attack"]
let datosFiltro=[];

window.onload=async ()=>{
    onLoad()
    await windowOnLoad.addHtmlDocumentAtBeginning("./components/sideBar.html")
    await document.getElementById("toogleMenu").addEventListener("click", windowOnLoad.toggleMenuChange)
}   
function onLoad(){
    for (let i = 1; i < 13; i++) {
        option = document.createElement("option")
        option.value = "BT-"+i
        option.innerText = "BT-"+i
        cardSett.appendChild(option)
    }
    for (let i = 0; i < colores.length; i++) {
        option = document.createElement("option")
        option.value = colores[i]
        option.innerText = colores[i]
        colorPri.appendChild(option)
    }
    for (let i = 0; i < colores.length; i++) {
        option = document.createElement("option")
        option.value = colores[i]
        option.innerText = colores[i]
        colorSec.appendChild(option)
    }
    for (let i = 0; i < keywordA.length; i++) {
        var option = document.createElement("option");
        // option.type = "checkbox";
        option.value = keywordA[i]; 
        // var label = document.createElement("label");
        option.innerText = keywordA[i];
        keyword.appendChild(option);
        // keyword.appendChild(label);
    }
    filtroCartas.addEventListener("submit", filtro)
}
function filtro(e) {
    e.preventDefault();
    let datosFiltro = [];

    const data = new FormData(e.target);
    
    for (var pair of data.entries()) {
        if(pair[1]!=''){
            datosFiltro.push([pair[0], pair[1] ]);
        }
    }
    let consulta = "SELECT * FROM cartas ";
    consulta+="WHERE"
    for (const key of datosFiltro) {
        consulta+=" "+key[0]+ " == " +key[1]+" AND";
    }
    console.log(consulta)
}

export const methods = {
    // imgCartas: imgCartas,
    // cargarImg: cargarImg,
    onLoad: onLoad
};