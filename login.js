const loginButton = document.getElementById("login-btn");
const xhr = new XMLHttpRequest()
xhr.responseType = 'json'

xhr.open('GET', 'http://localhost:3000/users/apuentes1@csu.fullerton.edu/foobar')
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
        const url = 'http://localhost:3000/users/'+username+'/'+password;
        xhr.open('GET', url);
        xhr.send();
        xhr.onreadystatechange = function() {

            if (this.readyState == 4 && this.status == 200) {
                if(this.response.length>0){
                    location.href='reservation.html';
                }else {
                    //location.href = 'login.html';
                    const invalCredsMessage = document.getElementById("invalid-creds");
                    invalCredsMessage.textContent = 'Invalid Username and/or Password'
                }

            }
        }

} 

})
