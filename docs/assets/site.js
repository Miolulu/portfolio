(function () {
  // 截图灯箱
  var lb = document.createElement('div');
  lb.className = 'lb';
  lb.innerHTML = '<img alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">';
  document.body.appendChild(lb);
  var img = lb.querySelector('img');

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t.tagName === 'IMG' && t.closest('.gallery, .phones')) {
      img.src = t.currentSrc || t.src;
      lb.classList.add('on');
      document.body.style.overflow = 'hidden';
    } else if (t === lb || t === img) {
      lb.classList.remove('on');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lb.classList.contains('on')) {
      lb.classList.remove('on');
      document.body.style.overflow = '';
    }
  });

  // 平滑滚动（尊重系统偏好）
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (ev) {
        var id = a.getAttribute('href');
        var el = id && id.length > 1 && document.querySelector(id);
        if (!el) return;
        ev.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }
})();
