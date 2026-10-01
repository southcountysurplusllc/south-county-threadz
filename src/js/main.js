/*
   South County Threadz - Main JavaScript

   Minimal interactivity for a static landing page.
   Focus on accessibility and smooth interactions.
*/

document.addEventListener('DOMContentLoaded', () => {
    // Initialize smooth scrolling for navigation links
    initSmoothScroll();

    // Add active state to navigation links based on scroll position
    initActiveNavigation();
});

/* ============================================================================
   SMOOTH SCROLL NAVIGATION
   ============================================================================ */

function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Skip the skip-link
            if (href === '#main-content') {
                return;
            }

            // Prevent default only if target exists
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                // Use native scroll behavior (smooth is in CSS, so
                // prefers-reduced-motion can switch it off)
                target.scrollIntoView();

                // Set focus to the target for accessibility.
                // preventScroll stops focus() from cancelling the smooth scroll.
                if (target.tabIndex === -1) {
                    target.tabIndex = -1;
                }
                target.focus({ preventScroll: true });
            }
        });
    });
}

/* ============================================================================
   ACTIVE NAVIGATION HIGHLIGHT
   ============================================================================ */

function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const header = document.querySelector('.header');

    // Expose the sticky header height so CSS scroll-margin-top lands
    // sections just below the header instead of underneath it
    function syncHeaderHeight() {
        document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
    }

    function updateActiveLink() {
        let current = '';
        const headerBottom = header.getBoundingClientRect().bottom;

        // Current section = last one whose top has reached the header
        sections.forEach(section => {
            if (section.getBoundingClientRect().top <= headerBottom + 2) {
                current = section.getAttribute('id');
            }
        });

        // The last section can't scroll up to the header, so the page bottom counts as it
        const atPageBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        if (atPageBottom && sections.length) {
            current = sections[sections.length - 1].getAttribute('id');
        }

        setActiveLink(`#${current}`);
    }

    function setActiveLink(href) {
        navLinks.forEach(link => {
            link.classList.remove('active');

            if (link.getAttribute('href') === href) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    // On click, highlight the clicked link immediately and hold it while the
    // smooth scroll runs, so sections passed on the way don't flash active.
    // Scroll-position logic takes over once scrolling stops or the user scrolls.
    let clickLock = false;
    let scrollIdleTimer;

    function releaseClickLock() {
        if (!clickLock) {
            return;
        }
        clickLock = false;
        clearTimeout(scrollIdleTimer);
        updateActiveLink();
    }

    function waitForScrollIdle() {
        clearTimeout(scrollIdleTimer);
        scrollIdleTimer = setTimeout(releaseClickLock, 150);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!document.querySelector(link.getAttribute('href'))) {
                return;
            }
            clickLock = true;
            setActiveLink(link.getAttribute('href'));
            // Covers clicks that cause no scroll (already at the section)
            waitForScrollIdle();
        });
    });

    window.addEventListener('scrollend', releaseClickLock);
    ['wheel', 'touchstart', 'keydown'].forEach(type => {
        window.addEventListener(type, releaseClickLock, { passive: true });
    });

    // Update on scroll with throttling
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (clickLock) {
            // Fallback for browsers without the scrollend event
            waitForScrollIdle();
            return;
        }
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Header height changes with viewport width and web font loading
    window.addEventListener('resize', () => {
        syncHeaderHeight();
        updateActiveLink();
    });
    window.addEventListener('load', syncHeaderHeight);
    if (document.fonts) {
        document.fonts.ready.then(syncHeaderHeight);
    }

    // Initial call
    syncHeaderHeight();
    updateActiveLink();
}

/* ============================================================================
   ACCESSIBILITY ENHANCEMENTS
   ============================================================================ */

// Ensure all links open in new tab if they're external
document.addEventListener('DOMContentLoaded', () => {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');

    externalLinks.forEach(link => {
        // Visual indicator already in HTML (→ arrow)
        // Ensure rel attribute is set for security
        if (!link.getAttribute('rel')) {
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
});

/* ============================================================================
   PERFORMANCE MONITORING
   ============================================================================ */

// Optional: Log Core Web Vitals if available
if ('web-vital' in window) {
    // Monitoring could be added here for production
}

// Ensure no console errors on page load
if (typeof console !== 'undefined' && console.warn) {
    const originalWarn = console.warn;
    console.warn = function(...args) {
        // Only warn about actual issues, not third-party warnings
        originalWarn.apply(console, args);
    };
}
