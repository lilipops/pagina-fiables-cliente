function loginCookie() {
    if(document.cookie.includes('login=')) {
        let copiacookie = document.cookie
        let idxcoockie = copiacookie.indexOf('login=')
        copiacookie = copiacookie.slice(idxcoockie + 6, copiacookie.length)
        let puntoycoma = copiacookie.indexOf('; ')
        if(puntoycoma != -1) {
            copiacookie = copiacookie.slice(0, puntoycoma)
        }
    
        
        console.log(copiacookie)
        console.log(document.cookie)
        fetch("http://localhost:8080/coockie", {
            method: 'post',
            headers: {
             "Content-type": "application/json; charset=UTF-8"
            },
             body: JSON.stringify({ 
                coockies: copiacookie
             })
            }) 
            .then( function (resp) {
                
                return resp.json()
            })
            .then( function(data) {
                console.log(data)
                if(data.status == 'OK') {
                    sessionStorage.setItem( 'sescoockie', data.sescoock)
                    document.cookie = 'login=' + data.coockies
                    console.log(document.cookie)
                } 
            })
            
            
    }
}
function logoutCookie() {
    let sescoockie = sessionStorage.getItem( 'sescoockie' )
    if(sescoockie) {
      console.log('hola');
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
      .then( function(data) {
        console.log(data + ' dataa//')
        if(data.status == 'OK') {
            let login = document.getElementById('login')
            login.innerHTML = 'logout'
            login.onclick = function() {
                sessionStorage.setItem('sescoockie', undefined)
                document.cockie = 'login='
                document.cockie = 'remember=false'
            }
        } 
      })
    }
}
if(document.cookie.includes('remember=true')) {
    let sescoockie = sessionStorage.getItem( 'sescoockie' )
    if(sescoockie) {
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
        .then( function(data) {
            if(data.status == 'no sesion') {
                loginCookie()
                logoutCookie()
            } 
        })
    } else {
        loginCookie()
        logoutCookie()
    }
}
