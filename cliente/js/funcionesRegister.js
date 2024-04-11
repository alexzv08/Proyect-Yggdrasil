
window.onload = () => {
    document.getElementById("register-form").addEventListener("submit", async (e)=>{
        e.preventDefault();

        // PETICION POR SERVIDOR AWS
        //  const res = await fetch("http://35.181.125.245:3000/api/register",{
        // PETICION POR SERVIDOR LOCAL
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
}