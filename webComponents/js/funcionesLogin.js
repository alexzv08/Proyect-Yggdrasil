const mesnsajeError = "";
window.onload = ()  => {
    document.getElementById("register-form").addEventListener("submit", async (e)=>{
        e.preventDefault();
        const res = await fetch("http://localhost:3000/api/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                user: e.target.children[0].children.email.value,
                pass: e.target.children[1].children.password.value
            })
        })
        if(!res.ok){
            alert("Usuario o contraseña incorrecta")
            return
        }
        const resJson = await res.json()
        if(resJson.redirect){
            sessionStorage.setItem("user", e.target.children[0].children.email.value);
            window.location.href = "/home";
        }
    })
    register.addEventListener("click" ,(e)=>{
        e.preventDefault();
        window.location.href = "/register";

    })
}