document.addEventListener('DOMContentLoaded', () => {

    // Select elements
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Mobile Menu Toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.contains('active');
            if (isOpen) {
                // Close
                navLinks.style.display = 'none';
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            } else {
                // Open
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'fixed';
                navLinks.style.top = '0';
                navLinks.style.left = '0';
                navLinks.style.width = '100vw';
                navLinks.style.height = '100vh';
                navLinks.style.background = '#000';
                navLinks.style.padding = '6rem 2rem';
                navLinks.style.zIndex = '99';
                navLinks.style.gap = '2rem';
                navLinks.style.fontSize = '2rem'; // Big links
                navLinks.classList.add('active');
                menuToggle.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });

        // Close menu when link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Only act if we are in mobile mode (menu is open/active)
                if (navLinks.classList.contains('active')) {
                    navLinks.style.display = ''; // Revert to CSS
                    navLinks.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // Intersection Observer for Animation
    const observerOptions = {
        threshold: 0.05, // Lower threshold to trigger as soon as any part is close
        rootMargin: "300px" // Trigger way earlier
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Fade in elements - SEPARATE LOGIC FOR CARDS
    const generalElements = document.querySelectorAll('.benefit-item, .statement-text, .hero-content');
    const flavorCards = document.querySelectorAll('.flavor-card');

    // 1. General Elements (Standard fade)
    generalElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });

    // 2. Flavor Cards (Strict sequential stagger)
    flavorCards.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)'; // Little more movement
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'; // Slightly faster

        // Strict index-based delay. 
        // 0, 0.1, 0.2, 0.3... regardless of other elements on page
        el.style.transitionDelay = `${(index % 4) * 0.15}s`;

        observer.observe(el);
    });

    // Helper to add the class
    const style = document.createElement('style');
    style.innerHTML = `
        .in-view {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

});
