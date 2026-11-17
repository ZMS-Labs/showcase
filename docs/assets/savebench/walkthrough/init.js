/* Mounts the SaveBench walkthrough player and lets the reader switch between dated versions. */
(function () {
  'use strict';
  var D = window.SaveBenchWalkthroughData, W = window.SaveBenchWalkthrough, el = document.getElementById('sbp-mount');
  if (!D || !W || !el) return;
  var now = document.getElementById('sbp-now'), picks = [].slice.call(document.querySelectorAll('.sbp-pick')), player = null;
  function show(date) {
    if (player) player.destroy();
    player = W.mount(el, D.scenes[date], { base: el.getAttribute('data-base') + date + '/' });
    picks.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === date)); });
    if (now) now.textContent = D.captions[date];
  }
  picks.forEach(function (b) {
    b.hidden = false;
    b.addEventListener('click', function () { show(b.getAttribute('data-v')); el.scrollIntoView({ block: 'nearest' }); });
  });
  show(el.getAttribute('data-current'));
})();
