import { methods as windowOnLoad } from "./sideBar.js";
import { methods as notification } from "./notification.js";


window.onload = async ()=>{
    await windowOnLoad.addHtmlDocumentAtBeginning("./components/sideBar.html")
    await windowOnLoad.onLoad()
    await document.getElementById("toogleMenu").addEventListener("click", windowOnLoad.toggleMenuChange)
    windowOnLoad.navBarRediretions()
    notification.solicitarSala()
}