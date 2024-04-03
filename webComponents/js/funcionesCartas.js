function imgCartas(){
    fetch("https://digimoncard.io/api-public/search.php?sort=code&series=Digimon Card Game")
    .then(data => data.json())
    .then(data =>{
        console.log(data)
        data.forEach(element => {
            cargarImg(element.image_url)
        });
        // imgCard.src = data[0].image_url
    })  
    console.log('ho');
}
function cargarImg(element){
    let div = document.createElement("div")
    let img = document.createElement("img")
    img.src = element
    containerCartas.appendChild(div)
    div.appendChild(img)
}
export const methods = {
    imgCartas: imgCartas,
    cargarImg: cargarImg
};