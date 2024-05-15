import { lib, get, _status, ui, game, ai } from './noname.js';


export let CONTENT = function (config, pack) {
  /* <-------------------------武将评级-------------------------> */
  const junk = ['PScenhun', 'PSliru', 'PSben_sunben', 'PSquansun', 'PSrs_wolong', 'PSsunshangxiang', 'PSfx_shen_guanyu'];
  const rare = ['PScaoang', 'PSliubei', 'PSquyi', 'PSreyuanshu', 'PSlvbu', 'PSqun_machao', 'PSreluxun', 'PSluxun', 'PSxurong', 'PSliaohua', 'PScaopi', 'PShuangzhong', 'PSgongsunzan', 'PSdongzhuo', 'PSlifeng', 'PSqun_zhaoyun', 'PScaoren', 'PSzhangfei', 'PSsp_jiugechenpi', 'PSsp_jiugemangguo', 'PSlingcao', 'PSpanzhangmazhong', 'PSzhugeliang', 'PSmenghuo', 'PSsp_yebai', 'PSshu_sunshangxiang', 'PSxie_sunquan', 'PSxushi', 'PSguanyu', 'PSshen_zhangfei', 'PSlvmeng', 'PSxuyou', 'PShaozhao', 'PSshen_liubei', 'PSjiaxu', 'PSzhuangbeidashi', 'PScaocao', 'PSzhoutai', 'PSzhangsong', 'PSshiniangongzhu', 'PSzhanghe', 'PSzhangjiao', 'PSsp_yeshou', 'PSyuanshu', 'PSxizhicai', 'PSsunben', 'PSsunquan', 'PSliuzan', 'PSshen_jiangweix', 'PSshen_zhuge', 'PSrexusheng', 'PSshen_huangzhong', 'PSshen_guojia', 'PScaochun', 'PSqun_sunce', 'PScaoshuang', 'PSlukang', 'PScaoxiu', 'PSdahantianzi', 'db_PSdaweiwuwang', 'PSdianwei', 'PSduyu', 'PSerciyuan', 'PSgaoguimingmen', 'PSguosi', 'PShs_zhonghui', 'PShuanggai', 'PShuangyueying', 'PShw_sunquan'];
  const epic = ['PSpeixiu', 'PScaoying', 'PSshen_zuoci', 'PSluji', 'PSmachao', 'PSsp_jiugeshadiao', 'PSxuzhu', 'PSshen_simayi', 'PSyue_caiwenji', 'PSchenshi', 'PSlibai', 'PSzhonghui', 'PSshen_sunquan', 'PSshen_dengai', 'PSshen_xunyu', 'PSmeng_liubei', 'PScaojinyu', 'PSjin_duyu', 'PSsb_xushao', 'PSfuzhijie', 'PSwu_zhangliao', 'PSzuoci', 'PSzhangrang', 'PSzhenji', 'PSzhaoxiang', 'PSzhaoyun', 'PSxiahoujie', 'PSguanning', 'PSxushao', 'PSyangbiao', 'PSguanyunchang', 'PSsishouyige', 'PStongxiangge', 'PSsunru', 'PSjiesuanjie', 'PSshengui', 'PSnanhualaoxian', 'PSsh_zhangfei', 'PSshen_ganning'];
  const legend = ['PSshen_zhangliao', 'PSdian_huanggai', 'PSshen_dianwei', 'PSboss_lvbu1', 'PSxian_caozhi', 'PSzhangxuan', 'PSboss_lvbu2', 'PSboss_lvbu3', 'PSboss_lvbu4', 'PSshen_zhaoyun', 'PSshouyige'];
  //垃圾武将  
  lib.rank.rarity.junk.addArray(junk);
  //精品武将 
  lib.rank.rarity.rare.addArray(rare);
  //史诗武将
  lib.rank.rarity.epic.addArray(epic);
  //传说武将
  lib.rank.rarity.legend.addArray(legend);

  /* <-------------------------校检提示代码-------------------------> */
  /* const temp = [];
  const all = junk.concat(rare.concat(epic.concat(legend)));
  window.PScharacter.characters.forEach(ele => {
    if (temp.includes(ele)) console.warn(ele, '多余的'); 
    if (!all.includes(ele)) console.warn(ele, '不在评级里');
    else temp.push(ele);
  });
  all.forEach(ele => {
    if (!window.PScharacter.characters.includes(ele)) console.warn(ele, '不是PS武将');
  }); */

  /* <-------------------------添加时机翻译-------------------------> */
  lib.translate.phaseBegin = '回合开始阶段';
  lib.translate.phaseZhunbei = '准备阶段';
  lib.translate.phaseJudge = '判定阶段';
  lib.translate.phaseDraw = '摸牌阶段';
  lib.translate.phaseUse = '出牌阶段';
  lib.translate.phaseDiscard = '弃牌阶段';
  lib.translate.phaseJieshu = '回合结束阶段';

  /* <-------------------------花色符号染色-------------------------> */
  /**
   * 获取牌的花色数
   * @param { string|string[] } suit 诸如'spade'、'heart'的字符串
   * @returns { string } 返回包含HTML标签的字符串
   */
  get.suitTranslation = function (suit) {
    if (Array.isArray(suit)) {
      return suit.map(function (s) {
        return get.suitTranslation(s);
      }).join('、');
    }
    else if (typeof suit !== 'string') {
      return void 0;
    }
    const obj = {
      'spade': '<font color="black">♠︎</font>',
      'heart': '<font color="red">♥︎</font>',
      'club': '<font color="black">♣︎</font>',
      'diamond': '<font color="red">♦︎</font>',
    }
    return obj[suit];
  }

  /* <-------------------------获取花色数-------------------------> */
  /**
   * 获取牌的花色数
   * @param { object[] } cards 一堆牌
   * @param { object } player 可选参数，是否以该角色来判断花色
   * @returns { number } 返回花色数
   */
  get.cardsSuitsLength = function (cards, player) {
    const suits = [];
    for (let i = 0; i < cards.length; i++) {
      const suit = get.suit(cards[i], player);
      if (!lib.suit.includes(suit) || suits.includes(suit)) continue;
      suits.add(suit);
      if (lib.suit.length === suits.length) break;
    }
    return suits.length;
  }

  /* <-------------------------Player#recoverTo函数-------------------------> */
  /**
   * 将体力回复至
   * @param args  
   * @returns { object } Event#recover 返回一个事件对象
   */
  if (!lib.element.player.recoverTo) {
    lib.element.player.recoverTo = function () {
      const newArguments = [];
      let num = 1;
      for (let i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] === 'number') {
          num = arguments[i] - this.getHp(true);
          newArguments.push(num);
        } else {
          newArguments.push(arguments[i]);
        }
      }
      return this.recover(...newArguments);
    }
  }

  /* <-------------------------Player#reinitCharacter2函数-------------------------> */
  /**
   * 更换武将牌2 
   * @param { string } name1 变更前武将名
   * @param { string } name2 变更后武将名
   * @param { number[] } hp_MaxHp 变更后是否改变体力值和体力上限 
   * @returns { object } Event#changeCharacter 返回一个事件对象
   */
  if (!lib.element.player.reinitCharacter2) {
    lib.element.player.reinitCharacter2 = function (name1, name2, hp_MaxHp) {
      this.reinit(name1, name1, hp_MaxHp);
      return this.reinitCharacter(name1, name2);
    };
  }

  /* <-------------------------改变部分武将的技能配音-------------------------> */
  //改变虎牢关吕布“强袭”的配音
  game.changeSkillAudio('qiangxix', ['PSboss_lvbu2', 'PSboss_lvbu3', 'PSboss_lvbu4'], 'qiangxi_boss_lvbu3');
  //改变虎牢关吕布“完杀”的配音
  game.changeSkillAudio('rewansha', ['PSboss_lvbu2', 'PSboss_lvbu3', 'PSboss_lvbu4', 'PSshengui'], 'wansha_boss_lvbu3');
  //改变虎牢关吕布“铁骑”的配音 
  game.changeSkillAudio('retieji', ['PSboss_lvbu2', 'PSboss_lvbu3', 'PSboss_lvbu4'], 'retieji_boss_lvbu3');
  game.changeSkillAudio('sbtieji', 'PSshengui', 'retieji_boss_lvbu3');
  //改变虎牢关吕布“旋风”的配音
  game.changeSkillAudio('decadexuanfeng', ['PSboss_lvbu2', 'PSboss_lvbu3', 'PSboss_lvbu4', 'PSshengui'], 'xuanfeng_boss_lvbu3');
  //改变虎牢关吕布“无双”的配音
  game.changeSkillAudio('wushuang', ['PSboss_lvbu1', 'PSboss_lvbu2', 'PSboss_lvbu3', 'PSboss_lvbu4', 'PSshengui'], 'ext:PS武将/audio/skill:8');
  //改变PS曹操“护驾”的配音
  game.changeSkillAudio('hujia', 'PScaocao', 'hujia_re_caocao');
  //改变PS刘备“激将”的配音
  game.changeSkillAudio('rejijiang', 'PSliubei', 'jijiang1_re_liubei');
  //改变PS戏志才“天妒”的配音
  game.changeSkillAudio('tiandu', 'PSxizhicai', 'tiandu_xizhicai');
  //改变PS钟会“保族”的配音
  game.changeSkillAudio('clanbaozu', 'PSzhonghui', 'clanbaozu_clan_zhonghui');
  //改变PS曹丕“颂威”的配音
  game.changeSkillAudio('songwei', 'PScaopi', 'songwei_re_caopi');
  //改变PS赵襄的配音
  game.changeSkillAudio('refanghun', 'PSzhaoxiang', ['ext:PS武将/audio/skill/PSfanghun', 'ext:PS武将/audio/skill/PSfanghun2']);
  game.changeSkillAudio('refanghun', 'PSzhaoxiang2', ['ext:PS武将/audio/skill/PSfanghun_PSzhaoxiang21', 'ext:PS武将/audio/skill/PSfanghun_PSzhaoxiang22']);
  game.changeSkillAudio('PSfushi', 'PSzhaoxiang2', ['ext:PS武将/audio/skill/PSfushi_PSzhaoxiang21', 'ext:PS武将/audio/skill/PSfushi_PSzhaoxiang22']);

  /* <-------------------------播放阵亡语音-------------------------> */
  /* lib.skill._PSdieAudio = {
    trigger: {
      global: 'dieBegin'
    },
    //direct:true,
    priority: 2,
    forced: true,
    unique: true,
    popup: false,
    filter: function (event, player) {
      return player.name.includes('PS');
    },
    content: function () {
      game.playAudio('..', 'extension', 'PS武将/audio/die', trigger.player.name);
      // trigger.audioed = true;
    },
  }; */

  /* <-------------------------适配千幻聆音换肤-------------------------> */
  /* if (!lib.qhlypkg) {
    lib.qhlypkg = [];
  }
  lib.qhlypkg.push({
    isExt: true,
    filterCharacter: function (name) {
      return name.indexOf('PS') == 0;
    },

    isLutou: lib.config.xwLutou,
    prefix: 'extension/PS武将/',
    lutouPrefix: 'extension/PS武将/lutou/',
    skin: {
      standard: 'extension/PS武将/skin/standard/',
      lutou: 'extension/PS武将/skin/lutou/',
    },
    audioOrigin: 'extension/PS武将/audio/',
    audio: 'extension/PS武将/skin/audio/',
 
  }); */

  lib.element.player.PSchooseToDuiben = function (target, transList) {
    var next = game.createEvent('chooseToDuiben');
    next.player = this;
    next.target = target;
    next.translation = transList;
    next.setContent('PSchooseToDuiben');
    return next;
  }
  lib.element.content.PSchooseToDuiben = function () {
    'step 0';
    if (!event.namelist) event.namelist = ['全军出击', '分兵围城', '奇袭粮道', '开城诱敌'];
    game.broadcastAll(function (list) {
      var list2 = ['db_atk1', 'db_atk2', 'db_def1', 'db_def2'];
      var list3 = ['db_atk1_出阵迎战', 'db_atk2_拱卫中军', 'db_def1_直取敌营', 'db_def2_扰阵疲敌'];
      for (var i = 0; i < 4; i++) {
        lib.card[list2[i]].image = `card/${list3[i]}`;
        lib.translate[list2[i]] = list[i];
        lib.translate[list2[i] + '_info'] = _status.event.translation[i];
      }
    }, event.namelist);
    if (!event.title) event.title = '对策';
    game.log(player, '向', target, '发起了', '#y' + event.title);
    if (!event.ai) event.ai = function () { return 1 + Math.random(); };
    if (_status.connectMode) {
      player.chooseButtonOL([
        [player, [event.title + '：请选择一种策略', [[['', '', 'db_def2'], ['', '', 'db_def1']], 'vcard']], true],
        [target, [event.title + '：请选择一种策略', [[['', '', 'db_atk1'], ['', '', 'db_atk2']], 'vcard']], true]
      ], function () { }, event.ai).set('switchToAuto', function () {
        _status.event.result = 'ai';
      }).set('processAI', function () {
        var buttons = _status.event.dialog.buttons;
        return {
          bool: true,
          links: [buttons.randomGet().link],
        };
      });
    }
    'step 1';
    if (_status.connectMode) {
      event.mes = result[player.playerid].links[0][2];
      event.tes = result[target.playerid].links[0][2];
      event.goto(4);
    }
    else {
      player.chooseButton([event.title + '：请选择一种策略', [[['', '', 'db_def2'], ['', '', 'db_def1']], 'vcard']], true).ai = event.ai;
    }
    'step 2';
    event.mes = result.links[0][2];
    target.chooseButton([event.title + '：请选择一种策略', [[['', '', 'db_atk1'], ['', '', 'db_atk2']], 'vcard']], true).ai = event.ai;
    'step 3';
    event.tes = result.links[0][2];
    'step 4';
    game.broadcast(function () {
      ui.arena.classList.add('thrownhighlight');
    });
    ui.arena.classList.add('thrownhighlight');
    game.addVideo('thrownhighlight1');
    target.$compare(game.createCard(event.tes, '', ''), player, game.createCard(event.mes, '', ''));
    game.log(target, '选择的策略为', '#g' + get.translation(event.tes));
    game.log(player, '选择的策略为', '#g' + get.translation(event.mes));
    game.delay(0, 1500);
    'step 5';
    var mes = event.mes.slice(6);
    var tes = event.tes.slice(6);
    var str;
    if (mes == tes) {
      str = get.translation(player) + event.title + '成功';
      player.popup('胜', 'wood');
      target.popup('负', 'fire');
      game.log(player, '#g胜');
      event.result = { bool: true };
    }
    else {
      str = get.translation(player) + event.title + '失败';
      target.popup('胜', 'wood');
      player.popup('负', 'fire');
      game.log(target, '#g胜');
      event.result = { bool: false };
    }
    event.result.player = event.mes;
    event.result.target = event.tes;
    game.broadcastAll(function (str) {
      var dialog = ui.create.dialog(str);
      dialog.classList.add('center');
      setTimeout(function () {
        dialog.close();
      }, 1000);
    }, str);
    game.trySkillAudio(event.getParent().name + '_' + (event.result.bool ? 'true' + mes : 'false'), player);
    game.delay(2);
    'step 6';
    game.broadcastAll(function () {
      ui.arena.classList.remove('thrownhighlight');
    });
    game.addVideo('thrownhighlight2');
    if (event.clear !== false) {
      game.broadcastAll(ui.clear);
    }
  }
}

