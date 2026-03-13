function handleCredentialResponse(response){

const user = parseJwt(response.credential)

fetch("http://localhost:5000/api/google-login",{

method:"POST",
headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(user)

})
.then(res=>res.json())
.then(data=>{

localStorage.setItem("user",JSON.stringify(data))

window.location.href="dashboard.html"

})

}

function parseJwt(token){

let base64Url = token.split('.')[1]

return JSON.parse(atob(base64Url))

}