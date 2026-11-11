// flatten moves
const FLAT = [];
STEPS.forEach((s, si) => s.m.forEach((m, mi) => FLAT.push({ si, mi, m })));
STEPS.forEach((s, si) => {
  s.first = FLAT.findIndex((f) => f.si === si);
});

const $ = (id) => document.getElementById(id);
let idx = -1,
  curStep = -1,
  timer = null,
  zones = {};

// ---------- Step list ----------
let lg = "";
STEPS.forEach((s, i) => {
  if (s.g !== lg) {
    const h = document.createElement("div");
    h.className = "grp";
    h.textContent = s.g;
    $("steps").append(h);
    lg = s.g;
  }
  const b = document.createElement("button");
  b.id = "s" + i;
  b.textContent = s.t;
  b.onclick = () => {
    stop();
    go(s.first);
  };
  $("steps").append(b);
});

// ---------- Map ----------
function build(si) {
  curStep = si;
  const s = STEPS[si];
  zones = s.z || FLOOR;
  document.querySelectorAll(".zone").forEach((z) => z.remove());
  for (const k in zones) {
    const z = zones[k],
      d = document.createElement("div");
    d.className = "zone";
    d.id = "z_" + k;
    d.style.left = z.x + "%";
    d.style.top = z.y + "%";
    d.innerHTML = `<span class="e">${z.e}</span>${z.n}`;
    d.onclick = () => {
      $("info").textContent = z.n + ": " + z.i;
      answer(k, d);
    };
    $("map").append(d);
  }
  $("fields").innerHTML = (s.f || [])
    .map((x) => `<li><label><input type="checkbox"> ${x}</label></li>`)
    .join("");
  renderTab();
  $("phase").textContent = s.g;
  $("title").textContent = s.t;
  $("desc").textContent = s.d;
  $("tcode").textContent = s.tc;
  document
    .querySelectorAll(".steps button")
    .forEach((b) => b.classList.remove("on"));
  $("s" + si).classList.add("on");
  $("s" + si).scrollIntoView({ block: "nearest" });
}
function stockAt(i) {
  const st = { p1000: 0, p5000: 0, gr: 0, bin: 0, pack: 0, truck: 0, cust: 0 };
  for (let k = 0; k <= i; k++) {
    const d = FLAT[k].m[5];
    if (d) for (const x in d) st[x] += d[x];
  }
  return st;
}

function show(i) {
  i = Math.max(0, Math.min(FLAT.length - 1, i));
  const f = FLAT[i],
    [from, to, ico, say, log] = f.m,
    prev = stockAt(i - 1),
    now = stockAt(i);
  if (f.si !== curStep) build(f.si);
  const zf = zones[from],
    zt = zones[to],
    tok = $("token");
  // token starts at 'from' (no animation) then moves to 'to'
  tok.style.transition = "none";
  tok.style.left = zf.x + "%";
  tok.style.top = zf.y + "%";
  tok.textContent = ico;
  void tok.offsetWidth;
  tok.style.transition = "";
  tok.style.left = zt.x + "%";
  tok.style.top = zt.y + "%";
  const ln = $("line");
  ln.setAttribute("x1", zf.x);
  ln.setAttribute("y1", zf.y);
  ln.setAttribute("x2", zt.x);
  ln.setAttribute("y2", zt.y);
  ln.style.display = from === to ? "none" : "";
  document
    .querySelectorAll(".zone")
    .forEach((z) => z.classList.remove("src", "dst"));
  $("z_" + from).classList.add("src");
  $("z_" + to).classList.add("dst");
  $("from").textContent = zf.n;
  $("to").textContent = from === to ? "(same place)" : zt.n;
  $("say").textContent = say;
  // badges
  document.querySelectorAll(".badge").forEach((b) => b.remove());
  if (!STEPS[f.si].z)
    for (const k in ZSTOCK) {
      const v = now[ZSTOCK[k]];
      if (v > 0) {
        const b = document.createElement("span");
        b.className = "badge";
        b.textContent = v;
        $("z_" + k).append(b);
      }
    }
  // stock table
  $("stock").innerHTML = Object.keys(STOCK)
    .map(
      (k) =>
        `<tr class="${prev[k] !== now[k] ? "flash" : ""}"><td>${STOCK[k]}</td><td>${now[k]}</td></tr>`,
    )
    .join("");
  // log = all docs so far
  $("log").innerHTML = FLAT.slice(0, i + 1)
    .map((x) => `<li>${x.m[4]}</li>`)
    .join("");
  $("log").scrollTop = 1e5;
  // progress
  for (let k = 0; k < STEPS.length; k++)
    $("s" + k).classList.toggle("done", k < f.si);
  $("count").textContent = `Action ${i + 1} of ${FLAT.length}`;
  $("bar").style.width = ((i + 1) / FLAT.length) * 100 + "%";
  $("prev").disabled = i === 0;
  $("next").disabled = i === FLAT.length - 1;
  idx = i;
}
function stop() {
  clearInterval(timer);
  timer = null;
  $("auto").textContent = "Auto play";
  $("auto").classList.remove("on");
}
function auto() {
  if (timer) {
    stop();
    return;
  }
  $("auto").textContent = "Pause";
  $("auto").classList.add("on");
  if (idx >= FLAT.length - 1) go(0);
  const tick = () => {
    if (idx >= FLAT.length - 1) {
      stop();
      return;
    }
    go(idx + 1);
  };
  timer = setInterval(tick, [0, 4200, 3200, 2200, 1500][$("speed").value]);
}
$("next").onclick = () => {
  stop();
  go(idx + 1);
};
$("prev").onclick = () => {
  stop();
  go(idx - 1);
};
$("auto").onclick = auto;
$("speed").oninput = () => {
  if (timer) {
    stop();
    auto();
  }
};
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") $("next").click();
  if (e.key === "ArrowLeft") $("prev").click();
});

// ---------- Practice mode, tabs, quiz ----------
let practice = false,
  pending = null,
  ok = 0,
  miss = 0,
  tab = "why",
  quiz = {};
try {
  quiz = JSON.parse(localStorage.getItem("ewm_quiz") || "{}");
} catch (e) {}
function score() {
  $("score").textContent =
    `Quiz ${doneCount()}/${STEPS.length}` +
    (practice ? ` | Practice: ${ok} right, ${miss} wrong` : "");
  STEPS.forEach((st, k) => {
    $("s" + k).textContent =
      (quiz[k] !== undefined && quiz[k] === DETAILS[k].q[2] ? "✔ " : "") + st.t;
  });
}
function go(i) {
  i = Math.max(0, Math.min(FLAT.length - 1, i));
  pending = null;
  const f = FLAT[i];
  if (!practice || f.m[0] === f.m[1]) {
    show(i);
    score();
    return;
  }
  if (f.si !== curStep) build(f.si);
  idx = i;
  pending = { to: f.m[1], i };
  const zf = zones[f.m[0]],
    tok = $("token");
  tok.style.transition = "none";
  tok.style.left = zf.x + "%";
  tok.style.top = zf.y + "%";
  tok.textContent = f.m[2];
  $("line").style.display = "none";
  document
    .querySelectorAll(".zone")
    .forEach((z) => z.classList.remove("src", "dst"));
  $("z_" + f.m[0]).classList.add("src");
  $("from").textContent = zf.n;
  $("to").textContent = "?";
  $("say").textContent =
    "Practice: where does this go next? Click the correct place on the map.";
  $("prev").disabled = i === 0;
  $("next").disabled = false;
  score();
}
function answer(k, d) {
  if (!pending) return;
  if (k === pending.to) {
    const i = pending.i;
    pending = null;
    ok++;
    show(i);
    score();
  } else {
    miss++;
    d.classList.add("wrong");
    setTimeout(() => d.classList.remove("wrong"), 500);
    $("say").textContent =
      "Not that one. Read the step description and try again.";
    score();
  }
}
$("practice").onclick = () => {
  practice = !practice;
  stop();
  $("practice").classList.toggle("on", practice);
  $("practice").textContent = practice ? "Practice mode: on" : "Practice mode";
  go(Math.max(idx, 0));
};
document.querySelectorAll(".tabs button").forEach(
  (b) =>
    (b.onclick = () => {
      tab = b.dataset.t;
      renderTab();
    }),
);
function renderTab() {
  const d = DETAILS[curStep];
  if (!d) return;
  document
    .querySelectorAll(".tabs button")
    .forEach((b) => b.classList.toggle("on", b.dataset.t === tab));
  const el = $("tabbody");
  if (tab === "why") el.innerHTML = "<p>" + d.w + "</p>";
  else if (tab === "err")
    el.innerHTML =
      "<ul>" + d.e.map((x) => "<li>" + x + "</li>").join("") + "</ul>";
  else {
    const a = quiz[curStep],
      r = curStep % 3;
    let opts = d.q[1].map((t, n) => ({ t, n }));
    opts = [...opts.slice(r), ...opts.slice(0, r)]; // vary the position of the right answer
    el.innerHTML =
      "<p><b>" +
      d.q[0] +
      "</b></p>" +
      opts
        .map(
          (o) =>
            `<button class="opt ${a === undefined ? "" : o.n === d.q[2] ? "right" : o.n === a ? "bad" : ""}" data-n="${o.n}">${o.t}</button>`,
        )
        .join("") +
      (a === undefined
        ? ""
        : `<p>${a === d.q[2] ? "Correct!" : "Not quite. The right answer is: <b>" + d.q[1][d.q[2]] + "</b>."} <button id="retry">Try again</button></p>`) +
      `<p class="qfoot">Your quiz score: ${doneCount()} of ${STEPS.length} correct. <button id="qreset">Reset all quiz answers</button></p>`;
    el.querySelectorAll(".opt").forEach(
      (b) =>
        (b.onclick = () => {
          if (quiz[curStep] !== undefined) return;
          quiz[curStep] = +b.dataset.n;
          saveQ();
          renderTab();
          score();
        }),
    );
    if ($("retry"))
      $("retry").onclick = () => {
        delete quiz[curStep];
        saveQ();
        renderTab();
        score();
      };
    $("qreset").onclick = () => {
      quiz = {};
      saveQ();
      renderTab();
      score();
    };
  }
}
function saveQ() {
  try {
    localStorage.setItem("ewm_quiz", JSON.stringify(quiz));
  } catch (e) {}
}
function doneCount() {
  return Object.keys(quiz).filter(
    (k) => DETAILS[k] && quiz[k] === DETAILS[k].q[2],
  ).length;
}
go(0);
