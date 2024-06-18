import { methods as windowOnLoad } from "./sideBar.js";
import { methods as notification } from "./notification.js";


window.onload = async ()=>{
    await windowOnLoad.addHtmlDocumentAtBeginning("./components/sideBar.html")
    await windowOnLoad.onLoad()
    await document.getElementById("toogleMenu").addEventListener("click", windowOnLoad.toggleMenuChange)
    windowOnLoad.navBarRediretions()
    notification.solicitarSala()

    usuario.innerHTML = localStorage.getItem("user")
    cambiarContraseña.addEventListener("click", cambiarContraseña)
}

async function cambiarContraseña(event){
    event.preventDefault()

    const res = await fetch(`http://alexfullstack.net/api/cambiarContraseña`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                user : localStorage.getItem("user"),
                pass: newpassword.value
            })
        })
        if(!res.ok){
            const resJson = await res.json()
            console.log(resJson)
            alert(resJson.message)
            return
        }
        alert("Contraseña cambiada correctamente")
}