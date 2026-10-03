/* ============================================================
   兜底补丁（在 game.js 之后加载）
   1. 重写 drawPortrait：去掉 ctx.filter，那个属性在不少手机浏览器会报错，
      一报错整帧的立绘和对话框都不画 —— 这就是“没有立绘”的原因。
   2. 包装 showCut：弹过场时先清掉对话，防止两层打架卡死。
   3. 包装 startDlg：接对话前先把过场层关掉。
   4. 多路推进对话 + 右下角“跳过对话”。
   ============================================================ */
(function () {

  /* --- 1. 重写立绘绘制 --- */
  window.drawPortrait = function (im, cx, bottom, targetH, on) {
    if (!im || !im.complete || !im.naturalWidth) return;
    var ctx = window.ctx; if (!ctx) return;
    var h = targetH, w = h * (im.naturalWidth / im.naturalHeight);
    try {
      ctx.save();
      ctx.globalAlpha = on ? 1 : 0.42;
      ctx.drawImage(im, cx - w / 2, bottom - h, w, h);
      /* 没在说话的那个，画一层暗罩代替 filter */
      if (!on) {
        ctx.globalAlpha = 0.5; ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = '#05080a';
        ctx.fillRect(cx - w / 2, bottom - h, w, h);
      }
      ctx.restore();
    } catch (e) { try { ctx.restore(); } catch (e2) {} }
  };

  /* --- 2. 弹过场时，把对话清干净 --- */
  if (typeof window.showCut === 'function') {
    var oShowCut = window.showCut;
    window.showCut = function () {
      window.dlg = null;
      var sc = document.getElementById('sCut');
      if (sc) sc.classList.remove('on');
      try { return oShowCut.apply(null, arguments); } catch (e) {}
    };
  }

  /* --- 3. 接对话前，先把过场层关掉 --- */
  if (typeof window.startDlg === 'function') {
    var oStartDlg = window.startDlg;
    window.startDlg = function () {
      var sc = document.getElementById('sCut');
      if (sc && sc.classList.contains('on')) sc.classList.remove('on');
      window.dlg = null;
      try { return oStartDlg.apply(null, arguments); } catch (e) {}
    };
  }

  /* --- 4. 推进对话：多条路都行 --- */
  var lastAdv = 0;
  if (typeof window.dlgAdvance === 'function') {
    var oAdv = window.dlgAdvance;
    window.dlgAdvance = function () {
      lastAdv = Date.now();
      try { return oAdv.apply(null, arguments); } catch (e) { window.dlg = null; }
    };
  }
  function inScreen(t) {
    while (t) { if (t.classList && t.classList.contains('screen')) return true; t = t.parentNode; }
    return false;
  }
  function hasDlg() { return !!window.dlg; }
  function fresh(ms) { return (Date.now() - lastAdv) > (ms || 220); }
  function adv(e) {
    if (!hasDlg() || !fresh(200)) return false;
    try { window.dlgAdvance(); } catch (err) { window.dlg = null; }
    if (e) { try { e.preventDefault(); e.stopPropagation(); } catch (err) {} }
    return true;
  }
  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'skipB') return;
    if (inScreen(e.target)) return;          /* 过场/结局/标题里的按钮不拦 */
    adv(e);
  }, true);
  document.addEventListener('touchend', function (e) {
    if (e.target && e.target.id === 'skipB') return;
    if (inScreen(e.target)) return;
    if (hasDlg() && fresh(200)) adv(e);
  }, { passive: false, capture: true });
  document.addEventListener('keydown', function (e) {
    if (hasDlg() && (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight')) {
      if (fresh(90)) { try { window.dlgAdvance(); } catch (err) { window.dlg = null; } }
      e.preventDefault();
    }
  }, true);

  /* --- 5. 跳过按钮 --- */
  var st = document.createElement('style');
  st.textContent = '#skipB{position:fixed;right:14px;bottom:14px;z-index:38;padding:10px 16px;' +
    'font-size:11px;letter-spacing:2px;color:#8fb8b8;border:1px solid #2f464f;border-radius:2px;' +
    'background:rgba(6,12,15,.75);cursor:pointer;display:none;}' +
    '#skipB:active{background:rgba(30,52,60,.95);}';
  document.head.appendChild(st);
  var b = document.createElement('div');
  b.id = 'skipB'; b.textContent = '跳 过 对 话';
  document.body.appendChild(b);
  function skipAll(e) {
    if (e) { try { e.preventDefault(); e.stopPropagation(); } catch (err) {} }
    var guard = 0;
    while (window.dlg && guard < 500) {
      try { window.dlgAdvance(); } catch (err) { window.dlg = null; break; }
      guard++;
    }
  }
  b.addEventListener('click', skipAll);
  b.addEventListener('touchend', skipAll, { passive: false });

  /* --- 6. 自检 --- */
  setInterval(function () {
    var on = hasDlg();
    b.style.display = on ? 'block' : 'none';
    if (on) {
      var ln = window.dlg.lines && window.dlg.lines[window.dlg.i];
      if (!ln) { try { window.dlgAdvance(); } catch (e) { window.dlg = null; } }
    }
  }, 250);

})();
