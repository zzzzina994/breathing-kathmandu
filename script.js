(function () {
  "use strict";

  /* ---- WHO PM2.5 checker ---- */
  var slider = document.getElementById("pm");
  var out = document.getElementById("pm-out");
  var haze = document.getElementById("haze");
  var result = document.getElementById("result");
  var ANNUAL = 5;   // WHO 2021 annual PM2.5 guideline, µg/m³
  var DAILY = 15;   // WHO 2021 24-hour PM2.5 guideline, µg/m³

  function update() {
    var v = Number(slider.value);
    out.textContent = v;
    haze.style.opacity = (0.1 + Math.min(v / 150, 1) * 0.75).toFixed(2);

    var msg, warn = false;
    if (v <= ANNUAL) {
      msg = v + " µg/m³ is at or below both WHO PM2.5 guideline levels (5 annual, 15 for 24 hours).";
    } else if (v <= DAILY) {
      msg = v + " µg/m³ is within the WHO 24-hour level of 15, but above the annual level of 5 if sustained over a year.";
    } else {
      var times = (v / DAILY).toFixed(1);
      msg = v + " µg/m³ is " + times + " times the WHO 24-hour guideline level of 15.";
      warn = true;
    }
    result.textContent = msg;
    result.classList.toggle("warn", warn);
  }
  slider.addEventListener("input", update);
  update();

  /* ---- Solutions tabs ---- */
  var content = {
    transport: "Expand cleaner transport options, support vehicle electrification, improve vehicle inspection and maintenance, and address road dust.",
    industry: "Improve emissions controls, adopt cleaner technologies and fuels, and strengthen compliance with emissions standards.",
    household: "Encourage cleaner cooking technologies and reduce pollution from traditional biomass fuels.",
    monitoring: "Maintain reliable air-quality monitoring, publish accessible data, and use evidence to guide environmental decisions.",
    regional: "Coordinate pollution control across municipalities and countries, because pollutants move across boundaries."
  };
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  var panel = document.getElementById("panel");

  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
    });
    panel.innerHTML = "<p></p>";
    panel.firstChild.textContent = content[tab.id.replace("tab-", "")];
    panel.setAttribute("aria-labelledby", tab.id);
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { select(tab); });
    tab.addEventListener("keydown", function (e) {
      var n = null;
      if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (n) { n.focus(); select(n); e.preventDefault(); }
    });
  });
  select(tabs[0]);
})();
