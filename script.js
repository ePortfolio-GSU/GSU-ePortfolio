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
"https://script.google.com/macros/s/AKfycbwcYc2v0rRVF_AFDtluOVFCTja89vOH0HBtcI9rLGs0PCd7D3YpI5K4EVrb7XKaH_AL/exec";
fetch(WEB_APP_URL,{
    method:"POST",
    headers:{
    "Content-Type":"text/plain;charset=UTF-8"
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

    message.style.color = "green";
    message.textContent = "Login successful!";

    sessionStorage.setItem("loginSuccessMessage", "Login successful!");
    sessionStorage.setItem("loggedUser", result.fullName);
    sessionStorage.setItem("userRole", result.role);
    sessionStorage.setItem("username", result.username);

    setTimeout(function() {
        openDashboard(result.role);
    }, 1000);
}else{

        message.style.color="red";

    }

})

.catch(error=>{

    loginButton.textContent="LOGIN";
    loginButton.disabled=false;

    console.error(error);

    message.style.color="red";

    message.textContent =
    error.toString();

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

function logoutUser() {
    if (confirm("Are you sure you want to logout?")) {
        sessionStorage.clear();
        alert("Logout successful.");
        window.location.href = "index.html";
    }
}
// =====================================================
// GSU E-PORTFOLIO — MASTER DASHBOARD ENGINE
// Five roles, one shared dashboard
// =====================================================

const DASHBOARD_ROLES = {
    ICT_ADMIN: {
        title: "ICT ADMIN DASHBOARD",
        welcome: "Welcome to the ICT System Administrator Portal.",
        menu: [
            ["🏠", "Dashboard Overview"],
            ["👥", "User Management"],
            ["🏫", "School Administration"],
            ["🎓", "Academic Management"],
            ["📁", "Portfolio Management"],
            ["🔒", "Security Centre"],
            ["📋", "Audit Logs"],
            ["📊", "Reports & Analytics"],
            ["⚙️", "System Settings"],
            ["💾", "Backup & Recovery"],
            ["🚪", "Logout", "logout"]
        ]
    },

    SCHOOL_ADMIN: {
        title: "SCHOOL ADMIN DASHBOARD",
        welcome: "Welcome to the School Administration Portal.",
        menu: [
            ["🏠", "Dashboard Overview"],
            ["🎓", "Learners"],
            ["👩‍🏫", "Teachers"],
            ["🏫", "Classes & Subjects"],
            ["📝", "Academic Records"],
            ["📁", "Portfolios"],
            ["📊", "Reports"],
            ["⚙️", "Settings"],
            ["🚪", "Logout", "logout"]
        ]
    },

    TEACHER: {
        title: "TEACHER DASHBOARD",
        welcome: "Welcome to your teaching and learner progress workspace.",
        menu: [
            ["🏠", "Dashboard Overview"],
            ["🏫", "My Classes"],
            ["👥", "Learners"],
            ["📝", "Assessments"],
            ["📁", "Portfolios"],
            ["📊", "Reports"],
            ["👤", "My Profile"],
            ["🚪", "Logout", "logout"]
        ]
    },

    LEARNER: {
        title: "LEARNER DASHBOARD",
        welcome: "Welcome to your personal learning portfolio.",
        menu: [
            ["🏠", "Dashboard Overview"],
            ["📁", "My Portfolio"],
            ["📝", "My Assessments"],
            ["📚", "Learning Resources"],
            ["🏆", "Achievements"],
            ["👤", "My Profile"],
            ["🚪", "Logout", "logout"]
        ]
    },

    PARENT: {
        title: "PARENT DASHBOARD",
        welcome: "Welcome to the parent and guardian portal.",
        menu: [
            ["🏠", "Dashboard Overview"],
            ["👨‍👩‍👧", "My Children"],
            ["📈", "Academic Progress"],
            ["📁", "Portfolios"],
            ["📅", "Attendance"],
            ["💬", "Messages"],
            ["👤", "My Profile"],
            ["🚪", "Logout", "logout"]
        ]
    }
};


// Initialize dashboard after the page loads
document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("dashboardSidebar");
    const menuToggle = document.getElementById("menuToggle");
    const profileBtn = document.getElementById("profileBtn");
    const profileMenu = document.getElementById("profileMenu");
    const myProfileBtn = document.getElementById("myProfileBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const chatBtn = document.getElementById("chatBtn");
    const helpBtn = document.getElementById("helpBtn");

    if (sidebar && menuToggle) {
        setMenuOpen(false);

        menuToggle.addEventListener("click", function () {
            setMenuOpen(!sidebar.classList.contains("active"));
        });

        sidebar.addEventListener("click", function (event) {
            const link = event.target.closest("a");

            if (link && window.matchMedia("(max-width: 768px)").matches) {
                setMenuOpen(false);
            }
        });
    }

    function setMenuOpen(open) {
    const sidebar = document.getElementById("dashboardSidebar");
    const menuToggle = document.getElementById("menuToggle");

    if (!sidebar || !menuToggle) return;

    sidebar.classList.toggle("active", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
        "aria-label",
        open ? "Close navigation menu" : "Open navigation menu"
    );
    menuToggle.textContent = open ? "✕ Close" : "☰ Menu";

    const quickIcons = document.querySelectorAll(
        "#sidebarQuickIcons button"
    );

    quickIcons.forEach(function (button) {
        button.disabled = !open;
        button.setAttribute("aria-disabled", String(!open));
    });
}

    if (profileBtn && profileMenu) {
        profileBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            profileMenu.hidden = !profileMenu.hidden;
            profileBtn.setAttribute(
                "aria-expanded",
                String(!profileMenu.hidden)
            );
        });

        document.addEventListener("click", function (event) {
            if (!event.target.closest(".profile-dropdown")) {
                profileMenu.hidden = true;
                profileBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            setMenuOpen(false);

            if (profileMenu) profileMenu.hidden = true;
            if (profileBtn) {
                profileBtn.setAttribute("aria-expanded", "false");
            }
        }
    });

    if (logoutBtn) {
        logoutBtn.addEventListener("click", logoutUser);
    }

    if (myProfileBtn) {
        myProfileBtn.addEventListener("click", function () {
            alert("My Profile page has not yet been connected.");
        });
    }

    if (chatBtn) {
        chatBtn.addEventListener("click", function () {
            alert("Chat support has not yet been connected.");
        });
    }

    if (helpBtn) {
        helpBtn.addEventListener("click", function () {
            alert("Help content has not yet been connected.");
        });
    }

    if (document.body.classList.contains("dashboard-page")) {
        initializeDashboard();
    }
});

// Check session and load the correct role
function initializeDashboard() {
    const user = sessionStorage.getItem("loggedUser");
    const role = sessionStorage.getItem("userRole");

    if (!user || !role || !DASHBOARD_ROLES[role]) {
        alert("Your session is invalid or has expired. Please log in again.");
        sessionStorage.clear();
        window.location.replace("index.html");
        return;
    }

    const currentUser = document.getElementById("currentUser");
    if (currentUser) {
        currentUser.textContent = "Hi, " + user;
    }

    loadDashboard(role);
}


// Generate the shared dashboard for the assigned role
function loadDashboard(role) {
    const config = DASHBOARD_ROLES[role];

    if (!config) {
        alert("Invalid user role. Please log in again.");
        sessionStorage.clear();
        window.location.replace("index.html");
        return;
    }

    const heading = document.getElementById("dashboardHeading");
    const welcomeHeading = document.getElementById("welcomeHeading");
    const welcomeMessage = document.getElementById("welcomeMessage");

    if (heading) heading.textContent = config.title;

    if (welcomeHeading) {
        welcomeHeading.textContent =
            "Welcome, " + sessionStorage.getItem("loggedUser");
    }

    if (welcomeMessage) {
        welcomeMessage.textContent = config.welcome;
    }

    buildSidebar(config.menu);
}


// Build role-specific navigation and quick icons
function buildSidebar(menuItems) {
    const sidebar = document.getElementById("sidebarMenu");
    const quickIcons = document.getElementById("sidebarQuickIcons");

    if (!sidebar) return;

    sidebar.replaceChildren();

    if (quickIcons) {
        quickIcons.replaceChildren();
    }

    // First sidebar row: Close Menu
    const closeItem = document.createElement("li");
    const closeLink = document.createElement("a");

    closeLink.href = "#";
    closeLink.textContent = "✕ Close Menu";
    closeLink.className = "sidebar-close-link";

    closeLink.addEventListener("click", function (event) {
        event.preventDefault();

        const sidebarPanel =
            document.getElementById("dashboardSidebar");
        const menuToggle =
            document.getElementById("menuToggle");

        if (sidebarPanel) {
            sidebarPanel.classList.remove("active");
        }

        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );
            menuToggle.textContent = "☰ Menu";
        }

        if (quickIcons) {
            quickIcons.querySelectorAll("button").forEach(
                function (button) {
                    button.disabled = true;
                    button.setAttribute("aria-disabled", "true");
                }
            );
        }
    });

    closeItem.appendChild(closeLink);
    sidebar.appendChild(closeItem);

    // Remaining rows correspond to the strip icons
    menuItems.forEach(function (item) {
        const li = document.createElement("li");
        const link = document.createElement("a");

        link.href = "#";
        link.textContent = item[1];

        link.addEventListener("click", function (event) {
            event.preventDefault();

            if (item[2] === "logout") {
                logoutUser();
                return;
            }

            sidebar.querySelectorAll("a").forEach(
                function (menuLink) {
                    menuLink.classList.remove("active");
                }
            );

            link.classList.add("active");

            if (item[1] === "Dashboard Overview") {
                const role = sessionStorage.getItem("userRole");
                const heading =
                    document.getElementById("dashboardHeading");

                if (heading && DASHBOARD_ROLES[role]) {
                    heading.textContent =
                        DASHBOARD_ROLES[role].title;
                }
            } else {
                alert(
                    item[1] +
                    " is listed in the menu but its page is not yet connected."
                );
            }
        });

        li.appendChild(link);
        sidebar.appendChild(li);

        if (quickIcons) {
            const iconButton = document.createElement("button");

            iconButton.type = "button";
            iconButton.textContent = item[0];
            iconButton.title = item[1];
            iconButton.setAttribute("aria-label", item[1]);
            iconButton.disabled = true;
            iconButton.setAttribute("aria-disabled", "true");

            iconButton.addEventListener("click", function () {
                if (!iconButton.disabled) {
                    link.click();
                }
            });

            quickIcons.appendChild(iconButton);
        }
    });
}
