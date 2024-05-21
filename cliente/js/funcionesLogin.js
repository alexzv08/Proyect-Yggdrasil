const mesnsajeError = "";
window.onload = ()  => {
    document.getElementById("register-form").addEventListener("submit", async (e)=>{
        e.preventDefault();

        // PETICION POR SERVIDOR AWS
        //  const res = await fetch("http://35.181.125.245:3000/api/login",{
        // PETICION POR SERVIDOR LOCAL
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
            document.cookie = `session=${resJson.session}; path=/`;
            window.location.href = "/home";
        }
    })
    register.addEventListener("click" ,(e)=>{
        e.preventDefault();
        window.location.href = "/register";
    })
}