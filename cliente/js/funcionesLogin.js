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
            const resJson = await res.json()
            console.log(resJson)
            alert(resJson)
            return
        }
        const resJson = await res.json()
        if(resJson.redirect){
            // console.log(resJson.datos[0].usuario)
            sessionStorage.setItem("user", resJson.datos[0].usuario);
            sessionStorage.setItem("token", resJson.token);
            document.cookie = `session=${resJson.session}; path=/`;
            if(resJson.datos[0].id_rol == 1){
                window.location.href = "/home";
            }else if(resJson.datos[0].id_rol == 2){
                window.location.href = "/homeAdmin";
            }
        }
    })
    register.addEventListener("click" ,(e)=>{
        e.preventDefault();
        window.location.href = "/register";
    })
}