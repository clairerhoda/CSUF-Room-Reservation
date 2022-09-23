const loginButton = document.getElementById("login-btn");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    
    //if login success
    location.reload();
    location.href='reservation.html';

    //or
    location.href='cancel.html';

})