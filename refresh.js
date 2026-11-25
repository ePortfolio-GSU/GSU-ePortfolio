/************************************************
 * GSU E-PORTFOLIO — SYSTEM-WIDE PULL TO REFRESH
 * Shared by login, dashboard and calendar pages.
 ************************************************/

(function () {
    "use strict";

    const PULL_REFRESH_THRESHOLD = 75;

    let touchStartY = 0;
    let pullDistance = 0;
    let pullAllowed = false;
    let refreshStarted = false;

    // Preserve each page's native scrolling behaviour.
    // Pull-to-refresh detection does not require changing
    // the page's overscroll settings.
    document.documentElement.style.removeProperty(
        "overscroll-behavior-y"
    );

    document.body.style.removeProperty(
        "overscroll-behavior-y"
    );

    function isInteractiveTarget(target) {
        return Boolean(target.closest(
            "input, textarea, select, button, a, " +
            "[contenteditable='true'], [role='dialog'], dialog[open]"
        ));
    }

    function isScrollable(element) {
        if (
            !element ||
            element === document.body ||
            element === document.documentElement
        ) {
            return false;
        }

        const style = window.getComputedStyle(element);
        const overflowY = style.overflowY;

        return (
            (overflowY === "auto" ||
             overflowY === "scroll" ||
             overflowY === "overlay") &&
            element.scrollHeight > element.clientHeight + 1
        );
    }

    function getScrollContainers(target) {
        const containers = [];
        let element = target;

        while (
            element &&
            element !== document.body &&
            element !== document.documentElement
        ) {
            if (isScrollable(element)) {
                containers.push(element);
            }

            element = element.parentElement;
        }

        const rootScroller = document.scrollingElement;

        if (
            rootScroller &&
            rootScroller.scrollHeight > rootScroller.clientHeight + 1
        ) {
            containers.push(rootScroller);
        }

        return containers;
    }

    function allScrollPositionsAtTop(containers) {
        return containers.every(function (element) {
            return element.scrollTop <= 0;
        });
    }

    // Detect the beginning of a downward gesture.
    document.addEventListener("touchstart", function (event) {

        if (refreshStarted || event.touches.length !== 1) {
            pullAllowed = false;
            return;
        }

        const target = event.target;

        if (!target || isInteractiveTarget(target)) {
            pullAllowed = false;
            return;
        }

        const containers = getScrollContainers(target);

        if (!allScrollPositionsAtTop(containers)) {
            pullAllowed = false;
            return;
        }

        touchStartY = event.touches[0].clientY;
        pullDistance = 0;
        pullAllowed = true;

    }, { passive: true, capture: true });


    // Track the downward movement.
    document.addEventListener("touchmove", function (event) {

        if (!pullAllowed || refreshStarted || event.touches.length !== 1) {
            return;
        }

        pullDistance =
            event.touches[0].clientY - touchStartY;

        if (pullDistance <= 0) {
            pullAllowed = false;
            return;
        }

        const containers = getScrollContainers(event.target);

        if (!allScrollPositionsAtTop(containers)) {
            pullAllowed = false;
        }

    }, { passive: true, capture: true });


    // Refresh immediately when the valid gesture is released.
    document.addEventListener("touchend", function () {

        if (
            pullAllowed &&
            !refreshStarted &&
            pullDistance >= PULL_REFRESH_THRESHOLD
        ) {
            refreshStarted = true;
            window.location.reload();
        }

        pullAllowed = false;
        touchStartY = 0;
        pullDistance = 0;

    }, { passive: true, capture: true });


    // Cancel incomplete gestures.
    document.addEventListener("touchcancel", function () {
        pullAllowed = false;
        touchStartY = 0;
        pullDistance = 0;
    }, { passive: true, capture: true });

})();
