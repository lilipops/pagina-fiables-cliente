const container = document.querySelector(".container"),
      pwShowHide = document.querySelectorAll(".showHidePw"),
      pwFields = document.querySelectorAll(".password"),
      signUp = document.querySelector(".signup-link"),
      login = document.querySelector(".login-link");

function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
var xhr = new XMLHttpRequest();
xhr.open('POST', 'http://localhost:8080/googlelog');
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.onload = function() {
  console.log('Signed in as: ' + xhr.responseText);
};
xhr.send('idtoken=' + id_token);
}


var x, i, j, l, ll, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /*for each element, create a new DIV that will act as the selected item:*/
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /*for each element, create a new DIV that will contain the option list:*/
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /*for each option in the original select element,
    create a new DIV that will act as an option item:*/
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /*when an item is clicked, update the original select box,
        and the selected item:*/
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
      /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
}
function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);

function validateEmail(sEmail) {
    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (filter.test(sEmail)) {
        return true;
    } else {
        return false;
    }

} /*aqui se acaba el validar corre*/
function validateTel(valortelef) {
  var telef = new RegExp("^[6789]\\d{8}$");
  if (telef.test(valortelef)) {
    return true
  } else {
    return false
  }

}

function requestSignup() {
  let wrongEmail = document.getElementById('wrongEmail')
  let wrongTel = document.getElementById('wrongTel')
  if(validateEmail(document.getElementById('email').value) == false) {
    wrongEmail.style.display = 'block'
    return
  } 
  wrongEmail.style.display = 'none'
  if(validateTel(document.getElementById('tlf').value) == false) {
    wrongTel.style.display = 'block'
    return
  } 
  wrongTel.style.display = 'none'

  fetch("http://localhost:8080/register", {
    method: 'post',
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify({
      who: document.getElementById('who').value , 
      yourname: document.getElementById('yourname').value , 
      email: document.getElementById('email').value , 
      tlf: document.getElementById('tlf').value , 
      adress: document.getElementById('adress').value , 
      postalcode: document.getElementById('postalcode').value , 
      trabajos: document.getElementById('trabajos').value 
    })
  })
  .then(function (resp){
    return resp.json()
  })
  .then(function (data) {
    console.log(data)
    if(data.status == 'Error') {
      let regButton = document.getElementById('registerButton')
      regButton.style.marginTop = '7px'
      if(data.code == "pendingUser") {
        let div = document.getElementById('Error')
        div.innerHTML = 'USUARIO YA PENDIENTE'
      } else if(data.code == "registeredUser"){
        return window.location.href = '../login.html?code=' + data.code
      } 
    } else if(data.status == "OK"){
      return window.location.href = '../index.html?code=registrado'
    }  // Borro formulario y ya esta en la lista pendiente 
  })
  .catch(function (error) {
    console.log('Request failed', error);
  });
}

function requestLogin() {

  fetch("http://localhost:8080/login", {
    method: 'post',
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify({
      email: document.getElementById('emaillogin').value , 
      passwd: document.getElementById('passwd').value ,
    })
  })
  .then(function (resp){
    return resp.json()
  })
  .then(function (data) {
    let logerror = document.getElementById('logerror')
    if(data.status == 'Error') {
      logerror.style.display = 'block'
    } else if(data.status == "OK"){
      console.log(data)
      document.cookie = 'remember=' + document.querySelector('#logCheck').checked
      sessionStorage.setItem( 'sescoockie', data.sescoock)
      document.cookie = 'login=' + data.coockies 
      console.log(document.cookie)
      location.href = ('index.html')
      // Completar 
    }  // Borro formulario y ya esta en la lista pendiente 
  })
  .catch(function (error) {
    console.log('Request failed', error);
  });
}
// COMPROBAR SI ESTA EL REMEMBER ME ACTIVADO. 
let sescoockie = sessionStorage.getItem( 'sescoockie' )
console.log(sessionStorage)
if(sescoockie) {
  console.log('loquesea')
  fetch("http://localhost:8080/sescoockie", {
    method: 'post',
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify({
      sescoockie: sescoockie
    })
  })
  .then(function (resp) {
    return resp.json()
  })
  .then( function(data) {       console.log(data)
    if(data.status == 'OK') {
      location.href = ('index.html')
      // DEVUELVE NO SESION NO SE REDIRIGE
    } 
  })
}
pwShowHide.forEach(eyeIcon =>{
  eyeIcon.addEventListener("click", ()=>{
      pwFields.forEach(pwField =>{
          if(pwField.type ==="password"){
              pwField.type = "text";

              pwShowHide.forEach(icon =>{
                  icon.classList.replace("uil-eye-slash", "uil-eye");
              })
          }else{
              pwField.type = "password";

              pwShowHide.forEach(icon =>{
                  icon.classList.replace("uil-eye", "uil-eye-slash");
              })
          }
      }) 
  })
})

// js code to appear signup and login form
signUp.addEventListener("click", ( )=>{
  container.classList.add("active");
});
login.addEventListener("click", ( )=>{
  container.classList.remove("active");
});
