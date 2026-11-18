(function () {
  var links = document.querySelectorAll('[data-sb-film]');
  Array.prototype.forEach.call(links, function (link) {
    // The link plays the film in place, so it is announced as a button and named after its film.
    var label = link.getAttribute('data-label') || 'Film';
    var overlay = link.querySelector('span');
    var length = overlay ? (overlay.textContent.match(/\([^)]*\)/) || [''])[0] : '';
    link.setAttribute('role', 'button');
    link.setAttribute('aria-label', 'Play ' + label.charAt(0).toLowerCase() + label.slice(1) + (length ? ' ' + length : ''));
    link.addEventListener('keydown', function (event) {
      if (event.key === ' ' || event.key === 'Spacebar') { event.preventDefault(); link.click(); }
    });
    link.addEventListener('click', function (event) {
      event.preventDefault();
      var video = document.createElement('video');
      var image = link.querySelector('img');
      video.controls = true;
      video.playsInline = true;
      video.muted = true;
      video.autoplay = true;
      if (image) video.poster = image.currentSrc || image.src;
      video.src = link.href;
      video.setAttribute('aria-label', label);
      video.style.cssText = 'width:100%;height:auto;display:block;background:#000';
      link.replaceWith(video);
      video.focus();
    });
  });
})();
