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

            if (typeof isPartnerDrawerOpen === 'function' && isPartnerDrawerOpen()) return;

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

const sectionIds = ['home', 'about', 'why-choose-us', 'services', 'partners', 'founder', 'impact', 'contact'];

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



function observeRevealElements(root = document) {
    root.querySelectorAll('.reveal').forEach((el) => {
        revealObserver.observe(el);
    });
}

observeRevealElements();



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



// ===== Dynamic sections =====

async function fetchJson(path) {

    const separator = path.includes('?') ? '&' : '?';

    const response = await fetch(`${path}${separator}t=${Date.now()}`, { cache: 'no-store' });

    if (!response.ok) {

        throw new Error(`Failed to load ${path}: ${response.status}`);

    }

    return response.json();

}



function formatPartnerType(type) {
    if (!type) return 'Partner';
    return type.charAt(0).toUpperCase() + type.slice(1);
}

let partnerDrawerLastFocus = null;
let partnerDrawerKeyHandler = null;
let partnerDrawerInitialized = false;

function getPartnerDrawerEls() {
    return {
        root: document.getElementById('partner-drawer'),
        overlay: document.getElementById('partner-drawer-overlay'),
        panel: document.getElementById('partner-drawer-panel'),
        closeBtn: document.getElementById('partner-drawer-close'),
        chip: document.getElementById('partner-drawer-chip'),
        logo: document.getElementById('partner-drawer-logo'),
        name: document.getElementById('partner-drawer-name'),
        aboutSection: document.getElementById('partner-drawer-about-section'),
        about: document.getElementById('partner-drawer-about'),
        testimonialsSection: document.getElementById('partner-drawer-testimonials-section'),
        testimonials: document.getElementById('partner-drawer-testimonials'),
        link: document.getElementById('partner-drawer-link')
    };
}

function isPartnerDrawerOpen() {
    const { root } = getPartnerDrawerEls();
    return Boolean(root && root.classList.contains('is-open'));
}

function closePartnerDrawer() {
    const { root, panel } = getPartnerDrawerEls();
    if (!root || !isPartnerDrawerOpen()) return;

    root.classList.remove('is-open');
    document.body.style.overflow = '';

    let finished = false;
    const finishHide = () => {
        if (finished) return;
        finished = true;
        root.hidden = true;
        if (partnerDrawerLastFocus && typeof partnerDrawerLastFocus.focus === 'function') {
            partnerDrawerLastFocus.focus();
        }
        partnerDrawerLastFocus = null;
    };

    if (prefersReducedMotion || !panel) {
        finishHide();
        return;
    }

    const onEnd = (event) => {
        if (event.target !== panel) return;
        panel.removeEventListener('transitionend', onEnd);
        finishHide();
    };
    panel.addEventListener('transitionend', onEnd);
    window.setTimeout(finishHide, 320);
}

function renderPartnerTestimonials(testimonials, container) {
    if (!container) return;

    container.replaceChildren();

    (testimonials || []).forEach((entry) => {
        if (!entry || !entry.quote) return;

        const item = document.createElement('li');
        item.className = 'partner-drawer__testimonial-item';

        const quote = document.createElement('blockquote');
        quote.className = 'partner-drawer__testimonial';
        quote.textContent = entry.quote;

        const attribution = document.createElement('div');
        attribution.className = 'partner-drawer__attribution';

        const person = document.createElement('span');
        person.className = 'partner-drawer__person';
        person.textContent = entry.person || '';

        const role = document.createElement('span');
        role.className = 'partner-drawer__role';
        role.textContent = entry.role || '';

        attribution.appendChild(person);
        attribution.appendChild(role);
        item.appendChild(quote);
        item.appendChild(attribution);
        container.appendChild(item);
    });
}

function openPartnerDrawer(item, triggerEl) {
    const els = getPartnerDrawerEls();
    if (!els.root || !els.panel || !item) return;

    partnerDrawerLastFocus = triggerEl || document.activeElement;

    els.chip.textContent = formatPartnerType(item.type);
    els.name.textContent = item.name || '';

    if (item.logo) {
        els.logo.hidden = false;
        els.logo.src = item.logo;
        els.logo.alt = item.name || '';
    } else {
        els.logo.hidden = true;
        els.logo.removeAttribute('src');
        els.logo.alt = '';
    }

    const aboutText = (item.about || '').trim();
    if (els.aboutSection && els.about) {
        if (aboutText) {
            els.about.textContent = aboutText;
            els.aboutSection.hidden = false;
        } else {
            els.about.textContent = '';
            els.aboutSection.hidden = true;
        }
    }

    const testimonials = Array.isArray(item.testimonials)
        ? item.testimonials.filter((entry) => entry && entry.quote)
        : [];

    if (els.testimonialsSection && els.testimonials) {
        renderPartnerTestimonials(testimonials, els.testimonials);
        els.testimonialsSection.hidden = testimonials.length === 0;
    }

    if (item.url) {
        els.link.hidden = false;
        els.link.href = item.url;
    } else {
        els.link.hidden = true;
        els.link.removeAttribute('href');
    }

    els.root.hidden = false;
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        els.root.classList.add('is-open');
        els.closeBtn?.focus();
    });
}

function initPartnerDrawer() {
    if (partnerDrawerInitialized) return;
    const { root, overlay, closeBtn, panel } = getPartnerDrawerEls();
    if (!root || !overlay || !closeBtn || !panel) return;

    partnerDrawerInitialized = true;

    closeBtn.addEventListener('click', () => closePartnerDrawer());
    overlay.addEventListener('click', () => closePartnerDrawer());

    partnerDrawerKeyHandler = (event) => {
        if (!isPartnerDrawerOpen()) return;

        if (event.key === 'Escape') {
            event.preventDefault();
            closePartnerDrawer();
            return;
        }

        if (event.key !== 'Tab') return;

        const focusable = panel.querySelectorAll(
            'button:not([disabled]), [href]:not([hidden]), [tabindex]:not([tabindex="-1"])'
        );
        const list = Array.from(focusable).filter((el) => !el.hasAttribute('hidden') && el.offsetParent !== null);
        if (!list.length) return;

        const first = list[0];
        const last = list[list.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    };

    document.addEventListener('keydown', partnerDrawerKeyHandler);
}

function createPartnerCard(item) {
    const listItem = document.createElement('li');
    listItem.className = 'partners__item reveal';

    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'partners__card';
    card.setAttribute('aria-haspopup', 'dialog');
    card.setAttribute('aria-label', `Open details for ${item.name}`);

    const top = document.createElement('div');
    top.className = 'partners__card-top';

    const copy = document.createElement('div');
    copy.className = 'partners__card-copy';

    const chip = document.createElement('span');
    chip.className = 'partners__chip';
    chip.textContent = formatPartnerType(item.type);
    copy.appendChild(chip);

    const name = document.createElement('h3');
    name.className = 'partners__name';
    name.textContent = item.name || '';
    copy.appendChild(name);

    const quote = document.createElement('p');
    quote.className = 'partners__quote';
    quote.textContent = item.quote || '';
    copy.appendChild(quote);

    top.appendChild(copy);

    const logoWrap = document.createElement('div');
    logoWrap.className = 'partners__logo-wrap';
    logoWrap.setAttribute('aria-hidden', 'true');

    if (item.logo) {
        const logo = document.createElement('img');
        logo.className = 'partners__logo';
        logo.src = item.logo;
        logo.alt = '';
        logo.loading = 'lazy';
        logoWrap.appendChild(logo);
    }

    top.appendChild(logoWrap);
    card.appendChild(top);

    card.addEventListener('click', () => {
        openPartnerDrawer(item, card);
    });

    listItem.appendChild(card);
    return listItem;
}

function renderPartners(data) {
    const title = document.querySelector('[data-partners-title]');
    const subtitle = document.querySelector('[data-partners-subtitle]');
    const grid = document.getElementById('partners-grid');

    if (!grid) return;

    initPartnerDrawer();

    if (title && data.title) {
        title.textContent = data.title;
    }

    if (subtitle && data.subtitle) {
        subtitle.textContent = data.subtitle;
    }

    grid.replaceChildren();

    (data.items || []).forEach((item) => {
        grid.appendChild(createPartnerCard(item));
    });

    observeRevealElements(grid.parentElement || grid);
}



function createImpactStat(stat) {

    const item = document.createElement('li');

    item.className = 'impact__stat reveal';

    item.innerHTML = `
        <span class="impact__stat-value">${stat.value}</span>
        <span class="impact__stat-label">${stat.label}</span>
    `;

    return item;

}



function createImpactSlide(slide, index, total) {

    const item = document.createElement('li');

    item.className = 'carousel__slide';

    item.setAttribute('aria-roledescription', 'slide');

    item.setAttribute('aria-label', `${index + 1} of ${total}`);

    item.innerHTML = `
        <figure class="carousel__figure">
            <img src="${slide.image}" alt="${slide.alt}" class="carousel__image" loading="lazy">
            <figcaption class="carousel__caption">
                <span class="carousel__caption-title">${slide.caption}</span>
                <span class="carousel__caption-detail">${slide.detail || ''}</span>
            </figcaption>
        </figure>
    `;

    return item;

}



function initCarousel(root) {

    if (!root) return;

    const track = root.querySelector('.carousel__track');

    const dotsWrap = root.querySelector('.carousel__dots');

    const prevBtn = root.querySelector('.carousel__btn--prev');

    const nextBtn = root.querySelector('.carousel__btn--next');

    const slides = Array.from(root.querySelectorAll('.carousel__slide'));

    if (!track || !dotsWrap || !prevBtn || !nextBtn || !slides.length) return;

    let currentIndex = 0;

    let pointerStartX = null;

    const dots = slides.map((_, index) => {

        const dot = document.createElement('button');

        dot.type = 'button';

        dot.className = 'carousel__dot';

        dot.setAttribute('role', 'tab');

        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);

        dot.addEventListener('click', () => {

            goToSlide(index);

        });

        dotsWrap.appendChild(dot);

        return dot;

    });

    function goToSlide(index) {

        currentIndex = (index + slides.length) % slides.length;

        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        slides.forEach((slide, slideIndex) => {

            const isActive = slideIndex === currentIndex;

            slide.classList.toggle('is-active', isActive);

            slide.setAttribute('aria-hidden', String(!isActive));

        });

        dots.forEach((dot, dotIndex) => {

            const isActive = dotIndex === currentIndex;

            dot.classList.toggle('is-active', isActive);

            dot.setAttribute('aria-selected', String(isActive));

            dot.tabIndex = isActive ? 0 : -1;

        });

    }

    prevBtn.addEventListener('click', () => {

        goToSlide(currentIndex - 1);

    });

    nextBtn.addEventListener('click', () => {

        goToSlide(currentIndex + 1);

    });

    root.addEventListener('keydown', (event) => {

        if (event.key === 'ArrowLeft') {

            event.preventDefault();

            goToSlide(currentIndex - 1);

        }

        if (event.key === 'ArrowRight') {

            event.preventDefault();

            goToSlide(currentIndex + 1);

        }

    });

    root.addEventListener('pointerdown', (event) => {

        pointerStartX = event.clientX;

    });

    root.addEventListener('pointerup', (event) => {

        if (pointerStartX === null) return;

        const deltaX = event.clientX - pointerStartX;

        pointerStartX = null;

        if (Math.abs(deltaX) < 40) return;

        if (deltaX > 0) {

            goToSlide(currentIndex - 1);

        } else {

            goToSlide(currentIndex + 1);

        }

    });

    goToSlide(0);

}



function renderImpact(data) {

    const title = document.querySelector('[data-impact-title]');

    const subtitle = document.querySelector('[data-impact-subtitle]');

    const stats = document.getElementById('impact-stats');

    const track = document.getElementById('fame-carousel-track');

    const dots = document.getElementById('fame-carousel-dots');

    const carousel = document.getElementById('fame-carousel');

    if (!stats || !track || !dots || !carousel) return;

    if (title && data.title) {

        title.textContent = data.title;

    }

    if (subtitle && data.subtitle) {

        subtitle.textContent = data.subtitle;

    }

    stats.replaceChildren();

    track.replaceChildren();

    dots.replaceChildren();

    (data.stats || []).forEach((stat) => {

        stats.appendChild(createImpactStat(stat));

    });

    const slides = data.slides || [];

    slides.forEach((slide, index) => {

        track.appendChild(createImpactSlide(slide, index, slides.length));

    });

    observeRevealElements(carousel.parentElement || carousel);

    initCarousel(carousel);

}



async function loadDynamicSections() {

    try {

        const [partnersData, impactData] = await Promise.all([

            fetchJson('./data/partners.json'),

            fetchJson('./data/impact.json')

        ]);

        renderPartners(partnersData);

        renderImpact(impactData);

    } catch (error) {

        console.warn('Dynamic section data failed to load.', error);

    }

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

            if (isPartnerDrawerOpen()) return;

            setFloatingContactOpen(false);

            floatingContactBtn.focus();

        });

    }



    loadDynamicSections();
    initPartnerDrawer();

    if (window.location.hash) {

        handleHashNavigation();

    }

});


