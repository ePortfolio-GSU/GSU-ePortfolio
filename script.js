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

    if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        // Close password visibility immediately
        hidePassword();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Validate empty fields
        if (username === "" || password === "") {

            GSUNotify.warning(
                "Please enter both your username and password."
            );

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

                GSUNotify.error(
                    result.message || "Login failed. Please check your credentials."
                );

            }

        })

        .catch(error => {

            loginButton.classList.remove("is-authenticating");
            loginButton.textContent = "LOGIN";
            loginButton.disabled = false;

            console.error(error);

            GSUNotify.error(
                error.message || "Unable to connect to the login service. Please try again."
            );

        });

    });

}

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
            GSUNotify.error(
                "Unknown user role. Please contact the ICT Administrator."
            );
    }

}
function logoutUser() {
    GSUNotify.success(
        "You have successfully logged out of your account.",
        { duration: 1800 }
    );

    sessionStorage.clear();

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
            ["layout-dashboard", "Dashboard Overview", "dashboard_overview"],
            ["users", "Identity & Access", "identity_access_management"],
            ["building-2", "Institutional Management", "institutional_management"],
            ["graduation-cap", "Academic Operations", "academic_operations"],
            ["book-open", "Digital Learning Centre", "digital_learning_centre"],
            ["chart-no-axes-combined", "Academic Insights (AAARS)", "academic_intelligence"],
            ["folder-kanban", "Portfolio & Project Studio", "portfolio_project_studio"],
            ["vote", "Elections (GSEC)", "electoral_management"],
            ["users-round", "Student Affairs", "student_affairs"],
            ["trophy", "Co-Curricular Activities", "co_curricular_activities"],
            ["wallet", "Financial Management", "financial_management"],
            ["messages-square", "Communications Centre", "communications_centre"],
            ["shield-check", "Security & Compliance", "security_compliance"],
            ["compass", "System Intelligence", "platform_intelligence_navigation"],
            ["settings", "System Settings", "system_settings"],
            ["database-backup", "Data Protection & Recovery", "data_protection_recovery"],
            ["life-buoy", "Digital Support Centre", "digital_support"]
        ]
    },

    SCHOOL_ADMIN: {
        title: "SCHOOL ADMIN DASHBOARD",
        welcome: "Welcome to the School Administration Portal.",
        menu: [
            ["layout-dashboard", "School Dashboard", "dashboard_overview"],
            ["users", "User Management", "identity_access_management"],
            ["building-2", "School Structure", "institutional_management"],
            ["graduation-cap", "Academic Administration", "academic_operations"],
            ["book-open", "Learning Management", "digital_learning_centre"],
            ["chart-no-axes-combined", "Academic Insights", "academic_intelligence"],
            ["folder-kanban", "Projects & Portfolios", "portfolio_project_studio"],
            ["users-round", "Student Affairs", "student_affairs"],
            ["trophy", "Co-Curricular Affairs", "co_curricular_activities"],
            ["wallet", "Financial Administration", "financial_management"],
            ["messages-square", "School Communications", "communications_centre"],
            ["shield-check", "Security & Compliance", "security_compliance"]
        ]
    },

    TEACHER: {
        title: "TEACHER DASHBOARD",
        welcome: "Welcome to your teaching and learner progress workspace.",
        menu: [
            ["layout-dashboard", "Teaching Dashboard", "dashboard_overview"],
            ["graduation-cap", "Class Management", "academic_operations"],
            ["book-open", "Digital Learning Resources", "digital_learning_centre"],
            ["chart-no-axes-combined", "Assessment & Results", "academic_intelligence"],
            ["folder-kanban", "Teaching Portfolio", "portfolio_project_studio"],
            ["vote", "School Elections", "electoral_management"],
            ["users-round", "Student & Class Affairs", "student_affairs"],
            ["trophy", "Co-Curricular Coordination", "co_curricular_activities"],
            ["messages-square", "School Communications", "communications_centre"],
            ["life-buoy", "Learner Support Centre", "digital_support"]
        ]
    },

    LEARNER: {
        title: "LEARNER DASHBOARD",
        welcome: "Welcome to your personal learning portfolio.",
        menu: [
            ["layout-dashboard", "Learner Dashboard", "dashboard_overview"],
            ["clipboard-list", "Academic Activities", "academic_operations"],
            ["book-open", "Digital Learning Resources", "digital_learning_centre"],
            ["chart-no-axes-combined", "Academic Performance", "academic_intelligence"],
            ["folder-kanban", "Learning Portfolio", "portfolio_project_studio"],
            ["vote", "Student Elections", "electoral_management"],
            ["trophy", "Co-Curricular Participation", "co_curricular_activities"],
            ["messages-square", "School Communications", "communications_centre"]
        ]
    },

    PARENT: {
        title: "PARENT DASHBOARD",
        welcome: "Welcome to the parent and guardian portal.",
        menu: [
            ["layout-dashboard", "Parent Dashboard", "dashboard_overview"],
            ["clipboard-list", "Child's Academic Activities", "academic_operations"],
            ["chart-no-axes-combined", "Academic Progress", "academic_intelligence"],
            ["folder-kanban", "Child's Portfolio", "portfolio_project_studio"],
            ["building-2", "School Profile", "institutional_management"],
            ["messages-square", "School Communications", "communications_centre"]
        ]
    }
};
// =====================================================
// GSU PERSONALIZED ROLE-BASED WELCOME MESSAGES
// Rotates messages across successive logins
// =====================================================

function getRoleWelcomeMessage(role, firstName) {
    const name = firstName || "there";

    const messages = {
        ICT_ADMIN: [
            `Welcome back, ${name}. Your expertise helps keep the GSU digital ecosystem secure, reliable and ready for everyone.`,
            `${name}, every improvement you make strengthens the foundation of our digital learning environment. Keep innovating.`,
            `A new session, ${name}, and another opportunity to advance technology, security and institutional excellence.`,
            `Your commitment to digital excellence makes a difference, ${name}. Thank you for keeping the system moving forward.`,
            `Welcome again, ${name}. Stay alert, think ahead and continue building a smarter digital institution.`,
            `${name}, consistent system improvement is the foundation of lasting digital transformation. Keep leading the way.`
        ],

        SCHOOL_ADMIN: [
            `Welcome back, ${name}. Your leadership and coordination help create an organised and productive school environment.`,
            `${name}, every well-managed process contributes to better teaching, learning and institutional success.`,
            `A new day to make a difference, ${name}. Keep strengthening the systems that support our school community.`,
            `Your dedication to effective school administration matters, ${name}. Keep moving the institution forward.`,
            `Welcome again, ${name}. Thoughtful decisions and consistent leadership build a stronger school.`,
            `${name}, excellence in administration begins with commitment, accountability and attention to detail. Keep it up.`
        ],

        TEACHER: [
            `Welcome back, ${name}. Every lesson you prepare is another opportunity to inspire, guide and transform a learner's future.`,
            `${name}, your patience and dedication make a lasting difference. Keep nurturing curiosity and potential.`,
            `A new teaching session awaits, ${name}. Continue inspiring learners to discover, question and achieve.`,
            `Welcome again, ${name}. Every learner progresses differently. Your guidance helps each one move forward.`,
            `${name}, great teaching goes beyond delivering content. Keep encouraging confidence, creativity and independent thinking.`,
            `Your commitment to shaping young minds matters, ${name}. Keep teaching with purpose and passion.`
        ],

        LEARNER: [
            `Welcome to another learning session, ${name}. Every new day brings an opportunity to reach another milestone.`,
            `${name}, keep working smart and hard. Small, consistent efforts lead to meaningful achievements.`,
            `It is great to see you back, ${name}. Your persistence is part of your progress. Keep seeking knowledge.`,
            `Every challenge is an opportunity to grow, ${name}. Stay curious, remain focused and believe in your ability.`,
            `Welcome back, ${name}. Celebrate how far you have come, then keep pushing towards your next achievement.`,
            `${name}, your future is shaped by the effort you invest today. Keep learning, practising and improving.`,
            `Another opportunity to learn and excel, ${name}. Stay disciplined, ask questions and never stop exploring.`,
            `Your determination deserves recognition, ${name}. Keep showing up, keep learning and let your progress speak.`
        ],

        PARENT: [
            `Welcome back, ${name}. Your continued involvement plays an important role in supporting your child's educational journey.`,
            `${name}, every word of encouragement and every moment of support can help a learner reach greater heights.`,
            `Thank you for staying connected, ${name}. Your partnership with the school strengthens your child's learning experience.`,
            `Welcome again, ${name}. Keep encouraging progress, celebrating effort and supporting your child's potential.`,
            `${name}, education is a partnership. Your interest and involvement help build a stronger foundation for success.`,
            `Your support matters, ${name}. Stay engaged, stay informed and continue inspiring your child's growth.`
        ]
    };

    const roleMessages = messages[role] || [
        `Welcome back, ${name}. We are glad to have you with us. Make this session productive.`
    ];

    const storageKey = "gsuWelcomeMessageIndex_" + role;

    let previousIndex = -1;

    try {
        const savedIndex = localStorage.getItem(storageKey);

        if (savedIndex !== null) {
            previousIndex = Number(savedIndex);
        }
    } catch (error) {
        previousIndex = -1;
    }

    const nextIndex =
        (Number.isInteger(previousIndex) &&
         previousIndex >= 0 &&
         previousIndex < roleMessages.length - 1)
            ? previousIndex + 1
            : 0;

    try {
        localStorage.setItem(storageKey, String(nextIndex));
    } catch (error) {
        // Continue even if browser storage is unavailable.
    }

    return roleMessages[nextIndex];
}

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

// Unified Main API for school Calendar & Events
const SESSION_EVENTS_API_URL =
    "https://script.google.com/macros/s/AKfycbwcYc2v0rRVF_AFDtluOVFCTja89vOH0HBtcI9rLGs0PCd7D3YpI5K4EVrb7XKaH_AL/exec";

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
    const endParts = activeTerm.endDate.split("-").map(Number);

    const startUTC = Date.UTC(
        startParts[0],
        startParts[1] - 1,
        startParts[2]
    );

    const endUTC = Date.UTC(
        endParts[0],
        endParts[1] - 1,
        endParts[2]
    );

    const daysFromStart = Math.floor(
        (todayUTC - startUTC) / 86400000
    );

    const totalTermDays = Math.floor(
        (endUTC - startUTC) / 86400000
    ) + 1;

    const startDay = new Date(startUTC).getUTCDay();

    const daysUntilFirstSaturday =
        (6 - startDay + 7) % 7;

    const firstWeekDays = daysUntilFirstSaturday + 1;

    const weekNumber = daysFromStart <= daysUntilFirstSaturday
        ? 1
        : 2 + Math.floor(
            (daysFromStart - daysUntilFirstSaturday - 1) / 7
        );

    const totalWeeks = totalTermDays <= firstWeekDays
        ? 1
        : 1 + Math.ceil(
            (totalTermDays - firstWeekDays) / 7
        );

    return `WEEK ${weekNumber} OF ${totalWeeks}`;
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

    if (
        !ongoingTitle ||
        !ongoingTime ||
        !upcomingTitle ||
        !upcomingTime
    ) return;

    const sessionToken = sessionStorage.getItem("sessionToken");

    if (!sessionToken) {
        ongoingTitle.textContent = "Events unavailable";
        ongoingTime.textContent = "Please log in again";
        upcomingTitle.textContent = "Events unavailable";
        upcomingTime.textContent = "Please log in again";
        return;
    }

    // Prevent simultaneous requests from overlapping dashboard refreshes.
    if (window.sessionEventsRequestPending) return;

    window.sessionEventsRequestPending = true;

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
                result.message || "Unable to load school calendar"
            );
        }

        const schoolCalendar = Array.isArray(result.schoolCalendar)
            ? result.schoolCalendar
            : [];

        const schoolEvents = Array.isArray(result.eventsActivities)
            ? result.eventsActivities
            : [];

        // Load academic term dates into the existing timeline.
        updateAcademicTermsFromCalendar(schoolCalendar);

        // Update the current academic term or holiday.
        const currentPeriodDisplay = document.getElementById(
            "sessionCurrentAcademicPeriod"
        );

        if (currentPeriodDisplay) {
            const currentPeriod = result.currentAcademicPeriod;

            currentPeriodDisplay.textContent = currentPeriod
                ? currentPeriod.title || currentPeriod.periodType
                : "DATES PENDING";
        }

        const now = new Date();

        // Parse date-only School Calendar values using Nairobi time.
        function parseDashboardCalendarDate(value, endOfDay = false) {
            if (
                typeof value === "string" &&
                /^\d{4}-\d{2}-\d{2}$/.test(value)
            ) {
                return new Date(
                    `${value}T${endOfDay ? "23:59:59" : "00:00:00"}+03:00`
                );
            }

            return getSessionEventDate(value);
        }

        // Convert School Calendar records into dashboard activities.
        const calendarActivities = schoolCalendar
            .filter(record => {
                const type = String(record.recordType || "")
                    .trim()
                    .toUpperCase();

                const status = String(record.status || "")
                    .trim()
                    .toUpperCase();

                return (
                    ["TERM", "EVENT"].includes(type) &&
                    status === "PUBLISHED"
                );
            })
            .map(record => ({
                title: record.title || record.recordType,
                status: record.status,
                startDateTime: record.startDate,
                endDateTime: record.endDate,
                source: "SCHOOL_CALENDAR"
            }));

        // Convert separately managed school events and activities.
        const activityRecords = schoolEvents
            .filter(event =>
                String(event.status || "").toUpperCase() === "PUBLISHED"
            )
            .map(event => ({
                title: event.title,
                status: event.status,
                startDateTime: event.startDateTime,
                endDateTime: event.endDateTime,
                source: "EVENT_ACTIVITY"
            }));

        // Both calendar sources feed the same dashboard timeline.
        const allActivities = [
            ...calendarActivities,
            ...activityRecords
        ].map(activity => ({
            ...activity,
            start: parseDashboardCalendarDate(
                activity.startDateTime
            ),
            end: parseDashboardCalendarDate(
                activity.endDateTime,
                true
            )
        })).filter(activity =>
            activity.title &&
            activity.start &&
            activity.end &&
            !Number.isNaN(activity.start.getTime()) &&
            !Number.isNaN(activity.end.getTime()) &&
            activity.end >= activity.start
        );

        // Currently active calendar records.
        const ongoingActivities = allActivities
            .filter(activity =>
                activity.start <= now &&
                now <= activity.end
            )
            .sort((a, b) => a.end - b.end);

        // Nearest future calendar record.
        const upcomingActivities = allActivities
            .filter(activity => activity.start > now)
            .sort((a, b) => a.start - b.start);

        const ongoingActivity = ongoingActivities[0] || null;
        const upcomingActivity = upcomingActivities[0] || null;

        // Format remaining time as days, hours, minutes and seconds.
        function formatCountdown(targetTime) {
            const remaining = Math.max(0, targetTime - Date.now());

            const days = Math.floor(remaining / 86400000);
            const hours = Math.floor((remaining % 86400000) / 3600000);
            const minutes = Math.floor((remaining % 3600000) / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);

            return (
                `${days}d ` +
                `${String(hours).padStart(2, "0")}h ` +
                `${String(minutes).padStart(2, "0")}m ` +
                `${String(seconds).padStart(2, "0")}s`
            );
        }

        // Stop any previous countdown before starting a new one.
        if (window.sessionEventCountdownTimer) {
            clearInterval(window.sessionEventCountdownTimer);
            window.sessionEventCountdownTimer = null;
        }

        // Set the activity titles and countdown targets.
        if (ongoingActivity) {
            ongoingTitle.textContent = ongoingActivity.title;
            window.sessionOngoingCountdownTarget =
                ongoingActivity.end.getTime();
        } else {
            ongoingTitle.textContent = "No ongoing activity";
            ongoingTime.textContent =
                "No published calendar activity is currently in progress";
            window.sessionOngoingCountdownTarget = null;
        }

        if (upcomingActivity) {
            upcomingTitle.textContent = upcomingActivity.title;
            window.sessionUpcomingCountdownTarget =
                upcomingActivity.start.getTime();
        } else {
            upcomingTitle.textContent = "No upcoming activity";
            upcomingTime.textContent =
                "No future published calendar activity scheduled";
            window.sessionUpcomingCountdownTarget = null;
        }

        // Refresh both countdown displays every second.
        function updateSessionEventCountdowns() {
            const ongoingTarget =
                window.sessionOngoingCountdownTarget;

            const upcomingTarget =
                window.sessionUpcomingCountdownTarget;

            if (ongoingTarget) {
                const remaining = ongoingTarget - Date.now();

                ongoingTime.textContent = remaining > 0
                    ? `Ends in ${formatCountdown(ongoingTarget)}`
                    : "Ending now";
            }

            if (upcomingTarget) {
                const remaining = upcomingTarget - Date.now();

                upcomingTime.textContent = remaining > 0
                    ? `Starts in ${formatCountdown(upcomingTarget)}`
                    : "Starting now";
            }
        }

        updateSessionEventCountdowns();

        if (ongoingActivity || upcomingActivity) {
            window.sessionEventCountdownTimer = setInterval(
                updateSessionEventCountdowns,
                1000
            );
        }

    } catch (error) {
        console.error("Session events error:", error);

        if (window.sessionEventCountdownTimer) {
            clearInterval(window.sessionEventCountdownTimer);
            window.sessionEventCountdownTimer = null;
        }

        window.sessionOngoingCountdownTarget = null;
        window.sessionUpcomingCountdownTarget = null;

        ongoingTitle.textContent = "Events temporarily unavailable";
        ongoingTime.textContent = "";

        upcomingTitle.textContent = "Events temporarily unavailable";
        upcomingTime.textContent = "";

    } finally {
        window.sessionEventsRequestPending = false;
    }
}

function renderSessionProgressCard(role) {
    const host = document.getElementById("dashboardCards");

    if (!host) return;

    const config = ACADEMIC_SESSION_CONFIG;
    const progress = calculateSessionProgress();

    // Term-calendar data remains available for academic calculations.
    // Individual term modules are no longer displayed on this card.

    host.innerHTML = `
        <section class="session-progress-card">

            <header class="session-card-header">

               <div class="session-card-brand">

    <div>
        <h2>ACADEMIC COMMAND CENTRE</h2>
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

                    </div>

                    <a href="events.html"
                       class="session-ongoing-button">
                        NAVIGATE
                    </a>

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

        </section>
    `;

    updateSessionClock();

    if (window.sessionProgressClock) {
        clearInterval(window.sessionProgressClock);
        window.sessionProgressClock = null;
    }

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
// ACADEMIC SESSION DATE AND WEEK DISPLAY
// =====================================================

function updateSessionClock() {
    const dateElement = document.getElementById("sessionLiveDate");

    if (!dateElement) return;

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
    `${weekLabel}\u00A0\u00A0\u00A0\u00A0${dayLabel} ${dateLabel}`;
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
        "Toggle navigation menu"
    );

    // Keep the Menu button unchanged on the navigation rail.
    menuToggle.textContent = "☰ Menu";

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
            GSUNotify.info(
                "The My Profile page has not yet been connected."
            );
        });
    }

    if (chatBtn) {
        chatBtn.addEventListener("click", function () {
            GSUNotify.info(
                "Chat support has not yet been connected."
            );
        });
    }

    if (helpBtn) {
        helpBtn.addEventListener("click", function () {
            GSUNotify.info(
                "Help content has not yet been connected."
            );
        });
    }

    if (document.body.classList.contains("dashboard-page")) {
        initializeDashboard();
    }
});

/************************************************
 * GSU AEGIS — LIVE SESSION PRESENCE
 ************************************************/

let presenceHeartbeatTimer = null;

async function sendPresenceHeartbeat() {
    try {
        const result = await userManagementRequest("presence");
        return result.success === true;

    } catch (error) {
        console.warn("Presence heartbeat failed:", error);
        return false;
    }
}

function startSessionPresenceHeartbeat() {
    if (presenceHeartbeatTimer) {
        clearInterval(presenceHeartbeatTimer);
    }

    sendPresenceHeartbeat();

    presenceHeartbeatTimer = setInterval(function () {
        sendPresenceHeartbeat();
    }, 60000);
}


// Check session and load the correct role
function initializeDashboard() {
    const user = sessionStorage.getItem("loggedUser");
    const role = sessionStorage.getItem("userRole");

    if (!user || !role || !DASHBOARD_ROLES[role]) {
        sessionStorage.clear();

        sessionStorage.setItem(
            "gsuPendingNotification",
            JSON.stringify({
                type: "error",
                message: "Your session is invalid or has expired. Please log in again."
            })
        );

        window.location.replace("index.html");
        return;
    }

    const currentUser = document.getElementById("currentUser");

    if (currentUser) {
        const firstName = user.trim().split(/\s+/)[0];

        currentUser.textContent = "Hi, " + firstName;
    }

    startSessionPresenceHeartbeat();

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

    const loggedUser = sessionStorage.getItem("loggedUser") || "";
    const firstName = loggedUser.trim().split(/\s+/)[0];

    if (welcomeHeading) {
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
            getRoleWelcomeMessage(role, firstName);
    }

    buildSidebar(config.menu);
    renderSessionProgressCard(role);
}


function buildSidebar(menuItems) {
    const sidebar = document.getElementById("sidebarMenu");
    const quickIcons = document.getElementById("sidebarQuickIcons");
    const content = document.querySelector(".dashboard-content");

    if (!sidebar || !content) return;

    sidebar.replaceChildren();

    if (quickIcons) quickIcons.replaceChildren();

    // Professional SVG icon library
    function createSidebarIcon(name) {
        const paths = {
            "layout-dashboard":
                '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="5" rx="1"/><rect x="13" y="10" width="8" height="11" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/>',

            "users":
                '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',

            "building-2":
                '<path d="M6 22V3h12v19M3 22h18M9 7h2m2 0h2M9 11h2m2 0h2M9 15h2m2 0h2M10 22v-3h4v3"/>',

            "graduation-cap":
                '<path d="m2 10 10-5 10 5-10 5-10-5Z"/><path d="M6 12v5c3 3 9 3 12 0v-5M22 10v6"/>',

            "book-open":
                '<path d="M12 7v14M3 18V5a2 2 0 0 1 2-2h3a4 4 0 0 1 4 4 4 4 0 0 1 4-4h3a2 2 0 0 1 2 2v13h-5a4 4 0 0 0-4 3 4 4 0 0 0-4-3H3Z"/>',

            "chart-no-axes-combined":
                '<path d="M3 3v18h18M7 14l4-4 4 3 6-7"/>',

            "folder-kanban":
                '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M8 11v6m4-6v3m4-3v5"/>',

            "vote":
                '<path d="M4 21h16M6 17h12M8 3h8l2 10H6L8 3Z"/><path d="m9 8 2 2 4-4"/>',

            "users-round":
                '<path d="M18 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="11" cy="7" r="4"/><path d="M20 8v6m3-3h-6"/>',

            "trophy":
                '<path d="M8 21h8m-4-4v4M7 4h10v5a5 5 0 0 1-10 0V4ZM7 6H4v2a4 4 0 0 0 4 4m9-6h3v2a4 4 0 0 1-4 4"/>',

            "wallet":
                '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 8h18m-5 5h5"/><circle cx="16" cy="13" r=".5"/>',

            "messages-square":
                '<path d="M21 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3Z"/><path d="M8 8h8M8 12h6"/>',

            "shield-check":
                '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 11 2 2 4-4"/>',

            "compass":
                '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.6 6.4-5.8 2 2.4-6.2 6-2.2Z"/>',

            "settings":
                '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z"/>',

            "database-backup":
                '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3m8-9v5M4 11v6c0 1.7 3.6 3 8 3m4-1 2-2 2 2m-2-2v5"/>',

            "life-buoy":
                '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="m5.6 5.6 4.3 4.3m4.2 4.2 4.3 4.3m0-12.8-4.3 4.3m-4.2 4.2-4.3 4.3"/>',

            "clipboard-list":
                '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 10h6m-6 4h6m-6 4h3"/>'
        };

        const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );

        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "20");
        svg.setAttribute("height", "20");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "1.8");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        svg.setAttribute("aria-hidden", "true");

        svg.innerHTML =
            paths[name] || paths["layout-dashboard"];

        return svg;
    }

    const dashboardSections = [
        content.querySelector(".dashboard-welcome"),
        document.getElementById("dashboardCards"),
        document.getElementById("dashboardWorkspace"),
        document.getElementById("dashboardActivity")
    ].filter(Boolean);

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

        if (!config) return;

        const moduleView =
            document.getElementById("dashboardModuleView");

        if (moduleView) moduleView.remove();

        dashboardSections.forEach(section => {
            section.hidden = false;
            section.style.removeProperty("display");
        });

        const breadcrumb =
            document.getElementById("dashboardBreadcrumb");

        if (breadcrumb) {
            breadcrumb.textContent = "Home";
        }

        const heading =
            document.getElementById("dashboardHeading");

        if (heading) {
            heading.textContent = config.title;
            heading.hidden = true;
        }
    }

    function showModulePage(item) {
        const oldView =
            document.getElementById("dashboardModuleView");

        if (oldView) oldView.remove();

        dashboardSections.forEach(section => {
            section.hidden = true;
            section.style.setProperty(
                "display",
                "none",
                "important"
            );
        });

        /* Display the current location in the breadcrumb */

        const breadcrumb =
            document.getElementById("dashboardBreadcrumb");

        if (breadcrumb) {
            breadcrumb.textContent = "Home / " + item[1];
        }

        /* Keep the redundant dashboard heading hidden */

        const heading =
            document.getElementById("dashboardHeading");

        if (heading) {
            heading.textContent = "";
            heading.hidden = true;
        }

        const moduleView = document.createElement("section");
        moduleView.id = "dashboardModuleView";
        moduleView.className = "dashboard-module-view";

        content.appendChild(moduleView);

        if (
            item[2] === "identity_access_management" &&
            sessionStorage.getItem("userRole") === "ICT_ADMIN"
        ) {
            renderUserManagementWorkspace(moduleView);
            return;
        }

        /* Keep workspace content without another generic title */

        const moduleMessage = document.createElement("p");
        moduleMessage.textContent =
            "The " + item[1] + " workspace is being prepared.";

        moduleView.appendChild(moduleMessage);
    }
    // Close Menu
    const closeItem = document.createElement("li");
    const closeLink = document.createElement("a");

    closeLink.href = "#close-menu";
    closeLink.className = "sidebar-close-link";

    const closeIcon = document.createElement("span");
    closeIcon.className = "sidebar-item-icon";
    closeIcon.textContent = "×";

    const closeLabel = document.createElement("span");
    closeLabel.className = "sidebar-item-label";
    closeLabel.textContent = "Close Menu";

    closeLink.append(closeIcon, closeLabel);

    closeLink.addEventListener("click", function(event) {
        event.preventDefault();
        closeSidebar();
    });

    closeItem.appendChild(closeLink);
    sidebar.appendChild(closeItem);

    // Role-specific navigation
    menuItems.forEach(function(item) {
        const li = document.createElement("li");
        const link = document.createElement("a");

        link.href =
            item[2] === "dashboard_overview"
                ? "#dashboard-overview"
                : "#module-" + item[2];

        const icon = document.createElement("span");
        icon.className = "sidebar-item-icon";
        icon.appendChild(createSidebarIcon(item[0]));

        const label = document.createElement("span");
        label.className = "sidebar-item-label";
        label.textContent = item[1];

        link.append(icon, label);

        link.addEventListener("click", function(event) {
            event.preventDefault();

            sidebar.querySelectorAll("a").forEach(menuLink => {
                menuLink.classList.remove("active");
            });

            link.classList.add("active");

            if (item[2] === "dashboard_overview") {
                showDashboardOverview();
            } else {
                showModulePage(item);
            }

            closeSidebar();
        });

        li.appendChild(link);
        sidebar.appendChild(li);

        if (quickIcons) {
            const iconButton = document.createElement("button");

            iconButton.type = "button";
            iconButton.appendChild(createSidebarIcon(item[0]));
            iconButton.title = item[1];
            iconButton.setAttribute("aria-label", item[1]);
            iconButton.disabled = true;
            iconButton.setAttribute("aria-disabled", "true");

            iconButton.addEventListener("click", function() {
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
const USER_MANAGEMENT_API_URL =
    "https://script.google.com/macros/s/AKfycbwcYc2v0rRVF_AFDtluOVFCTja89vOH0HBtcI9rLGs0PCd7D3YpI5K4EVrb7XKaH_AL/exec";


async function userManagementRequest(action, data = {}) {
    const response = await fetch(USER_MANAGEMENT_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=UTF-8"
        },
        body: JSON.stringify({
            action: action,
            sessionToken: sessionStorage.getItem("sessionToken"),
            ...data
        })
    });

    if (!response.ok) {
        throw new Error("User Management service is unavailable.");
    }

    return response.json();
}


function renderUserManagementModule(container) {
    container.innerHTML = `
        <div class="user-management-module">
            <div class="um-header">
                <div>
                    <h2>User Management</h2>
                    <p>Manage system accounts and access.</p>
                </div>
                <button type="button" id="umRefresh">↻ Refresh</button>
            </div>

            <div class="um-summary">
                <div><strong id="umTotal">0</strong><span>Total Users</span></div>
                <div><strong id="umActive">0</strong><span>Active</span></div>
                <div><strong id="umLocked">0</strong><span>Locked</span></div>
                <div><strong id="umDisabled">0</strong><span>Disabled</span></div>
            </div>

            <div class="um-create-panel">
                <h3>Create New Account</h3>

                <form id="umCreateForm">
                    <label>Full Name</label>
                    <input name="fullName" required maxlength="100">

                    <label>Username</label>
                    <input name="username" required maxlength="60">

                    <label>Role</label>
                    <select name="role" required>
                        <option value="">Select role</option>
                        <option value="ICT_ADMIN">ICT Administrator</option>
                        <option value="SCHOOL_ADMIN">School Administrator</option>
                        <option value="TEACHER">Teacher</option>
                        <option value="LEARNER">Learner</option>
                        <option value="PARENT">Parent</option>
                    </select>

                    <label>Class (where applicable)</label>
                    <input name="className" maxlength="60">

                    <button type="submit" id="umCreateButton">
                        Create Account
                    </button>
                </form>
            </div>

            <div class="um-users-panel">
                <div class="um-list-heading">
                    <h3>Registered Users</h3>
                    <input id="umSearch" type="search"
                           placeholder="Search users...">
                </div>

                <p id="umMessage" role="status"></p>

                <div class="um-table-wrap">
                    <table class="um-table">
                        <thead>
                            <tr>
                                <th>Name / Username</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="umUsersBody">
                            <tr><td colspan="4">Loading users...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    const message = container.querySelector("#umMessage");
    const usersBody = container.querySelector("#umUsersBody");
    const searchInput = container.querySelector("#umSearch");

    let users = [];

    function showMessage(text, isError = false) {
        if (isError) {
            GSUNotify.error(
                text || "The operation could not be completed."
            );
        } else {
            GSUNotify.success(
                text || "Operation completed successfully."
            );
        }
    }

    function updateSummary() {
        container.querySelector("#umTotal").textContent = users.length;
        container.querySelector("#umActive").textContent =
            users.filter(user => user.status.toLowerCase() === "active").length;
        container.querySelector("#umLocked").textContent =
            users.filter(user => user.status.toLowerCase() === "locked").length;
        container.querySelector("#umDisabled").textContent =
            users.filter(user => user.status.toLowerCase() === "disabled").length;
    }

    function renderUsers() {
        const query = searchInput.value.trim().toLowerCase();

        const filtered = users.filter(user =>
            user.fullName.toLowerCase().includes(query) ||
            user.username.toLowerCase().includes(query) ||
            user.role.toLowerCase().includes(query)
        );

        usersBody.replaceChildren();

        if (!filtered.length) {
            const row = usersBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 4;
            cell.textContent = "No matching users found.";
            return;
        }

        filtered.forEach(user => {
            const row = usersBody.insertRow();

            const identity = row.insertCell();
            const name = document.createElement("strong");
            name.textContent = user.fullName || "Unnamed user";

            const username = document.createElement("small");
            username.textContent = user.username;

            identity.append(name, document.createElement("br"), username);

            row.insertCell().textContent = user.role;

            const statusCell = row.insertCell();
            statusCell.textContent = user.status;

            const actions = row.insertCell();

            const resetButton = document.createElement("button");
            resetButton.type = "button";
            resetButton.textContent = "Reset Password";
            resetButton.addEventListener("click", async () => {
                if (!confirm("Reset password for " + user.username + "?")) return;

                try {
                    const result = await userManagementRequest(
                        "resetManagedUserPassword",
                        { username: user.username }
                    );

                    if (!result.success) throw new Error(result.message);

                    const temporaryPassword =
                        result.temporaryPassword || result.tempPassword || "";

                    GSUNotify.success(
                        "Password reset successfully for " + user.username +
                        (temporaryPassword
                            ? "\nTemporary password: " + temporaryPassword
                            : "")
                    );

                } catch (error) {
                    showMessage(error.message, true);
                }
            });

            const statusButton = document.createElement("button");
            statusButton.type = "button";

            const normalizedStatus = user.status.toLowerCase();

            statusButton.textContent =
                normalizedStatus === "active" ? "Lock" :
                normalizedStatus === "locked" ? "Activate" :
                "Activate";

            statusButton.addEventListener("click", async () => {
                const nextStatus =
                    normalizedStatus === "active" ? "Locked" : "Active";

                if (!confirm(
                    nextStatus + " account " + user.username + "?"
                )) return;

                try {
                    const result = await userManagementRequest(
                        "updateManagedUserStatus",
                        {
                            username: user.username,
                            status: nextStatus
                        }
                    );

                    if (!result.success) throw new Error(result.message);

                    showMessage("Account status updated.");
                    await loadUsers();
                } catch (error) {
                    showMessage(error.message, true);
                }
            });

            const disableButton = document.createElement("button");
            disableButton.type = "button";
            disableButton.textContent = "Disable";

            disableButton.addEventListener("click", async () => {
                if (!confirm("Disable " + user.username + "?")) return;

                try {
                    const result = await userManagementRequest(
                        "updateManagedUserStatus",
                        {
                            username: user.username,
                            status: "Disabled"
                        }
                    );

                    if (!result.success) throw new Error(result.message);

                    showMessage("Account disabled.");
                    await loadUsers();
                } catch (error) {
                    showMessage(error.message, true);
                }
            });

            actions.append(resetButton, statusButton, disableButton);
        });
    }

    async function loadUsers() {
        usersBody.innerHTML =
            '<tr><td colspan="4">Loading users...</td></tr>';

        try {
            const result = await userManagementRequest("getManagedUsers");

            if (!result.success) throw new Error(result.message);

            users = (result.users || []).map(user => ({
                ...user,
                fullName: String(user.fullName || ""),
                username: String(user.username || ""),
                role: String(user.role || ""),
                status: String(user.status || "")
            }));

            updateSummary();
            renderUsers();

        } catch (error) {
            usersBody.innerHTML =
                '<tr><td colspan="4">Unable to load users.</td></tr>';
            showMessage(error.message, true);
        }
    }

    container.querySelector("#umCreateForm").addEventListener(
        "submit",
        async event => {
            event.preventDefault();

            const form = event.currentTarget;
            const formData = new FormData(form);

            const userData = {
                fullName: String(formData.get("fullName") || "").trim(),
                username: String(formData.get("username") || "").trim(),
                role: String(formData.get("role") || ""),
                className: String(formData.get("className") || "").trim()
            };

            const button = container.querySelector("#umCreateButton");
            button.disabled = true;
            button.textContent = "Creating...";

            try {
                const result = await userManagementRequest(
                    "createManagedUser",
                    { userData: userData }
                );

                if (!result.success) throw new Error(result.message);

                const temporaryPassword =
                    result.temporaryPassword || result.tempPassword || "";

                GSUNotify.success(
                    "Account created successfully.\n" +
                    "Username: " + userData.username +
                    (temporaryPassword
                        ? "\nTemporary password: " + temporaryPassword
                        : "")
                );

                form.reset();
                await loadUsers();

            } catch (error) {
                showMessage(error.message, true);

            } finally {
                button.disabled = false;
                button.textContent = "Create Account";
            }
        }
    );

    searchInput.addEventListener("input", renderUsers);

    container.querySelector("#umRefresh").addEventListener(
        "click",
        loadUsers
    );

    loadUsers();
}
/************************************************
 * GSU AEGIS
 * ICT USER MANAGEMENT WORKSPACE
 ************************************************/

function renderUserManagementWorkspace(root) {

    const API_URL =
        "https://script.google.com/macros/s/AKfycbwcYc2v0rRVF_AFDtluOVFCTja89vOH0HBtcI9rLGs0PCd7D3YpI5K4EVrb7XKaH_AL/exec";

    const sessionToken = sessionStorage.getItem("sessionToken");

    let managedUsers = [];

    const escapeHTML = value =>
        String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);

    root.innerHTML = `
        <div class="aegis-user-management">

            <section class="aegis-hero">

    <div class="aegis-brand-row">
        <div class="aegis-brand">
            <span class="aegis-brand-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.8"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2.8 20 6v5.5c0 5-3.4 8.3-8 9.7-4.6-1.4-8-4.7-8-9.7V6l8-3.2Z"/>
                    <path d="m8.5 12 2.2 2.2 4.8-4.8"/>
                </svg>
            </span>
            <div>
                <strong>GSU AEGIS</strong>
                <small>IDENTITY CONTROL</small>
            </div>
        </div>

        <span class="aegis-session-badge">
            ● ADMIN SESSION
        </span>
    </div>

    <div class="aegis-hero-heading">
        <div>
            <span>ICT ADMINISTRATION / IDENTITY CONTROL</span>
            <p>
                Account provisioning, identity records
                and access lifecycle management.
            </p>
        </div>

        <div class="aegis-fingerprint" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3a9 9 0 0 0-9 9"/>
                <path d="M12 6a6 6 0 0 0-6 6"/>
                <path d="M12 9a3 3 0 0 0-3 3"/>
                <path d="M12 3a9 9 0 0 1 9 9"/>
                <path d="M12 6a6 6 0 0 1 6 6"/>
                <path d="M12 9a3 3 0 0 1 3 3"/>
                <path d="M12 12v9"/>
            </svg>
        </div>
    </div>

    <div class="aegis-stat-grid">

        <div class="aegis-stat">
            <span aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.8"
                    stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="8" r="3.5"/>
                    <path d="M2.5 20c.5-3.5 2.7-5.3 6.5-5.3"/>
                    <path d="M16 11a3 3 0 1 0 0-6"/>
                    <path d="M16 15c3.2 0 5 1.7 5.5 5"/>
                </svg>
            </span>
            <strong id="aegisTotal">—</strong>
            <small>TOTAL USERS</small>
        </div>

        <div class="aegis-stat">
            <span aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.8"
                    stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="9"/>
                    <path d="m8 12 2.5 2.5L16 9"/>
                </svg>
            </span>
            <strong id="aegisActive">—</strong>
            <small>ACTIVE USERS</small>
        </div>

        <div class="aegis-stat">
            <span aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.8"
                    stroke-linecap="round" stroke-linejoin="round">
                    <rect x="4" y="10" width="16" height="11" rx="2"/>
                    <path d="M8 10V7a4 4 0 0 1 8 0v3"/>
                </svg>
            </span>
            <strong id="aegisLocked">—</strong>
            <small>LOCKED USERS</small>
        </div>

        <div class="aegis-stat">
            <span aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.8"
                    stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="9"/>
                    <path d="m9 9 6 6m0-6-6 6"/>
                </svg>
            </span>
            <strong id="aegisDisabled">—</strong>
            <small>DISABLED USERS</small>
        </div>

    </div>
</section>
            <div class="aegis-workspace">

                <div class="aegis-section-heading">
                    <div>
                        <span>01 / CONTROL</span>
                        <h3>Account Operations</h3>
                    </div>
                    <span class="aegis-section-number">01</span>
                </div>

                <section class="aegis-panel">

                    <div class="aegis-create-heading">
                        <div>
                            <h3>Create New Account</h3>
                            <p>Register a new school system identity.</p>
                        </div>

                        <div class="aegis-operation-icon" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.8"
        stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="8" r="3.5"/>
        <path d="M2.5 20c.5-3.5 2.7-5.3 6.5-5.3"/>
        <path d="M18 8v8m-4-4h8"/>
    </svg>
</div>
                    </div>

                    <button
                        type="button"
                        class="aegis-create-button"
                        id="aegisShowCreate">
                        <span>
                            <strong>ACCOUNT PROVISIONING</strong>
                            <small>
                                Create username, assign a role and
                                generate temporary credentials.
                            </small>
                        </span>
                        <b>↗</b>
                    </button>

                    <div class="aegis-create-form" id="aegisCreatePanel" hidden>

                        <div class="aegis-form-heading">
                            <h3>New Identity Registration</h3>
                            <button type="button" id="aegisCloseCreate"
                                aria-label="Close form">✕</button>
                        </div>

                        <form id="aegisCreateForm">

                            <label>
                                Full Name
                                <input name="fullName" type="text"
                                    maxlength="100" required
                                    placeholder="Enter full name">
                            </label>

                            <label>
                                Username
                                <input name="username" type="text"
                                    minlength="4" maxlength="60" required
                                    placeholder="Enter unique username">
                            </label>

                            <label>
                                Account Role
                                <select name="role" required>
                                    <option value="">Select role</option>
                                    <option value="SCHOOL_ADMIN">School Admin</option>
                                    <option value="TEACHER">Teacher</option>
                                    <option value="LEARNER">Learner</option>
                                    <option value="PARENT">Parent</option>
                                </select>
                            </label>

                            <label>
                                Class / Assignment
                                <input name="className" type="text"
                                    maxlength="60"
                                    placeholder="Enter class or N/A">
                            </label>

                            <div class="aegis-form-actions">
                                <button type="button"
                                    class="aegis-secondary-button"
                                    id="aegisCancelCreate">
                                    Cancel
                                </button>

                                <button type="submit"
                                    class="aegis-primary-button"
                                    id="aegisSubmitCreate">
                                    Create Account
                                </button>
                            </div>

                        </form>
                    </div>

                    <div class="aegis-operation-grid">

                        <button type="button" class="aegis-operation-card"
                            data-operation="password">
                            <span>⌘</span>
                            <strong>Reset Password</strong>
                            <small>Issue temporary credentials.</small>
                        </button>

                        <button type="button" class="aegis-operation-card"
                            data-operation="status">
                            <span>⚙</span>
                            <strong>Account Controls</strong>
                            <small>Activate, lock or disable accounts.</small>
                        </button>

                    </div>

                </section>

                <div class="aegis-section-heading">
                    <div>
                        <span>02 / REGISTRY</span>
                        <h3>Identity Directory</h3>
                    </div>
                    <span class="aegis-section-number">02</span>
                </div>

                <section class="aegis-panel">

                    <div class="aegis-search-row">
                        <span>⌕</span>
                        <input id="aegisSearch" type="search"
                            placeholder="Search by name or username...">
                        <button type="button" id="aegisRefresh"
                            title="Refresh directory">↻</button>
                    </div>

                    <div class="aegis-filter-heading">
                        FILTER BY ROLE
                    </div>

                    <div class="aegis-filter-list" id="aegisRoleFilters">
                        <button class="active" data-role="ALL">All</button>
                        <button data-role="ICT_ADMIN">ICT Admin</button>
                        <button data-role="SCHOOL_ADMIN">School Admin</button>
                        <button data-role="TEACHER">Teacher</button>
                        <button data-role="LEARNER">Learner</button>
                        <button data-role="PARENT">Parent</button>
                    </div>

                    <div class="aegis-filter-heading">
                        FILTER BY STATUS
                    </div>

                    <select id="aegisStatusFilter"
                        class="aegis-status-filter">
                        <option value="ALL">All account statuses</option>
                        <option value="Active">Active</option>
                        <option value="Locked">Locked</option>
                        <option value="Disabled">Disabled</option>
                    </select>

                    <div class="aegis-directory-heading">
                        <div>
                            <h3>Account Records</h3>
                            <small>Existing USERS database</small>
                        </div>
                        <span id="aegisRecordCount">0 RECORDS</span>
                    </div>

                    <div id="aegisDirectory" class="aegis-directory">
                        <div class="aegis-loading">
                            Loading account records...
                        </div>
                    </div>

                </section>

                <div class="aegis-section-heading">
                    <div>
                        <span>03 / SAFEGUARDS</span>
                        <h3>Account Integrity Centre</h3>
                    </div>
                    <span class="aegis-section-number">03</span>
                </div>

                <section class="aegis-integrity-centre">

                    <div class="aegis-integrity-hero">
                        <div class="aegis-integrity-hero-icon">◇</div>

                        <div>
                            <strong>IDENTITY ASSURANCE & ACCESS INTELLIGENCE</strong>
                            <p>
                                Verified account, role and access intelligence
                                from the existing security audit service.
                            </p>
                        </div>

                        <span class="aegis-monitor-state">
                            SYSTEM INTELLIGENCE
                        </span>
                    </div>

                    <div class="aegis-integrity-notice">
                        <span>●</span>

                        <div>
                            <strong id="aegisIntegrityStatus">
                                Retrieving integrity records
                            </strong>
                            <p id="aegisIntegrityUpdated">
                                Connecting to the account integrity service.
                            </p>
                        </div>

                        <button type="button"
                            id="aegisIntegrityRefresh">
                            Refresh
                        </button>
                    </div>

                    <div class="aegis-integrity-grid">

                        <button type="button"
                            class="aegis-integrity-card"
                            data-integrity="roles">

                            <span class="aegis-integrity-card-icon">♙</span>

                            <span class="aegis-integrity-card-content">
                                <strong>ROLE COMPLIANCE</strong>
                                <small>
                                    Role assignments, account anomalies
                                    and recorded role changes.
                                </small>
                                <b>INTELLIGENCE ↗</b>
                            </span>

                            <span class="aegis-integrity-card-number"
                                id="aegisRoleCount">—</span>
                        </button>

                        <button type="button"
                            class="aegis-integrity-card"
                            data-integrity="access">

                            <span class="aegis-integrity-card-icon">⌁</span>

                            <span class="aegis-integrity-card-content">
                                <strong>SYSTEM ACCESS</strong>
                                <small>
                                    Authentication, access attempts
                                    and recorded session activity.
                                </small>
                                <b>INVESTIGATE ↗</b>
                            </span>

                            <span class="aegis-integrity-card-number"
                                id="aegisAccessCount">—</span>
                        </button>

                        <button type="button"
                            class="aegis-integrity-card"
                            data-integrity="alerts">

                            <span class="aegis-integrity-card-icon">⚠</span>

                            <span class="aegis-integrity-card-content">
                                <strong>SECURITY ALERTS</strong>
                                <small>
                                    Security warnings and recorded
                                    account-related events.
                                </small>
                                <b>INVESTIGATE ↗</b>
                            </span>

                            <span class="aegis-integrity-card-number"
                                id="aegisAlertCount">—</span>
                        </button>

                        <button type="button"
                            class="aegis-integrity-card"
                            data-integrity="incidents">

                            <span class="aegis-integrity-card-icon">▤</span>

                            <span class="aegis-integrity-card-content">
                                <strong>EVENT INVESTIGATION</strong>
                                <small>
                                    Traceable audit evidence and
                                    recent account activity.
                                </small>
                                <b>INVESTIGATE ↗</b>
                            </span>

                            <span class="aegis-integrity-card-number"
                                id="aegisEventCount">—</span>
                        </button>

                    </div>

                    <div class="aegis-integrity-detail"
                        id="aegisIntegrityDetail" hidden>

                        <div class="aegis-integrity-detail-heading">
                            <div>
                                <span>INVESTIGATION WORKSPACE</span>
                                <h3 id="aegisIntegrityDetailTitle">
                                    Integrity Investigation
                                </h3>
                            </div>

                            <button type="button"
                                id="aegisIntegrityClose"
                                aria-label="Close investigation">
                                ✕
                            </button>
                        </div>

                        <p id="aegisIntegrityDetailDescription"></p>

                        <div class="aegis-integrity-data-state"
                            id="aegisIntegrityDataState">

                            <span>●</span>

                            <div>
                                <strong id="aegisIntegrityDataHeading">
                                    WAITING FOR BACKEND DATA
                                </strong>

                                <small id="aegisIntegrityDataMessage">
                                    Select a category to inspect its records.
                                </small>
                            </div>
                        </div>

                        <div class="aegis-integrity-detail-list"
                            id="aegisIntegrityDetailList">
                        </div>

                        <div class="aegis-integrity-detail-footer">
                            <span>GSU AEGIS / ACCOUNT INTEGRITY</span>
                            <span>ICT ADMINISTRATION</span>
                        </div>

                    </div>

                    </section>

                <div id="aegisNotice" class="aegis-notice"
                    role="status" aria-live="polite"></div>

            </div>
        </div>
    `;

    const directory = root.querySelector("#aegisDirectory");
    const notice = root.querySelector("#aegisNotice");
    const createPanel = root.querySelector("#aegisCreatePanel");

    let selectedRole = "ALL";
    let selectedUser = null;

    function showNotice(message, type = "info") {
        const notificationType = [
            "success",
            "error",
            "warning",
            "info"
        ].includes(type) ? type : "info";

        GSUNotify.show(
            message || "The operation has been completed.",
            notificationType
        );
    }

    async function apiRequest(action, extra = {}) {

        if (!sessionToken) {
            throw new Error(
                "Your administrator session is missing. Please sign in again."
            );
        }

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=UTF-8"
            },
            body: JSON.stringify({
                action,
                sessionToken,
                ...extra
            })
        });

        if (!response.ok) {
            throw new Error(
                "The server could not complete the request. Please try again."
            );
        }

        const result = await response.json();

        if (!result || typeof result.success !== "boolean") {
            throw new Error(
                "The server returned an unexpected response. Check the deployed API version."
            );
        }

        if (!result.success) {
            throw new Error(
                result.message || "The requested operation could not be completed."
            );
        }

        return result;
    }

    function updateCounters() {

        const count = status =>
            managedUsers.filter(user => user.status === status).length;

        root.querySelector("#aegisTotal").textContent =
            managedUsers.length;

        root.querySelector("#aegisActive").textContent =
            count("Active");

        root.querySelector("#aegisLocked").textContent =
            count("Locked");

        root.querySelector("#aegisDisabled").textContent =
            count("Disabled");
    }

    function renderDirectory() {

    const search = root.querySelector("#aegisSearch")
        .value.trim().toLowerCase();

    const status = root.querySelector("#aegisStatusFilter").value;

    const filtered = managedUsers.filter(user => {

        const matchesSearch =
            String(user.username || "").toLowerCase().includes(search) ||
            String(user.fullName || "").toLowerCase().includes(search);

        const matchesRole =
            selectedRole === "ALL" || user.role === selectedRole;

        const matchesStatus =
            status === "ALL" || user.status === status;

        return matchesSearch && matchesRole && matchesStatus;
    });

    root.querySelector("#aegisRecordCount").textContent =
        filtered.length + " RECORDS";

    if (!filtered.length) {
        directory.innerHTML = `
            <div class="aegis-empty">
                <span>◎</span>
                <strong>No matching accounts</strong>
                <small>Try changing your search or filters.</small>
            </div>
        `;
        return;
    }

    directory.innerHTML = `
        <div class="aegis-table-wrap">
            <table class="aegis-table">
                <thead>
                    <tr>
                        <th>IDENTITY</th>
                        <th>ROLE</th>
                        <th>STATUS</th>
                        <th>LAST LOGIN</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    ${filtered.map(user => `
                        <tr>
                            <td class="aegis-identity-cell">
                                <div class="aegis-user-identity">

                                    <span class="aegis-user-avatar"
                                        aria-hidden="true">
                                        <svg viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="1.8"
                                            stroke-linecap="round"
                                            stroke-linejoin="round">

                                            <circle cx="12" cy="8"
                                                r="3.5"/>

                                            <path d="M5 20c.7-3.5
                                                3-5.2 7-5.2s6.3
                                                1.7 7 5.2"/>

                                        </svg>

                                        ${user.isOnline ? `
                                            <span class="aegis-online-dot"></span>
                                        ` : ""}
                                    </span>

                                    <span class="aegis-user-details">
                                        <strong>${escapeHTML(user.fullName)}</strong>
                                        <small>${escapeHTML(user.username)}</small>
                                    </span>

                                </div>
                            </td>

                            <td>${escapeHTML(user.role)}</td>

                            <td>
                                <span class="aegis-status ${String(user.status).toLowerCase()}">
                                    ${escapeHTML(user.status)}
                                </span>
                            </td>

                            <td>${escapeHTML(user.lastLogin || "Never")}</td>

                            <td>
                                <div class="aegis-row-actions">
                                    <button type="button"
                                        data-action="reset"
                                        data-username="${escapeHTML(user.username)}">
                                        Reset
                                    </button>

                                    <button type="button"
                                        data-action="activate"
                                        data-username="${escapeHTML(user.username)}">
                                        Activate
                                    </button>

                                    <button type="button"
                                        data-action="lock"
                                        data-username="${escapeHTML(user.username)}">
                                        Lock
                                    </button>

                                    <button type="button"
                                        data-action="disable"
                                        data-username="${escapeHTML(user.username)}">
                                        Disable
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
    }

    async function loadUsers() {
        directory.innerHTML = `
            <div class="aegis-loading">
                Loading account records...
            </div>
        `;

        try {
            const result = await apiRequest("getManagedUsers");

            managedUsers = Array.isArray(result.users)
                ? result.users
                : [];

            updateCounters();
            renderDirectory();

        } catch (error) {
            directory.innerHTML = `
                <div class="aegis-error">
                    <strong>Unable to load account records</strong>
                    <p>${escapeHTML(error.message)}</p>
                    <button type="button" id="aegisRetry">
                        Try Again
                    </button>
                </div>
            `;

            showNotice(error.message, "error");
        }
    }

    function closeCreateForm() {
        createPanel.hidden = true;
        root.querySelector("#aegisCreateForm").reset();
    }

    root.querySelector("#aegisShowCreate")
        .addEventListener("click", () => {
            createPanel.hidden = false;
            createPanel.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        });

    root.querySelector("#aegisCloseCreate")
        .addEventListener("click", closeCreateForm);

    root.querySelector("#aegisCancelCreate")
        .addEventListener("click", closeCreateForm);

    root.querySelector("#aegisCreateForm")
        .addEventListener("submit", async event => {

            event.preventDefault();

            const form = event.currentTarget;
            const submitButton =
                root.querySelector("#aegisSubmitCreate");

            const formData = new FormData(form);

            const userData = {
                fullName: formData.get("fullName").trim(),
                username: formData.get("username").trim(),
                role: formData.get("role"),
                className: formData.get("className").trim() || "N/A"
            };

            submitButton.disabled = true;
            submitButton.textContent = "Creating account...";

            try {
                const result = await apiRequest(
                    "createManagedUser",
                    { userData }
                );

                closeCreateForm();

                showNotice(
                    "Account created successfully. Temporary password: " +
                    result.temporaryPassword,
                    "success"
                );

                await loadUsers();

            } catch (error) {
                showNotice(error.message, "error");

            } finally {
                submitButton.disabled = false;
                submitButton.textContent = "Create Account";
            }
        });

    root.querySelector("#aegisSearch")
        .addEventListener("input", renderDirectory);

    root.querySelector("#aegisStatusFilter")
        .addEventListener("change", renderDirectory);

    root.querySelector("#aegisRoleFilters")
        .addEventListener("click", event => {

            const button = event.target.closest("[data-role]");
            if (!button) return;

            selectedRole = button.dataset.role;

            root.querySelectorAll("#aegisRoleFilters button")
                .forEach(item => item.classList.remove("active"));

            button.classList.add("active");

            renderDirectory();
        });

    root.querySelector("#aegisRefresh")
        .addEventListener("click", loadUsers);

    directory.addEventListener("click", async event => {

        if (event.target.id === "aegisRetry") {
            loadUsers();
            return;
        }

        const button = event.target.closest("[data-action]");
        if (!button) return;

        const username = button.dataset.username;
        const action = button.dataset.action;

        if (!username) return;

        if (action === "reset") {

            if (!confirm(
                "Reset the password for " + username + "?"
            )) return;

            button.disabled = true;

            try {
                const result = await apiRequest(
                    "resetManagedUserPassword",
                    { username }
                );

                showNotice(
                    "Password reset successfully. Temporary password: " +
                    result.temporaryPassword,
                    "success"
                );

            } catch (error) {
                showNotice(error.message, "error");

            } finally {
                button.disabled = false;
            }

            return;
        }

        const statusMap = {
            activate: "Active",
            lock: "Locked",
            disable: "Disabled"
        };

        const newStatus = statusMap[action];

        if (!newStatus) return;

        if (!confirm(
            "Change " + username + "'s account status to " +
            newStatus + "?"
        )) return;

        button.disabled = true;

        try {
            await apiRequest(
                "updateManagedUserStatus",
                { username, status: newStatus }
            );

            showNotice(
                "Account status updated successfully.",
                "success"
            );

            await loadUsers();

        } catch (error) {
            showNotice(error.message, "error");
            button.disabled = false;
        }
    });

   root.querySelectorAll("[data-operation]").forEach(button => {
        button.addEventListener("click", () => {

            if (button.dataset.operation === "password") {
                root.querySelector("#aegisSearch").focus();

                showNotice(
                    "Find the account in the directory and select Reset.",
                    "info"
                );
            }

            if (button.dataset.operation === "status") {
                root.querySelector("#aegisStatusFilter").focus();

                showNotice(
                    "Select an account in the directory to manage its status.",
                    "info"
                );
            }
        });
    });


    // ACCOUNT INTEGRITY CENTRE

    let integrityData = null;
    let integrityLoading = false;

    const integrityDetail =
        root.querySelector("#aegisIntegrityDetail");

    const integrityDetailList =
        root.querySelector("#aegisIntegrityDetailList");

    const integritySections = {

        roles: {
            title: "Role Compliance",
            description:
                "Recorded role assignments, role changes, " +
                "invalid roles, duplicate usernames and account anomalies."
        },

        access: {
            title: "System Access",
            description:
                "Recorded login outcomes, access attempts, session activity " +
                "and the current monitoring coverage."
        },

        alerts: {
            title: "Security Alerts",
            description:
                "Security alert records returned by the existing audit service."
        },

        incidents: {
            title: "Event Investigation",
            description:
                "Recent traceable audit events. This view does not create " +
                "or imply a separate incident-management record."
        }
    };


    function integrityArray(value) {
        return Array.isArray(value) ? value : [];
    }


    function integrityCount(value) {

        if (Array.isArray(value)) {
            return value.length;
        }

        return Number.isFinite(Number(value))
            ? Number(value)
            : 0;
    }


    function integrityValue(value) {

        if (value === null || value === undefined || value === "") {
            return "Not recorded";
        }

        if (typeof value === "boolean") {
            return value ? "Enabled" : "Not enabled";
        }

        if (typeof value === "object") {
            return JSON.stringify(value);
        }

        return String(value);
    }


    function integrityTimestamp(value) {

        if (!value) return "Time not recorded";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return integrityValue(value);
        }

        return date.toLocaleString();
    }


    function integrityRecordMarkup(record, label) {

        if (typeof record !== "object" || record === null) {
            return `
                <article class="aegis-integrity-detail-item">
                    <strong>${escapeHTML(label)}</strong>
                    <p>${escapeHTML(integrityValue(record))}</p>
                </article>
            `;
        }

        const fields = Object.entries(record).filter(
            ([key, value]) =>
                value !== undefined &&
                value !== null &&
                value !== ""
        );

        const findField = keys => {
            const entry = fields.find(([key]) =>
                keys.includes(key.toLowerCase())
            );

            return entry ? entry[1] : null;
        };

        const eventType = findField([
            "recordtype", "eventtype", "type", "action"
        ]);

        const actor = findField([
            "administrator", "username", "actor",
            "performedby", "initiatedby"
        ]);

        const affectedAccount = findField([
            "affectedaccount", "targetusername",
            "targetuser", "account", "affecteduser"
        ]);

        const timestamp = findField([
            "timestamp", "createdat", "datetime",
            "eventtime", "time"
        ]);

        const outcome = findField([
            "result", "status", "outcome"
        ]);

        const role = findField(["role"]);

        const isRoleDistribution =
            String(findField(["recordtype"]) || "")
                .toLowerCase() === "current role distribution";

        const heading =
            (isRoleDistribution && role) ||
            eventType ||
            record.username ||
            record.affectedAccount ||
            record.administrator ||
            label;

        const roleDescriptions = {
            "System Admin":
                "Accounts assigned system-wide administration responsibilities.",
            "School Admin":
                "Accounts assigned school-level administration responsibilities.",
            "Staff":
                "Staff accounts registered to support school activities.",
            "Learners":
                "Learner accounts registered in the e-Portfolio system.",
            "Parent/Guardian":
                "Parent and guardian accounts associated with learner profiles."
        };

        const evidenceMessage =
            isRoleDistribution && role
                ? roleDescriptions[role] ||
                  "Recorded account information for this role."
                : "Additional recorded evidence is available below.";

        const metadata = [
            ["Actor", actor],
            ["Affected account", affectedAccount],
            ["Time", timestamp],
            ["Outcome", outcome]
        ].filter(([, value]) => value !== null);

        return `
            <article class="aegis-integrity-detail-item">

                <div class="aegis-evidence-heading">
                    <span>◇</span>
                    <strong>${escapeHTML(heading)}</strong>
                </div>

                <div class="aegis-evidence-meta">
                    ${metadata.length
                        ? metadata.map(([key, value]) => `
                            <div>
                                <span>${escapeHTML(key)}</span>
                                <strong>${escapeHTML(
                                    key === "Time"
                                        ? integrityTimestamp(value)
                                        : integrityValue(value)
                                )}</strong>
                            </div>
                        `).join("")
                        : `<p>${escapeHTML(evidenceMessage)}</p>`
                    }
                </div>

                <details class="aegis-evidence-details">
                    <summary>
                        <span class="aegis-evidence-action">
                            <span class="aegis-evidence-action-icon">⌘</span>
                            <span>EXPLORE DETAILS</span>
                        </span>
                        <span class="aegis-evidence-arrow">↗</span>
                    </summary>

                    <div class="aegis-evidence-fields">
                        ${fields.map(([key, value]) => `
                            <div>
                                <span>${escapeHTML(key)}</span>
                                <strong>${escapeHTML(
                                    /timestamp|createdat|datetime|eventtime|^time$/i.test(key)
                                        ? integrityTimestamp(value)
                                        : integrityValue(value)
                                )}</strong>
                            </div>
                        `).join("")}
                    </div>
                </details>

            </article>
        `;
    }

    function integrityStatus(message, heading = "SYSTEM DATA") {

        root.querySelector("#aegisIntegrityDataHeading")
            .textContent = heading;

        root.querySelector("#aegisIntegrityDataMessage")
            .textContent = message;
    }


    function renderIntegrityRecords(records, emptyMessage) {

        if (!records.length) {
            integrityDetailList.innerHTML = `
                <div class="aegis-integrity-detail-item">
                    <span>◇</span>
                    <strong>No records returned</strong>
                    <small>${escapeHTML(emptyMessage)}</small>
                </div>
            `;
            return;
        }

        integrityDetailList.innerHTML = records
            .map((record, index) =>
                integrityRecordMarkup(record, "Record " + (index + 1))
            )
            .join("");
    }


    function renderIntegrityCoverage(coverage) {

        const entries = Object.entries(coverage || {});

        if (!entries.length) {
            return [{
                label: "Monitoring coverage",
                value: "Not returned by backend"
            }];
        }

        const consolidatedCoverage = {};

        entries.forEach(([key, value]) => {
            consolidatedCoverage[key] = integrityValue(value);
        });

        return [{
            label: "Monitoring coverage",
            ...consolidatedCoverage
        }];
    }

       
    function renderIntegrityView(view) {

        if (!integrityData) {
            integrityStatus(
                "Integrity records have not been loaded. Refresh and try again.",
                "DATA UNAVAILABLE"
            );
            return;
        }

        const section = integritySections[view];

        if (!section) return;

        const data = integrityData;
        const summary = data.summary || {};
        const roles = data.roleCompliance || {};
        const access = data.systemAccess || {};

        root.querySelector("#aegisIntegrityDetailTitle")
            .textContent = section.title;

        root.querySelector("#aegisIntegrityDetailDescription")
            .textContent = section.description;

        integrityDetailList.innerHTML = "";

        const records = [];

        if (view === "roles") {

            const roleCounts = roles.roleCounts || {};

            const roleTitles = {
                ICT_ADMIN: "System Admin Role",
                SCHOOL_ADMIN: "School Admin Role",
                TEACHER: "Staff Role",
                LEARNER: "Learners Role",
                PARENT: "Guardian Role"
            };

            Object.entries(roleCounts).forEach(([role, count]) => {
                records.push({
                    recordType: "Current role distribution",
                    role: roleTitles[role] || role,
                    accountCount: count
                });
            });

            integrityArray(roles.invalidAccounts).forEach(record => {
                records.push({
                    recordType: "Invalid role account",
                    ...(
                        typeof record === "object" && record !== null
                            ? record
                            : { account: record }
                    )
                });
            });

            integrityArray(roles.duplicateUsernames).forEach(record => {
                records.push({
                    recordType: "Duplicate username",
                    ...(
                        typeof record === "object" && record !== null
                            ? record
                            : { username: record }
                    )
                });
            });

            integrityArray(roles.invalidStatusAccounts).forEach(record => {
                records.push({
                    recordType: "Invalid account status",
                    ...(
                        typeof record === "object" && record !== null
                            ? record
                            : { account: record }
                    )
                });
            });

            integrityArray(roles.roleChangeRecords).forEach(record => {
                records.push({
                    recordType: "Role change",
                    ...record
                });
            });

            integrityStatus(
                "Role compliance records returned by the backend. " +
                "Summary role-change events: " +
                integrityCount(summary.roleChangeEvents) + "."
            );

            renderIntegrityRecords(
                records,
                "No role compliance records were returned."
            );
        }


        if (view === "access") {

            const accessRecords =
                integrityArray(access.accessRecords);
            const coverage =
                renderIntegrityCoverage(data.monitoringCoverage);

            integrityStatus(
                "ACCESS SUMMARY  |  Successful logins: " +
                integrityCount(summary.successfulLogins) +
                "  |  Failed logins: " +
                integrityCount(summary.failedLogins) +
                "  |  Access events: " +
                integrityCount(summary.accessEvents) +
                "  |  Logout events: " +
                integrityCount(summary.logoutEvents)
            );

            coverage.forEach(record => {
                records.push({
                    recordType: "MONITORING COVERAGE",
                    ...record
                });
            });

            accessRecords.forEach(record => {
                records.push(record);
            });

            renderIntegrityRecords(
                records,
                "No individual access records are available. " +
                "The summary above reflects the backend totals."
            );
        }

        if (view === "alerts") {

            integrityArray(data.securityAlerts).forEach(record => {
                records.push(record);
            });

            integrityStatus(
                integrityCount(summary.securityAlertEvents) +
                " security alert events reported in the backend summary."
            );

            renderIntegrityRecords(
                records,
                "No security alert records were returned."
            );
        }


        if (view === "incidents") {

            const recentEvents =
                integrityArray(data.recentEvents);

            const accessPattern =
                /LOGIN|ACCESS|SESSION|LOGOUT/i;

            const seenEvents = new Set();

            recentEvents.forEach(record => {

                const eventType =
                    String(record.eventType || "");

                const action =
                    String(record.action || "");

                const category =
                    String(record.category || "");

                // Access events belong in System Access.
                if (
                    accessPattern.test(eventType) ||
                    accessPattern.test(action) ||
                    accessPattern.test(category)
                ) {
                    return;
                }

                // Prevent duplicate copies of the same audit record.
                const fingerprint = JSON.stringify(record);

                if (seenEvents.has(fingerprint)) {
                    return;
                }

                seenEvents.add(fingerprint);
                records.push(record);
            });

            integrityStatus(
                "Administrative and security audit evidence. " +
                "Authentication, access and session records are " +
                "presented separately under System Access."
            );

            renderIntegrityRecords(
                records,
                "No non-access audit events were returned."
            );
        }

        integrityDetail.hidden = false;

        integrityDetail.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    function getIntegrityNotificationRecords(data, view) {

        const roles = data.roleCompliance || {};
        const access = data.systemAccess || {};

        if (view === "roles") {
            return [
                ...integrityArray(roles.invalidAccounts),
                ...integrityArray(roles.duplicateUsernames),
                ...integrityArray(roles.invalidStatusAccounts),
                ...integrityArray(roles.roleChangeRecords)
            ];
        }

        if (view === "access") {
            return integrityArray(access.accessRecords);
        }

        if (view === "alerts") {
            return integrityArray(data.securityAlerts);
        }

        if (view === "incidents") {

            const accessPattern =
                /LOGIN|ACCESS|SESSION|LOGOUT/i;

            const seenEvents = new Set();

            return integrityArray(data.recentEvents).filter(record => {

                const eventType =
                    String(record.eventType || "");

                const action =
                    String(record.action || "");

                const category =
                    String(record.category || "");

                if (
                    accessPattern.test(eventType) ||
                    accessPattern.test(action) ||
                    accessPattern.test(category)
                ) {
                    return false;
                }

                const fingerprint = JSON.stringify(record);

                if (seenEvents.has(fingerprint)) return false;

                seenEvents.add(fingerprint);
                return true;
            });
        }

        return [];
    }


    function integrityNotificationKey(view) {

        const username =
            sessionStorage.getItem("username") ||
            sessionStorage.getItem("loggedUser") ||
            "ict-admin";

        return "gsu_aegis_read_" + username + "_" + view;
    }


    function updateIntegrityNotifications(data) {

        Object.keys(integritySections).forEach(view => {

            const records =
                getIntegrityNotificationRecords(data, view);

            const storageKey =
                integrityNotificationKey(view);

            const currentKeys =
                records.map(record => JSON.stringify(record));

            let readRecords = [];

            try {

                const stored =
                    localStorage.getItem(storageKey);

                if (stored === null) {

                    // Existing records become the initial baseline.
                    localStorage.setItem(
                        storageKey,
                        JSON.stringify(currentKeys)
                    );

                    readRecords = currentKeys;

                } else {

                    readRecords = JSON.parse(stored);

                    if (!Array.isArray(readRecords)) {
                        readRecords = currentKeys;
                    }
                }

            } catch (error) {
                readRecords = currentKeys;
            }

            const readSet = new Set(readRecords);

            const unreadCount = currentKeys.filter(
                key => !readSet.has(key)
            ).length;

            const card = root.querySelector(
                `[data-integrity="${view}"]`
            );

            if (!card) return;

            const icon = card.querySelector(
                ".aegis-integrity-card-icon"
            );

            if (!icon) return;

            let badge = icon.querySelector(
                ".aegis-integrity-unread"
            );

            if (!badge) {

                badge = document.createElement("span");

                badge.className = "aegis-integrity-unread";

                badge.setAttribute("aria-live", "polite");

                icon.appendChild(badge);
            }

            badge.textContent =
                unreadCount > 99 ? "99+" : unreadCount;

            badge.hidden = unreadCount === 0;
        });
    }


    function markIntegrityCategoryRead(view) {

        if (!integrityData) return;

        const records =
            getIntegrityNotificationRecords(integrityData, view);

        const currentKeys =
            records.map(record => JSON.stringify(record));

        try {

            localStorage.setItem(
                integrityNotificationKey(view),
                JSON.stringify(currentKeys)
            );

        } catch (error) {

            console.warn(
                "Unable to save notification read status.",
                error
            );
        }

        updateIntegrityNotifications(integrityData);
    }


    function updateIntegrityCounters(data) {

        const summary = data.summary || {};

        const roleCount =
            integrityCount(summary.roleChangeEvents) +
            integrityCount(summary.invalidRoleAccounts) +
            integrityCount(summary.invalidStatusAccounts) +
            integrityCount(summary.duplicateUsernames);

        root.querySelector("#aegisRoleCount").textContent =
            roleCount;

        root.querySelector("#aegisAccessCount").textContent =
            integrityCount(summary.accessEvents);

        root.querySelector("#aegisAlertCount").textContent =
            integrityCount(summary.securityAlertEvents);

        const investigationEvents =
            getIntegrityNotificationRecords(data, "incidents");

        root.querySelector("#aegisEventCount").textContent =
            investigationEvents.length;

        updateIntegrityNotifications(data);
    }


    async function loadAccountIntegrity() {

        if (integrityLoading) return;

        integrityLoading = true;

        const refreshButton =
            root.querySelector("#aegisIntegrityRefresh");

        refreshButton.disabled = true;
        refreshButton.textContent = "Loading...";

        root.querySelector("#aegisIntegrityStatus")
            .textContent = "Retrieving integrity records";

        try {

            const result = await apiRequest(
                "getAccountIntegrityData"
            );

            if (!result.summary || !result.roleCompliance) {
                throw new Error(
                    "The integrity response is incomplete. Check the deployed backend version."
                );
            }

            integrityData = result;

            updateIntegrityCounters(result);

            root.querySelector("#aegisIntegrityStatus")
                .textContent = "Integrity records loaded";

            root.querySelector("#aegisIntegrityUpdated")
                .textContent = result.generatedAt
                    ? "Last updated: " + integrityTimestamp(result.generatedAt)
                    : "Backend records retrieved successfully.";

            if (!integrityDetail.hidden) {
                const activeView = Object.keys(integritySections).find(
                    key =>
                        integritySections[key].title ===
                        root.querySelector("#aegisIntegrityDetailTitle")
                            .textContent
                );

                if (activeView) {
                    renderIntegrityView(activeView);
                }
            }

        } catch (error) {

            integrityData = null;

            root.querySelector("#aegisIntegrityStatus")
                .textContent = "Integrity data unavailable";

            root.querySelector("#aegisIntegrityUpdated")
                .textContent = error.message;

            root.querySelector("#aegisRoleCount").textContent = "—";
            root.querySelector("#aegisAccessCount").textContent = "—";
            root.querySelector("#aegisAlertCount").textContent = "—";
            root.querySelector("#aegisEventCount").textContent = "—";

            if (!integrityDetail.hidden) {
                integrityStatus(
                    error.message,
                    "UNABLE TO RETRIEVE DATA"
                );

                integrityDetailList.innerHTML = "";
            }

            showNotice(
                "Account integrity data could not be loaded. " +
                "Refresh and try again.",
                "error"
            );

        } finally {

            integrityLoading = false;
            refreshButton.disabled = false;
            refreshButton.textContent = "Refresh";
        }
    }


    root.querySelectorAll("[data-integrity]").forEach(button => {

        button.addEventListener("click", () => {

            const view = button.dataset.integrity;

            markIntegrityCategoryRead(view);

            renderIntegrityView(view);
        });

    });


    root.querySelector("#aegisIntegrityRefresh")
        .addEventListener("click", loadAccountIntegrity);


    root.querySelector("#aegisIntegrityClose")
        .addEventListener("click", () => {
            integrityDetail.hidden = true;
        });


    loadUsers();

    if (window.aegisPresenceRefreshTimer) {
        clearInterval(window.aegisPresenceRefreshTimer);
    }

    window.aegisPresenceRefreshTimer = setInterval(async () => {

        if (!root.isConnected) {
            clearInterval(window.aegisPresenceRefreshTimer);
            window.aegisPresenceRefreshTimer = null;
            return;
        }

        try {
            const result = await apiRequest("getManagedUsers");

            managedUsers = Array.isArray(result.users)
                ? result.users
                : [];

            updateCounters();
            renderDirectory();

        } catch (error) {
            console.warn(
                "Online presence refresh failed:",
                error
            );
        }

    }, 30000);

    loadAccountIntegrity();

}
