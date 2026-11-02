/************************************************
 * GSU EMBAKASI ACADEMY
 * CALENDAR & EVENTS FRONTEND
 ************************************************/

const CALENDAR_API_URL =
    "https://script.google.com/macros/s/AKfycbwcYc2v0rRVF_AFDtluOVFCTja89vOH0HBtcI9rLGs0PCd7D3YpI5K4EVrb7XKaH_AL/exec";

const calendarToken = sessionStorage.getItem("sessionToken");
const calendarRole = sessionStorage.getItem("userRole");
const calendarUsername = sessionStorage.getItem("username");
const calendarFullName = sessionStorage.getItem("loggedUser");

const calendarManagers = ["ICT_ADMIN", "SCHOOL_ADMIN"];

let calendarData = null;
let activeEventView = "ongoing";


/************************************************
 * INITIALISATION
 ************************************************/

document.addEventListener("DOMContentLoaded", initialiseCalendar);

async function initialiseCalendar() {
    if (!calendarToken || !calendarRole || !calendarUsername) {
        alert("Your session has expired. Please log in again.");
        window.location.href = "index.html";
        return;
    }

    document.getElementById("calendarUserName").textContent =
        calendarFullName || calendarUsername;

    document.getElementById("calendarBackButton")
        .addEventListener("click", () => {
            window.location.href = "MasterDashboard.html";
        });

    const canManage = calendarManagers.includes(calendarRole);

    document.getElementById("addSchoolCalendarButton").hidden = !canManage;
    document.getElementById("addSchoolEventButton").hidden = !canManage;

    bindCalendarForms();
    bindEventTabs();
    bindDialogButtons();

    document.getElementById("addSchoolCalendarButton")
        .addEventListener("click", () => openSchoolCalendarForm());

    document.getElementById("addSchoolEventButton")
        .addEventListener("click", () => openSchoolEventForm());

    await loadCalendarData();
}


/************************************************
 * API COMMUNICATION
 ************************************************/

async function calendarRequest(action, extra = {}) {
    const response = await fetch(CALENDAR_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=UTF-8"
        },
        body: JSON.stringify({
            action: action,
            sessionToken: calendarToken,
            ...extra
        })
    });

    if (!response.ok) {
        throw new Error("Unable to communicate with the calendar service.");
    }

    const result = await response.json();

    if (!result.success &&
        result.message &&
        result.message.toLowerCase().includes("session")) {
        sessionStorage.clear();
        alert(result.message);
        window.location.href = "index.html";
    }

    return result;
}


/************************************************
 * LOAD CALENDAR DATA
 ************************************************/

async function loadCalendarData() {
    const schoolList = document.getElementById("schoolCalendarList");
    const eventList = document.getElementById("schoolEventsList");

    schoolList.innerHTML =
        '<p class="calendar-loading">Loading school calendar...</p>';

    eventList.innerHTML =
        '<p class="calendar-loading">Loading events and activities...</p>';

    try {
        const result = await calendarRequest("getCalendarData");

        if (!result.success) {
            throw new Error(result.message || "Calendar data could not be loaded.");
        }

        calendarData = result;

        renderAcademicContext();
        populateEventTermOptions();
        renderSchoolCalendar();
        renderSchoolEvents();

    } catch (error) {
        schoolList.textContent = error.message;
        eventList.textContent = error.message;
    }
}


/************************************************
 * ACADEMIC CONTEXT
 ************************************************/

function renderAcademicContext() {
    const container =
        document.getElementById("calendarAcademicContext");

    const term = calendarData.currentTerm;

    if (!term) {
        container.textContent = "No current academic term recorded.";
        return;
    }

    container.textContent = "Current Term: " + term.title;
}


/************************************************
 * TERM SELECTOR
 ************************************************/

function populateEventTermOptions(selectedTermId = "") {
    const selector = document.getElementById("schoolEventTerm");

    const terms = (calendarData.schoolCalendar || []).filter(record =>
        record.recordType === "TERM" &&
        record.status === "PUBLISHED"
    );

    selector.innerHTML =
        '<option value="">Select academic term</option>';

    terms.forEach(term => {
        const option = document.createElement("option");

        option.value = term.termId;
        option.textContent = term.title;

        selector.appendChild(option);
    });

    const currentTerm = calendarData.currentTerm;

    selector.value = selectedTermId ||
        (currentTerm ? currentTerm.termId : "");
}


/************************************************
 * DATE FORMATTING
 ************************************************/

function calendarDateValue(value) {
    if (!value) return null;

    const date = new Date(value);

    return isNaN(date.getTime()) ? null : date;
}

function formatCalendarDate(value) {
    const date = calendarDateValue(value);

    if (!date) return "Date unavailable";

    return date.toLocaleString("en-KE", {
        dateStyle: "medium",
        timeStyle: "short"
    });
}

function calendarStatusLabel(status) {
    const labels = {
        PUBLISHED: "Published",
        DRAFT: "Draft",
        POSTPONED: "Postponed",
        CANCELLED: "Cancelled"
    };

    return labels[status] || status;
}


/************************************************
 * SAFE HTML OUTPUT
 ************************************************/

function escapeCalendarHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}


/************************************************
 * SCHOOL CALENDAR DISPLAY
 ************************************************/

function renderSchoolCalendar() {
    const container =
        document.getElementById("schoolCalendarList");

    const records = calendarData.schoolCalendar || [];

    if (!records.length) {
        container.innerHTML =
            "<p>No school calendar records available.</p>";
        return;
    }

    container.innerHTML = records.map(record => {
        const title = escapeCalendarHTML(record.title);
        const category = escapeCalendarHTML(record.category || record.recordType);
        const description = escapeCalendarHTML(record.description || "");
        const venue = escapeCalendarHTML(record.venue || "Not specified");

        return `
            <article class="calendar-record-card">
                <div class="calendar-record-content">
                    <h3>${title}</h3>
                    <span>${category}</span>

                    <p>
                        ${formatCalendarDate(record.startDate)}
                        – ${formatCalendarDate(record.endDate)}
                    </p>

                    <p>${venue}</p>
                    <p>${description}</p>

                    <span>${calendarStatusLabel(record.status)}</span>
                </div>

                ${calendarData.canManage ? `
                    <div class="calendar-record-actions">
                        <button type="button"
                            data-edit-school="${escapeCalendarHTML(record.recordId)}">
                            Edit
                        </button>

                        <button type="button"
                            data-delete-school="${escapeCalendarHTML(record.recordId)}">
                            Delete
                        </button>
                    </div>
                ` : ""}
            </article>
        `;
    }).join("");

    container.querySelectorAll("[data-edit-school]").forEach(button => {
        button.addEventListener("click", () => {
            const record = records.find(item =>
                item.recordId === button.dataset.editSchool
            );

            if (record) openSchoolCalendarForm(record);
        });
    });

    container.querySelectorAll("[data-delete-school]").forEach(button => {
        button.addEventListener("click", () =>
            deleteSchoolCalendar(button.dataset.deleteSchool)
        );
    });
}


/************************************************
 * EVENT CATEGORY TABS
 ************************************************/

function bindEventTabs() {
    document.querySelectorAll("[data-event-view]").forEach(button => {
        button.addEventListener("click", () => {
            activeEventView = button.dataset.eventView;

            document.querySelectorAll("[data-event-view]")
                .forEach(tab => tab.classList.remove("active"));

            button.classList.add("active");

            renderSchoolEvents();
        });
    });
}


function getEventsForActiveView() {
    const events = calendarData.eventsActivities || [];
    const now = new Date();

    const currentTermId =
        calendarData.currentTerm?.termId || "";

    return events.filter(event => {
        const start = calendarDateValue(event.startDateTime);
        const end = calendarDateValue(event.endDateTime);

        if (!start || !end) return false;

        switch (activeEventView) {
            case "ongoing":
                return start <= now && end >= now;

            case "upcoming":
                return start > now;

            case "ended":
                return end < now &&
                    (!currentTermId || event.termId === currentTermId);

            case "past":
                return end < now &&
                    currentTermId &&
                    event.termId !== currentTermId;

            default:
                return false;
        }
    });
}


/************************************************
 * EVENTS DISPLAY
 ************************************************/

function renderSchoolEvents() {
    const container =
        document.getElementById("schoolEventsList");

    const events = getEventsForActiveView();

    if (!events.length) {
        container.innerHTML =
            "<p>No events or activities in this category.</p>";
        return;
    }

    container.innerHTML = events.map(event => {
        const title = escapeCalendarHTML(event.title);
        const venue = escapeCalendarHTML(event.venue);
        const description = escapeCalendarHTML(event.description);
        const term = (calendarData.schoolCalendar || [])
            .find(record =>
                record.recordType === "TERM" &&
                record.termId === event.termId
            );

        return `
            <article class="calendar-record-card">
                <div class="calendar-record-content">
                    <h3>${title}</h3>

                    <p>
                        ${formatCalendarDate(event.startDateTime)}
                        – ${formatCalendarDate(event.endDateTime)}
                    </p>

                    <p>Venue: ${venue}</p>

                    <p>${description}</p>

                    <p>Academic term:
                        ${escapeCalendarHTML(term?.title || event.termId)}
                    </p>

                    <span>${calendarStatusLabel(event.status)}</span>
                </div>

                ${calendarData.canManage ? `
                    <div class="calendar-record-actions">
                        <button type="button"
                            data-edit-event="${escapeCalendarHTML(event.eventId)}">
                            Edit
                        </button>

                        <button type="button"
                            data-delete-event="${escapeCalendarHTML(event.eventId)}">
                            Delete
                        </button>
                    </div>
                ` : ""}
            </article>
        `;
    }).join("");

    container.querySelectorAll("[data-edit-event]").forEach(button => {
        button.addEventListener("click", () => {
            const event = events.find(item =>
                item.eventId === button.dataset.editEvent
            );

            if (event) openSchoolEventForm(event);
        });
    });

    container.querySelectorAll("[data-delete-event]").forEach(button => {
        button.addEventListener("click", () =>
            deleteSchoolEvent(button.dataset.deleteEvent)
        );
    });
}


/************************************************
 * DIALOG CONTROLS
 ************************************************/

function bindDialogButtons() {
    document.querySelectorAll("[data-close-dialog]").forEach(button => {
        button.addEventListener("click", () => {
            document.getElementById(
                button.dataset.closeDialog
            ).close();
        });
    });
}


/************************************************
 * SCHOOL CALENDAR FORM
 ************************************************/

function openSchoolCalendarForm(record = null) {
    const form = document.getElementById("schoolCalendarForm");

    form.reset();

    document.getElementById("schoolCalendarFormTitle").textContent =
        record ? "Edit School Calendar Record" : "School Calendar Record";

    document.getElementById("schoolRecordId").value =
        record?.recordId || "";

    document.getElementById("schoolRecordType").value =
        record?.recordType || "TERM";

    document.getElementById("schoolTermId").value =
        record?.termId || "";

    document.getElementById("schoolRecordTitle").value =
        record?.title || "";

    document.getElementById("schoolRecordCategory").value =
        record?.category || "";

    document.getElementById("schoolRecordStart").value =
        toLocalDateTimeInput(record?.startDate);

    document.getElementById("schoolRecordEnd").value =
        toLocalDateTimeInput(record?.endDate);

    document.getElementById("schoolRecordVenue").value =
        record?.venue || "";

    document.getElementById("schoolRecordDescription").value =
        record?.description || "";

    document.getElementById("schoolRecordStatus").value =
        record?.status || "PUBLISHED";

    document.getElementById("schoolCalendarDialog").showModal();
}


function toLocalDateTimeInput(value) {
    const date = calendarDateValue(value);

    if (!date) return "";

    const offset = date.getTimezoneOffset() * 60000;

    return new Date(date.getTime() - offset)
        .toISOString()
        .slice(0, 16);
}


function bindCalendarForms() {
    document.getElementById("schoolCalendarForm")
        .addEventListener("submit", saveSchoolCalendar);

    document.getElementById("schoolEventForm")
        .addEventListener("submit", saveSchoolEvent);
}


async function saveSchoolCalendar(event) {
    event.preventDefault();

    const record = {
        recordId: document.getElementById("schoolRecordId").value,
        recordType: document.getElementById("schoolRecordType").value,
        termId: document.getElementById("schoolTermId").value.trim(),
        title: document.getElementById("schoolRecordTitle").value.trim(),
        category: document.getElementById("schoolRecordCategory").value.trim(),
        startDate: document.getElementById("schoolRecordStart").value,
        endDate: document.getElementById("schoolRecordEnd").value,
        venue: document.getElementById("schoolRecordVenue").value.trim(),
        description: document.getElementById("schoolRecordDescription").value.trim(),
        status: document.getElementById("schoolRecordStatus").value
    };

    try {
        const result = await calendarRequest(
            "saveSchoolCalendarRecord",
            { record }
        );

        if (!result.success) {
            alert(result.message);
            return;
        }

        document.getElementById("schoolCalendarDialog").close();

        alert(result.message);
        await loadCalendarData();

    } catch (error) {
        alert(error.message);
    }
}


/************************************************
 * EVENTS AND ACTIVITIES FORM
 ************************************************/

function openSchoolEventForm(event = null) {
    const form = document.getElementById("schoolEventForm");

    form.reset();

    document.getElementById("schoolEventFormTitle").textContent =
        event ? "Edit Event / Activity" : "Create Event / Activity";

    document.getElementById("schoolEventId").value =
        event?.eventId || "";

    document.getElementById("schoolEventTitle").value =
        event?.title || "";

    document.getElementById("schoolEventStart").value =
        toLocalDateTimeInput(event?.startDateTime);

    document.getElementById("schoolEventEnd").value =
        toLocalDateTimeInput(event?.endDateTime);

    document.getElementById("schoolEventVenue").value =
        event?.venue || "";

    document.getElementById("schoolEventDescription").value =
        event?.description || "";

    populateEventTermOptions(event?.termId || "");

    document.getElementById("schoolEventAudience").value =
        event?.audienceType || "ALL";

    document.getElementById("schoolEventTargets").value =
        (event?.audienceTargets || []).join(", ");

    document.getElementById("schoolEventStatus").value =
        event?.status || "DRAFT";

    document.getElementById("schoolEventDialog").showModal();
}


async function saveSchoolEvent(event) {
    event.preventDefault();

    const targets = document.getElementById("schoolEventTargets")
        .value.split(",")
        .map(value => value.trim())
        .filter(Boolean);

    const eventRecord = {
        eventId: document.getElementById("schoolEventId").value,
        termId: document.getElementById("schoolEventTerm").value,
        title: document.getElementById("schoolEventTitle").value.trim(),
        startDateTime: document.getElementById("schoolEventStart").value,
        endDateTime: document.getElementById("schoolEventEnd").value,
        venue: document.getElementById("schoolEventVenue").value.trim(),
        description: document.getElementById("schoolEventDescription").value.trim(),
        audienceType: document.getElementById("schoolEventAudience").value,
        audienceTargets: targets,
        status: document.getElementById("schoolEventStatus").value
    };

    try {
        const result = await calendarRequest(
            "saveSchoolEvent",
            { event: eventRecord }
        );

        if (!result.success) {
            alert(result.message);
            return;
        }

        document.getElementById("schoolEventDialog").close();

        alert(result.message);
        await loadCalendarData();

    } catch (error) {
        alert(error.message);
    }
}


/************************************************
 * DELETE RECORDS
 ************************************************/

async function deleteSchoolCalendar(recordId) {
    if (!confirm("Delete this School Calendar record?")) return;

    try {
        const result = await calendarRequest(
            "deleteSchoolCalendarRecord",
            { recordId }
        );

        alert(result.message);

        if (result.success) await loadCalendarData();

    } catch (error) {
        alert(error.message);
    }
}


async function deleteSchoolEvent(eventId) {
    if (!confirm("Delete this event or activity?")) return;

    try {
        const result = await calendarRequest(
            "deleteSchoolEvent",
            { eventId }
        );

        alert(result.message);

        if (result.success) await loadCalendarData();

    } catch (error) {
        alert(error.message);
    }
}
