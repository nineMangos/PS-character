import { lib, get, _status, ui, game, ai } from './noname.js';


export let CONTENT = function (config, pack) {
  /* <-------------------------武将评级-------------------------> */
  const junk = ['PScenhun', 'PSliru', 'PSben_sunben', 'PSquansun', 'PSrs_wolong', 'PSsunshangxiang', 'PSfx_shen_guanyu'];
  const rare = ['PScaoang', 'PSliubei', 'PSluxun', 'PSxurong', 'PSliaohua', 'PScaopi', 'PShuangzhong', 'PSgongsunzan', 'PSdongzhuo', 'PSlifeng', 'PSqun_zhaoyun', 'PScaoren', 'PSzhangfei', 'PSsp_jiugechenpi', 'PSsp_jiugemangguo', 'PSlingcao', 'PSpanzhangmazhong', 'PSzhugeliang', 'PSmenghuo', 'PSsp_yebai', 'PSshu_sunshangxiang', 'PSxie_sunquan', 'PSxushi', 'PSguanyu', 'PSshen_zhangfei', 'PSlvmeng', 'PSxuyou', 'PShaozhao', 'PSshen_liubei', 'PSjiaxu', 'PSzhuangbeidashi', 'PScaocao', 'PSzhoutai', 'PSzhangsong', 'PSshiniangongzhu', 'PSzhanghe', 'PSzhangjiao', 'PSsp_yeshou', 'PSyuanshu', 'PSxizhicai', 'PSsunben', 'PSsunquan', 'PSliuzan', 'PSshen_jiangweix', 'PSshen_zhuge', 'PSrexusheng', 'PSshen_huangzhong', 'PSshen_guojia', 'PScaochun', 'PSqun_sunce', 'PScaoshuang', 'PSlukang', 'PScaoxiu', 'PSdahantianzi', 'db_PSdaweiwuwang', 'PSdianwei', 'PSduyu', 'PSerciyuan', 'PSgaoguimingmen', 'PSguosi', 'PShs_zhonghui', 'PShuanggai', 'PShuangyueying', 'PShw_sunquan'];
  const epic = ['PSpeixiu', 'PScaoying', 'PSsp_jiugeshadiao', 'PSxuzhu', 'PSshen_simayi', 'PSyue_caiwenji', 'PSchenshi', 'PSlibai', 'PSzhonghui', 'PSshen_sunquan', 'PSshen_dengai', 'PSshen_xunyu', 'PSmeng_liubei', 'PScaojinyu', 'PSjin_duyu', 'PSsb_xushao', 'PSfuzhijie', 'PSwu_zhangliao', 'PSzuoci', 'PSzhangrang', 'PSzhenji', 'PSzhaoxiang', 'PSzhaoyun', 'PSxiahoujie', 'PSguanning', 'PSxushao', 'PSyangbiao', 'PSguanyunchang', 'PSsishouyige', 'PStongxiangge', 'PSsunru', 'PSjiesuanjie', 'PSshengui', 'PSnanhualaoxian', 'PSsh_zhangfei', 'PSshen_ganning'];
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
  /* window.PScharacter.charactersx = [];
  const all = junk.concat(rare.concat(epic.concat(legend)));
  all.forEach(ele => {
    if (window.PScharacter.charactersx.includes(ele)) {
      console.warn(ele, '多余的')
    }
    if (window.PScharacter.characters.includes(ele)) {
      window.PScharacter.charactersx.push(ele)
    }
    if (!window.PScharacter.characters.includes(ele)) {
      console.warn(ele, '不在PS包') 
    }
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


  if (!lib.element.Player.prototype || !('recoverTo' in lib.element.Player.prototype)) {
    lib.element.player.recoverTo = function () {
      const newArguments = [];
      let num;
      for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == 'number') {
          num = arguments[i] - this.hp;
          newArguments.push(num);
        } else {
          newArguments.push(arguments[i]);
        }
      }
      if (num < 0 || !num) return;
      return this.recover(...newArguments);
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
}