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

const insightCarouselTriggers = [...document.querySelectorAll('[data-insight-carousel]')];
if (insightCarouselTriggers.length) {
  let previousCarouselFocus;
  let activeCarouselIndex = 0;
  const modal = document.createElement('div');
  modal.className = 'insight-modal';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="insight-modal__backdrop" data-insight-close></div>
    <section class="insight-modal__panel" role="dialog" aria-modal="true" aria-labelledby="insight-modal-title" tabindex="-1">
      <div class="insight-modal__top">
        <div>
          <p class="eyebrow">UX, EXPLAINED SIMPLY</p>
          <h2 id="insight-modal-title">Carousel</h2>
        </div>
        <button class="insight-modal__close" type="button" data-insight-close aria-label="Close carousel">×</button>
      </div>
      <div class="insight-modal__stage">
        <button class="insight-modal__nav" type="button" data-insight-prev aria-label="Previous slide">‹</button>
        <div class="insight-modal__track" tabindex="0" aria-label="Carousel slides"></div>
        <button class="insight-modal__nav" type="button" data-insight-next aria-label="Next slide">›</button>
      </div>
      <div class="insight-modal__footer">
        <span class="insight-modal__status" aria-live="polite">1 / 1</span>
      </div>
    </section>`;
  document.body.append(modal);

  const panel = modal.querySelector('.insight-modal__panel');
  const title = modal.querySelector('#insight-modal-title');
  const track = modal.querySelector('.insight-modal__track');
  const status = modal.querySelector('.insight-modal__status');
  const closeButtons = modal.querySelectorAll('[data-insight-close]');
  const previous = modal.querySelector('[data-insight-prev]');
  const next = modal.querySelector('[data-insight-next]');
  const focusableSelector = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';
  const focusable = () => [...modal.querySelectorAll(focusableSelector)].filter(el => el.offsetParent !== null);
  let dragStartX = 0;
  let dragStartScroll = 0;
  let isDraggingCarousel = false;

  const updateCarousel = () => {
    const slides = [...track.children];
    const current = slides.reduce((best, slide, index) => Math.abs(slide.offsetLeft - track.scrollLeft) < Math.abs(slides[best].offsetLeft - track.scrollLeft) ? index : best, 0);
    activeCarouselIndex = current;
    status.textContent = `${current + 1} / ${slides.length}`;
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
  };

  const moveCarousel = direction => {
    const slides = [...track.children];
    const nextIndex = Math.min(Math.max(activeCarouselIndex + direction, 0), slides.length - 1);
    slides[nextIndex]?.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest', inline: 'center'});
  };

  const closeInsightCarousel = () => {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', handleCarouselKeydown);
    previousCarouselFocus?.focus?.();
  };

  function handleCarouselKeydown(event) {
    if (event.key === 'Escape') {
      closeInsightCarousel();
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      moveCarousel(event.key === 'ArrowRight' ? 1 : -1);
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

  const openInsightCarousel = trigger => {
    const slides = trigger.dataset.carouselSlides.split(',').map(src => src.trim()).filter(Boolean);
    previousCarouselFocus = document.activeElement;
    title.textContent = trigger.dataset.carouselTitle || 'Carousel';
    track.innerHTML = slides.map((src, index) => `<figure class="insight-modal__slide"><img src="${src}" width="1080" height="1350" alt="${title.textContent} slide ${index + 1}" draggable="false"></figure>`).join('');
    activeCarouselIndex = 0;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', handleCarouselKeydown);
    requestAnimationFrame(() => {
      track.scrollLeft = 0;
      updateCarousel();
      panel.focus();
    });
  };

  insightCarouselTriggers.forEach(trigger => trigger.addEventListener('click', () => openInsightCarousel(trigger)));
  closeButtons.forEach(button => button.addEventListener('click', closeInsightCarousel));
  previous.addEventListener('click', () => moveCarousel(-1));
  next.addEventListener('click', () => moveCarousel(1));
  track.addEventListener('scroll', updateCarousel, {passive: true});
  track.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    isDraggingCarousel = true;
    dragStartX = event.clientX;
    dragStartScroll = track.scrollLeft;
    track.classList.add('is-dragging');
    track.setPointerCapture(event.pointerId);
  });
  track.addEventListener('pointermove', event => {
    if (!isDraggingCarousel) return;
    event.preventDefault();
    track.scrollLeft = dragStartScroll - (event.clientX - dragStartX);
  });
  const stopCarouselDrag = event => {
    if (!isDraggingCarousel) return;
    isDraggingCarousel = false;
    track.classList.remove('is-dragging');
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    updateCarousel();
  };
  track.addEventListener('pointerup', stopCarouselDrag);
  track.addEventListener('pointercancel', stopCarouselDrag);
  track.addEventListener('mouseleave', () => {
    isDraggingCarousel = false;
    track.classList.remove('is-dragging');
  });
}

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
