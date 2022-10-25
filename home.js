
const createButton = document.getElementById("button-start");
const configButton = document.getElementById("config-btn");

createButton.addEventListener("click", (e) => {
    e.preventDefault();
    
    location.reload();
    // test without localhost 
    location.href='login.html';
    
})

configButton.addEventListener("click", (e) => {
    e.preventDefault();

    location.reload();
    location.href='login.html';
})

