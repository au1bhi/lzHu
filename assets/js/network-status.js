(() => {
  'use strict';
  const root = document.getElementById('network-status');
  if (!root) return;
  const $ = id => document.getElementById('ns-' + id);
  const allowed = ['native', 'warp'];
  const historySlots = 84;
  const names = {native: 'IPv4 · Native routes', warp: 'IPv6 · WARP routes'};
  const labels = {operational: 'Accept', degraded: 'Partial', down: 'Time Limit Exceed', unknown: 'Skipped', stale: 'Skipped'};
  const meanings = {operational: 'Connection check succeeded', degraded: 'Some node checks failed', down: 'Connection check failed (timeout or connection error)', unknown: 'No valid probe record', stale: 'Probe results have expired'};
  let latest = null;
  let busy = false;
  let eventLimit = 20;
  const expandedEvents = new Set();
  const date = time => new Date(time).toLocaleString('en-GB', {timeZone: 'Asia/Shanghai', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'});
  const nodeName = name => name.replace(/\u4f18\u9009\s*(\d+)/g, 'Preferred $1');
  function el(tag, text, cls) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (cls) node.className = cls;
    return node;
  }
  function pill(state) { const node = el('span', labels[state] || labels.unknown, 'ns-pill ' + state); node.title = meanings[state] || meanings.unknown; node.setAttribute('aria-label', (labels[state] || labels.unknown) + ': ' + node.title); return node; }
  function valid(data) {
    if (data?.version !== 1 || !Array.isArray(data.components) || !Array.isArray(data.events)) return false;
    return allowed.every(id => data.components.filter(c => c.id === id).length === 1) && data.components.filter(c => allowed.includes(c.id)).every(c =>
      Array.isArray(c.nodes) && c.nodes.length <= 512 && c.nodes.every(n => typeof n.name === 'string' && n.name.length <= 160 && Object.hasOwn(labels, n.state)) &&
      Array.isArray(c.probeHistory) && c.probeHistory.length === historySlots && c.probeHistory.every((d, i, all) => Number.isFinite(d.startAt) && d.endAt === d.startAt + 7200000 && (!i || d.startAt === all[i - 1].endAt) && Number.isFinite(d.samples) && d.samples >= 0 && Object.hasOwn(labels, d.state)));
  }
  function stale() { return !Number.isFinite(latest?.checkedAt) || Date.now() - latest.checkedAt >= 7500000 || latest.checkedAt > Date.now() + 30000; }
  function banner(state, note) {
    $('banner').className = 'ns-banner ' + state;
    $('headline').textContent = state === 'operational' ? 'Accept · IPv4 and IPv6 routes are operational' : state === 'degraded' ? 'Partial · Some IPv4 / IPv6 nodes are failing' : 'Skipped · No valid probe results';
    $('note').textContent = note;
  }
  function eventCounts(summary) {
    if (!summary || !['total', 'available', 'failed', 'unknown'].every(k => Number.isFinite(summary[k]) && summary[k] >= 0)) return null;
    return summary.total + ' nodes: Accept ' + summary.available + ', Time Limit Exceed ' + summary.failed + ', Skipped ' + summary.unknown;
  }
  function changeDescription(change) {
    const name = typeof change.name === 'string' ? nodeName(change.name) : 'Unnamed node';
    if (change.kind === 'removed') return name + ': Removed from monitoring (previously ' + (labels[change.before] || labels.unknown) + ')';
    if (change.kind === 'added') return name + ': Added to monitoring → ' + (labels[change.state] || labels.unknown);
    return name + ': ' + (labels[change.before] || labels.unknown) + ' → ' + (labels[change.state] || labels.unknown) + (change.state === 'operational' && Number.isFinite(change.delayMs) ? ' · ' + change.delayMs + ' ms' : '');
  }
  function renderEvents(cutoff) {
    $('events').replaceChildren();
    const events = latest.events.filter(e => e && allowed.includes(e.component) && Number.isFinite(e.at) && e.at >= cutoff).sort((a, b) => b.at - a.at);
    for (const e of events.slice(0, eventLimit)) {
      const card = el('article', undefined, 'ns-event');
      const time = el('time', date(e.at) + ' (UTC+8)'); time.dateTime = new Date(e.at).toISOString();
      const verdict = (e.before ? (labels[e.before] || labels.unknown) + ' → ' : '') + (labels[e.state] || labels.unknown);
      card.append(time, el('h3', names[e.component] + ' · ' + verdict + (e.reason === 'node-change' ? ' · Node status changes' : '')));
      const summary = eventCounts(e.summary);
      if (!summary) {
        card.append(el('p', e.before ? 'This probe observed a route change from ' + (labels[e.before] || labels.unknown) + ' to ' + (labels[e.state] || labels.unknown) + '.' : 'First observation of this route status.'));
        card.append(el('p', 'This legacy record contains only the overall route status. Affected nodes, counts, and latency were not saved, so node-level details cannot be reconstructed.', 'ns-event-context'));
      } else {
        card.append(el('p', 'Current probe: ' + summary + '.', 'ns-event-summary'));
        const previous = eventCounts(e.previousSummary);
        if (previous) card.append(el('p', 'Previous probe: ' + previous + '.', 'ns-event-context'));
        const failed = Array.isArray(e.failedNodes) ? e.failedNodes.filter(n => typeof n === 'string').map(nodeName) : [];
        const unknown = Array.isArray(e.unknownNodes) ? e.unknownNodes.filter(n => typeof n === 'string').map(nodeName) : [];
        const changes = Array.isArray(e.changes) ? e.changes.filter(c => c && typeof c.name === 'string') : [];
        const recovered = changes.filter(c => c.kind === 'changed' && c.before === 'down' && c.state === 'operational');
        if (failed.length) card.append(el('p', 'Failed in this probe: ' + failed.slice(0, 3).join(', ') + (failed.length > 3 ? ' (' + failed.length + ' nodes total)' : '') + '.'));
        if (recovered.length) card.append(el('p', 'Recovered in this probe: ' + recovered.slice(0, 3).map(c => nodeName(c.name)).join(', ') + (recovered.length > 3 ? ' (' + recovered.length + ' nodes total)' : '') + '.'));
        if (!failed.length && e.state === 'operational') card.append(el('p', 'All nodes passed the connection check in this probe.'));
        const details = el('details', undefined, 'ns-event-details');
        const key = e.component + ':' + e.at; details.open = expandedEvents.has(key);
        details.addEventListener('toggle', () => { if (details.open) expandedEvents.add(key); else expandedEvents.delete(key); });
        details.append(el('summary', 'View node changes and probe details' + (e.changeCount ? ' (' + e.changeCount + ' changes)' : '')));
        if (changes.length) {
          const list = el('ul', undefined, 'ns-event-list'); for (const change of changes) list.append(el('li', changeDescription(change))); details.append(list);
          if (e.changeCount > changes.length) details.append(el('p', 'Showing the first ' + changes.length + ' of ' + e.changeCount + ' changes.'));
        } else details.append(el('p', e.previousSummary ? 'No node status changes. Latency changes alone do not generate events.' : e.reason === 'first-observation' ? 'This is the first observation of this route; no previous node results are available for comparison.' : 'The legacy record has no previous node results; only details confirmed by the same probe snapshot are shown.'));
        if (failed.length) details.append(el('p', 'Failed nodes: ' + failed.join(', ') + '.'));
        if (unknown.length) details.append(el('p', 'Nodes without valid results: ' + unknown.join(', ') + '.'));
        const latency = e.latency;
        if (latency && latency.samples > 0 && ['minMs', 'medianMs', 'maxMs'].every(k => Number.isFinite(latency[k]))) {
          const mode = latency.mode === 'unified' ? 'Mihomo unified latency' : latency.mode === 'connection' ? 'URL Test including connection setup' : 'Measurement mode unconfirmed';
          details.append(el('p', 'Probe latency: median ' + latency.medianMs + ' ms, range ' + latency.minMs + '–' + latency.maxMs + ' ms (' + latency.samples + ' Accept nodes; ' + mode + ').'));
        } else details.append(el('p', 'No successful node latency measurements are available for this probe.'));
        if (Number.isFinite(e.previousAt) && e.previousAt < e.at) details.append(el('p', 'Observation comparison: ' + date(e.previousAt) + ' → ' + date(e.at) + ' (UTC+8). Changes were detected between these probes; the exact time of the underlying change is unknown.'));
        details.append(el('p', 'Monitoring location: Alibaba Cloud, Shanghai; probes run every two hours. Event times are observation times. Failure causes require further investigation.', 'ns-event-context'));
        card.append(details);
      }
      $('events').append(card);
    }
    if (!events.length) $('events').append(el('p', 'No IPv4 / IPv6 status changes recorded in the last 7 days.', 'ns-empty'));
    if (events.length > eventLimit) {
      const more = el('button', 'Load more changes (' + (events.length - eventLimit) + ' remaining)', 'ns-button ns-events-more'); more.type = 'button';
      more.addEventListener('click', () => { const firstNew = eventLimit; eventLimit += 20; renderEvents(cutoff); const card = $('events').querySelectorAll('.ns-event')[firstNew]; if (card) { card.tabIndex = -1; card.focus({preventScroll: true}); } }); $('events').append(more);
    }
  }
  function render() {
    if (!latest) return;
    const expired = stale();
    const groups = latest.components.filter(c => allowed.includes(c.id)).sort((a, b) => allowed.indexOf(a.id) - allowed.indexOf(b.id));
    let available = 0, failed = 0, unknown = 0;
    const term = $('search').value.trim().toLowerCase();
    const states = [];
    $('components').replaceChildren();
    for (const c of groups) {
      const nodes = c.nodes.map(n => ({...n, state: expired ? 'stale' : n.state, delayMs: expired ? null : n.delayMs}));
      const ok = nodes.filter(n => n.state === 'operational').length;
      const down = nodes.filter(n => n.state === 'down').length;
      const state = expired ? 'unknown' : down ? ok ? 'degraded' : 'down' : ok && ok === nodes.length ? 'operational' : 'unknown';
      available += ok; failed += down; unknown += nodes.length - ok - down; states.push(state);
      const section = el('section', undefined, 'ns-component'); section.dataset.group = c.id;
      const head = el('div', undefined, 'ns-component-head');
      const heading = el('div', undefined, 'ns-group-title'); heading.append(el('h3', names[c.id]), pill(state)); head.append(heading);
      const history = c.probeHistory;
      const samples = history.reduce((s, d) => s + d.samples, 0);
      const successful = history.reduce((s, d) => s + (Number.isFinite(d.availability) ? d.availability / 100 * d.samples : 0), 0);
      head.append(el('p', ok + ' / ' + nodes.length + ' nodes available · Availability (probe samples): ' + (samples ? (successful / samples * 100).toFixed(2) + '%' : 'No records'), 'ns-component-note'));
      const bars = el('div', undefined, 'ns-bars'); bars.setAttribute('aria-label', names[c.id] + ', last 7 days, 84 two-hour intervals');
      for (const d of history) {
        const bar = el('button', undefined, 'ns-bar ' + (Object.hasOwn(labels, d.state) ? d.state : 'unknown')); bar.type = 'button';
        let detail;
        if (d.samples > 0 && Number.isFinite(d.availability) && d.availability >= 0 && d.availability <= 100) {
          bar.classList.add('measured');
          bar.style.setProperty('--ns-bar-height', d.availability + '%');
          bar.style.setProperty('--ns-bar-color', 'hsl(' + (d.availability * 1.2) + ', 100%, 50%)');
          if (d.availability === 0) bar.classList.add('zero');
          detail = d.availability + '% available · ' + d.samples + ' node checks';
        }
        else if (d.monitorError && Number.isFinite(d.monitorError.at)) {
          const stages = {cadence: 'Saving the probe schedule', configuration: 'Reading probe configuration', measurement: 'Running probes', 'snapshot-write': 'Saving the result snapshot', 'history-write': 'Saving probe history', 'journal-write': 'Saving the probe journal'};
          const reasons = {timeout: 'Operation timed out', 'controller-unavailable': 'Probe controller unavailable', 'invalid-inventory': 'Invalid node inventory', 'oversized-response': 'Controller response exceeded the size limit', 'storage-error': 'Storage error', 'invalid-json': 'Invalid response or configuration format', 'controller-authentication': 'Controller authentication failed', 'process-interrupted': 'Monitor process interrupted before the probe completed', 'unexpected-error': 'Unexpected error; diagnostic location saved in the probe journal'};
          bar.classList.add('monitor-error');
          detail = 'Monitor error; no valid results for this probe · Error recorded at ' + date(d.monitorError.at) + ' · ' + (stages[d.monitorError.stage] || 'Failure stage not recorded in the legacy journal') + ' · ' + (reasons[d.monitorError.reason] || 'Cause unconfirmed');
        } else if (d.startAt <= Date.now() && Date.now() < d.endAt && !d.checkedAt) {
          detail = 'Waiting for this probe' + (Number.isFinite(latest.nextCheckAt) && latest.nextCheckAt >= Date.now() && latest.nextCheckAt < d.endAt ? ' · Scheduled to start at ' + date(latest.nextCheckAt) : '');
        } else if (d.checkedAt) detail = 'The probe ran but returned no conclusive node results';
        else detail = 'No probe record saved for this interval';
        const description = (labels[d.state] || labels.unknown) + ' · ' + date(d.startAt) + ' — ' + date(d.endAt) + ' (UTC+8) · ' + (d.checkedAt ? 'Probed at ' + date(d.checkedAt) + ' · ' : '') + detail;
        bar.title = description; bar.setAttribute('aria-label', description);
        const show = () => { $('history-detail').textContent = names[c.id] + ' / ' + description; };
        for (const event of ['click', 'focus', 'pointerenter']) bar.addEventListener(event, show);
        bars.append(bar);
      }
      head.append(bars); const axis = el('div', undefined, 'ns-axis'); axis.append(el('span', date(history[0].startAt)), el('span', '2 hours per bar · Now')); head.append(axis); section.append(head);
      const list = el('div'); list.setAttribute('role', 'table'); list.setAttribute('aria-label', names[c.id] + ' nodes');
      const rowHead = el('div', undefined, 'ns-node-header'); rowHead.setAttribute('role', 'row');
      for (const title of ['Node', 'Connection status', 'Latency']) { const cell = el('span', title); cell.setAttribute('role', 'columnheader'); if (title === 'Latency') cell.title = latest.latencyMode === 'unified' ? 'Clash/Mihomo URL Test · Unified latency · Shanghai monitor' : 'Shanghai URL Test; unified latency mode unconfirmed'; rowHead.append(cell); }
      list.append(rowHead);
      const matching = nodes.filter(n => (n.name + ' ' + nodeName(n.name) + ' ' + names[c.id]).toLowerCase().includes(term));
      for (const n of matching) {
        const row = el('div', undefined, 'ns-node'); row.setAttribute('role', 'row');
        const name = el('span', nodeName(n.name), 'ns-node-name'); name.setAttribute('role', 'cell');
        const status = el('span'); status.setAttribute('role', 'cell'); status.append(pill(n.state));
        const delay = el('span', n.state === 'operational' && Number.isFinite(n.delayMs) ? n.delayMs + ' ms' : '—', 'ns-node-latency'); delay.setAttribute('role', 'cell');
        row.append(name, status, delay); list.append(row);
      }
      if (!matching.length) list.append(el('p', term ? 'No matching nodes.' : 'No node records available.', 'ns-empty'));
      section.append(list); $('components').append(section);
    }
    const state = states.some(s => ['degraded', 'down'].includes(s)) ? 'degraded' : states.every(s => s === 'operational') ? 'operational' : 'unknown';
    banner(state, expired ? 'Results are missing or older than 2 hours and 5 minutes. Check actual connectivity in your client.' : 'Based on actual connection checks from Shanghai. Results may differ across networks and clients.');
    $('available').textContent = available; $('failed').textContent = failed; $('unknown').textContent = unknown;
    $('latency-mode').textContent = latest.latencyMode === 'unified' ? 'Latency uses Clash/Mihomo URL Test in unified mode against the gstatic HTTPS 204 endpoint. It times the second request on the same connection; the proxy core may fall back to the first if the second fails. Measurements are from Shanghai and may differ from your client.' : 'Unified latency mode is not confirmed for these results. Please wait for the next probe. Measurements are from Shanghai and may differ from your client.';
    $('updated').textContent = Number.isFinite(latest.checkedAt) ? 'Last probe: ' + date(latest.checkedAt) + ' (UTC+8)' : 'Awaiting the first probe';
    renderEvents(groups[0].probeHistory[0].startAt);
    $('record-start').textContent = latest.startedAt ? 'Records started: ' + date(latest.startedAt) + ' (UTC+8).' : 'History will accumulate after the first completed probe.';
  }
  async function refresh() {
    if (busy) return;
    busy = true; $('refresh').disabled = true; $('connection').textContent = 'Updating…';
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(root.dataset.endpoint, {signal: controller.signal, mode: 'cors', credentials: 'omit', cache: 'no-store', redirect: 'error'});
      if (!response.ok) throw new Error('Unavailable');
      const data = await response.json();
      if (!valid(data)) throw new Error('Invalid status');
      latest = data; render(); $('connection').textContent = 'Probes every 2 hours · Results sync automatically';
    } catch {
      $('connection').textContent = 'Update failed; retrying automatically';
      if (latest) render();
      if (!latest || stale()) banner('unknown', 'The monitoring service is temporarily unreachable. This does not mean all nodes are down.');
    } finally { clearTimeout(timer); busy = false; $('refresh').disabled = false; }
  }
  $('refresh').addEventListener('click', refresh);
  $('search').addEventListener('input', render);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { if (latest && stale()) render(); refresh(); } });
  setInterval(() => { if (!document.hidden) refresh(); }, 60000);
  // Expire displayed successes even while a refresh is in flight or unavailable.
  setInterval(() => { if (!document.hidden && latest && stale()) render(); }, 15000);
  refresh();
})();
