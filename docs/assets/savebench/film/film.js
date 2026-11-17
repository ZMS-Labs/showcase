(function () {
  var link = document.querySelector('[data-sb-film]');
  if (!link) return;
  link.addEventListener('click', function (event) {
    event.preventDefault();
    var video = document.createElement('video');
    var image = link.querySelector('img');
    video.controls = true;
    video.playsInline = true;
    video.muted = true;
    video.autoplay = true;
    if (image) video.poster = image.src;
    video.src = link.href;
    video.setAttribute('aria-label', link.getAttribute('data-label') || 'Film');
    video.style.cssText = 'width:100%;height:auto;display:block;background:#000';
    link.replaceWith(video);
    video.focus();
  });
})();
