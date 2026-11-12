/* ==========================================================================
   Site behaviour: theme, navigation, scroll effects and on-demand libraries.
   Dependency-free; built to assets/js/main.min.js with `npm run build:js`.
   ========================================================================== */

const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

/* Theme ------------------------------------------------------------------- */

const storedTheme = () => {
  try {
    const value = localStorage.getItem("theme");
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
};

const currentTheme = () => (root.getAttribute("data-theme") === "dark" ? "dark" : "light");

const applyTheme = (theme) => {
  root.setAttribute("data-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#151412" : "#faf9f5");
  document.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
};

// Swap themes behind a circular reveal that grows from the toggle, where the
// browser supports view transitions and the visitor has not asked for less motion.
const switchTheme = (theme, origin) => {
  if (!document.startViewTransition || reducedMotion.matches) {
    applyTheme(theme);
    return;
  }
  const rect = origin ? origin.getBoundingClientRect() : null;
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth;
  const y = rect ? rect.top + rect.height / 2 : 0;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  root.style.setProperty("--theme-x", `${x}px`);
  root.style.setProperty("--theme-y", `${y}px`);
  root.style.setProperty("--theme-r", `${radius}px`);
  root.classList.add("theme-switching");
  const transition = document.startViewTransition(() => applyTheme(theme));
  transition.finished.finally(() => root.classList.remove("theme-switching"));
};

const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode: the choice simply lasts for this page */
    }
    switchTheme(next, themeToggle);
  });
}

// Follow the operating system until the visitor makes an explicit choice.
systemDark.addEventListener("change", (event) => {
  if (!storedTheme()) applyTheme(event.matches ? "dark" : "light");
});

/* Navigation -------------------------------------------------------------- */

const masthead = document.querySelector("[data-masthead]");
const menuToggle = document.querySelector("[data-menu-toggle]");

if (masthead && menuToggle) {
  const setOpen = (open) => {
    masthead.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  };
  menuToggle.addEventListener("click", () => setOpen(!masthead.classList.contains("is-open")));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && masthead.classList.contains("is-open")) {
      setOpen(false);
      menuToggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (masthead.classList.contains("is-open") && !masthead.contains(event.target)) setOpen(false);
  });
  window.matchMedia("(min-width: 760px)").addEventListener("change", () => setOpen(false));
}

/* Scroll reveal ----------------------------------------------------------- */

// Elements already on screen keep their CSS entrance; those below the fold are
// parked and shown once they are at or above the bottom of the viewport. Checking
// position (rather than waiting for an intersection) means a jump straight to a
// later section never leaves skipped-over content hidden.
const parked = [];
const revealPassed = () => {
  const limit = window.innerHeight * 0.94;
  for (let i = parked.length - 1; i >= 0; i -= 1) {
    if (parked[i].getBoundingClientRect().top < limit) {
      parked[i].classList.add("is-in");
      parked.splice(i, 1);
    }
  }
};
if (!reducedMotion.matches) {
  const revealTargets =
    "[data-reveal], .cv .page__content > h2, .cv .page__content > p, .cv .page__content > ul > li, .cv .download-card";
  for (const element of document.querySelectorAll(revealTargets)) {
    if (element.getBoundingClientRect().top > window.innerHeight) {
      element.classList.add("reveal");
      parked.push(element);
    }
  }
  window.addEventListener("resize", revealPassed, { passive: true });
}

/* Scroll state: masthead border and the back-to-top button ----------------- */

const toTop = document.createElement("button");
toTop.type = "button";
toTop.className = "icon-btn to-top";
toTop.setAttribute("aria-label", "Back to top");
toTop.innerHTML =
  '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
});
document.body.append(toTop);

let scrollQueued = false;
const onScroll = () => {
  scrollQueued = false;
  const y = window.scrollY;
  if (masthead) masthead.classList.toggle("is-scrolled", y > 8);
  toTop.classList.toggle("is-visible", y > window.innerHeight * 1.2);
  if (parked.length > 0) revealPassed();
};
window.addEventListener(
  "scroll",
  () => {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(onScroll);
    }
  },
  { passive: true }
);
onScroll();

/* Long-form content: tables, heading anchors and the section index --------- */

const content = document.querySelector(".page__content");

if (content) {
  // Let wide tables scroll inside their own frame instead of the page.
  for (const table of content.querySelectorAll("table")) {
    if (table.closest(".table-wrap, .highlight")) continue;
    const wrap = document.createElement("div");
    wrap.className = "table-wrap";
    table.before(wrap);
    wrap.append(table);
  }

  // CV entries: turn the "Role | Place | Dates" line into separate chips.
  if (document.body.classList.contains("cv")) {
    for (const meta of content.querySelectorAll(":scope > ul > li > em, :scope > ul > li > p:first-child > em")) {
      const parts = meta.textContent.split(" | ");
      if (parts.length < 2 || meta.children.length > 0) continue;
      meta.classList.add("cv-meta");
      meta.replaceChildren(
        ...parts.map((part) => {
          const chip = document.createElement("span");
          chip.className = "cv-meta__item";
          chip.textContent = part.trim();
          return chip;
        })
      );
    }
  }

  const headings = Array.from(content.querySelectorAll(":scope > h2[id]"));

  for (const heading of headings) {
    const anchor = document.createElement("a");
    anchor.className = "heading-anchor";
    anchor.href = `#${heading.id}`;
    anchor.textContent = "#";
    anchor.setAttribute("aria-label", `Link to “${heading.textContent.trim()}”`);
    heading.append(anchor);
  }

  const toc = document.querySelector("[data-toc]");
  if (toc && headings.length > 1) {
    const list = toc.querySelector("ol");
    const links = new Map();
    for (const heading of headings) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.textContent = heading.firstChild ? heading.firstChild.textContent.trim() : heading.id;
      item.append(link);
      list.append(item);
      links.set(heading, link);
    }
    toc.hidden = false;

    // Highlight the last heading that has passed under the masthead.
    let active = null;
    const spy = () => {
      const line = (masthead ? masthead.offsetHeight : 0) + 80;
      let current = headings[0];
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= line) current = heading;
        else break;
      }
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = headings[headings.length - 1];
      }
      if (current !== active) {
        if (active) links.get(active).classList.remove("is-active");
        const link = links.get(current);
        link.classList.add("is-active");
        active = current;
        // In the horizontal (narrow-screen) index, keep the active chip in view.
        if (list.scrollWidth > list.clientWidth) {
          list.scrollTo({
            left: link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2,
            behavior: reducedMotion.matches ? "auto" : "smooth",
          });
        }
      }
    };
    let spyQueued = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!spyQueued) {
          spyQueued = true;
          requestAnimationFrame(() => {
            spyQueued = false;
            spy();
          });
        }
      },
      { passive: true }
    );
    spy();
  }
}

/* On-demand libraries ----------------------------------------------------- */

const loadScript = (src, attributes = {}) =>
  new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    Object.assign(script, attributes);
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.append(script);
  });

// MathJax: only where the page text actually contains TeX delimiters.
if (content && /\\\(|\\\[|\$\$/.test(content.textContent)) {
  loadScript("https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js", { id: "MathJax-script" }).catch(console.error);
}

// Mermaid diagrams written as ```mermaid code blocks.
if (document.querySelector("code.language-mermaid")) {
  import("https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs")
    .then(({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, theme: currentTheme() === "dark" ? "dark" : "default" });
      return mermaid.run({ querySelector: "code.language-mermaid" });
    })
    .catch(console.error);
}

// Plotly charts written as ```plotly code blocks containing a JSON figure.
const plotlyBlocks = Array.from(document.querySelectorAll("pre > code.language-plotly"));
if (plotlyBlocks.length > 0) {
  Promise.all([
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/plotly.js/3.0.1/plotly.min.js"),
    import("/assets/js/theme.js"),
  ])
    .then(([, templates]) => {
      const charts = plotlyBlocks.map((block) => {
        const figure = JSON.parse(block.textContent);
        const pre = block.parentElement;
        pre.classList.add("hidden");
        const target = document.createElement("div");
        pre.after(target);
        return { figure, target };
      });
      const draw = () => {
        const template = currentTheme() === "dark" ? templates.plotlyDarkLayout : templates.plotlyLightLayout;
        for (const { figure, target } of charts) {
          const layout = { ...(figure.layout || {}) };
          layout.template = layout.template ? { ...template, ...layout.template } : template;
          window.Plotly.react(target, figure.data, layout);
        }
      };
      draw();
      document.addEventListener("themechange", draw);
    })
    .catch(console.error);
}
