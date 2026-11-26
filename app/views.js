// Page views for the Arunaya statistics site. Each view returns an
// HTML string; main.js mounts it and wires the page's controls.

function kpiCard(h) {
  return '<a class="kpi" href="#/' + h.page + '">'
    + '<span class="kpi-value">' + esc(h.value) + '</span>'
    + '<span class="kpi-change">' + esc(h.change) + '</span>'
    + '<span class="kpi-note">' + esc(h.note) + '</span></a>';
}

function figureNote(source) {
  return '<p class="source">Source: ' + esc(source) + ' · ' + NSO.office + '</p>';
}

function homeView() {
  const cards = HEADLINES.map(kpiCard).join("");
  const latest = RELEASES.slice(0, 4).map((r) =>
    '<li><span class="rel-date">' + esc(r.date) + '</span><a href="#/releases">' + esc(r.title) + '</a><span class="rel-note">' + esc(r.note) + '</span></li>'
  ).join("");
  return ''
    + '<section class="hero"><div class="hero-text">'
    + '<p class="eyebrow">Official statistics · ' + NSO.country + '</p>'
    + '<h1>The numbers behind Arunaya, in one place.</h1>'
    + '<p class="lede">Population, prices, jobs and trade — published by the ' + esc(NSO.office) + ', free for everyone to use. Every figure shows its source and year.</p>'
    + '<p class="hero-actions"><a class="btn" href="#/economy">Explore the economy</a><a class="btn btn-ghost" href="#/population">Population in depth</a></p>'
    + '</div><div class="hero-panel"><h2>Real GDP growth, %</h2>'
    + barChart(SERIES.gdpGrowth, { color: "#0e7c7b", height: 260 })
    + figureNote(SERIES.gdpGrowth.source)
    + '</div></section>'
    + '<section><h2 class="section-title">Headline indicators · 2025</h2><div class="kpi-grid">' + cards + '</div></section>'
    + '<section class="two-col"><div><h2 class="section-title">Latest releases</h2><ul class="releases">' + latest + '</ul>'
    + '<p><a class="text-link" href="#/releases">All releases →</a></p></div>'
    + '<div><h2 class="section-title">Where the economy comes from</h2><div class="donut-wrap">' + donut(SECTORS, {}) + '<ul class="legend">'
    + SECTORS.map((s, i) => '<li><span class="swatch" style="background:' + ["#0f2a43", "#0e7c7b", "#e8a33d"][i] + '"></span><strong>' + esc(s.name) + ' — ' + fmt(s.share, 1) + '%</strong><span>' + esc(s.detail) + '</span></li>').join("")
    + '</ul></div>' + figureNote("National Accounts 2025") + '</div></section>';
}

function populationView() {
  const rows = AGE_STRUCTURE[2025].map((a) => '<tr><td>' + esc(a.group) + '</td><td>' + fmt(a.value, 1) + '%</td><td>' + fmt(48.24 * a.value / 100, 2) + 'm</td></tr>').join("");
  return ''
    + '<section><p class="eyebrow">People</p><h1>Population of Arunaya</h1>'
    + '<p class="lede">48.24 million people at mid-2025, growing 0.9% a year. The median age is 31.2 years — Arunaya is still a young country, but the share aged 65 and over has risen from 7.7% in 2015 to 9.0% in 2025.</p></section>'
    + '<section><h2 class="section-title">Population, 2016–2025</h2>'
    + lineChart(SERIES.population, { color: "#0f2a43", height: 300 })
    + figureNote(SERIES.population.source) + '</section>'
    + '<section class="two-col"><div><h2 class="section-title">Age structure</h2>'
    + '<div class="seg" role="group" aria-label="Age structure year">'
    + '<button class="seg-btn" data-age-year="2015">2015</button>'
    + '<button class="seg-btn seg-active" data-age-year="2025">2025</button></div>'
    + '<div id="age-chart">' + hbarChart(AGE_STRUCTURE[2025], { label: "Age structure 2025" }) + '</div>'
    + '<p class="source">Source: Population Estimates 2025 · Share of resident population</p></div>'
    + '<div><h2 class="section-title">Age groups, 2025</h2>'
    + '<table class="tbl"><thead><tr><th>Age group</th><th>Share</th><th>People</th></tr></thead><tbody>' + rows + '</tbody></table>'
    + '<p class="lede-small">Life expectancy reached 74.8 years in 2025 — 77.1 for women and 72.6 for men. Births numbered 612,000 against 348,000 deaths.</p>'
    + figureNote("Vital Statistics 2025") + '</div></section>'
    + '<section><h2 class="section-title">Population by province</h2>'
    + '<p class="lede-small">Telukraya, home to the capital Kota Arun, holds one in five residents. See the full provincial table on the <a class="text-link" href="#/regions">regions page →</a></p></section>';
}

const ECONOMY_TABS = [
  { key: "gdpGrowth", title: "GDP growth", type: "bar" },
  { key: "cpi", title: "Inflation", type: "line" },
  { key: "unemployment", title: "Unemployment", type: "line" },
];

function economyChart(key) {
  const tab = ECONOMY_TABS.find((t) => t.key === key) || ECONOMY_TABS[0];
  const s = SERIES[tab.key];
  const chart = tab.type === "bar" ? barChart(s, { color: "#0e7c7b" }) : lineChart(s, { color: "#0f2a43" });
  return '<h2 class="section-title">' + esc(s.label) + ', 2016–2025</h2>' + chart + figureNote(s.source);
}

function economyView(activeKey) {
  const key = ECONOMY_TABS.some((t) => t.key === activeKey) ? activeKey : "gdpGrowth";
  const tabs = ECONOMY_TABS.map((t) =>
    '<button class="seg-btn' + (t.key === key ? ' seg-active' : '') + '" data-econ="' + t.key + '">' + esc(t.title) + '</button>'
  ).join("");
  const tradeRows = TRADE.partners.map((p) =>
    '<tr><td>' + esc(p.name) + '</td><td>' + fmt(p.share, 1) + '%</td></tr>'
  ).join("");
  return ''
    + '<section><p class="eyebrow">Economy</p><h1>The economy in 2025</h1>'
    + '<p class="lede">GDP of 412.6 billion ARU, growing 3.9% in real terms. Inflation has eased to 3.1% and unemployment to 5.4% — the lowest since 2019. Exports of 96.4 billion ARU left a trade surplus of 8.3 billion ARU.</p></section>'
    + '<section><div class="seg" role="group" aria-label="Economic indicator">' + tabs + '</div>'
    + '<div id="econ-chart">' + economyChart(key) + '</div></section>'
    + '<section class="two-col"><div><h2 class="section-title">GDP by sector, 2025</h2><div class="donut-wrap">'
    + donut(SECTORS, {}) + '<ul class="legend">'
    + SECTORS.map((s, i) => '<li><span class="swatch" style="background:' + ["#0f2a43", "#0e7c7b", "#e8a33d"][i] + '"></span><strong>' + esc(s.name) + ' — ' + fmt(s.share, 1) + '%</strong><span>' + esc(s.detail) + '</span></li>').join("")
    + '</ul></div>' + figureNote("National Accounts 2025") + '</div>'
    + '<div><h2 class="section-title">Trade partners, 2025</h2>'
    + '<p class="lede-small">Exports 96.4bn ARU · Imports 88.1bn ARU · Surplus 8.3bn ARU</p>'
    + '<table class="tbl"><thead><tr><th>Partner</th><th>Share of exports</th></tr></thead><tbody>' + tradeRows + '</tbody></table>'
    + figureNote("External Trade Statistics, September 2025") + '</div></section>';
}

function regionRow(p) {
  return '<tr><td>' + esc(p.name) + '</td><td>' + esc(p.capital) + '</td><td>' + fmt(p.population, 2) + '</td><td>' + fmt(p.gdpPerCapita, 0) + '</td><td>' + fmt(p.unemployment, 1) + '%</td><td>' + fmt(p.density, 0) + '</td></tr>';
}

function regionsView() {
  const rows = PROVINCES.map(regionRow).join("");
  return ''
    + '<section><p class="eyebrow">Places</p><h1>Regions of Arunaya</h1>'
    + '<p class="lede">Eight provinces, from the capital region of Telukraya (9.84 million people, GDP per capita 14,230 ARU) to the sparsely settled Daratan Utara. Click a column heading to sort the table; type in the box to filter by province name.</p></section>'
    + '<section><div class="filter-row"><label for="region-filter">Filter provinces</label>'
    + '<input id="region-filter" type="search" placeholder="Type a province name…" autocomplete="off"></div>'
    + '<table class="tbl sortable" id="region-table"><thead><tr>'
    + '<th><button data-sort="name">Province ↕</button></th>'
    + '<th><button data-sort="capital">Capital ↕</button></th>'
    + '<th><button data-sort="population">Population (m) ↕</button></th>'
    + '<th><button data-sort="gdpPerCapita">GDP per capita (ARU) ↕</button></th>'
    + '<th><button data-sort="unemployment">Unemployment ↕</button></th>'
    + '<th><button data-sort="density">Density /km² ↕</button></th>'
    + '</tr></thead><tbody>' + rows + '</tbody></table>'
    + '<p id="region-count" class="source">8 provinces shown.</p>'
    + figureNote("Regional Accounts 2025") + '</section>'
    + '<section><h2 class="section-title">Population share by province</h2>'
    + hbarChart(PROVINCES.map((p) => ({ name: p.name, value: (p.population / 48.24) * 100 })), { label: "Population share by province", color: "#0f2a43" })
    + '<p class="source">Source: Population Estimates 2025 · Share of national population</p></section>';
}

function releasesView(topic) {
  const active = RELEASE_TOPICS.includes(topic) ? topic : "All";
  const chips = RELEASE_TOPICS.map((t) =>
    '<button class="chip' + (t === active ? ' chip-active' : '') + '" data-topic="' + esc(t) + '">' + esc(t) + '</button>'
  ).join("");
  const list = RELEASES.filter((r) => active === "All" || r.topic === active).map((r) =>
    '<li><span class="rel-date">' + esc(r.date) + '</span><span class="rel-topic">' + esc(r.topic) + '</span><strong>' + esc(r.title) + '</strong><span class="rel-note">' + esc(r.note) + '</span></li>'
  ).join("");
  return ''
    + '<section><p class="eyebrow">Publications</p><h1>Release calendar</h1>'
    + '<p class="lede">Every release is published at 09:00 Arunaya time on the day shown. Figures are free to reuse with attribution to the ' + esc(NSO.office) + '.</p></section>'
    + '<section><div class="chips" role="group" aria-label="Filter by topic">' + chips + '</div>'
    + '<ul class="releases" id="release-list">' + list + '</ul>'
    + '<p class="source" id="release-count">' + RELEASES.filter((r) => active === "All" || r.topic === active).length + ' releases shown.</p></section>';
}

function methodologyView() {
  const defs = METHODS.map((m) =>
    '<dt>' + esc(m.term) + '</dt><dd>' + esc(m.text) + '</dd>'
  ).join("");
  return ''
    + '<section><p class="eyebrow">About the figures</p><h1>Methodology &amp; sources</h1>'
    + '<p class="lede">The ' + esc(NSO.office) + ' publishes Arunaya’s official statistics under the Statistics Act 2019. Figures on this site are the published estimates; where a figure is revised, the latest vintage replaces the earlier one and the revision is noted in the release.</p></section>'
    + '<section><h2 class="section-title">Definitions</h2><dl class="defs">' + defs + '</dl></section>'
    + '<section><h2 class="section-title">How to cite</h2>'
    + '<p class="lede-small">“' + esc(NSO.office) + ', <em>Statistical Yearbook 2025</em>.” Data may be reused freely with attribution. The underlying tables for every chart on this site are published alongside each release as open data.</p>'
    + '<p class="lede-small">Reference year 2025 · Last updated ' + esc(NSO.updated) + ' · Contact: publications@statistics.arunaya.example</p></section>';
}

const VIEWS = {
  home: homeView,
  population: populationView,
  economy: economyView,
  regions: regionsView,
  releases: releasesView,
  methodology: methodologyView,
};
