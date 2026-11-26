// Router and page controls for the Arunaya statistics site.
// Hash routes: #/ (home), #/population, #/economy, #/regions,
// #/releases, #/methodology. Every control on every page works
// without a network request: tabs, sort, filter and year switches
// re-render from the data already on the page.

(function () {
  var app = document.getElementById("app");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));

  function parseHash() {
    var raw = window.location.hash.replace(/^#\/?/, "");
    var parts = raw.split("/");
    var page = parts[0] || "home";
    if (!VIEWS[page]) page = "home";
    return { page: page, arg: parts[1] ? decodeURIComponent(parts[1]) : null };
  }

  function render() {
    var route = parseHash();
    var html;
    if (route.page === "economy") html = economyView(route.arg);
    else if (route.page === "releases") html = releasesView(route.arg);
    else html = VIEWS[route.page]();
    app.innerHTML = html;
    navLinks.forEach(function (a) {
      var target = a.getAttribute("href").replace(/^#\/?/, "") || "home";
      a.classList.toggle("nav-active", target === route.page);
      if (target === route.page) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    wire(route);
    window.scrollTo(0, 0);
    document.title = document.querySelector("h1") ? document.querySelector("h1").textContent + " — Arunaya National Statistics" : "Arunaya National Statistics";
  }

  function wire(route) {
    // Population: switch the age-structure year.
    Array.prototype.forEach.call(document.querySelectorAll("[data-age-year]"), function (btn) {
      btn.addEventListener("click", function () {
        var year = btn.getAttribute("data-age-year");
        document.getElementById("age-chart").innerHTML = hbarChart(AGE_STRUCTURE[year], { label: "Age structure " + year });
        Array.prototype.forEach.call(document.querySelectorAll("[data-age-year]"), function (b) {
          b.classList.toggle("seg-active", b === btn);
        });
      });
    });

    // Economy: switch the indicator chart.
    Array.prototype.forEach.call(document.querySelectorAll("[data-econ]"), function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-econ");
        document.getElementById("econ-chart").innerHTML = economyChart(key);
        Array.prototype.forEach.call(document.querySelectorAll("[data-econ]"), function (b) {
          b.classList.toggle("seg-active", b === btn);
        });
      });
    });

    // Releases: filter by topic.
    Array.prototype.forEach.call(document.querySelectorAll("[data-topic]"), function (btn) {
      btn.addEventListener("click", function () {
        window.location.hash = "#/releases/" + btn.getAttribute("data-topic");
      });
    });

    // Regions: sort the table by column, and filter by name.
    var table = document.getElementById("region-table");
    if (table) {
      var sortKey = null, sortDir = 1;
      Array.prototype.forEach.call(table.querySelectorAll("[data-sort]"), function (btn) {
        btn.addEventListener("click", function () {
          var key = btn.getAttribute("data-sort");
          sortDir = key === sortKey ? -sortDir : 1;
          sortKey = key;
          var rows = PROVINCES.slice().sort(function (a, b) {
            var av = a[key], bv = b[key];
            if (typeof av === "string") return av.localeCompare(bv) * sortDir;
            return (av - bv) * sortDir;
          });
          applyRegionFilter(rows);
          table.querySelectorAll("[data-sort]").forEach(function (b) {
            b.textContent = b.textContent.replace(/ [↑↓↕]$/, "") + (b === btn ? (sortDir === 1 ? " ↑" : " ↓") : " ↕");
          });
        });
      });
      var input = document.getElementById("region-filter");
      var current = PROVINCES.slice();
      input.addEventListener("input", function () { applyRegionFilter(current); });
      function applyRegionFilter(rows) {
        current = rows;
        var q = input.value.trim().toLowerCase();
        var shown = rows.filter(function (p) { return !q || p.name.toLowerCase().indexOf(q) !== -1; });
        table.querySelector("tbody").innerHTML = shown.map(regionRow).join("");
        document.getElementById("region-count").textContent = shown.length + (shown.length === 1 ? " province" : " provinces") + " shown.";
      }
    }
  }

  window.addEventListener("hashchange", render);
  render();
})();
