/* MeasuredCup embed auto-resizer. Optional: the iframe works at a fixed height without it. */
(function () {
  function frames() {
    return document.querySelectorAll('iframe[data-measuredcup]');
  }

  // Ask each embed to report its height (covers the case where this script loads
  // after the iframe already sent its first height message).
  function requestAll() {
    var list = frames();
    for (var i = 0; i < list.length; i++) {
      try {
        list[i].contentWindow.postMessage({ measuredcup: 'request' }, '*');
      } catch (e) {
        /* not ready yet */
      }
    }
  }

  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || d.measuredcup !== 'height' || typeof d.height !== 'number' || !d.slug) return;
    var list = frames();
    for (var i = 0; i < list.length; i++) {
      var src = list[i].getAttribute('src') || '';
      if (src.indexOf('/embed' + d.slug) !== -1) {
        list[i].style.height = d.height + 'px';
      }
    }
  });

  var list = frames();
  for (var i = 0; i < list.length; i++) {
    list[i].addEventListener('load', requestAll);
  }
  requestAll();
})();
