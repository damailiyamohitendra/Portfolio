/* js/fit-to-viewport.js */
(function () {
  const header = document.querySelector('header');
  const wrap = document.getElementById('siteWrap');
  if (!wrap || !header) return;

  function computeAndApply() {
    const headerH = Math.ceil(header.getBoundingClientRect().height || 0);
    const vh = window.innerHeight;
    // content height inside wrapper
    const contentH = Math.ceil(wrap.scrollHeight || wrap.getBoundingClientRect().height || 0);
    const totalNeeded = headerH + contentH;

    if (totalNeeded <= vh) {
      wrap.style.transform = 'none';
      wrap.style.height = 'auto';
      document.documentElement.classList.remove('scale-active');
      document.body.style.overflow = 'hidden';
      return;
    }

    const rawScale = vh / totalNeeded;
    const minScale = 0.55; // tweakable
    const scale = Math.max(minScale, Math.min(1, rawScale));

    wrap.style.transform = `scale(${scale})`;
    wrap.style.height = (contentH * scale) + 'px';
    document.documentElement.classList.add('scale-active');
    document.body.style.overflow = 'hidden';
  }

  let t = null;
  function schedule() {
    clearTimeout(t);
    t = setTimeout(computeAndApply, 80);
  }

  window.addEventListener('load', computeAndApply);
  window.addEventListener('resize', schedule);
  window.addEventListener('orientationchange', () => setTimeout(computeAndApply, 180));

  // expose for manual calls
  window.fitToViewport = computeAndApply;
})();
