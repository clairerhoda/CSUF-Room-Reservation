
const createButton = document.getElementById("button-start");
const configButton = document.getElementById("config-btn");

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

createButton.addEventListener("click", (e) => {
    e.preventDefault();
    let user = getCookie("user_id");

    if (user != "") {
        location.href='reservation.html';
    } else {
        location.href='login.html?path=reservation';
    }
    
})

configButton.addEventListener("click", (e) => {
    e.preventDefault();
    location.href='login.html?path=userPage';

    let user = getCookie("user_id");
    if (user != "") {
        location.href='userPage.html';
    } else {
        location.href='login.html?path=userPage';
    }
})

