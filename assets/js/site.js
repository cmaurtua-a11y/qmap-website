// QMAP site: menu, theme toggle, copy buttons, and the honeycomb lattice canvas.
(function () {
  const root = document.documentElement;

  // ---- theme toggle (remembered per browser) ----
  // Dark is the default; a visitor's choice is remembered on every page.
  let saved = null;
  try { saved = localStorage.getItem("qmap-theme"); } catch (e) {}
  root.setAttribute("data-qmap-theme", saved === "light" ? "light" : "dark");
  const themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = root.getAttribute("data-qmap-theme") === "light" ? "light" : "dark";
      const next = current === "light" ? "dark" : "light";
      root.setAttribute("data-qmap-theme", next);
      try { localStorage.setItem("qmap-theme", next); } catch (e) {}
    });
  }

  // ---- mobile menu ----
  const menuBtn = document.querySelector("[data-menu]");
  const nav = document.querySelector(".nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
  }

  // ---- copy buttons ----
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-copy");
      const done = () => { btn.textContent = "Copied"; setTimeout(() => (btn.textContent = "Copy"), 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, () => {});
    });
  });

  // ---- honeycomb lattice with localized emitters ----
  // A monolayer (like WSe2) drawn as a honeycomb. A slowly wandering "strain bubble"
  // bends the lattice; emitter sites inside it flash like single-photon sources.
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("canvas[data-lattice]").forEach((canvas) => {
    const ctx = canvas.getContext("2d");
    const intensity = parseFloat(canvas.getAttribute("data-lattice")) || 1;
    let w = 0, h = 0, dpr = 1, sites = [], bonds = [], t = 0;
    const pulses = [];
    const pointer = { x: null, y: null };

    function color(name) {
      return getComputedStyle(root).getPropertyValue(name).trim() || "#7cc4ff";
    }

    function build() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sites = []; bonds = [];
      const a = 26; // lattice constant in px
      const dx = a * Math.sqrt(3), dy = a * 1.5;
      const index = new Map();
      for (let row = -1; row * dy < h + a * 2; row++) {
        for (let col = -1; col * dx < w + dx; col++) {
          const x = col * dx + (row % 2 ? dx / 2 : 0);
          const y = row * dy;
          // two sublattices: metal (A) and chalcogen (B)
          const A = { x, y, kind: 0 };
          const B = { x, y: y + a, kind: 1 };
          index.set(row + ":" + col + ":A", sites.length); sites.push(A);
          index.set(row + ":" + col + ":B", sites.length); sites.push(B);
        }
      }
      // connect each B to the A directly below-left/below-right in the next row, and own A
      for (let i = 0; i < sites.length; i++) {
        for (let j = i + 1; j < Math.min(sites.length, i + 400); j++) {
          const s = sites[i], u = sites[j];
          if (s.kind === u.kind) continue;
          const d = Math.hypot(s.x - u.x, s.y - u.y);
          if (Math.abs(d - a) < 0.5) bonds.push([i, j]);
        }
      }
      sites.forEach((s) => { s.emitter = Math.random() < 0.06; s.phase = Math.random() * 6.28; });
    }

    function bubble() {
      if (pointer.x !== null) return { x: pointer.x, y: pointer.y };
      return {
        x: w * (0.68 + 0.18 * Math.sin(t * 0.00023)),
        y: h * (0.5 + 0.28 * Math.sin(t * 0.00031 + 1.3)),
      };
    }

    function displaced(s, b) {
      const ddx = s.x - b.x, ddy = s.y - b.y;
      const r = Math.hypot(ddx, ddy) || 1;
      const R = Math.min(w, h) * 0.32 + 60;
      const k = Math.exp(-(r * r) / (R * R)) * 14 * intensity;
      return { x: s.x + (ddx / r) * k, y: s.y + (ddy / r) * k, strain: Math.exp(-(r * r) / (R * R)) };
    }

    function draw() {
      const exc = color("--exciton"), emi = color("--emission");
      ctx.clearRect(0, 0, w, h);
      const b = bubble();
      const pos = sites.map((s) => displaced(s, b));
      ctx.lineWidth = 1;
      ctx.strokeStyle = exc;
      ctx.globalAlpha = 0.16 * intensity;
      ctx.beginPath();
      for (const [i, j] of bonds) { ctx.moveTo(pos[i].x, pos[i].y); ctx.lineTo(pos[j].x, pos[j].y); }
      ctx.stroke();
      for (let i = 0; i < sites.length; i++) {
        const p = pos[i], s = sites[i];
        ctx.globalAlpha = (0.25 + p.strain * 0.6) * intensity;
        ctx.fillStyle = exc;
        ctx.beginPath(); ctx.arc(p.x, p.y, s.kind ? 1.4 : 2.1, 0, 6.283); ctx.fill();
        // emitters in strained regions fire occasionally
        if (!reduce && s.emitter && p.strain > 0.35 && Math.random() < 0.004 * p.strain) {
          pulses.push({ x: p.x, y: p.y, life: 0 });
        }
      }
      for (let k = pulses.length - 1; k >= 0; k--) {
        const q = pulses[k];
        q.life += 1;
        const life = q.life / 70;
        if (life >= 1) { pulses.splice(k, 1); continue; }
        ctx.globalAlpha = (1 - life) * 0.9 * intensity;
        ctx.strokeStyle = emi; ctx.fillStyle = emi;
        ctx.beginPath(); ctx.arc(q.x, q.y, 3 + life * 34, 0, 6.283); ctx.stroke();
        ctx.beginPath(); ctx.arc(q.x, q.y, 3.2 * (1 - life) + 1, 0, 6.283); ctx.fill();
      }
      if (reduce) {
        // static frame: show a few lit emitters
        sites.forEach((s, i) => {
          if (s.emitter && pos[i].strain > 0.5) {
            ctx.globalAlpha = 0.8 * intensity; ctx.fillStyle = emi;
            ctx.beginPath(); ctx.arc(pos[i].x, pos[i].y, 3.5, 0, 6.283); ctx.fill();
          }
        });
      }
      ctx.globalAlpha = 1;
    }

    function loop(now) {
      t = now;
      draw();
      if (!reduce) requestAnimationFrame(loop);
    }

    build();
    if (reduce) draw(); else requestAnimationFrame(loop);
    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { build(); if (reduce) draw(); }, 150); });
    const host = canvas.parentElement;
    host.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
    });
    host.addEventListener("pointerleave", () => { pointer.x = pointer.y = null; });
  });
})();
