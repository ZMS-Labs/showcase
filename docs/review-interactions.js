(() => {
  const depths = [...document.querySelectorAll('details.case-depth')];
  function targetFor(hash) {
    try { return document.getElementById(decodeURIComponent(hash.slice(1))); }
    catch { return null; }
  }
  function reveal(target) {
    let parent = target?.closest('details');
    while (parent) {
      parent.open = true;
      parent = parent.parentElement?.closest('details');
    }
  }
  const initial = targetFor(location.hash);
  depths.forEach(depth => { depth.open = !!initial && depth.contains(initial); });
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (anchor) reveal(targetFor(anchor.hash));
  });
  window.addEventListener('hashchange', () => reveal(targetFor(location.hash)));
})();
