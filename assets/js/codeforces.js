/* Codeforces dashboard: fetches public API data and draws theme-aware charts. */
(() => {
  'use strict';
  const dashboard = document.getElementById('cf-dashboard');
  if (!dashboard) return;

  const handle = dashboard.dataset.handle;
  const $ = (id) => document.getElementById(id);
  const statusEl = $('cf-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const api = (method, query) => `https://codeforces.com/api/${method}?${query}`;
  const submissionLimit = 1000;

  const verdictLabels = {
    OK: 'Accepted',
    WRONG_ANSWER: 'Wrong answer',
    TIME_LIMIT_EXCEEDED: 'Time limit exceeded',
    MEMORY_LIMIT_EXCEEDED: 'Memory limit exceeded',
    RUNTIME_ERROR: 'Runtime error',
    COMPILATION_ERROR: 'Compilation error',
    SKIPPED: 'Skipped',
    CHALLENGED: 'Hacked',
    PARTIAL: 'Partial',
    IDLENESS_LIMIT_EXCEEDED: 'Idleness limit exceeded',
    PRESENTATION_ERROR: 'Presentation error',
    TESTING: 'Testing',
    UNKNOWN: 'Unknown'
  };
  const difficultyOrder = ['<1200', '1200-1399', '1400-1599', '1600-1799', '1800-1999', '2000-2199', '2200-2399', '2400+', 'Unrated'];
  const difficultyBucket = (rating) => {
    if (typeof rating !== 'number' || Number.isNaN(rating)) return 'Unrated';
    if (rating < 1200) return '<1200';
    if (rating >= 2400) return '2400+';
    const low = Math.floor(rating / 200) * 200;
    return `${low}-${low + 199}`;
  };

  const setStatus = (state, text) => {
    statusEl.className = `cf-status is-${state}`;
    $('cf-status-text').textContent = text;
  };

  const fetchJson = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    const payload = await response.json();
    if (payload.status !== 'OK') throw new Error(payload.comment || 'Codeforces API returned an error');
    return payload.result;
  };

  // Count a headline number up from zero; falls back to plain text.
  const setNumber = (el, value) => {
    if (typeof value !== 'number' || reducedMotion) {
      el.textContent = typeof value === 'number' ? value.toLocaleString('en-US') : value;
      return;
    }
    const started = performance.now();
    const duration = 900;
    const step = (now) => {
      const t = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = Math.round(value * eased).toLocaleString('en-US');
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const capitalise = (text) => (text ? text.replace(/\b\w/g, (c) => c.toUpperCase()) : '');
  const monthYear = (ms) => new Date(ms).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  const fullDate = (ms) => new Date(ms).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const dayKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  // "GNU G++17 7.3.0" and "C++20 (GCC 13-64)" are both C++ for this purpose.
  const simplifyLanguage = (name = 'Unknown') => {
    if (/\+\+/.test(name)) return 'C++';
    if (/py/i.test(name)) return 'Python';
    if (/java(?!script)/i.test(name)) return 'Java';
    if (/javascript|node/i.test(name)) return 'JavaScript';
    if (/kotlin/i.test(name)) return 'Kotlin';
    if (/rust/i.test(name)) return 'Rust';
    if (/\bgo\b/i.test(name)) return 'Go';
    if (/c#/i.test(name)) return 'C#';
    if (/\bc\d*\b|gnu c/i.test(name)) return 'C';
    return name;
  };
  const signed = (n) => (n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : '0');
  const el = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };

  /* Calendar heatmap, recent contests and hardest problems ----------------- */

  const renderActivity = () => {
    const grid = $('cf-heat-grid');
    const months = $('cf-heat-months');
    grid.replaceChildren();
    months.replaceChildren();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - 52 * 7 - today.getDay());   // back to a Sunday, 53 columns
    const cells = [];
    for (const day = new Date(start); day <= today; day.setDate(day.getDate() + 1)) {
      cells.push({ date: new Date(day), count: model.days.get(dayKey(day)) || 0 });
    }
    const peak = Math.max(1, ...cells.map((cell) => cell.count));
    const level = (count) => (count === 0 ? 0 : Math.min(4, Math.ceil((count / peak) * 4)));
    const describe = (cell) => `${cell.count} submission${cell.count === 1 ? '' : 's'} on ${fullDate(cell.date.getTime())}`;
    // One tab stop for the whole calendar; arrow keys move day by day or week by week.
    let current = cells.length - 1;
    const select = (index) => {
      grid.children[current]?.classList.remove('is-current');
      current = Math.max(0, Math.min(cells.length - 1, index));
      grid.children[current].classList.add('is-current');
      $('cf-heat-detail').textContent = describe(cells[current]);
    };
    grid.tabIndex = 0;
    grid.onkeydown = (event) => {
      const step = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1, Home: -cells.length, End: cells.length }[event.key];
      if (step === undefined) return;
      event.preventDefault();
      select(current + step);
    };
    grid.onfocus = () => select(current);
    let lastMonth = -1;
    cells.forEach((cell, index) => {
      const node = el('i');
      node.dataset.level = level(cell.count);
      node.title = describe(cell);
      node.addEventListener('pointerenter', () => { $('cf-heat-detail').textContent = describe(cell); });
      node.addEventListener('click', () => select(index));
      grid.append(node);
      if (index % 7 === 0) {
        const month = cell.date.getMonth();
        const label = el('span', month !== lastMonth && cell.date.getDate() <= 7 ? cell.date.toLocaleDateString('en-US', { month: 'short' }) : '');
        if (label.textContent) lastMonth = month;
        months.append(label);
      }
    });

    const active = cells.filter((cell) => cell.count > 0);
    let streak = 0, longest = 0;
    for (const cell of cells) {
      streak = cell.count > 0 ? streak + 1 : 0;
      longest = Math.max(longest, streak);
    }
    const total = active.reduce((sum, cell) => sum + cell.count, 0);
    $('cf-activity-note').textContent = `${total.toLocaleString('en-US')} submissions on ${active.length} active days in the last 12 months · longest streak ${longest} day${longest === 1 ? '' : 's'}.`;
  };

  const renderContests = () => {
    const body = $('cf-contests').tBodies[0];
    body.replaceChildren();
    const recent = model.rating.slice(-8).reverse();
    if (recent.length === 0) {
      const cell = el('td', 'No rated contests yet.');
      cell.colSpan = 4;
      body.append(el('tr')).append(cell);
      return;
    }
    for (const contest of recent) {
      const row = el('tr');
      const name = el('td');
      const link = el('a', contest.contest);
      link.href = `https://codeforces.com/contest/${contest.contestId}`;
      link.rel = 'noopener';
      name.append(link, el('span', fullDate(contest.time), 'cf-table__date'));
      const change = el('td', signed(contest.delta), `num ${contest.delta > 0 ? 'is-up' : contest.delta < 0 ? 'is-down' : ''}`);
      row.append(name, el('td', contest.rank.toLocaleString('en-US'), 'num'), change, el('td', contest.rating.toLocaleString('en-US'), 'num'));
      body.append(row);
    }
  };

  const renderProblems = () => {
    const list = $('cf-problems');
    list.replaceChildren();
    if (model.hardest.length === 0) {
      list.append(el('li', 'No rated solved problems yet.'));
      return;
    }
    for (const problem of model.hardest) {
      const item = el('li');
      const link = el('a', `${problem.contestId}${problem.index} · ${problem.name}`);
      link.href = `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`;
      link.rel = 'noopener';
      const main = el('span', undefined, 'cf-problems__main');
      main.append(link);
      if (problem.tags.length > 0) main.append(el('span', problem.tags.join(' · '), 'cf-problems__tags'));
      item.append(main, el('span', String(problem.rating), 'cf-problems__rating'));
      list.append(item);
    }
  };

  /* Charts ---------------------------------------------------------------- */

  const charts = [];
  let model = null;

  const tokens = () => {
    const style = getComputedStyle(document.documentElement);
    const read = (name) => style.getPropertyValue(name).trim();
    return {
      ink: read('--ink'), ink2: read('--ink-2'), ink3: read('--ink-3'), line: read('--line'),
      surface: read('--bg-raised'), bg: read('--bg'),
      series1: read('--chart-1'), series2: read('--chart-2'), good: read('--chart-good'),
      sans: read('--font-sans')
    };
  };

  const draw = () => {
    if (!model || typeof Chart === 'undefined') return;
    while (charts.length) charts.pop().destroy();
    const c = tokens();

    Chart.defaults.font.family = c.sans;
    Chart.defaults.font.size = 12;
    Chart.defaults.color = c.ink2;
    Chart.defaults.borderColor = c.line;
    Chart.defaults.animation = reducedMotion ? false : { duration: 700, easing: 'easeOutQuart' };
    Chart.defaults.plugins.legend.display = false;
    Object.assign(Chart.defaults.plugins.tooltip, {
      backgroundColor: c.ink, titleColor: c.bg, bodyColor: c.bg, padding: 10, cornerRadius: 8,
      displayColors: false, titleFont: { weight: '600' }, caretSize: 5
    });

    const grid = { color: c.line, drawTicks: false };
    const noGrid = { display: false };
    const border = { display: false };
    const make = (id, config) => charts.push(new Chart($(id), config));

    if (model.rating.length > 0) {
      make('cf-rating-chart', {
        type: 'line',
        data: {
          datasets: [{
            label: 'Rating',
            data: model.rating.map((r) => ({ x: r.time, y: r.rating })),
            borderColor: c.series1, borderWidth: 2, tension: 0.2, clip: false,
            backgroundColor: c.series1 + '1f', fill: true,
            pointRadius: model.rating.length > 60 ? 0 : 3, pointHoverRadius: 6,
            pointBackgroundColor: c.series1, pointBorderColor: c.surface, pointBorderWidth: 2, pointHitRadius: 12
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, layout: { padding: { top: 8, right: 8 } },
          interaction: { mode: 'nearest', axis: 'x', intersect: false },
          plugins: {
            tooltip: {
              callbacks: {
                title: (items) => model.rating[items[0].dataIndex].contest,
                label: (item) => {
                  const r = model.rating[item.dataIndex];
                  const delta = r.delta > 0 ? `+${r.delta}` : `${r.delta}`.replace('-', '−');
                  return [`Rating ${r.rating} (${delta})`, `Rank ${r.rank} · ${fullDate(r.time)}`];
                }
              }
            }
          },
          scales: {
            x: { type: 'linear', min: model.rating[0].time, max: model.rating[model.rating.length - 1].time, offset: false, grid: noGrid, border, ticks: { maxTicksLimit: 7, maxRotation: 0, callback: (value) => monthYear(value) } },
            y: { grid, border, ticks: { precision: 0, padding: 8 } }
          }
        }
      });
    }

    const horizontalBars = (id, entries, colors, unit) => make(id, {
      type: 'bar',
      data: {
        labels: entries.map(([label]) => label),
        datasets: [{ data: entries.map(([, count]) => count), backgroundColor: colors, borderRadius: 4, borderSkipped: 'start', maxBarThickness: 22 }]
      },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: { tooltip: { callbacks: { label: (item) => `${item.parsed.x.toLocaleString('en-US')} ${unit}` } } },
        scales: {
          x: { beginAtZero: true, grid, border, ticks: { precision: 0, padding: 6 } },
          y: { grid: noGrid, border, ticks: { autoSkip: false, color: c.ink } }
        }
      }
    });

    if (model.verdicts.length > 0) {
      horizontalBars('cf-verdict-chart', model.verdicts, model.verdicts.map(([label]) => (label === verdictLabels.OK ? c.good : c.ink3)), 'submissions');
    }
    if (model.tags.length > 0) {
      horizontalBars('cf-tag-chart', model.tags, c.series1, 'accepted submissions');
    }

    if (model.languages.length > 0) {
      horizontalBars('cf-language-chart', model.languages, c.series1, 'submissions');
    }

    if (model.difficulty.length > 0) {
      const bar = { borderRadius: 4, borderSkipped: 'start', maxBarThickness: 18, categoryPercentage: 0.7, barPercentage: 0.9 };
      make('cf-difficulty-chart', {
        type: 'bar',
        data: {
          labels: model.difficulty.map((d) => d.label),
          datasets: [
            { label: 'Solved Problems', data: model.difficulty.map((d) => d.solved), backgroundColor: c.series1, ...bar },
            { label: 'Attempted Problems', data: model.difficulty.map((d) => d.attempted), backgroundColor: c.series2, ...bar }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: { tooltip: { displayColors: true, boxWidth: 8, boxHeight: 8, boxPadding: 4, callbacks: { title: (items) => `Difficulty ${items[0].label}` } } },
          scales: {
            x: { grid: noGrid, border, ticks: { autoSkip: false, maxRotation: 45 } },
            y: { beginAtZero: true, grid, border, ticks: { precision: 0, padding: 8 } }
          }
        }
      });
    }
  };

  /* Data ------------------------------------------------------------------ */

  const analyse = (profile, ratingHistory, submissions) => {
    const solved = new Set();
    const verdictCounts = new Map();
    const tagCounts = new Map();
    const buckets = new Map();
    const languageCounts = new Map();
    const dayCounts = new Map();
    const solvedProblems = new Map();

    for (const submission of submissions) {
      const language = simplifyLanguage(submission.programmingLanguage);
      languageCounts.set(language, (languageCounts.get(language) || 0) + 1);
      const day = dayKey(new Date(submission.creationTimeSeconds * 1000));
      dayCounts.set(day, (dayCounts.get(day) || 0) + 1);

      const verdict = submission.verdict || 'UNKNOWN';
      verdictCounts.set(verdict, (verdictCounts.get(verdict) || 0) + 1);

      const problem = submission.problem || {};
      const key = problem.contestId && problem.index ? `${problem.contestId}-${problem.index}` : undefined;
      const bucket = difficultyBucket(Number.isFinite(problem.rating) ? problem.rating : undefined);
      if (!buckets.has(bucket)) buckets.set(bucket, { attempted: new Set(), solved: new Set() });
      const entry = buckets.get(bucket);
      if (key) entry.attempted.add(key);

      if (verdict === 'OK') {
        if (key) entry.solved.add(key);
        solved.add(key || `${submission.id}`);
        if (key && Number.isFinite(problem.rating) && !solvedProblems.has(key)) {
          solvedProblems.set(key, { name: problem.name, rating: problem.rating, contestId: problem.contestId, index: problem.index, tags: (problem.tags || []).slice(0, 3) });
        }
        for (const tag of problem.tags || []) tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    }

    const sortedVerdicts = Array.from(verdictCounts.entries()).sort((a, b) => b[1] - a[1]);
    const verdicts = sortedVerdicts.slice(0, 6).map(([verdict, count]) => [verdictLabels[verdict] || capitalise(verdict.replace(/_/g, ' ').toLowerCase()), count]);
    const rest = sortedVerdicts.slice(6).reduce((sum, [, count]) => sum + count, 0);
    if (rest > 0) verdicts.push(['Other', rest]);

    return {
      profile,
      total: submissions.length,
      accepted: verdictCounts.get('OK') || 0,
      solved: solved.size,
      rating: ratingHistory.map((entry) => ({
        time: entry.ratingUpdateTimeSeconds * 1000, rating: entry.newRating, delta: entry.newRating - entry.oldRating,
        contest: entry.contestName, rank: entry.rank, contestId: entry.contestId
      })),
      verdicts,
      languages: Array.from(languageCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6),
      days: dayCounts,
      hardest: Array.from(solvedProblems.values()).sort((a, b) => b.rating - a.rating).slice(0, 6),
      tags: Array.from(tagCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10),
      difficulty: difficultyOrder.filter((label) => buckets.has(label)).map((label) => ({
        label, solved: buckets.get(label).solved.size, attempted: buckets.get(label).attempted.size
      }))
    };
  };

  // An accessible alternative to each chart: the same numbers as a table.
  const dataTable = (canvasId, headers, rows) => {
    const card = $(canvasId).closest('.chart-card');
    let details = card.querySelector('.chart-data');
    if (!details) {
      details = el('details', undefined, 'chart-data');
      details.append(el('summary', 'View data as table'));
      card.append(details);
    }
    const table = el('table');
    const head = table.createTHead().insertRow();
    headers.forEach((header, index) => {
      const cell = el('th', header, index ? 'num' : '');
      cell.scope = 'col';
      head.append(cell);
    });
    const body = table.createTBody();
    for (const row of rows) {
      const line = body.insertRow();
      row.forEach((value, index) => line.append(el('td', typeof value === 'number' ? value.toLocaleString('en-US') : value, index ? 'num' : '')));
    }
    const wrap = el('div', undefined, 'cf-table-wrap');
    wrap.append(table);
    details.querySelector('.cf-table-wrap')?.remove();
    details.append(wrap);
  };

  // Fill every panel from one data set. `animate` is used for the first paint only.
  const present = ({ user, rating, submissions }, animate) => {
    model = analyse(user || {}, rating, submissions);
    dashboard.classList.remove('is-loading');
    const number = (node, value) => {
      if (animate) setNumber(node, value);
      else node.textContent = typeof value === 'number' ? value.toLocaleString('en-US') : value;
    };

    const { profile } = model;
    number($('cf-current-rating'), profile.rating ?? 'Unrated');
    number($('cf-max-rating'), profile.maxRating ?? 'Unrated');
    number($('cf-total-submissions'), model.total);
    number($('cf-solved-count'), model.solved);
    $('cf-current-rank').textContent = capitalise(profile.rank);
    $('cf-max-rank').textContent = capitalise(profile.maxRank);
    $('cf-submission-note').textContent = model.total >= submissionLimit ? `Most recent ${submissionLimit.toLocaleString('en-US')}` : `${model.accepted.toLocaleString('en-US')} accepted`;
    $('cf-solved-note').textContent = 'Distinct problems';
    if (model.rating.length > 0) $('cf-rating-note').textContent = `Rating after each of ${model.rating.length} rated contests.`;

    const contests = model.rating;
    number($('cf-contest-count'), contests.length);
    if (contests.length > 0) {
      const best = contests.reduce((a, b) => (b.rank < a.rank ? b : a));
      const gain = contests.reduce((a, b) => (b.delta > a.delta ? b : a));
      $('cf-contest-note').textContent = `Since ${monthYear(contests[0].time)}`;
      number($('cf-best-rank'), best.rank);
      $('cf-best-rank-note').textContent = best.contest;
      $('cf-best-gain').textContent = signed(gain.delta);
      $('cf-best-gain-note').textContent = gain.contest;
    } else {
      $('cf-best-rank').textContent = '—';
      $('cf-best-gain').textContent = '—';
    }
    $('cf-accept-rate').textContent = model.total > 0 ? `${((model.accepted / model.total) * 100).toFixed(1)}%` : '—';
    $('cf-accept-note').textContent = `${model.accepted.toLocaleString('en-US')} of ${model.total.toLocaleString('en-US')} submissions`;

    renderActivity();
    renderContests();
    renderProblems();
    dataTable('cf-rating-chart', ['Contest', 'Date', 'Rank', 'Change', 'Rating'], contests.map((r) => [r.contest, fullDate(r.time), r.rank, signed(r.delta), r.rating]));
    dataTable('cf-verdict-chart', ['Verdict', 'Submissions'], model.verdicts);
    dataTable('cf-difficulty-chart', ['Difficulty', 'Solved', 'Attempted'], model.difficulty.map((d) => [d.label, d.solved, d.attempted]));
    dataTable('cf-tag-chart', ['Tag', 'Accepted submissions'], model.tags);
    dataTable('cf-language-chart', ['Language', 'Submissions'], model.languages);
    draw();
  };

  const withTimeout = (promise, ms) => new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timed out')), ms);
    promise.then((value) => { clearTimeout(timer); resolve(value); }, (error) => { clearTimeout(timer); reject(error); });
  });

  // The saved snapshot paints first; live API data replaces it when reachable.
  const init = async () => {
    if (typeof Chart === 'undefined') {
      dashboard.classList.remove('is-loading');
      setStatus('error', 'Failed to load data: Chart library unavailable');
      return;
    }
    let shown = null;      // 'snapshot' | 'live'
    let snapshotDate = '';

    const snapshot = fetch(dashboard.dataset.snapshot, { cache: 'no-cache' })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`Snapshot ${response.status}`))))
      .then(async (data) => {
        await document.fonts.ready;
        snapshotDate = fullDate(data.fetchedAt * 1000);
        if (shown) return;
        present(data, true);
        shown = 'snapshot';
        setStatus('loading', `Showing the snapshot from ${snapshotDate} · checking for live data…`);
      })
      .catch((error) => console.warn('Codeforces snapshot unavailable:', error.message));

    try {
      const [userInfo, ratingHistory, submissions] = await withTimeout(Promise.all([
        fetchJson(api('user.info', `handles=${handle}`)),
        fetchJson(api('user.rating', `handle=${handle}`)),
        fetchJson(api('user.status', `handle=${handle}&from=1&count=${submissionLimit}`))
      ]), 12000);
      await document.fonts.ready;
      present({ user: userInfo[0], rating: ratingHistory, submissions }, shown === null);
      shown = 'live';
      setStatus('ready', `Live data · updated ${new Date().toLocaleString()}`);
    } catch (error) {
      await snapshot;
      if (shown === 'snapshot') {
        setStatus('snapshot', `Snapshot from ${snapshotDate} · the live Codeforces API could not be reached from your network`);
      } else {
        dashboard.classList.remove('is-loading');
        setStatus('error', `Failed to load data: ${error.message}`);
      }
      console.warn('Codeforces live data unavailable:', error.message);
    }
  };

  document.addEventListener('themechange', draw);
  init();
})();
