// GSU Embakasi Academy
// E-Portfolio Portal
// Version 1.0 JavaScript Foundation


// PASSWORD VISIBILITY CONTROL

const passwordInput = document.getElementById("password");
const showPassword = document.getElementById("showPassword");
const togglePassword = document.getElementById("togglePassword");

let passwordVisibilityTimer = null;


// Automatically hide password
function hidePassword() {

    clearTimeout(passwordVisibilityTimer);

    if (passwordInput) {
        passwordInput.type = "password";
    }

    if (showPassword) {
        showPassword.checked = false;
    }

    if (togglePassword) {
        togglePassword.textContent = "👁";
    }
}


// Start or refresh the 10-second countdown
function refreshPasswordTimer() {

    clearTimeout(passwordVisibilityTimer);

    passwordVisibilityTimer = setTimeout(function() {
        hidePassword();
    }, 10000);
}


// Checkbox password visibility
if (showPassword) {

    showPassword.addEventListener("change", function() {

        if (this.checked) {

            passwordInput.type = "text";

            if (togglePassword) {
                togglePassword.textContent = "🙈";
            }

            refreshPasswordTimer();

        } else {

            hidePassword();

        }

    });

}


// Eye icon password visibility
if (togglePassword) {

    togglePassword.addEventListener("click", function() {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            if (showPassword) {
                showPassword.checked = true;
            }

            togglePassword.textContent = "🙈";

            refreshPasswordTimer();

        } else {

            hidePassword();

        }

    });

}


// Refresh countdown whenever a character is entered
if (passwordInput) {

    passwordInput.addEventListener("input", function() {

        if (passwordInput.type === "text") {
            refreshPasswordTimer();
        }

    });

}



// LOGIN FORM HANDLING

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

const usernameInput = document.getElementById("username");


if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        // Close password visibility immediately
        hidePassword();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Validate empty fields
        if (username === "" || password === "") {

            message.textContent = "Please enter username and password.";
            message.style.color = "red";

            return;

        }


        // Capture credentials, then clear both fields
        usernameInput.value = "";
        passwordInput.value = "";


        // Login loading state
        const loginButton = loginForm.querySelector('button[type="submit"]');

        loginButton.classList.remove("is-success");
        loginButton.classList.add("is-authenticating");
        loginButton.textContent = "Authenticating...";
        loginButton.disabled = true;

        message.textContent = "";
        message.style.color = "";


        const WEB_APP_URL =
        "https://script.google.com/macros/s/AKfycbwcYc2v0rRVF_AFDtluOVFCTja89vOH0HBtcI9rLGs0PCd7D3YpI5K4EVrb7XKaH_AL/exec";


        fetch(WEB_APP_URL, {

            method: "POST",

            headers: {
                "Content-Type": "text/plain;charset=UTF-8"
            },

            body: JSON.stringify({
                action: "login",
                username: username,
                password: password
            })

        })

        .then(response => response.json())

        .then(result => {

            if (result.success) {

                loginButton.classList.remove("is-authenticating");
                loginButton.classList.add("is-success");
                loginButton.textContent = "LOGIN SUCCESSFUL ✓";

                message.textContent = "";

                sessionStorage.setItem("loginSuccessMessage", "Login successful!");
                sessionStorage.setItem("loggedUser", result.fullName);
                sessionStorage.setItem("userRole", result.role);
                sessionStorage.setItem("username", result.username);

                setTimeout(function() {
    openDashboard(result.role);
}, 1000);


            } else {

                loginButton.classList.remove("is-authenticating");
                loginButton.textContent = "LOGIN";
                loginButton.disabled = false;

                // Red blinking and shaking effect
                usernameInput.classList.remove("login-error");
                passwordInput.classList.remove("login-error");

                void usernameInput.offsetWidth;

                usernameInput.classList.add("login-error");
                passwordInput.classList.add("login-error");

                setTimeout(function() {

                    usernameInput.classList.remove("login-error");
                    passwordInput.classList.remove("login-error");

                }, 800);

                message.style.color = "red";
                message.textContent = result.message;

            }

        })

        .catch(error => {

            loginButton.classList.remove("is-authenticating");
            loginButton.textContent = "LOGIN";
            loginButton.disabled = false;

            console.error(error);

            message.style.color = "red";
            message.textContent = error.toString();

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
function logoutUser() {
    sessionStorage.clear();

    const logoutMessage = document.createElement("div");
    logoutMessage.textContent = "Logout successful!";
    logoutMessage.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: fit-content;
        max-width: calc(100% - 32px);
        box-sizing: border-box;
        padding: 12px 20px;
        border-radius: 10px;
        color: #ffffff;
        background: linear-gradient(
            110deg,
            #087f3e,
            #20b85a,
            #087f3e,
            #35c96b
        );
        background-size: 300% 100%;
        font-weight: 700;
        text-align: center;
        overflow-wrap: anywhere;
        box-shadow: 0 4px 14px rgba(0, 110, 50, 0.25);
        z-index: 99999;
        animation:
            logoutGradient 1.5s ease-in-out infinite,
            logoutFade 2s ease forwards;
    `;

    if (!document.getElementById("logoutAnimationStyles")) {
        const style = document.createElement("style");
        style.id = "logoutAnimationStyles";
        style.textContent = `
            @keyframes logoutGradient {
                0% { background-position: 0% 50%; }
                100% { background-position: 100% 50%; }
            }

            @keyframes logoutFade {
                0% { opacity: 0; }
                15% { opacity: 1; }
                75% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(logoutMessage);

    setTimeout(function () {
        window.location.replace("index.html");
    }, 2000);
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

    if (!link) return;

    if (link.classList.contains("sidebar-close-link")) return;
    if (link.textContent.trim().includes("Logout")) return;

    if (link.getAttribute("href") === "#") {
        event.preventDefault();

        link.classList.remove("unlinked-shake");
        void link.offsetWidth;
        link.classList.add("unlinked-shake");

        return;
    }

    if (window.matchMedia("(max-width: 768px)").matches) {
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
    menuToggle.textContent = open ? "Close ✕" : "☰ Menu";

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
    const loggedUser = sessionStorage.getItem("loggedUser") || "";
    const firstName = loggedUser.trim().split(/\s+/)[0];

    welcomeHeading.textContent = "WELCOME BACK, " + firstName.toUpperCase();
}

    if (welcomeMessage) {
    welcomeMessage.textContent =
        "We're glad to have you here. Your workspace is ready! Need a hand navigating the system? Tap the Help button below for quick guidance and support.";
}

    buildSidebar(config.menu);
}


function buildSidebar(menuItems) {
    const sidebar = document.getElementById("sidebarMenu");
    const quickIcons = document.getElementById("sidebarQuickIcons");

    if (!sidebar) return;

    sidebar.replaceChildren();

    if (quickIcons) {
        quickIcons.replaceChildren();
    }

    // Close Menu row
    const closeItem = document.createElement("li");
    const closeLink = document.createElement("a");

    closeLink.href = "#";
    closeLink.className = "sidebar-close-link";

    const closeIcon = document.createElement("span");
    closeIcon.className = "sidebar-item-icon";
    closeIcon.textContent = "✕";

    const closeLabel = document.createElement("span");
    closeLabel.className = "sidebar-item-label";
    closeLabel.textContent = "Close Menu";

    closeLink.append(closeIcon, closeLabel);

    closeLink.addEventListener("click", function (event) {
        event.preventDefault();

        const sidebarPanel = document.getElementById("dashboardSidebar");
        const menuToggle = document.getElementById("menuToggle");

        if (sidebarPanel) sidebarPanel.classList.remove("active");

        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
            menuToggle.textContent = "☰ Menu";
        }

        if (quickIcons) {
            quickIcons.querySelectorAll("button").forEach(function (button) {
                button.disabled = true;
                button.setAttribute("aria-disabled", "true");
            });
        }
    });

    closeItem.appendChild(closeLink);
    sidebar.appendChild(closeItem);

// Menu rows and matching quick-strip icons
    menuItems.forEach(function (item) {
        const li = document.createElement("li");
        const link = document.createElement("a");

        link.href = "#";

        const icon = document.createElement("span");
        icon.className = "sidebar-item-icon";
        icon.textContent = item[0];

        const label = document.createElement("span");
        label.className = "sidebar-item-label";
        label.textContent = item[1];

        link.append(icon, label);

        link.addEventListener("click", function (event) {
            event.preventDefault();

            if (item[2] === "logout") {
                logoutUser();
                return;
            }

            sidebar.querySelectorAll("a").forEach(function (menuLink) {
                menuLink.classList.remove("active");
            });

            link.classList.add("active");

            if (item[1] === "Dashboard Overview") {
                const role = sessionStorage.getItem("userRole");
                const heading = document.getElementById("dashboardHeading");

                if (heading && DASHBOARD_ROLES[role]) {
                    heading.textContent = DASHBOARD_ROLES[role].title;
                }
            } else {
                link.classList.remove("unlinked-shake");
                void link.offsetWidth;
                link.classList.add("unlinked-shake");

                link.addEventListener("animationend", function cleanup() {
                    link.classList.remove("unlinked-shake");
                    link.removeEventListener("animationend", cleanup);
                }, { once: true });
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
                if (!iconButton.disabled) link.click();
            });

            quickIcons.appendChild(iconButton);
        }
    });
}
/* UNLINKED CONTROLS — SHAKE INSTEAD OF POPUPS */

document.addEventListener("click", function (event) {
    const control = event.target.closest(
        "button, a, [role='button'], [role='tab'], .tab, .menu-item, .nav-item"
    );

    if (!control) return;
if (
    control.id === "logoutBtn" ||
    control.textContent.trim().includes("Logout") ||
    control.closest("#logoutBtn")
) return;
    const isLink = control.matches("a[href]");
    const href = isLink ? control.getAttribute("href") : "";

    const hasDestination =
        isLink &&
        href &&
        href !== "#" &&
        !href.toLowerCase().startsWith("javascript:");

    const hasAction =
        control.hasAttribute("onclick") ||
        control.hasAttribute("data-action") ||
        control.hasAttribute("data-target") ||
        control.hasAttribute("type") ||
        control.getAttribute("role") === "tab";

    if (hasDestination || hasAction) return;

    event.preventDefault();

    control.classList.remove("unlinked-shake");
    void control.offsetWidth;
    control.classList.add("unlinked-shake");

    control.addEventListener("animationend", function cleanup() {
        control.classList.remove("unlinked-shake");
        control.removeEventListener("animationend", cleanup);
    }, { once: true });
});
