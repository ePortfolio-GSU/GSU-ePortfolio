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
// DYNAMIC SCHOOL CALENDAR AND SESSION PROGRESS
// =====================================================

const SESSION_EVENTS_API_URL =
    "https://script.google.com/macros/s/AKfycbwcYc2v0rRVF_AFDtluOVFCTja89vOH0HBtcI9rLGs0PCd7D3YpI5K4EVrb7XKaH_AL/exec";

let sessionCalendarData = null;
let sessionEventsRefreshTimer = null;
let sessionProgressClock = null;


// =====================================================
// NAIROBI DATE AND TIME
// =====================================================

function getNairobiNow() {
    return new Date(
        new Date().toLocaleString("en-US", {
            timeZone: "Africa/Nairobi"
        })
    );
}


function getNairobiYear() {
    return Number(
        new Intl.DateTimeFormat("en-KE", {
            timeZone: "Africa/Nairobi",
            year: "numeric"
        }).format(new Date())
    );
}


function getNairobiDateString(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Africa/Nairobi",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(date);

    const values = {};

    parts.forEach(part => {
        values[part.type] = part.value;
    });

    return `${values.year}-${values.month}-${values.day}`;
}


// =====================================================
// DATE PARSING
// =====================================================

function parseSessionDate(value, isEndDate = false) {
    if (!value) return null;

    const input = String(value).trim();

    if (!input) return null;

    // Date-only values are interpreted using Nairobi time.
    const dateOnly = input.match(
        /^(\d{4})-(\d{2})-(\d{2})$/
    );

    if (dateOnly) {
        const time = isEndDate
            ? "23:59:59.999"
            : "00:00:00.000";

        const parsed = new Date(
            `${dateOnly[1]}-${dateOnly[2]}-${dateOnly[3]}T${time}+03:00`
        );

        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    // Datetime-local values are interpreted using Nairobi time.
    const localDateTime = input.match(
        /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/
    );

    if (localDateTime) {
        const seconds = localDateTime[3] || "00";
        const milliseconds = (localDateTime[4] || "0")
            .padEnd(3, "0");

        const parsed = new Date(
            `${localDateTime[1]}T${localDateTime[2]}:${seconds}.${milliseconds}+03:00`
        );

        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    // Values already containing a timezone or UTC offset.
    const parsed = new Date(input);

    return Number.isNaN(parsed.getTime()) ? null : parsed;
}


function formatSessionDate(value) {
    const date = value instanceof Date
        ? value
        : parseSessionDate(value);

    if (!date) return "Date unavailable";

    return new Intl.DateTimeFormat("en-KE", {
        timeZone: "Africa/Nairobi",
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(date);
}


function formatSessionEventDateRange(startValue, endValue) {
    const start = parseSessionDate(startValue);
    const end = parseSessionDate(endValue);

    if (!start || !end) return "Date information unavailable";

    const dateFormatter = new Intl.DateTimeFormat("en-KE", {
        timeZone: "Africa/Nairobi",
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    const timeFormatter = new Intl.DateTimeFormat("en-KE", {
        timeZone: "Africa/Nairobi",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

    if (dateFormatter.format(start) === dateFormatter.format(end)) {
        return `${dateFormatter.format(start)} · ${timeFormatter.format(start)} – ${timeFormatter.format(end)}`;
    }

    return `${dateFormatter.format(start)} ${timeFormatter.format(start)} – ${dateFormatter.format(end)} ${timeFormatter.format(end)}`;
}


function escapeSessionHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}


// =====================================================
// ACADEMIC YEAR PROGRESS
// Every academic year runs January 1 to December 31.
// =====================================================

function calculateSessionProgress() {
    const now = Date.now();
    const year = getNairobiYear();

    const yearStart = new Date(
        `${year}-01-01T00:00:00.000+03:00`
    ).getTime();

    const yearEnd = new Date(
        `${year}-12-31T23:59:59.999+03:00`
    ).getTime();

    const totalDuration = yearEnd - yearStart;
    const elapsedDuration = Math.max(
        0,
        Math.min(now - yearStart, totalDuration)
    );

    const percentage = totalDuration > 0
        ? Math.round((elapsedDuration / totalDuration) * 100)
        : 0;

    return {
        year,
        percentage,
        yearStart,
        yearEnd
    };
}


// =====================================================
// SCHOOL CALENDAR DATA
// =====================================================

function getPublishedSchoolTerms() {
    const records = sessionCalendarData?.schoolCalendar || [];

    return records
        .filter(record =>
            record.recordType === "TERM" &&
            record.status === "PUBLISHED"
        )
        .map(record => {
            const start = parseSessionDate(record.startDate);
            const end = parseSessionDate(record.endDate, true);

            return {
                ...record,
                start,
                end
            };
        })
        .filter(term =>
            term.start &&
            term.end &&
            term.end >= term.start
        )
        .sort((a, b) => a.start - b.start);
}


// =====================================================
// TERM STATUS AND WEEK NUMBER
// =====================================================

function getAcademicTermStatus(term) {
    const now = Date.now();

    if (now >= term.start.getTime() && now <= term.end.getTime()) {
        return "IN PROGRESS";
    }

    if (now < term.start.getTime()) {
        return "UPCOMING";
    }

    return "COMPLETED";
}


function getAcademicTermWeek() {
    const terms = getPublishedSchoolTerms();
    const now = getNairobiNow().getTime();

    const activeTerm = terms.find(term =>
        now >= term.start.getTime() &&
        now <= term.end.getTime()
    );

    if (!activeTerm) return "HOLIDAY";

    const termStart = activeTerm.start;
    const termEnd = activeTerm.end;

    // The first partial week counts as WEEK 01.
    const startDay = termStart.getDay();

    const firstSunday = new Date(termStart);
    firstSunday.setDate(
        firstSunday.getDate() - startDay
    );
    firstSunday.setHours(0, 0, 0, 0);

    const currentSunday = new Date(
        getNairobiNow().getTime()
    );

    currentSunday.setDate(
        currentSunday.getDate() - currentSunday.getDay()
    );
    currentSunday.setHours(0, 0, 0, 0);

    const weekNumber = Math.floor(
        (currentSunday.getTime() - firstSunday.getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    ) + 1;

    const termEndDay = termEnd.getDay();

    // A term week ends on Saturday.
    const finalSaturday = new Date(termEnd);
    finalSaturday.setDate(
        finalSaturday.getDate() + (6 - termEndDay)
    );
    finalSaturday.setHours(23, 59, 59, 999);

    if (now > finalSaturday.getTime()) {
        return "HOLIDAY";
    }

    return `WEEK ${String(weekNumber).padStart(2, "0")}`;
}


// =====================================================
// BUILD ACADEMIC PERIODS
// No hardcoded term dates.
// Dates come from the published School Calendar.
// =====================================================

function buildAcademicPeriods() {
    const terms = getPublishedSchoolTerms();
    const periods = [];

    terms.forEach((term, index) => {
        periods.push({
            type: "TERM",
            title: term.title || `TERM ${String(index + 1).padStart(2, "0")}`,
            start: term.start,
            end: term.end
        });

        const nextTerm = terms[index + 1];

        let holidayTitle = "";

        if (index % 3 === 0) {
            holidayTitle = "EASTER HOLIDAY";
        } else if (index % 3 === 1) {
            holidayTitle = "AUGUST HOLIDAY";
        } else {
            holidayTitle = "DECEMBER HOLIDAY";
        }

        const holidayStart = new Date(
            term.end.getTime() + 1
        );

        let holidayEnd = null;

        if (nextTerm) {
            holidayEnd = new Date(
                nextTerm.start.getTime() - 1
            );
        } else if (index % 3 === 2) {
            const year = Number(
                new Intl.DateTimeFormat("en-KE", {
                    timeZone: "Africa/Nairobi",
                    year: "numeric"
                }).format(term.end)
            );

            const decemberEnd = new Date(
                `${year}-12-31T23:59:59.999+03:00`
            );

            if (decemberEnd >= holidayStart) {
                holidayEnd = decemberEnd;
            }
        }

        if (!holidayEnd || holidayEnd >= holidayStart) {
            periods.push({
                type: "HOLIDAY",
                title: holidayTitle,
                start: holidayStart,
                end: holidayEnd
            });
        }
    });

    // Academic year boundaries are fixed every year.
    const currentYear = getNairobiYear();

    for (let year = currentYear; year <= currentYear + 3; year++) {
        periods.push({
            type: "ACADEMIC_YEAR",
            title: `ACADEMIC YEAR ${year}`,
            start: new Date(
                `${year}-01-01T00:00:00.000+03:00`
            ),
            end: new Date(
                `${year}-12-31T23:59:59.999+03:00`
            )
        });
    }

    return periods;
}


// =====================================================
// PUBLISHED EVENTS AND ACTIVITIES
// =====================================================

function getPublishedSessionEvents() {
    const records = sessionCalendarData?.eventsActivities || [];

    return records
        .filter(event =>
            event.status === "PUBLISHED"
        )
        .map(event => ({
            ...event,
            start: parseSessionDate(event.startDateTime),
            end: parseSessionDate(event.endDateTime)
        }))
        .filter(event =>
            event.start &&
            event.end &&
            event.end >= event.start
        );
}


// =====================================================
// SELECT ONGOING AND UPCOMING
// Active published events take priority over
// the academic period.
// Upcoming is the nearest future event or period.
// =====================================================

function getSessionHighlights() {
    const now = Date.now();

    const periods = buildAcademicPeriods();
    const events = getPublishedSessionEvents();

    const activeEvents = events
        .filter(event =>
            event.start.getTime() <= now &&
            event.end.getTime() >= now
        )
        .sort((a, b) => a.end - b.end);

    const futureEvents = events
        .filter(event =>
            event.start.getTime() > now
        )
        .map(event => ({
            type: "EVENT",
            title: event.title,
            start: event.start,
            end: event.end
        }));

    const activePeriods = periods
        .filter(period =>
            period.type !== "ACADEMIC_YEAR" &&
            period.start.getTime() <= now &&
            (!period.end || period.end.getTime() >= now)
        );

    let ongoing = null;

    if (activeEvents.length) {
        const event = activeEvents[0];

        ongoing = {
            type: "EVENT",
            title: event.title,
            start: event.start,
            end: event.end
        };
    } else if (activePeriods.length) {
        ongoing = activePeriods
            .sort((a, b) => {
                const priority = {
                    TERM: 1,
                    HOLIDAY: 2
                };

                return priority[a.type] - priority[b.type];
            })[0];
    } else {
        const activeYear = periods.find(period =>
            period.type === "ACADEMIC_YEAR" &&
            period.start.getTime() <= now &&
            period.end.getTime() >= now
        );

        if (activeYear) ongoing = activeYear;
    }

    const futurePeriods = periods.filter(period =>
        period.start.getTime() > now
    );

    const upcomingCandidates = [
        ...futureEvents,
        ...futurePeriods
    ];

    upcomingCandidates.sort(
        (a, b) => a.start - b.start
    );

    return {
        ongoing,
        upcoming: upcomingCandidates[0] || null
    };
}


// =====================================================
// DISPLAY SESSION HIGHLIGHTS
// =====================================================

function renderSessionHighlights() {
    const ongoingTitle = document.getElementById(
        "sessionOngoingTitle"
    );

    const ongoingTime = document.getElementById(
        "sessionOngoingTime"
    );

    const upcomingTitle = document.getElementById(
        "sessionUpcomingTitle"
    );

    const upcomingTime = document.getElementById(
        "sessionUpcomingTime"
    );

    if (!ongoingTitle || !ongoingTime ||
        !upcomingTitle || !upcomingTime) {
        return;
    }

    const highlights = getSessionHighlights();

    if (highlights.ongoing) {
        ongoingTitle.textContent = highlights.ongoing.title;

        ongoingTime.textContent = highlights.ongoing.end
            ? `Ends: ${formatSessionDate(highlights.ongoing.end)}`
            : "End date pending";
    } else {
        ongoingTitle.textContent = "No ongoing period";
        ongoingTime.textContent = "No active published period";
    }

    if (highlights.upcoming) {
        upcomingTitle.textContent = highlights.upcoming.title;

        upcomingTime.textContent =
            `Begins: ${formatSessionDate(highlights.upcoming.start)}`;
    } else {
        upcomingTitle.textContent = "No upcoming period";
        upcomingTime.textContent = "No future period published";
    }
}


// =====================================================
// LOAD SCHOOL CALENDAR FROM BACKEND
// =====================================================

async function loadSessionEvents() {
    const sessionToken = sessionStorage.getItem("sessionToken");

    if (!sessionToken) {
        const ongoingTitle = document.getElementById(
            "sessionOngoingTitle"
        );

        const upcomingTitle = document.getElementById(
            "sessionUpcomingTitle"
        );

        if (ongoingTitle) {
            ongoingTitle.textContent = "Calendar unavailable";
        }

        if (upcomingTitle) {
            upcomingTitle.textContent = "Calendar unavailable";
        }

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
                sessionToken
            })
        });

        const result = await response.json();

        if (!result || result.success !== true) {
            throw new Error(
                result?.message || "Unable to load school calendar."
            );
        }

        sessionCalendarData = result;

        renderSessionHighlights();
        renderSessionTermTimeline();

    } catch (error) {
        console.error(
            "Academic Command Centre calendar error:",
            error
        );

        const ongoingTitle = document.getElementById(
            "sessionOngoingTitle"
        );

        const upcomingTitle = document.getElementById(
            "sessionUpcomingTitle"
        );

        if (ongoingTitle) {
            ongoingTitle.textContent = "Calendar temporarily unavailable";
        }

        if (upcomingTitle) {
            upcomingTitle.textContent = "Calendar temporarily unavailable";
        }
    }
}


// =====================================================
// DYNAMIC TERM TIMELINE
// =====================================================

function renderSessionTermTimeline() {
    const host = document.getElementById(
        "sessionTermTimeline"
    );

    if (!host) return;

    const terms = getPublishedSchoolTerms();

    if (!terms.length) {
        host.innerHTML = `
            <div class="session-term">
                <span>SCHOOL TERMS</span>
                <strong>DATES PENDING</strong>
            </div>
        `;

        return;
    }

    host.innerHTML = terms.map(term => {
        const status = getAcademicTermStatus(term);

        return `
            <div class="session-term">
                <span>${escapeSessionHTML(
                    term.title || "SCHOOL TERM"
                )}</span>
                <strong>${escapeSessionHTML(status)}</strong>
            </div>
        `;
    }).join("");
}


// =====================================================
// LIVE DATE AND CLOCK
// =====================================================

function updateSessionClock() {
    const dateElement = document.getElementById(
        "sessionLiveDate"
    );

    const timeElement = document.getElementById(
        "sessionLiveTime"
    );

    if (!dateElement || !timeElement) return;

    const now = new Date();

    const weekLabel = getAcademicTermWeek();

    const dayLabel = new Intl.DateTimeFormat("en-KE", {
        timeZone: "Africa/Nairobi",
        weekday: "long"
    }).format(now);

    const dateLabel = new Intl.DateTimeFormat("en-KE", {
        timeZone: "Africa/Nairobi",
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(now);

    const timeLabel = new Intl.DateTimeFormat("en-KE", {
        timeZone: "Africa/Nairobi",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    }).format(now);

    dateElement.textContent =
        `${weekLabel} · ${dayLabel} · ${dateLabel}`;

    timeElement.textContent = timeLabel;

    const progress = calculateSessionProgress();

    const fill = document.querySelector(
        ".session-progress-fill"
    );

    const percentage = document.querySelector(
        ".session-progress-percent"
    );

    if (fill) {
        fill.style.width = `${progress.percentage}%`;
    }

    if (percentage) {
        percentage.textContent =
            `${progress.percentage}%`;
    }
}

// =====================================================
// RENDER ACADEMIC COMMAND CENTRE
// =====================================================

function renderSessionProgressCard(role) {
    const host = document.getElementById("dashboardCards");

    if (!host) return;

    const progress = calculateSessionProgress();

    const terms = getPublishedSchoolTerms();

    const termMarkup = terms.length
        ? terms.map(term => {
            const status = getAcademicTermStatus(term);

            return `
                <div class="session-term">
                    <span>${escapeSessionHTML(
                        term.title || "SCHOOL TERM"
                    )}</span>
                    <strong>${escapeSessionHTML(status)}</strong>
                </div>
            `;
        }).join("")
        : `
            <div class="session-term">
                <span>SCHOOL TERMS</span>
                <strong>DATES PENDING</strong>
            </div>
        `;

    host.innerHTML = `
        <section class="session-progress-card">

            <div class="session-card-header">

                <div class="session-card-brand">
                    <div class="session-card-symbol">GSU</div>

                    <div>
                        <h2>ACADEMIC COMMAND CENTRE</h2>
                        <p>GSU EMBAKASI ACADEMY</p>
                    </div>
                </div>

                <div class="session-card-status">
                    <div
                        class="session-week-date"
                        id="sessionLiveDate"
                    ></div>

                    <div class="session-live-indicator">
                        <span></span>
                        LIVE
                    </div>
                </div>

            </div>


            <div class="session-year-block">
                <span>ACADEMIC YEAR</span>
                <strong id="sessionAcademicYear">
                    ${progress.year}
                </strong>
            </div>


            <div class="session-progress-layout">

                <div class="session-progress-description">
                    <span>ANNUAL SESSION PROGRESS</span>
                </div>

                <div
                    class="session-progress-bar"
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow="${progress.percentage}"
                >
                    <div
                        class="session-progress-fill"
                        style="width: ${progress.percentage}%"
                    ></div>
                </div>

                <strong class="session-progress-percent">
                    ${progress.percentage}%
                </strong>

            </div>


            <div
                class="session-term-timeline"
                id="sessionTermTimeline"
            >
                ${termMarkup}
            </div>


            <div class="session-activities-row">

                <div class="session-ongoing-section">
                    <span class="session-section-label">
                        ONGOING
                    </span>

                    <strong id="sessionOngoingTitle">
                        Loading...
                    </strong>

                    <small id="sessionOngoingTime">
                        Retrieving school calendar
                    </small>

                    <a
                        href="events.html"
                        class="session-ongoing-button"
                    >
                        ONGOING
                    </a>
                </div>


                <div class="session-upcoming-section">
                    <span class="session-section-label">
                        UPCOMING
                    </span>

                    <strong id="sessionUpcomingTitle">
                        Loading...
                    </strong>

                    <small id="sessionUpcomingTime">
                        Retrieving school calendar
                    </small>
                </div>

            </div>


            <div class="session-card-clock">
                <strong id="sessionLiveTime"></strong>
            </div>

        </section>
    `;


    // Start live clock.
    updateSessionClock();

    if (sessionProgressClock) {
        clearInterval(sessionProgressClock);
    }

    sessionProgressClock = setInterval(
        updateSessionClock,
        1000
    );


    // Load published school calendar and events.
    loadSessionEvents();

    if (sessionEventsRefreshTimer) {
        clearInterval(sessionEventsRefreshTimer);
    }

    sessionEventsRefreshTimer = setInterval(
        loadSessionEvents,
        60000
    );
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

    welcomeHeading.textContent = "WELCOME BACK, " + firstName.toUpperCase();
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
