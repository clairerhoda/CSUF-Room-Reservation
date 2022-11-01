const loginButton = document.getElementById("login-btn");
const xhr = new XMLHttpRequest()
xhr.responseType = 'json'

const params = new URLSearchParams(window.location.search);
var path = params.get('path');

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
                if(this.response.length > 0){
                    // check that user is not deleted
                    if (this.response[0].is_deleted == false) {
                        // creating cookie to store user_id
                        const d = new Date();
                        // expires after 3 days
                        d.setTime(d.getTime() + (3 * 24 * 60 * 60 * 1000)); 
                        let expires = "expires="+d.toUTCString();
                        document.cookie = "user_id =" +
                         this.response[0].user_id + ";" + expires + ";path=/";
                        location.href= path + '.html';
                    }
                }else {
                    const invalCredsMessage =
                        document.getElementById("invalid-creds");
                    invalCredsMessage.textContent =
                        'Invalid Username and/or Password';
                }

            }
        }
    } 
})
