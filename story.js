/* ============================================================
   黑森林 · 剧本 v2（四结局版）
   改台词只改这个文件。
   who: 'me' | 'mate' | '' （空字符串 = 旁白）
   一行一句，点一下推一句。
   ============================================================ */
var STORY = {

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
      { who: 'me',   text: '你有。' }
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

  enough: [
    { who: 'me',   text: '够了。' },
    { who: 'mate', text: '嗯，回营地。' },
    { who: 'mate', text: '……天怎么黑得这么快。' },
    { who: 'me',   text: '十月嘛。' },
    { who: 'mate', text: '嗯。十月。' }
  ],

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
    { who: '',     text: '（——摸空了。）' },
    { who: '',     text: '（你没有再动。你听着自己的心，一直听到天亮。）' }
  ],

  morning: [
    { who: 'mate', text: '醒了？' },
    { who: 'me',   text: '嗯。' },
    { who: 'mate', text: '昨晚那声，你听见了吗。' },
    { who: 'me',   text: '……嗯。' },
    { who: 'mate', text: '去看看？就一眼。看完就走。' }
  ],

  beforeBody: [
    { who: 'me',   text: '就是这儿。' },
    { who: 'mate', text: '……' },
    { who: 'me',   text: '你站这么远干什么。' },
    { who: 'mate', text: '没。' },
    { who: 'me',   text: '过来。' }
  ],

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

  /* ===== 分叉开始 ===== */

  twoOfThem: [
    { who: '',     text: '……' },
    { who: '',     text: '（林子边上站着一个人。）' },
    { who: '',     text: '（你以为是你的错觉。）' },
    { who: '',     text: '（他又向前走了一步，你才看见他的脸。）' },
    { who: '',     text: '（——是你身后那个人的脸。）' },
    { who: '',     text: '（一模一样。衣服、头发、走路时左肩微微低下去的样子。）' },
    { who: 'me',   text: '……' },
    { who: 'mate', text: '你站远一点。' },
    { who: 'mate', text: '那是假的。' },
    { who: 'me',   text: '哪个才是假的。' },
    { who: '',     text: '（两个人都没有说话。）' },
    { who: '',     text: '（他们看着彼此，像照一面镜子。）' }
  ],

  theQuestion: [
    { who: '',     text: '……' },
    { who: '',     text: '（你只有一句可以问。）' },
    { who: '',     text: '（一句只有你们两个知道的。）' },
    { who: 'me',   text: '去年冬天，我们一起做的那件事。' },
    { who: 'me',   text: '你先说。' },
    { who: '',     text: '……' },
    { who: 'mate', text: '左边那个人先开口。' },
    { who: 'mate', text: '他说得很轻，也很准。' },
    { who: 'mate', text: '右边那个顿了一秒，然后一字一字地把同一件事说了一遍。' },
    { who: '',     text: '……' },
    { who: '',     text: '（两个人都答对了。）' },
    { who: '',     text: '（连停顿的位置都一样。）' }
  ],

  beforeChoice: [
    { who: '',     text: '……' },
    { who: '',     text: '（他们同时向你迈了一步。）' },
    { who: '',     text: '（你退了一步。）' },
    { who: '',     text: '（他们没有再动。他们在等你。）' },
    { who: '',     text: '（天光在往下沉。）' }
  ],

  /* ===== 四个结局 ===== */

  endRight: [
    { who: '',     text: '（你抓住了左边那只手。）' },
    { who: '',     text: '（他的手是热的。）' },
    { who: '',     text: '（你拉着他就跑。没敢回头。）' },
    { who: '',     text: '（跑了很久，听见后面没有脚步。）' },
    { who: '',     text: '（天亮了。你到了公路。）' },
    { who: '',     text: '（你停下，回头。）' },
    { who: '',     text: '（是你拉着的这个。右腹下面，有那个纹身。）' },
    { who: '',     text: '（你松了口气。）' },
    { who: '',     text: '……' },
    { who: '',     text: '（但你们一路上一句话都没说。）' }
  ],

  endWrong: [
    { who: '',     text: '（你抓住了右边那只手。）' },
    { who: '',     text: '（他的手指有点凉。你想，是风。）' },
    { who: '',     text: '（你们回到营地，车还在。）' },
    { who: '',     text: '（四个轮胎全瘪了，侧面插着断掉的树枝。）' },
    { who: '',     text: '（它上了副驾。你很安静，它也很安静。）' },
    { who: '',     text: '（开出去三公里，你从后视镜看了一眼。）' },
    { who: '',     text: '（它没在看路。）' },
    { who: '',     text: '（它在看你。）' },
    { who: '',     text: '（——你踩了刹车。）' }
  ],

  endNeither: [
    { who: '',     text: '（你谁也没选。）' },
    { who: '',     text: '（你退到两棵树的中间。）' },
    { who: '',     text: '（他们没再看你。）' },
    { who: '',     text: '（他们看彼此。）' },
    { who: '',     text: '（你站在那儿，听见两种一模一样的呼吸。）' },
    { who: '',     text: '……' },
    { who: '',     text: '（你不知道过了多久。）' },
    { who: '',     text: '（天亮的时候，只剩下一个。）' },
    { who: '',     text: '（它站起来，转过来。）' },
    { who: '',     text: '（它开口 —— 两个声音。）' },
    { who: 'mate', text: '跟我走。' },
    { who: 'mate', text: '别跟他走。' },
    { who: '',     text: '（都是他的声音。）' },
    { who: '',     text: '（你弄丢的不是他们。）' },
    { who: '',     text: '（你弄丢的是自己。）' }
  ],

  endBoth: [
    { who: '',     text: '（你两只手都伸出去了。）' },
    { who: '',     text: '（他们笑了。）' },
    { who: '',     text: '（他们笑得一模一样。）' },
    { who: '',     text: '（那天晚上，帐篷里很挤。）' },
    { who: '',     text: '（你睡得很好。很久没睡这么好了。）' },
    { who: '',     text: '……' },
    { who: '',     text: '（第二天早上，你先醒的。）' },
    { who: '',     text: '（你想不起来昨天晚上，睡在你右边的是谁。）' },
    { who: '',     text: '（你叫了一声他的名字。）' },
    { who: '',     text: '（两个人同时答应了。）' },
    { who: '',     text: '……' },
    { who: '',     text: '（你看着他。）' },
    { who: '',     text: '（你看着另一个他。）' },
    { who: '',     text: '（你突然想不起自己的名字了。）' }
  ],

  /* 追人时的内心独白 */
  chase: [
    '别回头看。',
    '别回头看。',
    '你听见后面有脚步声。',
    '两步一落 —— 和你的步子一样。',
    '别回头。',
    '它一直在后面叫你的名字。'
  ]

};
