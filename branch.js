/* ============================================================
   分叉引擎（在 game.js / fix.js 之后加载）
   把“发现躯干 → 验纹身”往后的流程换掉，接上两条一模一样的人 + 四个选项。
   ============================================================ */
(function () {
  var A = window.A, ST = window.STORY; var ctx = window.ctx;
  if (!A || !ST) return;

  function d(key, cb) { window.startDlg(key, cb); }
  function cut(t, b, btn, img, cb) { window.showCut(t, b, btn, img, cb); }
  window.__branch = '';

  /* ---------- 选项 UI ---------- */
  var st = document.createElement('style');
  st.textContent =
    '#choiceBox{position:fixed;inset:0;z-index:33;display:none;flex-direction:column;' +
    'align-items:center;justify-content:flex-end;padding:0 0 12vh 0;' +
    'background:linear-gradient(to bottom,rgba(3,6,8,.10) 0%,rgba(3,6,8,.72) 58%,rgba(3,6,8,.94) 100%);}' +
    '#choiceBox .chTip{color:#7d8d95;font-size:12px;letter-spacing:5px;margin-bottom:20px;}' +
    '#choiceBox .chItem{width:min(78vw,520px);margin:7px 0;padding:15px 20px;text-align:center;' +
    'font-size:14px;letter-spacing:3px;color:#dfe7ea;border:1px solid #34505b;' +
    'background:rgba(8,16,20,.82);border-radius:2px;cursor:pointer;}' +
    '#choiceBox .chItem:active{background:rgba(30,52,62,.95);color:#9fd8d8;}' +
    '#choiceBox .chItem.warn{color:#d8a0a0;border-color:#5b3434;}';
  document.head.appendChild(st);
  var box = document.createElement('div');
  box.id = 'choiceBox';
  document.body.appendChild(box);

  function showChoice(list, cb) {
    box.innerHTML = '';
    var tip = document.createElement('div');
    tip.className = 'chTip';
    tip.textContent = '你 只 能 选 一 个';
    box.appendChild(tip);
    var done = false;
    list.forEach(function (o, i) {
      var el = document.createElement('div');
      el.className = 'chItem' + (o.warn ? ' warn' : '');
      el.textContent = o.label;
      function fire(ev) {
        if (done) return; done = true;
        ev.preventDefault(); ev.stopPropagation();
        box.style.display = 'none';
        try { cb(i, o); } catch (e) {}
      }
      el.addEventListener('click', fire);
      el.addEventListener('touchend', fire, { passive: false });
      box.appendChild(el);
    });
    box.style.display = 'flex';
  }

  /* ---------- 包 endGame，让“选错”那条线换掉被抓的文案 ---------- */
  if (typeof window.endGame === 'function') {
    var oEnd = window.endGame;
    window.endGame = function (title, body, img) {
      if (window.__branch === 'wrong' && title === '被 抓 住 了') {
        return oEnd.call(null, '它 追 上 你 了',
          '你连车都没下。它从副驾那边进来，很慢。<br><br>' +
          '你一直看着它的脸 —— 到最后一秒，你都分不出那张脸哪里不对。', A.mons);
      }
      return oEnd.apply(null, arguments);
    };
  }

  /* ---------- 选错线：跑到公路也跑不干净 ---------- */
  window.winGame = function () {
    window.phase = 'cut'; window.mons.on = false;
    d('endWrongEscape', function () {
      window.endGame('你 开 出 去 了',
        '天亮了。你把车开到镇上，报了警。<br><br>' +
        '警察进林子搜了三天 —— 什么都没找到。<br>' +
        '只有你那辆车，停在路边。<br><br>' +
        '后来你搬了家，换了号。日子过得下去。<br><br>' +
        '只是每一个睡不着的夜里，你都会想一件事：<br>' +
        '—— 那天早上，我为什么选了右边。' , A.camp);
    });
  };

  /* ---------- 四个分支 ---------- */
  function pickLeft() {
    window.__branch = 'right';
    d('endRight', function () {
      window.endGame('你 带 他 回 去 了',
        '你分得清吗？<br><br>' +
        '你不知道。<br>' +
        '你只知道，你拉着的那只手是热的。<br><br>' +
        '—— 你一直没敢问那个问题。<br>' +
        '它也一直没提。', A.camp);
    });
  }

  function pickRight() {
    window.__branch = 'wrong';
    d('endWrong', function () { window.startChase(); });
  }

  function pickNeither() {
    window.__branch = 'neither';
    d('endNeither', function () {
      window.endGame('两 个 都 没 了',
        '你后来回去过。<br><br>' +
        '什么也没找到。没有尸体，没有血，没有脚印。<br>' +
        '只有你们搭帐篷的那块地上，柴火堆得整整齐齐。', A.camp);
    });
  }

  function pickBoth() {
    window.__branch = 'both';
    d('endBoth', function () {
      window.endGame('你 把 两 个 都 留 下 了',
        '你很高兴。<br><br>' +
        '他们两个也很高兴。<br>' +
        '你再也分不出，哪一天是谁在你旁边。<br><br>' +
        '你只在很偶尔的时候，会突然愣住 ——<br>' +
        '<b>我叫什么来着？</b>', A.camp);
    });
  }

  /* ---------- 接管后半段 ---------- */
  var TXT_BODY = '地上有东西。<br><br>你先看见的是几片 —— 说不出口的。<br>' +
    '头没有了，四肢也没有了。只剩一截躯干仰在落叶里。<br><br>你腿一下软了。朋友在你身后，一声不响。';
  var TXT_MARK = '然后你看见了那个。<br><br><b>右腹下面，一个纹身。</b><br>' +
    '你们两个去年一起纹的。<br><br>你慢慢转过身。<br>他站在你后面，一直笑着。<br>' +
    '<span style="color:#6a7880">可他的嘴角是平的，从头到尾没动过。</span>';

  window.startFind = function () {
    window.phase = 'cut';
    d('beforeBody', function () {
      d('mark', function () {
        cut('什 么 东 西', TXT_BODY, '再 看 一 眼', A.body, function () {
          cut('那 个 印 记', TXT_MARK, '抬 起 头', A.mark, function () {
            d('twoOfThem', function () {
              d('theQuestion', function () {
                d('beforeChoice', function () {
                  showChoice([
                    { label: '拉 住 左 边 那 个' },
                    { label: '拉 住 右 边 那 个' },
                    { label: '两 个 都 不 选', warn: true },
                    { label: '两 个 都 要', warn: true }
                  ], function (i) {
                    if (i === 0) pickLeft();
                    else if (i === 1) pickRight();
                    else if (i === 2) pickNeither();
                    else pickBoth();
                  });
                });
              });
            });
          });
        });
      });
    });
  };

})();
