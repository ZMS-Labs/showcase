(() => {
  // Every walkthrough shows all of its step titles in a numbered strip. On wider screens one
  // step shows at a time, and the strip, Previous and Next move between steps. On phones every
  // step is stacked in order and the strip links to each one, so nothing waits behind a Next
  // button. Without JavaScript every step shows and there is no strip.
  const phone = window.matchMedia('(max-width: 720px)');
  const layouts = [];
  document.querySelectorAll('[data-walkthrough]').forEach((walk, w) => {
    const steps = [...walk.querySelectorAll('[data-walk-step]')];
    const controls = walk.querySelector('[data-walk-controls]');
    if (!steps.length || !controls) return;
    const previous = controls.querySelector('[data-walk-previous]');
    const next = controls.querySelector('[data-walk-next]');
    const status = controls.querySelector('[data-walk-status]');
    const base = walk.id || `walkthrough-${w + 1}`;
    const strip = document.createElement('ol');
    strip.className = 'walk-strip';
    strip.setAttribute('aria-label', 'Steps');
    const links = steps.map((step, i) => {
      if (!step.id) step.id = `${base}-step-${i + 1}`;
      const heading = step.querySelector('h3');
      // Some headings start with the step number and a separator. The strip shows its own
      // number, so drop that prefix, and the closing period.
      const title = (heading ? heading.textContent : '')
        .replace(/^\s*\d{1,2}\s*[^\w\s]\s*/, '')
        .replace(/\.\s*$/, '')
        .trim();
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${step.id}`;
      const number = document.createElement('span');
      number.className = 'walk-strip-number';
      number.textContent = String(i + 1).padStart(2, '0');
      const label = document.createElement('span');
      label.textContent = title || `Step ${i + 1}`;
      link.append(number, label);
      link.addEventListener('click', event => {
        if (phone.matches) {
          // The link jumps to the stacked step; remember it for a wider screen.
          current = i;
          return;
        }
        event.preventDefault();
        show(i, true);
      });
      item.append(link);
      strip.append(item);
      return link;
    });
    controls.before(strip);
    // A page's own written outline serves readers without JavaScript; the strip replaces it here.
    walk.querySelectorAll('.walk-outline').forEach(outline => { outline.hidden = true; });
    let current = Math.max(0, steps.findIndex(step => `#${step.id}` === location.hash));
    function show(index, focus) {
      current = index;
      steps.forEach((step, i) => { step.hidden = i !== index; });
      links.forEach((link, i) => {
        if (i === index) link.setAttribute('aria-current', 'step');
        else link.removeAttribute('aria-current');
      });
      previous.disabled = index === 0;
      next.disabled = index === steps.length - 1;
      status.textContent = `Step ${index + 1} of ${steps.length}`;
      const heading = steps[index].querySelector('h3');
      if (focus && heading) heading.focus({preventScroll: true});
    }
    function layout() {
      const stacked = phone.matches;
      walk.classList.toggle('is-stacked', stacked);
      controls.hidden = stacked;
      if (stacked) {
        steps.forEach(step => { step.hidden = false; });
        links.forEach(link => link.removeAttribute('aria-current'));
      } else {
        show(current, false);
      }
    }
    previous.addEventListener('click', () => show(Math.max(0, current - 1), true));
    next.addEventListener('click', () => show(Math.min(steps.length - 1, current + 1), true));
    window.addEventListener('hashchange', () => {
      const index = steps.findIndex(step => `#${step.id}` === location.hash);
      if (index >= 0 && !phone.matches) show(index, true);
    });
    layouts.push(layout);
    layout();
  });
  const relayout = () => layouts.forEach(layout => layout());
  if (phone.addEventListener) phone.addEventListener('change', relayout);
  else if (phone.addListener) phone.addListener(relayout);
})();
