let ocultoMenu=false;
let ocultoChat=false;

window.onload = ()=>{
    toogleMenu.addEventListener("click", toggleMenuChange)
    toogleChat.addEventListener("click", toggleChatChange)

}

function toggleMenuChange(){
    let titulos = document.querySelectorAll("span h3")

    if(ocultoMenu){
        titulos.forEach(element => {
            element.style.display = "block"
        });
        toogleMenu.style.left="255px";
        containerSidebar.style.width = "270px";
        console.log(containerSidebar.offsetWidth);
        console.log(document.querySelector("body").offsetWidth);
        contenidoWeb.style.width=`calc(100% - 270px)`

        ocultoMenu=false
    }else{
        titulos.forEach(element => {
            element.style.display = "none"
        });
        containerSidebar.style.width = "100px";
        toogleMenu.style.left="85px";
        console.log(containerSidebar.offsetWidth);
        console.log(document.querySelector("body").offsetWidth);

        contenidoWeb.style.width=`calc(100% - 100px)`
        ocultoMenu=true
    }
}
function toggleChatChange(){
    if(ocultoChat){
        chatContainer.style.height="100%";
        chat.style.display="block";
        ocultoChat=false
    }else{
        chatContainer.style.height="50px";
        chat.style.display="none";
        ocultoChat=true
    }
}