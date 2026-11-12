/* Homepage extras: the hero graph backdrop, count-up figures and the live
   Codeforces rating. Each part is optional and fails quietly. */
(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const token = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  /* Headline: each word (each character in Chinese) rises from its baseline --- */
  const title = document.querySelector('[data-split]');
  if (title && !reducedMotion) {
    const text = title.textContent.trim();
    const chinese = /[\u4e00-\u9fff]/.test(text);
    const parts = chinese ? Array.from(text) : text.split(/(\s+)/);
    title.setAttribute('aria-label', text);
    title.textContent = '';
    let index = 0;
    for (const part of parts) {
      if (/^\s+$/.test(part)) {
        title.append(document.createTextNode(' '));
        continue;
      }
      const word = document.createElement('span');
      word.className = 'word';
      word.setAttribute('aria-hidden', 'true');
      const inner = document.createElement('span');
      inner.textContent = part;
      inner.style.setProperty('--w', index);
      index += 1;
      word.append(inner);
      title.append(word);
    }
  }

  /* Portrait leans a few degrees toward the pointer ------------------------- */
  const portrait = document.querySelector('[data-tilt]');
  if (portrait && !reducedMotion && window.matchMedia('(hover: hover)').matches) {
    const hero = portrait.closest('.hero');
    hero.addEventListener('pointermove', (event) => {
      const rect = portrait.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) / window.innerWidth;
      const dy = (event.clientY - (rect.top + rect.height / 2)) / window.innerHeight;
      portrait.style.setProperty('--tilt-y', `${Math.max(-7, Math.min(7, dx * 16)).toFixed(2)}deg`);
      portrait.style.setProperty('--tilt-x', `${Math.max(-7, Math.min(7, -dy * 16)).toFixed(2)}deg`);
    }, { passive: true });
    hero.addEventListener('pointerleave', () => {
      portrait.style.setProperty('--tilt-y', '0deg');
      portrait.style.setProperty('--tilt-x', '0deg');
    });
  }

  /* Hero backdrop ---------------------------------------------------------
     A jittered grid graph. A shortest-path search (Dijkstra) spreads from a
     source node; once it has covered the graph, the path to the farthest node
     is traced, everything fades, and the search restarts from elsewhere. */
  const canvas = document.querySelector('[data-hero-graph]');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const spacing = 78;
    const speed = 230;        // search frontier, CSS pixels of path length per second
    const holdMs = 2600;      // how long the finished search and its path stay visible
    const fadeMs = 900;
    let width = 0, height = 0, nodes = [], edges = [], adjacency = [];
    let search = null, colors = null, frame = 0, visible = true, lastDraw = 0, seed = 7;

    // Small deterministic generator so the layout is stable between resizes.
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    const readColors = () => {
      colors = { accent: token('--accent'), ink: token('--ink-3') };
    };

    const build = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      seed = 7;
      const cols = Math.max(3, Math.ceil(width / spacing) + 1);
      const rows = Math.max(3, Math.ceil(height / spacing) + 1);
      nodes = [];
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          nodes.push({
            x: c * spacing + (random() - 0.5) * spacing * 0.62 + (r % 2 ? spacing * 0.3 : 0),
            y: r * spacing + (random() - 0.5) * spacing * 0.62
          });
        }
      }
      edges = [];
      adjacency = nodes.map(() => []);
      const link = (a, b) => {
        const length = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y);
        const index = edges.push({ a, b, length }) - 1;
        adjacency[a].push({ to: b, length, index });
        adjacency[b].push({ to: a, length, index });
      };
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const i = r * cols + c;
          if (c + 1 < cols && random() > 0.14) link(i, i + 1);
          if (r + 1 < rows && random() > 0.14) link(i, i + cols);
          if (c + 1 < cols && r + 1 < rows && random() > 0.62) link(i, i + cols + 1);
        }
      }
      start(performance.now());
    };

    const start = (now) => {
      const source = Math.floor(random() * nodes.length);
      const dist = nodes.map(() => Infinity);
      const parentEdge = nodes.map(() => -1);
      const parent = nodes.map(() => -1);
      const done = nodes.map(() => false);
      dist[source] = 0;
      // The graph is small (a few hundred nodes), so a linear scan is enough.
      for (let step = 0; step < nodes.length; step += 1) {
        let best = -1;
        for (let i = 0; i < nodes.length; i += 1) {
          if (!done[i] && (best === -1 || dist[i] < dist[best])) best = i;
        }
        if (best === -1 || dist[best] === Infinity) break;
        done[best] = true;
        for (const { to, length, index } of adjacency[best]) {
          if (dist[best] + length < dist[to]) {
            dist[to] = dist[best] + length;
            parent[to] = best;
            parentEdge[to] = index;
          }
        }
      }
      let far = source;
      for (let i = 0; i < nodes.length; i += 1) {
        if (dist[i] !== Infinity && dist[i] > dist[far]) far = i;
      }
      const path = [];
      for (let i = far; i !== -1 && i !== source; i = parent[i]) path.push(i);
      search = { source, dist, parent, parentEdge, far, path: path.reverse(), reach: dist[far], startedAt: now };
    };

    const line = (from, to, t) => {
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t);
      ctx.stroke();
    };

    const draw = (now) => {
      const elapsed = (now - search.startedAt) / 1000;
      const front = reducedMotion ? Infinity : elapsed * speed;
      const finishedAt = (search.reach / speed) * 1000;
      const sinceFinish = reducedMotion ? holdMs * 0.5 : now - search.startedAt - finishedAt;
      const fade = sinceFinish > holdMs ? Math.max(0, 1 - (sinceFinish - holdMs) / fadeMs) : 1;

      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = 'round';

      // The underlying graph.
      ctx.strokeStyle = colors.ink;
      ctx.globalAlpha = 0.16;
      ctx.lineWidth = 1;
      for (const edge of edges) line(nodes[edge.a], nodes[edge.b], 1);

      // Shortest-path tree, growing with the frontier.
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 1.25;
      ctx.globalAlpha = 0.5 * fade;
      for (let i = 0; i < nodes.length; i += 1) {
        const p = search.parent[i];
        if (p === -1 || front <= search.dist[p]) continue;
        line(nodes[p], nodes[i], Math.min(1, (front - search.dist[p]) / (search.dist[i] - search.dist[p])));
      }

      // Nodes: faint until the search reaches them, with a brief pulse on arrival.
      for (let i = 0; i < nodes.length; i += 1) {
        const reached = front >= search.dist[i];
        const age = reached ? (front - search.dist[i]) / speed : 0;
        const pulse = reached && !reducedMotion ? Math.max(0, 1 - age / 0.7) : 0;
        ctx.globalAlpha = reached ? (0.55 + 0.45 * pulse) * fade + 0.2 * (1 - fade) : 0.2;
        ctx.fillStyle = reached ? colors.accent : colors.ink;
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 1.6 + 2.2 * pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      // After the search completes, trace the path to the farthest node.
      if (sinceFinish > 0 && search.path.length > 0) {
        const traced = reducedMotion ? 1 : Math.min(1, sinceFinish / 900);
        const upTo = traced * search.path.length;
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 2.25;
        ctx.globalAlpha = 0.9 * fade;
        let previous = search.source;
        for (let k = 0; k < search.path.length && k < upTo; k += 1) {
          line(nodes[previous], nodes[search.path[k]], Math.min(1, upTo - k));
          previous = search.path[k];
        }
        ctx.fillStyle = colors.accent;
        for (const index of [search.source, traced >= 1 ? search.far : -1]) {
          if (index === -1) continue;
          ctx.beginPath();
          ctx.arc(nodes[index].x, nodes[index].y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      if (!reducedMotion && sinceFinish > holdMs + fadeMs) start(now);
    };

    const tick = (now) => {
      frame = 0;
      if (!visible || document.hidden) return;
      if (now - lastDraw > 30) {
        lastDraw = now;
        draw(now);
      }
      if (!reducedMotion) frame = requestAnimationFrame(tick);
    };
    const resume = () => {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };

    readColors();
    build();
    canvas.classList.add('is-ready');
    resume();

    let resizeTimer = 0;
    new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const rect = canvas.getBoundingClientRect();
        if (Math.abs(rect.width - width) > 1 || Math.abs(rect.height - height) > 1) {
          build();
          resume();
        }
      }, 150);
    }).observe(canvas);
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      resume();
    }).observe(canvas);
    document.addEventListener('visibilitychange', resume);
    document.addEventListener('themechange', () => {
      readColors();
      if (reducedMotion) draw(performance.now());
    });
  }

  /* Count-up figures ------------------------------------------------------- */
  const countUp = (el, value, { decimals = 0, suffix = '', duration = 1100 } = {}) => {
    const format = (n) => n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    if (reducedMotion) {
      el.textContent = format(value);
      return;
    }
    const startedAt = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - startedAt) / duration);
      el.textContent = format(value * (1 - Math.pow(1 - t, 4)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        observer.unobserve(el);
        countUp(el, Number(el.dataset.count), { decimals: Number(el.dataset.decimals || 0), suffix: el.dataset.suffix || '' });
      }
    }, { threshold: 0.6 });
    counters.forEach((el) => observer.observe(el));
  }

  /* Live Codeforces rating ------------------------------------------------- */
  const mini = document.querySelector('[data-cf-mini]');
  if (mini) {
    const handle = mini.dataset.cfMini;
    const cacheKey = `cf-mini:${handle}`;
    const call = async (method, query, signal) => {
      const response = await fetch(`https://codeforces.com/api/${method}?${query}`, { signal });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const payload = await response.json();
      if (payload.status !== 'OK') throw new Error(payload.comment || 'Codeforces API error');
      return payload.result;
    };
    const shape = (user, history) => ({ rating: user.rating, rank: user.rank, history: history.map((entry) => [entry.ratingUpdateTimeSeconds, entry.newRating]) });
    const cached = () => {
      try {
        const entry = JSON.parse(sessionStorage.getItem(cacheKey));
        return entry && Date.now() - entry.at < 10 * 60 * 1000 ? entry.data : null;
      } catch {
        return null;
      }
    };
    // The saved snapshot is always available; live data replaces it when reachable.
    const fromSnapshot = () => fetch(mini.dataset.snapshot, { cache: 'no-cache' })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`Snapshot ${response.status}`))))
      .then((data) => shape(data.user, data.rating));
    const fromApi = async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      try {
        const [info, history] = await Promise.all([call('user.info', `handles=${handle}`, controller.signal), call('user.rating', `handle=${handle}`, controller.signal)]);
        const data = shape(info[0], history);
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), data }));
        } catch { /* storage unavailable */ }
        return data;
      } finally {
        clearTimeout(timer);
      }
    };
    let painted = false;
    const paint = (data) => {

      if (typeof data.rating !== 'number') return;
      if (data.history.length > 1) {
        const w = 240, h = 56, pad = 4;
        const xs = data.history.map(([time]) => time), ys = data.history.map(([, rating]) => rating);
        const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
        const points = data.history.map(([time, rating]) => [
          ((time - x0) / (x1 - x0 || 1)) * w,
          h - pad - ((rating - y0) / (y1 - y0 || 1)) * (h - pad * 2)
        ]);
        const path = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
        mini.querySelector('.cf-mini__line').setAttribute('d', path);
        mini.querySelector('.cf-mini__area').setAttribute('d', `${path} L${w} ${h} L0 ${h} Z`);
        mini.querySelector('.cf-mini__spark').setAttribute('aria-label', `Codeforces rating history: from ${ys[0]} to ${ys[ys.length - 1]} over ${ys.length} rated contests`);
      } else {
        mini.querySelector('.cf-mini__spark').remove();
      }
      mini.querySelector('[data-cf-rank]').textContent = data.rank ? `${mini.dataset.label} · ${data.rank.replace(/\b\w/g, (c) => c.toUpperCase())}` : mini.dataset.label;
      mini.hidden = false;
      const value = mini.querySelector('[data-cf-rating]');
      if (painted) value.textContent = data.rating.toLocaleString('en-US');
      else countUp(value, data.rating, { duration: 1000 });
      painted = true;
    };
    const warm = cached();
    if (warm) {
      paint(warm);
    } else {
      fromSnapshot().then((data) => { if (!painted) paint(data); }).catch((error) => console.warn('Codeforces snapshot unavailable:', error.message));
      fromApi().then(paint).catch((error) => console.warn('Codeforces live rating unavailable:', error.message));
    }
  }
})();
