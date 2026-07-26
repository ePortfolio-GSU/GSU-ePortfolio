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



      // Login loading state

const loginButton = loginForm.querySelector("button");

loginButton.textContent = "Authenticating...";
loginButton.disabled = true;

message.textContent = "";

google.script.run

.withSuccessHandler(function(result){

    loginButton.textContent = "LOGIN";
    loginButton.disabled = false;

    message.textContent = result.message;

    if(result.success){

        message.style.color = "green";

        sessionStorage.setItem("loggedUser", result.fullName);
        sessionStorage.setItem("userRole", result.role);

        switch(result.role){

            case "ICT_ADMIN":
               // ICT Dashboard will open through Apps Script
                break;

            case "SCHOOL_ADMIN":
                // School Administrator Dashboard will open through Apps Script
                break;

            case "TEACHER":
               // Teacher Dashboard will open through Apps Script
                break;

            case "LEARNER":
                // Learner Dashboard will open through Apps Script
                break;

            case "PARENT":
                // Parent Dashboard will open through Apps Script
                break;

            default:
                message.textContent = "Unknown user role.";
                message.style.color = "red";

        }

    }

    else{

        message.style.color = "red";

    }

})

.withFailureHandler(function(error){

    loginButton.textContent = "LOGIN";
    loginButton.disabled = false;

    message.textContent = "System error. Please try again.";

    message.style.color = "red";

    console.error(error);

})

.authenticateUser(username,password);



    });

}
