
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
    })
}