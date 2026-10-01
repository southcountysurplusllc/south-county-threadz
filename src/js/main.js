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

    // Log page load for debugging
    console.log('South County Threadz website loaded');
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

                // Use native scroll behavior (smooth is in CSS)
                target.scrollIntoView({ behavior: 'smooth' });

                // Set focus to the target for accessibility
                if (target.tabIndex === -1) {
                    target.tabIndex = -1;
                }
                target.focus();
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

    function updateActiveLink() {
        let current = '';
        const viewportCenter = window.innerHeight / 2;
        let closestDistance = Infinity;

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const distance = Math.abs(sectionTop - viewportCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');

            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    // Update on scroll with throttling
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial call
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
