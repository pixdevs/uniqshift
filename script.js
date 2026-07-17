// ===== Theme (dark default) =====
const html = document.documentElement;
const savedTheme = localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
html.setAttribute('data-theme', savedTheme);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobileViewportQuery = window.matchMedia('(max-width: 640px)');
const HEADER_OFFSET = 70;
const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

function isMobileViewport() {
    return mobileViewportQuery.matches;
}

function getHeaderOffset() {
    return HEADER_OFFSET;
}

function scrollToElement(element) {
    if (!element) return;
    const offsetPosition =
        element.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
    window.scrollTo({ top: offsetPosition, behavior: scrollBehavior });
}

function updateThemeToggleLabel(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    const isDark = theme === 'dark';
    themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

updateThemeToggleLabel(savedTheme);

// ===== Mobile Navigation =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const navLogoLink = document.querySelector('.nav__logo-link');

function setNavOpen(isOpen) {
    if (!navMenu || !navToggle) return;
    navMenu.classList.toggle('active', isOpen);
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        setNavOpen(!navMenu.classList.contains('active'));
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => setNavOpen(false));
    });

    if (navLogoLink) {
        navLogoLink.addEventListener('click', () => setNavOpen(false));
    }

    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            setNavOpen(false);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            setNavOpen(false);
            navToggle.focus();
        }
    });
}

// ===== Contact dialog =====
const contactDialog = document.getElementById('contact-dialog');
const contactOpenBtn = document.getElementById('contact-open-btn');
const contactCloseBtn = document.getElementById('contact-dialog-close');
let formSubmitTimeoutId = null;

function openContactDialog() {
    if (!contactDialog || typeof contactDialog.showModal !== 'function') return;
    if (!isMobileViewport()) return;
    if (!contactDialog.open) {
        contactDialog.showModal();
    }
}

function closeContactDialog() {
    if (!contactDialog || !contactDialog.open) return;
    contactDialog.close();
}

function resetFormSubmitState() {
    const formSubmit = document.getElementById('form-submit');
    if (!formSubmit) return;
    if (formSubmitTimeoutId) {
        clearTimeout(formSubmitTimeoutId);
        formSubmitTimeoutId = null;
    }
    formSubmit.textContent = 'Send Message';
    formSubmit.classList.remove('btn--success');
    formSubmit.disabled = false;
}

if (contactOpenBtn) {
    contactOpenBtn.addEventListener('click', () => openContactDialog());
}

if (contactCloseBtn) {
    contactCloseBtn.addEventListener('click', () => closeContactDialog());
}

if (contactDialog) {
    contactDialog.addEventListener('click', (e) => {
        if (e.target === contactDialog) {
            closeContactDialog();
        }
    });

    contactDialog.addEventListener('close', () => {
        hideFormError();
        resetFormSubmitState();
    });
}

mobileViewportQuery.addEventListener('change', (e) => {
    if (!e.matches) {
        closeContactDialog();
    }
});

function goToContact(e) {
    if (e) e.preventDefault();
    const contactSection = document.getElementById('contact');
    scrollToElement(contactSection);
    if (isMobileViewport()) {
        openContactDialog();
    }
}

function handleHashNavigation() {
    const hash = window.location.hash;
    if (!hash || hash === '#') return;

    if (hash === '#contact') {
        goToContact();
        return;
    }

    const targetElement = document.querySelector(hash);
    if (!targetElement) return;
    scrollToElement(targetElement);
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') {
            e.preventDefault();
            return;
        }

        if (targetId === '#contact') {
            goToContact(e);
            setNavOpen(false);
            return;
        }

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();
        scrollToElement(targetElement);
        setNavOpen(false);
    });
});

window.addEventListener('hashchange', handleHashNavigation);

// ===== Header scrolled class =====
const header = document.getElementById('header');

function updateHeaderScroll() {
    if (!header) return;
    header.classList.toggle('header--scrolled', window.pageYOffset > 100);
}

window.addEventListener('scroll', updateHeaderScroll, { passive: true });
updateHeaderScroll();

// ===== Active nav section =====
const sectionIds = ['home', 'about', 'why-choose-us', 'services', 'founder', 'contact'];
const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

const navObserver = new IntersectionObserver(
    (entries) => {
        const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!visible.length) return;

        const id = visible[0].target.id;
        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            const isActive = href === `#${id}`;
            link.classList.toggle('nav__link--active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    },
    {
        rootMargin: '-40% 0px -50% 0px',
        threshold: 0
    }
);

sections.forEach((section) => navObserver.observe(section));

// ===== Scroll reveal =====
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        });
    },
    {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    }
);

document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
});

// ===== Cursor glow (desktop only) =====
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (finePointer && !prefersReducedMotion) {
    let rafId = null;
    let latestX = 0;
    let latestY = 0;

    window.addEventListener(
        'pointermove',
        (e) => {
            latestX = e.clientX;
            latestY = e.clientY;
            document.body.classList.add('has-cursor-glow');

            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                document.documentElement.style.setProperty('--cursor-x', `${latestX}px`);
                document.documentElement.style.setProperty('--cursor-y', `${latestY}px`);
                rafId = null;
            });
        },
        { passive: true }
    );
}

// ===== Contact form =====
const contactForm = document.getElementById('contact-form');
const formError = document.getElementById('form-error');
const formSubmit = document.getElementById('form-submit');

function showFormError(message) {
    if (!formError) return;
    formError.hidden = false;
    formError.textContent = message;
}

function hideFormError() {
    if (!formError) return;
    formError.hidden = true;
    formError.textContent = '';
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideFormError();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        const name = (data.name || '').trim();
        const institution = (data.institution || '').trim();
        const message = (data.message || '').trim();

        if (!name || !institution || !message) {
            showFormError('Please fill in all required fields.');
            return;
        }

        if (!formSubmit) return;

        const originalText = formSubmit.textContent;
        formSubmit.textContent = 'Message Sent!';
        formSubmit.classList.add('btn--success');
        formSubmit.disabled = true;
        contactForm.reset();

        formSubmitTimeoutId = window.setTimeout(() => {
            formSubmit.textContent = originalText;
            formSubmit.classList.remove('btn--success');
            formSubmit.disabled = false;
            formSubmitTimeoutId = null;
            if (isMobileViewport()) {
                closeContactDialog();
            }
        }, 1800);
    });
}

// ===== Footer accordion (mobile) =====
const footerAccordions = document.querySelectorAll('.footer__accordion');
let wasMobileFooter = null;

function setFooterAccordionOpen(panel, open) {
    const btn = panel.querySelector('.footer__accordion-btn');
    panel.classList.toggle('is-open', open);
    if (btn) btn.setAttribute('aria-expanded', String(open));
}

function syncFooterAccordions() {
    const mobile = isMobileViewport();
    if (wasMobileFooter === mobile) return;
    wasMobileFooter = mobile;

    footerAccordions.forEach((panel) => {
        setFooterAccordionOpen(panel, !mobile);
    });
}

footerAccordions.forEach((panel) => {
    const btn = panel.querySelector('.footer__accordion-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        if (!isMobileViewport()) return;

        const willOpen = !panel.classList.contains('is-open');
        footerAccordions.forEach((other) => setFooterAccordionOpen(other, false));
        setFooterAccordionOpen(panel, willOpen);
    });
});

window.addEventListener('resize', syncFooterAccordions, { passive: true });
syncFooterAccordions();

// ===== Lazy load fallback =====
if (!('loading' in HTMLImageElement.prototype)) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ===== DOM ready init =====
document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('footer-year');
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            updateThemeToggleLabel(next);
        });
    }

    const floatingContact = document.getElementById('floating-contact');
    const floatingContactBtn = document.getElementById('floating-contact-btn');
    const floatingContactMenu = document.getElementById('floating-contact-menu');

    function setFloatingContactOpen(isOpen) {
        if (!floatingContact || !floatingContactBtn) return;
        floatingContact.classList.toggle('is-open', isOpen);
        floatingContactBtn.setAttribute('aria-expanded', String(isOpen));
    }

    if (floatingContact && floatingContactBtn) {
        floatingContactBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            setFloatingContactOpen(!floatingContact.classList.contains('is-open'));
        });

        if (floatingContactMenu) {
            floatingContactMenu.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', () => setFloatingContactOpen(false));
            });
        }

        document.addEventListener('click', (e) => {
            if (
                floatingContact.classList.contains('is-open') &&
                !floatingContact.contains(e.target)
            ) {
                setFloatingContactOpen(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape' || !floatingContact.classList.contains('is-open')) return;
            if (contactDialog && contactDialog.open) return;
            setFloatingContactOpen(false);
            floatingContactBtn.focus();
        });
    }

    if (window.location.hash) {
        handleHashNavigation();
    }
});
