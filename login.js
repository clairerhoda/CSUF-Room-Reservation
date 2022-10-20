const loginButton = document.getElementById("login-btn");
const xhr = new XMLHttpRequest()
xhr.responseType = 'json'

xhr.open('GET', 'http://localhost:3000/users')
xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(this.response);
    }
}
loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    var username = document.getElementById("username-input").value;
    var password = document.getElementById("password-input").value;
    if(username && password){
        pool.query('SELECT * FROM users WHERE email = $1 AND password_hash = $2', 
        [username, password], (error, results) => {
            if (error) {
              throw error
            }
            if(results){
                this.response.redirect('/reservation')
            }
        })}
    console.log(username, password);
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.response);
        }
    }


    //if login success
    // location.reload();
    // location.href='reservation.html';
    
    //or
    // location.href='userPage.html';

})

xhr.send()