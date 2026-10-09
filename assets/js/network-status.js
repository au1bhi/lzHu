(() => {
  'use strict';
  const root = document.getElementById('network-status');
  if (!root) return;
  const $ = id => document.getElementById('ns-' + id);
  const allowed = ['native', 'warp'];
  const historySlots = 84;
  const names = {native: 'IPv4 · 原生线路', warp: 'IPv6 · WARP 线路'};
  const labels = {operational: 'Accept', degraded: 'Partial', down: 'Time Limit Exceed', unknown: 'Skipped', stale: 'Skipped'};
  const meanings = {operational: '连接检测成功', degraded: '部分节点检测失败', down: '连接检测失败（可能超时或连接错误）', unknown: '无有效检测记录', stale: '检测数据已过期'};
  let latest = null;
  let busy = false;
  let eventLimit = 20;
  const expandedEvents = new Set();
  const date = time => new Date(time).toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai', hour12: false});
  function el(tag, text, cls) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (cls) node.className = cls;
    return node;
  }
  function pill(state) { const node = el('span', labels[state] || labels.unknown, 'ns-pill ' + state); node.title = meanings[state] || meanings.unknown; node.setAttribute('aria-label', (labels[state] || labels.unknown) + '：' + node.title); return node; }
  function valid(data) {
    if (data?.version !== 1 || !Array.isArray(data.components) || !Array.isArray(data.events)) return false;
    return allowed.every(id => data.components.filter(c => c.id === id).length === 1) && data.components.filter(c => allowed.includes(c.id)).every(c =>
      Array.isArray(c.nodes) && c.nodes.length <= 512 && c.nodes.every(n => typeof n.name === 'string' && n.name.length <= 160 && Object.hasOwn(labels, n.state)) &&
      Array.isArray(c.probeHistory) && c.probeHistory.length === historySlots && c.probeHistory.every((d, i, all) => Number.isFinite(d.startAt) && d.endAt === d.startAt + 7200000 && (!i || d.startAt === all[i - 1].endAt) && Number.isFinite(d.samples) && d.samples >= 0 && Object.hasOwn(labels, d.state)));
  }
  function stale() { return !Number.isFinite(latest?.checkedAt) || Date.now() - latest.checkedAt >= 7500000 || latest.checkedAt > Date.now() + 30000; }
  function banner(state, note) {
    $('banner').className = 'ns-banner ' + state;
    $('headline').textContent = state === 'operational' ? 'Accept · IPv4 与 IPv6 线路运行正常' : state === 'degraded' ? 'Partial · 部分 IPv4 / IPv6 节点出现异常' : 'Skipped · 暂无有效检测数据';
    $('note').textContent = note;
  }
  function eventCounts(summary) {
    if (!summary || !['total', 'available', 'failed', 'unknown'].every(k => Number.isFinite(summary[k]) && summary[k] >= 0)) return null;
    return '共 ' + summary.total + ' 个节点：Accept ' + summary.available + '，Time Limit Exceed ' + summary.failed + '，Skipped ' + summary.unknown;
  }
  function changeDescription(change) {
    const name = typeof change.name === 'string' ? change.name : '未命名节点';
    if (change.kind === 'removed') return name + '：已移出监控（上轮 ' + (labels[change.before] || labels.unknown) + '）';
    if (change.kind === 'added') return name + '：新纳入监控 → ' + (labels[change.state] || labels.unknown);
    return name + '：' + (labels[change.before] || labels.unknown) + ' → ' + (labels[change.state] || labels.unknown) + (change.state === 'operational' && Number.isFinite(change.delayMs) ? ' · ' + change.delayMs + ' ms' : '');
  }
  function renderEvents(cutoff) {
    $('events').replaceChildren();
    const events = latest.events.filter(e => e && allowed.includes(e.component) && Number.isFinite(e.at) && e.at >= cutoff).sort((a, b) => b.at - a.at);
    for (const e of events.slice(0, eventLimit)) {
      const card = el('article', undefined, 'ns-event');
      const time = el('time', date(e.at) + '（北京时间）'); time.dateTime = new Date(e.at).toISOString();
      const verdict = (e.before ? (labels[e.before] || labels.unknown) + ' → ' : '') + (labels[e.state] || labels.unknown);
      card.append(time, el('h3', names[e.component] + ' · ' + verdict + (e.reason === 'node-change' ? ' · 节点状态变化' : '')));
      const summary = eventCounts(e.summary);
      if (!summary) {
        card.append(el('p', e.before ? '本次检测观察到线路由“' + (labels[e.before] || labels.unknown) + '”变为“' + (labels[e.state] || labels.unknown) + '”。' : '首次观察到此线路状态。'));
        card.append(el('p', '这条旧记录仅保存了线路总体状态，未保存受影响节点、数量和当时延迟；无法还原逐节点明细。', 'ns-event-context'));
      } else {
        card.append(el('p', '本轮检测：' + summary + '。', 'ns-event-summary'));
        const previous = eventCounts(e.previousSummary);
        if (previous) card.append(el('p', '上轮检测：' + previous + '。', 'ns-event-context'));
        const failed = Array.isArray(e.failedNodes) ? e.failedNodes.filter(n => typeof n === 'string') : [];
        const unknown = Array.isArray(e.unknownNodes) ? e.unknownNodes.filter(n => typeof n === 'string') : [];
        const changes = Array.isArray(e.changes) ? e.changes.filter(c => c && typeof c.name === 'string') : [];
        const recovered = changes.filter(c => c.kind === 'changed' && c.before === 'down' && c.state === 'operational');
        if (failed.length) card.append(el('p', '本轮检测失败：' + failed.slice(0, 3).join('、') + (failed.length > 3 ? '等 ' + failed.length + ' 个节点' : '') + '。'));
        if (recovered.length) card.append(el('p', '本轮恢复成功：' + recovered.slice(0, 3).map(c => c.name).join('、') + (recovered.length > 3 ? '等 ' + recovered.length + ' 个节点' : '') + '。'));
        if (!failed.length && e.state === 'operational') card.append(el('p', '本轮所有节点均通过连接检测。'));
        const details = el('details', undefined, 'ns-event-details');
        const key = e.component + ':' + e.at; details.open = expandedEvents.has(key);
        details.addEventListener('toggle', () => { if (details.open) expandedEvents.add(key); else expandedEvents.delete(key); });
        details.append(el('summary', '查看节点变化与检测细节' + (e.changeCount ? '（' + e.changeCount + ' 项变化）' : '')));
        if (changes.length) {
          const list = el('ul', undefined, 'ns-event-list'); for (const change of changes) list.append(el('li', changeDescription(change))); details.append(list);
          if (e.changeCount > changes.length) details.append(el('p', '本次共 ' + e.changeCount + ' 项变化，列出前 ' + changes.length + ' 项。'));
        } else details.append(el('p', e.previousSummary ? '没有逐节点状态变化；延迟数值变化不会单独产生事件。' : e.reason === 'first-observation' ? '这是该线路的首次观测，尚无上一轮逐节点结果用于对比。' : '旧记录未保存上一轮逐节点结果，本条仅补充同一轮快照可确认的检测结果。'));
        if (failed.length) details.append(el('p', '本轮失败节点：' + failed.join('、') + '。'));
        if (unknown.length) details.append(el('p', '本轮无有效结果：' + unknown.join('、') + '。'));
        const latency = e.latency;
        if (latency && latency.samples > 0 && ['minMs', 'medianMs', 'maxMs'].every(k => Number.isFinite(latency[k]))) {
          const mode = latency.mode === 'unified' ? 'Mihomo 统一延迟' : latency.mode === 'connection' ? '包含连接建立的 URL Test' : '测速模式未确认';
          details.append(el('p', '本轮延迟：中位数 ' + latency.medianMs + ' ms，范围 ' + latency.minMs + '–' + latency.maxMs + ' ms（' + latency.samples + ' 个 Accept 节点；' + mode + '）。'));
        } else details.append(el('p', '本轮没有可统计的成功节点延迟。'));
        if (Number.isFinite(e.previousAt) && e.previousAt < e.at) details.append(el('p', '观测对比时间：' + date(e.previousAt) + ' → ' + date(e.at) + '（北京时间）。状态差异在这两次检测之间被发现，实际发生时刻尚未确认。'));
        details.append(el('p', '监测点：阿里云上海；每两小时检测一次。事件时间是检测观测时间，失败原因需进一步确认。', 'ns-event-context'));
        card.append(details);
      }
      $('events').append(card);
    }
    if (!events.length) $('events').append(el('p', '最近 7 天暂无 IPv4 / IPv6 状态变化记录。', 'ns-empty'));
    if (events.length > eventLimit) {
      const more = el('button', '加载更多状态变化（还有 ' + (events.length - eventLimit) + ' 条）', 'ns-button ns-events-more'); more.type = 'button';
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
      head.append(el('p', ok + ' / ' + nodes.length + ' 节点可用 · 可用率（检测样本）' + (samples ? (successful / samples * 100).toFixed(2) + '%' : '暂无记录'), 'ns-component-note'));
      const bars = el('div', undefined, 'ns-bars'); bars.setAttribute('aria-label', names[c.id] + '，最近 7 天，每格 2 小时，共 84 格');
      for (const d of history) {
        const bar = el('button', undefined, 'ns-bar ' + (Object.hasOwn(labels, d.state) ? d.state : 'unknown')); bar.type = 'button';
        let detail;
        if (d.samples) detail = d.availability + '% 可用 · ' + d.samples + ' 个节点检测样本';
        else if (d.monitorError && Number.isFinite(d.monitorError.at)) {
          const stages = {cadence: '保存探测计划', configuration: '读取探测配置', measurement: '执行探测', 'snapshot-write': '保存检测结果', 'history-write': '保存历史记录'};
          const reasons = {timeout: '操作超时', 'controller-unavailable': '探测控制器不可用', 'invalid-inventory': '节点清单无效', 'oversized-response': '控制器响应超出限制', 'storage-error': '文件存储异常'};
          bar.classList.add('monitor-error');
          detail = '监控任务异常，本轮没有有效结果 · 异常记录于 ' + date(d.monitorError.at) + ' · ' + (stages[d.monitorError.stage] || '旧日志未记录失败环节') + ' · ' + (reasons[d.monitorError.reason] || '具体原因未确认');
        } else if (d.startAt <= Date.now() && Date.now() < d.endAt && !d.checkedAt) {
          detail = '等待本轮检测结果' + (Number.isFinite(latest.nextCheckAt) && latest.nextCheckAt >= Date.now() && latest.nextCheckAt < d.endAt ? ' · 预计 ' + date(latest.nextCheckAt) + ' 开始探测' : '');
        } else if (d.checkedAt) detail = '本轮已运行，但没有取得可判定的节点结果';
        else detail = '该时间区间未保存检测记录';
        const description = (labels[d.state] || labels.unknown) + ' · ' + date(d.startAt) + ' — ' + date(d.endAt) + '（北京时间） · ' + (d.checkedAt ? '检测于 ' + date(d.checkedAt) + ' · ' : '') + detail;
        bar.title = description; bar.setAttribute('aria-label', description);
        const show = () => { $('history-detail').textContent = names[c.id] + ' / ' + description; };
        for (const event of ['click', 'focus', 'pointerenter']) bar.addEventListener(event, show);
        bars.append(bar);
      }
      head.append(bars); const axis = el('div', undefined, 'ns-axis'); axis.append(el('span', date(history[0].startAt)), el('span', '每格 2 小时 · 当前')); head.append(axis); section.append(head);
      const list = el('div'); list.setAttribute('role', 'table'); list.setAttribute('aria-label', names[c.id] + '节点');
      const rowHead = el('div', undefined, 'ns-node-header'); rowHead.setAttribute('role', 'row');
      for (const title of ['节点', '连接状态', '延迟']) { const cell = el('span', title); cell.setAttribute('role', 'columnheader'); if (title === '延迟') cell.title = latest.latencyMode === 'unified' ? 'Clash/Mihomo URL Test · 统一延迟 · 上海监测点' : '上海监测点 URL Test；统一延迟模式尚未确认'; rowHead.append(cell); }
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
    banner(state, expired ? '检测数据缺失或超过 2 小时 5 分钟，请以客户端的实际连接为准。' : '依据上海监测点的实际连接结果。不同网络与客户端的体验可能不同。');
    $('available').textContent = available; $('failed').textContent = failed; $('unknown').textContent = unknown;
    $('latency-mode').textContent = latest.latencyMode === 'unified' ? '延迟使用 Clash/Mihomo URL Test 的统一延迟模式，目标为 gstatic HTTPS 204；以同一连接的第二次请求计时，第二次请求失败时内核可能回退到首次请求。结果来自上海监测点，与本地客户端可能不同。' : '当前检测结果尚未确认使用统一延迟；请等待下一轮检测。延迟来自上海监测点，与本地客户端可能不同。';
    $('updated').textContent = Number.isFinite(latest.checkedAt) ? '最近检测 ' + date(latest.checkedAt) + '（北京时间）' : '等待首次检测';
    renderEvents(groups[0].probeHistory[0].startAt);
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
      latest = data; render(); $('connection').textContent = '每两小时探测 · 自动同步结果';
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
