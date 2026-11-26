// Small deterministic SVG chart builders. No library, no network:
// every chart is drawn from the arrays in data.js and rendered as
// inline SVG, so the page works with JavaScript alone and no fetch.

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function niceMax(v) {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  const m = n <= 1 ? 1 : n <= 1.25 ? 1.25 : n <= 1.5 ? 1.5 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 3 ? 3 : n <= 4 ? 4 : n <= 5 ? 5 : n <= 6 ? 6 : n <= 7.5 ? 7.5 : n <= 8 ? 8 : 10;
  return m * p;
}

function niceMin(v) {
  if (v >= 0) return 0;
  return -niceMax(-v);
}

// Line chart with labelled axes, gridlines and value dots.
function lineChart(series, opts) {
  const w = opts.width || 720, h = opts.height || 300;
  const padL = 56, padR = 16, padT = 18, padB = 34;
  const iw = w - padL - padR, ih = h - padT - padB;
  const min = niceMin(Math.min.apply(null, series.values));
  const max = niceMax(Math.max.apply(null, series.values));
  const n = series.values.length;
  const x = (i) => padL + (i * iw) / (n - 1);
  const y = (v) => padT + ih - ((v - min) / (max - min)) * ih;
  const color = opts.color || "#0e7c7b";
  let grid = "";
  const steps = 4;
  for (let s = 0; s <= steps; s++) {
    const v = min + ((max - min) * s) / steps;
    const yy = y(v);
    grid += '<line x1="' + padL + '" y1="' + yy.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + yy.toFixed(1) + '" stroke="#e3e0d8" stroke-width="1"/>';
    grid += '<text x="' + (padL - 8) + '" y="' + (yy + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="#6b7280">' + fmt(v, 1) + '</text>';
  }
  let labels = "";
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0 || i === n - 1) {
      labels += '<text x="' + x(i).toFixed(1) + '" y="' + (h - 10) + '" text-anchor="middle" font-size="11" fill="#6b7280">' + YEARS[i] + '</text>';
    }
  }
  const pts = series.values.map((v, i) => x(i).toFixed(1) + "," + y(v).toFixed(1)).join(" ");
  let dots = "";
  for (let i = 0; i < n; i++) {
    dots += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(series.values[i]).toFixed(1) + '" r="3.5" fill="#fff" stroke="' + color + '" stroke-width="2"/>';
  }
  const last = series.values[n - 1];
  const lastTag = '<text x="' + (x(n - 1) - 4).toFixed(1) + '" y="' + (y(last) - 12).toFixed(1) + '" text-anchor="end" font-size="12" font-weight="700" fill="' + color + '">' + fmt(last, 1) + '</text>';
  return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" role="img" aria-label="' + esc(series.label) + ' 2016 to 2025">'
    + grid
    + '<polyline points="' + pts + '" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>'
    + dots + lastTag + labels + '</svg>';
}

// Vertical bar chart with value labels on top of each bar.
function barChart(series, opts) {
  const w = opts.width || 720, h = opts.height || 300;
  const padL = 56, padR = 16, padT = 26, padB = 34;
  const iw = w - padL - padR, ih = h - padT - padB;
  const min = niceMin(Math.min.apply(null, series.values));
  const max = niceMax(Math.max.apply(null, series.values));
  const n = series.values.length;
  const bw = Math.min(46, (iw / n) * 0.62);
  const x = (i) => padL + (i + 0.5) * (iw / n) - bw / 2;
  const y = (v) => padT + ih - ((v - min) / (max - min)) * ih;
  const zeroY = y(0);
  const color = opts.color || "#0f2a43";
  const negColor = opts.negColor || "#c2410c";
  let grid = "";
  const steps = 4;
  for (let s = 0; s <= steps; s++) {
    const v = min + ((max - min) * s) / steps;
    const yy = y(v);
    grid += '<line x1="' + padL + '" y1="' + yy.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + yy.toFixed(1) + '" stroke="#e3e0d8" stroke-width="1"/>';
    grid += '<text x="' + (padL - 8) + '" y="' + (yy + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="#6b7280">' + fmt(v, 1) + '</text>';
  }
  let bars = "";
  for (let i = 0; i < n; i++) {
    const v = series.values[i];
    const top = Math.min(y(v), zeroY), height = Math.abs(zeroY - y(v));
    const fill = v < 0 ? negColor : color;
    bars += '<rect x="' + x(i).toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.max(height, 1).toFixed(1) + '" rx="3" fill="' + fill + '"/>';
    bars += '<text x="' + (x(i) + bw / 2).toFixed(1) + '" y="' + (top - 6).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="600" fill="#374151">' + fmt(v, 1) + '</text>';
    if (i % 2 === 0 || i === n - 1) {
      bars += '<text x="' + (x(i) + bw / 2).toFixed(1) + '" y="' + (h - 10) + '" text-anchor="middle" font-size="11" fill="#6b7280">' + YEARS[i] + '</text>';
    }
  }
  return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" role="img" aria-label="' + esc(series.label) + ' 2016 to 2025">' + grid + bars + '</svg>';
}

// Horizontal bars for shares (age structure, trade partners).
function hbarChart(rows, opts) {
  const w = opts.width || 720, rowH = opts.rowH || 44, padL = 150, padR = 56, padT = 8;
  const h = padT + rows.length * rowH + 8;
  const max = niceMax(Math.max.apply(null, rows.map((r) => r.value)));
  const color = opts.color || "#0e7c7b";
  let out = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" role="img" aria-label="' + esc(opts.label || "shares") + '">';
  rows.forEach((r, i) => {
    const y = padT + i * rowH;
    const bw = ((w - padL - padR) * r.value) / max;
    out += '<text x="' + (padL - 10) + '" y="' + (y + 20) + '" text-anchor="end" font-size="12" fill="#1f2937">' + esc(r.group || r.name) + '</text>';
    out += '<rect x="' + padL + '" y="' + (y + 6) + '" width="' + bw.toFixed(1) + '" height="18" rx="4" fill="' + color + '"/>';
    out += '<text x="' + (padL + bw + 8).toFixed(1) + '" y="' + (y + 20) + '" font-size="12" font-weight="700" fill="#1f2937">' + fmt(r.value, 1) + '%</text>';
  });
  return out + '</svg>';
}

// Donut for sector shares.
function donut(rows, opts) {
  const size = opts.size || 220, thick = opts.thick || 34;
  const cx = size / 2, cy = size / 2, r = (size - thick) / 2;
  const colors = opts.colors || ["#0f2a43", "#0e7c7b", "#e8a33d", "#7c9ab5", "#c2410c"];
  const total = rows.reduce((a, b) => a + b.share, 0);
  let offset = 25; // start at top
  let arcs = "";
  rows.forEach((row, i) => {
    const frac = row.share / total;
    const len = 2 * Math.PI * r * frac;
    const dash = Math.max(len - 2, 1).toFixed(1) + " " + (2 * Math.PI * r - Math.max(len - 2, 1)).toFixed(1);
    arcs += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + colors[i % colors.length] + '" stroke-width="' + thick + '" stroke-dasharray="' + dash + '" stroke-dashoffset="' + (-offset).toFixed(1) + '"/>';
    offset += len;
  });
  const center = '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="24" font-weight="800" fill="#0f2a43">100%</text>'
    + '<text x="' + cx + '" y="' + (cy + 18) + '" text-anchor="middle" font-size="11" fill="#6b7280">of GDP, 2025</text>';
  return '<svg viewBox="0 0 ' + size + ' ' + size + '" width="' + size + '" height="' + size + '" role="img" aria-label="GDP by sector">' + arcs + center + '</svg>';
}
