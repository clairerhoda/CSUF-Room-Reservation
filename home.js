
const createButton = document.getElementById("button-start");
const cancelButton = document.getElementById("cancel-btn");

createButton.addEventListener("click", (e) => {
    e.preventDefault();
    
    location.reload();
    location.href='login.html';
    
})

cancelButton.addEventListener("click", (e) => {
    e.preventDefault();

    location.reload();
    location.href='login.html';
})

