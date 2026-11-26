/*******************************************************
 * GSU E-PORTFOLIO — CENTRAL NOTIFICATION ENGINE
 * Unified success, error, warning and information cards
 *******************************************************/

(function () {
    "use strict";

    const notificationIcons = {
        success: "✓",
        error: "!",
        warning: "⚠",
        info: "i"
    };

    const notificationTitles = {
        success: "OPERATION SUCCESSFUL",
        error: "OPERATION FAILED",
        warning: "ATTENTION REQUIRED",
        info: "SYSTEM INFORMATION"
    };

    let notificationContainer = null;

    function getContainer() {
        if (notificationContainer && document.body.contains(notificationContainer)) {
            return notificationContainer;
        }

        notificationContainer = document.createElement("div");
        notificationContainer.className = "gsu-notification-stack";
        notificationContainer.setAttribute("aria-label", "System notifications");
        notificationContainer.setAttribute("aria-live", "polite");

        document.body.appendChild(notificationContainer);

        return notificationContainer;
    }

    function show(message, type = "info", options = {}) {
        const normalizedType = Object.prototype.hasOwnProperty.call(
            notificationIcons,
            String(type).toLowerCase()
        ) ? String(type).toLowerCase() : "info";

        const container = getContainer();

        const card = document.createElement("section");
        card.className = "gsu-notification gsu-notification-" + normalizedType;
        card.setAttribute(
            "role",
            normalizedType === "error" ? "alert" : "status"
        );

        const icon = document.createElement("div");
        icon.className = "gsu-notification-icon";
        icon.textContent = notificationIcons[normalizedType];

        const content = document.createElement("div");
        content.className = "gsu-notification-content";

        const title = document.createElement("strong");
        title.className = "gsu-notification-title";
        title.textContent = options.title || notificationTitles[normalizedType];

        const description = document.createElement("p");
        description.className = "gsu-notification-message";
        description.textContent = String(message ?? "");

        const closeButton = document.createElement("button");
        closeButton.className = "gsu-notification-close";
        closeButton.type = "button";
        closeButton.setAttribute("aria-label", "Dismiss notification");
        closeButton.textContent = "×";

        const progress = document.createElement("div");
        progress.className = "gsu-notification-progress";

        const progressBar = document.createElement("span");
        progress.appendChild(progressBar);

        content.append(title, description);
        card.append(icon, content, closeButton, progress);
        container.appendChild(card);

        const defaultDuration = {
            success: 4800,
            error: 7500,
            warning: 6500,
            info: 5500
        };

        const duration = Number.isFinite(options.duration)
            ? Math.max(0, options.duration)
            : defaultDuration[normalizedType];

        let dismissalTimer = null;

        function dismiss() {
            if (!card.isConnected) return;

            clearTimeout(dismissalTimer);
            card.classList.add("gsu-notification-exit");

            card.addEventListener("animationend", () => {
                card.remove();
            }, { once: true });

            setTimeout(() => {
                if (card.isConnected) card.remove();
            }, 350);
        }

        closeButton.addEventListener("click", dismiss);

        if (duration > 0) {
            progressBar.style.animationDuration = duration + "ms";
            dismissalTimer = setTimeout(dismiss, duration);
        } else {
            progress.classList.add("gsu-notification-progress-hidden");
        }

        return {
            dismiss: dismiss,
            element: card
        };
    }

    window.GSUNotify = {
        show: show,

        success: (message, options = {}) =>
            show(message, "success", options),

        error: (message, options = {}) =>
            show(message, "error", options),

        warning: (message, options = {}) =>
            show(message, "warning", options),

        info: (message, options = {}) =>
            show(message, "info", options)
    };

})();
