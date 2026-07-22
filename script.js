/* ====== Contact starfield canvas (sized to contact section) ====== */
(function starfield() {
  const canvas = document.querySelector('#starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w = 0, h = 0;
  let stars = [];
  const speed = 0.9;
  const streaks = true;
  const warp = false;

  function getStarCount() {
    return window.innerWidth < 768 ? 600 : 1600;
  }

  function initStars() {
    const numStars = getStarCount();
    stars = Array.from({ length: numStars }, () => ({
      x: (Math.random() - 0.5) * w * 2,
      y: (Math.random() - 0.5) * h * 2,
      z: Math.random() * Math.max(w, h)
    }));
  }

  function resize() {
    
    const section = canvas.parentElement;
    if (!section) return;
    w = canvas.width = Math.max(1, Math.floor(section.clientWidth));
    h = canvas.height = Math.max(1, Math.floor(section.clientHeight));
    ctx.setTransform(1,0,0,1,0,0); 
    initStars();
  }

  let rafId;
  function draw() {
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = '#1c1a16';
    ctx.fillRect(0,0,w,h);

    const cx = w / 2;
    const cy = h / 2;

    for (let s of stars) {
      s.z -= speed;
      if (s.z <= 0) {
        s.z = Math.max(w,h);
        s.x = (Math.random() - 0.5) * w * 2;
        s.y = (Math.random() - 0.5) * h * 2;
      }
      const sx = cx + (s.x / s.z) * w;
      const sy = cy + (s.y / s.z) * w;
      const pz = s.z + speed;
      const px = cx + (s.x / pz) * w;
      const py = cy + (s.y / pz) * w;

      const size = Math.max(0.3, (1 - s.z / Math.max(w,h)) * 2.2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = size;

      if (streaks) {
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
      }
    }

    if (warp) {
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, w / 2);
      gradient.addColorStop(0, 'rgba(255,255,255,0.12)');
      gradient.addColorStop(1, '#1c1a16');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    }

    rafId = requestAnimationFrame(draw);
  }

  // Resize observer for container changes (responsive)
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(rafId);
    resize();
    rafId = requestAnimationFrame(draw);
  });

  ro.observe(canvas.parentElement);
  resize();
  draw();

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(rafId);
    ro.disconnect();
  });
})();