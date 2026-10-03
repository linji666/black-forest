/* ============================================================
   黑森林 · 剧本
   改台词只改这个文件，不用动引擎。
   who: 'me' = 主角（你）   'mate' = 朋友
   一行一句，点一下推一句。
   ============================================================ */
var STORY = {

  /* 开场，进林子 */
  open: [
    { who: 'mate', text: '就这儿。地图上标的这块。' },
    { who: 'me',   text: '……你确定？这树密得看不见天。' },
    { who: 'mate', text: '密才好啊，密才没人。' },
    { who: 'mate', text: '捡点柴，采点蘑菇，晚上烤着吃。' },
    { who: 'me',   text: '你会烤？' },
    { who: 'mate', text: '不会。你会。' },
    { who: 'me',   text: '……' },
    { who: 'mate', text: '（笑）走了，别磨蹭。' }
  ],

  /* 采集路上的闲聊（随机挑） */
  idle: [
    [
      { who: 'mate', text: '你手怎么这么笨，根都掰断了。' },
      { who: 'me',   text: '你行你来。' },
      { who: 'mate', text: '看好了 —— 就这么一转。' },
      { who: 'me',   text: '……你离远点。' },
      { who: 'mate', text: '怎么了？' },
      { who: 'me',   text: '太热。' },
      { who: 'mate', text: '（笑）现在是十月。' }
    ],
    [
      { who: 'mate', text: '你头发上沾了叶子。' },
      { who: 'me',   text: '哪？' },
      { who: 'mate', text: '别动。' },
      { who: 'mate', text: '……好了。' },
      { who: 'me',   text: '你刚才停了。' },
      { who: 'mate', text: '没有。' },
      { who: 'me',   text: '你有。' },
      { who: 'mate', text: '（没接话）' }
    ],
    [
      { who: 'me',   text: '你说这林子里到底有没有那种东西。' },
      { who: 'mate', text: '哪种。' },
      { who: 'me',   text: '就那种。吃人的。' },
      { who: 'mate', text: '有。' },
      { who: 'me',   text: '……你答得太快了。' },
      { who: 'mate', text: '（笑）你怕了？' },
      { who: 'me',   text: '我没怕。' },
      { who: 'mate', text: '那你手怎么在抖。' }
    ],
    [
      { who: 'mate', text: '累不累？' },
      { who: 'me',   text: '还行。' },
      { who: 'mate', text: '累了就说，我背你。' },
      { who: 'me',   text: '……你背得动？' },
      { who: 'mate', text: '背不动也得背啊。' }
    ]
  ],

  /* 采完东西，天要黑了 */
  enough: [
    { who: 'me',   text: '够了。' },
    { who: 'mate', text: '嗯，回营地。' },
    { who: 'mate', text: '……天怎么黑得这么快。' },
    { who: 'me',   text: '十月嘛。' },
    { who: 'mate', text: '嗯。十月。' }
  ],

  /* 夜里，帐篷。暧昧 + 黑屏 */
  night: [
    { who: 'mate', text: '冷吗？' },
    { who: 'me',   text: '还行。' },
    { who: 'mate', text: '你抖了。' },
    { who: 'me',   text: '那是听错了。' },
    { who: 'mate', text: '……那你也过来点。' },
    { who: '',     text: '他胳膊绕过来的时候，我没躲。' },
    { who: 'mate', text: '外面那声音，别听。' },
    { who: 'me',   text: '嗯。' },
    { who: 'mate', text: '我在呢。' },
    { who: '',     text: '……' },
    { who: '',     text: '（帐篷里很挤。你说，别闹，明天还得早起。）' },
    { who: '',     text: '（他笑了一声。）' },
    { who: '',     text: '（你伸手，想去摸他右腹下面那个纹身。）' },
    { who: '',     text: '（——摸空了。）' }
  ],

  /* 第二天早上 */
  morning: [
    { who: 'mate', text: '醒了？' },
    { who: 'me',   text: '嗯。' },
    { who: 'mate', text: '昨晚那声，你听见了吗。' },
    { who: 'me',   text: '……嗯。' },
    { who: 'mate', text: '去看看？' },
    { who: 'mate', text: '就一眼。看完就走。' }
  ],

  /* 发现躯干之前 */
  beforeBody: [
    { who: 'me',   text: '就是这儿。' },
    { who: 'mate', text: '……' },
    { who: 'me',   text: '你站这么远干什么。' },
    { who: 'mate', text: '没。' },
    { who: 'me',   text: '过来。' }
  ],

  /* 认出纹身 */
  mark: [
    { who: 'me',   text: '……你过来。' },
    { who: 'mate', text: '嗯？' },
    { who: 'me',   text: '把衣服撩起来。' },
    { who: 'mate', text: '干什么。' },
    { who: 'me',   text: '我看看。' },
    { who: 'mate', text: '……' },
    { who: 'mate', text: '（撩开）看吧。' },
    { who: '',     text: '（右腹下面，那个纹身。）' },
    { who: '',     text: '（还在。）' },
    { who: '',     text: '（——你松了口气。）' },
    { who: '',     text: '……' },
    { who: '',     text: '（然后你转过身，看见地上那具躯干。）' },
    { who: '',     text: '（同一个位置。）' },
    { who: '',     text: '（同一个纹身。）' }
  ],

  /* 回车路上 */
  toCar: [
    { who: 'mate', text: '……跑。' },
    { who: 'me',   text: '什么？' },
    { who: 'mate', text: '我说跑！' }
  ],

  /* 轮胎 */
  tire: [
    { who: 'me',   text: '……四个。' },
    { who: 'mate', text: '全扎了。' },
    { who: 'me',   text: '是树枝。' },
    { who: 'mate', text: '不像。' },
    { who: 'me',   text: '嗯。' },
    { who: '',     text: '（侧面四个口子。整齐得像量过。）' },
    { who: '',     text: '（有人比你们先到。）' }
  ],

  /* 追人时的内心独白，一声一声蹦 */
  chase: [
    '别回头。',
    '别回头。',
    '你听见后面有脚步声。',
    '两步一落 —— 和你的步子一样。',
    '别回头。',
    '它一直在后面叫你的名字。'
  ],

  /* 结局：被抓住 */
  caught: [
    { who: '', text: '（它的手很凉。）' },
    { who: '', text: '（你最后想到的，是早上那具躯干。）' },
    { who: '', text: '（右腹下面那个纹身。）' },
    { who: '', text: '（你那时候就该跑。）' }
  ],

  /* 结局：跑出去 */
  escaped: [
    { who: '', text: '（光砸在你脸上。）' },
    { who: '', text: '（你一口气跑到公路上，拦下一辆货车。）' },
    { who: '', text: '（警察第二天进林子 —— 什么都没找到。）' },
    { who: '', text: '（没有躯干，没有纹身，没有那个人。）' },
    { who: '', text: '（只剩你那辆车，四个轮胎全碎了。）' },
    { who: '', text: '……' },
    { who: '', text: '（你回去看过一次。）' },
    { who: '', text: '（帐篷里，柴火被人收拾得整整齐齐。）' }
  ]

};
