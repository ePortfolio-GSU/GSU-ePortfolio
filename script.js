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

        openDashboard(result.role);
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
// =====================================================
// Secure Dashboard Navigation
// =====================================================

function openDashboard(role){

    switch(role){

        case "ICT_ADMIN":
            window.location.href = "ICTDashboard.html";
            break;

        case "SCHOOL_ADMIN":
            window.location.href = "AdminDashboard.html";
            break;

        case "TEACHER":
            window.location.href = "TeacherDashboard.html";
            break;

        case "LEARNER":
            window.location.href = "LearnerDashboard.html";
            break;

        case "PARENT":
            window.location.href = "ParentDashboard.html";
            break;

        default:
            alert("Unknown user role.");
    }

        }
// =====================================================
// Logout
// =====================================================

function logoutUser(){

    if(confirm("Are you sure you want to logout?")){

        sessionStorage.clear();

        window.location.href="index.html";

    }

}
