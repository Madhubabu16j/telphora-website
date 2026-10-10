/**
 * Telphora — site interactions
 * Reveal-on-scroll, sticky nav state, mobile menu.
 * Compiled with `npm run build` (tsc) into ../js/main.js.
 */

const prefersReduced: boolean = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Sticky nav shadow on scroll ---------- */
const nav: HTMLElement | null = document.getElementById('nav');

function onScroll(): void {
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 12);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Mobile menu ---------- */
const toggle: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>('#navToggle');
const mobile: HTMLElement | null = document.getElementById('navMobile');

function setMenu(open: boolean): void {
  if (!toggle || !mobile) return;
  mobile.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

if (toggle && mobile) {
  toggle.addEventListener('click', (): void => {
    setMenu(!mobile.classList.contains('open'));
  });

  mobile.querySelectorAll<HTMLAnchorElement>('a').forEach((link: HTMLAnchorElement): void => {
    link.addEventListener('click', (): void => setMenu(false));
  });
}

/* ---------- Reveal on scroll ---------- */
const revealEls: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>('.reveal');

if (prefersReduced || !('IntersectionObserver' in window)) {
  revealEls.forEach((el: HTMLElement): void => el.classList.add('visible'));
} else {
  const observer: IntersectionObserver = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]): void => {
      entries.forEach((entry: IntersectionObserverEntry): void => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );

  revealEls.forEach((el: HTMLElement): void => observer.observe(el));
}
