import { methods as funcionesCartas } from "./funcionesCartas.js";
let ocultoMenu, ocultoChatHamburger=false;
let ocultoChat=false;

window.onload = ()=>{
    toogleMenu.addEventListener("click", toggleMenuChange)
    hamnurgerMenu.addEventListener("click", toggleMenuChangeHamburger)

    // toogleChat.addEventListener("click", toggleChatChange)
    // deckbuilder.addEventListener("click", insertCartas)
}

async function insertCartas(){
    contenidoWeb.innerHTML =""
    await fetch("seccionCartas.html")
    .then(data => data.text())
    .then(data =>{
        contenidoWeb.insertAdjacentHTML("beforeend", data)
    })
    funcionesCartas.imgCartas()
    console.log("hola")
}


function toggleMenuChange(){
    let titulos = document.querySelectorAll("span h3")

    if(ocultoMenu){
        titulos.forEach(element => {
            element.style.display = "block"
        });
        toogleMenu.style.left="255px";
        containerSidebar.classList.remove("menuOculto")
        containerSidebar.classList.add("menuDesplegado")
        // console.log(containerSidebar.offsetWidth);
        // console.log(document.querySelector("body").offsetWidth);
        // contenidoWeb.style.width=`calc(100% - 270px)`

        ocultoMenu=false
    }else{
        titulos.forEach(element => {
            element.style.display = "none"
        });
        containerSidebar.classList.add("menuOculto")
        containerSidebar.classList.remove("menuDesplegado")
        toogleMenu.style.left="85px";
        // console.log(containerSidebar.offsetWidth);
        // console.log(document.querySelector("body").offsetWidth);

        // contenidoWeb.style.width=`calc(100% - 100px)`
        ocultoMenu=true
    }
}
function toggleMenuChangeHamburger(){
    let hamburger = document.querySelectorAll("#hamnurgerMenu div div")

    if(!ocultoChatHamburger){
        hamburger[0].classList.add('x1')
        hamburger[1].classList.add('x2')
        hamburger[0].style.margin="0"
        hamburger[1].style.margin="0"

        ocultoChatHamburger=true
    }else{
        hamburger[0].classList.remove('x1')
        hamburger[1].classList.remove('x2')
        hamburger[0].style.margin="10px"
        hamburger[1].style.margin="10px"
        ocultoChatHamburger=false
    }
}
// function toggleChatChange(){
//     if(!ocultoChat){
//         chatContainer.style.height="100%";
//         chat.style.display="block";
//         ocultoChat=true
//     }else{
//         chatContainer.style.height="50px";
//         chat.style.display="none";
//         ocultoChat=false
//     }
// }