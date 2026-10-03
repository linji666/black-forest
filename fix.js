/* 兜底补丁：对话推进 + 跳过按钮。在 game.js 之后加载。 */
(function () {
  var lastAdv = 0;

  /* 包一层，记录上一次成功推进的时间，防止一次点击推两句 */
  if (typeof window.dlgAdvance === 'function') {
    var orig = window.dlgAdvance;
    window.dlgAdvance = function () { lastAdv = Date.now(); return orig.apply(null, arguments); };
  }

  function hasDlg() { return !!window.dlg; }
  function fresh(ms) { return (Date.now() - lastAdv) > (ms || 260); }
  function adv(e) {
    if (!hasDlg()) return false;
    if (!fresh(200)) return false;
    try { window.dlgAdvance(); } catch (err) {}
    if (e) { try { e.preventDefault(); e.stopPropagation(); } catch (err) {} }
    return true;
  }

  /* 多条路都能推进：click / touchend / 空格回车 / 左右键 */
  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'skipB') return;
    adv(e);
  }, true);
  document.addEventListener('touchend', function (e) {
    if (e.target && e.target.id === 'skipB') return;
    if (hasDlg() && fresh(200)) { adv(e); }
  }, { passive: false, capture: true });
  document.addEventListener('keydown', function (e) {
    if (hasDlg() && (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight')) {
      if (fresh(120)) { try { window.dlgAdvance(); } catch (err) {} }
      e.preventDefault();
    }
  }, true);

  /* 跳过按钮 —— 不管卡在哪一句，一点就到底 */
  var st = document.createElement('style');
  st.textContent = '#skipB{position:fixed;right:14px;bottom:14px;z-index:38;padding:10px 16px;' +
    'font-size:11px;letter-spacing:2px;color:#8fb8b8;border:1px solid #2f464f;border-radius:2px;' +
    'background:rgba(6,12,15,.75);cursor:pointer;display:none;}' +
    '#skipB:active{background:rgba(30,52,60,.95);}';
  document.head.appendChild(st);
  var b = document.createElement('div');
  b.id = 'skipB';
  b.textContent = '跳 过 对 话';
  document.body.appendChild(b);

  function skipAll(e) {
    if (e) { try { e.preventDefault(); e.stopPropagation(); } catch (err) {} }
    var guard = 0;
    while (window.dlg && guard < 500) {
      try { window.dlgAdvance(); } catch (err) { break; }
      guard++;
    }
  }
  b.addEventListener('click', skipAll);
  b.addEventListener('touchend', skipAll, { passive: false });

  /* 卡死自检：如果卡在对话里 12 秒没动静，把跳过按钮闪一下提醒她 */
  var lastShown = -1;
  setInterval(function () {
    var on = hasDlg();
    if (on !== (lastShown === 1)) { b.style.display = on ? 'block' : 'none'; lastShown = on ? 1 : 0; }
    if (on) {
      var ln = window.dlg.lines && window.dlg.lines[window.dlg.i];
      if (!ln) { try { window.dlgAdvance(); } catch (err) {} }
    }
  }, 250);
})();
