
window.onload = () => {
    document.getElementById("register-form").addEventListener("submit", async (e)=>{
        e.preventDefault();
        const res = await fetch("http://localhost:3000/api/register",{
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
        // console.log(res)
        // if(!res.ok){
        //     alert("Usuario o contraseña incorrecta")
        //     return
        // }
        const resJson = await res.json()
        if(resJson.redirect){
            window.location.href = "/login";
        }
    })
}