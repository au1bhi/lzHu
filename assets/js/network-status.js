(() => {
  'use strict';
  const root = document.getElementById('network-status');
  if (!root) return;
  const $ = id => document.getElementById('ns-' + id);
  const allowed = ['native', 'warp'];
  const historyDays = 7;
  const names = {native: 'IPv4 · 原生线路', warp: 'IPv6 · WARP 线路'};
  const labels = {operational: '运行正常', degraded: '部分异常', down: '检测失败', unknown: '未检测', stale: '数据过期'};
  let latest = null;
  let busy = false;
  const date = time => new Date(time).toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai', hour12: false});
  function el(tag, text, cls) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (cls) node.className = cls;
    return node;
  }
  function pill(state) { return el('span', labels[state] || labels.unknown, 'ns-pill ' + state); }
  function valid(data) {
    if (data?.version !== 1 || !Array.isArray(data.components) || !Array.isArray(data.events)) return false;
    return allowed.every(id => data.components.filter(c => c.id === id).length === 1) && data.components.filter(c => allowed.includes(c.id)).every(c =>
      Array.isArray(c.nodes) && c.nodes.length <= 512 && c.nodes.every(n => typeof n.name === 'string' && n.name.length <= 160 && Object.hasOwn(labels, n.state)) &&
      Array.isArray(c.history) && c.history.length === 90 && c.history.every(d => typeof d.date === 'string' && Number.isFinite(d.samples) && d.samples >= 0));
  }
  function stale() { return !Number.isFinite(latest?.checkedAt) || Date.now() - latest.checkedAt >= 300000 || latest.checkedAt > Date.now() + 30000; }
  function banner(state, note) {
    $('banner').className = 'ns-banner ' + state;
    $('headline').textContent = state === 'operational' ? 'IPv4 与 IPv6 线路运行正常' : state === 'degraded' ? '部分 IPv4 / IPv6 节点出现异常' : '暂无有效检测数据';
    $('note').textContent = note;
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
      const history = c.history.slice(-historyDays);
      const samples = history.reduce((s, d) => s + d.samples, 0);
      const successful = history.reduce((s, d) => s + (Number.isFinite(d.availability) ? d.availability / 100 * d.samples : 0), 0);
      head.append(el('p', ok + ' / ' + nodes.length + ' 节点可用 · 可用率（检测样本）' + (samples ? (successful / samples * 100).toFixed(2) + '%' : '暂无记录'), 'ns-component-note'));
      const bars = el('div', undefined, 'ns-bars'); bars.setAttribute('aria-label', names[c.id] + '，最近 7 天检测历史');
      for (const d of history) {
        const bar = el('button', undefined, 'ns-bar ' + (Object.hasOwn(labels, d.state) ? d.state : 'unknown')); bar.type = 'button';
        const description = d.date + ' · ' + (d.samples ? d.availability + '% 可用 · ' + d.samples + ' 个检测样本' : '无有效检测记录');
        bar.title = description; bar.setAttribute('aria-label', description);
        const show = () => { $('history-detail').textContent = names[c.id] + ' / ' + description; };
        for (const event of ['click', 'focus', 'pointerenter']) bar.addEventListener(event, show);
        bars.append(bar);
      }
      head.append(bars); const axis = el('div', undefined, 'ns-axis'); axis.append(el('span', history[0].date), el('span', '今天')); head.append(axis); section.append(head);
      const list = el('div'); list.setAttribute('role', 'table'); list.setAttribute('aria-label', names[c.id] + '节点');
      const rowHead = el('div', undefined, 'ns-node-header'); rowHead.setAttribute('role', 'row');
      for (const title of ['节点', '连接状态', '延迟']) { const cell = el('span', title); cell.setAttribute('role', 'columnheader'); rowHead.append(cell); }
      list.append(rowHead);
      const matching = nodes.filter(n => (n.name + names[c.id]).toLowerCase().includes(term));
      for (const n of matching) {
        const row = el('div', undefined, 'ns-node'); row.setAttribute('role', 'row');
        const name = el('span', n.name, 'ns-node-name'); name.setAttribute('role', 'cell');
        const status = el('span'); status.setAttribute('role', 'cell'); status.append(pill(n.state));
        const delay = el('span', n.state === 'operational' && Number.isFinite(n.delayMs) ? n.delayMs + ' ms' : '—', 'ns-node-latency'); delay.setAttribute('role', 'cell');
        row.append(name, status, delay); list.append(row);
      }
      if (!matching.length) list.append(el('p', term ? '没有匹配的节点。' : '暂无节点记录。', 'ns-empty'));
      section.append(list); $('components').append(section);
    }
    const state = states.some(s => ['degraded', 'down'].includes(s)) ? 'degraded' : states.every(s => s === 'operational') ? 'operational' : 'unknown';
    banner(state, expired ? '检测数据缺失或超过 5 分钟，请以客户端的实际连接为准。' : '依据上海监测点的实际连接结果。不同网络与客户端的体验可能不同。');
    $('available').textContent = available; $('failed').textContent = failed; $('unknown').textContent = unknown;
    $('updated').textContent = Number.isFinite(latest.checkedAt) ? '最近检测 ' + date(latest.checkedAt) + '（北京时间）' : '等待首次检测';
    $('events').replaceChildren();
    const cutoffDate = groups[0].history.at(-historyDays).date;
    const cutoff = Date.parse(cutoffDate + 'T00:00:00+08:00');
    for (const e of latest.events.filter(e => allowed.includes(e.component) && e.at >= cutoff).slice(0, 20)) {
      const card = el('article', undefined, 'ns-event'); card.append(el('time', date(e.at)), el('h3', names[e.component] + ' · ' + (labels[e.state] || labels.unknown)), el('p', e.before ? '检测状态由“' + (labels[e.before] || labels.unknown) + '”变为“' + (labels[e.state] || labels.unknown) + '”。' : '首次观测到此状态；实际发生时间与原因尚未确认。')); $('events').append(card);
    }
    if (!$('events').children.length) $('events').append(el('p', '最近 7 天暂无 IPv4 / IPv6 状态变化记录。', 'ns-empty'));
    $('record-start').textContent = latest.startedAt ? '记录始于 ' + date(latest.startedAt) + '（北京时间）。' : '历史将在首次完成检测后开始积累。';
  }
  async function refresh() {
    if (busy) return;
    busy = true; $('refresh').disabled = true; $('connection').textContent = '更新中…';
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(root.dataset.endpoint, {signal: controller.signal, mode: 'cors', credentials: 'omit', cache: 'no-store', redirect: 'error'});
      if (!response.ok) throw new Error('Unavailable');
      const data = await response.json();
      if (!valid(data)) throw new Error('Invalid status');
      latest = data; render(); $('connection').textContent = '每 60 秒自动刷新';
    } catch {
      $('connection').textContent = '更新失败，稍后自动重试';
      if (latest) render();
      if (!latest || stale()) banner('unknown', '监测服务暂时无法访问，此状态不代表所有节点故障。');
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
