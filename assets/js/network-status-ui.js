/* Presentation layer for the status pages, shared by both languages.
   network-status.js / network-status-zh.js own the data and the text; after each
   render they emit "ns:render" and this script adds the summary figures, the day
   scale under each history strip, the floating detail card and latency meters. */
(() => {
  'use strict';
  const root = document.getElementById('network-status');
  if (!root) return;
  const zh = document.documentElement.lang.startsWith('zh');
  const L = (en, cn) => (zh ? cn : en);
  const $ = (id) => document.getElementById('ns-' + id);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const zone = 'Asia/Shanghai';
  const dayKey = (ms) => new Date(ms).toLocaleDateString('en-CA', { timeZone: zone });
  const dayLabel = (ms) => new Date(ms).toLocaleDateString(zh ? 'zh-CN' : 'en-GB', { timeZone: zone, month: 'short', day: 'numeric' });

  /* Floating detail card for history bars --------------------------------- */
  const tip = document.createElement('div');
  tip.className = 'ns-tip';
  tip.setAttribute('role', 'status');
  tip.hidden = true;
  root.append(tip);
  let tipOwner = null;
  const showTip = (bar) => {
    const parts = (bar.getAttribute('aria-label') || '').split(' · ');
    if (parts.length === 0) return;
    tip.replaceChildren();
    const head = document.createElement('strong');
    head.className = 'ns-tip__state ' + ['operational', 'degraded', 'down'].find((state) => bar.classList.contains(state));
    head.textContent = parts[0];
    tip.append(head);
    for (const part of parts.slice(1)) {
      const line = document.createElement('span');
      line.textContent = part;
      tip.append(line);
    }
    tip.hidden = false;
    tipOwner = bar;
    const host = root.getBoundingClientRect();
    const rect = bar.getBoundingClientRect();
    const width = tip.offsetWidth;
    const left = Math.max(0, Math.min(host.width - width, rect.left - host.left + rect.width / 2 - width / 2));
    tip.style.left = `${left}px`;
    tip.style.top = `${rect.top - host.top - tip.offsetHeight - 10}px`;
    tip.style.setProperty('--arrow', `${rect.left - host.left + rect.width / 2 - left}px`);
  };
  const hideTip = (bar) => {
    if (bar && bar !== tipOwner) return;
    tip.hidden = true;
    tipOwner = null;
  };
  root.addEventListener('pointerover', (event) => {
    const bar = event.target.closest('.ns-bar');
    if (bar) showTip(bar);
  });
  root.addEventListener('pointerout', (event) => {
    const bar = event.target.closest('.ns-bar');
    if (bar) hideTip(bar);
  });
  root.addEventListener('focusin', (event) => {
    if (event.target.classList.contains('ns-bar')) showTip(event.target);
  });
  root.addEventListener('focusout', (event) => {
    if (event.target.classList.contains('ns-bar')) hideTip(event.target);
  });
  root.addEventListener('click', (event) => {
    const bar = event.target.closest('.ns-bar');
    if (bar) showTip(bar);
    else if (!event.target.closest('.ns-tip')) hideTip();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hideTip();
  });

  /* Next-probe countdown ----------------------------------------------------- */
  let nextCheckAt = null;
  const updateCountdown = () => {
    const node = $('next');
    if (!node) return;
    const remaining = Number.isFinite(nextCheckAt) ? nextCheckAt - Date.now() : NaN;
    if (!(remaining > 0)) {
      node.textContent = '';
      return;
    }
    const minutes = Math.ceil(remaining / 60000);
    const hours = Math.floor(minutes / 60);
    const text = hours > 0 ? L(`${hours} h ${minutes % 60} min`, `${hours} 小时 ${minutes % 60} 分钟`) : L(`${minutes} min`, `${minutes} 分钟`);
    node.textContent = L(`Next probe in ${text}`, `${text}后进行下一次探测`);
  };
  setInterval(updateCountdown, 30000);

  /* Count a figure up to its value on first paint ------------------------------ */
  const animateNumber = (node, value, format) => {
    if (reducedMotion || node.dataset.shown === 'yes') {
      node.textContent = format(value);
      node.dataset.shown = 'yes';
      return;
    }
    node.dataset.shown = 'yes';
    const startedAt = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - startedAt) / 1200);
      node.textContent = format(value * (1 - Math.pow(1 - t, 4)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  let firstRender = true;

  document.addEventListener('ns:render', (event) => {
    const { groups, expired, available, failed, unknown } = event.detail;
    nextCheckAt = event.detail.nextCheckAt;
    updateCountdown();

    /* Headline figures */
    let samples = 0, passed = 0;
    const delays = [];
    for (const group of groups) {
      for (const slot of group.probeHistory) {
        if (slot.samples > 0 && Number.isFinite(slot.availability)) {
          samples += slot.samples;
          passed += (slot.availability / 100) * slot.samples;
        }
      }
      if (!expired) {
        for (const node of group.nodes) {
          if (node.state === 'operational' && Number.isFinite(node.delayMs)) delays.push(node.delayMs);
        }
      }
    }
    const uptime = $('uptime');
    if (samples > 0) {
      const value = (passed / samples) * 100;
      const digits = value === 100 ? 0 : 2;
      animateNumber(uptime, value, (n) => `${n.toFixed(digits)}%`);
    } else {
      uptime.textContent = '—';
    }
    delays.sort((a, b) => a - b);
    $('median').textContent = delays.length > 0 ? `${delays[Math.floor((delays.length - 1) / 2)]} ms` : '—';

    const total = available + failed + unknown;
    const split = $('split');
    if (split && total > 0) {
      const [ok, bad, none] = split.children;
      ok.style.flexGrow = available;
      bad.style.flexGrow = failed;
      none.style.flexGrow = unknown;
      split.classList.add('is-ready');
    }

    /* Per-route enhancements */
    const today = dayKey(Date.now());
    for (const section of root.querySelectorAll('.ns-component')) {
      const group = groups.find((candidate) => candidate.id === section.dataset.group);
      const strip = section.querySelector('.ns-bars');
      if (!group || !strip) continue;
      const bars = Array.from(strip.children);

      // Day scale: a wider gap where a new day starts, and a label under each day.
      const scale = document.createElement('div');
      scale.className = 'ns-days';
      scale.setAttribute('aria-hidden', 'true');
      let start = 0;
      const flush = (end) => {
        const label = document.createElement('span');
        label.style.gridColumn = `${start + 1} / ${end + 1}`;
        const key = dayKey(group.probeHistory[start].startAt);
        // Short partial days at either end have no room for a label.
        label.textContent = end - start >= 4 ? (key === today ? L('Today', '今天') : dayLabel(group.probeHistory[start].startAt)) : '';
        scale.append(label);
      };
      bars.forEach((bar, index) => {
        bar.style.setProperty('--n', index);
        if (bar.title) bar.removeAttribute('title');   // the floating card replaces the native tooltip
        if (index > 0 && dayKey(group.probeHistory[index].startAt) !== dayKey(group.probeHistory[index - 1].startAt)) {
          bar.classList.add('day-start');
          flush(index);
          start = index;
        }
      });
      flush(bars.length);
      strip.after(scale);

      // Route availability as a figure beside the title.
      let routeSamples = 0, routePassed = 0;
      for (const slot of group.probeHistory) {
        if (slot.samples > 0 && Number.isFinite(slot.availability)) {
          routeSamples += slot.samples;
          routePassed += (slot.availability / 100) * slot.samples;
        }
      }
      const title = section.querySelector('.ns-group-title');
      if (title && routeSamples > 0) {
        const figure = document.createElement('span');
        figure.className = 'ns-route-uptime';
        const value = (routePassed / routeSamples) * 100;
        figure.textContent = `${value.toFixed(value === 100 ? 0 : 2)}%`;
        figure.title = L('Availability over the last 7 days', '最近 7 天可用率');
        title.insertBefore(figure, title.lastElementChild);
      }

      // Latency meters, relative to the slowest node on the route.
      const cells = Array.from(section.querySelectorAll('.ns-node-latency'));
      const values = cells.map((cell) => parseFloat(cell.textContent));
      const slowest = Math.max(...values.filter(Number.isFinite), 1);
      cells.forEach((cell, index) => {
        if (Number.isFinite(values[index])) cell.style.setProperty('--meter', `${Math.max(6, (values[index] / slowest) * 100)}%`);
      });
    }

    if (firstRender) {
      firstRender = false;
      root.classList.add('ns-enter');
      setTimeout(() => root.classList.remove('ns-enter'), 2400);
    }
  });
})();
