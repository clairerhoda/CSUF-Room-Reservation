
const loginButton = document.getElementById("login-btn");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    
    location.reload();
    location.href='reservation.html';
})