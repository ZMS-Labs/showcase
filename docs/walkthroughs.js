(() => {
  document.querySelectorAll('[data-walkthrough]').forEach(walk => {
    const steps = [...walk.querySelectorAll('[data-walk-step]')];
    const controls = walk.querySelector('[data-walk-controls]');
    if (!steps.length || !controls) return;
    const previous = controls.querySelector('[data-walk-previous]');
    const next = controls.querySelector('[data-walk-next]');
    const status = controls.querySelector('[data-walk-status]');
    let current = 0;
    function show(index, focus) {
      current = index;
      steps.forEach((step, i) => { step.hidden = i !== index; });
      previous.disabled = index === 0;
      next.disabled = index === steps.length - 1;
      status.textContent = `Step ${index + 1} of ${steps.length}`;
      if (focus) steps[index].querySelector('h3').focus({preventScroll: true});
    }
    previous.addEventListener('click', () => show(Math.max(0, current - 1), true));
    next.addEventListener('click', () => show(Math.min(steps.length - 1, current + 1), true));
    controls.hidden = false;
    show(0, false);
  });
})();
