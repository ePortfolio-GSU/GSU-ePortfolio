// GSU Embakasi Academy
// E-Portfolio Portal
// Version 1.0 JavaScript Foundation


// Password visibility control

const passwordInput = document.getElementById("password");
const showPassword = document.getElementById("showPassword");
const togglePassword = document.getElementById("togglePassword");


if (showPassword) {

    showPassword.addEventListener("change", function(){

        if(this.checked){
            passwordInput.type = "text";
        }
        else{
            passwordInput.type = "password";
        }

    });

}


if (togglePassword) {

    togglePassword.addEventListener("click", function(){

        if(passwordInput.type === "password"){

            passwordInput.type = "text";
            togglePassword.textContent = "🙈";

        }

        else{

            passwordInput.type = "password";
            togglePassword.textContent = "👁";

        }

    });

}



// Login form handling

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");


if(loginForm){

    loginForm.addEventListener("submit", function(event){

        event.preventDefault();


        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();



        if(username === "" || password === ""){

            message.textContent = "Please enter username and password.";
            message.style.color = "red";

            return;

        }



        // Temporary authentication message
        // Real Apps Script authentication will be connected here

        message.textContent = "Authenticating...";
        message.style.color = "#0B57D0";



        setTimeout(function(){

            message.textContent = "Authentication system ready.";
            message.style.color = "green";


        },1500);



    });

}
