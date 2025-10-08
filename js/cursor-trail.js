(function() {
  const container = document.getElementById("trail");

  const COLORS = ["#f40136", "#0c2043", "#ffffff"]; // red, blue, white

  const GROUPS = [
    { count: 16, baseSize: 18, gap: 8,  easing: 0.22, opacity: 0.9 },
    { count: 14, baseSize: 14, gap: 7,  easing: 0.18, opacity: 0.85 },
    { count: 12, baseSize: 12, gap: 6,  easing: 0.14, opacity: 0.8 },
    { count: 10, baseSize: 20, gap: 10, easing: 0.1,  opacity: 0.75 },
    { count: 8,  baseSize: 24, gap: 12, easing: 0.08, opacity: 0.7 },
    { count: 6,  baseSize: 30, gap: 16, easing: 0.06, opacity: 0.65 }
  ];

  // 🎯 Offset from pointer
  const OFFSET_X = 20;   // → right side of pointer
  const OFFSET_Y = 40;  // ↓ slightly below pointer tail

  const trails = [];

  GROUPS.forEach((g, gi) => {
    const layer = document.createElement("div");
    layer.style.position = "absolute";
    layer.style.top = "0";
    layer.style.left = "0";
    layer.style.width = "100%";
    layer.style.height = "100%";
    layer.style.pointerEvents = "none";
    layer.style.zIndex = String(9999 - gi);

    const dots = [];
    for (let i = 0; i < g.count; i++) {
      const el = document.createElement("div");
      el.className = "dot";
      const scale = 1 - i / (g.count * 1.5);
      const size = Math.max(3, Math.round(g.baseSize * scale));
      el.style.width = size + "px";
      el.style.height = size + "px";
      el.style.background = COLORS[i % COLORS.length];
      el.style.opacity = (g.opacity * (1 - i / (g.count + 1))).toFixed(2);
      container.appendChild(el);
      dots.push({ el, x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }

    container.appendChild(layer);
    trails.push({ dots, config: g });
  });

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;

  function animate() {
    for (const tr of trails) {
      const { dots, config } = tr;
      let px = targetX + OFFSET_X;
      let py = targetY + OFFSET_Y;

      for (let i = 0; i < dots.length; i++) {
        const p = dots[i];
        if (i === 0) {
          // 🔥 first circle starts slightly right & below pointer
          p.x = targetX + OFFSET_X;
          p.y = targetY + OFFSET_Y;
        } else {
          const lerp = Math.max(0.02, config.easing - i * (config.gap / 1000));
          p.x += (px - p.x) * lerp;
          p.y += (py - p.y) * lerp;
        }
        p.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
        px = p.x;
        py = p.y;
      }
    }
    requestAnimationFrame(animate);
  }

  function move(e) {
    targetX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? targetX;
    targetY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? targetY;
  }

  window.addEventListener("pointermove", move, { passive: true });
  window.addEventListener("touchmove", move, { passive: true });
  requestAnimationFrame(animate);
})();