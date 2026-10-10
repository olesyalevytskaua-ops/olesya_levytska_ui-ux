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
if (marquee && marqueeToggle) {
  const setPaused = paused => {
    marquee.dataset.paused = String(paused);
    marqueeToggle.setAttribute('aria-pressed', String(paused));
    marqueeToggle.textContent = paused ? 'Resume skills line' : 'Pause skills line';
  };
  marqueeToggle.addEventListener('click', () => setPaused(marquee.dataset.paused !== 'true'));
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
