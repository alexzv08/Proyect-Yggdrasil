import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js"
import { methods as windowOnLoad } from "./sideBar.js";


window.onload = async ()=>{
    await windowOnLoad.addHtmlDocumentAtBeginning("./components/sideBar.html")
    await windowOnLoad.onLoad()
    await document.getElementById("toogleMenu").addEventListener("click", windowOnLoad.toggleMenuChange)
    windowOnLoad.navBarRediretions()
    notification.solicitarSala()
}