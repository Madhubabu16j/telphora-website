"use strict";
/**
 * Telphora — site interactions (TypeScript)
 * Reveal-on-scroll, sticky nav, mobile menu, tabs, accordions, steppers.
 * Compiled with `npm run build` (tsc) into ../js/main.js.
 */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/* ---------- Sticky nav shadow on scroll ---------- */
const nav = document.getElementById('nav');
function onScroll() {
    if (!nav)
        return;
    nav.classList.toggle('scrolled', window.scrollY > 12);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
/* ---------- Mobile menu ---------- */
const toggle = document.querySelector('#navToggle');
const mobile = document.getElementById('navMobile');
function setMenu(open) {
    if (!toggle || !mobile)
        return;
    mobile.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
if (toggle && mobile) {
    toggle.addEventListener('click', () => {
        setMenu(!mobile.classList.contains('open'));
    });
    mobile.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setMenu(false));
    });
}
/* ---------- Active nav link (multi-page) ---------- */
const page = document.body.dataset.page;
if (page) {
    document
        .querySelectorAll('.nav-links a[data-nav], .nav-mobile a[data-nav]')
        .forEach((link) => {
        if (link.dataset.nav === page) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}
/* ---------- Tabs ---------- */
document.querySelectorAll('[data-tabs]').forEach((group) => {
    const buttons = group.querySelectorAll('[data-tab]');
    const panels = group.querySelectorAll('[data-tab-panel]');
    function selectTab(id) {
        buttons.forEach((btn) => {
            const active = btn.dataset.tab === id;
            btn.classList.toggle('active', active);
            btn.setAttribute('aria-selected', String(active));
        });
        panels.forEach((panel) => {
            const active = panel.dataset.tabPanel === id;
            panel.classList.toggle('active', active);
            panel.hidden = !active;
        });
    }
    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (btn.dataset.tab)
                selectTab(btn.dataset.tab);
        });
    });
    const first = buttons[0];
    if (first && first.dataset.tab)
        selectTab(first.dataset.tab);
});
/* ---------- Accordions (FAQ) ---------- */
document.querySelectorAll('[data-accordion]').forEach((group) => {
    const items = group.querySelectorAll('.acc-item');
    items.forEach((item) => {
        const btn = item.querySelector('.acc-btn');
        const panel = item.querySelector('.acc-panel');
        if (!btn || !panel)
            return;
        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            // Single-open behaviour within a group
            items.forEach((other) => {
                other.classList.remove('open');
                const otherBtn = other.querySelector('.acc-btn');
                const otherPanel = other.querySelector('.acc-panel');
                if (otherBtn)
                    otherBtn.setAttribute('aria-expanded', 'false');
                if (otherPanel)
                    otherPanel.hidden = true;
            });
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
                panel.hidden = false;
            }
        });
    });
});
/* ---------- Steppers (clickable steps) ---------- */
document.querySelectorAll('[data-stepper]').forEach((stepper) => {
    const steps = stepper.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.setAttribute('tabindex', '0');
        step.setAttribute('role', 'button');
        step.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
        if (index === 0)
            step.classList.add('active');
        const activate = () => {
            steps.forEach((s, i) => {
                s.classList.toggle('active', i === index);
                s.setAttribute('aria-pressed', String(i === index));
            });
        };
        step.addEventListener('click', activate);
        step.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate();
            }
        });
    });
});
/* ---------- Reveal on scroll ---------- */
const revealEls = document.querySelectorAll('.reveal');
if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('visible'));
}
else {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => observer.observe(el));
}
