// ===== Theme (dark default) =====
const html = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

function updateThemeToggleLabel(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    const isDark = theme === 'dark';
    themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

function isMobileContact() {
    return window.matchMedia('(max-width: 640px)').matches;
}

// ===== Mobile Navigation =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');

function setNavOpen(isOpen) {
    navMenu.classList.toggle('active', isOpen);
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
}

navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setNavOpen(!navMenu.classList.contains('active'));
});

navLinks.forEach((link) => {
    link.addEventListener('click', () => setNavOpen(false));
});

document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        setNavOpen(false);
    }
});

// ===== Contact dialog =====
const contactDialog = document.getElementById('contact-dialog');
const contactOpenBtn = document.getElementById('contact-open-btn');
const contactCloseBtn = document.getElementById('contact-dialog-close');

function openContactDialog() {
    if (!contactDialog || typeof contactDialog.showModal !== 'function') return;
    if (!contactDialog.open) {
        contactDialog.showModal();
    }
}

function closeContactDialog() {
    if (!contactDialog || !contactDialog.open) return;
    contactDialog.close();
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
}

function goToContact(e) {
    if (e) e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const headerOffset = 70;
        const offsetPosition =
            contactSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    if (isMobileContact()) {
        openContactDialog();
    }
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;

        if (targetId === '#contact') {
            goToContact(e);
            setNavOpen(false);
            return;
        }

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();
        const headerOffset = 70;
        const offsetPosition =
            targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// ===== Header scrolled class =====
const header = document.getElementById('header');

function updateHeaderScroll() {
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
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
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
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

        if (!data.name || !data.institution || !data.message) {
            showFormError('Please fill in all required fields.');
            return;
        }

        const originalText = formSubmit.textContent;
        formSubmit.textContent = 'Message Sent!';
        formSubmit.classList.add('btn--success');
        formSubmit.disabled = true;
        contactForm.reset();

        setTimeout(() => {
            formSubmit.textContent = originalText;
            formSubmit.classList.remove('btn--success');
            formSubmit.disabled = false;
            if (isMobileContact()) {
                closeContactDialog();
            }
        }, 1800);
    });
}

// ===== Footer accordion (mobile) =====
const footerAccordions = document.querySelectorAll('.footer__accordion');
let wasMobileFooter = null;

function isMobileFooter() {
    return window.matchMedia('(max-width: 640px)').matches;
}

function setFooterAccordionOpen(panel, open) {
    const btn = panel.querySelector('.footer__accordion-btn');
    panel.classList.toggle('is-open', open);
    if (btn) btn.setAttribute('aria-expanded', String(open));
}

function syncFooterAccordions() {
    const mobile = isMobileFooter();
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
        if (!isMobileFooter()) return;

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

    updateThemeToggleLabel(savedTheme);

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

    if (floatingContact && floatingContactBtn) {
        floatingContactBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            floatingContact.classList.toggle('is-open');
            floatingContactBtn.setAttribute(
                'aria-expanded',
                String(floatingContact.classList.contains('is-open'))
            );
        });

        document.addEventListener('click', (e) => {
            if (
                floatingContact.classList.contains('is-open') &&
                !floatingContact.contains(e.target)
            ) {
                floatingContact.classList.remove('is-open');
                floatingContactBtn.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && floatingContact.classList.contains('is-open')) {
                floatingContact.classList.remove('is-open');
                floatingContactBtn.setAttribute('aria-expanded', 'false');
                floatingContactBtn.focus();
            }
        });
    }

    if (window.location.hash === '#contact' && isMobileContact()) {
        goToContact();
    }
});
