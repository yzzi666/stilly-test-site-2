document.addEventListener('DOMContentLoaded', () => {

    // Select elements (Moved to top level of scope)
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Announcement Bar Logic
    const announcements = [
        "Free Shipping on Orders Over $50",
        "New Flavor Drop: Pineapple Retox",
        "Join the Squad & Get 10% Off"
    ];
    let currentAnnouncement = 0;
    const announcementText = document.getElementById('announcement-text');
    const prevBtn = document.querySelector('.announcement-nav.prev');
    const nextBtn = document.querySelector('.announcement-nav.next');

    if (announcementText && prevBtn && nextBtn) {
        const updateAnnouncement = () => {
            announcementText.style.opacity = '0';
            setTimeout(() => {
                announcementText.textContent = announcements[currentAnnouncement];
                announcementText.style.opacity = '1';
            }, 200);
        };

        prevBtn.addEventListener('click', () => {
            currentAnnouncement = (currentAnnouncement - 1 + announcements.length) % announcements.length;
            updateAnnouncement();
        });

        nextBtn.addEventListener('click', () => {
            currentAnnouncement = (currentAnnouncement + 1) % announcements.length;
            updateAnnouncement();
        });

        // AutoPlay
        setInterval(() => {
            currentAnnouncement = (currentAnnouncement + 1) % announcements.length;
            updateAnnouncement();
        }, 5000);
    }

    // Mobile Menu Toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            // Simply toggle the class, let CSS handle the rest
            navLinks.classList.toggle('active');

            const isOpen = navLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isOpen);

            // Toggle body scrolling
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu when link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // If mobile menu is open, close it
                if (navLinks.classList.contains('active')) {
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

    // Fade in elements - General (not flavor cards anymore)
    const generalElements = document.querySelectorAll('.benefit-item, .statement-text, .hero-content, .flavor-info, .flavor-can');

    generalElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });

    // ================================================
    // FLAVOR SHOWCASE - Interactive Selector
    // ================================================

    const flavorData = {
        'bonus-round': {
            id: 'bonus-round',
            name: 'Bonus Round',
            fruit: 'Blackberry',
            description: 'Deep, confident, premium vodka.',
            canImage: 'assets/product/stilly-blackberry-can.webp',
            accentColor: '#5d398c'
        },
        'cougar-juice': {
            id: 'cougar-juice',
            name: 'Cougar Juice',
            fruit: 'Black Cherry',
            description: 'Rich, bold accent with attitude.',
            canImage: 'assets/product/stilly-black-cherry-can.webp',
            accentColor: '#73273f'
        },
        'partymaker': {
            id: 'partymaker',
            name: 'Partymaker',
            fruit: 'Cranberry Lime',
            description: 'Energetic, social, always ready.',
            canImage: 'assets/product/stilly-cranberry-lime-can.webp',
            accentColor: '#ac203a'
        },
        'vibe-machine': {
            id: 'vibe-machine',
            name: 'Vibe Machine',
            fruit: 'Grapefruit',
            description: 'Bright, soft, modern citrus.',
            canImage: 'assets/product/stilly-grapefruit-can.webp',
            accentColor: '#f07e7a'
        },
        'fiesta-fuel': {
            id: 'fiesta-fuel',
            name: 'Fiesta Fuel',
            fruit: 'Lime',
            description: 'Fresh, crisp, unrestrained.',
            canImage: 'assets/product/stilly-lime-can.webp',
            accentColor: '#3b9a3b'
        },
        'the-fuzz': {
            id: 'the-fuzz',
            name: 'The Fuzz',
            fruit: 'Peach',
            description: 'Warm, playful, summer vibes.',
            canImage: 'assets/product/stilly-peach-can.webp',
            accentColor: '#f7aa8d'
        },
        'retox': {
            id: 'retox',
            name: 'Retox',
            fruit: 'Pineapple',
            description: 'Sunny, optimistic, essential.',
            canImage: 'assets/product/stilly-pineapple-can.webp',
            accentColor: '#fcd248'
        },
        'aiming-fluid': {
            id: 'aiming-fluid',
            name: 'Aiming Fluid',
            fruit: 'Tangerine',
            description: 'Sharp, energetic, precise.',
            canImage: 'assets/product/stilly-tangerine-can.webp',
            accentColor: '#f38018'
        }
    };

    // DOM Elements for Showcase
    const flavorShowcase = document.querySelector('.flavor-showcase');
    const flavorList = document.getElementById('flavor-list');
    const showcaseName = document.getElementById('showcase-name');
    const showcaseFruit = document.getElementById('showcase-fruit');
    const showcaseDesc = document.getElementById('showcase-desc');
    const showcaseCan = document.getElementById('showcase-can');

    if (flavorShowcase && flavorList) {
        // Event Delegation: Single listener on the list container
        flavorList.addEventListener('click', (e) => {
            const button = e.target.closest('.flavor-list-item');
            if (!button) return;

            const flavorId = button.dataset.flavor;
            const flavor = flavorData[flavorId];
            if (!flavor) return;

            // Don't re-select already active flavor
            if (button.classList.contains('active')) return;

            // Update active state in list
            flavorList.querySelectorAll('.flavor-list-item').forEach(item => {
                item.classList.remove('active');
            });
            button.classList.add('active');

            // Update accent color (CSS variable on section)
            flavorShowcase.style.setProperty('--accent-color', flavor.accentColor);

            // Animate can transition
            showcaseCan.classList.add('transitioning');

            // After fade out, swap content
            setTimeout(() => {
                // Update text content
                showcaseName.textContent = flavor.name;
                showcaseFruit.textContent = flavor.fruit;
                showcaseDesc.textContent = flavor.description;

                // Update can image
                showcaseCan.src = flavor.canImage;
                showcaseCan.alt = `${flavor.name} Can`;

                // Fade back in
                showcaseCan.classList.remove('transitioning');
            }, 300);
        });
    }

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
