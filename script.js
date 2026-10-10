// ---- Curve constants ----
const P = 17;
const A = 0;
const B = 7;
const G = { x: 1, y: 5 };
const INF = null;

function mod(n) {
  return ((n % P) + P) % P;
}

function inv(a) {
  a = mod(a);
  for (let t = 1; t < P; t++) {
    if ((a * t) % P === 1) return t;
  }
}

function add(p, q) {
  if (p === INF) return q;
  if (q === INF) return p;

  if (p.x === q.x && mod(p.y + q.y) === 0) return INF;

  let m;
  if (p.x === q.x && p.y === q.y) {
    m = mod((3 * p.x * p.x + A) * inv(2 * p.y));
  } else {
    m = mod((q.y - p.y) * inv(q.x - p.x));
  }

  const x3 = mod(m * m - p.x - q.x);
  const y3 = mod(m * (p.x - x3) - p.y);
  return { x: x3, y: y3 };
}

function mul(k, pt) {
  let result = INF;
  let step = pt;
  while (k > 0) {
    if (k & 1) result = add(result, step);
    step = add(step, step);
    k >>= 1;
  }
  return result;
}

function fmt(p) {
  return p === INF ? "O" : `(${p.x}, ${p.y})`;
}

function run() {
  const k = parseInt(document.getElementById("k").value, 10);

  let html = "<table><tr><th>n</th><th>nG</th></tr>";
  let cur = INF;
  for (let i = 1; i <= k; i++) {
    cur = add(cur, G);
    html += `<tr><td>${i}</td><td>${fmt(cur)}</td></tr>`;
  }
  html += "</table>";

  const Q = mul(k, G);
  html += `<p class="final">Private key k = ${k} → Public key Q = kG = ${fmt(Q)}</p>`;

  document.getElementById("out").innerHTML = html;
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("go").addEventListener("click", run);
  run();
});