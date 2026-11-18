/* Mounts the SaveBench walkthrough player and lets the reader switch between dated versions. */
(function () {
  'use strict';
  var D = window.SaveBenchWalkthroughData, W = window.SaveBenchWalkthrough, el = document.getElementById('sbp-mount');
  if (!D || !W || !el) return;
  // The still that stands in until the player mounts is kept, hidden, once the player is in place.
  var still = el.querySelector('.sbp-fallback');
  var now = document.getElementById('sbp-now'), picks = [].slice.call(document.querySelectorAll('.sbp-pick')), player = null;
  function show(date) {
    if (player) player.destroy();
    player = W.mount(el, D.scenes[date], { base: el.getAttribute('data-base') + date + '/' });
    if (still) { still.hidden = true; el.appendChild(still); }
    picks.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === date)); });
    if (now) now.textContent = D.captions[date];
  }
  picks.forEach(function (b) {
    b.hidden = false;
    b.addEventListener('click', function () { show(b.getAttribute('data-v')); el.scrollIntoView({ block: 'nearest' }); });
  });
  // The player fetches its scene images when it mounts, so wait until the reader is near it.
  // Until then the lazy fallback still stands in the mount.
  var first = function () { if (!player) show(el.getAttribute('data-current')); };
  if (!('IntersectionObserver' in window)) { first(); return; }
  var watch = new IntersectionObserver(function (entries) {
    if (entries.some(function (e) { return e.isIntersecting; })) { watch.disconnect(); first(); }
  }, { rootMargin: '800px 0px' });
  watch.observe(el);
})();
