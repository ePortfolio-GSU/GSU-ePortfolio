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
                sessionStorage.setItem("sessionToken", result.sessionToken);

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
        ["📊", "Reports & Analytics"],
        ["📅", "School Operations"],
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
        ["💬", "Send Feedback"],
        ["👤", "My Profile"],
        ["🚪", "Logout", "logout"]
    ]
}
};
// =====================================================
// GSU ACADEMIC COMMAND CENTRE
// Shared role-based session progress card
// =====================================================

const ACADEMIC_SESSION_CONFIG = {
    academicYear: getNairobiDateString().slice(0, 4),
    sessionStartDate: `${getNairobiDateString().slice(0, 4)}-01-01`,
    sessionEndDate: `${getNairobiDateString().slice(0, 4)}-12-31`,
    nextMilestone: "Year Closure",
    terms: []
};

const SESSION_ROLE_CONTEXT = {
    ICT_ADMIN: "ICT ADMIN",
    SCHOOL_ADMIN: "SCHOOL ADMIN",
    TEACHER: "TEACHER",
    LEARNER: "LEARNER",
    PARENT: "PARENT / GUARDIAN"
};

// Existing school Calendar & Events API
const SESSION_EVENTS_API_URL =
    "https://script.google.com/macros/s/AKfycbxUwPcVHRuqufNCBjKdvf_TP5FzmOr5TYAmPmbdOvnnr-iGRV8HgjcGaYEe_YpZ2oAE/exec";

let sessionEventsRefreshTimer = null;


function getNairobiDateString(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Africa/Nairobi",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(date);

    const values = {};

    parts.forEach(part => {
        if (part.type !== "literal") {
            values[part.type] = part.value;
        }
    });

    return `${values.year}-${values.month}-${values.day}`;
}


function parseSessionDate(value) {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
    }

    const date = new Date(`${value}T00:00:00+03:00`);

    return Number.isNaN(date.getTime()) ? null : date;
}


function updateAcademicTermsFromCalendar(records) {
    const currentYear = Number(
        getNairobiDateString().slice(0, 4)
    );

    const romanLabels = [
        "TERM I",
        "TERM II",
        "TERM III"
    ];

    // Retrieve all valid academic term records.
    // Do not exclude terms based on publication status.
    const validTerms = (records || [])
        .filter(record =>
            String(record.recordType || "")
                .trim()
                .toUpperCase() === "TERM"
        )
        .map(record => {
            const start = getSessionEventDate(record.startDate);
            const end = getSessionEventDate(record.endDate);

            if (!start || !end) return null;

            const startDate = getNairobiDateString(start);
            const endDate = getNairobiDateString(end);

            if (endDate < startDate) return null;

            return {
                startDate,
                endDate,
                year: Number(startDate.slice(0, 4))
            };
        })
        .filter(Boolean);

    // Identify the academic year to display.
    const availableYears = [
        ...new Set(validTerms.map(term => term.year))
    ].sort((a, b) => a - b);

    let selectedYear = currentYear;

    if (!availableYears.includes(currentYear)) {
        const futureYears = availableYears.filter(
            year => year > currentYear
        );

        selectedYear = futureYears.length
            ? futureYears[0]
            : availableYears.length
                ? availableYears[availableYears.length - 1]
                : currentYear;
    }

    // Select and arrange available terms chronologically.
    const selectedTerms = validTerms
        .filter(term => term.year === selectedYear)
        .sort((a, b) =>
            a.startDate.localeCompare(b.startDate)
        );

    // Always create exactly three term entries.
    // Calendar records supply dates, not the term labels.
    const terms = romanLabels.map((label, index) => {
        const calendarTerm = selectedTerms[index];

        return {
            label,
            startDate: calendarTerm
                ? calendarTerm.startDate
                : null,
            endDate: calendarTerm
                ? calendarTerm.endDate
                : null
        };
    });

    // Update the academic session configuration.
    ACADEMIC_SESSION_CONFIG.academicYear =
        String(selectedYear);

    ACADEMIC_SESSION_CONFIG.sessionStartDate =
        `${selectedYear}-01-01`;

    ACADEMIC_SESSION_CONFIG.sessionEndDate =
        `${selectedYear}-12-31`;

    ACADEMIC_SESSION_CONFIG.terms = terms;

    // Refresh the existing LIVE SESSION timeline.
    const timeline = document.querySelector(
        ".session-term-timeline"
    );

    if (timeline) {
        timeline.innerHTML = terms.map(term => `
            <div class="session-term">
                <span>${term.label}</span>
                <strong>${getAcademicTermStatus(term)}</strong>
            </div>
        `).join("");
    }

    // Refresh the academic year displayed on the card.
    const academicYearDisplay = document.querySelector(
        ".session-year-block strong"
    );

    if (academicYearDisplay) {
        academicYearDisplay.textContent =
            ACADEMIC_SESSION_CONFIG.academicYear;
    }

    // Recalculate session progress using the loaded academic year.
    const progress = calculateSessionProgress();

    const progressDisplay = document.querySelector(
        ".session-progress-description strong"
    );

    const progressBar = document.querySelector(
        ".session-progress-bar"
    );

    const progressFill = document.querySelector(
        ".session-progress-fill"
    );

    if (progressDisplay) {
        progressDisplay.textContent =
            progress === null ? "—" : `${progress}%`;
    }

    if (progressBar) {
        progressBar.setAttribute(
            "aria-valuenow",
            progress === null ? "0" : String(progress)
        );
    }

    if (progressFill) {
        progressFill.style.width =
            `${progress === null ? 0 : progress}%`;
    }
}


function formatSessionDate(value) {
    const date = parseSessionDate(value);

    if (!date) return "Not configured";

    return new Intl.DateTimeFormat("en-KE", {
        timeZone: "Africa/Nairobi",
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(date);
}


function calculateSessionProgress() {
    const start = parseSessionDate(
        ACADEMIC_SESSION_CONFIG.sessionStartDate
    );

    const end = parseSessionDate(
        ACADEMIC_SESSION_CONFIG.sessionEndDate
    );

    if (!start || !end || end <= start) return null;

    const now = new Date();

    const elapsed = now.getTime() - start.getTime();
    const duration = end.getTime() - start.getTime();

    return Math.min(100, Math.max(
        0,
        Math.round((elapsed / duration) * 100)
    ));
}


function getAcademicTermStatus(term) {
    const today = getNairobiDateString();

    if (
        !parseSessionDate(term.startDate) ||
        !parseSessionDate(term.endDate) ||
        term.endDate < term.startDate
    ) {
        return "DATES PENDING";
    }

    if (today < term.startDate) return "UPCOMING";
    if (today > term.endDate) return "✓";

    return "ONGOING";
}


function getAcademicTermWeek() {
    const todayString = getNairobiDateString();
    const todayParts = todayString.split("-").map(Number);

    const todayUTC = Date.UTC(
        todayParts[0],
        todayParts[1] - 1,
        todayParts[2]
    );

    const activeTerm = ACADEMIC_SESSION_CONFIG.terms.find(term =>
        todayString >= term.startDate &&
        todayString <= term.endDate
    );

    if (!activeTerm) return "HOLIDAY";

    const startParts = activeTerm.startDate.split("-").map(Number);

    const startUTC = Date.UTC(
        startParts[0],
        startParts[1] - 1,
        startParts[2]
    );

    const daysFromStart = Math.floor(
        (todayUTC - startUTC) / 86400000
    );

    const startDay = new Date(startUTC).getUTCDay();

    const daysUntilFirstSaturday =
        (6 - startDay + 7) % 7;

    if (daysFromStart <= daysUntilFirstSaturday) {
        return "WEEK 01";
    }

    const daysAfterFirstSaturday =
        daysFromStart - daysUntilFirstSaturday - 1;

    const weekNumber =
        2 + Math.floor(daysAfterFirstSaturday / 7);

    return `WEEK ${String(weekNumber).padStart(2, "0")}`;
}


// =====================================================
// EVENT DATE HELPERS
// =====================================================

function getSessionEventDate(value) {
    if (!value) return null;

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
}


function formatSessionEventDateRange(startValue, endValue) {
    const start = getSessionEventDate(startValue);
    const end = getSessionEventDate(endValue);

    if (!start || !end) return "Date unavailable";

    const options = {
        timeZone: "Africa/Nairobi",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    };

    const formatter = new Intl.DateTimeFormat("en-KE", options);

    return `${formatter.format(start)} – ${formatter.format(end)}`;
}


// =====================================================
// LOAD ONGOING AND UPCOMING EVENTS
// =====================================================

async function loadSessionEvents() {
    const ongoingTitle = document.getElementById("sessionOngoingTitle");
    const ongoingTime = document.getElementById("sessionOngoingTime");
    const upcomingTitle = document.getElementById("sessionUpcomingTitle");
    const upcomingTime = document.getElementById("sessionUpcomingTime");

    if (!ongoingTitle || !upcomingTitle) return;

    const sessionToken = sessionStorage.getItem("sessionToken");

    if (!sessionToken) {
        ongoingTitle.textContent = "Events unavailable";
        ongoingTime.textContent = "Please log in again";
        upcomingTitle.textContent = "Events unavailable";
        upcomingTime.textContent = "Please log in again";
        return;
    }

    try {
        const response = await fetch(SESSION_EVENTS_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=UTF-8"
            },
            body: JSON.stringify({
                action: "getCalendarData",
                sessionToken: sessionToken
            })
        });

        if (!response.ok) {
            throw new Error("Calendar service unavailable");
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(
                result.message || "Unable to load school events"
            );
        }

        updateAcademicTermsFromCalendar(
            result.schoolCalendar || []
        );

        // Display the current academic term or holiday.
        const currentPeriodDisplay = document.getElementById(
            "sessionCurrentAcademicPeriod"
        );

        if (currentPeriodDisplay) {
            const currentPeriod = result.currentAcademicPeriod;

            if (currentPeriod) {
                currentPeriodDisplay.textContent =
                    currentPeriod.title || (
                        currentPeriod.periodType === "HOLIDAY"
                            ? "HOLIDAY"
                            : "TERM"
                    );
            } else {
                currentPeriodDisplay.textContent =
                    "DATES PENDING";
            }
        }

        const now = new Date();

        // Only published events are eligible for display.
        const events = (result.eventsActivities || [])
            .filter(event => {
                const status = String(event.status || "").toUpperCase();

                const start = getSessionEventDate(event.startDateTime);
                const end = getSessionEventDate(event.endDateTime);

                return (
                    status === "PUBLISHED" &&
                    start &&
                    end &&
                    end >= start
                );
            });

        // Events currently in progress.
        const ongoingEvents = events
            .filter(event => {
                const start = getSessionEventDate(event.startDateTime);
                const end = getSessionEventDate(event.endDateTime);

                return start <= now && now <= end;
            })
            .sort((a, b) =>
                getSessionEventDate(a.endDateTime) -
                getSessionEventDate(b.endDateTime)
            );

        // The nearest future event.
        const upcomingEvents = events
            .filter(event => {
                const start = getSessionEventDate(event.startDateTime);

                return start > now;
            })
            .sort((a, b) =>
                getSessionEventDate(a.startDateTime) -
                getSessionEventDate(b.startDateTime)
            );

        // Display the active event ending soonest if events overlap.
        const ongoingEvent = ongoingEvents[0] || null;

        // Display the event starting soonest.
        const upcomingEvent = upcomingEvents[0] || null;

        if (ongoingEvent) {
            ongoingTitle.textContent = ongoingEvent.title;

            ongoingTime.textContent = formatSessionEventDateRange(
                ongoingEvent.startDateTime,
                ongoingEvent.endDateTime
            );
        } else {
            ongoingTitle.textContent = "No ongoing events";
            ongoingTime.textContent = "No event is currently in progress";
        }

        if (upcomingEvent) {
            upcomingTitle.textContent = upcomingEvent.title;

            upcomingTime.textContent = formatSessionEventDateRange(
                upcomingEvent.startDateTime,
                upcomingEvent.endDateTime
            );
        } else {
            upcomingTitle.textContent = "No upcoming events";
            upcomingTime.textContent = "No future events scheduled";
        }

    } catch (error) {
        console.error("Session events error:", error);

        ongoingTitle.textContent = "Events temporarily unavailable";
        ongoingTime.textContent = "";

        upcomingTitle.textContent = "Events temporarily unavailable";
        upcomingTime.textContent = "";
    }
}


function renderSessionProgressCard(role) {
    const host = document.getElementById("dashboardCards");

    if (!host) return;

    const config = ACADEMIC_SESSION_CONFIG;
    const progress = calculateSessionProgress();

    const permanentTermLabels = [
    "TERM I",
    "TERM II",
    "TERM III"
];

const termMarkup = permanentTermLabels.map((label, index) => {
    const term = config.terms[index];

    const status = term
        ? getAcademicTermStatus(term)
        : "DATES PENDING";

    return `
        <div class="session-term">
            <span>${label}</span>
            <strong>${status}</strong>
        </div>
    `;
}).join("");

    host.innerHTML = `
        <section class="session-progress-card">

            <header class="session-card-header">

                <div class="session-card-brand">
                    <span class="session-card-symbol">◎</span>

                    <div>
                        <h2>ACADEMIC COMMAND CENTRE</h2>
                        <p>GSU EMBAKASI ACADEMY</p>
                    </div>
                </div>

                <span class="session-week-date" id="sessionLiveDate">
                    Loading date...
                </span>

                <span class="session-live-indicator">
                    <span></span> LIVE
                </span>

            </header>

            <div class="session-card-main">

                <div class="session-year-block">
                    <span>ACADEMIC YEAR</span>
                    <strong>${config.academicYear}</strong>
                </div>

                <div class="session-progress-layout">

    <div class="session-progress-description">
        <span>SESSION PROGRESS</span>

        <strong>
            ${progress === null ? "—" : progress + "%"}
        </strong>
    </div>

    <div
        class="session-progress-bar"
        role="progressbar"
        aria-label="Session progress"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${progress === null ? 0 : progress}"
    >
        <div
            class="session-progress-fill"
            style="width: ${progress ?? 0}%"
        ></div>
    </div>

</div>

                <div class="session-term-timeline">
                    ${termMarkup}
                </div>

                <div class="session-activities-row">

                    <div class="session-ongoing-section">

                        <div class="session-activities-label">
                            ONGOING
                        </div>

                        <strong
                            class="session-activities-names"
                            id="sessionOngoingTitle">
                            Loading...
                        </strong>

                        <span id="sessionOngoingTime">
                            Loading...
                        </span>

                        <a href="events.html"
                           class="session-ongoing-button">
                            ONGOING
                        </a>

                    </div>

                    <div class="session-upcoming-section">

                        <div class="session-activities-label">
                            UPCOMING
                        </div>

                        <strong id="sessionUpcomingTitle">
                            Loading...
                        </strong>

                        <span id="sessionUpcomingTime">
                            Loading...
                        </span>

                    </div>

                </div>

            </div>

            <div class="session-card-clock">
                <strong id="sessionLiveTime">Loading time...</strong>
            </div>

        </section>
    `;

    updateSessionClock();

    if (window.sessionProgressClock) {
        clearInterval(window.sessionProgressClock);
    }

    window.sessionProgressClock = setInterval(
        updateSessionClock,
        1000
    );

    loadSessionEvents();

    if (sessionEventsRefreshTimer) {
        clearInterval(sessionEventsRefreshTimer);
    }

    sessionEventsRefreshTimer = setInterval(
        loadSessionEvents,
        60000
    );
}

// =====================================================
// LIVE SESSION CLOCK
// =====================================================

function updateSessionClock() {
    const dateElement = document.getElementById("sessionLiveDate");
    const timeElement = document.getElementById("sessionLiveTime");

    if (!dateElement || !timeElement) return;

    const now = new Date();

    const weekLabel = getAcademicTermWeek();

    const dayLabel = new Intl.DateTimeFormat("en-KE", {
        timeZone: "Africa/Nairobi",
        weekday: "short"
    }).format(now).toUpperCase();

    const dateLabel = new Intl.DateTimeFormat("en-KE", {
        timeZone: "Africa/Nairobi",
        day: "2-digit",
        month: "short"
    }).format(now).toUpperCase();

    dateElement.textContent =
        `${weekLabel} · ${dayLabel} · ${dateLabel}`;

    timeElement.textContent = new Intl.DateTimeFormat("en-KE", {
        timeZone: "Africa/Nairobi",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    }).format(now);
}
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
        const currentHour = new Date().getHours();

        let greeting;

        if (currentHour >= 5 && currentHour < 12) {
            greeting = "GOOD MORNING";
        } else if (currentHour >= 12 && currentHour < 17) {
            greeting = "GOOD AFTERNOON";
        } else {
            greeting = "GOOD EVENING";
        }

        welcomeHeading.textContent =
            greeting + ", " + firstName.toUpperCase();
    }

    if (welcomeMessage) {
    welcomeMessage.textContent =
        "We're glad to have you here. Your workspace is ready! Need a hand navigating the system? Tap the Help button below for quick guidance and support.";
}

    buildSidebar(config.menu);
    renderSessionProgressCard(role);
}


function buildSidebar(menuItems) {
    const sidebar = document.getElementById("sidebarMenu");
    const quickIcons = document.getElementById("sidebarQuickIcons");

    if (!sidebar) return;

    sidebar.replaceChildren();

    if (quickIcons) quickIcons.replaceChildren();

    const content = document.querySelector(".dashboard-content");

    const dashboardSections = [
        content?.querySelector(".dashboard-welcome"),
        document.getElementById("dashboardCards"),
        document.getElementById("dashboardWorkspace"),
        document.getElementById("dashboardActivity")
    ];

    function closeSidebar() {
        const panel = document.getElementById("dashboardSidebar");
        const toggle = document.getElementById("menuToggle");

        if (panel) panel.classList.remove("active");

        if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open navigation menu");
            toggle.textContent = "☰ Menu";
        }

        if (quickIcons) {
            quickIcons.querySelectorAll("button").forEach(button => {
                button.disabled = true;
                button.setAttribute("aria-disabled", "true");
            });
        }
    }

    function showDashboardOverview() {
        const role = sessionStorage.getItem("userRole");
        const config = DASHBOARD_ROLES[role];

        if (!config || !content) return;

        const moduleView = document.getElementById("dashboardModuleView");

        if (moduleView) moduleView.remove();

        const heading = document.getElementById("dashboardHeading");

        if (heading) heading.textContent = config.title;

        const breadcrumb = content.querySelector(".dashboard-breadcrumb");

        if (breadcrumb) breadcrumb.textContent = "Home";

        dashboardSections.forEach(section => {
            if (section) {
                section.hidden = false;
                section.style.display = "";
            }
        });
    }

    function showModulePage(title) {
        if (!content) return;

        const existingView = document.getElementById("dashboardModuleView");

        if (existingView) existingView.remove();

        dashboardSections.forEach(section => {
            if (section) {
                section.hidden = true;
                section.style.display = "none";
            }
        });

        const heading = document.getElementById("dashboardHeading");

        if (heading) heading.textContent = title;

        const breadcrumb = content.querySelector(".dashboard-breadcrumb");

        if (breadcrumb) {
            breadcrumb.textContent = "Home / " + title;
        }

        const moduleView = document.createElement("section");

        moduleView.id = "dashboardModuleView";
        moduleView.className = "dashboard-module-view";

        const moduleHeading = document.createElement("h2");
        moduleHeading.textContent = title;

        const moduleMessage = document.createElement("p");
        moduleMessage.textContent =
            title + " module content is awaiting implementation.";

        moduleView.append(moduleHeading, moduleMessage);
        content.appendChild(moduleView);
    }

    // Close Menu
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
        closeSidebar();
    });

    closeItem.appendChild(closeLink);
    sidebar.appendChild(closeItem);

    // Role-specific navigation
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

            sidebar.querySelectorAll("a").forEach(menuLink => {
                menuLink.classList.remove("active");
            });

            link.classList.add("active");

            if (item[1] === "Dashboard Overview") {
                showDashboardOverview();
            } else {
                showModulePage(item[1]);
            }

            closeSidebar();
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
// RESET LOGIN PAGE WHEN RETURNING THROUGH BACK BUTTON

window.addEventListener("pageshow", function () {

    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const rememberMe = document.getElementById("rememberMe");
    const showPassword = document.getElementById("showPassword");
    const togglePassword = document.getElementById("togglePassword");
    const message = document.getElementById("message");

    const loginButton = document.querySelector(
        '#loginForm button[type="submit"]'
    );

    if (loginForm) {
        loginForm.reset();
    }

    if (usernameInput) {
        usernameInput.value = "";
    }

    if (passwordInput) {
        passwordInput.value = "";
        passwordInput.type = "password";
    }

    if (rememberMe) {
        rememberMe.checked = false;
    }

    if (showPassword) {
        showPassword.checked = false;
    }

    if (togglePassword) {
        togglePassword.textContent = "👁";
    }

    if (message) {
        message.textContent = "";
    }

    if (loginButton) {
        loginButton.classList.remove(
            "is-success",
            "is-authenticating"
        );

        loginButton.textContent = "LOGIN";
        loginButton.disabled = false;
    }

});
