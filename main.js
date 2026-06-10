document.addEventListener('DOMContentLoaded', () => {
    // Scroll header wrapper sticky behavior
    const headerWrapper = document.querySelector('.header-wrapper');
    if (headerWrapper) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                headerWrapper.classList.add('scrolled');
            } else {
                headerWrapper.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Run once on load
    }

    // Shared cursor hover state — used by cursor loop & dynamic elements (e.g. mood popup)
    let isHovering = false;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Two-way AXA-style scroll reveal effect
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" // Triggers slightly before it fully hits the bottom
    };

    const observer = new IntersectionObserver((entries) => {
        let delayCounter = 0;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Set staggered transition delay dynamically
                entry.target.style.transitionDelay = `${delayCounter * 120}ms`;
                
                // Add the class to trigger the smooth CSS transition
                entry.target.classList.add('reveal-active');
                delayCounter++;
                
                // Stop observing this element once it has been revealed to prevent scroll flickering
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply reveal effect to elements across all pages
    const revealElements = document.querySelectorAll(`
        .section-header, .bento-item, 
        .champions-top-line, .champ-col-left, .champ-col-mid, .champ-col-right, 
        .champ-img-large-wrapper, .champ-img-small-wrapper,
        .about-text, .stats, .contact-box,
        .resume-header-grid > div, .info-block, .what-i-do,
        .experience-section h3, .exp-card, 
        .collab-item, .mini-exp-card, .premium-card,
        .axa-image-card, .axa-about-container > div,
        .glass-hero-content, .glass-card, .glass-mid-text, .glass-scroll-indicator,
        .brutal-typo, .brutal-cards
    `);
    
    revealElements.forEach(el => {
        // Strip inline styles from previous implementation
        el.style.opacity = "";
        el.style.transform = "";
        el.style.transition = "";
        
        // Add the base reveal class
        el.classList.add('reveal');
        
        observer.observe(el);
    });

    // Search Feature
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            // Define searchable items on both pages
            const searchableItems = document.querySelectorAll('.bento-item, .exp-card, .collab-item, .mini-exp-card, .skills-list .pill');
            
            if (query === '') {
                // Reset visibility
                searchableItems.forEach(el => {
                    el.style.display = '';
                });
                return;
            }

            // Filter elements based on query matching their inner text
            searchableItems.forEach(el => {
                const text = el.textContent.toLowerCase();
                if (text.includes(query)) {
                    el.style.display = '';
                } else {
                    el.style.display = 'none';
                }
            });
        });
    }

    // Theme Toggle Logic
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
    }

    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            let theme = 'dark';
            if (document.body.classList.contains('light-theme')) {
                theme = 'light';
            }
            localStorage.setItem('theme', theme);
        });
    });

    // Mood Tracker Popup
    const showMoodTracker = () => {
        const moods = [
            { emoji: '😴', label: 'Tired',    score: 1, msg: 'Rest up! Great things come to refreshed minds. 💤' },
            { emoji: '😐', label: 'Meh',      score: 2, msg: 'Hang in there — something inspiring is just a scroll away. 🌱' },
            { emoji: '😊', label: 'Good',     score: 3, msg: 'Glad you\'re feeling good! Enjoy exploring my work. 🎨' },
            { emoji: '😄', label: 'Great',    score: 4, msg: 'That energy is contagious! Let\'s create something amazing. ✨' },
            { emoji: '🤩', label: 'Hyped',    score: 5, msg: 'Love the enthusiasm! You\'re in the right place. 🚀' },
        ];

        let selected = null;

        const popup = document.createElement('div');
        popup.className = 'mood-popup';
        popup.id = 'mood-popup';
        popup.setAttribute('role', 'dialog');
        popup.setAttribute('aria-label', 'Mood Tracker');

        popup.innerHTML = `
            <div class="mood-popup-inner" id="mood-form-area">
                <button class="mood-close" id="mood-close" aria-label="Close">&times;</button>
                <div class="mood-header">
                    <span class="mood-pulse"></span>
                    <span class="mood-label">Visitor Mood Check</span>
                </div>
                <p class="mood-question">How are you feeling today?</p>
                <p class="mood-subtext">Your vibe shapes the experience. Pick one ↓</p>
                <div class="mood-emojis" id="mood-emojis">
                    ${moods.map((m, i) => `
                        <button class="mood-btn" data-index="${i}" aria-label="${m.label}" title="${m.label}">
                            <span class="mood-emoji">${m.emoji}</span>
                            <span>${m.label}</span>
                        </button>
                    `).join('')}
                </div>
                <div class="mood-bar-wrap">
                    <div class="mood-bar-label">
                        <span>Mood Level</span>
                        <span id="mood-bar-pct">—</span>
                    </div>
                    <div class="mood-bar-track">
                        <div class="mood-bar-fill" id="mood-bar-fill"></div>
                    </div>
                </div>
                <button class="mood-submit" id="mood-submit">Share My Mood →</button>
            </div>
            <div class="mood-thankyou" id="mood-thankyou">
                <div class="mood-thankyou-icon" id="mood-ty-icon"></div>
                <h4 id="mood-ty-title">Thank you!</h4>
                <p id="mood-ty-msg"></p>
                <div class="mood-thankyou-bar">
                    <div class="mood-thankyou-bar-fill"></div>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        // Register popup buttons with custom cursor hover system
        if (window.innerWidth > 768) {
            const cursorEl = document.getElementById('custom-cursor');
            popup.querySelectorAll('button, .mood-btn').forEach(el => {
                el.addEventListener('mouseenter', () => { isHovering = true; cursorEl && cursorEl.classList.add('hovering'); });
                el.addEventListener('mouseleave', () => { isHovering = false; cursorEl && cursorEl.classList.remove('hovering'); });
            });
        }


        // Slide in after delay
        setTimeout(() => popup.classList.add('show'), 1800);

        const closePopup = () => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 700);
        };

        // Close button
        popup.querySelector('#mood-close').addEventListener('click', closePopup);

        // Mood button selection
        const moodBtns = popup.querySelectorAll('.mood-btn');
        const barFill   = popup.querySelector('#mood-bar-fill');
        const barPct    = popup.querySelector('#mood-bar-pct');
        const submitBtn = popup.querySelector('#mood-submit');

        moodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                moodBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selected = parseInt(btn.dataset.index);
                const score = moods[selected].score;
                const pct = (score / 5) * 100;
                barFill.style.width = pct + '%';
                barPct.textContent  = Math.round(pct) + '%';
                submitBtn.classList.add('active');
            });
        });

        // Submit
        submitBtn.addEventListener('click', () => {
            if (selected === null) return;
            const mood = moods[selected];

            // Save to localStorage
            localStorage.setItem('mood_last', mood.label);
            localStorage.setItem('mood_ts', Date.now());

            // Show thank-you
            popup.querySelector('#mood-form-area').style.display = 'none';
            const ty = popup.querySelector('#mood-thankyou');
            popup.querySelector('#mood-ty-icon').textContent  = mood.emoji;
            popup.querySelector('#mood-ty-title').textContent = `You're feeling ${mood.label}!`;
            popup.querySelector('#mood-ty-msg').textContent   = mood.msg;
            ty.classList.add('visible');

            // Auto-close after 3 s (bar animation duration)
            setTimeout(closePopup, 3200);
        });
    };


    // Page Loader Logic
    window.addEventListener('load', () => {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.visibility = 'hidden';
                showMoodTracker();
            }, 500);
        } else {
            showMoodTracker();
        }
    });

    // Custom Tennis Cursor Logic
    if (window.innerWidth > 768) {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        cursor.id = 'custom-cursor';
        // Inject SVG pointer + ball children
        cursor.innerHTML = `
            <svg class="cursor-pointer" width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1.5 L1.5 17 L5 12.5 L7.5 19 L10.5 17.8 L8 11.2 L13.5 11.2 Z"
                      fill="white" stroke="rgba(0,0,0,0.35)" stroke-width="1" stroke-linejoin="round"/>
            </svg>
            <div class="cursor-ball"></div>
        `;
        document.body.appendChild(cursor);

        const ball = cursor.querySelector('.cursor-ball');

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ballX = mouseX;
        let ballY = mouseY;
        let currentScale = 1.0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Add hover effect to interactive elements
        const interactables = document.querySelectorAll('a, button, input, textarea, select, .educaa-center-dome img, .bento-item');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => { isHovering = true; cursor.classList.add('hovering'); });
            el.addEventListener('mouseleave', () => { isHovering = false; cursor.classList.remove('hovering'); });
        });

        function animateCursor() {
            // Move pointer instantly (no delay)
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

            // Smoothly trail the ball (with physics/delay)
            ballX += (mouseX - ballX) * 0.32;
            ballY += (mouseY - ballY) * 0.32;

            // Calculate offset relative to container (ball defaults to bottom:0, right:0, meaning top-left is at 14px, 14px)
            const dx = (ballX - mouseX) - 14;
            const dy = (ballY - mouseY) - 14;

            // Interpolate scale in JS to avoid CSS transition conflicts
            const targetScale = isHovering ? 1.45 : 1.0;
            currentScale += (targetScale - currentScale) * 0.25;

            ball.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${currentScale})`;

            requestAnimationFrame(animateCursor);
        }

        // Start animation loop
        animateCursor();
    }


    // Hero Local Time — reads directly from user's system clock, no permission needed
    const userInfoEl = document.getElementById('hero-user-info');
    if (userInfoEl) {

        // Get user's IANA timezone from system (e.g. "Asia/Jakarta")
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Derive a short, readable timezone label (e.g. "Asia/Jakarta" → "Jakarta")
        const tzLabel = (() => {
            const parts = tz.split('/');
            return parts[parts.length - 1].replace(/_/g, ' ');
        })();

        // Get UTC offset string (e.g. "GMT+7")
        const getOffset = () => {
            const off = -new Date().getTimezoneOffset(); // minutes
            const h   = Math.floor(Math.abs(off) / 60);
            const m   = Math.abs(off) % 60;
            const sign = off >= 0 ? '+' : '-';
            return `GMT${sign}${h}${m ? ':' + String(m).padStart(2,'0') : ''}`;
        };

        const renderTime = () => {
            const now  = new Date();
            const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            userInfoEl.innerHTML =
                `<span style="opacity:0.65;">LOCAL TIME:</span> ` +
                `<strong style="color:#fff;">${time}</strong>` +
                `&nbsp;&nbsp;|&nbsp;&nbsp;` +
                `<span style="opacity:0.65;">TIMEZONE:</span> ` +
                `<strong style="color:#fff;">${tzLabel} (${getOffset()})</strong>`;
        };

        renderTime();
        setInterval(renderTime, 1000);
    }

});
