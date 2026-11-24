// EWM Quest game layer: loader, pallet forklift, XP, drive mode, sound. Needs script.js loaded first.
(function () {
  const $ = (id) => document.getElementById(id);
  let G = {
    xp: 0,
    seen: {},
    quiz: {},
    sound: true,
    drive: false,
    qty: { po: 100, so: 40 },
  };
  try {
    Object.assign(G, JSON.parse(localStorage.getItem("ewm_game") || "{}"));
  } catch (e) {}
  const save = () => {
    try {
      localStorage.setItem("ewm_game", JSON.stringify(G));
    } catch (e) {}
  };
  const RANKS = [
    "Trainee",
    "Picker",
    "Forklift driver",
    "Shift lead",
    "EWM pro",
  ];
  const PER = 200,
    lvl = () => Math.min(RANKS.length, 1 + Math.floor(G.xp / PER));

  // ---- sound (Web Audio, no files) ----
  let AC;
  const beep = (f, d, t = "square", v = 0.05, w = 0) => {
    if (!G.sound) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      const o = AC.createOscillator(),
        g = AC.createGain(),
        s = AC.currentTime + w;
      o.type = t;
      o.frequency.value = f;
      g.gain.value = v;
      o.connect(g);
      g.connect(AC.destination);
      o.start(s);
      g.gain.exponentialRampToValueAtTime(0.001, s + d);
      o.stop(s + d);
    } catch (e) {}
  };
  const sfx = {
    move: () => beep(200, 0.2, "sawtooth", 0.04),
    ok: () => {
      beep(660, 0.1);
      beep(880, 0.15, "square", 0.05, 0.1);
    },
    bad: () => beep(130, 0.3, "sawtooth", 0.06),
    up: () =>
      [523, 659, 784, 1047].forEach((f, i) =>
        beep(f, 0.15, "square", 0.05, i * 0.1),
      ),
  };

  // ---- forklift + pallet image (inline SVG) ----
  const FL = `<svg viewBox="0 0 84 56" aria-hidden="true">
<g><rect x="58" y="22" width="22" height="18" rx="2" fill="#d9a35a" stroke="#7a4e17" stroke-width="1.5"/><path d="M58 31h22M69 22v18" stroke="#7a4e17" stroke-width="1.2"/></g>
<g fill="#b9772c" stroke="#6b4210"><rect x="56" y="40" width="26" height="3"/><rect x="56" y="45" width="26" height="3"/><rect x="58" y="43" width="4" height="2"/><rect x="68" y="43" width="4" height="2"/><rect x="77" y="43" width="4" height="2"/></g>
<rect x="52" y="6" width="4" height="40" fill="#3a3f47"/>
<rect x="3" y="26" width="11" height="17" rx="2" fill="#2b2f36"/>
<rect x="10" y="26" width="40" height="17" rx="4" fill="#f5b800" stroke="#7a5a00"/>
<path d="M16 26V8h26l4 18" fill="none" stroke="#3a3f47" stroke-width="3"/>
<circle cx="28" cy="17" r="4.5" fill="#ffd9b0"/><rect x="23" y="11" width="10" height="3" rx="1.5" fill="#f08a00"/>
<g class="wh"><circle cx="20" cy="47" r="7" fill="#1a1d22"/><path d="M20 41v12M14 47h12" stroke="#888" stroke-width="2"/></g>
<g class="wh"><circle cx="42" cy="48" r="6" fill="#1a1d22"/><path d="M42 42v12M36 48h12" stroke="#888" stroke-width="2"/></g></svg>`;

  // ---- loading page ----
  const tips = [
    "A PO adds no stock. Only goods receipt does.",
    "Delivery missing in EWM? Check SMQ2.",
    "GR zone is 9010, bin is 0010, GI zone is 9020.",
    "Turn on Drive mode and drive each pallet yourself.",
  ];
  $("ldbar").parentNode.querySelector(".ld-fl").innerHTML = FL;
  let p = 0;
  const iv = setInterval(() => {
    p = Math.min(100, p + 2 + Math.random() * 5);
    $("ldbar").style.width = p + "%";
    document.querySelector(".ld-fl").style.left = p + "%";
    $("ldtip").textContent = "Tip: " + tips[Math.floor(p / 26) % tips.length];
    if (p >= 100) {
      clearInterval(iv);
      $("start").hidden = false;
      $("start").focus();
    }
  }, 90);
  $("start").onclick = () => {
    document.body.classList.remove("loading");
    $("loader").classList.add("out");
    sfx.up();
    setTimeout(() => $("loader").remove(), 600);
  };

  // ---- HUD ----
  const hud = document.createElement("div");
  hud.id = "hud";
  hud.innerHTML =
    '<b id="lv"></b><div class="xpbar"><i id="xpf"></i></div><span id="xpt"></span><button id="drv"></button><button id="snd" aria-label="Sound"></button>';
  document.querySelector(".top").append(hud);
  function hudUp() {
    const l = lvl(),
      max = l === RANKS.length;
    $("lv").textContent = "LV " + l + " " + RANKS[l - 1];
    $("xpf").style.width = (max ? 100 : ((G.xp % PER) / PER) * 100) + "%";
    $("xpt").textContent = G.xp + " XP";
    $("drv").textContent = "🎮 Drive mode: " + (G.drive ? "on" : "off");
    $("drv").classList.toggle("on", G.drive);
    $("snd").textContent = G.sound ? "🔊" : "🔇";
  }
  $("snd").onclick = () => {
    G.sound = !G.sound;
    save();
    hudUp();
  };
  $("drv").onclick = () => {
    G.drive = !G.drive;
    save();
    hudUp();
    show(idx);
  };

  // ---- effects ----
  function confetti() {
    const c = ["#f5b800", "#19c3a6", "#f08a00", "#4aa3ff", "#ff5d73"];
    for (let i = 0; i < 28; i++) {
      const s = document.createElement("i");
      s.className = "cf";
      s.style.cssText = `left:${50 + (Math.random() - 0.5) * 30}%;background:${c[i % 5]};--dx:${(Math.random() - 0.5) * 600}px;--dy:${-200 - Math.random() * 300}px;--r:${Math.random() * 720}deg`;
      document.body.append(s);
      setTimeout(() => s.remove(), 1400);
    }
  }
  function toast(t) {
    const d = document.createElement("div");
    d.id = "toast";
    d.textContent = t;
    document.body.append(d);
    setTimeout(() => d.remove(), 2200);
  }
  function gain(n) {
    const l0 = lvl();
    G.xp += n;
    save();
    hudUp();
    const tok = $("token"),
      s = document.createElement("span");
    s.className = "pop";
    s.textContent = "+" + n + " XP";
    s.style.left = tok.style.left;
    s.style.top = tok.style.top;
    $("map").append(s);
    setTimeout(() => s.remove(), 1000);
    if (lvl() > l0) {
      sfx.up();
      toast("LEVEL UP! " + RANKS[lvl() - 1]);
      confetti();
    }
  }

  // ---- pallet movement and drive mode ----
  let pending = false;
  function finish() {
    const tk = document.querySelector("#token .tk");
    if (tk && FLAT[idx].m[0] !== FLAT[idx].m[1]) {
      tk.classList.add("drive");
      sfx.move();
      setTimeout(() => tk.classList.remove("drive"), 1300);
    }
    if (!G.seen[idx]) {
      G.seen[idx] = 1;
      gain(10);
    }
  }
  function after() {
    const [from, to, ico] = FLAT[idx].m,
      zf = zones[from],
      zt = zones[to],
      tok = $("token"),
      same = from === to;
    tok.innerHTML = `<div class="tk ${zt.x < zf.x ? "flip" : ""}"><span class="bub">${ico}</span>${FL}</div>`;
    document
      .querySelectorAll(".zone.target")
      .forEach((z) => z.classList.remove("target"));
    pending = false;
    if (G.drive && !same && !timer) {
      tok.style.transition = "none";
      tok.style.left = zf.x + "%";
      tok.style.top = zf.y + "%";
      void tok.offsetWidth;
      tok.style.transition = "";
      pending = true;
      $("next").disabled = true;
      $("z_" + to).classList.add("target");
      $("info").textContent =
        "🎯 Click the glowing place to drive the pallet there.";
    } else finish();
  }
  const _show = show;
  show = function (i) {
    _show(i);
    after();
    profile();
    live();
  };
  $("map").addEventListener("click", (e) => {
    if (!pending) return;
    const z = e.target.closest(".zone");
    if (!z) return;
    if (!z.classList.contains("target")) {
      z.classList.remove("shake");
      void z.offsetWidth;
      z.classList.add("shake");
      sfx.bad();
      return;
    }
    pending = false;
    z.classList.remove("target");
    const t = zones[FLAT[idx].m[1]],
      tok = $("token");
    tok.style.left = t.x + "%";
    tok.style.top = t.y + "%";
    $("next").disabled = idx === FLAT.length - 1;
    $("info").textContent = "✅ Delivered. Press Next action.";
    finish();
  });

  // ---- quiz rewards ----
  document.addEventListener("click", (e) => {
    const o = e.target.closest(".opt");
    if (!o) return;
    const a = quiz[curStep],
      d = DETAILS[curStep];
    if (a === undefined) return;
    if (a === d.q[2]) {
      if (!G.quiz[curStep]) {
        G.quiz[curStep] = 1;
        gain(50);
      }
      confetti();
      sfx.ok();
    } else {
      const tb = $("tabbody");
      tb.classList.remove("shake");
      void tb.offsetWidth;
      tb.classList.add("shake");
      sfx.bad();
    }
  });

  // ---- "Your company" panel under the map ----
  const REV = {
    "0-0": ["Company name", "BMW India Company"],
    "0-1": ["Company code", C],
    "1-0": ["Plant", C],
    "1-1": ["Sales org", C],
    "1-2": ["Channel / division", "01 / 01"],
    "1-3": ["Sales office", "Created"],
    "1-4": ["Sales group", "Created"],
    "2-0": ["Storage locations", "1000, 5000, 6000"],
    "2-1": ["Purchasing org", "Created"],
    "2-2": ["Warehouse no.", C],
    "2-3": ["Shipping point", C],
    "5-0": ["Material", "BMW Spare Parts"],
    "6-0": ["Vendor", "Bosch Auto Parts"],
    "7-0": ["Customer", "Infinity Cars"],
    "10-1": ["Supply chain unit", "BMWISCU"],
  };
  const KEYS = [...new Set(Object.values(REV).map((v) => v[0]))];
  const prof = document.createElement("div");
  prof.id = "prof";
  prof.innerHTML =
    "<h3>Your company</h3><div class='chips'>" +
    KEYS.map((k) => `<div class="chip" data-k="${k}">${k}<b>-</b></div>`).join(
      "",
    ) +
    "</div>";
  $("map").after(prof);
  function profile() {
    const v = {};
    for (let k = 0; k <= idx; k++) {
      const r = REV[FLAT[k].si + "-" + FLAT[k].mi];
      if (r) v[r[0]] = r[1];
    }
    prof.querySelectorAll(".chip").forEach((c) => {
      const val = v[c.dataset.k],
        was = c.classList.contains("on");
      c.classList.toggle("on", !!val);
      c.classList.remove("new");
      c.querySelector("b").textContent = val || "-";
      if (val && !was) {
        void c.offsetWidth;
        c.classList.add("new");
      }
    });
  }

  // ---- quantities: you choose how much to buy and sell ----
  const BASE = JSON.parse(
    JSON.stringify(STEPS.map((s) => s.m.map((m) => [m[3], m[4], m[5]]))),
  );
  function setQty(po, so) {
    STEPS.forEach((s, si) =>
      s.m.forEach((m, mi) => {
        const [t, l, d] = BASE[si][mi],
          r = (x) => x.replace(/\b(100|40)\b/g, (v) => (v === "100" ? po : so));
        m[3] = r(t);
        m[4] = r(l);
        if (d) {
          const o = {};
          for (const k in d) {
            const v = d[k],
              a = Math.abs(v);
            o[k] =
              a === 100 ? Math.sign(v) * po : a === 40 ? Math.sign(v) * so : v;
          }
          m[5] = o;
        }
      }),
    );
  }
  const q = document.createElement("div");
  q.id = "qty";
  q.innerHTML =
    '<label>Buy from Bosch (pcs) <input id="qpo" type="number" min="10" max="500" step="10"></label><label>Infinity Cars orders (pcs) <input id="qso" type="number" min="1" max="500"></label><button id="qgo">Apply</button><span id="qmsg"></span>';
  hud.after(q);
  function applyQty() {
    let po = Math.max(10, Math.min(500, Math.round(+$("qpo").value) || 100)),
      so = Math.max(1, Math.round(+$("qso").value) || 1);
    $("qmsg").textContent = "";
    if (so > po) {
      so = po;
      $("qmsg").textContent =
        "Stock check: you can only sell what you bought, so the order is set to " +
        po +
        ".";
      sfx.bad();
    } else sfx.ok();
    G.qty = { po, so };
    save();
    $("qpo").value = po;
    $("qso").value = so;
    setQty(po, so);
    show(idx);
  }
  $("qgo").onclick = applyQty;
  $("qpo").value = G.qty.po;
  $("qso").value = G.qty.so;

  // ---- real-time feel: typing text, clock times, stock bars ----
  let tw;
  function live() {
    document.querySelectorAll("#log li").forEach((li, k) => {
      const m = 540 + k * 6;
      li.innerHTML =
        `<span class="t">${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}</span> ` +
        li.innerHTML;
    });
    document.querySelectorAll("#stock tr").forEach((tr) => {
      const v = +tr.lastChild.textContent;
      tr.firstChild.insertAdjacentHTML(
        "beforeend",
        `<i class="sb" style="width:${Math.min(100, Math.max(0, (v / G.qty.po) * 100))}%"></i>`,
      );
    });
    clearInterval(tw);
    const el = $("say"),
      t = el.textContent;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let n = 0;
    el.textContent = "";
    tw = setInterval(() => {
      el.textContent = t.slice(0, ++n);
      if (n >= t.length) clearInterval(tw);
    }, 14);
  }

  hudUp();
  setQty(G.qty.po, G.qty.so);
  show(idx);
})();
