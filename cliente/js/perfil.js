import { methods as windowOnLoad } from "./sideBar.js";
import { methods as notification } from "./notification.js";


window.onload = async ()=>{
    await windowOnLoad.onLoad()
    await windowOnLoad.navBarRediretions()
    await document.getElementById("toogleMenu").addEventListener("click", windowOnLoad.toggleMenuChange)
    windowOnLoad.navBarRediretions()
    notification.solicitarSala()

    cambiarContraseñaB.addEventListener("click", cambiarContraseña)
    user.innerHTML = sessionStorage.getItem("user")
    email.innerHTML = await printEmail()
    numCartas.innerHTML = await printNumCartas()


}

async function cambiarContraseña(event){
    event.preventDefault()

    const res = await fetch(`http://localhost:3000/api/cambiarContrasena`,{
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
    newpassword.value = ""
    alert("Contraseña cambiada correctamente")
}
async function printEmail(){
    const res = await fetch(`http://localhost:3000/api/printEmail`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                user : sessionStorage.getItem("user"),
            })
        })
    if(!res.ok){
        const resJson = await res.json()
        console.log(resJson)
        alert(resJson.message)
        return
    }
    const resJson = await res.json()
    let email = resJson.response[0][0].email
    return email
}
async function printNumCartas(){
    const res = await fetch(`http://localhost:3000/api/printNumCartas`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                user : sessionStorage.getItem("user"),
            })
        })
    if(!res.ok){
        const resJson = await res.json()
        console.log(resJson)
        alert(resJson.message)
        return
    }
    const resJson = await res.json()
    let count = resJson.response[0][0].total_cartas ?? 0
    console.log(resJson.response[0][0])
    return count
}
