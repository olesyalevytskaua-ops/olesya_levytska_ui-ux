'use strict';
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