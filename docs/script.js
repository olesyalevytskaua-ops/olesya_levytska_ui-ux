'use strict';

const root = document.documentElement;
const themeMeta = document.querySelector('meta[name="theme-color"]');
const themeToggle = document.querySelector('[data-theme-toggle]');

const setTheme = theme => {
  root.dataset.theme = theme;
  themeMeta?.setAttribute('content', theme === 'dark' ? '#17151c' : '#fbf8f4');
  if (themeToggle) {
    const dark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(dark));
    themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }
};

const savedTheme = localStorage.getItem('theme');
setTheme(savedTheme || root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeToggle?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  setTheme(next);
});

const marquee = document.querySelector('[data-marquee]');
const marqueeToggle = document.querySelector('[data-marquee-toggle]');
if (marquee) {
  const setPaused = paused => {
    marquee.dataset.paused = String(paused);
    if (marqueeToggle) {
      marqueeToggle.setAttribute('aria-pressed', String(paused));
      marqueeToggle.textContent = paused ? 'Resume skills line' : 'Pause skills line';
    }
  };
  marqueeToggle?.addEventListener('click', () => setPaused(marquee.dataset.paused !== 'true'));
  marquee.addEventListener('mouseenter', () => marquee.dataset.hover = 'true');
  marquee.addEventListener('mouseleave', () => marquee.dataset.hover = 'false');
  marquee.addEventListener('focusin', () => marquee.dataset.focus = 'true');
  marquee.addEventListener('focusout', () => marquee.dataset.focus = 'false');
  setPaused(false);
}

const carousel = document.querySelector('.carousel');
if (carousel) {
 const cards = [...carousel.children];
 const previous = document.querySelector('[data-prev]');
 const next = document.querySelector('[data-next]');
 const status = document.querySelector('.carousel-status');
 const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
 const position = () => cards.reduce((best, card, index) => Math.abs(card.offsetLeft - cards[0].offsetLeft - carousel.scrollLeft) < Math.abs(cards[best].offsetLeft - cards[0].offsetLeft - carousel.scrollLeft) ? index : best, 0);
 const update = () => {
  status.textContent = (position() + 1) + ' / ' + cards.length;
  previous.disabled = carousel.scrollLeft <= 2;
  next.disabled = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 2;
 };
 const move = direction => carousel.scrollBy({left: direction * (cards[0].getBoundingClientRect().width + 20), behavior: reducedMotion.matches ? 'instant' : 'smooth'});
 previous.addEventListener('click', () => move(-1));
 next.addEventListener('click', () => move(1));
 carousel.addEventListener('scroll', update, {passive:true});
 carousel.addEventListener('keydown', event => {
  if(event.key === 'ArrowRight' || event.key === 'ArrowLeft') {event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);}
 });
 window.addEventListener('resize', update);
 update();
}
document.querySelector('[data-print]')?.addEventListener('click', () => window.print());

const contactLinks = [...document.querySelectorAll('a[href="contact.html"]')];
if (contactLinks.length) {
  let previousFocus;
  const modal = document.createElement('div');
  modal.className = 'contact-modal';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="contact-modal__backdrop" data-contact-close></div>
    <section class="contact-modal__panel" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title" tabindex="-1">
      <button class="contact-modal__close" type="button" data-contact-close aria-label="Close contact dialog">×</button>
      <img class="contact-modal__portrait" src="images/olesya-portrait.png" width="1254" height="1254" alt="Olesya Levytska">
      <p class="eyebrow">LET'S CONNECT</p>
      <h2 id="contact-modal-title">Olesya Levytska</h2>
      <p class="contact-role">Senior Product Designer · UI/UX</p>
      <p class="contact-statement">Designing smarter products.<br>From insight to impact.</p>
      <div class="contact-modal__actions">
        <a class="button" href="mailto:olesyalevytskaua@gmail.com">Email me ↗</a>
        <a class="text-link" href="https://www.linkedin.com/in/olesya-levytska-321363193/">LinkedIn ↗</a>
      </div>
      <p class="contact-email"><a href="mailto:olesyalevytskaua@gmail.com">olesyalevytskaua@gmail.com</a></p>
      <p>Kyiv, Ukraine · Remote · Open to relocation</p>
    </section>`;
  document.body.append(modal);

  const panel = modal.querySelector('.contact-modal__panel');
  const closeButtons = modal.querySelectorAll('[data-contact-close]');
  const focusableSelector = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';
  const focusable = () => [...modal.querySelectorAll(focusableSelector)].filter(el => el.offsetParent !== null);

  const closeContactModal = () => {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', handleModalKeydown);
    previousFocus?.focus?.();
  };

  function handleModalKeydown(event) {
    if (event.key === 'Escape') {
      closeContactModal();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = focusable();
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const openContactModal = () => {
    previousFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', handleModalKeydown);
    requestAnimationFrame(() => (focusable()[0] || panel).focus());
  };

  contactLinks.forEach(link => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      openContactModal();
    });
  });
  closeButtons.forEach(button => button.addEventListener('click', closeContactModal));
}
