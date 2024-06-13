
window.onload = () => {
    document.getElementById("register-form-user").addEventListener("submit", async (e)=>{
        e.preventDefault();
        const res = await fetch(`http://localhost:3000/api/register`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email: e.target.children[0].children.email.value,
                user: e.target.children[1].children.user.value,
                pass: e.target.children[2].children.password.value
            })
        })
        if(!res.ok){
            const errorMessage = await res.json();
            console.log(errorMessage); // Muestra el mensaje de error en la consola
            alert(errorMessage.message);
            return;
        }
        const resJson = await res.json()
        if(resJson.redirect){
            window.location.href = "/login";
        }
    })

    document.getElementById("register-form-empresa").addEventListener("submit", async (e)=>{
        e.preventDefault();
        console.log(e.target.children[6].children[2].value);
        if (e.target.children[2].children.pass.value != e.target.children[3].children.confirmPassword.value) {
            return alert("Las contraseñas no coinciden");
        }
        const res = await fetch(`http://localhost:3000/api/registerEmpresa`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                user: e.target.children[0].children.user.value,
                email: e.target.children[1].children.email.value,
                pass: e.target.children[2].children.pass.value,
                nombreEmpresa: e.target.children[4].children.nombreEmpresa.value,
                cif: e.target.children[5].children.cif.value,
                direcion: e.target.children[6].children[2].value+"-"+
                e.target.children[6].children[4].value +"-"+
                e.target.children[6].children[6].value +"-"+
                e.target.children[6].children[8].value +"-"+
                e.target.children[6].children[10].value,
                tel: e.target.children[7].children.tel.value,
                web: e.target.children[8].children.web.value,
            })
        })
        if(!res.ok){
            const errorMessage = await res.json();
            console.log(errorMessage); // Muestra el mensaje de error en la consola
            alert(errorMessage.message);
            return;
        }
        const resJson = await res.json()
        if(resJson.redirect){
            window.location.href = "/login";
        }
    })


    login.addEventListener("click" ,(e)=>{
        e.preventDefault();
        window.location.href = "/login";
    })
    registerEmpresa.addEventListener("click" ,(e)=>{
        e.preventDefault();
        document.querySelector(".usuario").style.display = "none";
        document.querySelector(".empresa").style.display = "block";

    })
    registerUsuario.addEventListener("click" ,(e)=>{
        e.preventDefault();
        document.querySelector(".usuario").style.display = "flex";
        document.querySelector(".empresa").style.display = "none";

    })
}