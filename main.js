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
        const closeMenu = () => {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        };

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent document click from immediately closing
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
                if (navLinks.classList.contains('active')) {
                    closeMenu();
                }
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active')) {
                // If click is NOT inside navLinks and NOT the menu toggle
                if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                    closeMenu();
                }
            }
        });

        // Swipe Up to Close
        let touchStartY = 0;
        navLinks.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        navLinks.addEventListener('touchmove', (e) => {
            const touchEndY = e.touches[0].clientY;
            const diff = touchStartY - touchEndY;

            // If swiping UP significantly (> 50px)
            if (diff > 50) {
                closeMenu();
            }
        }, { passive: true });
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
            canImage: 'assets/product/realistic/stilly-blackberry-realistic-can.webp',
            accentColor: '#5d398c'
        },
        'cougar-juice': {
            id: 'cougar-juice',
            name: 'Cougar Juice',
            fruit: 'Black Cherry',
            description: 'Rich, bold accent with attitude.',
            canImage: 'assets/product/realistic/stilly-black-cherry-realistic-can.webp',
            accentColor: '#73273f'
        },
        'partymaker': {
            id: 'partymaker',
            name: 'Partymaker',
            fruit: 'Cranberry Lime',
            description: 'Energetic, social, always ready.',
            canImage: 'assets/product/realistic/stilly-cranberry-lime-realistic-can.webp',
            accentColor: '#ac203a'
        },
        'vibe-machine': {
            id: 'vibe-machine',
            name: 'Vibe Machine',
            fruit: 'Grapefruit',
            description: 'Bright, soft, modern citrus.',
            canImage: 'assets/product/realistic/stilly-grapefruit-realistic-can.webp',
            accentColor: '#f07e7a'
        },
        'fiesta-fuel': {
            id: 'fiesta-fuel',
            name: 'Fiesta Fuel',
            fruit: 'Lime',
            description: 'Fresh, crisp, unrestrained.',
            canImage: 'assets/product/realistic/stilly-lime-realistic-can.webp',
            accentColor: '#3b9a3b'
        },
        'the-fuzz': {
            id: 'the-fuzz',
            name: 'The Fuzz',
            fruit: 'Peach',
            description: 'Warm, playful, summer vibes.',
            canImage: 'assets/product/realistic/stilly-peach-realistic-can.webp',
            accentColor: '#f7aa8d'
        },
        'retox': {
            id: 'retox',
            name: 'Retox',
            fruit: 'Pineapple',
            description: 'Sunny, optimistic, essential.',
            canImage: 'assets/product/realistic/stilly-pineapple-realistic-can.webp',
            accentColor: '#fcd248'
        },
        'aiming-fluid': {
            id: 'aiming-fluid',
            name: 'Aiming Fluid',
            fruit: 'Tangerine',
            description: 'Sharp, energetic, precise.',
            canImage: 'assets/product/realistic/stilly-tangerine-realistic-can.webp',
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
    const showcaseWatermarkContainer = document.querySelector('.flavor-watermark-container');
    const showcaseWatermark = document.querySelector('.flavor-brand-watermark'); // Dynamic Watermark

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

            // Animate transition (Can + Text Elements)
            showcaseCan.classList.add('transitioning');
            showcaseFruit.classList.add('transitioning');
            showcaseName.classList.add('transitioning');
            showcaseDesc.classList.add('transitioning');
            document.querySelector('.flavor-icons-row').classList.add('transitioning');
            if (showcaseWatermarkContainer) showcaseWatermarkContainer.classList.add('transitioning');

            // After fade out (300ms), swap content and show CAN immediately
            setTimeout(() => {
                // Update text content (still hidden)
                showcaseName.textContent = flavor.name;
                showcaseFruit.textContent = flavor.fruit;
                showcaseDesc.textContent = flavor.description;

                // Update Watermark & Scale
                if (showcaseWatermark) {
                    showcaseWatermark.textContent = flavor.name;
                    scaleFlavorWatermark();
                }

                // Update can image
                showcaseCan.src = flavor.canImage;
                showcaseCan.alt = `${flavor.name} Can`;

                // Fade CAN back in immediately
                showcaseCan.classList.remove('transitioning');

                // Stagger TEXT fade in (wait additional 200ms)
                setTimeout(() => {
                    showcaseName.classList.remove('transitioning');
                    showcaseFruit.classList.remove('transitioning');
                    showcaseDesc.classList.remove('transitioning');
                    document.querySelector('.flavor-icons-row').classList.remove('transitioning');
                    if (showcaseWatermarkContainer) showcaseWatermarkContainer.classList.remove('transitioning');
                }, 200);

            }, 300);
        });
    }

    // Dynamic Watermark Scaling Function
    const scaleFlavorWatermark = () => {
        if (!showcaseWatermark) return;

        // 1. Reset scale to measure natural width accurately
        showcaseWatermark.style.transform = 'scale(1)';

        // 2. Measure rendered width
        const naturalWidth = showcaseWatermark.getBoundingClientRect().width;

        // Prevent errors if width is 0 (e.g. hidden)
        if (naturalWidth === 0) return;

        // 3. Calculate target width (92% of Viewport)
        const viewportWidth = window.innerWidth;
        const targetWidth = viewportWidth * 0.92;

        // 4. Determine scale factor
        const scaleFactor = targetWidth / naturalWidth;

        // 5. Apply scale
        showcaseWatermark.style.transform = `scale(${scaleFactor})`;
    };

    // Initial Scale (wait for fonts)
    if (document.fonts) {
        document.fonts.ready.then(scaleFlavorWatermark);
    } else {
        setTimeout(scaleFlavorWatermark, 100);
    }

    // Resize Listener
    window.addEventListener('resize', scaleFlavorWatermark);

    // Helper to add the class
    const style = document.createElement('style');
    style.innerHTML = `
        .in-view {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ================================================
    // PRELOAD IMAGES (Performance)
    // ================================================
    // Preload all flavor can images to ensure instant switching
    setTimeout(() => {
        Object.values(flavorData).forEach(flavor => {
            const img = new Image();
            img.src = flavor.canImage;
        });
    }, 1000); // Small delay to prioritize initial render

    // ================================================
    // MOBILE TOUCH POLISH (Interactive Elements)
    // ================================================
    const interactiveSelectors = [
        '.brand-lifestyle-img',
        '.showcase-can-image',
        '.vp-visual-content'
    ];

    document.addEventListener('click', (e) => {
        let clickedInteractive = false;

        interactiveSelectors.forEach(selector => {
            const target = e.target.closest(selector);
            if (target) {
                clickedInteractive = true;

                // Toggle current one
                if (target.classList.contains('mobile-interacting')) {
                    target.classList.remove('mobile-interacting');
                } else {
                    // Exclusive: Remove from all others first
                    document.querySelectorAll('.mobile-interacting').forEach(el => {
                        el.classList.remove('mobile-interacting');
                    });
                    target.classList.add('mobile-interacting');
                }
            }
        });

        // If clicked outside ANY interactive element, remove from all
        if (!clickedInteractive) {
            document.querySelectorAll('.mobile-interacting').forEach(el => {
                el.classList.remove('mobile-interacting');
            });
        }
    });

});
