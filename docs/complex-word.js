// "complex" → simple: letters start scattered, then snap into alignment once.
// Fine pointers can replay it on hover. No focus/tap handling: the word is not a control.
(() => {
  const el = document.querySelector('[data-complex-word]');
  if (!el) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) return; // plain text stays as authored

  const word = el.textContent.trim();
  // Hand-tuned offsets in em, so the effect scales with the headline size
  const presets = [
    [-.09, -.2, -8, .55], [.07, .14, 6, .8], [-.04, -.1, -4, .7], [.1, .22, 9, .6],
    [-.03, -.28, -12, .75], [.08, .12, 5, .65], [-.07, -.16, 8, .8]
  ];

  // Keep the heading's accessible name intact while letters are split into spans
  const heading = el.closest('h1,h2,h3');
  if (heading && !heading.hasAttribute('aria-label')) {
    heading.setAttribute('aria-label', heading.innerText.replace(/\s+/g, ' ').trim());
  }
  const vis = document.createDocumentFragment();
  [...word].forEach((ch, i) => {
    const p = presets[i % presets.length];
    const l = document.createElement('span');
    l.className = 'complex-word__l';
    l.textContent = ch;
    l.style.cssText = `--x:${p[0]}em;--y:${p[1]}em;--r:${p[2]}deg;--o:${p[3]};--d:${i * 45}ms`;
    vis.append(l);
  });
  el.replaceChildren(vis);

  // Start scattered without a transition, then settle
  el.classList.add('is-instant', 'is-scattered');
  void el.offsetWidth;
  el.classList.remove('is-instant');

  let timer = setTimeout(() => el.classList.remove('is-scattered'), 700);

  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  el.addEventListener('pointerenter', () => {
    if (!fine.matches || reduce.matches) return;
    clearTimeout(timer);
    el.classList.add('is-scattered');
  });
  el.addEventListener('pointerleave', () => {
    clearTimeout(timer);
    el.classList.remove('is-scattered');
  });
  reduce.addEventListener?.('change', e => e.matches && el.classList.remove('is-scattered'));
})();
