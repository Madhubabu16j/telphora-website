/**
 * Telphora — site interactions (TypeScript)
 * Reveal-on-scroll, sticky nav, mobile menu, tabs, accordions, steppers.
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

/* ---------- Active nav link (multi-page) ---------- */
const page: string | undefined = document.body.dataset.page;
if (page) {
  document
    .querySelectorAll<HTMLAnchorElement>('.nav-links a[data-nav], .nav-mobile a[data-nav]')
    .forEach((link: HTMLAnchorElement): void => {
      if (link.dataset.nav === page) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
}

/* ---------- Tabs ---------- */
document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((group: HTMLElement): void => {
  const buttons: NodeListOf<HTMLButtonElement> = group.querySelectorAll<HTMLButtonElement>('[data-tab]');
  const panels: NodeListOf<HTMLElement> = group.querySelectorAll<HTMLElement>('[data-tab-panel]');

  function selectTab(id: string): void {
    buttons.forEach((btn: HTMLButtonElement): void => {
      const active: boolean = btn.dataset.tab === id;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    panels.forEach((panel: HTMLElement): void => {
      const active: boolean = panel.dataset.tabPanel === id;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
  }

  buttons.forEach((btn: HTMLButtonElement): void => {
    btn.addEventListener('click', (): void => {
      if (btn.dataset.tab) selectTab(btn.dataset.tab);
    });
  });

  const first: HTMLButtonElement | undefined = buttons[0];
  if (first && first.dataset.tab) selectTab(first.dataset.tab);
});

/* ---------- Accordions (FAQ) ---------- */
document.querySelectorAll<HTMLElement>('[data-accordion]').forEach((group: HTMLElement): void => {
  const items: NodeListOf<HTMLElement> = group.querySelectorAll<HTMLElement>('.acc-item');

  items.forEach((item: HTMLElement): void => {
    const btn: HTMLButtonElement | null = item.querySelector<HTMLButtonElement>('.acc-btn');
    const panel: HTMLElement | null = item.querySelector<HTMLElement>('.acc-panel');
    if (!btn || !panel) return;

    btn.addEventListener('click', (): void => {
      const isOpen: boolean = item.classList.contains('open');
      // Single-open behaviour within a group
      items.forEach((other: HTMLElement): void => {
        other.classList.remove('open');
        const otherBtn: HTMLButtonElement | null = other.querySelector<HTMLButtonElement>('.acc-btn');
        const otherPanel: HTMLElement | null = other.querySelector<HTMLElement>('.acc-panel');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        if (otherPanel) otherPanel.hidden = true;
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
document.querySelectorAll<HTMLElement>('[data-stepper]').forEach((stepper: HTMLElement): void => {
  const steps: NodeListOf<HTMLElement> = stepper.querySelectorAll<HTMLElement>('.step');

  steps.forEach((step: HTMLElement, index: number): void => {
    step.setAttribute('tabindex', '0');
    step.setAttribute('role', 'button');
    step.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
    if (index === 0) step.classList.add('active');

    const activate = (): void => {
      steps.forEach((s: HTMLElement, i: number): void => {
        s.classList.toggle('active', i === index);
        s.setAttribute('aria-pressed', String(i === index));
      });
    };

    step.addEventListener('click', activate);
    step.addEventListener('keydown', (e: KeyboardEvent): void => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });
});

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
