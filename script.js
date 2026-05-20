// Opening panel slide-up + navbar colour
(function () {
    var header = document.querySelector('header');
    var panel = document.querySelector('.opening-panel');
    var newsletter = document.querySelector('.newsletter-section');
    if (!header) return;

    var splitHeroInner = document.querySelector('.split-hero-inner');

    function updatePanel() {
        var onDark = newsletter && newsletter.getBoundingClientRect().top < window.innerHeight;

        if (panel) {
            var y = window.scrollY;
            var panelH = panel.offsetHeight;
            panel.style.transform = 'translateY(-' + Math.min(y, panelH) + 'px)';
            var panelBottom = panel.getBoundingClientRect().bottom;
            onDark = onDark || panelBottom > 88;

            // On mobile: after the opening panel is gone, scroll the split-hero inner
            // to transition from the image section to the text section
            if (splitHeroInner && window.innerWidth < 768) {
                var innerScroll = Math.min(Math.max(0, y - panelH), panelH);
                splitHeroInner.style.transform = 'translateY(-' + innerScroll + 'px)';
            } else if (splitHeroInner) {
                splitHeroInner.style.transform = '';
            }
        }

        if (onDark) {
            header.classList.add('header-graphite');
        } else {
            header.classList.remove('header-graphite');
        }
    }

    updatePanel();
    window.addEventListener('scroll', updatePanel, { passive: true });
}());

// Scroll reveal
(function () {
    const selectors = [
        '.section-title', '.right-panel p',
        '.team-card',
        '.servicos-title', '.servicos-text p', '.cta-button',
        '.contact-title', '.contact-form',
        '.newsletter-title', '.newsletter-subtitle', '.newsletter-form',
    ];

    selectors.forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (el) {
            el.classList.add('reveal');
        });
    });

    // Stagger team cards
    document.querySelectorAll('.team-card').forEach(function (el, i) {
        el.style.transitionDelay = (i * 0.15) + 's';
    });

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(function (el) {
        observer.observe(el);
    });
}());

if (document.querySelector('.contact-title')) {
    window.addEventListener('load', function () {
        const title = document.querySelector('.contact-title');
        const offset = title.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top: offset, behavior: 'instant' });
    });
}

function subscribeNewsletter(e) {
    e.preventDefault();
    const form = e.target;
    const email = encodeURIComponent(form.querySelector('input[type="email"]').value);
    const name = encodeURIComponent(form.querySelector('input[type="text"]').value);
    window.open('https://mbretaildesign.substack.com/subscribe?email=' + email + '&first_name=' + name, '_blank');
}

function scrollToSobre() {
    var panel = document.querySelector('.opening-panel');
    var target = panel ? panel.offsetHeight : Math.round(window.innerHeight * 0.7);
    window.scrollTo({ top: target, behavior: 'smooth' });
}

// Handle Sobre nav links on this page (href="#sobre")
document.querySelectorAll('a[href="#sobre"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        var mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) mobileMenu.style.display = 'none';
        scrollToSobre();
    });
});

// Auto-scroll when arriving from another page via index.html#sobre
if (window.location.hash === '#sobre') {
    window.history.replaceState(null, '', window.location.pathname);
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            scrollToSobre();
        });
    });
}

// Mobile menu toggle
function toggleMenu() {
    const mobileMenu = document.getElementById("mobile-menu");
    mobileMenu.style.display = mobileMenu.style.display === "block" ? "none" : "block";
}

function closeMenu() {
    document.getElementById("mobile-menu").style.display = "none";
}

// Portfolio carousel
(function () {
    var track = document.querySelector('.carousel-track');
    if (!track) return;

    var slides = track.querySelectorAll('.carousel-slide');
    var dotsContainer = document.querySelector('.carousel-dots');
    var current = 0;
    var total = slides.length;
    var autoTimer;

    // Build dots
    slides.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Slide ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); resetAuto(); });
        dotsContainer.appendChild(dot);
    });

    function goTo(index) {
        current = (index + total) % total;
        track.style.transform = 'translateX(-' + current * 100 + '%)';
        dotsContainer.querySelectorAll('.carousel-dot').forEach(function (d, i) {
            d.classList.toggle('active', i === current);
        });
    }

    function resetAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(function () { goTo(current + 1); }, 5000);
    }

    document.querySelector('.carousel-prev').addEventListener('click', function () { goTo(current - 1); resetAuto(); });
    document.querySelector('.carousel-next').addEventListener('click', function () { goTo(current + 1); resetAuto(); });

    // Swipe support
    var startX = 0;
    track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
        var diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) { goTo(current + (diff > 0 ? 1 : -1)); resetAuto(); }
    }, { passive: true });

    resetAuto();
}());

// Accordion
(function () {
    document.querySelectorAll('.accordion-trigger').forEach(function (trigger) {
        trigger.addEventListener('click', function () {
            var item = this.closest('.accordion-item');
            var isOpen = item.classList.contains('open');
            document.querySelectorAll('.accordion-item.open').forEach(function (el) {
                el.classList.remove('open');
            });
            if (!isOpen) item.classList.add('open');
        });
    });
}());

// Cookie consent
(function () {
    var cookieBanner = document.getElementById("cookie-banner");
    var acceptAllButton = document.getElementById("accept-all");
    var declineAllButton = document.getElementById("decline-all");
    var customiseButton = document.getElementById("customise");
    var preferenceModal = document.getElementById("preference-modal");
    var savePreferencesButton = document.getElementById("save-preferences");
    var preferenceAcceptAllButton = document.getElementById("preference-accept-all");

    var performanceCheckbox = document.getElementById("performance");
    var functionalCheckbox = document.getElementById("functional");
    var targetingCheckbox = document.getElementById("targeting");

    if (!cookieBanner) return;

    var consentAccepted = {
        ad_storage: "granted",
        analytics_storage: "granted",
        personalization_storage: "granted",
        functionality_storage: "granted",
        security_storage: "granted"
    };

    var consentDeclined = {
        ad_storage: "denied",
        analytics_storage: "denied",
        personalization_storage: "denied",
        functionality_storage: "denied",
        security_storage: "granted"
    };

    function getSavedConsent() {
        var saved = localStorage.getItem("consentMode");
        if (!saved) return null;
        try {
            return JSON.parse(saved);
        } catch (e) {
            localStorage.removeItem("consentMode");
            return null;
        }
    }

    function saveConsent(consentMode) {
        localStorage.setItem("consentMode", JSON.stringify(consentMode));
        if (typeof gtag === "function") gtag("consent", "update", consentMode);
        if (cookieBanner) cookieBanner.style.display = "none";
        if (preferenceModal) preferenceModal.style.display = "none";
    }

    function showBanner() {
        if (cookieBanner) cookieBanner.style.display = "flex";
    }

    function hideBanner() {
        if (cookieBanner) cookieBanner.style.display = "none";
    }

    function openPreferences() {
        if (preferenceModal) preferenceModal.style.display = "flex";
        hideBanner();
        var consent = getSavedConsent();
        if (!consent) return;
        if (performanceCheckbox) performanceCheckbox.checked = consent.analytics_storage === "granted";
        if (functionalCheckbox) functionalCheckbox.checked = consent.functionality_storage === "granted";
        if (targetingCheckbox) targetingCheckbox.checked = consent.ad_storage === "granted" && consent.personalization_storage === "granted";
    }

    function closePreferences() {
        if (preferenceModal) preferenceModal.style.display = "none";
        if (!getSavedConsent()) showBanner();
    }

    function saveCustomPreferences() {
        saveConsent({
            analytics_storage: performanceCheckbox && performanceCheckbox.checked ? "granted" : "denied",
            functionality_storage: functionalCheckbox && functionalCheckbox.checked ? "granted" : "denied",
            ad_storage: targetingCheckbox && targetingCheckbox.checked ? "granted" : "denied",
            personalization_storage: targetingCheckbox && targetingCheckbox.checked ? "granted" : "denied",
            security_storage: "granted"
        });
    }

    if (getSavedConsent()) {
        hideBanner();
    } else {
        showBanner();
    }

    if (acceptAllButton) acceptAllButton.addEventListener("click", function () { saveConsent(consentAccepted); });
    if (declineAllButton) declineAllButton.addEventListener("click", function () { saveConsent(consentDeclined); });
    if (customiseButton) customiseButton.addEventListener("click", openPreferences);
    if (savePreferencesButton) savePreferencesButton.addEventListener("click", saveCustomPreferences);
    if (preferenceAcceptAllButton) preferenceAcceptAllButton.addEventListener("click", function () { saveConsent(consentAccepted); });

    if (preferenceModal && !preferenceModal.querySelector(".preference-modal-close")) {
        var closeBtn = document.createElement("button");
        closeBtn.innerHTML = "&times;";
        closeBtn.className = "preference-modal-close";
        closeBtn.setAttribute("aria-label", "Close preferences");
        closeBtn.addEventListener("click", closePreferences);
        preferenceModal.querySelector(".preference-box").appendChild(closeBtn);
    }
}());
