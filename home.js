
const createButton = document.getElementById("button-start");

createButton.addEventListener("click", (e) => {
    e.preventDefault();
    
    location.reload();
    location.href='login.html';
})