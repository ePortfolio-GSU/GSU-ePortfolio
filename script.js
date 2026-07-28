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

const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycbyDzCHI9SWd1uyzuKnnrXgSmnMeQtGa4qcjeFxIIdoYvEVspKbmbnvIz8qZ16oEQoMx/exec";

fetch(WEB_APP_URL,{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({
        action:"login",
        username:username,
        password:password
    })
})

.then(response=>response.json())

.then(result=>{

    loginButton.textContent="LOGIN";
    loginButton.disabled=false;

    message.textContent=result.message;

    if(result.success){

        message.style.color="green";

        sessionStorage.setItem("loggedUser",result.fullName);
        sessionStorage.setItem("userRole",result.role);
        sessionStorage.setItem("username",result.username);

        openDashboard(result.role);

    }else{

        message.style.color="red";

    }

})

.catch(error=>{

    loginButton.textContent="LOGIN";
    loginButton.disabled=false;

    message.style.color="red";
    message.textContent="Unable to connect to the server.";

    console.error(error);

});


    });

}
// =====================================================
// Secure Dashboard Navigation
// =====================================================

function openDashboard(role){

    switch(role){

        case "ICT_ADMIN":
            window.location.href = "MasterDashboard.html";
            break;

        case "SCHOOL_ADMIN":
            window.location.href = "MasterDashboard.html";
            break;

        case "TEACHER":
            window.location.href = "MasterDashboard.html";
            break;

        case "LEARNER":
            window.location.href = "MasterDashboard.html";
            break;

        case "PARENT":
            window.location.href = "MasterDashboard.html";
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
// ======================================================
// MASTER DASHBOARD ROLE ENGINE
// ======================================================

function initializeDashboard(){

    const user = sessionStorage.getItem("loggedUser");
    const role = sessionStorage.getItem("userRole");

    if(!user || !role){

        alert("Session expired. Please login again.");

        window.location.href = "index.html";

        return;

    }

    document.getElementById("currentUser").textContent = "Welcome, " + user;

    loadDashboard(role);

}
// ======================================================
// LOAD ROLE-BASED DASHBOARD
// ======================================================

function loadDashboard(role){

    switch(role){

        case "ICT_ADMIN":

            document.getElementById("dashboardTitle").textContent =
            "ICT System Administrator Dashboard";

            loadICTDashboard();

            break;

        case "SCHOOL_ADMIN":

            document.getElementById("dashboardTitle").textContent =
            "School Administrator Dashboard";

            loadSchoolAdminDashboard();

            break;

        case "TEACHER":

            document.getElementById("dashboardTitle").textContent =
            "Teacher Dashboard";

            loadTeacherDashboard();

            break;

        case "LEARNER":

            document.getElementById("dashboardTitle").textContent =
            "Learner Dashboard";

            loadLearnerDashboard();

            break;

        case "PARENT":

            document.getElementById("dashboardTitle").textContent =
            "Parent Dashboard";

            loadParentDashboard();

            break;

        default:

            alert("Invalid user role.");

            logoutUser();

    }

}
// ======================================================
// ICT SYSTEM ADMINISTRATOR
// ======================================================

function loadICTDashboard(){

    buildSidebar([

        {icon:"🏠", name:"Dashboard Overview", link:"#"},
        {icon:"👥", name:"User Management", link:"#"},
        {icon:"🏫", name:"School Administration", link:"#"},
        {icon:"🎓", name:"Academic Management", link:"#"},
        {icon:"📁", name:"Portfolio Management", link:"#"},
        {icon:"🔒", name:"Security Centre", link:"#"},
        {icon:"📋", name:"Audit Logs", link:"#"},
        {icon:"📊", name:"Reports & Analytics", link:"#"},
        {icon:"⚙", name:"System Settings", link:"#"},
        {icon:"💾", name:"Backup & Recovery", link:"#"},
        {icon:"🚪", name:"Logout", link:"#", action:"logout"}

    ]);

    document.getElementById("dashboardHeading").textContent =
    "ICT System Administrator Dashboard";

}
// ======================================================
// SCHOOL ADMINISTRATOR
// ======================================================

function loadSchoolAdminDashboard(){

    console.log("School Administrator Dashboard Loaded");

}
// ======================================================
// TEACHER
// ======================================================

function loadTeacherDashboard(){

    console.log("Teacher Dashboard Loaded");

}
// ======================================================
// LEARNER
// ======================================================

function loadLearnerDashboard(){

    console.log("Learner Dashboard Loaded");

}
// ======================================================
// PARENT
// ======================================================

function loadParentDashboard(){

    console.log("Parent Dashboard Loaded");

}
// ======================================================
// DYNAMIC SIDEBAR GENERATOR
// ======================================================

function buildSidebar(menuItems){

    const sidebar = document.getElementById("sidebarMenu");

    if(!sidebar) return;

    sidebar.innerHTML = "";

    menuItems.forEach(function(item){

        const li = document.createElement("li");

        li.innerHTML =
        `<a href="${item.link}">
            ${item.icon} ${item.name}
        </a>`;

        sidebar.appendChild(li);

    });

}
