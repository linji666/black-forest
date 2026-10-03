"use strict";

/* ================= 素材 ================= */
var A = {
  kang:  'https://i.postimg.cc/wTwB3Mft/retouch-2026100317292114.png',
  camp:  'https://i.postimg.cc/BQnSWsSx/mmexport1791019923449.jpg',
  mark:  'https://i.postimg.cc/Y0qHwfwd/mmexport1791019926001.jpg',
  tire:  'https://i.postimg.cc/LsKFsMpv/mmexport1791019928315.jpg',
  props: 'https://i.postimg.cc/x8dWZfvT/mmexport1791019930573.jpg',
  mons:  'https://i.postimg.cc/SN3wZpjv/mmexport1791019936998.jpg',
  body:  'https://i.postimg.cc/4yMFFz40/mmexport1791020081267.jpg',
  day:   'https://i.postimg.cc/PrYHZx5b/mmexport1791016938307.jpg',
  night: 'https://i.postimg.cc/T15kzp42/mmexport1791017296540.jpg'
};
var IMG = {};
for (var k in A) { var _i = new Image(); _i.src = A[k]; IMG[k] = _i; }

/* ================= 画布 ================= */
var cv = document.getElementById('c');
var ctx = cv.getContext('2d');
var W = 0, H = 0, DPR = 1;
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth; H = window.innerHeight;
  cv.width = Math.floor(W * DPR); cv.height = Math.floor(H * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
window.addEventListener('resize', resize); resize();

/* ================== 世界（缩小版） ================== */
var WORLD = { w: 1700, h: 1250 };
function rng(s0) { var s = s0 >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
var R = rng(20261003);

var camp = { x: 330, y: 1010 };
var carM = { x: 300, y: 1110, r: 62 };
var spot = { x: 1380, y: 330, r: 46 };
var exitM = { x: 1580, y: 120, r: 82 };

function near(px, py, d) { return Math.hypot(px - px, 0) === 0 && Math.hypot(0, 0) === 0 ? false : (Math.hypot(px - 0, 0) >= 0 && false); }
function dist2(x1, y1, x2, y2) { var a = x1 - x2, b = y1 - y2; return a * a + b * b; }
function clearOf(x, y, d) {
  if (dist2(x, y, camp.x, camp.y) < d * d) return false;
  if (dist2(x, y, carM.x, carM.y) < d * d) return false;
  if (dist2(x, y, spot.x, spot.y) < d * d) return false;
  if (dist2(x, y, exitM.x, exitM.y) < d * d) return false;
  var pts = [[560,820],[760,640],[860,900],[1010,470],[1080,780],[620,1000],[1180,1010]];
  for (var i = 0; i < pts.length; i++) if (dist2(x, y, pts[i][0], pts[i][1]) < d * d) return false;
  return true;
}

var trees = [];
(function () {
  var n = 0, guard = 0;
  while (n < 120 && guard < 4000) {
    guard++;
    var x = 40 + R() * (WORLD.w - 80), y = 40 + R() * (WORLD.h - 80);
    if (!clearOf(x, y, 110)) continue;
    trees.push({ x: x, y: y, r: 17 + R() * 13, s: 0.8 + R() * 0.55 });
    n++;
  }
})();
function hitTree(x, y, r) {
  for (var i = 0; i < trees.length; i++) {
    var t = trees[i], dx = x - t.x, dy = y - t.y, rr = t.r + r;
    if (dx * dx + dy * dy < rr * rr) return t;
  }
  return null;
}

/* ================== 实体 ================== */
var player = { x: 400, y: 1000, r: 12, sp: 220, face: 1 };
var friend = { x: 340, y: 1040, r: 12, face: 1 };
var mons   = { x: 0, y: 0, r: 30, sp: 214, on: false };
var cam = { x: 0, y: 0 };

var PT = [[560,820,'m'],[760,640,'m'],[1080,780,'m'],[620,1000,'w'],[862,900,'w'],[1010,470,'w']];
var picks = [];
function makePicks() {
  picks = [];
  for (var i = 0; i < PT.length; i++) picks.push({ x: PT[i][0], y: PT[i][1], t: PT[i][2], got: false, ph: R() * 6.28 });
}
makePicks();

var have = { m: 0, w: 0 };
var NEED = { m: 3, w: 3 };
var phase = 'title', started = false;
var shake = 0, T = 0, chaseT = 0, dark = 0;
var stepT = 0, windOn = false;

/* ================== UI ================== */
var toastEl = document.getElementById('toast'), toastT = 0;
function toast(t, ms) { toastEl.textContent = t; toastEl.classList.add('on'); toastT = (ms || 2200) / 1000; }
function tickToast(dt) { if (toastT > 0) { toastT -= dt; if (toastT <= 0) toastEl.classList.remove('on'); } }
var flashEl = document.getElementById('flash');
function flash(a, ms) {
  flashEl.style.transition = 'none'; flashEl.style.opacity = a;
  setTimeout(function () { flashEl.style.transition = 'opacity ' + (ms || 600) + 'ms'; flashEl.style.opacity = 0; }, 30);
}
var sCut = document.getElementById('sCut'), cutT = document.getElementById('cutT'), cutB = document.getElementById('cutB'), cutImg = document.getElementById('cutImg');
var sEnd = document.getElementById('sEnd'), endT = document.getElementById('endT'), endB = document.getElementById('endB'), endImg = document.getElementById('endImg');
var sTitle = document.getElementById('sTitle');
var cutDone = null;
function showCut(title, body, btn, imgSrc, cb) {
  cutT.textContent = title; cutB.innerHTML = body;
  if (imgSrc) { cutImg.src = imgSrc; cutImg.style.display = 'block'; }
  else { cutImg.style.display = 'none'; cutImg.removeAttribute('src'); }
  document.getElementById('bCut').textContent = btn;
  cutDone = cb; sCut.classList.add('on');
}
document.getElementById('bCut').onclick = function () {
  sCut.classList.remove('on'); var f = cutDone; cutDone = null; if (f) f();
};
function endGame(title, body, imgSrc) {
  phase = 'end'; mons.on = false;
  endT.textContent = title; endB.innerHTML = body;
  if (imgSrc) { endImg.src = imgSrc; endImg.style.display = 'block'; }
  else { endImg.style.display = 'none'; endImg.removeAttribute('src'); }
  sEnd.classList.add('on');
}

/* ================== 声音（全部代码合成） ================== */
var AC = null, windGain = null, noBuf = null;
function noiseBuf() {
  if (noBuf || !AC) return noBuf;
  var len = Math.floor(AC.sampleRate * 2);
  noBuf = AC.createBuffer(1, len, AC.sampleRate);
  var d = noBuf.getChannelData(0);
  for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return noBuf;
}
function initAudio() {
  if (AC) return;
  try {
    var C = window.AudioContext || window.webkitAudioContext; if (!C) return;
    AC = new C(); noiseBuf();
    var o = AC.createOscillator(), g = AC.createGain();
    o.type = 'sine'; o.frequency.value = 42; g.gain.value = 0.001;
    o.connect(g); g.connect(AC.destination); o.start();
    g.gain.linearRampToValueAtTime(0.045, AC.currentTime + 3);
    /* 风：白噪 + 低通 */
    var src = AC.createBufferSource(); src.buffer = noBuf; src.loop = true;
    var lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 480; lp.Q.value = 0.7;
    var wg = AC.createGain(); wg.gain.value = 0.001;
    src.connect(lp); lp.connect(wg); wg.connect(AC.destination); src.start();
    wg.gain.linearRampToValueAtTime(0.05, AC.currentTime + 4); windGain = wg;
  } catch (e) { AC = null; }
}
function noiseHit(freq, q, gain, dur, type) {
  if (!AC || !noBuf) return;
  try {
    var t = AC.currentTime;
    var s = AC.createBufferSource(); s.buffer = noBuf;
    s.playbackRate.value = 1;
    var f = AC.createBiquadFilter(); f.type = type || 'bandpass'; f.frequency.value = freq; f.Q.value = q || 1;
    var g = AC.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(AC.destination);
    s.start(t); s.stop(t + dur + 0.05);
  } catch (e) {}
}
function step() { noiseHit(1500 + Math.random() * 500, 1.2, 0.085, 0.13, 'bandpass'); }
function chew() {
  if (!AC) return;
  for (var i = 0; i < 4; i++) setTimeout(function () { noiseHit(240 + Math.random() * 320, 3, 0.11, 0.22, 'lowpass'); }, i * (110 + Math.random() * 120));
}
function tone(f1, f2, gain, dur, type) {
  if (!AC) return;
  try {
    var t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
    o.type = type || 'sawtooth';
    o.frequency.setValueAtTime(f1, t);
    o.frequency.exponentialRampToValueAtTime(f2, t + dur * 0.85);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + dur + 0.1);
  } catch (e) {}
}
function howl() { tone(310, 108, 0.14, 1.9, 'sawtooth'); setTimeout(function () { tone(230, 92, 0.11, 1.7, 'triangle'); }, 120); }
function heartbeat() { tone(64, 52, 0.26, 0.3, 'sine'); }

/* ================== 输入 ================== */
var keys = {};
window.addEventListener('keydown', function (e) {
  keys[e.key.toLowerCase()] = true;
  if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.key) >= 0) e.preventDefault();
});
window.addEventListener('keyup', function (e) { keys[e.key.toLowerCase()] = false; });

var stick = { on: false, id: null, ox: 0, oy: 0, x: 0, y: 0 };
function tp(t) { var r = cv.getBoundingClientRect(); return { x: t.clientX - r.left, y: t.clientY - r.top }; }
cv.addEventListener('touchstart', function (e) {
  if (stick.id === null) {
    var p = tp(e.changedTouches[0]);
    stick.id = e.changedTouches[0].identifier;
    stick.ox = p.x; stick.oy = p.y; stick.x = p.x; stick.y = p.y; stick.on = true;
  }
  e.preventDefault();
}, { passive: false });
cv.addEventListener('touchmove', function (e) {
  for (var i = 0; i < e.changedTouches.length; i++) {
    var t = e.changedTouches[i]; if (t.identifier !== stick.id) continue;
    var p = tp(t); stick.x = p.x; stick.y = p.y;
  }
  e.preventDefault();
}, { passive: false });
cv.addEventListener('touchend', function (e) {
  for (var i = 0; i < e.changedTouches.length; i++) if (e.changedTouches[i].identifier === stick.id) { stick.id = null; stick.on = false; }
}, { passive: false });
cv.addEventListener('touchcancel', function () { stick.id = null; stick.on = false; });
var mOn = false;
cv.addEventListener('mousedown', function (e) { var p = tp(e); mOn = true; stick.ox = p.x; stick.oy = p.y; stick.x = p.x; stick.y = p.y; stick.on = true; });
window.addEventListener('mousemove', function (e) { if (!mOn) return; var p = tp(e); stick.x = p.x; stick.y = p.y; });
window.addEventListener('mouseup', function () { mOn = false; stick.on = false; });

function inputVec() {
  var dx = 0, dy = 0;
  if (keys['a'] || keys['arrowleft']) dx -= 1;
  if (keys['d'] || keys['arrowright']) dx += 1;
  if (keys['w'] || keys['arrowup']) dy -= 1;
  if (keys['s'] || keys['arrowdown']) dy += 1;
  if (dx || dy) { var m = Math.hypot(dx, dy); return { x: dx / m, y: dy / m }; }
  if (stick.on) {
    var vx = stick.x - stick.ox, vy = stick.y - stick.oy, m2 = Math.hypot(vx, vy);
    if (m2 > 6) { var k = Math.min(m2, 58) / 58; return { x: vx / m2 * k, y: vy / m2 * k }; }
  }
  return { x: 0, y: 0 };
}

/* ================== 流程 ================== */
function reset() {
  player.x = 400; player.y = 1000; player.face = 1;
  friend.x = 340; friend.y = 1040;
  mons.on = false; have.m = 0; have.w = 0;
  makePicks(); dark = 0; shake = 0; chaseT = 0;
  phase = 'day';
}
document.getElementById('bStart').onclick = function () {
  sTitle.classList.remove('on'); initAudio();
  if (AC && AC.state === 'suspended') { try { AC.resume(); } catch (e) {} }
  started = true; reset(); toast('先去采三朵蘑菇，再捡三根柴', 3400);
};
document.getElementById('bAgain').onclick = function () {
  sEnd.classList.remove('on'); if (!AC) initAudio(); started = true; reset();
  toast('先去采三朵蘑菇，再捡三根柴', 3400);
};

function objective() {
  if (phase === 'day') {
    var best = null, bd = 1e9;
    for (var i = 0; i < picks.length; i++) {
      var p = picks[i]; if (p.got) continue;
      var d = dist2(p.x, p.y, player.x, player.y);
      if (d < bd) { bd = d; best = p; }
    }
    return best;
  }
  if (phase === 'morning') return spot;
  if (phase === 'chase') return exitM;
  return null;
}

/* ================== 更新 ================== */
function moveEnt(e, vx, vy, dt) {
  var nx = e.x + vx * dt, ny = e.y + vy * dt;
  var b = hitTree(nx, e.y, e.r);
  if (b) { var a = Math.atan2(e.y - b.y, nx - b.x); nx = b.x + Math.cos(a) * (b.r + e.r); }
  b = hitTree(nx, ny, e.r);
  if (b) { var a2 = Math.atan2(ny - b.y, nx - b.x); ny = b.y + Math.sin(a2) * (b.r + e.r); }
  e.x = Math.max(16, Math.min(WORLD.w - 16, nx));
  e.y = Math.max(16, Math.min(WORLD.h - 16, ny));
}

var howlT = 0, hbT = 0;
function update(dt) {
  T += dt;
  if (shake > 0) shake = Math.max(0, shake - dt * 2.2);
  var iv = inputVec();
  var moving = (iv.x || iv.y) ? 1 : 0;

  if (phase === 'day' || phase === 'morning' || phase === 'chase') {
    var sp = player.sp * (phase === 'chase' ? 1.06 : 1);
    moveEnt(player, iv.x * sp, iv.y * sp, dt);
    if (iv.x) player.face = iv.x > 0 ? 1 : -1;
  }
  if (moving && (phase === 'day' || phase === 'morning' || phase === 'chase')) {
    stepT -= dt;
    if (stepT <= 0) { stepT = 0.34; step(); }
  }

  if (started && phase !== 'end') {
    var fx = player.x - 44 * player.face, fy = player.y + 40;
    var dx = fx - friend.x, dy = fy - friend.y, d = Math.hypot(dx, dy);
    if (d > 4) {
      var fs = Math.min(1, d / 240) * (phase === 'chase' ? 200 : 165);
      moveEnt(friend, dx / d * fs, dy / d * fs, dt);
      friend.face = dx > 0 ? 1 : -1;
    }
  }

  if (phase === 'day') {
    for (var i = 0; i < picks.length; i++) {
      var p = picks[i]; if (p.got) continue;
      if (dist2(p.x, p.y, player.x, player.y) < 1600) { p.got = true; onPick(p.t); }
    }
  }

  if (phase === 'night') {
    howlT -= dt;
    if (howlT <= 0) { howlT = 3.4 + Math.random() * 4; howl(); shake = Math.max(shake, 0.8); }
  }

  if (phase === 'morning' && dist2(spot.x, spot.y, player.x, player.y) < spot.r * spot.r) startFind();

  if (phase === 'chase') {
    chaseT += dt; dark = Math.min(1, dark + dt * 0.28);
    var mx = player.x - mons.x, my = player.y - mons.y, md = Math.hypot(mx, my);
    if (md > 1) moveEnt(mons, mx / md * (mons.sp + Math.min(44, chaseT * 0.7)), my / md * (mons.sp + Math.min(44, chaseT * 0.7)), dt);
    hbT -= dt;
    if (hbT <= 0) { hbT = Math.max(0.42, 1.05 - chaseT * 0.013); heartbeat(); }
    if (md < 36) { endGame('被 抓 住 了', '它的手很凉。<br><br>你最后想到的是早上那具躯干 —— 右腹下面那个纹身。<br>你那时候就该跑。', A.mons); return; }
    if (dist2(exitM.x, exitM.y, player.x, player.y) < exitM.r * exitM.r) { winGame(); return; }
  }

  var cx = player.x - W / 2, cy = player.y - H / 2;
  cam.x += (cx - cam.x) * Math.min(1, dt * 9);
  cam.y += (cy - cam.y) * Math.min(1, dt * 9);
  cam.x = Math.max(0, Math.min(WORLD.w - W, cam.x));
  cam.y = Math.max(0, Math.min(WORLD.h - H, cam.y));
  if (WORLD.w < W) cam.x = (WORLD.w - W) / 2;
  if (WORLD.h < H) cam.y = (WORLD.h - H) / 2;

  if (windGain && AC) {
    var wg = phase === 'chase' ? 0.085 : (phase === 'night' ? 0.07 : 0.045);
    try { windGain.gain.setTargetAtTime(wg, AC.currentTime, 0.8); } catch (e) {}
  }

  tickToast(dt);

  var L = '', Rt = '';
  if (phase === 'day') { L = '蘑菇 ' + have.m + '/3　柴 ' + have.w + '/3'; Rt = '天还亮着'; }
  else if (phase === 'night') { L = '帐篷里'; Rt = '别出去'; }
  else if (phase === 'morning') { L = '去昨晚有声音的地方'; Rt = '第二天'; }
  else if (phase === 'chase') { L = '跑'; Rt = '别回头'; }
  document.getElementById('hudL').textContent = L;
  document.getElementById('hudR').textContent = Rt;
}

/* ================== 剧情 ================== */
var TXT_NIGHT = '柴火够烧了。<br><br>天说黑就黑。林子里先是静下来 —— 静得连虫子都没有。<br><br>' +
  '然后是叫声。<br>不像狼，不像人。像很远的地方有人用很低的声音哭。<br><br>' +
  '你和朋友挤在帐篷里，谁也没敢掀帘子。<br>他抓着你的胳膊，说没事，说天亮了就走。<br><br>' +
  '<span style="color:#6a7880">你后来才想起来 —— 那句话，他说的调子是平的。</span>';

var TXT_BODY = '地上有东西。<br><br>你先看见的是几片 —— 说不出口的。<br>' +
  '头没有了，四肢也没有了。只剩一截躯干仰在落叶里。<br><br>' +
  '你腿一下软了。朋友在你身后，一声不响。';

var TXT_MARK = '然后你看见了那个。<br><br><b>右腹下面，一个纹身。</b><br>' +
  '你们两个去年一起纹的。<br><br>' +
  '你慢慢转过身。<br>他站在你后面，一直笑着。<br>' +
  '<span style="color:#6a7880">可他的嘴角是平的，从头到尾没动过。</span>';

var TXT_TIRE = '你们连滚带爬回到营地。<br><br>车还在。四个轮胎全瘪了。<br>' +
  '侧面深深插着断掉的树枝 —— 是有人一节一节拿它扎进去的。<br><br>' +
  '有人比你们先到。<br><br>他离你越来越近了。<br>你只记得，来时的路在林子的另一头。';

var TXT_WIN = '光砸在你脸上。<br><br>你一口气跑到公路上，拦下一辆过路的货车。<br>' +
  '警察第二天才进林子 —— 什么都没找到。<br>没有躯干，没有纹身，没有那个人。<br><br>' +
  '只剩你那辆车，四个轮胎全碎了，停在营地边。<br><br>' +
  '后来你回去看过一次。<br>帐篷里，柴火被人收拾得整整齐齐。';

function onPick(t) {
  if (t === 'm') have.m++; else have.w++;
  toast(t === 'm' ? '捡到一朵蘑菇' : '捡到一根柴', 1100);
  noiseHit(900 + Math.random() * 400, 2, 0.07, 0.18, 'bandpass');
  if (have.m >= 3 && have.w >= 3) {
    setTimeout(function () {
      if (phase !== 'day') return;
      phase = 'night'; dark = 0.7;
      showCut('那 一 夜', TXT_NIGHT, '睡 下', A.camp, startNight);
    }, 700);
  }
}
function startNight() {
  phase = 'night'; dark = 0.78; shake = 1; howl(); chew();
  toast('外面有东西在吃东西', 2800);
  var t1 = setTimeout(function () { if (phase === 'night') chew(); }, 2600);
  setTimeout(function () {
    if (phase !== 'night') return; clearTimeout(t1);
    phase = 'morning'; dark = 0;
    toast('第二天。去昨晚有声音的地方看看', 4200);
  }, 7000);
}
function startFind() { phase = 'cut'; dark = 0; showCut('什 么 东 西', TXT_BODY, '再 看 一 眼', A.body, startMark); }
function startMark() { phase = 'cut'; showCut('那 个 印 记', TXT_MARK, '往 车 跑', A.mark, startCar); }
function startCar() { phase = 'cut'; showCut('四 个 轮 子', TXT_TIRE, '跑', A.tire, startChase); }
function startChase() {
  phase = 'chase'; chaseT = 0; dark = 0.25;
  player.x = carM.x + 60; player.y = carM.y - 70; player.face = 1;
  friend.x = player.x - 40; friend.y = player.y + 30;
  mons.x = spot.x + 100; mons.y = spot.y + 100; mons.on = true;
  flash(0.9, 700); howl(); shake = 1;
  toast('往林子外面跑！', 3000);
}
function winGame() {
  phase = 'cut'; mons.on = false; tone(400, 900, 0.12, 0.6, 'sine');
  setTimeout(function () { endGame('你 跑 出 来 了', TXT_WIN, A.camp); }, 900);
}

/* ================== 绘制 ================== */
function cover(im, par) {
  if (!im || !im.complete || !im.naturalWidth) return false;
  var s = Math.max(W / im.naturalWidth, H / im.naturalHeight) * 1.18;
  var dw = im.naturalWidth * s, dh = im.naturalHeight * s;
  ctx.drawImage(im, -((dw - W) / 2) - cam.x * par, -((dh - H) / 2) - cam.y * par, dw, dh);
  return true;
}

function drawTree(t, darkish) {
  var h = 46 * t.s, w = 19 * t.s;
  ctx.beginPath(); ctx.ellipse(t.x, t.y + 4, t.r * 1.15, t.r * 0.4, 0, 0, 6.2832);
  ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fill();
  ctx.fillStyle = darkish ? '#1a1b16' : '#3b2f22';
  ctx.fillRect(t.x - 2.5 * t.s, t.y - 6, 5 * t.s, 12 * t.s);
  for (var i = 0; i < 3; i++) {
    var yy = t.y - 4 - i * h * 0.30, ww = w * (1 - i * 0.24), hh = h * 0.6;
    ctx.beginPath();
    ctx.moveTo(t.x, yy - hh);
    ctx.lineTo(t.x - ww, yy);
    ctx.lineTo(t.x + ww, yy);
    ctx.closePath();
    ctx.fillStyle = darkish ? (i === 0 ? '#0d1417' : '#0b1114') : (i === 0 ? '#1d3328' : '#16281f');
    ctx.fill();
  }
}

function drawFriend() {
  var x = friend.x, y = friend.y;
  ctx.beginPath(); ctx.ellipse(x, y + 13, 12, 4.5, 0, 0, 6.2832); ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fill();
  ctx.save(); ctx.translate(x, y); ctx.scale(friend.face, 1);
  ctx.fillStyle = '#4d5a63';
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-8, -6, 16, 19, 4) : ctx.rect(-8, -6, 16, 19); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -14, 7.5, 0, 6.2832); ctx.fillStyle = '#7d8a93'; ctx.fill();
  ctx.fillStyle = '#2a333a';
  ctx.fillRect(-6.5, 16, 4.6, 5); ctx.fillRect(1.9, 16, 4.6, 5);
  ctx.restore();
}

function drawPlayer() {
  var x = player.x, y = player.y;
  var im = IMG.kang;
  var ok = im && im.complete && im.naturalWidth;
  ctx.beginPath(); ctx.ellipse(x, y + 16, 17, 6, 0, 0, 6.2832);
  ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fill();
  if (ok) {
    var h = 62, w = h * (im.naturalWidth / im.naturalHeight);
    ctx.save(); ctx.translate(x, y + 4); ctx.scale(player.face, 1);
    ctx.drawImage(im, -w / 2, -h, w, h);
    ctx.restore();
  } else {
    ctx.fillStyle = '#e0b53a';
    ctx.beginPath(); ctx.arc(x, y - 6, 12, 0, 6.2832); ctx.fill();
    ctx.fillRect(x - 9, y + 4, 18, 15);
  }
}

function drawMons() {
  if (!mons.on) return;
  var im = IMG.mons; if (!im || !im.complete || !im.naturalWidth) return;
  var w = 190, h = w * (im.naturalHeight / im.naturalWidth);
  /* 白底用 multiply 融进暗景，外面再蒙一圈雾遮边 */
  var vg = ctx.createRadialGradient(mons.x, mons.y, w * 0.18, mons.x, mons.y, w * 0.78);
  vg.addColorStop(0, 'rgba(6,10,12,0)'); vg.addColorStop(0.66, 'rgba(6,10,12,0.55)'); vg.addColorStop(1, 'rgba(6,10,12,0.98)');
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 0.96;
  ctx.drawImage(im, mons.x - w / 2, mons.y - h * 0.62, w, h);
  ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'source-over';
  ctx.beginPath(); ctx.arc(mons.x, mons.y, w * 0.72, 0, 6.2832);
  ctx.fillStyle = vg; ctx.fill(); ctx.restore();
}

function drawMini() {
  var mw = Math.min(132, W * 0.30), mh = mw * (WORLD.h / WORLD.w);
  var px = W - mw - 14, py = 44;
  ctx.save();
  ctx.globalAlpha = 0.72; ctx.fillStyle = '#05090b';
  ctx.fillRect(px, py, mw, mh);
  ctx.globalAlpha = 0.5; ctx.strokeStyle = '#31505c'; ctx.lineWidth = 1;
  ctx.strokeRect(px + 0.5, py + 0.5, mw - 1, mh - 1);
  function M(x, y) { return { x: px + x / WORLD.w * mw, y: py + y / WORLD.h * mh }; }
  var i, q;
  ctx.globalAlpha = 0.55;
  for (i = 0; i < trees.length; i++) {
    q = M(trees[i].x, trees[i].y);
    ctx.fillStyle = '#1c2c26'; ctx.fillRect(q.x - 1, q.y - 1, 2.6, 2.6);
  }
  if (phase === 'day') {
    for (i = 0; i < picks.length; i++) {
      if (picks[i].got) continue;
      q = M(picks[i].x, picks[i].y);
      ctx.fillStyle = picks[i].t === 'm' ? '#c04a3e' : '#9c7a4a';
      ctx.beginPath(); ctx.arc(q.x, q.y, 2.6, 0, 6.2832); ctx.fill();
    }
  }
  if (phase === 'morning') { q = M(spot.x, spot.y); ctx.fillStyle = '#c04a3e'; ctx.beginPath(); ctx.arc(q.x, q.y, 3.4, 0, 6.2832); ctx.fill(); }
  if (phase === 'chase') {
    q = M(exitM.x, exitM.y); ctx.fillStyle = '#57a08a'; ctx.beginPath(); ctx.arc(q.x, q.y, 3.6, 0, 6.2832); ctx.fill();
    q = M(mons.x, mons.y); ctx.fillStyle = '#d8dde0'; ctx.beginPath(); ctx.arc(q.x, q.y, 3.2, 0, 6.2832); ctx.fill();
  }
  q = M(player.x, player.y);
  ctx.fillStyle = '#ffd84d'; ctx.beginPath(); ctx.arc(q.x, q.y, 3.6, 0, 6.2832); ctx.fill();
  ctx.globalAlpha = 0.9; ctx.strokeStyle = '#0a0f12'; ctx.lineWidth = 1; ctx.stroke();
  ctx.restore();
}

function drawArrow() {
  var o = objective(); if (!o) return;
  var sx = o.x - cam.x, sy = o.y - cam.y;
  if (sx > 40 && sx < W - 40 && sy > 40 && sy < H - 40) return;
  var cx = player.x - cam.x, cy = player.y - cam.y;
  var a = Math.atan2(sy - cy, sx - cx);
  var rad = Math.min(W, H) * 0.40;
  var ax = cx + Math.cos(a) * rad, ay = cy + Math.sin(a) * rad;
  ax = Math.max(30, Math.min(W - 30, ax)); ay = Math.max(64, Math.min(H - 30, ay));
  ctx.save(); ctx.translate(ax, ay); ctx.rotate(a);
  ctx.globalAlpha = 0.55 + Math.sin(T * 4) * 0.2;
  ctx.beginPath(); ctx.moveTo(13, 0); ctx.lineTo(-9, -9); ctx.lineTo(-9, 9); ctx.closePath();
  ctx.fillStyle = '#8fd6cf'; ctx.fill(); ctx.restore();
}

function drawTrail() {
  if (phase !== 'chase') return;
  ctx.save();
  ctx.setLineDash([9, 12]);
  ctx.globalAlpha = 0.26; ctx.strokeStyle = '#8fd6cf'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(player.x, player.y);
  ctx.lineTo(exitM.x, exitM.y);
  ctx.stroke(); ctx.restore();
}

function drawWorld() {
  var g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#0a1114'); g.addColorStop(1, '#05080a');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  var darkish = (phase === 'night' || phase === 'chase');
  if (darkish) cover(IMG.night, 0.12); else cover(IMG.day, 0.12);

  ctx.save();
  ctx.translate(-cam.x + (Math.random() - 0.5) * shake * 15, -cam.y + (Math.random() - 0.5) * shake * 15);

  if (phase === 'morning') {
    var a = 0.34 + Math.sin(T * 2) * 0.16;
    ctx.beginPath(); ctx.arc(spot.x, spot.y, spot.r, 0, 6.2832);
    ctx.strokeStyle = '#8d3230'; ctx.globalAlpha = a; ctx.lineWidth = 2; ctx.stroke();
    ctx.globalAlpha = a * 0.2; ctx.fillStyle = '#8d3230'; ctx.fill(); ctx.globalAlpha = 1;
    ctx.font = '13px -apple-system,sans-serif'; ctx.fillStyle = 'rgba(205,222,228,.75)'; ctx.textAlign = 'center';
    ctx.fillText('昨晚的声音', spot.x, spot.y - spot.r - 10); ctx.textAlign = 'left';
  }

  ctx.globalAlpha = 0.9;
  ctx.beginPath(); ctx.ellipse(carM.x, carM.y, 34, 16, 0, 0, 6.2832);
  ctx.fillStyle = '#0e1518'; ctx.fill();
  ctx.beginPath(); ctx.ellipse(carM.x, carM.y - 6, 28, 12, 0, 0, 6.2832);
  ctx.fillStyle = '#1d2a2e'; ctx.fill();
  ctx.globalAlpha = 1;

  var i;
  for (i = 0; i < trees.length; i++) {
    var t = trees[i];
    if (t.x - cam.x < -120 || t.x - cam.x > W + 120 || t.y - cam.y < -120 || t.y - cam.y > H + 120) continue;
    drawTree(t, darkish);
  }

  if (phase === 'day') {
    for (i = 0; i < picks.length; i++) {
      var p = picks[i]; if (p.got) continue;
      var bob = Math.sin(T * 2.6 + p.ph) * 3;
      ctx.beginPath(); ctx.ellipse(p.x, p.y + bob + 7, 10, 3.2, 0, 0, 6.2832);
      ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fill();
      if (p.t === 'm') {
        ctx.fillStyle = '#e6ded0'; ctx.fillRect(p.x - 1.9, p.y + bob - 2, 3.8, 8);
        ctx.beginPath(); ctx.arc(p.x, p.y + bob - 3, 9.5, Math.PI, 0); ctx.fillStyle = '#b03a34'; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x - 3, p.y + bob - 5, 1.9, 0, 6.2832); ctx.fillStyle = '#efe7d8'; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x + 3.4, p.y + bob - 6, 1.7, 0, 6.2832); ctx.fill();
      } else {
        ctx.save(); ctx.translate(p.x, p.y + bob); ctx.rotate(-0.3);
        ctx.fillStyle = '#4a3524'; ctx.fillRect(-13, -4.5, 26, 9);
        ctx.fillStyle = '#6b4f33'; ctx.beginPath(); ctx.ellipse(-13, 0, 3, 4.5, 0, 0, 6.2832); ctx.fill();
        ctx.restore();
      }
    }
  }

  drawTrail();
  if (started && phase !== 'end') { drawFriend(); drawPlayer(); }
  drawMons();
  ctx.restore();

  var dk = phase === 'night' ? 0.60 : (phase === 'chase' ? (0.28 + dark * 0.34) : 0);
  if (dk > 0) {
    var vg = ctx.createRadialGradient(player.x - cam.x, player.y - cam.y, 42, player.x - cam.x, player.y - cam.y, Math.max(W, H) * 0.6);
    vg.addColorStop(0, 'rgba(0,0,0,' + (dk * 0.08) + ')');
    vg.addColorStop(0.44, 'rgba(0,0,0,' + (dk * 0.62) + ')');
    vg.addColorStop(1, 'rgba(0,0,0,' + dk + ')');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  }

  if (started && phase !== 'end') { drawMini(); drawArrow(); }

  if (stick.on) {
    ctx.globalAlpha = 0.28; ctx.beginPath(); ctx.arc(stick.ox, stick.oy, 44, 0, 6.2832);
    ctx.strokeStyle = '#9fd8d8'; ctx.lineWidth = 1.5; ctx.stroke();
    var vx = stick.x - stick.ox, vy = stick.y - stick.oy, m = Math.hypot(vx, vy);
    if (m > 44) { vx = vx / m * 44; vy = vy / m * 44; }
    ctx.beginPath(); ctx.arc(stick.ox + vx, stick.oy + vy, 16, 0, 6.2832);
    ctx.fillStyle = '#9fd8d8'; ctx.fill(); ctx.globalAlpha = 1;
  }
}

/* ================== 主循环 ================== */
var last = 0;
function loop(ts) {
  if (!last) last = ts;
  var dt = Math.min(0.05, (ts - last) / 1000); last = ts;
  if (started && phase !== 'end') update(dt);
  else { T += dt; tickToast(dt); }
  if (phase === 'title' || phase === 'end') {
    cam.x = Math.max(0, Math.min(WORLD.w - W, player.x - W / 2));
    cam.y = Math.max(0, Math.min(WORLD.h - H, player.y - H / 2));
  }
  drawWorld();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
