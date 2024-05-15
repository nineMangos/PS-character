'use strict';
window.PScharacter.import(function (lib, game, ui, get, ai, _status) {
  game.import('character', function () {
    var PScharacter = {
      name: 'PScharacter',
      connect: true,
      characterSort: {
        PScharacter: {
          PScharacter_wei: ['PScaocao', 'PSzhonghui', 'PSdianwei', 'PSzhanghe', 'PScaoxiu', 'PScaoang', 'PSshiniangongzhu', 'PScaojinyu', 'PScaochun', 'PScaoshuang', 'PShs_zhonghui', 'PSxizhicai', 'PSxiahoujie', 'PSzhenji', 'PSwu_zhangliao', 'PShaozhao'],
          PScharacter_shu: ['PSsh_zhangfei', 'PSshu_sunshangxiang', 'PStongxiangge', 'PSrs_wolong', 'PShuangyueying', 'PSzhaoxiang', 'PSzhangsong', 'PSguanyunchang', 'PSzhaoyun', 'PSzhuangbeidashi', 'PSguanyu', 'PSmeng_liubei'],
          PScharacter_wu: ['PSrexusheng', 'PSlvmeng', 'PSxie_sunquan', 'PSsunquan', 'PSsunshangxiang', 'PSliuzan', 'PShuanggai', 'PSlukang', 'PSzhoutai', 'PSquansun', 'PSjiesuanjie', 'PSzhangxuan', 'PScenhun', 'PSsunben', 'PShw_sunquan', 'PSsunru', 'PSfuzhijie', 'PSxushi'],
          PScharacter_qun: ['PSzhangjiao', 'PSlibai', 'PSyuanshu', 'PSxushao', 'PSguanning', 'PSliru', 'PSzuoci', 'PSerciyuan', 'PSdahantianzi', 'PSnanhualaoxian', 'PSduyu', 'PSzhangrang', 'PSqun_sunce', 'PSgaoguimingmen', 'PSsishouyige', 'PSyangbiao', 'PSguosi', 'PSpeixiu', 'PSsb_xushao', 'PSjiaxu', 'PSxuyou'],
          PScharacter_jin: ['PSjin_duyu'],
          PScharacter_shen: ['PSshen_sunquan', 'PSshen_dianwei', 'PSshouyige', 'PSshen_zhuge', 'PSshen_ganning', 'PSshen_zhaoyun', 'PSxian_caozhi', 'PSshen_jiangweix', 'PSboss_lvbu1', 'PSboss_lvbu2', 'PSboss_lvbu3', 'PSboss_lvbu4', 'PSshengui', 'PSshen_huangzhong', 'PSshen_guojia', 'PSfx_shen_guanyu', 'PSshen_liubei', 'PSshen_zhangliao', 'PSshen_zhangfei', 'PSshen_dengai', 'PSshen_xunyu'],
          PScharacter_db: ['db_PSdaweiwuwang'],
        },
      },
      character: {
        PSshouyige: ["male", "shen", 8, ["PSshuangquan"], ["die:../audio/die/shen_lvbu.mp3"]],//另一种写法：['die:ext:扩展名/武将ID.mp3']
        PSrexusheng: ["male", "wu", 4, ["PSpojun"], ["die:../audio/die/re_xusheng.mp3"]],
        PSsunquan: ["male", "wu", 4, ["PSzhiheng", "rejiuyuan"], []],
        PScaocao: ["male", "wei", 4, ["PSjianxiong", "rehujia"], []],
        PSdianwei: ["male", "wei", 4, ["PSqiangxi", "olningwu"], []],
        PSzhangjiao: ["male", "qun", 3, ["PSleiji", "guidao", "huangtian"], []],
        PSsunshangxiang: ["female", "wu", 3, ["PSxiaoji", "PSjieyin"], []],
        PSliuzan: ["male", "wu", 4, ["PSfenyin"], []],
        PSyuanshu: ["male", "qun", 4, ["rewangzun", "retongji", "PSjiwei"], []],
        PSzhanghe: ["male", "wei", 4, ["PSqiaobian"], []],
        "PSsh_zhangfei": ["male", "shu", 4, ["PSshihuang", "PSpaoxiao"], ["die:../audio/die/zhangfei.mp3"]],
        PStongxiangge: ["male", "shu", 4, ["PStongxiang"], ["die:../audio/die/maliang.mp3"]],
        "PSrs_wolong": ["male", "shu", 3, ["PSranshang", "bazhen", "rehuoji", "rekanpo", "cangzhuo"], ["die:../audio/die/re_sp_zhugeliang.mp3"]],
        PShuanggai: ["male", "wu", 4, ["PSkurou", "zhaxiang"], []],
        PSxushao: ["male", "qun", 4, ["PSpingjian"], []],
        PScaoxiu: ["male", "wei", 4, ["PSqianju", "PSqingxi"], []],
        "PSshen_zhuge": ["male", "shen", 3, ["PSqixing", "PSkuangfeng", "PSdawu"], ["die:../audio/die/shen_zhugeliang.mp3"]],
        PShuangyueying: ["female", "shu", 3, ["PSjizhi", "reqicai"], []],
        "PSshen_ganning": ["male", "shen", "3/6", ["drlt_poxi", "PSjieying"], []],
        PSguanning: ["male", "qun", "3/7", ["PSdunshi"], []],
        PSzhaoxiang: ["female", "shu", 4, ["refanghun", "PSfushi"], []],
        PSlukang: ["male", "wu", 4, ["drlt_qianjie", "PSjueyan", "drlt_poshi"], []],
        PSliru: ["male", "qun", 3, ["PSjuece", "remieji", "xinfencheng"], []],
        PScaoang: ["male", "wei", 4, ["PSkangkai"], []],
        PSzuoci: ["male", "qun", 3, ["PShuashen", "PSxinsheng"], []],
        PSzhoutai: ["male", "wu", 4, ["PSbuqu", "PSfenji"], []],
        PSerciyuan: ["male", "qun", 4, ["PSzanhe"], ["die:../audio/die/yuantanyuanshang.mp3"]],
        PSdahantianzi: ["male", "qun", 4, ["PSshengshi", "PSluanshi", "PSshanrang"], ["die:../audio/die/liuxie.mp3"]],
        PSnanhualaoxian: ["male", "qun", 3, ["PSyufeng", "PStianshu", "PSyinshi"], []],
        PSzhangsong: ["male", "shu", 3, ["PSqiangzhi", "PSxiantu"], []],
        PSquansun: ["male", "wu", 4, ["PShengzhi", "PSnengwan"], ["die:../audio/die/re_sunquan.mp3"]],
        PSjiesuanjie: ["female", "wu", 4, ["PSzailaiyici"], ["die:../audio/die/zhangxuan.mp3"]],
        PSguanyunchang: ["male", "shu", 4, ["wusheng", "PSweizhen"], ["die:../audio/die/re_guanyu.mp3"]],
        PSshen_zhaoyun: ["male", "shen", 2, ["PSjuejing", "relonghun"], []],
        PSzhangxuan: ["female", "wu", 4, ["PStongli"], []],
        PScenhun: ["male", "wu", 4, ["jishe", "PSlianhuo"], []],
        PSshiniangongzhu: ["male", "wei", 4, ["PSshanjia"], ["die:../audio/die/caoang.mp3"]],
        PScaojinyu: ["female", "wei", 4, ["PSyuqi", "PSshanshen", "PSxianjing"], ['die:ext:PS武将/audio/die/PScaojinyu.mp3']],
        PSzhaoyun: ["male", "shu", 5, ["longdan", "PShuwei"], []],
        PScaochun: ["male", "wei", 4, ["PSreshanjia", "PSxiaorui"], []],
        PScaoshuang: ["male", "wei", 4, ["PStuogu", "shanzhuan"], []],
        "PSxian_caozhi": ["male", "shen", 3, ["PSluoying", "PSjiushi"], ["die:../audio/die/re_caozhi.mp3"]],
        PSsunben: ["male", "wu", 4, ["oljiang", "PSbaiban", "PSbb_hunzi"], ["die:../audio/die/re_sunben.mp3"]],
        PSduyu: ["male", "qun", 4, ["PSmiewu", "PSqiyang"], ["die:../audio/die/sp_duyu.mp3"]],
        "PSshen_jiangweix": ["male", "shen", 3, ["PSjiufa", "PSkefu", "PSwantian"], ["die:shen_jiangwei.mp3"]],
        "PShs_zhonghui": ["male", "wei", 4, ["PSmn_quanji", "PSmn_paiyi"], ["die:../audio/die/xin_zhonghui.mp3"]],
        PSzhuangbeidashi: ["male", "shu", 4, ["pytianjiang", "pyzhuren", "xinfu_jingxie1", "PSshenzhu"], ["die:../audio/die/puyuan.mp3"]],
        "PSboss_lvbu1": ["male", "shen", 8, ["wushuang", "PSjingjia1", "PSaozhan1", "PSbaguan1"], ["die:../audio/die/boss_lvbu1.mp3"]],
        "PSboss_lvbu2": ["male", "shen", 6, ["wushuang", "PSshenwei2", "PSshenji2", "PSbaguan2"], ["die:../audio/die/boss_lvbu1.mp3"]],
        "PSboss_lvbu3": ["male", "shen", 6, ["wushuang", "PSshenqu3", "PSjiwu3", "PSbaguan2"], ["die:../audio/die/boss_lvbu1.mp3"]],
        "PSboss_lvbu4": ["male", "shen", 6, ["wushuang", "PSkuangbao4", "PSshenfen4", "PSbaguan2"], ["die:../audio/die/boss_lvbu1.mp3"]],
        PSshengui: ["male", "shen", 6, ["wushuang", "shenqu", "PSjiwu"], ["die:../audio/die/boss_lvbu1.mp3"]],
        PSzhangrang: ["male", "qun", 4, ["PStaoluan"], []],
        PSxizhicai: ["male", "wei", 3, ["tiandu", "PSxianfu", "PSchouce"], []],
        PSxiahoujie: ["male", "wei", 5, ["PSdanda"], []],
        PSqun_sunce: ["male", "qun", "4/5", ["PSxiaozhan", "PSzengxi"], ["die:../audio/die/re_sunben.mp3"]],
        PSgaoguimingmen: ["male", "qun", 4, ["PSluansha"], ["die:../audio/die/xin_yuanshao.mp3"]],
        PSsishouyige: ["male", "qun", 4, ["PShengce"], []],//待补充
        db_PSdaweiwuwang: ['male', 'wei', 4, ['PSdwww_zhiheng', 'PSxiangong', 'PScuicheng'], ['doublegroup:wei:wu', 'die:../audio/die/re_sunquan.mp3']],
        "PShw_sunquan": ["male", "wu", 4, ["rezhiheng", "PShuiwan", "rejiuyuan"], ["die:../audio/die/re_sunquan.mp3"]],
        PSyangbiao: ["male", "qun", 5, ["PSzhaohan", "rangjie", "PSyizheng"], []],
        PSguosi: ["male", "qun", 4, ["PStanbei", "PSsidao"], []],
        "PSshen_huangzhong": ["male", "shen", 3, ["PSdingjun"], ["die:../audio/die/sb_huangzhong.mp3"]],
        "PSshen_guojia": ["male", "shen", 3, ["PShuishi", "stianyi", "resghuishi"], []],
        PSzhenji: ["female", "wei", 3, ["PSluoshen", "PSqingguo"], []],
        "PSwu_zhangliao": ["male", "wei", "4/6", ["PSwu_tuxi", "PSwu_zhenzhan"], ["die:../audio/die/re_zhangliao.mp3"]],
        PSsunru: ["female", "wu", 4, ["PSyingjian", "PSshixin"], []],
        PSfuzhijie: ["female", "wu", 4, ["PSfuzhi"], ["die:../audio/die/zhangxuan.mp3"]],
        "PSfx_shen_guanyu": ["male", "shen", 4, ["PSshenwu", "PShunwu"], ["die:../audio/die/shen_guanyu.mp3"]],
        PSpeixiu: ["male", "qun", 4, ["PSxingtu", "PSjuezhi"], []],
        "PSshen_liubei": ["male", "shen", 6, ["PSlongnu", "PSlb_jieying"], []],
        "PSjin_duyu": ["male", "jin", 4, ["PSsanchen", "PSzhaotao", "PSpozhu"], ["die:../audio/die/duyu.mp3"]],
        "PSsb_xushao": ["male", "qun", 4, ["PSsb_pingjian"], ["die:../audio/die/xushao.mp3"]],
        PSxushi: ["female", "wu", 3, ["PSwengua", "PSfuzhu"], []],
        PSjiaxu: ["male", "qun", 3, ["PSluanwu", "PSwansha", "reweimu"], []],
        "PSshen_zhangliao": ["male", "shen", 4, ["PSduorui", "drlt_zhiti"], []],
        PSguanyu: ["male", "shu", 4, ["PSwusheng", "PSyijue", "PSmashu"], []],
        "PSshen_zhangfei": ["male", "shen", 4, ["PSshencai", "PSxunshi"], []],
        "PSmeng_liubei": ["male", "shu", 1, ["PStaoyuan", "PSshiren"], ["die:../audio/die/re_liubei.mp3"]],
        "PSshen_dengai": ["male", "shen", 4, ["dctuoyu", "PSxianjin", "dcqijing"], []],
        "PSshen_xunyu": ["male", "shen", 3, ["PSlingce", "PStianzuo", "PSdinghan"], []],
        "PShaozhao": ["male", "wei", 4, ["PSzhengu"], []],
        "PSxuyou": ["male", "qun", 3, ["PSchenglve", "PSshicai", "nzry_cunmu"], []],
        "PSshen_sunquan": ["male", "shen", 4, ["PSyuheng", "PSdili"], []],
        'PSshen_dianwei': ["male", "shen", 4, ["PSjuanjia", "qiexie", "cuijue"], []],
        PSlvmeng: ["male", "wu", 4, ["PSbolan"], ["die:../audio/die/re_lvmeng.mp3"]],
        PSzhonghui: ["male", "wei", 4, ["clanyuzhi", "PSquanshu", "clanbaozu", "PSpaiyi"], ["die:../audio/die/xin_zhonghui.mp3"]],
        PSlibai: ["male", "qun", 3, ["PSjiuxian", "PSshixian"], []],
        "PSxie_sunquan": ["male", "wu", 4, ["PSzongheng", "PSxiqu", "PSchengchen"], ["die:../audio/die/re_sunquan.mp3"]],
        "PSshu_sunshangxiang": ["female", "shu", 3, ["PSliangzhu", "PSfanxiang"], ["die:../audio/die/sp_sunshangxiang.mp3"]],
      },
      characterIntro: {
        PSshouyige: '由“九个芒果”设计',
        PSrexusheng: '由“九个芒果”设计',
        PSsunquan: '由“九个芒果”设计',
        PScaocao: '由“九个芒果”设计',
        PSdianwei: '由“九个芒果”设计',
        PSzhangjiao: '由“九个芒果”设计',
        PSsunshangxiang: '由“九个鲨雕”设计',
        PSliuzan: '由“九个芒果”设计',
        PSyuanshu: '由“梦舞灬愁”设计',
        PSzhanghe: '由“神鬼高达”设计',
        "PSsh_zhangfei": '由“风龙散人”设计',
        PStongxiangge: '由“九个芒果”设计',
        "PSrs_wolong": '由“宫愿合”设计',
        "PShuanggai": '由“闹够没有界徐盛”设计',
        "PSxushao": '由“宫愿合”设计',
        PScaoxiu: '由“SC雁微凉”设计',
        "PSshen_zhuge": '由“欧文哈尔”设计',
        PShuangyueying: '由“九个芒果”设计',
        "PSshen_ganning": '由“神鬼高达”设计',
        PSguanning: '由“杯糕萍琪派”设计',
        PSzhaoxiang: '由“神鬼高达”设计',
        PSlukang: '由“待我白衣为卿相”设计',
        PSliru: '由“欧文哈尔”设计',
        PScaoang: '由“10万原石”设计',
        PSzuoci: '由“九个芒果”设计',
        PSzhoutai: '由“欧文哈尔”设计',
        PSerciyuan: '由“曙光乘舟访人间”设计',
        PSdahantianzi: '由“一剑光寒19州”设计',
        PSnanhualaoxian: '由“一顿七只屑狐狸”设计',
        PSzhangsong: '由“子夜、night”设计',
        PSquansun: '由“神鬼高达”设计',
        PSjiesuanjie: '由“CuberPR”设计',
        PSguanyunchang: '由“你想去哪儿呢”设计',
        "PSshen_zhaoyun": '由“神鬼高达”设计',
        PSzhangxuan: '由“看透一切的军师”设计',
        PScenhun: '由“欧文哈尔”设计',
        PSshiniangongzhu: '由"Kaesar”设计',
        PScaojinyu: '由“一顿七只屑狐狸”设计',
        PSzhaoyun: '由“不想再说也许可以”设计',
        PScaochun: '由“你想去哪儿呢”设计',
        PScaoshuang: '由“九个芒果”设计',
        "PSxian_caozhi": '由"Kaesar”设计',
        PSsunben: '由“你想去哪儿呢”设计',
        PSduyu: '由“神鬼高达”设计',
        "PSshen_jiangweix": '由“我最爱的雨雨”设计',
        "PShs_zhonghui": '由“sc蓝晨跃”设计',
        PSzhuangbeidashi: '由“10万原石”和“遇见鲲啊”设计',
        "PSboss_lvbu1": '由“神鬼高达”设计',
        "PSboss_lvbu2": '由“神鬼高达”设计',
        "PSboss_lvbu3": '由“神鬼高达”设计',
        "PSboss_lvbu4": '由“神鬼高达”设计',
        PSshengui: '由“神鬼高达”设计',
        PSzhangrang: '由“一顿七只屑狐狸”设计',
        PSxizhicai: '由“九个芒果”设计',
        PSxiahoujie: '由“你想去哪儿呢”设计',
        PSqun_sunce: '由“咏雪雪”设计',
        PSgaoguimingmen: '由“希神文祖华”设计',
        PSsishouyige: '由“10万原石”设计',
        "db_PSdaweiwuwang": '由“眼中藏着阿卡丽”设计',
        "PShw_sunquan": '由“你想去哪儿呢”设计',
        PSyangbiao: '由“一顿七只屑狐狸”设计',
        PSguosi: '由“你想去哪儿呢”设计',
        "PSshen_huangzhong": '由“我最爱的雨雨”设计',
        "PSshen_guojia": '由“九个芒果”设计',
        PSzhenji: '由“人生仁生”设计',
        "PSwu_zhangliao": '由“小男孩_Official”设计',
        PSsunru: '由“一顿七只屑狐狸”设计',
        PSfuzhijie: '由“门刀臣零衣”设计',
        "PSfx_shen_guanyu": '由“绿诗涵”设计',
        PSpeixiu: '由“九个芒果”设计',
        "PSshen_liubei": '由“希神文祖华”设计',
        "PSsb_xushao": '由“才七乓”设计',
        PSxushi: '由“眼中藏着阿卡丽”设计',
        "PSjin_duyu": '由“一顿七只屑狐狸”设计',
        PSjiaxu: '由“九个芒果”设计',
        "PSshen_zhangliao": '由“九个芒果”设计',
        PSguanyu: '由“一顿七只屑狐狸”设计',
        "PSshen_zhangfei": '由“虚幼屎”设计',
        "PSmeng_liubei": '由“遇见鲲啊”设计',
        "PSshen_dengai": '由“顾梦133”设计',
        "PSshen_xunyu": '由“一顿七只屑狐狸”设计',
        PShaozhao: '由“你想去哪儿呢”设计',
        PSxuyou: '由“神鬼高达”设计',
        "PSshen_sunquan": '由“九个芒果”设计',
        'PSshen_dianwei': '由“mento last”设计',
        PSlvmeng: '由“群弱智（兼群小丑）”设计',
        PSzhonghui: '由“九个鲨雕”设计',
        PSlibai: '由“九个芒果”设计',
        "PSxie_sunquan": '由“一顿七只屑狐狸”设计',
        "PSshu_sunshangxiang": '由“九个鲨雕”设计',
      },//武将介绍
      characterTitle: {
      },//武将称号
      characterReplace: {
        PSsunquan: ['PShw_sunquan', 'PSquansun', 'db_PSdaweiwuwang'],
        PScaochun: ['PSshiniangongzhu'],
        PSguanyu: ['PSguanyunchang'],
        PSzhangxuan: ['PSfuzhijie', 'PSjiesuanjie'],
        PSsunben: ['PSqun_sunce'],
        PSduyu: ['PSjin_duyu'],
        PSxushao: ['PSsb_xushao'],
        "PSboss_lvbu1": ["PSboss_lvbu2", "PSboss_lvbu3", "PSboss_lvbu4"],
        "PSsunshangxiang": ["PSshu_sunshangxiang"],
      },//武将切换
      characterFilter: {
        PSzuoci: function (mode) {
          return mode != 'guozhan';
        },
        db_PSdaweiwuwang: function (mode) {
          return mode != 'guozhan';
        },
      },//武将在特定模式下禁用
      perfectPair: {
      },//珠联璧合
      card: {},
      skill: {
        PSceshi: {
          trigger: {
            player: "gainAfter",
          },
          content: () => {
            let arr = player.getHistory('useSkill');
            console.log(arr);
            game.log(arr);
          },
        },
        PSfenyin: {
          audio: "fenyin",
          trigger: {
            player: "useCard",
          },
          frequent: true,
          locked: false,
          preHidden: true,
          filter: function (event, player) {
            if (_status.currentPhase != player) return false;
            return player.getHistory('useCard').length <= 5;
          },
          content: function () {
            player.draw(player.getHistory('useCard').length);
          },
        },
        PSjieyin: {
          audio: "rejieyin",
          enable: "phaseUse",
          filterCard: true,
          usable: 1,
          position: "he",
          filter: function (event, player) {
            return player.countCards('he') > 0;
          },
          check: function (card) {
            var player = _status.event.player;
            if (get.position(card) == 'e') {
              var subtype = get.subtype(card);
              if (!game.hasPlayer(function (current) {
                return current != player && current.hp != player.hp && get.attitude(player, current) > 0 && !current.countCards('e', { subtype: subtype });
              })) {
                return 0;
              }
              if (player.countCards('h', { subtype: subtype })) return 20 - get.value(card);
              return 10 - get.value(card);
            }
            else {
              if (player.countCards('e')) return 0;
              if (player.countCards('h', { type: 'equip' })) return 0;
              return 8 - get.value(card);
            }
          },
          filterTarget: function (card, player, target) {
            if (!target.hasSex('male')) return false;
            var card = ui.selected.cards[0];
            if (!card) return false;
            if (get.position(card) == 'e' && !target.canEquip(card)) return false;
            return true;
          },
          discard: false,
          delay: false,
          lose: false,
          content: function () {
            'step 0'
            if (get.position(cards[0]) == 'e') event._result = { index: 0 };
            else if (get.type(cards[0]) != 'equip' || !target.canEquip(cards[0])) event._result = { index: 1 };
            else player.chooseControl().set('choiceList', [
              '将' + get.translation(cards[0]) + '置入' + get.translation(target) + '的装备区',
              '弃置' + get.translation(cards[0]),
            ]).ai = function () { return 1 };
            'step 1'
            if (result.index == 0) {
              player.$give(cards, target, false);
              target.equip(cards[0]);
            }
            else {
              player.discard(cards);
            }
            'step 2'
            let players = [player, target];
            players.forEach(current => {
              if (current.hp < current.maxHp) current.recover();
              else current.draw();
            });
          },
          ai: {
            order: function () {
              var player = _status.event.player;
              var es = player.getCards('e');
              for (var i = 0; i < es.length; i++) {
                if (player.countCards('h', { subtype: get.subtype(es[i]) })) return 10;
              }
              return 2;
            },
            result: {
              target: function (player, target) {
                var goon = function () {
                  var es = player.getCards('e');
                  for (var i = 0; i < es.length; i++) {
                    if (player.countCards('h', { subtype: get.subtype(es[i]) })) return true;
                  }
                  return false;
                }
                if (player.hp < target.hp) {
                  if (player.isHealthy()) {
                    if (!player.needsToDiscard(1) || goon()) return 0.1;
                    return 0;
                  }
                  return 1.5;
                }
                if (player.hp > target.hp) {
                  if (target.isHealthy()) {
                    if (!player.needsToDiscard(1) || goon()) return 0.1;
                    return 0;
                  }
                  return 1;
                }
                return 0;
              },
            },
          },
          "_priority": 0,
        },
        PSxiaoji: {
          audio: "ext:PS武将/audio/skill:2",
          trigger: {
            player: "loseAfter",
            global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
          },
          frequent: true,
          filter: function (event, player, name) {
            if (name == "equipAfter" && event.player == player) return true;
            var evt = event.getl(player);
            return evt && evt.player == player && evt.es && evt.es.length > 0;
          },
          content: function () {
            "step 0"
            if (event.triggername == "equipAfter" && trigger.player == player) player.draw(_status.currentPhase == player ? 1 : 3);
            event.count = trigger.getl(player).es.length;
            if (!event.count) event.finish();
            "step 1"
            event.count--;
            player.draw(_status.currentPhase == player ? 1 : 3);
            "step 2"
            if (event.count > 0) {
              player.chooseBool(get.prompt2('xiaoji')).set('frequentSkill', 'xiaoji').ai = lib.filter.all;
            }
            "step 3"
            if (result.bool) {
              player.logSkill('xiaoji');
              event.goto(1);
            }
          },
          ai: {
            noe: true,
            reverseEquip: true,
            effect: {
              target: function (card, player, target, current) {
                if (get.type(card) == 'equip' && !get.cardtag(card, 'gifts')) return [1, 3];
              },
            },
          },
          "_priority": 0,
        },
        PSliangzhu: {
          audio: "liangzhu",
          trigger: {
            global: "recoverAfter",
          },
          frequent: true,
          filter: function (event, player) {
            return true;
          },
          content: function () {
            'step 0'
            player.draw();
            player.chooseBool(`是否弃置一张牌令${get.translation(trigger.player)}摸两张牌`).set('ai', () => {
              get.attitude(player, trigger.player) > 0
            }).set('player', _status.event.player);
            'step 1'
            if (result.bool) {
              player.chooseToDiscard('he', true, 1);
              trigger.player.draw(2);
              if (!player.storage.PSliangzhu) player.storage.PSliangzhu = [];
              player.storage.PSliangzhu.add(trigger.player);
            }
          },
          ai: {
            expose: 0.1,
          },
          "_priority": 0,
        },
        PSfanxiang: {
          skillAnimation: true,
          animationColor: "fire",
          audio: "fanxiang",
          unique: true,
          juexingji: true,
          forceunique: true,
          derivation: "PSxiaoji",
          trigger: {
            player: "phaseZhunbeiBegin",
          },
          filter: function (event, player) {
            if (player.storage.PSfanxiang) return false;
            return game.hasPlayer(function (current) {
              return player.storage.PSliangzhu && player.storage.PSliangzhu.contains(current) && current.isDamaged();
            });
          },
          forced: true,
          content: function () {
            'step 0'
            player.storage.PSfanxiang = true;
            player.awakenSkill('PSfanxiang');
            let list = [
              '增加一点体力上限并回复一点体力',
              '获得技能〖枭姬〗',
              '背水：失去技能〖良助〗，然后依次执行上述所有选项'
            ];
            player.chooseControl().set('prompt', '返乡：请选择一项').set('choiceList', list).set('ai', () => {
              let player = _status.event.player;
              if (!player.countCards('h', name => ['jiu', 'tao'].contains(name)) && player.hp == 1) return '选项三';
              return '选项二';
            });
            'step 1'
            switch (result.index) {
              case 0:
                player.gainMaxHp();
                player.recover();
                break;
              case 1:
                player.addSkillLog('PSxiaoji');
                break;
              case 2:
                player.removeSkill('PSliangzhu');
                player.gainMaxHp();
                player.recover();
                player.addSkillLog('PSxiaoji');
            }
          },
          "_priority": 0,
        },
        PSshuangquan: {
          mod: {
            selectTarget: function (card, player, range) {
              if (card.name == 'sha' && range[1] != -1) {
                range[1]++;
              }
              if (card.name == 'tiesuo' && range[1] != -1) {
                range[1] += 2;
              }
            },
            cardUsable: function (card, player, num) {
              if (card.name == 'sha') return num + 1;
            },
            globalFrom: function (from, to, distance) {
              return distance - 1;
            },
            globalTo: function (from, to, distance) {
              return distance + 1;
            },
          },
          trigger: {
            global: "phaseBefore",
            player: "enterGame",
          },
          forced: true,
          filter: function (event, player) {
            return (event.name != 'phase' || game.phaseNumber == 0) && player.hasEnabledSlot(2);
          },
          content: function () {
            const equips = ['equip1', 'equip2', 'equip3', 'equip4', 'equip5'];
            let num;
            let expand;
            for (let equip of equips) {
              expand = 0;
              num = player.countEnabledSlot(equip) + player.countDisabledSlot(equip);
              while (expand < num) {
                player.expandEquip(equip);
                expand++;
              }
            }
          },
          "_priority": -1,
          group: ["wushuang1", "wushuang2", "PSshuangquan_phase", "PSshuangquan_niepan", "PSshuangquan_damage", "PSshuangquan_again", "PSshuangquan_add", "PSshuangquan_clear", "PSshuangquan_more", "PSshuangquan_use"],
          preHidden: ["wushuang1", "wushuang2", "PSshuangquan_phase", "PSshuangquan_niepan", "PSshuangquan_damage", "PSshuangquan_again", "PSshuangquan_add", "PSshuangquan_clear", "PSshuangquan_more", "PSshuangquan_use"],
          subSkill: {
            phase: {
              audio: "botu",
              trigger: {
                player: "phaseAfter",
              },
              filter: function (event, player) {
                return player.storage.PSshuangquan_phase != 1;
              },
              priority: -50,
              forced: true,
              content: function () {
                player.insertPhase();
                player.storage.PSshuangquan_phase = 1;
              },
              sub: true,
            },
            clear: {
              trigger: {
                global: "phaseZhunbeiBegin",
              },
              filter: function (event, player) {

                return player.storage.PSshuangquan_phase == 1 && event.player != player;
              },
              priority: -50,
              forced: true,
              content: function () {
                player.storage.PSshuangquan_phase = 0;
              },
              sub: true,
            },
            use: {
              trigger: {
                player: "useCard1",
              },
              direct: true,
              filter: function (event, player) {
                var info = get.info(event.card, false);
                if (info.allowMultiple == false) return false;
                if (get.type(event.card) != 'trick') return false;
                if (event.card.name == 'tiesuo') return false;
                if (event.targets && !info.multitarget) {
                  if (game.hasPlayer(function (current) {
                    return !event.targets.contains(current) && lib.filter.targetEnabled2(event.card, player, current) && lib.filter.targetInRange(event.card, player, current);
                  })) {
                    return true;
                  }
                }
                return false;
              },
              content: function () {
                'step 0'
                var num = game.countPlayer(function (current) {
                  return !trigger.targets.contains(current) && lib.filter.targetEnabled2(trigger.card, player, current) && lib.filter.targetInRange(trigger.card, player, current);
                });
                player.chooseTarget('双全：是否为' + get.translation(trigger.card) + '增加一个目标？', 1, function (card, player, target) {
                  var trigger = _status.event.getTrigger();
                  var card = trigger.card;
                  return !trigger.targets.contains(target) && lib.filter.targetEnabled2(card, player, target) && lib.filter.targetInRange(card, player, target);
                }).set('ai', function (target) {
                  var player = _status.event.player;
                  var card = _status.event.getTrigger().card;
                  return get.effect(target, card, player, player);
                });
                'step 1'
                if (result.bool) {
                  if (player != game.me && !player.isOnline()) game.delayx();
                }
                else event.finish();
                'step 2'
                var targets = result.targets.sortBySeat();
                trigger.targets.addArray(targets);
              },
              sub: true,
            },
            niepan: {
              audio: "niepan",
              unique: true,
              trigger: {
                player: "dieBefore",
              },
              forced: true,
              mark: true,
              skillAnimation: true,
              animationStr: "涅槃",
              limited: true,
              animationColor: "orange",
              init: function (player) {
                player.storage.PSshuangquan_niepan = false;
              },
              content: function () {
                'step 0'
                trigger.cancel();
                player.awakenSkill('PSshuangquan_niepan');
                player.storage.PSshuangquan_niepan = true;

                'step 1'
                if (player.hp < player.maxHp) {
                  player.recover(player.maxHp - player.hp);
                }

              },
              ai: {
                order: 1,
                skillTagFilter: function (player, arg, target) {
                  if (player != target || player.storage.PSshuangquan_niepan) return false;
                },
                save: true,
                result: {
                  player: function (player) {
                    if (player.hp <= 0) return 10;
                    if (player.hp <= 2 && player.countCards('he') <= 1) return 10;
                    return 0;
                  },
                },
                threaten: function (player, target) {
                  if (!target.storage.PSshuangquan_niepan) return 0.6;
                },
              },
              intro: {
                content: "limited",
              },
              sub: true,
            },
            more: {
              trigger: {
                global: "gameDrawBegin",
              },
              forced: true,
              popup: false,
              silent: true,
              content: function () {
                var num = typeof trigger.num == 'function' ? trigger.num(player) : trigger.num;
                num = num * 2;
                event.num = trigger.num;
                trigger.num = function (target) {
                  if (target == player) return num;
                  else if (typeof event.num == 'function') return event.num(target);
                  else return event.num;
                };
              },
              sub: true,
            },
            damage: {
              audio: "ol_wuqian",
              trigger: {
                source: "damageBegin1",
                player: ["recoverBegin", "damageBegin4"],
              },
              forced: true,
              content: function () {
                if (event.triggername == 'damageBegin4') trigger.num = Math.floor(trigger.num / 2);
                else trigger.num += trigger.num;
              },
              sub: true,
            },
            again: {
              trigger: {
                player: "useCardAfter",
              },
              filter: function (event, player, name) {
                if (event.getParent(2).name == 'PSshuangquan_again') return false;
                if (!event.card || event.card.length == 0) return false;
                var type = get.type(event.card);

                if (['shan', 'wuxie'].contains(event.card.name)) return false;
                return game.findPlayer2(target => {
                  var info = lib.card[event.card.name];
                  if (info.autoViewAs) {
                    if (player.canUse({ card: event.card, name: info.autoViewAs }, target, false)) return true;
                  }
                  else if (player.canUse(event.card, target, false)) return true;
                  return false;
                });
              },
              forced: true,
              content: function () {
                var createCard = game.createCard2(trigger.card);
                var info = lib.card[createCard.name];
                if (info.autoViewAs) player.chooseUseTarget([createCard], { name: info.autoViewAs }, false);
                else player.chooseUseTarget(createCard, false);
              },
              ai: {
                threaten: 2,
              },
              sub: true,
            },
            add: {
              audio: "reyingzi",
              trigger: {
                player: "phaseDrawBegin",
              },
              forced: true,
              filter: function (event, player) {
                return !event.numFixed;
              },
              content: function () {
                trigger.num += trigger.num;
              },
              ai: {
                threaten: 1.3,
              },
              sub: true,
            },
          },
        },
        PSpojun: {
          shaRelated: true,
          audio: "repojun",
          trigger: {
            player: "useCardToPlayered",
          },
          direct: true,
          filter: function (event, player) {
            return event.card.name == 'sha' && event.target.hp > 0 && event.target.countCards('he') > 0;
          },
          content: function () {
            player.logSkill("chongzhen2");
            // player.emotion('zhenji_emotion', 1);
            player.say(["闹够了没有？", "你犯大吴疆土了！"].randomGet());
            var next = player.gainPlayerCard(trigger.target, 'he', [1, Math.min(trigger.target.hp, trigger.target.countCards('he'))], get.prompt('repojun', trigger.target), 'visibleMove');
            next.set('ai', function (button) {
              if (!_status.event.goon) return 0;
              var val = get.value(button.link);
              if (button.link == _status.event.target.getEquip(2)) return 2 * (val + 3);
              return val;
            });
            next.set('goon', get.attitude(player, trigger.target) <= 0);
            next.set('forceAuto', true);
          },
          group: "repojun3",
        },
        PStongxiang: {
          audio: "zishu",
          trigger: {
            global: "gainAfter",
          },
          frequent: true,
          filter: function (event, player) {
            return event.getParent().name == 'draw' && event.player != player;
          },
          content: function () {
            player.draw('nodelay', trigger.cards.length);
          },
          group: "PStongxiang_discard",
          subSkill: {
            discard: {
              audio: "zishu",
              frequent: false,
              trigger: {
                player: "loseAfter",
              },
              filter: function (event, player) {
                if (event.type != 'discard') return false;
                for (var i = 0; i < event.cards2.length; i++) {
                  if (get.position(event.cards2[i]) == 'd') {
                    return true;
                  }
                }
                return false;
              },
              filterTarget: function (card, player, target) {
                return player != target && target.countCards('he') >= 1;
              },
              selectTarget: 1,
              content: function () {
                'step 0'
                player.chooseTarget('令一名其他角色弃置等量的牌', function (card, player, target) {
                  if (player == target) return false;
                  return target.countDiscardableCards(player, 'he');
                }).set('ai', function (target) {
                  return -get.attitude(_status.event.player, target);
                });
                'step 1'
                if (result.bool) {

                  result.targets[0].chooseToDiscard(true, 'he', trigger.cards.length);
                }
                else event.finish();
              },
              sub: true,
            },
          },
        },
        PSshihuang: {
          audio: "sbpaoxiao",
          trigger: {
            global: "loseAfter",
          },
          frequent: true,
          filter: function (event, player) {
            return event.player != player && !['useCard', 'respond'].contains(event.getParent().name);
            for (var i = 0; i < event.cards2.length; i++) {
              if (get.suit(event.cards2[i], event.player) == 'club' && get.position(event.cards2[i], true) == 'd') {
                return true;
              }
            }
            return false;
          },
          content: function () {
            "step 0"
            if (trigger.delay == false) game.delay();
            "step 1"
            var cards = [];
            for (var i = 0; i < trigger.cards.length; i++) {
              if (get.position(trigger.cards[i]) == 'd') {
                cards.push(trigger.cards[i]);
              }
            }
            if (cards.length) {
              player.gain(cards, 'gain2', 'log');
            }
          },
          ai: {
            effect: {
              target: function (card, player, target) {
                if (get.tag(card, 'respond') && target.countCards('h') > 1) return [1, 0.2];
              },
            },
          },
        },
        PSpaoxiao: {
          audio: "paoxiao",
          firstDo: true,
          audioname: ["re_zhangfei", "guanzhang", "xiahouba"],
          trigger: {
            player: "useCard1",
          },
          forced: true,
          intro: {
            content: "本回合已使用#张杀",
          },
          onremove: true,
          init: function (player, skill) {
            if (!player.storage[skill]) player.storage[skill] = 1;
          },
          filter: function (event, player) {
            return !event.audioed && event.card.name == 'sha' && player.countUsed('sha', true) > 1 && event.getParent().type == 'phase';
          },
          content: function () {
            player.addMark('PSpaoxiao', 1);
            trigger.audioed = true;
          },
          mod: {
            cardUsable: function (card, player, num) {
              if (card.name == 'sha') return Infinity;
            },
          },
          group: ["PSpaoxiao_cancel", "PSpaoxiao_remove"],
          subSkill: {
            cancel: {
              audio: "keji",
              audioname: ["re_lvmeng", "sp_lvmeng"],
              trigger: {
                player: "phaseDiscardBefore",
              },
              forced: true,
              frequent: function (event, player) {
                return player.needsToDiscard();
              },
              filter: function (event, player) {
                return player.countUsed('sha', true) <= game.countPlayer();
              },
              content: function () {
                trigger.cancel();
              },
              sub: true,
            },
            remove: {
              trigger: {
                player: "phaseJieshuBegin",
              },
              forced: true,
              filter: function (event, player) {
                return player.countMark('PSpaoxiao') >= 1;
              },
              content: function () {
                player.storage.PSpaoxiao = 0;
              },
              sub: true,
            },
          },
          ai: {
            unequip: true,
            skillTagFilter: function (player, tag, arg) {
              if (!get.zhu(player, 'shouyue')) return false;
              if (arg && arg.name == 'sha') return true;
              return false;
            },
          },
        },
        PSleiji: {
          audio: "releiji",
          audioname: ["boss_qinglong"],
          trigger: {
            global: ["useCard", "respond"],
          },
          filter: function (event, player) {
            return event.card.name == 'shan';
          },
          direct: true,
          content: function () {
            "step 0";
            player.chooseTarget(get.prompt2('releiji'), function (card, player, target) {
              return target != player;
            }).ai = function (target) {
              if (target.hasSkill('hongyan')) return 0;
              return get.damageEffect(target, _status.event.player, _status.event.player, 'thunder');
            };
            "step 1"
            if (result.bool) {
              player.logSkill('releiji', result.targets, 'thunder');
              event.target = result.targets[0];
              event.target.judge(function (card) {
                var suit = get.suit(card);
                if (suit == 'spade') return -4;
                if (suit == 'club') return -2;
                return 0;
              }).judge2 = function (result) {
                return result.bool == false ? true : false;
              };
            }
            else {
              event.finish();
            }
            "step 2"
            if (result.suit == 'club') {
              event.target.damage('thunder');
              player.recover();
            }
            else if (result.suit == 'spade') {
              event.target.damage(2, 'thunder');
            }
          },
          ai: {
            useShan: true,
            effect: {
              target: function (card, player, target, current) {
                if (get.tag(card, 'respondShan')) {
                  var hastarget = game.hasPlayer(function (current) {
                    return get.attitude(target, current) < 0;
                  });
                  var be = target.countCards('e', { color: 'black' });
                  if (target.countCards('h', 'shan') && be) {
                    if (!target.hasSkill('guidao')) return 0;
                    return [0, hastarget ? target.countCards('he') / 2 : 0];
                  }
                  if (target.countCards('h', 'shan') && target.countCards('h') > 2) {
                    if (!target.hasSkill('guidao')) return 0;
                    return [0, hastarget ? target.countCards('h') / 4 : 0];
                  }
                  if (target.countCards('h') > 3 || (be && target.countCards('h') >= 2)) {
                    return [0, 0];
                  }
                  if (target.countCards('h') == 0) {
                    return [1.5, 0];
                  }
                  if (target.countCards('h') == 1 && !be) {
                    return [1.2, 0];
                  }
                  if (!target.hasSkill('guidao')) return [1, 0.05];
                  return [1, Math.min(0.5, (target.countCards('h') + be) / 4)];
                }
              },
            },
          },
        },
        PSqiangxi: {
          audio: "qiangxi",
          audioname: ["ol_dianwei", "boss_lvbu3"],
          enable: "phaseUse",
          usable: 2,
          intro: {
            content: "强袭造成#点伤害",
          },
          onremove: true,
          init: function (player, skill) {
            if (!player.storage[skill]) player.storage[skill] = 1;
          },
          filter: function (event, player) {
            if (player.hp < 1 && !player.hasCard((card) => lib.skill.olqiangxi.filterCard(card), 'he')) return false;
            return game.hasPlayer((current) => lib.skill.olqiangxi.filterTarget(null, player, current));
          },
          filterCard: function (card) {
            return get.subtype(card) == 'equip1';
          },
          position: "he",
          filterTarget: function (card, player, target) {
            if (target == player) return false;
            var stat = player.getStat()._olqiangxi;
            return !stat || !stat.contains(target);
          },
          selectCard: function () {
            if (_status.event.player.hp < 1) return 1;
            return [0, 1];
          },
          content: function () {
            var stat = player.getStat();
            if (!stat._olqiangxi) stat._olqiangxi = [];
            stat._olqiangxi.push(target);
            if (!cards.length) player.damage('nosource', 'nocard');
            var num = player.countMark('PSqiangxi');
            target.damage('nocard', num);
            player.addMark('PSqiangxi', 1);
          },
          ai: {
            damage: true,
            order: 8,
            result: {
              player: function (player, target) {
                if (ui.selected.cards.length) return 0;
                if (player.hp >= target.hp) return -0.9;
                if (player.hp <= 2) return -10;
                return get.damageEffect(player, player, player);
              },
              target: function (player, target) {
                if (!ui.selected.cards.length) {
                  if (player.hp < 2) return 0;
                  if (player.hp == 2 && target.hp >= 2) return 0;
                  if (target.hp > player.hp) return 0;
                }
                return get.damageEffect(target, player, target);
              },
            },
            threaten: 1.5,
          },
        },
        PSranshang: {
          audio: "ranshang",
          trigger: {
            source: "damageEnd",
          },
          filter: function (event, player) {
            return event.nature == 'fire' && event.player.isAlive();
          },
          prompt: "是否令目标获得等量的“燃”标记",
          check: function () {
            return false;
          },
          content: function () {
            trigger.player.randomDiscard();
            trigger.player.addMark('PSranshang', trigger.num);
            trigger.player.addSkill('PSranshang_lose', trigger.num);
          },
          intro: {
            "name2": "燃",
            content: "mark",
          },
          ai: {
            effect: {
              player: function (card, player, target, current) {
                if (card.name == 'sha') {
                  if (card.nature == 'fire' || player.hasSkill('zhuque_skill')) return 2;
                }
                if (get.tag(card, 'fireDamage') && current < 0) return 2;
              },
            },
          },
          marktext: "燃",
          subSkill: {
            lose: {
              audio: "ranshang2",
              trigger: {
                player: "phaseJieshuBegin",
              },
              forced: true,
              filter: function (event, player) {
                return player.countMark('PSranshang') > 0;
              },
              content: function () {
                player.loseHp(player.countMark('PSranshang'));
              },
              sub: true,
            },
          },
        },
        PSzhiheng: {
          audio: "rezhiheng",
          audioname: ["shen_caopi"],
          enable: "phaseUse",
          usable: 1,
          position: "he",
          filterCard: function (card, player, event) {
            event = event || _status.event;
            if (typeof event != 'string') event = event.getParent().name;
            var mod = game.checkMod(card, player, event, 'unchanged', 'cardDiscardable', player);
            if (mod != 'unchanged') return mod;
            return true;
          },
          discard: false,
          lose: false,
          delay: false,
          selectCard: [1, Infinity],
          check: function (card) {
            var player = _status.event.player;
            if (get.position(card) == 'h' && !player.countCards('h', 'du') && (player.hp > 2 || !player.countCards('h', function (card) {
              return get.value(card) >= 8;
            }))) {
              return 1;
            }
            return 6 - get.value(card)
          },
          content: function () {
            'step 0'
            player.discard(cards);
            event.num = 1;
            var hs = player.getCards('h');
            if (!hs.length) event.num = 0;
            for (var i = 0; i < hs.length; i++) {
              if (!cards.contains(hs[i])) {
                event.num = 0; break;
              }
            }
            'step 1'
            player.draw(event.num + cards.length);
          },
          group: "PSzhiheng_else",
          subSkill: {
            else: {
              audio: "rezhiheng",
              audioname: ["shen_caopi"],
              trigger: {
                target: "useCardToTarget",
              },
              usable: 1,
              popup: false,
              filter: function (event, player) {
                if (event.addedTargets) return false;
                return event.targets.length == 1 && player.countCards('he') > 0;
              },
              content: function () {
                'step 0'
                player.chooseToDiscard([1, Infinity], 'he', true);
                'step 1'
                player.logSkill("rezhiheng");
                var num = 0;
                var hs = player.getCards('h');
                if (!hs.length) num = 1;
                player.draw(result.cards.length + num);
              },
              sub: true,
            },
          },
          ai: {
            order: 1,
            result: {
              player: 1,
            },
            threaten: 1.55,
          },
        },
        PSjianxiong: {
          audio: "jianxiong",
          audioname: ["shen_caopi"],
          trigger: {
            target: "useCardToAfter",
          },
          filter: function (event, player) {
            return event.player != player;
            for (var i = 0; i < event.cards2.length; i++) {
              if (get.suit(event.cards2[i], event.player) == 'club' && get.position(event.cards2[i], true) == 'd') {
                return true;
              }
            }
            return false;
          },
          content: function () {
            "step 0"
            if (get.itemtype(trigger.cards) == 'cards' && get.position(trigger.cards[0], true) == 'o') {
              player.gain(trigger.cards, "gain2");
            }
            player.draw('nodelay');
          },
          ai: {
            maixie: true,
            "maixie_hp": true,
            effect: {
              target: function (card, player, target) {
                if (player.hasSkillTag('jueqing', false, target)) return [1, -1];
                if (get.tag(card, 'damage') && player != target) {
                  var cards = card.cards, evt = _status.event;
                  if (evt.player == target && card.name == 'damage' && evt.getParent().type == 'card') cards = evt.getParent().cards.filterInD();
                  if (target.hp <= 1) return;
                  if (get.itemtype(cards) != 'cards') return;
                  for (var i of cards) {
                    if (get.name(i, target) == 'tao') return [1, 5];
                  }
                  if (get.value(cards, target) >= (7 + target.getDamagedHp())) return [1, 3];
                  return [1, 0.6];
                }
              },
            },
          },
        },
        PSqifan: {
          mode: ["identity"],
          trigger: {
            global: "gameStart",
          },
          forced: true,
          content: function () {
            'step 0'
            var target = game.zhu;
            delete target.isZhu;
            player.identity = 'zhu';
            player.setIdentity('zhu');
            player.identityShown = true;
            game.zhu = player;
            'step 1'
            var players = get.players(false, true);
            for (var i = 0; i < players.length; i++) {
              if (players[i] != player) {
                players[i].identity = 'fan';
                players[i].setIdentity('fan');
                players[i].identityShown = true;
              }
            }
          },
        },
        PSjiwei: {
          audio: "weidi",
          trigger: {
            source: "damageAfter",
          },
          forced: true,
          skillAnimation: true,
          animationColor: "thunder",
          filter: function (event, player) {
            return player.identity != 'zhu' && event.player.identity == 'zhu' && game.zhu && game.zhu.isZhu && event.card.name == 'sha';
          },
          logTarget: function () {
            return [game.zhu];
          },
          content: function () {
            'step 0'
            var sf = player.identity;
            game.zhu.identity = sf;
            game.zhu.setIdentity(sf);
            game.zhu.identityShown = false;
            game.zhu.update();
            player.identity = 'zhu';
            player.showIdentity();
            player.update();
            var target = game.zhu;
            delete target.isZhu;
            game.zhu = player;
            'step 1'
            player.gainMaxHp();
            player.recover();
          },
        },
        PSqiaobian: {
          audio: "qiaobian",
          group: ["PSqiaobian_judge", "PSqiaobian_draw", "PSqiaobian_use", "PSqiaobian_discard"],
          preHidden: true,
          subSkill: {
            judge: {
              audio: 2,
              trigger: {
                player: "phaseJudgeBefore",
              },
              prompt: "###是否发动【巧变·判定】？###摸一张牌跳过判定阶段",
              filter: function (event, player) {
                if (!event.isOnline() && (!event.isMine())) return false;
                return true;
              },
              content: function () {
                player.draw();
                player.logSkill('qiaobian');
                trigger.cancel();
              },
              sub: true,
            },
            draw: {
              audio: 2,
              trigger: {
                player: "phaseDrawBegin1",
              },
              prompt: "###是否发动【巧变·摸牌】？###摸一张牌跳过摸牌阶段，并选择获得其他一至两名角色的各一张手牌",
              filter: function (event, player) {
                return !event.numFixed;
              },
              content: function () {
                "step 0"
                var check;
                var i, num = game.countPlayer(function (current) {
                  return current != player && current.countCards('h') && get.attitude(player, current) <= 0;
                });
                check = (num >= 2);
                player.draw();
                player.chooseTarget('获得其他一至两名角色的各一张手牌', [1, 2], function (card, player, target) {
                  return target.countCards('h') > 0 && player != target;
                }, function (target) {
                  if (!_status.event.aicheck) return 0;
                  var att = get.attitude(_status.event.player, target);
                  if (target.hasSkill('tuntian')) return att / 10;
                  return 1 - att;
                }).set('aicheck', check);
                "step 1"
                if (result.bool) {
                  player.logSkill('reqiaobian', result.targets);
                  player.gainMultiple(result.targets);
                  trigger.cancel();
                }
                else {
                  event.finish();
                }
                "step 2"
                game.delay();
              },
              ai: {
                threaten: 2,
                expose: 0.3,
              },
              sub: true,
            },
            use: {
              audio: 2,
              trigger: {
                player: "phaseUseBefore",
              },
              prompt: "###是否发动【巧变·出牌】？###摸一张牌跳过出牌阶段，并选择移动场上一张牌",
              content: function () {
                "step 0"
                var check;
                if (!player.canMoveCard(true)) {
                  check = false;
                }
                else {
                  check = game.hasPlayer(function (current) {
                    return get.attitude(player, current) > 0 && current.countCards('j');
                  });
                  if (!check) {
                    if (player.countCards('h') > player.hp + 1) {
                      check = false;
                    }
                    else if (player.countCards('h', { name: ['wuzhong'] })) {
                      check = false;
                    }
                    else {
                      check = true;
                    }
                  }
                }
                player.draw();
                trigger.cancel();
                player.moveCard();
                player.logSkill('qiaobian');
              },
              ai: {
                expose: 0.2,
              },
              sub: true,
            },
            discard: {
              audio: 2,
              trigger: {
                player: "phaseDiscardBefore",
              },
              prompt: "###是否发动【巧变·弃牌】？###摸一张牌跳过弃牌阶段",
              content: function () {
                player.draw();
                player.logSkill('reqiaobian');
                trigger.cancel();
              },
              sub: true,
            },
          },
          ai: {
            threaten: 3,
          },
        },
        PSkurou: {
          audio: "rekurou",
          enable: "phaseUse",
          filterCard: true,
          check: function (card) {
            return 8 - get.value(card);
          },
          position: "he",
          content: function () {
            player.loseHp();
          },
          ai: {
            order: 8,
            result: {
              player: function (player) {
                return get.effect(player, { name: 'losehp' }, player, player);
              },
            },
          },
        },
        /* PSpingjian: {
          audio: "pingjian",
          trigger: {
            player: ["phaseZhunbeiBegin", "phaseDrawBegin2", "damageEnd", "phaseJieshuBegin", "dying"],
          },
          initList: function () {
            var list = [];
            if (_status.connectMode) var list = get.charactersOL();
            else {
              var list = [];
              for (var i in lib.character) {
                if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) continue;
                list.push(i);
              }
            }
            game.countPlayer2(function (current) {
              list.remove(current.name);
              list.remove(current.name1);
              list.remove(current.name2);
              if (current.storage.rehuashen && current.storage.rehuashen.character) list.removeArray(current.storage.rehuashen.character)
            });
            _status.characterlist = list;
          },
          frequent: true,
          content: function () {
            'step 0'
            if (!player.storage.PSpingjian) player.storage.PSpingjian = [];
            event._result = { bool: true };
            'step 1'
            if (result.bool) {
              if (!_status.characterlist) {
                lib.skill.PSpingjian.initList();
              }
              var list = [];
              var skills = [];
              var map = [];
              _status.characterlist.randomSort();
              var name2 = event.triggername;
              for (var i = 0; i < _status.characterlist.length; i++) {
                var name = _status.characterlist[i];
                if (name.indexOf('zuoci') != -1 || name.indexOf('xushao') != -1) continue;
                var skills2 = lib.character[name][3];
                for (var j = 0; j < skills2.length; j++) {
                  if (player.storage.PSpingjian.contains(skills2[j])) continue;
                  if (skills.contains(skills2[j]) && lib.skill.PSfushi.characterList().contains(name)) {
                    list.add(name);
                    if (!map[name]) map[name] = [];
                    map[name].push(skills2[j]);
                    skills.add(skills2[j]);
                    continue;
                  }
                  var list2 = [skills2[j]];
                  game.expandSkills(list2);
                  for (var k = 0; k < list2.length; k++) {
                    var info = lib.skill[list2[k]];
                    if (!info || !info.trigger || !info.trigger.player || info.silent || info.limited || info.juexingji || info.zhuanhuanji || info.hiddenSkill || info.dutySkill) continue;
                    if ((info.trigger.player == name2 || Array.isArray(info.trigger.player) && info.trigger.player.contains(name2)) && lib.skill.PSfushi.characterList().contains(name)) {
                      if (info.init || info.ai && (info.ai.combo || info.ai.notemp || info.ai.neg)) continue;
                      if (info.filter) {
                        try {
                          var bool = info.filter(trigger, player, name2);
                          if (!bool) continue;
                        }
                        catch (e) {
                          continue;
                        }
                      }
                      list.add(name);
                      if (!map[name]) map[name] = [];
                      map[name].push(skills2[j]);
                      skills.add(skills2[j]);
                      break;
                    }
                  }
                }
                if (list.length > 2) break;
              }
              if (!skills.length) {
                //player.draw();
                event.finish();
              }
              else {
                //skills.unshift('摸一张牌');
                player.chooseControl(skills).set('dialog', ['请选择要发动的技能', [list, 'character']]).set('ai', function () { return 0 });
              }
            }
            else event.finish();
            'step 2'
            if (result.control == '摸一张牌') {
              player.draw();
              return;
            }
            player.storage.PSpingjian.add(result.control);
            if (event.triggername == 'phaseDrawBegin2') {
              player.addTempSkill(result.control, 'phaseDrawEnd');
            }
            else if (event.triggername == 'phaseZhunbeiBegin') {
              player.addTempSkill(result.control, 'phaseZhunbei');
            }
            else if (event.triggername == 'damageEnd') {
              player.addTempSkill(result.control, 'damageAfter');
            }
            else if (event.triggername == 'phaseJieshuBegin') {
              player.addTempSkill(result.control, 'phaseJieshu');
            }
            else {
              player.addTempSkill(result.control, 'dyingAfter');
            }
          },
          group: "pingjian_use",
          "phaseUse_special": ["xinfu_lingren"],
        },  */
        PSpingjian: {
          initList: function () {
            var list = [];
            if (_status.connectMode) list = get.charactersOL();
            else {
              var list = [];
              for (var i in lib.character) {
                if (!lib.filter.characterDisabled2(i) && !lib.filter.characterDisabled(i)) list.push(i);
              }
            }
            game.countPlayer2(function (current) {
              list.remove(current.name);
              list.remove(current.name1);
              list.remove(current.name2);
            });
            _status.characterlist = list;
          },
          init: function (player) {
            player.addSkill('PSpingjian_check');
            if (!player.storage.PSpingjian_check) player.storage.PSpingjian_check = {};
          },
          onremove: function (player) {
            player.removeSkill('PSpingjian_check');
          },
          audio: 'pingjian',
          trigger: {
            player: ["phaseZhunbeiBegin", "phaseDrawBegin2", "damageEnd", "phaseJieshuBegin", "dying"],
          },
          frequent: true,
          content: function () {
            'step 0'
            if (!_status.characterlist) {
              lib.skill.PSpingjian.initList();
            }
            var allList = _status.characterlist.slice(0);
            game.countPlayer(function (current) {
              allList.add(current.name);
              allList.add(current.name1);
              allList.add(current.name2);
            });
            var list = [];
            var skills = [];
            var map = [];
            allList.randomSort();
            var name2 = event.triggername;
            for (var i = 0; i < allList.length; i++) {
              var name = allList[i];
              if (!name || (name.includes('zuoci') || name.indexOf('xushao') != -1)) continue;
              var skills2 = lib.character[name][3];
              for (var j = 0; j < skills2.length; j++) {
                if (player.getStorage('PSpingjian').contains(skills2[j])) continue;
                if (skills.contains(skills2[j]) && lib.skill.PSfushi.characterList().contains(name)) {
                  list.add(name);
                  if (!map[name]) map[name] = [];
                  map[name].push(skills2[j]);
                  skills.add(skills2[j]);
                  continue;
                }
                var list2 = [skills2[j]];
                game.expandSkills(list2);
                for (var k = 0; k < list2.length; k++) {
                  var info = lib.skill[list2[k]];
                  if (!info || !info.trigger || !info.trigger.player || info.silent || info.limited || info.juexingji || info.zhuanhuanji || info.hiddenSkill || info.dutySkill) continue;
                  if ((info.trigger.player == name2 || Array.isArray(info.trigger.player) && info.trigger.player.contains(name2)) && lib.skill.PSfushi.characterList().contains(name)) {
                    if (info.ai && (info.ai.combo || info.ai.notemp || info.ai.neg)) continue;
                    if (info.init) continue;
                    if (info.filter) {
                      try {
                        var bool = info.filter(trigger, player, name2);
                        if (!bool) continue;
                      }
                      catch (e) {
                        continue;
                      }
                    }
                    list.add(name);
                    if (!map[name]) map[name] = [];
                    map[name].push(skills2[j]);
                    skills.add(skills2[j]);
                    break;
                  }
                }
              }
              if (list.length > 2) break;
            }
            if (skills.length) player.chooseControl(skills).set('dialog', ['评鉴：请选择尝试发动的技能', [list, 'character']]);
            else event.finish();
            'step 1'
            let temp = {
              "phaseDrawBegin2": "phaseDrawEnd",
              "phaseZhunbeiBegin": "phaseZhunbei",
              "damageEnd": "trigger",
              "phaseJieshuBegin": "phaseJieshu",
              "dying": "dyingAfter"
            };
            player.markAuto('PSpingjian', [result.control]);
            player.addTempSkill(result.control);
            player.storage.PSpingjian_check[result.control] = (temp[event.triggername]);
            if (trigger.name == 'damage') {
              var info = lib.translate[result.control + '_info'];
              if (info && info.indexOf('1点伤害') + info.indexOf('一点伤害') != -2) trigger.num = 1;//暂时想到的让多点伤害只执行一次的拙见
            }
          },
          group: 'PSpingjian_use',
          phaseUse_special: [],
          ai: { threaten: 5 },
        },
        PSpingjian_use: {
          audio: 'pingjian',
          enable: 'phaseUse',
          usable: 1,
          prompt: () => lib.translate.PSpingjian_info,
          content: function () {
            'step 0'
            var list = [];
            var skills = [];
            var map = [];
            var evt = event.getParent(2);
            if (!_status.characterlist) {
              lib.skill.PSpingjian.initList();
            }
            var allList = _status.characterlist.slice(0);
            game.countPlayer(function (current) {
              allList.add(current.name);
              allList.add(current.name1);
              allList.add(current.name2);
            });
            allList.randomSort();
            for (var i = 0; i < allList.length; i++) {
              var name = allList[i];
              if (!name || (name.indexOf('zuoci') != -1 || name.indexOf('xushao') != -1)) continue;
              var skills2 = lib.character[name][3];
              for (var j = 0; j < skills2.length; j++) {
                if (player.getStorage('PSpingjian').contains(skills2[j])) continue;
                var info = lib.translate[skills2[j] + '_info'];
                if ((skills.contains(skills2[j]) || (info && info.indexOf('当你于出牌阶段') != -1)) && lib.skill.PSfushi.characterList().contains(name)) {
                  list.add(name);
                  if (!map[name]) map[name] = [];
                  map[name].push(skills2[j]);
                  skills.add(skills2[j]);
                  continue;
                }
                var list2 = [skills2[j]];
                game.expandSkills(list2);
                for (var k = 0; k < list2.length; k++) {
                  var info = lib.skill[list2[k]];
                  if (!info || !info.enable || info.charlotte || info.limited || info.juexingji || info.zhuanhuanji || info.hiddenSkill || info.dutySkill) continue;
                  if (((info.enable == 'phaseUse' || (Array.isArray(info.enable) && info.enable.contains('phaseUse'))) || (info.enable == 'chooseToUse' || (Array.isArray(info.enable) && info.enable.contains('chooseToUse')))) && lib.skill.PSfushi.characterList().contains(name)) {
                    if (info.ai && (info.ai.combo || info.ai.notemp || info.ai.neg)) continue;
                    if (info.init || info.onChooseToUse) continue;
                    if (info.filter) {
                      try {
                        var bool = info.filter(evt, player);
                        if (!bool) continue;
                      }
                      catch (e) {
                        continue;
                      }
                    }
                    else if (info.viewAs && typeof info.viewAs != 'function') {
                      try {
                        if (evt.filterCard && !evt.filterCard(info.viewAs, player, evt)) continue;
                        if (info.viewAsFilter && info.viewAsFilter(player) == false) continue;
                      }
                      catch (e) {
                        continue;
                      }
                    }
                    list.add(name);
                    if (!map[name]) map[name] = [];
                    map[name].push(skills2[j]);
                    skills.add(skills2[j]);
                    break;
                  }
                }
              }
              if (list.length > 2) break;
            }
            if (skills.length) player.chooseControl(skills).set('dialog', ['评鉴：请选择尝试发动的技能', [list, 'character']]);
            else event.finish();
            'step 1'
            player.markAuto('PSpingjian', [result.control]);
            player.addTempSkill(result.control);
            player.storage.PSpingjian_check[result.control] = 'phaseUse';
          },
          ai: { order: 12, result: { player: 1 } },
        },
        PSpingjian_check: {
          charlotte: true,
          trigger: { player: ['useSkill', 'logSkillBegin'] },
          filter: function (event, player) {
            if (get.info(event.skill).charlotte) return false;
            var skill = event.sourceSkill || event.skill;
            return player.storage.PSpingjian_check[skill];
          },
          direct: true,
          firstDo: true,
          priority: Infinity,
          content: function () {
            var skill = trigger.sourceSkill || trigger.skill;
            player.removeSkill(skill);
            delete player.storage.PSpingjian_check[skill];
          },
          group: 'PSpingjian_check2',
        },
        PSpingjian_check2: {
          charlotte: true,
          trigger: { player: ['phaseUseEnd', 'damageEnd', 'phaseJieshuBegin'] },
          filter: function (event, player) {
            return Object.keys(player.storage.PSpingjian_check).find(function (skill) {
              if (event.name != 'damage') return player.storage.PSpingjian_check[skill] == event.name;
              return player.storage.PSpingjian_check[skill] == event;
            });
          },
          direct: true,
          lastDo: true,
          priority: -Infinity,
          content: function () {
            var skills = Object.keys(player.storage.PSpingjian_check).filter(function (skill) {
              if (trigger.name != 'damage') return player.storage.PSpingjian_check[skill] == trigger.name;
              return player.storage.PSpingjian_check[skill] == trigger;
            });
            player.removeSkill(skills);
            for (var skill of skills) delete player.storage.PSpingjian_check[skill];
          },
        },
        PSqianju: {
          mod: {
            globalFrom: function (from, to, distance) {
              return distance - Math.max(1, from.getDamagedHp());
            },
            globalTo: function (from, to, distance) {
              return distance + Math.max(1, to.getDamagedHp());
            },
            cardname: function (card, player, name) {
              if (lib.card[card.name].subtype == 'equip3' || lib.card[card.name].subtype == 'equip4' || lib.card[card.name].subtype == 'equip6') return 'sha';
            },
            cardnature: function (card) {
              if (lib.card[card.name].subtype == 'equip3' || lib.card[card.name].subtype == 'equip4' || lib.card[card.name].subtype == 'equip6') return false;
            },
          },
          trigger: {
            global: "phaseBefore",
            player: "enterGame",
          },
          forced: true,
          filter: function (event, player) {
            return event.name != 'phase' || game.phaseNumber == 0;
          },
          content: function () {
            if (player.hasEnabledSlot(3)) player.disableEquip(3);
            if (player.hasEnabledSlot(4)) player.disableEquip(4);
          },
        },
        PSqingxi: {
          audio: "reqingxi",
          trigger: {
            player: "useCardToPlayer",
          },
          intro: {
            content: "本回合已发动#次【倾袭】",
          },
          init: function (player) {
            player.storage.PSqingxi_damage = [];
          },
          filter: function (event, player) {
            if (player.storage.PSqingxi >= player.getAttackRange()) return false;
            return event.card.name == 'sha' || (get.type(event.card, false) == 'trick' && get.tag(event.card, 'damage') > 0);
          },
          check: function (event, player) {
            return get.attitude(player, event.target) < 0;
          },
          logTarget: "target",
          content: function () {
            for (var i = 0; i < trigger.targets.length; i++) {
              player.discardPlayerCard(trigger.targets[i], 'he', false);
            }
            player.addMark('PSqingxi', 1);
            player.storage.PSqingxi_damage.add(trigger.card);
            game.log(trigger.card, '对', trigger.target, '造成的伤害+1');
            game.delayx();
          },
          group: ["PSqingxi_remove", "PSqingxi_damage", "PSqingxi_summer"],
          subSkill: {
            damage: {
              trigger: {
                source: "damageBegin1",
              },
              forced: true,
              filter: function (event, player) {
                return event.card && player.storage.PSqingxi_damage.contains(event.card);
              },
              content: function () {
                trigger.num++;
              },
              sub: true,
            },
            remove: {
              trigger: {
                player: "phaseUseEnd",
              },
              filter: function (event, player) {
                return player.hasMark('PSqingxi') && player.isAlive();
              },
              forced: true,
              content: function () {
                player.removeMark('PSqingxi', player.countMark('PSqingxi'));
              },
              sub: true,
            },
            summer: {
              sub: true,
              trigger: {
                player: "useCardAfter",
              },
              silent: true,
              filter: function (event, player) {
                return player == _status.currentPhase && player.storage.PSqingxi_damage.contains(event.card);
              },
              content: function () {
                player.storage.PSqingxi_damage.remove(trigger.card);
              },
              forced: true,
              popup: false,
            },
          },
        },
        PSqixing: {
          audio: "ext:PS武将/audio/skill:2",
          unique: true,
          trigger: {
            global: "phaseBefore",
            player: ["enterGame", "phaseZhunbeiBegin"],
          },
          forced: true,
          filter: function (event, player) {
            return player.getExpansions('PSqixing').length < 7 && (event.name != 'phase' || game.phaseNumber == 0);
          },
          content: function () {
            "step 0"
            var num = player.getExpansions('PSqixing').length;
            player.addToExpansion(get.cards(7 - num), 'draw').gaintag.add('PSqixing');
            "step 1"
            var cards = player.getExpansions('PSqixing');
            if (!cards.length || !player.countCards('h')) {
              event.finish();
              return;
            }
            var next = player.chooseToMove('七星：是否交换“星”和手牌？');
            next.set('list', [
              [get.translation(player) + '（你）的星', cards],
              ['手牌区', player.getCards('h')],
            ]);
            next.set('filterMove', function (from, to) {
              return typeof to != 'number';
            });
            next.set('processAI', function (list) {
              var player = _status.event.player, cards = list[0][1].concat(list[1][1]).sort(function (a, b) {
                return get.useful(a) - get.useful(b);
              }), cards2 = cards.splice(0, player.getExpansions('PSqixing').length);
              return [cards2, cards];
            });
            "step 2"
            if (result.bool) {
              var pushs = result.moved[0], gains = result.moved[1];
              pushs.removeArray(player.getExpansions('PSqixing'));
              gains.removeArray(player.getCards('h'));
              if (!pushs.length || pushs.length != gains.length) return;
              player.addToExpansion(pushs, player, 'giveAuto').gaintag.add('PSqixing');
              game.log(player, '将', pushs, '作为“星”置于武将牌上');
              player.gain(gains, 'gain2');
            }
          },
          intro: {
            markcount: "expansion",
            mark: function (dialog, content, player) {
              var content = player.getExpansions('PSqixing');
              if (content && content.length) {
                if (player == game.me || player.isUnderControl()) {
                  dialog.addAuto(content);
                }
                else {
                  return '共有' + get.cnNumber(content.length) + '张星';
                }
              }
            },
            content: function (content, player) {
              var content = player.getExpansions('PSqixing');
              if (content && content.length) {
                if (player == game.me || player.isUnderControl()) {
                  return get.translation(content);
                }
                return '共有' + get.cnNumber(content.length) + '张星';
              }
            },
          },
          group: ["PSqixing_draw"],
          ai: {
            combo: "dawu",
          },
          subSkill: {
            draw: {
              trigger: {
                player: "phaseDrawAfter",
              },
              direct: true,
              filter: function (event, player) {
                return player.getExpansions('PSqixing').length > 0 && player.countCards('h') > 0;
              },
              content: function () {
                "step 0"
                var cards = player.getExpansions('PSqixing');
                if (!cards.length || !player.countCards('h')) {
                  event.finish();
                  return;
                }
                var next = player.chooseToMove('七星：是否交换“星”和手牌？');
                next.set('list', [
                  [get.translation(player) + '（你）的星', cards],
                  ['手牌区', player.getCards('h')],
                ]);
                next.set('filterMove', function (from, to) {
                  return typeof to != 'number';
                });
                next.set('processAI', function (list) {
                  var player = _status.event.player, cards = list[0][1].concat(list[1][1]).sort(function (a, b) {
                    return get.value(a) - get.value(b);
                  }), cards2 = cards.splice(0, player.getExpansions('PSqixing').length);
                  return [cards2, cards];
                });
                "step 1"
                if (result.bool) {
                  var pushs = result.moved[0], gains = result.moved[1];
                  pushs.removeArray(player.getExpansions('PSqixing'));
                  gains.removeArray(player.getCards('h'));
                  if (!pushs.length || pushs.length != gains.length) return;
                  player.logSkill('qixing2');
                  player.addToExpansion(pushs, player, 'giveAuto').gaintag.add('PSqixing');
                  game.log(player, '将', pushs, '作为“星”置于武将牌上');
                  player.gain(gains, 'gain2');
                }
              },
              sub: true,
            },
          },
        },
        PSkuangfeng: {
          unique: true,
          audio: "ext:PS武将/audio/skill:2",
          trigger: {
            player: "phaseJieshuBegin",
          },
          direct: true,
          filter: function (event, player) {
            return player.getExpansions('PSqixing').length;
          },
          content: function () {
            "step 0"
            var num = Math.min(game.countPlayer(), player.getExpansions('PSqixing').length);
            player.chooseTarget(get.prompt('PSkuangfeng'), '令至多' + get.cnNumber(num) + '名角色获得“狂风”标记',
              [1, num]).ai = function (target) {
                return -1;
              }
            "step 1"
            if (result.bool) {
              var length = result.targets.length;
              for (var i = 0; i < length; i++) {
                result.targets[i].addSkill('kuangfeng2');
              }
              player.logSkill('kuangfeng', result.targets, 'fire');
              player.chooseCardButton('弃置' + get.cnNumber(length) + '枚星', length, player.getExpansions('PSqixing'), true);
              player.addSkill("PSdawu_clear");
            }
            else {
              event.finish();
            }
            "step 2"
            player.loseToDiscardpile(result.links);
          },
          ai: {
            combo: "qixing",
          },
        },
        PSdawu: {
          trigger: {
            player: "phaseJieshuBegin",
          },
          direct: true,
          filter: function (event, player) {
            return player.getExpansions('PSqixing').length;
          },
          audio: "ext:PS武将/audio/skill:2",
          content: function () {
            "step 0"
            var num = Math.min(game.countPlayer(), player.getExpansions('PSqixing').length);
            player.chooseTarget(get.prompt('dawu'), '令至多' + get.cnNumber(num) + '名角色获得“大雾”标记',
              [1, num]).set('ai', function (target) {
                if (target.isMin()) return 0;
                if (target.hasSkill('biantian2')) return 0;
                var att = get.attitude(player, target);
                if (att >= 4) {
                  if (_status.event.allUse) return att;
                  if (target.hp == 1) return att;
                  if (target.hp == 2 && target.countCards('he') <= 2) return att * 0.7;
                  return 0;
                }
                return -1;
              }).set('allUse', player.getExpansions('PSqixing').length >= game.countPlayer(function (current) {
                return get.attitude(player, current) > 4;
              }) * 2);
            "step 1"
            if (result.bool) {
              player.logSkill('dawu', result.targets, 'thunder');
              var length = result.targets.length;
              for (var i = 0; i < length; i++) {
                result.targets[i].addSkill('dawu2');
              }
              player.chooseCardButton('选择弃置' + get.cnNumber(length) + '张“星”', length, player.getExpansions('PSqixing'), true);
              player.addSkill("PSdawu_clear");
            }
            else {
              event.finish();
            }
            "step 2"
            player.loseToDiscardpile(result.links);
          },
          ai: {
            combo: "qixing",
          },
          group: "PSdawu_clear",
          subSkill: {
            clear: {
              trigger: {
                player: ["phaseUseEnd", "dieBegin"],
              },
              silent: true,
              charlotte: true,
              content: function () {
                for (var i = 0; i < game.players.length; i++) {
                  if (game.players[i].hasSkill('dawu2')) {
                    game.players[i].removeSkill('dawu2');
                  }
                  if (game.players[i].hasSkill('kuangfeng2')) {
                    game.players[i].removeSkill('kuangfeng2');
                  }
                }
                player.removeSkill("PSdawu_clear");
              },
              forced: true,
              popup: false,
              sub: true,
            },
          },
        },
        PSjizhi: {
          audio: "rejizhi",
          audioname: ["lukang"],
          locked: false,
          trigger: {
            player: "useCard",
          },
          frequent: true,
          filter: function (event) {
            return (get.type(event.card, 'trick') == 'trick' && event.card.isCard);
          },
          init: function (player) {
            player.storage.rejizhi = 0;
          },
          content: function () {
            'step 0'
            player.draw(2);
            'step 1'
            event.card = result[0];
            if (get.type(event.card) == 'basic') {
              player.chooseBool('是否弃置' + get.translation(event.card) + '并令本回合手牌上限+1？').set('ai', function (evt, player) {
                return _status.currentPhase == player && player.needsToDiscard(-3) && _status.event.value < 6;
              }).set('value', get.value(event.card, player));
            }
            'step 2'
            if (result.bool) {
              player.discard(event.card);
              player.storage.rejizhi++;
              if (_status.currentPhase == player) {
                player.markSkill('rejizhi');
              }
            }
          },
          ai: {
            threaten: 1.4,
            noautowuxie: true,
          },
          mod: {
            maxHandcard: function (player, num) {
              return num + player.storage.rejizhi;
            },
          },
          intro: {
            content: "本回合手牌上限+#",
          },
          group: "rejizhi_clear",
          subSkill: {
            clear: {
              trigger: {
                global: "phaseAfter",
              },
              silent: true,
              content: function () {
                player.storage.rejizhi = 0;
                player.unmarkSkill('rejizhi');
              },
              sub: true,
              forced: true,
              popup: false,
            },
          },
        },
        PSjieying: {
          audio: "ext:PS武将/audio/skill:2",
          locked: false,
          global: "PSjieying_mark",
          group: ["PSjieying_1", "PSjieying_2", "PSjieying_3"],
          subSkill: {
            "1": {
              audio: "drlt_jieying",
              trigger: {
                player: "phaseZhunbeiBegin",
              },
              forced: true,
              filter: function (event, player) {
                return !game.hasPlayer(function (current) {
                  return current.hasMark('PSjieying_mark');
                });
              },
              content: function () {
                player.addMark('PSjieying_mark', 1);
              },
              sub: true,
            },
            "2": {
              audio: "drlt_jieying",
              trigger: {
                player: "phaseJieshuBegin",
              },
              direct: true,
              filter: function (event, player) {
                return player.hasMark('PSjieying_mark');
              },
              content: function () {
                'step 0'
                player.chooseTarget(get.prompt('drlt_jieying'), "将“营”交给一名角色；其摸牌阶段多摸一张牌，出牌阶段使用【杀】的次数上限+1且手牌上限+1。该角色回合结束后，其移去“营”标记，然后你获得其所有手牌。", function (card, player, target) {
                  return target != player;
                }).ai = function (target) {
                  if (get.attitude(player, target) > 0)
                    return 0.1;
                  if (get.attitude(player, target) < 1 && (target.isTurnedOver() || target.countCards('h') < 1))
                    return 0.2;
                  if (get.attitude(player, target) < 1 && target.countCards('h') > 0 && target.countCards('j', { name: 'lebu' }) > 0)
                    return target.countCards('h') * 0.8 + target.getHandcardLimit() * 0.7 + 2;
                  if (get.attitude(player, target) < 1 && target.countCards('h') > 0)
                    return target.countCards('h') * 0.8 + target.getHandcardLimit() * 0.7;
                  return 1;
                };
                'step 1'
                if (result.bool) {
                  var target = result.targets[0];
                  player.line(target);
                  player.logSkill('drlt_jieying', target);
                  var mark = player.countMark('PSjieying_mark');
                  player.removeMark('PSjieying_mark', mark);
                  target.addMark('PSjieying_mark', mark);
                };
              },
              sub: true,
            },
            "3": {
              audio: "drlt_jieying",
              trigger: {
                global: "phaseUseBegin",
              },
              forced: true,
              filter: function (event, player) {
                return player != event.player && event.player.hasMark('PSjieying_mark') && event.player.isAlive();
              },
              logTarget: "player",
              content: function () {
                if (trigger.player.countCards('h') > 0) {
                  trigger.player.give(trigger.player.getCards('h'), player);
                }
                trigger.player.removeMark('PSjieying_mark', trigger.player.countMark('PSjieying_mark'));
              },
              sub: true,
            },
            mark: {
              marktext: "营",
              intro: {
                name: "营",
                content: "mark",
              },
              mod: {
                cardUsable: function (card, player, num) {
                  if (player.hasMark('PSjieying_mark') && card.name == 'sha') return num + game.countPlayer(function (current) {
                    return current.hasSkill('PSjieying');
                  });
                },
                maxHandcard: function (player, num) {
                  if (player.hasMark('PSjieying_mark')) return num + game.countPlayer(function (current) {
                    return current.hasSkill('PSjieying');
                  });
                },
              },
              audio: "drlt_jieying",
              trigger: {
                player: "phaseDrawBegin2",
              },
              forced: true,
              filter: function (event, player) {
                return !event.numFixed && player.hasMark('PSjieying_mark') && game.hasPlayer(function (current) {
                  return current.hasSkill('PSjieying');
                });
              },
              content: function () {
                trigger.num += game.countPlayer(function (current) {
                  return current.hasSkill('PSjieying');
                });
              },
              ai: {
                nokeep: true,
                skillTagFilter: function (player) {
                  if (!player.hasMark('PSjieying_mark')) return false;
                },
              },
              sub: true,
            },
          },
        },
        PSfushi: {
          audio: "fuhan",
          trigger: {
            player: "phaseJieshuBegin",
          },
          skillAnimation: true,
          animationColor: "orange",
          filter: function (event, player) {
            return player.countMark('fanghun') >= 0;
          },
          characterList: function () {//此函数的作用是将武将包名称数组转化为武将id数组      
            lib.config.extension_PS武将_PScharacters = lib.config.extension_PS武将_PScharacters || [];
            lib.config.extension_PS武将_PSremoveCharacters = lib.config.extension_PS武将_PSremoveCharacters || [];
            lib.config.extension_PS武将_PSaddCharacter = lib.config.extension_PS武将_PSaddCharacter || [];
            lib.config.extension_PS武将_PSremoveCharacter = lib.config.extension_PS武将_PSremoveCharacter || [];
            function removeHTML(text) {//正则表达式，去除HTML标签
              return text.replace(/<[^>]+>/g, '');
            }
            function getAllCharacters(pack = false) {//返回全武将（包）id数组 函数
              if (pack) {
                let allPack = [];
                for (let a in lib.characterPack) {
                  //lib.characterPack  所有武将包
                  if (lib.characterPack.hasOwnProperty(a)) allPack.push(a);
                }
                return allPack;
              }
              else {
                let allList = [];
                for (let b in lib.character) {
                  if (lib.character.hasOwnProperty(b)) allList.push(b);
                }
                return allList;
              }
            }
            function getPackIdArray(uname = []) {//武将包名称数组转化为武将包id数组函数
              let listx = [];
              for (let i of uname) {
                for (let j in lib.characterPack) {
                  if (lib.characterPack.hasOwnProperty(j)) {
                    if (removeHTML(lib.translate[`${j}_character_config`]) === i || lib.translate[`${j}_character_config`].includes('extension/') && lib.translate[`${j}_character_config`].includes(i)) {
                      //lib.translate[`${j}_character_config`] 武将包翻译名
                      listx.push(j);
                      break;
                    }
                  }
                }
              }
              return listx;
            }
            let pack = [];//pack 武将包id数组
            let list = [];//list 武将id数组
            if (!lib.config.extension_PS武将_PScharacters.length) {//不编辑将池默认全扩武将包
              //lib.config.extension_PS武将_PScharacters 添加的武将包名称数组
              pack = getAllCharacters(true);
            }
            else pack = getPackIdArray(lib.config.extension_PS武将_PScharacters);
            let shed = getPackIdArray(lib.config.extension_PS武将_PSremoveCharacters);//lib.config.extension_PS武将_PSremoveCharacters 移除的武将包名称数组          
            pack.removeArray(shed);// 去除被移除的武将包数组
            for (let k of pack) {//提取武将包的武将id，放入list数组
              for (let l in lib.characterPack[k]) {
                if (lib.characterPack[k].hasOwnProperty(l)) list.push(l);
              }
            }
            list.addArray(lib.config.extension_PS武将_PSaddCharacter);
            list.removeArray(lib.config.extension_PS武将_PSremoveCharacter);
            if (!list.length) list = getAllCharacters();
            return list;
          },
          //搬运自“天牢令”的chooseToFuHan函数，已得到原作者允许，感谢铝宝和雷佬
          chooseToFuHan: function () {
            'step 0'
            var list1 = event.list1,
              list2 = event.list2;
            var switchToAuto = function () {
              _status.imchoosing = false;
              var newList = list2.flat();
              for (var i = 0; i < newList.length; i++) {
                if (lib.skill[newList[i]].ai && lib.skill[newList[i]].ai.combo) newList.remove(newList[i]);
              }
              event._result = {
                bool: true,
                skills: newList.randomGets(event.total),
              };
              if (event.initbg) event.initbg.close();
              if (event.control) event.control.close();
            };
            var chooseButton = function (list1, list2) {
              var event = _status.event;
              if (!event._result) event._result = {};
              event._result.skills = [];
              if (game.TLHasExt('十周年')) {
                var con = document.getElementById('dui-controls');
                if (con) con.classList.add('Tlao_confirmdown2');
              }
              event.initbg = ui.create.div('.Tlao_initbg', document.body);
              event.initbg.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                game.TLremoveSkillInfo();
              }, true)
              var initDialog = ui.create.div('.Tlao_init', event.initbg);
              initDialog.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                game.TLremoveSkillInfo();
              }, true)
              if (!game.TLHasExt('十周年')) initDialog.style.transform = 'translate(-50%,-90%)';
              var initTopic = ui.create.div('.Tlao_inittishi', initDialog);
              initTopic.textContent = event.topic;
              game.TLCreateStand(player, initDialog, 266, 1);
              var initBord = ui.create.div('', initDialog);
              initBord.style.cssText = 'width:586px;height:216px;top:33px;right:60px;positon:"absolute";';
              var skills = event.list2.flat(), num = 0;
              for (var i = 0; i < event.list1.length; i++) {
                var x = i * (104 - list1.length * 4) + (8 - list1.length) * 35 + 35;
                game.TLCreateHead(event.list1[i], initBord, 68, x, 12);
                for (var j = 0; j < event.list2[i].length; j++) {
                  var td = ui.create.div('.Tlao_skillnode', initBord);
                  if (get.info(list2[i][j]).limited || get.info(list2[i][j]).juexingji) td.classList.add('Tlao_skillnodelimit');
                  td.link = skills[num];
                  num++;
                  td.textContent = get.translation(event.list2[i][j]);
                  td.style.left = (x - 3) + 'px';
                  td.style.top = (84 + j * 40) + 'px';
                  td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                    this.style.animation = 'initbutton 0.2s forwards';
                    this.addEventListener('animationend', function () { this.style.animation = ''; });
                    game.TLremoveSkillInfo();
                    if (this.classList.contains('Tlao_initselected')) {
                      this.classList.remove('Tlao_initselected');
                      event._result.skills.remove(this.link);
                    } else if (this.classList.contains('Tlao_initselected2')) {
                      this.classList.remove('Tlao_initselected2');
                      event._result.skills.remove(this.link);
                    } else {
                      if (event._result.skills.length < event.total) {
                        if (this.classList.contains('Tlao_skillnodelimit')) this.classList.add('initselected2');
                        else this.classList.add('Tlao_initselected');
                        event._result.skills.push(this.link);
                      }
                      game.TLcreateSkillInfo(this.link, event.initbg);
                    }
                  }, true)
                }
              }
              var prompt = ui.create.div('', initDialog);
              prompt.style.cssText = 'width:100%;height:20px;left:0;bottom:0;text-align:center;font-family:"yuanli";font-size:20px;line-height:18px;color:#f1dfcc;filter: drop-shadow(1px 0 0 #664934) drop-shadow(-1px 0 0 #664934) drop-shadow(0 1px 0 #664934) drop-shadow(0 -1px 0 #664934);transform:translateY(220%);letter-spacing:3px;pointer-events:none;';
              prompt.textContent = '请选择' + get.cnNumber(event.total) + '个武将技能';
              event.switchToAuto = function () {
                if (game.TLHasExt('十周年')) {
                  var con = document.getElementById('dui-controls');
                  if (con) con.classList.remove('Tlao_confirmdown2');
                }
                event.initbg.remove();
                event.control.close();
                game.resume();
                _status.imchoosing = false;
              };
              event.control = ui.create.control('ok', function (link) {
                if (game.TLHasExt('十周年')) {
                  var con = document.getElementById('dui-controls');
                  if (con) con.classList.remove('Tlao_confirmdown2');
                }
                event.initbg.remove();
                event.control.close();
                game.resume();
                _status.imchoosing = false;
              });
              game.pause();
              game.countChoose();
            };
            if (event.isMine()) {
              chooseButton(list1, list2);
            }
            else if (event.isOnline()) {
              event.player.send(chooseButton, list1, list2);
              event.player.wait();
              game.pause();
            }
            else {
              switchToAuto();
            }
            'step 1'
            var map = event.result || result;
            if (map && map.skills && map.skills.length) {
              for (var i of map.skills) player.addSkillLog(i);
            }
            game.broadcastAll(function (list) {
              game.expandSkills(list);
              for (var i of list) {
                var info = lib.skill[i];
                if (!info) continue;
                if (!info.audioname2) info.audioname2 = {};
                info.audioname2.old_yuanshu = 'weidi';
              }
            }, map.skills);
          },

          content: function () {
            'step 0'
            if (player.storage.fanghun) player.draw(player.storage.fanghun);
            player.removeMark('fanghun', player.storage.fanghun);
            'step 1'
            var list;
            if (_status.characterlist) {
              list = [];
              for (var i = 0; i < _status.characterlist.length; i++) {
                var name = _status.characterlist[i];
                if (lib.skill.PSfushi.characterList().contains(name)) list.push(name);
              }
            }
            else if (_status.connectMode) {
              list = get.charactersOL(function (i) {
                return !lib.skill.PSfushi.characterList().contains(i);
              });
            }
            else {
              list = get.gainableCharacters(function (info, i) {
                return lib.skill.PSfushi.characterList().contains(i);
              });
            }
            var players = game.players.concat(game.dead);
            for (var i = 0; i < players.length; i++) {
              list.remove(players[i].name);
              list.remove(players[i].name1);
              list.remove(players[i].name2);
            }
            list.remove('zhaoyun');
            list.remove('re_zhaoyun');
            list.remove('ol_zhaoyun');
            list.remove('JX_zhaoxiang');
            list.remove('zhaoxiang');
            list.remove('tw_zhaoxiang');
            list = list.randomGets(8);
            var skills = [];
            if (player.isUnderControl()) {
              game.swapPlayerAuto(player);
            }
            if (lib.config.extensions && lib.config.extensions.contains('天牢令') && lib.config['extension_天牢令_enable'] && game.TLHasExt) {
              for (var i = 0; i < list.length; i++) {
                skills[i] = (lib.character[list[i]][3] || []);
              }
              if (!list.length || !skills.length) { event.finish(); return; }
              var next = game.createEvent('chooseToFuHan');
              next.player = player;
              next.list1 = list;
              next.list2 = skills;
              next.topic = '扶世';
              next.total = 3;
              next.setContent(lib.skill.PSfushi.chooseToFuHan);
              if (player.isMinHp()) player.recover();
              event.finish();
              return;
            }
            for (var i of list) {
              skills.addArray(lib.character[i][3] || []);
            }
            if (!list.length || !skills.length) { event.finish(); return; }
            var switchToAuto = function () {
              _status.imchoosing = false;
              event._result = {
                bool: true,
                skills: skills.randomGets(3),
              };
              if (event.dialog) event.dialog.close();
              if (event.control) event.control.close();
            };
            var chooseButton = function (list, skills) {
              var event = _status.event;
              if (!event._result) event._result = {};
              event._result.skills = [];
              var rSkill = event._result.skills;
              var dialog = ui.create.dialog('请选择获得至多三个技能', [list, 'character'], 'hidden');
              event.dialog = dialog;
              var table = document.createElement('div');
              table.classList.add('add-setting');
              table.style.margin = '0';
              table.style.width = '100%';
              table.style.position = 'relative';
              for (var i = 0; i < skills.length; i++) {
                var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                td.link = skills[i];
                table.appendChild(td);
                td.innerHTML = '<span>' + get.translation(skills[i]) + '</span>';
                td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                  if (_status.dragged) return;
                  if (_status.justdragged) return;
                  _status.tempNoButton = true;
                  setTimeout(function () {
                    _status.tempNoButton = false;
                  }, 500);
                  var link = this.link;
                  if (!this.classList.contains('bluebg')) {
                    if (rSkill.length >= 3) return;
                    rSkill.add(link);
                    this.classList.add('bluebg');
                  }
                  else {
                    this.classList.remove('bluebg');
                    rSkill.remove(link);
                  }
                });
              }
              dialog.content.appendChild(table);
              dialog.add('　　');
              dialog.open();

              event.switchToAuto = function () {
                event.dialog.close();
                event.control.close();
                game.resume();
                _status.imchoosing = false;
              };
              event.control = ui.create.control('ok', function (link) {
                event.dialog.close();
                event.control.close();
                game.resume();
                _status.imchoosing = false;
              });
              for (var i = 0; i < event.dialog.buttons.length; i++) {
                event.dialog.buttons[i].classList.add('selectable');
              }
              game.pause();
              game.countChoose();
            };
            if (event.isMine()) {
              chooseButton(list, skills);
            }
            else if (event.isOnline()) {
              event.player.send(chooseButton, list, skills);
              event.player.wait();
              game.pause();
            }
            else {
              switchToAuto();
            }
            'step 2'
            var map = event.result || result;
            if (map && map.skills && map.skills.length) {
              for (var i of map.skills) player.addSkillLog(i);
            }
            game.broadcastAll(function (list) {
              game.expandSkills(list);
              for (var i of list) {
                var info = lib.skill[i];
                if (!info) continue;
                if (!info.audioname2) info.audioname2 = {};
                info.audioname2.old_yuanshu = 'weidi';
              }
            }, map.skills);
            'step 3'
            if (player.isMinHp()) player.recover();
          },
        },
        PSdunshi: {
          audio: "dunshi",
          enable: ["chooseToUse", "chooseToRespond"],
          usable: 1,
          hiddenCard: function (player, name) {
            return (!player.getStorage('PSdunshi').contains(name) && !player.getStat('skill').PSdunshi && lib.inpile.contains(name));
          },
          init: function (player, skill) {
            if (!player.storage[skill]) player.storage[skill] = [[''], 0];
          },
          marktext: "席",
          mark: true,
          intro: {
            markcount: function (storage) {
              return storage[1];
            },
            content: function (storage, player) {
              if (!storage) return;
              var str = '<li>';
              if (storage[0].length) {
                str += '已删除牌名：';
                str += get.translation(storage[0]);
              }
              str += '<br><li>“席”标记数量：';
              str += (storage[1]);
              return str;
            },
          },
          chooseButton: {
            dialog: function (event, player) {
              var list = [];
              for (var i = 0; i < lib.inpile.length; i++) {
                var name = lib.inpile[i];
                if (player.storage.PSdunshi[0].contains(name)) continue;
                if (name == 'sha') {
                  list.push(['基本', '', 'sha']);
                  for (var j of lib.inpile_nature) list.push(['基本', '', 'sha', j]);
                }
                else if (get.type(name) == 'trick') list.push(['锦囊', '', name]);
                else if (get.type(name) == 'basic') list.push(['基本', '', name]);
              }
              if (list.length == 0) {
                return ui.create.dialog('遁世已无可用牌');
              }
              return ui.create.dialog('遁世', [list, 'vcard']);
            },
            filter: function (button, player) {
              var evt = _status.event.getParent();
              return evt.filterCard({ name: button.link[2], isCard: true }, player, evt);
            },
            check: function (button) {
              var player = _status.event.player;
              if (player.countCards('hs', button.link[2]) > 0) return 0;
              if (button.link[2] == 'wugu') return 0;
              var effect = player.getUseValue(button.link[2]);
              if (effect > 0) return effect;
              return 0;
            },
            backup: function (links, player) {
              return {
                audio: 'dunshi',
                filterCard: function () { return false },
                popname: true,
                viewAs: {
                  name: links[0][2],
                  isCard: true,
                },
                selectCard: -1,
                precontent: function () {
                  player.addTempSkill('PSdunshi_damage');
                  player.storage.PSdunshi_damage = event.result.card.name;
                },
              }
            },
          },
          initList: function (player) {
            var list, skills = [];
            if (get.mode() == 'guozhan') {
              list = [];
              for (var i in lib.characterPack.mode_guozhan) list.push(i);
            }
            else if (_status.connectMode) list = get.charactersOL();
            else {
              list = [];
              for (var i in lib.character) {
                if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) continue;
                list.push(i);
              }
            }
            for (var i of list) {
              if (i.indexOf('gz_jun') == 0) continue;
              for (var j of lib.character[i][3]) {
                if (j == 'bolan') continue;
                var skill = lib.skill[j];
                if (!skill || skill.zhuSkill || skill.dutySkill || lib.skill.bolan.banned.contains(j)) continue;
                if (skill.init || skill.ai && (skill.ai.combo || skill.ai.notemp || skill.ai.neg)) continue;
                var info = lib.translate[j + '_info'];
                if (info && info.indexOf('出牌', '受伤', '结束') != -1) skills.add(j);

              }
            }
            _status.PSdunshi_list = skills;
          },
          ai: {
            respondSha: true,
            respondShan: true,
            skillTagFilter: function (player, tag, arg) {
              if (player.getStat('skill').dunshi) return false;
              switch (tag) {
                case 'respondSha': return (_status.event.type != 'phase' || (player == game.me || player.isUnderControl() || player.isOnline()));
                case 'respondShan': return;
                case 'save':
                  if (arg == player) return true;
                  return;
              }
            },
            order: 2,
            result: {
              player: function (player) {
                if (_status.event.type == 'dying') {
                  return get.attitude(player, _status.event.dying);
                }
                return 1;
              },
            },
          },
          subSkill: {
            backup: {
              audio: "dunshi",
              sub: true,
            },
            damage: {
              audio: "dunshi",
              trigger: {
                global: "damageBegin2",
              },
              forced: true,
              charlotte: true,
              filter: function (event, player) {
                return event.source == _status.currentPhase;
              },
              onremove: true,
              logTarget: "source",
              content: function () {
                'step 0'
                event.cardname = player.storage.PSdunshi_damage;
                player.removeSkill('PSdunshi_damage');
                event.target = trigger.source;
                event.videoId = lib.status.videoId++;
                var func = function (card, id, card2, card3) {
                  var list = [
                    '防止即将对' + card3 + '造成的伤害，并令' + card + '获得一个技能描述中包含“出牌/受伤/结束”的技能',
                    '从〖遁世〗中删除【' + card2 + '】并获得一枚“席”',
                    '减1点体力上限，然后摸等同于“席”数的牌',
                  ];
                  var choiceList = ui.create.dialog('遁世：请选择两项');
                  choiceList.videoId = id;
                  for (var i = 0; i < list.length; i++) {
                    var str = '<div class="popup text" style="width:calc(100% - 10px);display:inline-block">';
                    str += list[i];
                    str += '</div>';
                    var next = choiceList.add(str);
                    next.firstChild.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', ui.click.button);
                    next.firstChild.link = i;
                    for (var j in lib.element.button) {
                      next[j] = lib.element.button[j];
                    }
                    choiceList.buttons.add(next.firstChild);
                  }
                  return choiceList;
                };
                if (player.isOnline2()) {
                  player.send(func, get.translation(trigger.source), event.videoId, get.translation(event.cardname), get.translation(trigger.player));
                }
                event.dialog = func(get.translation(trigger.source), event.videoId, get.translation(event.cardname), get.translation(trigger.player));
                if (player != game.me || _status.auto) {
                  event.dialog.style.display = 'none';
                }
                var next = player.chooseButton();
                next.set('dialog', event.videoId);
                next.set('forced', true);
                next.set('selectButton', 2);
                next.set('ai', function (button) {
                  var player = _status.event.player;
                  switch (button.link) {
                    case 0:
                      if (get.attitude(player, _status.currentPhase) > 0) return 3;
                      return 0;
                    case 1:
                      return 1;
                    case 2:
                      var num = player.storage.PSdunshi[1];
                      for (var i of ui.selected.buttons) {
                        if (i.link == 1) num++;
                      }
                      if (num > 0 && player.isDamaged()) return 2;
                      return 0;
                  }
                });
                'step 1'
                if (player.isOnline2()) {
                  player.send('closeDialog', event.videoId);
                }
                event.dialog.close();
                event.links = result.links.sort();
                for (var i of event.links) {
                  game.log(player, '选择了', '#g【遁世】', '的', '#y选项' + get.cnNumber(i + 1, true));
                }
                if (event.links.contains(0)) {
                  trigger.cancel();
                  if (!_status.PSdunshi_list) lib.skill.PSdunshi.initList();
                  var list = _status.PSdunshi_list.filter(function (i) {
                    return !target.hasSkill(i, null, null, false);
                  }).randomGets(4);
                  if (list.length == 0) event.goto(3);
                  else {
                    event.videoId = lib.status.videoId++;
                    var func = function (skills, id, target) {
                      var dialog = ui.create.dialog('forcebutton');
                      dialog.videoId = id;
                      dialog.add('令' + get.translation(target) + '获得一个技能');
                      for (var i = 0; i < skills.length; i++) {
                        dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' + get.translation(skills[i]) + '】</div><div>' + lib.translate[skills[i] + '_info'] + '</div></div>');
                      }
                      dialog.addText(' <br> ');
                    }
                    if (player.isOnline()) player.send(func, list, event.videoId, target);
                    else if (player == game.me) func(list, event.videoId, target);
                    player.chooseControl(list).set('ai', function () {
                      var controls = _status.event.controls;
                      if (controls.contains('cslilu')) return 'cslilu';
                      return controls[0];
                    });
                  }
                }
                else event.goto(3);
                'step 2'
                game.broadcastAll('closeDialog', event.videoId);
                target.addSkillLog(result.control);
                'step 3'
                var storage = player.storage.PSdunshi;
                if (event.links.contains(1)) {
                  storage[0].add(event.cardname);
                  storage[1]++;
                  player.markSkill('PSdunshi');
                }
                if (event.links.contains(2)) {
                  player.loseMaxHp();
                  if (storage[1] > 0) player.draw(storage[1]);
                }
              },
              sub: true,
            },
          },
        },
        PSjueyan: {
          audio: "drlt_jueyan",
          enable: "phaseUse",
          usable: 1,
          filter: function (event, player) {
            return player.hasEnabledSlot(1) || player.hasEnabledSlot(2) || player.hasEnabledSlot(5) || player.hasEnabledSlot('horse');
          },
          content: function () {
            'step 0'
            player.chooseToDisable(true).set('ai', function (event, player, list) {
              if (list.contains('equip2')) return 'equip2';
              if (list.contains('equip1') && (player.countCards('h', function (card) {
                return get.name(card, player) == 'sha' && player.hasUseTarget(card);
              }) - player.getCardUsable('sha')) > 1) return 'equip1';
              if (list.contains('equip5') && player.countCards('h', function (card) {
                return get.type2(card, player) == 'trick' && player.hasUseTarget(card);
              }) > 1) return 'equip5';
            });
            'step 1'
            switch (result.control) {
              case 'equip1':
                player.addSkill('drlt_jueyan1');
                break;
              case 'equip2':
                player.draw(3);
                player.addSkill('drlt_jueyan3');
                break;
              case 'equip3_4':
                player.addSkill('drlt_jueyan2');
                break;
              case 'equip5':
                player.addSkill('rejizhi');
                break;
            }
          },
          ai: {
            order: 13,
            result: {
              player: function (player) {
                if (!player.isDisabled('equip2')) return 1;
                if (!player.isDisabled('equip1') && (player.countCards('h', function (card) {
                  return get.name(card, player) == 'sha' && player.hasValueTarget(card);
                }) - player.getCardUsable('sha')) > 1) return 1;
                if (!player.isDisabled('equip5') && player.countCards('h', function (card) {
                  return get.type2(card, player) == 'trick' && player.hasUseTarget(card);
                }) > 1) return 1;
                return -1;
              },
            },
          },
        },
        PSjuece: {
          audio: "rejuece",
          enable: "phaseUse",
          filter: function (event, player) {
            if (!player.awakenedSkills.contains('xinfencheng') && !player.awakenedSkills.contains('fencheng') && !player.awakenedSkills.contains('dcfencheng')) return false;
            return player.hasCard(function (card) {
              return (get.name(card) == 'sha' && card.nature == 'fire') || get.name(card) == "huogong"
            }, 'h');
          },
          filterCard: function (card) {
            return (get.name(card) == 'sha' && card.nature == 'fire') || get.name(card) == "huogong";
          },
          selectCard: 1,
          discard: true,
          content: function () {
            if (player.awakenedSkills.contains('xinfencheng')) player.restoreSkill('xinfencheng');
            if (player.awakenedSkills.contains('fencheng')) player.restoreSkill('fencheng');
            if (player.awakenedSkills.contains('dcfencheng')) player.restoreSkill('dcfencheng');
            game.log(player, '重置了', '#g【焚城】');
          },
          group: "rejuece",
        },
        PSkangkai: {
          audio: "kaikang",
          trigger: {
            global: "useCardToTargeted",
          },
          filter: function (event, player) {
            return get.tag(event.card, 'damage') > 0 && event.target.isIn();
          },
          check: function (event, player) {
            return get.attitude(player, event.target) >= 0;
          },
          logTarget: "target",
          content: function () {
            "step 0"
            player.draw();
            player.chooseTarget(1, "选择一名角色，令其将一张牌交给" + get.translation(trigger.target), true, function (card, player, target) {
              return target != trigger.target;
            }).ai = function (target) {
              if (!_status.event.aicheck) return 0;
              return -get.attitude(player, target);
            };
            "step 1"
            if (result.bool && result.targets && result.targets.length) {
              event.targets = result.targets;
              event.targets[0].chooseCard('he', false, 1, '选择交给' + get.translation(trigger.target) + get.cnNumber(1) + '张牌' + '，或失去一点体力').set('ai', function (card) {
                if (get.position(card) == 'e') return -1;
                if (card.name == 'shan') return 1;
                if (get.type(card) == 'equip') return 0.5;
                return 0;
              });
            }
            "step 2"
            if (result.bool && result.cards && result.cards.length) {
              event.targets[0].give(result.cards, trigger.target);
              event.card = result.cards[0];
            }
            else {
              event.targets[0].loseHp();
            }
            "step 3"
            if (trigger.target.getCards('h').contains(card) && get.type(card) == 'equip') {
              trigger.target.chooseUseTarget(card);
            }
          },
          ai: {
            threaten: 1.1,
          },
          "audioname2": {
            "old_yuanshu": "weidi",
          },
        },
        PSjiwu: {
          derivation: ["PSmn_qiangxi", "sbtieji", "decadexuanfeng", "rewansha"],
          audio: "jiwu",
          enable: "phaseUse",
          filter: function (event, player) {
            if (player.countCards('h') == 0) return false;
            if (!player.hasSkill('PSmn_qiangxi')) return true;
            if (!player.hasSkill('sbtieji')) return true;
            if (!player.hasSkill('decadexuanfeng')) return true;
            if (!player.hasSkill('rewansha')) return true;
            return false;
          },
          filterCard: true,
          position: "he",
          check: function (card) {
            if (get.position(card) == 'e' && _status.event.player.hasSkill('decadexuanfeng')) return 16 - get.value(card);
            return 7 - get.value(card);
          },
          content: function () {
            'step 0'
            var list = [];
            if (!player.hasSkill('PSmn_qiangxi')) list.push('PSmn_qiangxi');
            if (!player.hasSkill('sbtieji')) list.push('sbtieji');
            if (!player.hasSkill('decadexuanfeng')) list.push('decadexuanfeng');
            if (!player.hasSkill('rewansha')) list.push('rewansha');
            if (list.length == 1) {
              player.addTempSkill(list[0]);
              event.finish();
            }
            else {
              player.chooseControl(list, function () {
                if (list.contains('decadexuanfeng') && player.countCards('he', { type: 'equip' })) return 'decadexuanfeng';
                if (!player.getStat().skill.PSmn_qiangxix) {
                  if (player.hasSkill('PSmn_qiangxi') && player.getEquip(1) && list.contains('decadexuanfeng')) return 'decadexuanfeng';
                  if (list.contains('rewansha') || list.contains('PSmn_qiangxi')) {
                    var players = game.filterPlayer();
                    for (var i = 0; i < players.length; i++) {
                      if (players[i].hp == 1 && get.attitude(player, players[i]) < 0) {
                        if (list.contains('rewansha')) return 'rewansha';
                        if (list.contains('PSmn_qiangxi')) return 'PSmn_qiangxi';
                      }
                    }
                  }
                }
                if (list.contains('PSmn_qiangxi')) return 'PSmn_qiangxi';
                if (list.contains('rewansha')) return 'rewansha';
                if (list.contains('decadexuanfeng')) return 'decadexuanfeng';
                return 'sbtieji';
              }).set('prompt', '选择获得一项技能直到回合结束');
            }
            'step 1'
            player.addTempSkill(result.control);
            player.popup(get.translation(result.control));
          },
          ai: {
            order: function () {
              var player = _status.event.player;
              if (player.countCards('e', { type: 'equip' })) return 10;
              if (!player.getStat().skill.PSmn_qiangxix) {
                if (player.hasSkill('PSmn_qiangxi') && player.getEquip(1) && !player.hasSkill('decadexuanfeng')) return 10;
                if (player.hasSkill('rewansha')) return 1;
                var players = game.filterPlayer();
                for (var i = 0; i < players.length; i++) {
                  if (players[i].hp == 1 && get.attitude(player, players[i]) < 0) return 10;
                }
              }
              return 1;
            },
            result: {
              player: function (player) {
                if (player.countCards('e', { type: 'equip' })) return 1;
                if (!player.getStat().skill.PSmn_qiangxix) {
                  if (player.hasSkill('PSmn_qiangxi') && player.getEquip(1) && !player.hasSkill('decadexuanfeng')) return 1;
                  if (!player.hasSkill('rewansha') || !player.hasSkill('PSmn_qiangxi')) {
                    var players = game.filterPlayer();
                    for (var i = 0; i < players.length; i++) {
                      if (players[i].hp == 1 && get.attitude(player, players[i]) < 0) return 1;
                    }
                  }
                }
                return 0;
              },
            },
          },
        },

        "PSmn_qiangxi": {
          group: "PSmn_qiangxi_damage",
          trigger: {
            global: "damageBegin2",
          },
          filter: function (event, player) {
            return event.player != player && player.countCards('he', { type: 'equip' }) > 0;
          },
          direct: true,
          content: function () {
            'step 0'
            player.chooseToDiscard('he', get.prompt('miniqiangxi', trigger.player), '弃置一张装备牌并令此伤害+1', function (card) {
              return get.type(card) == 'equip';
            }).set('goon', get.damageEffect(trigger.player, player, player) > 0).set('ai', function (card) {
              if (_status.event.goon) return 12 - get.value(card);
              return 0;
            });
            'step 1'
            if (result.bool) trigger.num++;
            game.playAudio('..', 'extension', 'PS武将/audio', 'qiangxix' + [1, 2].randomGet());
          },
          ai: {
            expose: 0.25,
          },
          subSkill: {
            damage: {
              enable: "phaseUse",
              filter: function (event, player) {
                return game.hasPlayer(function (target) {
                  return player.inRange(target) && !target.hasSkill('miniqiangxi_off');
                });
              },
              filterTarget: function (card, player, target) {
                if (player == target) return false;
                if (target.hasSkill('miniqiangxi_off')) return false;
                return player.inRange(target);
              },
              prompt: "失去1点体力并摸一张牌，对一名其他角色造成1点伤害",
              content: function () {
                'step 0'
                player.loseHp();
                player.draw();
                'step 1'
                target.addTempSkill('miniqiangxi_off');
                target.damage();
                game.playSkillAudio('qiangxi_boss_lvbu3'); game.playAudio('..', 'extension', 'PS武将/audio', 'qiangxix' + [1, 2].randomGet());
              },
              ai: {
                order: 8.5,
                result: {
                  target: function (player, target) {
                    //主公内奸矜持，其他身份当疯狗
                    var bool = (lib.translate[player.identity] == '主' || lib.translate[player.identity] == '内' || (get.mode() == 'identity' && player.hasSkill('olzaowang2') && lib.translate[player.identity] != 'nei'));
                    if (bool && target.hp - player.hp > 1) return 0;
                    if (!bool && player.hp < 2 && !player.countCards('hs', { name: ['tao', 'jiu'] })) return 0;
                    return -1;
                  },
                },
              },
              sub: true,
            },
            off: {
              charlotte: true,
              sub: true,
            },
          },
        },
        PShuiwan: {
          audio: "ext:PS武将/audio/skill:3",
          enable: ["chooseToUse", "chooseToRespond"],
          filter: function (event, player) {
            if (player.countCards('hes', function (card) {
              return card.hasGaintag('zhiheng');
            }) <= 0) return false;
            for (var i of lib.inpile) {
              var type = get.type2(i);
              if ((type == 'basic' || type == 'trick' || type == 'delay') && event.filterCard({ name: i }, player, event)) return true;
            }
            return false;
          },
          chooseButton: {
            dialog: function (event, player) {
              var list = [];
              for (var i = 0; i < lib.inpile.length; i++) {
                var name = lib.inpile[i];
                if (name == 'sha') {
                  if (event.filterCard({ name: name }, player, event)) list.push(['基本', '', 'sha']);
                  for (var j of lib.inpile_nature) {
                    if (event.filterCard({ name: name, nature: j }, player, event)) list.push(['基本', '', 'sha', j]);
                  }
                }
                else if (get.type2(name) == 'trick' && event.filterCard({ name: name }, player, event)) list.push(['锦囊', '', name]);
                else if (get.type2(name) == 'delay' && event.filterCard({ name: name }, player, event)) list.push(['延时锦囊', '', name]);
                else if (get.type(name) == 'basic' && event.filterCard({ name: name }, player, event)) list.push(['基本', '', name]);
              }
              return ui.create.dialog('会玩', [list, 'vcard']);
            },
            filter: function (button, player) {
              return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
            },
            check: function (button) {
              if (_status.event.getParent().type != 'phase') return 1;
              var player = _status.event.player;
              if (['wugu', 'zhulu_card', 'yiyi', 'lulitongxin', 'lianjunshengyan', 'diaohulishan'].contains(button.link[2])) return 0;
              return player.getUseValue({
                name: button.link[2],
                nature: button.link[3],
              });
            },
            backup: function (links, player) {
              return {
                filterCard: function (card, player) {
                  return card.hasGaintag('zhiheng');
                },
                audio: 'PShuiwan',
                popname: true,
                check: function (card) {
                  return 8 - get.value(card);
                },
                position: 'hse',
                viewAs: { name: links[0][2], nature: links[0][3] },

              }
            },
            prompt: function (links, player) {
              return '将一张牌当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
            },
          },
          hiddenCard: function (player, name) {
            if (!lib.inpile.contains(name)) return false;
            var type = get.type2(name);
            return (type == 'basic' || type == 'trick' || type == 'delay') && player.countCards('hes', function (card) {
              return card.hasGaintag('zhiheng');
            }) > 0;
          },
          ai: {
            combo: "PShw_zhiheng",
            fireAttack: true,
            respondSha: true,
            respondShan: true,
            skillTagFilter: function (player) {
              if (player.countCards('hes', function (card) {
                return card.hasGaintag('zhiheng');
              }) <= 0) return false;
            },
            order: 1,
            result: {
              player: function (player) {
                if (_status.event.dying) return get.attitude(player, _status.event.dying);
                return 1;
              },
            },
          },
          group: "PShuiwan_tag",
          subSkill: {
            tag: {
              trigger: {
                player: "gainAfter",
              },
              forced: true,
              filter: function (event, player) {
                var name = ['rezhiheng', 'zhiheng', 'PSzhiheng', 'PSzhiheng_else', 'ymzhiheng', 'minizhiheng', 'minirezhiheng', 'xinzhiheng', 'sbzhiheng'];
                for (var i = 0; i < name.length; i++) {
                  if (event.getParent(2).name == name[i]) return true;
                }
                return false;
              },
              content: function () {
                player.addGaintag(trigger.cards, "zhiheng");
              },
              sub: true,
              onremove: function () {
                player.removeGaintag(trigger.cards, "zhiheng");
              },
              "audioname2": {
                "old_yuanshu": "weidi",
              },
            },
          },
          "audioname2": {
            "old_yuanshu": "weidi",
          },
        },
        PShuashen: {
          audio: "rehuashen",
          unique: true,
          forbid: ["guozhan"],
          init: function (player) {
            player.storage.PShuashen = {
              list: [],
              shown: [],
              owned: {},
              player: player,
            }
          },
          get: function (player, num) {
            if (typeof num != 'number') num = 1;
            var list = [];
            while (num--) {
              var name = player.storage.PShuashen.list.randomRemove();
              var skills = lib.character[name][3].slice(0);
              for (var i = 0; i < skills.length; i++) {
                var info = lib.skill[skills[i]];
                // if (info.limited || info.juexingji || info.charlotte || info.zhuSkill || info.hiddenSkill || info.dutySkill) {
                skills.splice(i--, 1);
                // }
              }
              player.storage.PShuashen.owned[name] = skills;
              // player.popup(name);
              game.log(player, '获得了一个化身');
              if (!lib.skill.PSfushi.characterList().contains(name)) num++;
              else list.push(name);
            }
            if (player.isUnderControl(true)) {
              var cards = [];
              for (var i = 0; i < list.length; i++) {
                var cardname = 'PShuashen_card_' + list[i];
                lib.card[cardname] = {
                  fullimage: true,
                  image: 'character:' + list[i]
                }
                lib.translate[cardname] = lib.translate[list[i]];
                cards.push(game.createCard(cardname, '', ''));
              }
              player.$draw(cards);
            }
          },
          group: ["PShuashen_start", "PShuashen_change", "PShuashen_transform"],
          intro: {
            content: function (storage, player) {
              var str = '';
              var slist = storage.owned;
              var list = [];
              for (var i in slist) {
                list.push(i);
              }
              if (list.length) {
                str += get.translation(list[0]);
                for (var i = 1; i < list.length; i++) {
                  str += '、' + get.translation(list[i]);
                }
              }
              var skill = player.additionalSkills.PShuashen[0];
              if (skill) {
                str += '<p>当前技能：' + get.translation(skill);
              }
              return str;
            },
            mark: function (dialog, content, player) {
              var slist = content.owned;
              var list = [];
              for (var i in slist) {
                list.push(i);
              }
              if (list.length) {
                dialog.addSmall([list, 'character']);
              }
              if (!player.isUnderControl(true)) {
                for (var i = 0; i < dialog.buttons.length; i++) {
                  if (!content.shown.contains(dialog.buttons[i].link)) {
                    dialog.buttons[i].node.group.remove();
                    dialog.buttons[i].node.hp.remove();
                    dialog.buttons[i].node.intro.remove();
                    dialog.buttons[i].node.name.innerHTML = '未<br>知';
                    dialog.buttons[i].node.name.dataset.nature = '';
                    dialog.buttons[i].style.background = '';
                    dialog.buttons[i]._nointro = true;
                    dialog.buttons[i].classList.add('menubg');
                  }
                }
              }
              if (player.additionalSkills.PShuashen) {
                var skill = player.additionalSkills.PShuashen[0];
                if (skill) {
                  dialog.add('<div><div class="skill">【' + get.translation(skill) +
                    '】</div><div>' + lib.translate[skill + '_info'] + '</div></div>');
                }
              }
            },
          },
          setup: function (player, gain) {
            for (var i in lib.character) {
              if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) continue;
              var add = false;
              for (var j = 0; j < lib.character[i][3].length; j++) {
                var info = lib.skill[lib.character[i][3][j]];
                if (!info) {
                  continue;
                }
                // if (!info.limited && !info.juexingji && !info.charlotte && !info.zhuSkill && !info.hiddenSkill && !info.dutySkill) {
                add = true; break;
                // }
              }
              if (add && lib.skill.PSfushi.characterList().contains(i)) {
                player.storage.PShuashen.list.push(i);
              }
            }
            for (var i = 0; i < game.players.length; i++) {
              player.storage.PShuashen.list.remove([game.players[i].name]);
              player.storage.PShuashen.list.remove([game.players[i].name1]);
              player.storage.PShuashen.list.remove([game.players[i].name2]);
            }
            player.storage.PShuasheninited = true;
            if (gain) {
              player.markSkill('PShuashen');
              lib.skill.PShuashen.get(player, 2);
              _status.event.trigger('PShuashenStart');
            }
          },
          subSkill: {
            start: {
              audio: "rehuashen",
              trigger: {
                global: "gameStart",
                player: ["enterGame", "damageBefore"],
              },
              forced: true,
              popup: false,
              filter: function (event, player) {
                return !player.storage.PShuasheninited;
              },
              content: function () {
                lib.skill.PShuashen.setup(player, trigger.name != 'damage');
              },
              sub: true,
            },
            change: {
              audio: "rehuashen",
              trigger: {
                player: ["phaseZhunbeiBegin", "phaseEnd", "PShuashenStart"],
              },
              init: function (player) {
                player.storage.PShuashen_change = [];
              },
              filter: function (event, player, name) {
                //if(name=='phaseBegin'&&game.phaseNumber==1) return false;
                return true;
              },
              forced: true,
              content: function () {
                'step 0'
                var slist = player.storage.PShuashen.owned;
                var list = [];
                for (var i in slist) {
                  list.push(i);
                }
                if (!list.length) event.goto(2);
                var next = player.chooseControl("制衡化身", "更换技能", "cancel2").set('ai', function () {
                  return "cancel2";
                });
                next.dialog = ui.create.dialog('化身', [list, 'character'], 'hidden');
                'step 1'
                if (result.control == "更换技能") event.goto(2);
                else if (result.control == "制衡化身") event.goto(5);
                else event.finish();
                'step 2'
                if (get.is.empty(player.storage.PShuashen.owned)) {
                  if (!player.storage.PShuasheninited) {
                    lib.skill.PShuashen.setup(player, false);
                  }
                  event.finish();
                  return;
                }
                event.trigger('playercontrol');
                var num = 0;
                event.num = num;
                event.skills = [];
                for (var i of player.storage.PShuashen_change) {
                  if (player.hasSkill(i)) {
                    player.removeSkill(i);
                  }
                }

                'step 3'
                event.num++;
                var slist = player.storage.PShuashen.owned;
                var list = [];
                for (var i in slist) {
                  list.push(i);
                }
                var skills = [];
                for (var i of list) {
                  skills.addArray((lib.character[i][3] || []).filter(function (skill) {
                    var info = get.info(skill);
                    return info; //&& !info.zhuSkill && !info.limited && !info.juexingji && !info.hiddenSkill && !info.charlotte && !info.dutySkill;
                  }));
                }
                if (!list.length || !skills.length) { event.finish(); return; }
                if (player.isUnderControl()) {
                  game.swapPlayerAuto(player);
                }
                var switchToAuto = function () {
                  _status.imchoosing = false;
                  event._result = {
                    bool: true,
                    skills: skills.randomGets(3),
                  };
                  if (event.dialog) event.dialog.close();
                  if (event.control) event.control.close();
                };
                var str = `请选择获得第${get.cnNumber(event.num, true)}个技能`;
                player.chooseButtonControl([str, [list, 'character'], 'hidden'], true, false).set('control', function (buttons) {
                  if (buttons.length) {
                    var skills = [];
                    skills.addArray((lib.character[buttons[0].link][3] || []).filter(function (skill) {
                      var info = get.info(skill);
                      return info; //&& !info.zhuSkill && !info.limited && !info.juexingji && !info.hiddenSkill && !info.charlotte && !info.dutySkill;
                    }));
                    for (var i of skills) {
                      if (player.hasSkill(i)) skills.remove(i);
                    }
                    if (skills.length) return skills;
                    else return;
                  }
                  else return 'cancel2';
                }).set('processAI', function (event, player) {
                  return {
                    bool: true,
                    links: links,
                    control: control,
                  }
                });
                'step 4'
                var map = event.result || result;
                if (map.control) map.skills = map.control;
                if (map && map.skills && map.skills.length && map.skills != 'cancel2') {
                  if (typeof map.skills == 'string') map.skills = [map.skills];
                  for (var i of map.skills) {
                    if (!player.hasSkill(i)) {
                      player.addSkillLog(i);
                    }
                  }
                  event.skills.addArray(map.skills);
                  player.storage.PShuashen_change = event.skills;
                }
                if (event.num < 3) event.goto(3);
                else event.finish();
                'step 5'
                var slist = player.storage.PShuashen.owned;
                var list = [];
                for (var i in slist) {
                  list.push(i);
                }
                event.dialogx = ui.create.dialog('制衡至多两张化身', [list, 'character'], 'hidden');
                var next = player.chooseButton(true);
                next.dialog = event.dialogx;
                next.set('selectButton', [1, 2]);
                next.set('ai', function (button) {
                  return 1;
                });
                'step 6'
                event.dialogx.close();
                event.links = result.links.sort();
                if (event.links) {
                  /* var slist = player.storage.PShuashen.owned;
                  player.storage.PShuashen.owned = {};
                  for (var j in slist) {
                    if (event.links.contains(j)) continue;
                    player.storage.PShuashen.owned[j] = slist[j];
                  }  // 移除化身牌，旧写法*/
                  for (var k = 0; k < event.links.length; k++) {
                    delete player.storage.PShuashen.owned[event.links[k]] // 移除化身牌，新写法，严格模式下不允许使用delete，请用回旧写法
                    lib.skill.PShuashen.get(player); // 获得化身牌
                  }
                  lib.skill.PShuashen.get(player); // 额外获得一张化身牌
                  player.markSkill('PShuashen');
                }
              },
              sub: true,
            },
            transform: {
              audio: "rehuashen",
              enable: "phaseUse",
              content: function () {
                "step 0"
                var sex = player.sex == 'female' ? '男' : '女';
                player.chooseBool('是否将性别改为：' + sex + '？');
                "step 1"
                if (result.bool) {
                  if (player.sex == 'female') {
                    player.sex = 'male';
                  }
                  else { player.sex = 'female'; }
                }
                "step 2"
                var list = lib.group.slice(0);
                game.log(list);
                list.remove(player.group);
                list.push('cancel2');
                player.chooseControl(list).set('ai', function () {
                  return list.randomGet();
                }).set('prompt', '请选择你的势力：');
                'step 3'
                if (result.control != 'cancel2') {
                  player.logSkill('PShuashen');
                  var group = result.control.slice(0, 3);
                  player.changeGroup(group);
                }
              },
              sub: true,
            },
          },
        },
        PSxinsheng: {
          audio: "xinsheng",
          unique: true,
          forbid: ["guozhan"],
          trigger: {
            player: "damageEnd",
            source: "damageEnd",
          },
          priority: -1,
          frequent: true,
          filter: function (event, player) {
            return player.storage.PShuashen && player.storage.PShuashen.list &&
              player.storage.PShuashen.list.length > 0;
          },
          content: function () {
            for (var i = 0; i < trigger.num; i++) {
              lib.skill.PShuashen.get(player);
            }
            player.markSkill('PShuashen');
          },
          ai: {
            "maixie_hp": true,
          },
        },
        PSbuqu: {
          audio: "buqu",
          audioname: ["key_yuri"],
          trigger: {
            player: "chooseToUseBefore",
          },
          forced: true,
          preHidden: true,
          filter: function (event, player) {
            return event.type == 'dying' && player.isDying() && event.dying == player && !event.getParent()._PSbuqu;
          },
          content: function () {
            "step 0"
            trigger.getParent()._PSbuqu = true;
            var card = get.cards()[0];
            event.card = card;
            player.addToExpansion(card, 'gain2').gaintag.add('PSbuqu');
            "step 1"
            var cards = player.getExpansions('PSbuqu'), num = get.number(card);
            player.showCards(cards, '不屈')
            for (var i = 0; i < cards.length; i++) {
              if (cards[i] != card && get.number(cards[i]) == num) {
                player.loseToDiscardpile(card);
                return;
              };
            }
            trigger.cancel();
            trigger.result = { bool: true };
            if (player.hp <= 0) {
              player.recover(1 - player.hp);
            }
          },
          mod: {
            maxHandcard: function (player, num) {
              if (player.getExpansions('PSbuqu').length) return num + player.getExpansions('PSbuqu').length;
            },
            cardUsable: function (card, player, num) {
              if (card.name == 'sha' && player.getExpansions('PSbuqu').length) return num + player.getExpansions('PSbuqu').length;
            },
          },
          group: "PSbuqu_draw",
          subSkill: {
            draw: {
              audio: "buqu",
              audioname: ["sp_lvmeng"],
              trigger: {
                player: "phaseDrawBegin2",
              },
              frequent: true,
              filter: function (event, player) {
                return !event.numFixed && player.getExpansions('PSbuqu').length;
              },
              content: function () {
                trigger.num += player.getExpansions('PSbuqu').length;
              },
              ai: {
                threaten: 1.3,
              },
              sub: true,
            },
          },
          ai: {
            save: true,
            mingzhi: true,
            skillTagFilter: function (player, tag, target) {
              if (player != target) return false;
            },
          },
          intro: {
            content: "expansion",
            markcount: "expansion",
          },
        },
        PSfenji: {
          audio: "fenji",
          trigger: {
            global: ["gainAfter", "loseAfter", "loseAsyncAfter"],
          },
          direct: true,
          filter: function (event, player) {
            if (event.name == 'lose') {
              if (event.type != 'discard' || !event.player.isIn()) return false;
              if ((event.discarder || event.getParent(2).player) == event.player) return false;
              if (!event.getl(event.player).hs.length) return false;
              return true;
            }
            else if (event.name == 'gain') {
              if (event.giver || event.getParent().name == '_yongjian_zengyu') return false;
              var cards = event.getg(event.player);
              if (!cards.length) return false;
              return game.hasPlayer(function (current) {
                if (current == event.player) return false;
                var hs = event.getl(current).hs;
                for (var i of hs) {
                  if (cards.contains(i)) return true;
                }
                return false;
              });
            }
            else if (event.type == 'gain') {
              if (event.giver || !event.player || !event.player.isIn()) return false;
              var hs = event.getl(event.player);
              return game.hasPlayer(function (current) {
                if (current == event.player) return false;
                var cards = event.getg(current);
                for (var i of cards) {
                  if (hs.contains(i)) return true;
                }
              });
            }
            else if (event.type == 'discard') {
              if (!event.discarder) return false;
              return game.hasPlayer(function (current) {
                return current != event.discarder && event.getl(current).hs.length > 0;
              });
            }
            return false;
          },
          content: function () {
            'step 0'
            var targets = [];
            if (trigger.name == 'gain') {
              var cards = trigger.getg(trigger.player);
              targets.addArray(game.filterPlayer(function (current) {
                if (current == trigger.player) return false;
                var hs = trigger.getl(current).hs;
                for (var i of hs) {
                  if (cards.contains(i)) return true;
                }
                return false;
              }));
            }
            else if (trigger.name == 'loseAsync' && trigger.type == 'discard') {
              targets.addArray(game.filterPlayer(function (current) {
                return current != trigger.discarder && trigger.getl(current).hs.length > 0;
              }));
            }
            else targets.push(trigger.player);
            event.targets = targets.sortBySeat();
            if (!event.targets.length) event.finish();
            'step 1'
            var target = targets.shift();
            event.target = target;
            var num = player.getExpansions('PSbuqu').length ? player.getExpansions('PSbuqu').length + 2 : 2;
            if (target.isIn()) player.chooseBool(get.prompt('fenji', target), '失去1点体力，令该角色摸' + get.cnNumber(num) + '张牌').set('ai', function () {
              var evt = _status.event.getParent();
              return get.attitude(evt.player, evt.target) > 4;
            });
            else {
              if (targets.length > 0) event.goto(1);
              else event.finish();
            }
            'step 2'
            if (result.bool) {
              player.logSkill('fenji', target);
              player.loseHp();
            }
            else {
              if (targets.length > 0) event.goto(1);
              else event.finish();
            }
            'step 3'
            var num = player.getExpansions('PSbuqu').length ? player.getExpansions('PSbuqu').length + 2 : 2;
            target.draw(num);
            if (targets.length > 0) event.goto(1);
          },
        },
        PSzanhe: {
          audio: "neifa",
          trigger: {
            source: "dieAfter",
          },
          direct: true,
          mark: true,
          init: function (player, skill) {
            if (!player.storage[skill]) player.storage[skill] = 0;
          },
          intro: {
            content: "本轮已杀死#人",
          },
          content: function () {
            player.storage.PSzanhe++;
          },
          mod: {
            cardUsable: function (card, player, num) {
              if (card.name == 'sha') return num += 5;
            },
            selectTarget: function (card, player, range) {
              if (card.name == 'sha' && range[1] != -1) {
                range[1]++;
              }
              if (get.type(card) == 'trick' && range[1] != -1) {
                range[1] += Infinity;
              }
            },
          },
          group: ["PSzanhe_1", "PSzanhe_2", "PSzanhe_lose", "PSzanhe_add"],
          subSkill: {
            "1": {
              trigger: {
                player: "useCardAfter",
              },
              filter: function (event, player) {
                if (_status.currentPhase != player) return false;
                return true;
              },
              direct: true,
              content: function () {
                "step 0"
                if (!player.countCards('he')) event.finish();
                else player.chooseCard('he', '是否重铸至多两张牌', [1, 2]).set('filterCard', (card, player) => player.canRecast(card)).set('ai', function (card) {
                  var player = _status.event.player;
                  if (card.name != 'tao' && card.name != 'wuxie') return 1;
                  return 5 - get.value(card);
                });
                'step 1'
                if (result.bool) {
                  player.recast(result.cards);
                  player.logSkill('PSzanhe');
                }
              },
              sub: true,
            },
            "2": {
              trigger: {
                player: "loseAfter",
                global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
              },
              direct: true,
              filter: function (event, player) {
                if (event.getParent(2).name == 'PSzanhe_2') return false;
                if (player == _status.currentPhase) return false;
                if (event.name == 'gain' && event.player == player) return false;
                var evt = event.getl(player);
                return evt && evt.cards2 && evt.cards2.length > 0;
              },
              content: function () {
                "step 0"
                if (!player.countCards('he')) event.finish();
                else player.chooseCard('he', '是否重铸至多两张牌', [1, 2]).set('filterCard', (card, player) => player.canRecast(card)).set('ai', function (card) {
                  var player = _status.event.player;
                  if (card.name != 'tao' && card.name != 'wuxie') return 1;
                  return 5 - get.value(card);
                });
                'step 1'
                if (result.bool) {
                  player.recast(result.cards);
                  player.logSkill('PSzanhe');
                }
              },
              sub: true,
            },
            lose: {
              trigger: {
                global: "roundStart",
              },
              direct: true,
              filter: function (event, player) {
                return player.storage.PSzanhe > 0;
              },
              content: function () {
                'step 0'
                player.logSkill('PSzanhe');
                player.storage.PSzanhe = 0;
                if (player.countCards('he') < 2) {
                  player.loseHp();
                  event.finish();
                }
                else {
                  player.chooseBool('暂和:弃置两张牌，或点击取消失去一点体力');
                }
                'step 1'
                if (result.bool) {
                  player.chooseToDiscard('he', 2, true);
                }
                else { player.loseHp(); }
              },
              sub: true,
            },
            add: {
              trigger: {
                player: "useCard1",
              },
              direct: true,
              filter: function (event, player) {
                var info = get.info(event.card, false);
                if (info.allowMultiple == false) return false;
                if (event.card.name != 'wuzhong') return false;
                if (event.targets && !info.multitarget) {
                  if (game.hasPlayer(function (current) {
                    return !event.targets.contains(current) && lib.filter.targetEnabled2(event.card, player, current) && lib.filter.targetInRange(event.card, player, current);
                  })) {
                    return true;
                  }
                }
                return false;
              },
              content: function () {
                'step 0'
                var num = game.countPlayer(function (current) {
                  return !trigger.targets.contains(current) && lib.filter.targetEnabled2(trigger.card, player, current) && lib.filter.targetInRange(trigger.card, player, current);
                });
                player.chooseTarget('暂和：是否为' + get.translation(trigger.card) + '增加任意个目标？', [1, Infinity], function (card, player, target) {
                  var trigger = _status.event.getTrigger();
                  var card = trigger.card;
                  return !trigger.targets.contains(target) && lib.filter.targetEnabled2(card, player, target) && lib.filter.targetInRange(card, player, target);
                }).set('ai', function (target) {
                  var player = _status.event.player;
                  var card = _status.event.getTrigger().card;
                  return get.effect(target, card, player, player);
                });
                'step 1'
                if (result.bool) {
                  if (player != game.me && !player.isOnline()) game.delayx();
                }
                else event.finish();
                'step 2'
                var targets = result.targets.sortBySeat();
                player.logSkill('guowu_add', targets);
                trigger.targets.addArray(targets);
                //if(get.mode()=='guozhan') player.removeSkill('guowu_add');
              },
              sub: true,
            },
          },
        },
        PSshengshi: {
          audio: "sphuangen",
          trigger: {
            global: "recoverAfter",
          },
          forced: true,
          content: function () {
            "step 0"
            var targets = game.filterPlayer();
            for (var i = 0; i < targets.length; i++) {
              targets[i].loseHp();
              game.delay();
            }
            targets.sort(lib.sort.seat);
            event.targets = targets;
            event.num = 0;
            player.line(targets, 'green');
            "step 1"
            if (num < event.targets.length) {
              var he = event.targets[num].getCards('he');
              if (he.length) {
                player.discardPlayerCard('he', event.targets[num], true);
              }
              else {
                event.targets[num].loseHp();
              }
              event.num++;
              event.redo();
            }
          },
          ai: {
            threaten: 4,
          },
        },
        PSluanshi: {
          audio: "shiyuan",
          trigger: {
            target: "useCardToTarget",
          },
          forced: true,
          filter: function (event, player) {
            if (event.card.storage && event.card.storage.PSluanshi) return false;
            return get.tag(event.card, 'damage') > 0 && player.isIn();
          },
          content: function () {
            "step 0"
            var cards = get.cards(3), sum = 0, str = '失去体力';
            game.cardsGotoOrdering(cards);
            for (var i of cards) {
              sum += i.number;
            }
            game.log(cards, '点数和为', sum);
            if (sum != 21) str = sum > 21 ? '回复体力' : '反弹效果';
            player.showCards(cards, '乱世：点数和为' + sum + '，' + get.translation(player) + str);
            game.delay(2);
            if (sum > 21) {
              player.recover();
            }
            else if (sum == 21) {
              player.loseHp();
            }
            else {
              game.log(trigger.player)
              var target = trigger.player;
              var evt = trigger.getParent();
              evt.triggeredTargets2.remove(player);
              evt.targets.remove(player);
              evt.targets.push(target);
            }
          },
          ai: {
            threaten: 3,
          },
        },
        PSshanrang: {
          audio: "sphantong",
          trigger: {
            player: ["dying"],
          },
          unique: true,
          forced: true,
          skillAnimation: true,
          animationStr: "禅让",
          animationColor: "orange",
          zhuSkill: true,
          filter: function (event, player) {
            return player.hasZhuSkill('PSshanrang');
          },
          content: function () {
            'step 0'
            player.draw(2);
            'step 1'
            var num = game.countPlayer(function (current) {
              return player != current && current.countCards('h') > 0;
            });
            if (num == 0) player.chooseTarget('禅让：选择一名角色进行“禅让”仪式', true, function (card, player, target) {
              return player != target;
            }).set("ai", function (target) {
              var player = _status.event.player;
              var eff = -get.attitude(player, target) - get.attitude(player, player);
              return eff;

            });
            else event.goto(3);
            'step 2'
            if (result.bool) {
              event.target = result.targets[0];
              event.bool = true;
              event.goto(5);
            }
            'step 3'
            player.chooseTarget('禅让：选择一名角色进行拼点', true, function (card, player, target) {
              return player.canCompare(target);
            }).set("ai", function (target) {
              var player = _status.event.player;
              var eff = -get.attitude(player, target) - get.attitude(player, player);
              var playerExpect = ((_status.event.num - 1) / 13) ** target.countCards('h');
              eff += 2 * playerExpect * (get.attitude(player, player)) + 2 * (1 - playerExpect) * (get.attitude(player, target)) + 1;
              return eff;

            }).set("num", num);
            'step 4'
            if (result.bool) {
              event.target = result.targets[0];
              player.chooseToCompare(event.target);
            }
            'step 5'
            if (result.bool || event.bool) {
              var target = event.target, skills = ['PSshengshi', 'PSluanshi', 'PSshanrang'];
              for (var i of skills) {
                target.addSkill(i);
              }
              target.storage.zhuSkill_PSshanrang = 'PSshanrang';
              target.identity = 'zhu';
              target.setIdentity('zhu');
              target.identityShown = true;
              game.zhu = target;
              game.zhu.update();
              player.die();
            }
            else {
              var targets = game.filterPlayer();
              for (var i = 0; i < targets.length; i++) {
                targets[i].loseHp();
                game.delay();
              }
              player.die();
            }
          },
          ai: {
            threaten: 3,
          },
        },

        PSyufeng: {
          audio: "yufeng",
          enable: "phaseUse",
          usable: 2,
          filter: function (event, player) {
            return game.roundNumber > 0;
          },
          content: function () {
            'step 0'
            event.videoId = lib.status.videoId++;
            var func = function (player, id) {
              var list = [
                '选项一：令一名角色摸五张牌，再将手牌弃置至体力上限数',
                '选项二：选择两名角色调换座次',
                '选项三：摸两张牌',
                '选项四：选择至多三名角色各弃置其两张牌',
              ];
              var num = Math.min(4, game.roundNumber);
              var choiceList = ui.create.dialog('御风：请选择一' + (game.roundNumber > 1 ? ('至' + get.cnNumber(num)) : '') + '项');
              choiceList.videoId = id;
              for (var i = 0; i < list.length; i++) {
                var str = '<div class="popup text" style="width:calc(100% - 10px);display:inline-block">';
                str += list[i];
                str += '</div>';
                var next = choiceList.add(str);
                next.firstChild.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', ui.click.button);
                next.firstChild.link = i;
                for (var j in lib.element.button) {
                  next[j] = lib.element.button[j];
                }
                choiceList.buttons.add(next.firstChild);
              }
              return choiceList;
            };
            if (player.isOnline2()) {
              player.send(func, player, event.videoId);
            }
            event.dialog = func(player, event.videoId);
            if (player != game.me || _status.auto) {
              event.dialog.style.display = 'none';
            }
            var next = player.chooseButton();
            next.set('dialog', event.videoId);
            next.set('forced', true);
            next.set('ai', function (button) {
              var player = _status.event.player;
              switch (button.link) {
                case 0:
                  return 2;
                  break;
                case 1:
                  return Math.max(0.5, player.countCards('hs', function (card) {
                    return get.name(card) == 'sha' && player.hasValueTarget(card);
                  }) - player.getCardUsable({ name: 'sha' })) + Math.max.apply(Math, game.filterPlayer(function (current) {
                    return current != player;
                  }).map(function (target) {
                    return get.damageEffect(target, player, player);
                  }));
                  break;
                case 2:
                  return player.needsToDiscard() / 4;
                  break;
                case 3:
                  var num = 0;
                  return 0.8 * Math.max.apply(Math, game.filterPlayer(function (current) {
                    return current != player && current.hasCard((card) => lib.filter.canBeGained(card, current, player), 'hej');
                  }).map(function (target) {
                    return get.effect(target, { name: 'shunshou_copy' }, player, player);
                  }));
                  break;

              }
            });
            if (game.roundNumber > 1) next.set('selectButton', [1, game.roundNumber]);
            'step 1'
            if (player.isOnline2()) {
              player.send('closeDialog', event.videoId);
            }
            event.dialog.close();
            result.links.sort();
            for (var i of result.links) game.log(player, '选择了', '#g【御风】', '的', '#y选项' + get.cnNumber(1 + i, true))
            event.links = result.links;
            var count = -1;
            event.count = count;
            'step 2'
            event.count++;
            switch (event.links[event.count]) {
              case 0:
                event.goto(3);
                break;
              case 1:
                event.goto(6);
                break;
              case 2:
                event.goto(8);
                break;
              case 3:
                event.goto(9);
                break;
              default:
                event.finish();
            }
            'step 3'
            player.chooseTarget('御风：令一名角色摸五张牌，再将手牌弃置至其体力上限数', false).set('ai', function (target) {
              var att = get.attitude(_status.event.player, target);
              var draw = 5 - target.countCards('h');
              if (draw >= 0) {
                if (target.hasSkillTag('nogain')) att /= 6;
                if (att > 2) {
                  return Math.sqrt(draw + 1) * att;
                }
                return att / 3;
              }
              if (draw < -1) {
                if (target.hasSkillTag('nogain')) att *= 6;
                if (att < -2) {
                  return -Math.sqrt(1 - draw) * att;
                }
              }
              return 0;
            });
            'step 4'
            if (result.bool) {
              var target = result.targets[0];
              event.target = target;
              target.draw(5);
            }
            else {
              event.goto(2);
            }
            'step 5'
            var num = target.countCards('h') - target.maxHp;
            if (num > 0) target.chooseToDiscard('h', true, num);
            event.goto(2);
            'step 6'
            player.chooseTarget(2, '选择两名角色，交换座次', false, function (card, player, target) {
              return true;
            }).set('ai', function (target) {
              var player = _status.event.player;
              var att = get.attitude(player, target);
              if (att < 0) {
                return att - 1;
              }
              return att;
            }).set('targetprompt', ['', '']);
            'step 7'
            if (result.targets) {
              var targets = result.targets;
              game.broadcastAll(function (target1, target2) {
                game.swapSeat(target1, target2);
              }, targets[0], targets[1]);
              event.goto(2);
            } else {
              event.goto(2);
            }
            'step 8'
            player.draw(2);
            event.goto(2);
            'step 9'
            player.chooseTarget([1, 3], '弃置至多三名角色各两张牌', false, function (card, player, target) {
              return true;
            }).set('ai', function (target) {
              var player = _status.event.player;
              var att = get.attitude(player, target);
              if (att < 0) {
                return att - 1;
              }
              return att;
            });
            'step 10'
            if (result.targets) {
              var targets = result.targets;
              for (var i of targets) {
                if (i.countCards('he') > 0) {
                  player.discardPlayerCard('he', i, [1, 2], true);
                }
              }
            } else {
              event.finish();
            }
          },
          group: "PSyufeng_change",
          subSkill: {
            change: {
              audio: "yufeng",
              trigger: {
                player: "changeHp",
              },
              prompt: "是否发动【御风】？",
              content: function () {
                'step 0'
                event.videoId = lib.status.videoId++;
                var func = function (player, id) {
                  var list = [
                    '选项一：令一名角色摸五张牌，再将手牌弃置至体力上限数',
                    '选项二：选择两名角色调换座次',
                    '选项三：摸两张牌',
                    '选项四：选择至多三名角色各弃置其两张牌',
                  ];
                  var choiceList = ui.create.dialog('御风：请选择一项发动两次');
                  choiceList.videoId = id;
                  for (var i = 0; i < list.length; i++) {
                    var str = '<div class="popup text" style="width:calc(100% - 10px);display:inline-block">';
                    str += list[i];
                    str += '</div>';
                    var next = choiceList.add(str);
                    next.firstChild.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', ui.click.button);
                    next.firstChild.link = i;
                    for (var j in lib.element.button) {
                      next[j] = lib.element.button[j];
                    }
                    choiceList.buttons.add(next.firstChild);
                  }
                  return choiceList;
                };
                if (player.isOnline2()) {
                  player.send(func, player, event.videoId);
                }
                event.dialog = func(player, event.videoId);
                if (player != game.me || _status.auto) {
                  event.dialog.style.display = 'none';
                }
                var next = player.chooseButton();
                next.set('dialog', event.videoId);
                next.set('forced', true);
                next.set('ai', function (button) {
                  var player = _status.event.player;
                  switch (button.link) {
                    case 0:
                      return 2;
                      break;
                    case 1:
                      return Math.max(0.5, player.countCards('hs', function (card) {
                        return get.name(card) == 'sha' && player.hasValueTarget(card);
                      }) - player.getCardUsable({ name: 'sha' })) + Math.max.apply(Math, game.filterPlayer(function (current) {
                        return current != player;
                      }).map(function (target) {
                        return get.damageEffect(target, player, player);
                      }));
                      break;
                    case 2:
                      return player.needsToDiscard() / 4;
                      break;
                    case 3:
                      var num = 0;
                      return 0.8 * Math.max.apply(Math, game.filterPlayer(function (current) {
                        return current != player && current.hasCard((card) => lib.filter.canBeGained(card, current, player), 'hej');
                      }).map(function (target) {
                        return get.effect(target, { name: 'shunshou_copy' }, player, player);
                      }));
                      break;

                  }
                });
                'step 1'
                if (player.isOnline2()) {
                  player.send('closeDialog', event.videoId);
                }
                event.dialog.close();
                result.links.sort();
                for (var i of result.links) game.log(player, '选择了', '#g【御风】', '的', '#y选项' + get.cnNumber(1 + i, true))
                event.links = result.links;
                event.links.sort();
                var count = 0;
                event.count = count;
                'step 2'
                event.count++;
                if (event.count > 2 || !player.isAlive()) event.finish();
                switch (event.links[0]) {
                  case 0:
                    event.goto(3);
                    break;
                  case 1:
                    event.goto(6);
                    break;
                  case 2:
                    event.goto(8);
                    break;
                  case 3:
                    event.goto(9);
                    break;
                  default:
                    event.finish();
                }
                'step 3'
                player.chooseTarget('御风：令一名角色摸五张牌，再将手牌弃置至其体力上限数', false).set('ai', function (target) {
                  var att = get.attitude(_status.event.player, target);
                  var draw = 5 - target.countCards('h');
                  if (draw >= 0) {
                    if (target.hasSkillTag('nogain')) att /= 6;
                    if (att > 2) {
                      return Math.sqrt(draw + 1) * att;
                    }
                    return att / 3;
                  }
                  if (draw < -1) {
                    if (target.hasSkillTag('nogain')) att *= 6;
                    if (att < -2) {
                      return -Math.sqrt(1 - draw) * att;
                    }
                  }
                  return 0;
                });
                'step 4'
                if (result.bool) {
                  var target = result.targets[0];
                  event.target = target;
                  target.draw(5);
                }
                else {
                  event.goto(2);
                }
                'step 5'
                var num = target.countCards('h') - target.maxHp;
                if (num > 0) target.chooseToDiscard('h', true, num);
                event.goto(2);
                'step 6'
                player.chooseTarget(2, '选择两名角色，交换座次', false, function (card, player, target) {
                  return true;
                }).set('ai', function (target) {
                  var player = _status.event.player;
                  var att = get.attitude(player, target);
                  if (att < 0) {
                    return att - 1;
                  }
                  return att;
                }).set('targetprompt', ['', '']);
                'step 7'
                if (result.targets) {
                  var targets = result.targets;
                  game.broadcastAll(function (target1, target2) {
                    game.swapSeat(target1, target2);
                  }, targets[0], targets[1]);
                  event.goto(2);
                } else {
                  event.goto(2);
                }
                'step 8'
                player.draw(2);
                event.goto(2);
                'step 9'
                player.chooseTarget([1, 3], '弃置至多三名角色各两张牌', false, function (card, player, target) {
                  return true;
                }).set('ai', function (target) {
                  var player = _status.event.player;
                  var att = get.attitude(player, target);
                  if (att < 0) {
                    return att - 1;
                  }
                  return att;
                });
                'step 10'
                if (result.targets) {
                  var targets = result.targets;
                  for (var i of targets) {
                    if (i.countCards('he') > 0) {
                      player.discardPlayerCard('he', i, [1, 2], true);
                    }
                  }
                  event.goto(2);
                } else {
                  event.goto(2);
                }
              },
              sub: true,
            },
          },
        },
        PStianshu: {
          audio: "tianshu",
          equipSkill: false,
          noHidden: true,
          inherit: "taipingyaoshu",
          derivation: "taipingyaoshu",
          mod: {
            maxHandcard: function (player, num) {
              if (get.mode() == 'guozhan') {
                return num + game.countPlayer(function (current) {
                  return current.isFriendOf(player);
                });
              }
              return num + game.countGroup() - 1;
            },
          },
          trigger: {
            player: "damageBegin4",
          },
          filter: function (event, player) {
            if (!lib.skill.taipingyaoshu.filter.apply(this, arguments)) return false;
            if (player.hasSkillTag('unequip2')) return false;
            if (event.source && event.source.hasSkillTag('unequip', false, {
              name: event.card ? event.card.name : null,
              target: player,
              card: event.card
            })) return false;
            if (event.nature) return true;
          },
          forced: true,
          content: function () {
            trigger.cancel();
          },
          ai: {
            nofire: true,
            nothunder: true,
            effect: {
              target: function (card, player, target, current) {

                if (target.hasSkillTag('unequip2')) return;
                if (player.hasSkillTag('unequip', false, {
                  name: card ? card.name : null,
                  target: target,
                  card: card
                }) || player.hasSkillTag('unequip_ai', false, {
                  name: card ? card.name : null,
                  target: target,
                  card: card
                })) return;
                if (get.tag(card, 'natureDamage')) return 'zerotarget';
                if (card.name == 'tiesuo') {
                  return [0, 0];
                }
              },
            },
          },
        },
        PSyinshi: {
          trigger: {
            player: ["phaseZhunbeiBefore", "phaseJieshuBefore"],
          },
          forced: true,
          audio: "ext:PS武将/audio/skill:2",
          group: "xinfu_pdgyingshi2",
          content: function () {
            trigger.cancel();
            game.log(player, '跳过了', event.triggername == 'phaseZhunbeiBefore' ? '准备阶段' : '结束阶段');
          },
        },
        PSshenwu: {
          init: function (player) {
            lib.card.tao.enable = function (card, player) {
              if (player.hasSkill('PSshenwu')) return game.hasPlayer(function (current) {
                return current.isDamaged();
              });
              return player.hp < player.maxHp;
            };
            lib.card.tao.selectTarget = function (card, player, target) {
              if (player.hasSkill('PSshenwu')) return 1;
              return -1;
            };
            lib.card.tao.filterTarget = function (card, player, target) {
              if (player.hasSkill('PSshenwu')) return target.hp < target.maxHp;
              return target == player && target.hp < target.maxHp;
            };
          },
          mod: {
            cardname: function (card, player, name) {
              if (get.suit(card) == 'heart') return 'tao';
            },
          },
          ai: {
            nokeep: true,
            basic: {
              order: function (card, player) {
                if (player.hasSkillTag('pretao')) return 5;
                return 2;
              },
              useful: [6.5, 4, 3, 2],
              value: [6.5, 4, 3, 2],
            },
            result: {
              target: 2,
              "target_use": function (player, target) {
                // if(player==target&&player.hp<=0) return 2;
                if (player.hasSkillTag('nokeep', true, null, true)) return 2;
                var nd = player.needsToDiscard();
                var keep = false;
                if (nd <= 0) {
                  keep = true;
                }
                else if (nd == 1 && target.hp >= 2 && target.countCards('h', 'tao') <= 1) {
                  keep = true;
                }
                var mode = get.mode();
                if (target.hp >= 2 && keep && target.hasFriend()) {
                  if (target.hp > 2 || nd == 0) return 0;
                  if (target.hp == 2) {
                    if (game.hasPlayer(function (current) {
                      if (target != current && get.attitude(target, current) >= 3) {
                        if (current.hp <= 1) return true;
                        if ((mode == 'identity' || mode == 'versus' || mode == 'chess') && current.identity == 'zhu' && current.hp <= 2) return true;
                      }
                    })) {
                      return 0;
                    }
                  }
                }
                if (target.hp < 0 && target != player && target.identity != 'zhu') return 0;
                var att = get.attitude(player, target);
                if (att < 3 && att >= 0 && player != target) return 0;
                var tri = _status.event.getTrigger();
                if (mode == 'identity' && player.identity == 'fan' && target.identity == 'fan') {
                  if (tri && tri.name == 'dying' && tri.source && tri.source.identity == 'fan' && tri.source != target) {
                    var num = game.countPlayer(function (current) {
                      if (current.identity == 'fan') {
                        return current.countCards('h', 'tao');
                      }
                    });
                    if (num > 1 && player == target) return 2;
                    return 0;
                  }
                }
                if (mode == 'identity' && player.identity == 'zhu' && target.identity == 'nei') {
                  if (tri && tri.name == 'dying' && tri.source && tri.source.identity == 'zhong') {
                    return 0;
                  }
                }
                if (mode == 'stone' && target.isMin() &&
                  player != target && tri && tri.name == 'dying' && player.side == target.side &&
                  tri.source != target.getEnemy()) {
                  return 0;
                }
                return 2;
              },
            },
            tag: {
              recover: 1,
            },
          },
        },
        PShunwu: {
          audio: "ext:PS武将/audio/skill:1",
          trigger: {
            player: "recoverAfter",
          },
          filter: function (event, player) {
            return !player.isDamaged() && game.dead.length > 0;;
          },
          content: function () {
            "step 0"
            player.judge(function (card) {
              if (['sha', 'juedou', 'nanman', 'wanjian', 'huogong'].contains(card.name)) return 10;
              return -10;
            }).judge2 = function (result) {
              return result.bool == false ? true : false;
            };
            "step 1"
            if (!result.bool) {
              player.chooseTarget('复活一名已死亡角色').set('filterTarget', function (card, player, target) {
                if (target.isAlive()) return false;
                return true;
              }).set('deadTarget', true).set('ai', function (target) {
                var player = _status.event.player;
                return get.attitude(player, target)
              });
            }
            'step 2'
            if (result.targets) {
              var target = result.targets[0];
              target.revive();
              target.recover(target.maxHp - target.hp);
            }
          },
        },
        PSqiangzhi: {
          audio: "qiangzhi",
          trigger: {
            player: "phaseUseBegin",
          },
          direct: true,
          filter: function (event, player) {
            return game.hasPlayer(function (current) {
              return current != player && current.countCards('h') > 0;
            });
          },
          subfrequent: ["draw"],
          content: function () {
            'step 0'
            player.chooseTarget(get.prompt2('qiangzhi'), function (card, player, target) {
              return target != player && target.countCards('h') > 0;
            }).set('ai', function () {
              return Math.random();
            });
            'step 1'
            if (result.bool) {
              var target = result.targets[0];
              player.logSkill('qiangzhi', target);
              player.choosePlayerCard(target, 'h', true, 'visible');
            }
            else event.finish();
            'step 2'
            var card = result.cards[0];
            player.showCards(card);
            player.storage.PSqiangzhi_draw = get.type(card, 'trick');
            game.addVideo('storage', player, ['PSqiangzhi_draw', player.storage.PSqiangzhi_draw]);
            player.addTempSkill('PSqiangzhi_draw', 'phaseUseEnd');
          },
          subSkill: {
            draw: {
              trigger: {
                player: "useCard",
              },
              frequent: true,
              popup: false,
              charlotte: true,
              prompt: "是否执行【强识】的效果摸一张牌？",
              filter: function (event, player) {
                return get.type(event.card, 'trick') == player.storage.PSqiangzhi_draw;
              },
              content: function () {
                player.draw();
                player.logSkill('qiangzhi');
              },
              onremove: true,
              mark: true,
              intro: {
                content: function (type) {
                  return get.translation(type) + '牌';
                },
              },
              sub: true,
            },
          },
        },
        PSxiantu: {
          audio: "xiantu1",
          group: "xiantu2",
          trigger: {
            global: "phaseUseBegin",
          },
          filter: function (event, player) {
            return event.player != player;
          },
          logTarget: "player",
          check: function (event, player) {

            if (player.maxHp - player.hp >= 2) return false;
            if (player.hp == 1) return false;
            if (player.hp == 2 && player.countCards('h') < 2) return false;

            return true;
          },
          content: function () {
            "step 0"
            player.draw(2);
            "step 1"
            player.chooseCard(1, 'he', true, '交给' + get.translation(trigger.player) + '一张牌').set('ai', function (card) {
              if (ui.selected.cards.length && card.name == ui.selected.cards[0].name) return -1;
              if (get.tag(card, 'damage')) return 1;
              if (get.type(card) == 'equip') return 1;
              return 0;
            });
            "step 2"
            player.give(result.cards, trigger.player);
            player.gainPlayerCard(2, 'he', trigger.player, false, 'visible');
            trigger.player.addSkill('xiantu4');
            trigger.player.storage.xiantu4.push(player);
          },
          ai: {
            threaten: 1.1,
            expose: 0.3,
          },
        },
        PShengzhi: {
          audio: "rezhiheng",
          audioname: ["shen_caopi"],
          enable: "phaseUse",
          discard: false,
          lose: false,
          delay: false,
          filter: function (card, player) {
            var num = 0;
            var count = Math.max(1, player.getDamagedHp());
            num = player.countCards('he');
            if (num == 0) return false;
            if (player.countSkill('PShengzhi') >= count) return false;
            return true;
          },
          content: function () {
            'step 0'
            var num = 0;
            num = player.countCards('he');
            if (num == 0) event.finish();
            player.draw(num);
            player.chooseToDiscard(num, 'he', true, '衡制：请弃置' + get.cnNumber(num) + '张牌');
          },
          ai: {
            threaten: 1,
            order: 15,
            result: {
              player: 1,
            },
          },
        },
        PSnengwan: {
          audio: "PShuiwan",
          trigger: {
            player: ["phaseDrawSkipped", "phaseDrawCancelled", "phaseUseSkipped", "phaseUseCancelled"],
          },
          forced: true,
          content: function () {
            var str = (["phaseDrawSkipped", "phaseDrawCancelled"].contains(event.triggername)) ? '摸牌阶段' : '出牌阶段';
            game.log(player, '恢复了', str);
            player[trigger.name]();
          },
        },
        PSzailaiyici: {
          audio: "tongli",
          trigger: {
            global: "useCardToPlayered",
          },
          "prompt2": function (event, player) {
            return '令' + get.translation(event.player) + "的" + get.translation(event.card) + "额外结算";
          },
          check: function (event, player) {
            return get.attitude(player, event.player) > 0 && !get.tag(event.card, 'norepeat');
          },
          filter: function (event, player) {
            if (event.parent.name == 'PSzailaiyici') return false;
            if (!event.targets || !event.card) return false;
            var type = get.type(event.card);
            if (type != 'basic' && type != 'trick') return false;
            if (['shan', 'wuxie'].contains(event.card.name)) return false;
            var card = game.createCard(event.card.name, event.card.suit, event.card.number);
            for (var i = 0; i < event.targets.length; i++) {
              if (!event.targets[i].isAlive()) return false;
              if (!event.player.canUse({ name: event.card.name }, event.targets[i], false, false)) {
                return false;
              }
            }
            return true;
          },
          content: function () {
            trigger.getParent().effectCount++;
          },
          ai: {
            threaten: 2,
          },
        },
        PSweizhen: {
          mod: {
            targetInRange: function (card, player, target) {
              var info = lib.skill.PSweizhen.getInfo(player);
              if (card.name == 'sha' && get.color(card) == 'red') {
                if (get.distance(player, target) <= 1 + info[0]) return true;
              }
            },
            selectTarget: function (card, player, range) {
              var info = lib.skill.PSweizhen.getInfo(player);
              if (card.name == 'sha' && get.color(card) == 'red' && range[1] != -1) {
                range[1] += info[2];
              }
            },
            cardUsable: function (card, player, num) {
              var info = lib.skill.PSweizhen.getInfo(player);
              if (card.name == 'sha' && (get.color(card) == 'red' || get.color(card) == 'none')) return num += info[3];

            },
          },
          init: function (player) {
            if (!player.storage.PSweizhen) player.storage.PSweizhen = [0, 0, 0, 0, 0];
          },
          getInfo: function (player) {
            if (!player.storage.PSweizhen) player.storage.PSweizhen = [0, 0, 0, 0, 0];
            return player.storage.PSweizhen;
          },
          mark: true,
          intro: {
            content: function (storage, player) {
              var info = lib.skill.PSweizhen.getInfo(player);
              return '<div class="text center"><span class=thundertext>距离：' + info[0] + '</span>　<span class=firetext>伤害：' + info[1] + '</span><br><span class=greentext>目标：' + info[2] + '</span>　<span class=bluetext>次数：' + info[3] + '</span><br><span class=whitetext>强命：' + info[4] + '</span></div>'
            },
          },
          audio: "ext:PS武将/audio/skill:4",
          trigger: {
            source: "damageBegin1",
          },
          filter: function (event) {
            return event.card && event.card.name == 'sha' && get.color(event.card) == 'red' && event.notLink();
          },
          direct: true,
          priority: -1,
          content: function () {
            var info = lib.skill.PSweizhen.getInfo(_status.event.player);
            trigger.num += info[1];
          },
          ai: {
            damageBonus: true,
          },
          group: ["PSweizhen_hit", "PSweizhen_add", "PSweizhen_chongzhu"],
          subSkill: {
            hit: {
              audio: 2,
              shaRelated: true,
              trigger: {
                player: "useCardToPlayered",
              },
              filter: function (event, player) {
                var info = lib.skill.PSweizhen.getInfo(player);
                if (info[4] <= 0) return false;
                if (!event.card || event.card.name != 'sha' && get.color(event.card) != 'red') return false;
                return player.getHistory('useCard', function (evt) {
                  return get.name(evt.card) == 'sha' && get.color(evt.card) == 'red';
                }).length <= info[4];
              },
              forced: true,
              logTarget: "target",
              content: function () {
                trigger.getParent().directHit.add(trigger.target);
              },
              ai: {
                "directHit_ai": true,
                skillTagFilter: function (player, tag, arg) {
                  var info = lib.skill.PSweizhen.getInfo(player);
                  if (info[4] <= 0) return false;
                  if (!event.card || event.card.name != 'sha' && get.color(event.card) != 'red') return false;
                  return player.getHistory('useCard', function (evt) {
                    return get.name(evt.card) == 'sha' && get.color(evt.card) == 'red';
                  }).length <= info[4];
                },
              },
              sub: true,
            },
            discard: {
              audio: 2,
              trigger: {
                source: "damageAfter",
              },
              logTarget: "event.player",
              "prompt2": function (event, player) {
                var info = lib.skill.PSweizhen.getInfo(_status.event.player);
                return "弃置" + get.translation(event.player) + "一" + (info[4] > 1 ? "至" + get.cnNumber(info[4]) : "") + "张牌";
              },
              filter: function (event, player) {
                var info = lib.skill.PSweizhen.getInfo(_status.event.player);
                if (info[4] <= 0) return false;
                if (!event.player.isAlive() || event.player.countCards('he') == 0) return false;
                return event.card && event.card.name == 'sha' && get.color(event.card) == 'red';
              },
              check: function (event, player) {
                return get.attitude(player, event.player) <= 0;
              },
              content: function () {
                var info = lib.skill.PSweizhen.getInfo(_status.event.player);
                player.discardPlayerCard('he', trigger.player, [1, info[4]], false);
              },
              sub: true,
            },
            add: {
              audio: 2,
              trigger: {
                player: ["phaseZhunbeiBegin", "phaseJieshuBegin"],
                global: "damageSource",
              },
              priority: 10,
              direct: true,
              filter: function (event, player) {
                if (event.name == 'damage') {
                  if (lib.skill.PSweizhen.getInfo(player) == [5, 5, 5, 5, 5]) return false;
                  return event.card && event.card.name == 'sha' && get.color(event.card) == 'red';
                }
                else return true;
              },
              content: function () {
                'step 0'
                event.num = trigger.num;
                'step 1'
                event.num--;
                var list = lib.skill.PSweizhen.getInfo(_status.event.player);
                var slist = ['距离(' + list[0] + ')', '伤害(' + list[1] + ')', '目标(' + list[2] + ')', '次数(' + list[3] + ')', '强命(' + list[4] + ')', 'cancel2'];
                player.chooseControl(slist).set('prompt', get.prompt('PSweizhen')).set('prompt2', '令〖威震〗中的一个数字+1').set('ai', function () {
                  var player = _status.event.player, info = lib.skill.PSweizhen.getInfo(player);
                  if (info[0] < info[3] && game.countPlayer(function (current) {
                    return get.distance(player, current) <= info[0];
                  }) < Math.min(3, game.countPlayer())) return 0;
                  if (info[3] < info[1] - 1) return 3;
                  if (info[1] < 5) return 1;
                  if (info[0] < 5 && game.hasPlayer(function (current) {
                    return current != player && get.distance(player, current) > info[0];
                  })) return 0;
                  return 2;
                });
                'step 2'
                if (result.control != 'cancel2') {
                  player.logSkill('PSweizhen');
                  var list = lib.skill.PSweizhen.getInfo(player);
                  list[result.index] = Math.min(5, list[result.index] + 1);
                  game.log(player, '将', result.control, '数字改为', '#y' + list[result.index])
                  player.markSkill('PSweizhen');
                  game.log(trigger.name);
                }
                if (event.num > 0) event.goto(1);
              },
              sub: true,
            },
            chongzhu: {
              audio: "danji",
              enable: "phaseUse",
              filterCard: (card, player) => get.color(card) == 'black' && player.canRecast(card),
              filter: function (card, player) {
                return player.countCards('he', function (card, player) {
                  return get.color(card) == 'black';
                }) > 0;
              },
              position: "he",
              selectCard: [1, Infinity],
              prompt: "请选择要重铸的牌",
              discard: false,
              lose: false,
              delay: false,
              content: function () {
                player.recast(cards);
              },
              sub: true,
            },
          },
        },
        PSjuejing: {
          mod: {
            maxHandcard: function (player, num) {
              return 2 + num;
            },
          },
          audio: "xinjuejing",
          trigger: {
            player: "loseAfter",
            global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
          },
          forced: true,
          filter: function (event, player) {
            if (event.name == 'gain' && event.player == player) return false;
            var evt = event.getl(player);
            return evt && evt.hs && evt.hs.length;
          },
          content: function () {
            player.draw();
          },
        },
        PSfuzhi: {
          audio: "tongli",
          trigger: {
            global: "useCardAfter",
          },
          filter: function (event, player, name) {
            if (event.getParent(2).name == 'PSfuzhi') return false;
            if (!event.card || event.card.length == 0) return false;
            var type = get.type(event.card);

            if (['shan', 'wuxie'].contains(event.card.name)) return false;
            return game.findPlayer2(target => {
              var info = lib.card[event.card.name];
              if (info.autoViewAs) {
                if (player.canUse({ card: event.card, name: info.autoViewAs }, target, false)) return true;
              }
              else if (player.canUse(event.card, target, false)) return true;
              return false;
            });
          },
          direct: true,
          content: function () {
            'step 0'
            var createCard = game.createCard2(trigger.card);
            var info = lib.card[createCard.name];
            if (info.autoViewAs) player.chooseUseTarget([createCard], { name: info.autoViewAs }, false);
            else player.chooseUseTarget(createCard, false);
            'step 1'
            if (result.targets) player.logSkill('PSfuzhi');
          },
        },
        PStongli: {
          audio: "tongli",
          trigger: {
            player: "useCardToPlayered",
          },
          filter: function (event, player) {
            if (!event.isFirstTarget || (event.card.storage && event.card.storage.PStongli)) return false;
            var type = get.type(event.card);
            if (type != 'basic' && type != 'trick') return false;
            var hs = player.getCards('h');
            if (!hs.length) return false;
            var evt = event.getParent('phaseUse');
            if (!evt || evt.player != player) return false;
            var num1 = player.getHistory('useCard', function (evtx) {
              if (evtx.getParent('phaseUse') != evt) return false;
              return !evtx.card.storage || !evtx.card.storage.PStongli;
            }).length;
            return player.countCards('h') > 0;
          },
          "prompt2": function (event, player) {
            var evt = event.getParent('phaseUse');
            var num = player.getHistory('useCard', function (evtx) {
              if (evtx.getParent('phaseUse') != evt) return false;
              return !evtx.card.storage || !evtx.card.storage.PStongli;
            }).length;
            return '令' + get.translation(event.card) + '额外结算' + get.cnNumber(player.countCards('h')) + '次';
          },
          check: function (event, player) {
            return !get.tag(event.card, 'norepeat')
          },
          content: function () {
            var num = player.countCards('h');
            game.log(trigger.card, '额外结算', get.cnNumber(num), '次');
            trigger.getParent().effectCount += num;
          },
        },
        PSlianhuo: {
          audio: "lianhuo",
          trigger: {
            player: "damageBegin3",
          },
          forced: true,
          filter: function (event, player) {
            return player.isLinked() && event.notLink() && event.nature == 'fire';
          },
          content: function () {
            var num = game.countPlayer(current => current.isLinked());
            trigger.num += num;
          },
          group: "PSlianhuo_source",
          subSkill: {
            source: {
              trigger: {
                global: "damageBegin3",
              },
              filter: function (event, player) {
                return event.player != player && player.isLinked() && event.player.isLinked() && event.nature;
              },
              direct: true,
              content: function () {
                player.logSkill('PSlianhuo', trigger.player);
                trigger.player = player;
              },
              sub: true,
            },
          },
        },
        PSyuqi: {
          audio: "ext:PS武将/audio/skill:2",
          trigger: {
            global: "damageEnd",
          },
          init: function (player) {
            if (!player.storage.PSyuqi) player.storage.PSyuqi = [0, 3, 1, 1];
          },
          getInfo: function (player) {
            if (!player.storage.PSyuqi) player.storage.PSyuqi = [0, 3, 1, 1];
            return player.storage.PSyuqi;
          },
          onremove: true,
          usable: 3,
          filter: function (event, player) {
            var list = lib.skill.PSyuqi.getInfo(player);
            return event.player.isIn() && get.distance(player, event.player) <= list[0];
          },
          logTarget: "player",
          content: function () {
            'step 0'
            event.list = lib.skill.PSyuqi.getInfo(player);
            var cards = get.cards(event.list[1]);
            event.cards = cards;
            game.cardsGotoOrdering(cards);
            var next = player.chooseToMove(true, '隅泣（若对话框显示不完整，可下滑操作）');
            next.set('list', [
              ['牌堆顶的牌', cards],
              ['交给' + get.translation(trigger.player) + '（至少一张' + (event.list[2] > 1 ? ('，至多' + get.cnNumber(event.list[2]) + '张') : '') + '）'],
              ['交给自己（至多' + get.cnNumber(event.list[3]) + '张）'],
            ]);
            next.set('filterMove', function (from, to, moved) {
              var info = lib.skill.PSyuqi.getInfo(_status.event.player);
              if (to == 1) return moved[1].length < info[2];
              if (to == 2) return moved[2].length < info[3];
              return true;
            });
            next.set('processAI', function (list) {
              var cards = list[0][1].slice(0).sort(function (a, b) {
                return get.value(b, 'raw') - get.value(a, 'raw');
              }), player = _status.event.player, target = _status.event.getTrigger().player;
              var info = lib.skill.PSyuqi.getInfo(_status.event.player);
              var cards1 = cards.splice(0, Math.min(info[3], cards.length - 1));
              var card2;
              if (get.attitude(player, target) > 0) card2 = cards.shift();
              else card2 = cards.pop();
              return [cards, [card2], cards1];
            });
            next.set('filterOk', function (moved) {
              return moved[1].length > 0;
            });
            'step 1'
            if (result.bool) {
              var moved = result.moved;
              cards.removeArray(moved[1]);
              cards.removeArray(moved[2]);
              while (cards.length) {
                ui.cardPile.insertBefore(cards.pop().fix(), ui.cardPile.firstChild);
              }
              var list = [[trigger.player, moved[1]]];
              if (moved[2].length) list.push([player, moved[2]]);
              game.loseAsync({
                gain_list: list,
                giver: player,
                animate: 'gain2',
              }).setContent('gaincardMultiple');
            }
          },
          mark: true,
          intro: {
            content: function (storage, player) {
              var info = lib.skill.PSyuqi.getInfo(player);
              return '<div class="text center"><span class=thundertext>蓝色：' + info[0] + '</span>　<span class=firetext>红色：' + info[1] + '</span><br><span class=greentext>绿色：' + info[2] + '</span>　<span class=yellowtext>黄色：' + info[3] + '</span></div>'
            },
          },
          ai: {
            threaten: 8.8,
          },
        },
        PSshanshen: {
          audio: "ext:PS武将/audio/skill:2",
          trigger: {
            global: "die",
          },
          direct: true,
          content: function () {
            'step 0'
            event.goon = !player.hasAllHistory('sourceDamage', function (evt) {
              return evt.player == trigger.player;
            });
            var list = lib.skill.PSyuqi.getInfo(player);
            player.chooseControl('确定', 'cancel2').set('prompt', get.prompt('PSshanshen')).set('prompt2', '令〖隅泣〗中的所有数字+2' + (event.goon ? '并回复1点体力' : '')).set('ai', function () {
              return 0;
            });
            'step 1'
            if (result.control != 'cancel2') {
              player.logSkill('PSshanshen', trigger.player);
              var list = lib.skill.PSyuqi.getInfo(player);
              for (var i = 0; i < list.length; i++) {
                list[i] += 2;
              }
              game.log(player, '将〖隅泣〗中的所有数字+', '#y' + 2);
              player.markSkill('PSyuqi');
              if (event.goon) player.recover();
            }
          },
        },
        PSxianjing: {
          audio: "ext:PS武将/audio/skill:2",
          trigger: {
            player: "phaseZhunbeiBegin",
          },
          direct: true,
          content: function () {
            'step 0'
            var list = lib.skill.PSyuqi.getInfo(player);
            player.chooseControl('确定', 'cancel2').set('prompt', '是否令〖隅泣〗中的所有数字+1？').set('ai', function () {
              return 0;
            });
            'step 1'
            if (result.control != 'cancel2') {
              player.logSkill('PSxianjing');
              var list = lib.skill.PSyuqi.getInfo(player);
              for (var i = 0; i < list.length; i++) {
                list[i]++;
              }
              game.log(player, '将〖隅泣〗中的所有数字+', '#y' + 1);
              player.markSkill('PSyuqi');
            }
          },
        },
        PShuwei: {
          audio: "ext:PS武将/audio/skill:2",
          trigger: {
            player: ["phaseBefore", "changeHp"],
          },
          forced: true,
          popup: false,
          init: function (player) {
            if (game.online) return;
            player.removeAdditionalSkill('PShuwei');
            var list = [];
            if (player.hp <= 4) {
              list.push('new_yajiao');
            }
            if (player.hp <= 3) {
              list.push('chongzhen');
            }
            if (player.hp <= 2) {
              list.push('relonghun');
            }
            if (player.hp <= 1) {
              var num = 4 - player.countCards('h');
              if (num != 0) player.logSkill('boss_juejing');
              if (num > 0) player.draw(num);
              if (num < 0) player.chooseToDiscard('h', true, -num);
              list.push('boss_juejing');
            }
            if (list.length) {
              player.addAdditionalSkill('PShuwei', list);
            }
          },
          derivation: ["new_yajiao", "chongzhen", "relonghun", "boss_juejing"],
          content: function () {
            player.removeAdditionalSkill('PShuwei');
            var list = [];
            if (player.hp <= 4) {
              if (trigger.num != undefined && trigger.num < 0 && player.hp - trigger.num > 1) player.logSkill('PShuwei');
              list.push('new_yajiao');
            }
            if (player.hp <= 3) {
              list.push('chongzhen');
            }
            if (player.hp <= 2) {
              list.push('relonghun');
            }
            if (player.hp <= 1) {
              var num = 4 - player.countCards('h');
              if (num != 0) player.logSkill('boss_juejing');
              if (num > 0) player.draw(num);
              if (num < 0) player.chooseToDiscard('h', true, -num);
              list.push('boss_juejing');
            }
            if (list.length) {
              player.addAdditionalSkill('PShuwei', list);
            }
          },
          ai: {
            maixie: true,
            effect: {
              target: function (card, player, target) {
                if (get.tag(card, 'damage')) {
                  if (!target.hasFriend()) return;
                  if (target.hp >= 4) return [0, 1];
                }
                if (get.tag(card, 'recover') && player.hp >= player.maxHp - 1) return [0, 0];
              },
            },
          },
        },
        PSreshanjia: {
          locked: false,
          audio: "shanjia",
          trigger: {
            player: "phaseUseBegin",
          },
          frequent: true,
          init: function (player) {
            if (!player.storage.PSreshanjia) player.storage.PSreshanjia = 0;
          },
          intro: {
            content: "“缮甲”摸牌数+#",
          },
          content: function () {
            'step 0'
            player.draw(3 + player.storage.PSreshanjia);
            player.chooseToDiscard('he', true, 3).ai = get.disvalue;
            'step 1'
            var bool = [false, false, false];
            if (result.cards) {
              var list = ['basic', 'trick', 'equip'];
              for (var i = 0; i < bool.length; i++) {
                for (var j = 0; j < result.cards.length; j++) {
                  if ([list[i]].contains(get.type(result.cards[j], 'trick', result.cards[j].original == 'h' ? player : false))) {
                    bool[i] = true; break;
                  }
                }
              }
            }
            event.bool = bool;
            game.log(bool)
            'step 2'
            if (event.bool[0]) {
              player.chooseUseTarget({ name: 'sha' }, '是否视为使用一张【杀】？', false, 'nodistance');
            }
            'step 3'
            if (event.bool[1]) {
              var list = [];
              for (var i of lib.inpile) {
                if (get.type({ name: i }) != 'trick') continue;
                if (lib.filter.cardUsable({ name: i }, player, event.getParent('chooseToUse')) && player.hasUseTarget({ name: i })) {
                  list.push([get.translation(get.type({ name: i })), '', i]);
                }
              }
              if (list.length) {
                player.chooseButton(['是否视为使用一张普通锦囊牌？', [list, 'vcard']]).set('ai', function (button) {
                  var player = _status.event.player;
                  var card = { name: button.link[2], nature: button.link[3] };
                  return player.getUseValue(card);
                });
              }
            }
            else event.goto(5);
            'step 4'
            if (result && result.bool && result.links[0]) {
              var card = {
                name: result.links[0][2],
                nature: result.links[0][3],
                isCard: true,
                storage: {
                  nowuxie: true,
                },
              };
              player.chooseUseTarget(card, true);
            }
            'step 5'
            if (event.bool[2]) {
              player.storage.PSreshanjia++;
              player.markSkill('PSreshanjia');
            }
          },
          ai: {
            threaten: 3,
            noe: true,
          },
        },
        PSxiaorui: {
          audio: "qingxi",
          enable: "phaseUse",
          usable: 1,
          selectTarget: 1,
          filterTarget: true,
          prompt: "失去一点体力并获得一名角色两张牌，再对其造成一点伤害，若其中有装备牌，你回复一点体力",
          content: function () {
            "step 0"
            player.loseHp(1);
            "step 1"
            if (target.countCards('he') > 0) player.gainPlayerCard(target, [1, 2], 'he', false);
            target.damage('nocard', 1, player);
            "step 2"
            if (result.cards) {
              for (var i of result.cards) {
                if (get.type(i) == 'equip') {
                  player.recover();
                  break;
                }
              }
            }
          },
          ai: {
            basic: {
              order: 1,
            },
            result: {
              player: function (player) {
                if (player.countCards('h') >= player.hp - 1) return -1;
                if (player.hp < 3) return -1;
                return 1;
              },
            },
          },
        },
        PSshanjia: {
          group: ["PSshanjia_count", "PSshanjia_number", "PSshanjia_damage"],
          locked: false,
          mod: {
            aiValue: function (player, card, num) {
              if ((player.storage.PSshanjia || 0) < 3 && get.type(card) == 'equip' && !get.cardtag(card, 'gifts')) {
                return num / player.hp;
              }
            },
          },
          subSkill: {
            count: {
              forced: true,
              silent: true,
              popup: false,
              trigger: {
                player: "loseEnd",
              },
              filter: function (event, player) {
                return event.cards2 && event.cards2.length > 0;
              },
              content: function () {
                lib.skill.PSshanjia.sync(player);
              },
              sub: true,
            },
            number: {
              trigger: {
                source: "damageEnd",
              },
              init: function (player) {
                if (!player.storage.PSshanjia_number) player.storage.PSshanjia_number = 0;
              },
              forced: true,
              filter: function (event, player) {
                return event.parent.parent.parent.name == 'PSshanjia';
              },
              content: function () {
                player.storage.PSshanjia_number++;
                player.markSkill('PSshanjia');
              },
              sub: true,
            },
            damage: {
              trigger: {
                source: "damageBegin1",
              },
              filter: function (event) {
                return event.parent.parent.parent.name == 'PSshanjia';
              },
              direct: true,
              priority: -1,
              content: function () {
                trigger.num += player.storage.PSshanjia_number;
              },
              sub: true,
            },
          },
          audio: "shanjia",
          trigger: {
            player: "phaseUseBegin",
          },
          intro: {
            markcount: function (storage) {
              return storage;
            },
            content: function (storage, player) {
              if (!storage) return;
              var str = '<li>';
              str += '本局游戏内已失去过' + storage + '张装备牌';
              str += '<br><li>“缮甲”摸牌和伤害数+';
              str += (player.storage.PSshanjia_number);
              return str;
            },
          },
          frequent: true,
          sync: function (player) {
            var history = player.actionHistory;
            var num = 0;
            for (var i = 0; i < history.length; i++) {
              for (var j = 0; j < history[i].lose.length; j++) {
                if (history[i].lose[j].parent.name == 'useCard') continue;
                num += history[i].lose[j].cards2.filter(function (card) {
                  return get.type(card, false) == 'equip';
                }).length;
              }
            }
            player.storage.PSshanjia = num;
            if (num > 0) player.markSkill('PSshanjia');
            player.updateMark('PSshanjia');
          },
          content: function () {
            'step 0'
            var num = player.storage.PSshanjia_number;
            player.draw(3 + num);
            'step 1'
            lib.skill.PSshanjia.sync(player);
            var num = 3 - player.storage.PSshanjia;
            if (num > 0) {
              player.chooseToDiscard('he', true, num).ai = get.disvalue;
            }
            'step 2'
            var bool = true;
            if (result.cards) {
              for (var i = 0; i < result.cards.length; i++) {
                if (['delay'].contains(get.type(result.cards[i], null, result.cards[i].original == 'h' ? player : false))) {
                  bool = false; break;
                }
              }
            }
            if (bool) {
              player.chooseTarget('是否视为使用一张【杀】？').set('filterTarget', function (card, player, target) {
                return player.canUse({ name: 'sha' }, target, false);
              }).set('ai', function (player, target) {
                return get.attitude(player, target) <= 0
              });
            }
            'step 3'
            if (result.targets && result.targets.length > 0) {
              var target = result.targets[0];
              var card = { name: 'sha', isCard: true };
              player.addTempSkill('unequip', { player: 'shaAfter' });
              player.useCard(card, target, false);
            }
          },
          ai: {
            threaten: 3,
            noe: true,
            reverseOrder: true,
            skillTagFilter: function (player) {
              if (player.storage.PSshanjia > 2) return false;
            },
            effect: {
              target: function (card, player, target) {
                if (player.storage.PSshanjia < 3 && get.type(card) == 'equip' && !get.cardtag(card, 'gifts')) return [1, 3];
              },
            },
          },
        },
        PStuogu: {
          audio: "tuogu",
          trigger: {
            global: "die",
          },
          frequent: true,
          filter: function (event, player) {
            return event.player.getStockSkills('鸡', '你').filter(function (skill) {
              var info = get.info(skill);
              return info;
            }).length > 0;
          },
          logTarget: "player",
          content: function () {
            'step 0'
            var list = trigger.player.getStockSkills('太', '美').filter(function (skill) {
              var info = get.info(skill);
              return info;
            });
            list.push('cancel2');
            player.chooseControl(list).set('prompt', '选择获得' + get.translation(trigger.player) + '的一个技能').set('forceDie', true).set('ai', function () {
              return list.randomGet();
            });
            'step 1'
            if (result.control != 'cancel2') {
              player.storage.PStuogu.push(result.control);
              player.markSkill('PStuogu');
              player.addSkillLog(result.control);
              game.broadcastAll(function (skill) {
                var list = [skill];
                game.expandSkills(list);
                for (var i of list) {
                  var info = lib.skill[i];
                  if (!info) continue;
                  if (!info.audioname2) info.audioname2 = {};
                  info.audioname2.caoshuang = 'tuogu';
                }
              }, result.control);
            }
          },
          mark: true,
          init: function (player) {
            if (!player.storage.PStuogu) player.storage.PStuogu = [];
          },
          intro: {
            content: "已获得的托孤技能：$",
          },
        },
        PSjiushi: {
          trigger: {
            global: "gameStart",
            player: "enterGame",
          },
          forced: true,
          audio: "rejiushi",
          filter: function (event, player) {
            return !player.hasSkill('jiu');
          },
          init: function (player, skill) {
            if (!player.hasSkill('jiu')) {
              player.addSkill('jiu');
              if (!player.storage.jiu || player.storage.jiu == 0) player.storage.jiu = 1;
              if (!player.node.jiu && lib.config.jiu_effect) {
                player.node.jiu = ui.create.div('.playerjiu', player.node.avatar);
                player.node.jiu2 = ui.create.div('.playerjiu', player.node.avatar2);
              }
            }
          },
          content: function () {
            player.addSkill('jiu');
            if (!player.storage.jiu || player.storage.jiu == 0) player.storage.jiu = 1;
            if (!player.node.jiu && lib.config.jiu_effect) {
              player.node.jiu = ui.create.div('.playerjiu', player.node.avatar);
              player.node.jiu2 = ui.create.div('.playerjiu', player.node.avatar2);
            }
          },
          mod: {
            cardUsable: function (card, player, num) {
              if (card.name == 'jiu') return Infinity;
            },
          },
          group: ["PSjiushi_maintain", "PSjiushi_use"],
          subSkill: {
            maintain: {
              trigger: {
                global: ["useCardAfter", "phaseAfter", "useCard1"],
              },
              lastDo: true,
              priority: 1,
              popup: false,
              silent: true,
              charlotte: true,
              filter: function (event, player) {
                return !player.hasSkill('jiu');
              },
              content: function () {
                player.addSkill('jiu');
                if (!player.storage.jiu || player.storage.jiu == 0) player.storage.jiu = 1;
                if (!player.node.jiu && lib.config.jiu_effect) {
                  player.node.jiu = ui.create.div('.playerjiu', player.node.avatar);
                  player.node.jiu2 = ui.create.div('.playerjiu', player.node.avatar2);
                }
              },
              sub: true,
              forced: true,
            },
            use: {
              audio: "rejiushi",
              enable: "chooseToUse",
              locked: true,
              filterCard: true,
              viewAs: {
                name: "jiu",
              },
              position: "hes",
              viewAsFilter: function (player) {
                if (!player.countCards('hes')) return false;
                return true;
              },
              prompt: "将一张牌当酒使用",
              check: function (card) {
                if (_status.event.type == 'dying') return 1 / Math.max(0.1, get.value(card));
                return 4 - get.value(card);
              },
              ai: {
                threaten: 1.5,
                basic: {
                  useful: function (card, i) {
                    if (_status.event.player.hp > 1) {
                      if (i == 0) return 4;
                      return 1;
                    }
                    if (i == 0) return 7.3;
                    return 3;
                  },
                  value: function (card, player, i) {
                    if (player.hp > 1) {
                      if (i == 0) return 5;
                      return 1;
                    }
                    if (i == 0) return 7.3;
                    return 3;
                  },
                },
                order: function () {
                  return get.order({ name: 'sha' }) + 0.2;
                },
                result: {
                  target: function (player, target) {
                    if (target && target.isDying()) return 2;
                    if (target && !target.isPhaseUsing()) return 0;
                    if (lib.config.mode == 'stone' && !player.isMin()) {
                      if (player.getActCount() + 1 >= player.actcount) return 0;
                    }
                    var shas = player.getCards('h', 'sha');
                    if (shas.length > 1 && (player.getCardUsable('sha') > 1 || player.countCards('h', 'zhuge'))) {
                      return 0;
                    }
                    shas.sort(function (a, b) {
                      return get.order(b) - get.order(a);
                    })
                    var card;
                    if (shas.length) {
                      for (var i = 0; i < shas.length; i++) {
                        if (lib.filter.filterCard(shas[i], target)) {
                          card = shas[i]; break;
                        }
                      }
                    }
                    else if (player.hasSha() && player.needsToDiscard()) {
                      if (player.countCards('h', 'hufu') != 1) {
                        card = { name: 'sha' };
                      }
                    }
                    if (card) {
                      if (game.hasPlayer(function (current) {
                        return (get.attitude(target, current) < 0 &&
                          target.canUse(card, current, null, true) &&
                          !current.hasSkillTag('filterDamage', null, {
                            player: player,
                            card: card,
                            jiu: true,
                          }) &&
                          get.effect(current, card, target) > 0);
                      })) {
                        return 1;
                      }
                    }
                    return 0;
                  },
                },
                tag: {
                  save: 1,
                  recover: 0.1,
                },
              },
              sub: true,
            },
          },
        },
        PSluoying: {
          mod: {
            ignoredHandcard: function (card, player) {
              if (card.hasGaintag('PSluoying')) return true;
            },
            cardDiscardable: function (card, player, name) {
              if (name == 'phaseDiscard' && card.hasGaintag('PSluoying')) return false;
            },
          },
          onremove: function (player) {
            player.removeGaintag('PSluoying');
          },
          audio: "reluoying",
          trigger: {
            global: ["loseAfter", "cardsDiscardAfter"],
          },
          filter: function (event, player) {
            switch (event.name) {
              case 'lose':
                for (var i = 0; i < event.cards2.length; i++) {
                  if (get.suit(event.cards2[i], event.player) == 'club' && get.position(event.cards2[i], true) == 'd' && event.player != player) return true;
                }
                return false;
                break;
              case 'cardsDiscard':
                var evt = event.getParent().relatedEvent;
                if (get.position(event.cards[0], true) != 'd' || evt.player == player) return false;
                return (get.suit(event.cards[0]) == 'club');
                break;
            }
          },
          forced: true,
          content: function () {
            var cards = (trigger.name == 'lose' ? trigger.cards2 : trigger.cards);
            cards = cards.filter(function (card) {
              return get.suit(card) == 'club' && get.position(card, true) == 'd';
            });
            player.gain(cards, 'gain2').gaintag.add('PSluoying');
          },
        },
        PSbaiban: {
          audio: "ext:PS武将/audio/skill:2",
          trigger: {
            player: "damageBegin4",
          },
          filter: function (event, player) {
            return player.hp == 2 && event.num < 2;
          },
          forced: true,
          content: function () {
            trigger.cancel();
          },
        },
        "PSbb_hunzi": {
          skillAnimation: true,
          animationColor: "wood",
          audio: "rehunzi",
          juexingji: true,
          derivation: ["PSbb_yingzi", "PSbb_yinghun"],
          unique: true,
          trigger: {
            player: "phaseZhunbeiBegin",
          },
          filter: function (event, player) {
            return player.hp <= 1 && !player.storage.PSbb_hunzi;
          },
          forced: true,
          content: function () {
            player.loseMaxHp();
            player.addSkill('PSbb_yingzi');
            player.addSkill('PSbb_yinghun');
            player.removeSkill('PSbaiban');
            game.log(player, '获得了技能', '#g【英姿】和【英魂】');
            game.log(player, '失去了技能', '#g【白板】');
            player.awakenSkill(event.name);
            player.storage[event.name] = true;
          },
          ai: {
            threaten: function (player, target) {
              if (target.hp == 1) return 2;
              return 0.5;
            },
            maixie: true,
            effect: {
              target: function (card, player, target) {
                if (!target.hasFriend()) return;
                if (get.tag(card, 'damage') == 1 && target.hp == 2 && !target.isTurnedOver() &&
                  _status.currentPhase != target && get.distance(_status.currentPhase, target, 'absolute') <= 3) return [0.5, 1];
              },
            },
          },
        },
        "PSbb_yingzi": {
          audio: "reyingzi",
          audioname: ["sunce", "re_sunben", "re_sunce"],
          trigger: {
            player: "phaseDrawBegin2",
          },
          forced: true,
          preHidden: true,
          filter: function (event, player) {
            return !event.numFixed;
          },
          content: function () {
            trigger.num += player.maxHp;
          },
          ai: {
            threaten: 1.5,
          },
          mod: {
            maxHandcardBase: function (player, num) {
              return player.maxHp;
            },
          },
          "audioname2": {
            "WU_sunce": "reyingzi_sunce",
          },
        },
        "PSbb_yinghun": {
          audio: "yinghun",
          audioname: ["re_sunjian", "sunce", "re_sunben", "re_sunce", "ol_sunjian"],
          trigger: {
            player: "phaseZhunbeiBegin",
          },
          filter: function (event, player) {
            return true;
          },
          direct: true,
          preHidden: true,
          content: function () {
            "step 0"
            player.chooseTarget(get.prompt2('PSbb_yinghun'), function (card, player, target) {
              return true;
            }).set('ai', function (target) {
              var player = _status.event.player;
              if (get.attitude(_status.event.player, target) > 0) {
                return 10 + get.attitude(_status.event.player, target);
              }
              return 1;
            }).setHiddenSkill(event.name);
            "step 1"
            if (result.bool) {
              event.num = player.maxHp;
              player.logSkill('gzyinghun', result.targets);
              event.target = result.targets[0];
              if (event.num == 1) {
                event.directcontrol = true;
              }
              else {
                var str1 = '摸' + get.cnNumber(event.num, true) + '弃一';
                var str2 = '摸一弃' + get.cnNumber(event.num, true);
                player.chooseControl(str1, str2, function (event, player) {
                  return _status.event.choice;
                }).set('choice', get.attitude(player, event.target) > 0 ? str1 : str2);
                event.str = str1;
              }
            }
            else {
              event.finish();
            }
            "step 2"
            if (event.directcontrol || result.control == event.str) {
              event.target.draw(event.num);
              event.target.chooseToDiscard(true, 'he');
            }
            else {
              event.target.draw();
              event.target.chooseToDiscard(event.num, true, 'he');
            }
          },
          ai: {
            threaten: 2,
            maixie: true,
          },
          "audioname2": {
            "WU_sunce": "yinghun_sunce",
          },
        },
        PSmiewu: {
          audio: "spmiewu",
          enable: ["chooseToUse", "chooseToRespond"],
          filter: function (event, player) {
            if (player.hasSkill('PSmiewu_failure')) return false;
            if (!player.countCards('hse')) return false;
            for (var i of lib.inpile) {
              var type = get.type(i);
              if ((type == 'basic' || type == 'trick' || type == 'delay') && event.filterCard({ name: i }, player, event)) return true;
            }
            return false;
          },
          chooseButton: {
            dialog: function (event, player) {
              var list = [];
              for (var i = 0; i < lib.inpile.length; i++) {
                var name = lib.inpile[i];
                if (name == 'sha') {
                  if (event.filterCard({ name: name }, player, event)) list.push(['基本', '', 'sha']);
                  for (var j of lib.inpile_nature) {
                    if (event.filterCard({ name: name, nature: j }, player, event)) list.push(['基本', '', 'sha', j]);
                  }
                }
                else if (get.type(name) == 'trick' && event.filterCard({ name: name }, player, event)) list.push(['锦囊', '', name]);
                else if (get.type(name) == 'delay' && event.filterCard({ name: name }, player, event)) list.push(['延时锦囊', '', name]);
                else if (get.type(name) == 'basic' && event.filterCard({ name: name }, player, event)) list.push(['基本', '', name]);
              }
              return ui.create.dialog('灭吴', [list, 'vcard']);
            },
            filter: function (button, player) {
              return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
            },
            check: function (button) {
              if (_status.event.getParent().type != 'phase') return 1;
              var player = _status.event.player;
              if (['wugu', 'zhulu_card', 'yiyi', 'lulitongxin', 'lianjunshengyan', 'diaohulishan'].contains(button.link[2])) return 0;
              return player.getUseValue({
                name: button.link[2],
                nature: button.link[3],
              });
            },
            backup: function (links, player) {
              return {
                filterCard: true,
                audio: 'spmiewu',
                popname: true,
                check: function (card) {
                  return 8 - get.value(card);
                },
                position: 'hse',
                viewAs: { name: links[0][2], nature: links[0][3] },
                precontent: function () {
                  player.addTempSkill('PSmiewu_failure');
                },
              }
            },
            prompt: function (links, player) {
              return '将一张牌当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
            },
          },
          hiddenCard: function (player, name) {
            if (!lib.inpile.contains(name)) return false;
            var type = get.type(name);
            return (type == 'basic' || type == 'trick' || type == 'delay') && !player.hasSkill('PSmiewu_failure') && player.countCards('she') > 0
          },
          ai: {
            combo: "spwuku",
            fireAttack: true,
            respondSha: true,
            respondShan: true,
            skillTagFilter: function (player) {
              if (!player.countCards('hse') || player.hasSkill('PSmiewu_failure')) return false;
            },
            order: 1,
            result: {
              player: function (player) {
                if (_status.event.dying) return get.attitude(player, _status.event.dying);
                return 1;
              },
            },
          },
          group: "PSmiewu_draw",
          subSkill: {
            draw: {
              trigger: {
                player: ["useCardAfter", "respondAfter"],
              },
              forced: true,
              charlotte: true,
              popup: false,
              filter: function (event, player) {
                return event.skill == 'PSmiewu_backup';
              },
              content: function () {
                player.draw();
              },
              sub: true,
            },
            failure: {
              sub: true,
            },
          },
        },
        PSqiyang: {
          trigger: {
            player: "gainEnd",
          },
          audio: "pkwuku",
          filter: function (event, player) {
            if (_status.currentPhase == player) return false;
            return event.getParent(2).name != 'PSmiewu_draw';
          },
          forced: true,
          content: function () {
            var cards = trigger.cards || trigger.cards2;
            player.discard(cards);
          },
        },
        "PSmn_quanji": {
          group: "PSmn_quanji_phase",
          audio: "quanji",
          trigger: {
            player: "damageEnd",
          },
          filter: function (event, player) {
            return event.num > 0;
          },
          frequent: true,
          "prompt2": "摸两张牌",
          content: function () {
            'step 0'
            event.count = trigger.num;
            'step 1'
            event.count--;
            player.draw(2);
            'step 2'
            if (event.count > 0) player.chooseBool(get.prompt('PSmn_quanji'), '摸两张牌').set('frequentSkill', 'PSmn_quanji');
            else event.finish();
            'step 3'
            if (result.bool) {
              player.logSkill('PSmn_quanji');
              event.goto(1);
            }
          },
          onremove: function (player, skill) {
            var cards = player.getExpansions('quanji');
            if (cards.length) player.loseToDiscardpile(cards);
          },
          mod: {
            maxHandcard: function (player, num) {
              return num + player.getExpansions('quanji').length;
            },
            maxHandcardBase: function (player) {
              return 0;
            },
          },
          subSkill: {
            phase: {
              audio: "quanji",
              enable: "phaseUse",
              filter: function (event, player) {
                return player.countCards('h');
              },
              prompt: "将任意张手牌置于武将牌上",
              selectCard: [1, Infinity],
              filterCard: true,
              delay: false,
              discard: false,
              lose: false,
              check: function (card) {
                var player = _status.event.player, num = player.needsToDiscard();
                if (!player.getExpansions('quanji').length || num - ui.selected.cards.length - (player.getExpansions('quanji').length + ui.selected.cards.length) > 0) return 5 - get.value(card);
                return -1;
              },
              content: function () {
                player.addToExpansion(cards, player, 'give').gaintag.add('quanji');
              },
              ai: {
                order: 5,
                result: {
                  player: 1,
                },
              },
              sub: true,
            },
          },
        },
        "PSmn_paiyi": {
          enable: "phaseUse",
          audio: "paiyi",
          audioname: ["re_zhonghui"],
          filter: function (event, player) {
            var num = game.countPlayer(function (current) {
              return get.distance(current, player) <= 1;
            });
            if (player.getStat().skill.PSmn_paiyi >= num) return false;
            return player.getExpansions('quanji').length > 0;
          },
          chooseButton: {
            dialog: function (event, player) {
              return ui.create.dialog('排异', player.getExpansions('quanji'), 'hidden')
            },
            backup: function (links, player) {
              return {
                audio: 'paiyi',
                audioname: ['re_zhonghui'],
                filterTarget: true,
                filterCard: function () { return false },
                direct: true,
                selectCard: -1,
                card: links[0],
                delay: false,
                content: lib.skill.PSmn_paiyi.contentx,
                ai: {
                  order: 10,
                  result: {
                    target: function (player, target) {
                      if (player != target) return 0;
                      if (player.hasSkill('PSmn_quanji') || (player.countCards('h') + 2 <= player.hp + player.getExpansions('quanji').length)) return 1;
                      return 0;
                    }
                  },
                },
              }
            },
            prompt: function () { return '请选择〖排异〗的目标' },
          },
          contentx: function () {
            "step 0"
            player.logSkill('PSmn_paiyi', target);
            var card = lib.skill.PSmn_paiyi_backup.card;
            player.loseToDiscardpile(card);
            "step 1"
            target.draw(2);
            "step 2"
            if (target.countCards('h') > player.countCards('h')) {
              target.damage();
            }
          },
          ai: {
            order: 1,
            combo: "quanji",
            result: {
              player: 1,
            },
          },
        },
        PSjiufa: {
          audio: "jiufa",
          trigger: {
            player: "useCardToPlayered",
          },
          filter: function (event, player) {
            if (!event.addedTargets && event.targets.length == 1 && event.targets.contains(player)) return false;
            return event.targets && event.targets.length > 0;
          },
          init: function (player) {
            if (!player.storage.PSjiufa) player.storage.PSjiufa = 0;
          },
          mark: true,
          marktext: "伐",
          intro: {
            name: "九伐",
            content: "mark",
          },
          forced: true,
          content: function () {
            player.storage.PSjiufa++;
            player.markSkill('PSjiufa');
            player.syncStorage('PSjiufa');
          },
          group: "PSjiufa_gain",
          subSkill: {
            gain: {
              audio: "jiufa",
              trigger: {
                player: ["useCardAfter", "respondAfter"],
              },
              priority: -1,
              forced: true,
              usable: 1,
              filter: function (event, player) {
                return player.storage.PSjiufa >= 9;
              },
              "prompt2": "展示牌堆顶九张牌，获得其中较多的同色牌",
              content: function () {
                "step 0"
                player.storage.PSjiufa -= 9;
                player.markSkill('PSjiufa');
                var cards = get.cards(9);
                game.cardsGotoOrdering(cards);
                player.showCards(cards, '九伐');
                var cardsx = [];
                var cardsy = [];
                for (var i = 0; i < cards.length; i++) {
                  if (get.color(cards[i]) == "red") {
                    cardsx.push(cards[i]);
                  }
                  else cardsy.push(cards[i]);
                }
                event.cards = cardsx.length > cardsy.length ? cardsx : cardsy;
                "step 1"
                if (event.cards.length) player.gain(event.cards, 'gain2');
                //game.cardsDiscard(cards2);
              },
              sub: true,
            },
          },
        },
        PSkefu: {
          audio: "tianren",
          enable: ["chooseToRespond", "chooseToUse"],
          filterCard: true,
          filter: function (event, player) {
            var num = player.hp;
            return player.countCards('hes') >= num;
          },
          selectCard: function (player) {
            var player = _status.event.player;
            var num = player.hp;
            return num;
          },
          position: "hes",
          viewAs: {
            name: "sha",
            isCard: true,
            storage: {
              PSkefu: true,
            },
          },
          viewAsFilter: function (player) {
            var num = player.hp;
            if (!player.countCards('hes' < num)) return false;
          },
          mod: {
            cardUsable: function (card) {
              if (card.storage && card.storage.PSkefu) return Infinity;
            },
          },
          prompt: function (event, player) {
            var player = _status.event.player;
            var num = player.hp;
            return "将" + get.cnNumber(num) + "张牌当【杀】使用或打出";
          },
          check: function (card) {
            var val = get.value(card);
            if (_status.event.name == 'chooseToRespond') return 1 / Math.max(0.1, val);
            return 5 - val;
          },
          ai: {
            skillTagFilter: function (player) {
              if (get.zhu(player, 'shouyue')) {
                if (!player.countCards('hes')) return false;
              }
              else {
                if (!player.countCards('hes', { color: 'red' })) return false;
              }
            },
            respondSha: true,
            yingbian: function (card, player, targets, viewer) {
              if (get.attitude(viewer, player) <= 0) return 0;
              var base = 0, hit = false;
              if (get.cardtag(card, 'yingbian_hit')) {
                hit = true;
                if (targets.filter(function (target) {
                  return target.hasShan() && get.attitude(viewer, target) < 0 && get.damageEffect(target, player, viewer, get.nature(card)) > 0;
                })) base += 5;
              }
              if (get.cardtag(card, 'yingbian_all')) {
                if (game.hasPlayer(function (current) {
                  return !targets.contains(current) && lib.filter.targetEnabled2(card, player, current) && get.effect(current, card, player, player) > 0;
                })) base += 5;
              }
              if (get.cardtag(card, 'yingbian_damage')) {
                if (targets.filter(function (target) {
                  return get.attitude(player, target) < 0 && (hit || !target.mayHaveShan() || player.hasSkillTag('directHit_ai', true, {
                    target: target,
                    card: card,
                  }, true)) && !target.hasSkillTag('filterDamage', null, {
                    player: player,
                    card: card,
                    jiu: true,
                  })
                })) base += 5;
              }
              return base;
            },
            canLink: function (player, target, card) {
              if (!target.isLinked() && !player.hasSkill('wutiesuolian_skill')) return false;
              if (target.mayHaveShan() && !player.hasSkillTag('directHit_ai', true, {
                target: target,
                card: card,
              }, true)) return false;
              if (player.hasSkill('jueqing') || player.hasSkill('gangzhi') || target.hasSkill('gangzhi')) return false;
              return true;
            },
            basic: {
              useful: [5, 3, 1],
              value: [5, 3, 1],
            },
            order: function (item, player) {
              if (player.hasSkillTag('presha', true, null, true)) return 10;
              if (lib.linked.contains(get.nature(item))) {
                if (game.hasPlayer(function (current) {
                  return current != player && current.isLinked() && player.canUse(item, current, null, true) && get.effect(current, item, player, player) > 0 && lib.card.sha.ai.canLink(player, current, item);
                }) && game.countPlayer(function (current) {
                  return current.isLinked() && get.damageEffect(current, player, player, get.nature(item)) > 0;
                }) > 1) return 3.1;
                return 3;
              }
              return 3.05;
            },
            result: {
              target: function (player, target, card, isLink) {
                var eff = function () {
                  if (!isLink && player.hasSkill('jiu')) {
                    if (!target.hasSkillTag('filterDamage', null, {
                      player: player,
                      card: card,
                      jiu: true,
                    })) {
                      if (get.attitude(player, target) > 0) {
                        return -7;
                      }
                      else {
                        return -4;
                      }
                    }
                    return -0.5;
                  }
                  return -1.5;
                }();
                if (!isLink && target.mayHaveShan() && !player.hasSkillTag('directHit_ai', true, {
                  target: target,
                  card: card,
                }, true)) return eff / 1.2;
                return eff;
              },
            },
            tag: {
              respond: 1,
              respondShan: 1,
              damage: function (card) {
                if (card.nature == 'poison') return;
                return 1;
              },
              natureDamage: function (card) {
                if (card.nature) return 1;
              },
              fireDamage: function (card, nature) {
                if (card.nature == 'fire') return 1;
              },
              thunderDamage: function (card, nature) {
                if (card.nature == 'thunder') return 1;
              },
              poisonDamage: function (card, nature) {
                if (card.nature == 'poison') return 1;
              },
            },
          },
          group: ["PSkefu_clear", "PSkefu_recover"],
          subSkill: {
            clear: {
              trigger: {
                player: "useCardAfter",
              },
              forced: true,
              silent: true,
              charlotte: true,
              filter: function (event, player) {
                return event.skill == 'PSkefu' && event.addCount != false;
              },
              content: function () {
                trigger.addCount = false;
                if (player.stat[player.stat.length - 1].card.sha > 0) {
                  player.stat[player.stat.length - 1].card.sha--;
                }
              },
              popup: false,
              sub: true,
            },
            recover: {
              trigger: {
                source: "damageAfter",
              },
              forced: true,
              popup: false,
              filter: function (event, player) {
                return event.card && event.card.storage && event.card.storage.PSkefu;
              },
              content: function () {
                if (player.hp == player.maxHp) player.gainMaxHp();
                else player.recover();
              },
              sub: true,
            },
          },
        },
        "PSjingjia1": {
          derivation: ["wushuangfangtianji", "shufazijinguan", "hongmianbaihuapao", "linglongshimandai"],
          trigger: {
            global: "phaseBefore",
            player: "enterGame",
          },
          filter: function (event, player) {
            return event.name != 'phase' || game.phaseNumber == 0;
          },
          forced: true,
          content: function () {
            "step 0"
            var list = ['wushuangfangtianji', 'shufazijinguan'];
            list.push(['hongmianbaihuapao', 'linglongshimandai'].randomGet());
            for (var i of list) {
              if (lib.inpile.contains(i)) {
                var card = get.cardPile(function (card) {
                  return card.name == i;
                });
                player.equip(card);
              }
            }
            "step 1"
            var types = [];
            for (var k = 1; k <= 6; k++) {
              if (player.isEmpty(k)) types.push('equip' + k);
            }
            for (var i = 0; i < types.length; i++) {
              var newCard = get.cardPile(function (card) {
                var type = get.subtype(card);
                return type == types[i] && player.canUse(card, player);
              });
              if (newCard) player.equip(newCard);
            }
          },
          mod: {
            canBeGained: function (card, source, player) {
              if (player.getCards('e').contains(card)) return false;
            },
            canBeDiscarded: function (card, source, player) {
              if (player.getCards('e').contains(card)) return false;
            },
            canBeReplaced: function (card, player) {
              if (player.getCards('e').contains(card)) return false;
            },
            cardDiscardable: function (card, player) {
              if (player.getCards('e').contains(card)) return false;
            },
            "cardEnabled2": function (card, player) {
              if (player.getCards('e').contains(card)) return false;
            },
          },
          group: "PSjingjia1_blocker",
          subSkill: {
            blocker: {
              trigger: {
                player: ["loseBefore", "disableEquipBefore"],
              },
              forced: true,
              filter: function (event, player) {
                if (event.name == 'disableEquip') return true;
                return event.cards.some(card => player.getCards('e').contains(card));
              },
              content: function () {
                if (trigger.name == 'lose') {
                  trigger.cards.removeArray(player.getCards('e'));
                }
                else {
                  trigger.slots.removeArray(trigger.slots);
                }
              },
              sub: true,
              "_priority": 0,
            },
          },
        },
        "PSbaguan1": {
          trigger: {
            global: "gameDrawBegin",
          },
          forced: true,
          popup: false,
          silent: true,
          content: function () {
            var num = trigger.num;
            trigger.num = function (target) {
              if (target == player) return 8;
              else if (typeof num == 'function') return num(target);
              else return num;
            };
          },
          ai: {
            threaten: 1.3,
          },
          group: ["PSbaguan1_enter", "PSbaguan1_phase", "PSbaguan1_bianshen"],
          subSkill: {
            enter: {
              trigger: {
                global: "phaseBefore",
                player: "enterGame",
              },
              forced: true,
              priority: 100,
              filter: function (event, player) {
                var list = ['wushuangfangtianji', 'shufazijinguan', 'hongmianbaihuapao', 'linglongshimandai'];
                var bool = false;
                for (var i of list) {
                  if (!lib.inpile.contains(i)) {
                    bool = true;
                    break;
                  }
                }
                if (bool == false) return false;
                return (event.name != 'phase' || game.phaseNumber == 0);
              },
              content: function () {
                var list = ['wushuangfangtianji', 'shufazijinguan', 'hongmianbaihuapao', 'linglongshimandai'];
                for (var name of list) {
                  if (!lib.inpile.contains(name)) {
                    var card = game.createCard2(name, lib.suit.randomGet(), get.rand(1, 13));
                    ui.cardPile.insertBefore(card, ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)]);
                    game.log(name, '加入了牌堆');
                    game.broadcastAll(function () { lib.inpile.add(name) });
                  }
                }
                game.updateRoundNumber();
              },
              sub: true,
            },
            phase: {
              trigger: {
                global: "phaseAfter",
              },
              filter: function (event, player) {

                return event.player != player && _status.currentPhase.next != player;
              },
              priority: -1,
              forced: true,
              content: function () {
                player.insertPhase();
              },
              sub: true,
            },
            bianshen: {
              audio: "baonu",
              skillAnimation: true,
              animationStr: "变身",
              trigger: {
                global: "roundStart",
                player: ["changeHp", "dieBefore"],
              },
              filter: function (event, player) {
                if (event.name == 'changeHp') return player.hp <= player.getDamagedHp();
                else if (event.name != 'die') return game.roundNumber >= 2;
                return true;
              },
              forced: true,
              content: function () {
                'step 0'
                game.log(trigger.name + '0');
                if (trigger.name == 'die') trigger.cancel();
                var list = ['暴怒战神', '神鬼无前', '炼狱修罗'];
                player.chooseControl(list, function () {
                  return list.randomGet();
                }).set('prompt', '请选择一个变身形态：');
                'step 1'
                if (result.control == '暴怒战神') {
                  player.init('PSboss_lvbu2');
                }
                else if (result.control == '神鬼无前') {
                  player.init('PSboss_lvbu3');
                }
                else player.init('PSboss_lvbu4');
                player.maxHp = 6;
                player.hp = 6;
                player.update();
                ui.clear();
                'step 2'
                if (player.isLinked()) player.link();
                if (player.isTurnedOver()) player.turnOver();
                player.discard(player.getCards('j'));
                'step 3'
                while (_status.event.name != 'phaseLoop') {
                  _status.event = _status.event.parent;
                }
                game.resetSkills();
                _status.paused = false;
                _status.event.player = player;
                _status.event.step = 0;
                _status.roundStart = player;
              },
              ai: {
                effect: {
                  target: function (card, player, target) {
                    if (get.tag(card, 'damage') || get.tag(card, 'loseHp')) {
                      if (player.hp == 5) {
                        if (game.players.length < 4) return [0, 5];
                        var num = 0
                        for (var i = 0; i < game.players.length; i++) {
                          if (game.players[i] != game.me && game.players[i].hp == 1) {
                            num++;
                          }
                        }
                        if (num > 1) return [0, 2];
                        if (num && Math.random() < 0.7) return [0, 1];
                      }
                    }
                  },
                },
              },
              sub: true,
            },
          },
        },
        "PSaozhan1": {
          forced: true,
          group: ["PSaozhan1_wuqi", "PSaozhan1_fangju", "PSaozhan1_zuoji", "PSaozhan1_baowu", "PSaozhan1_baowu2"],
          subSkill: {
            wuqi: {
              mod: {
                cardUsable: function (card, player, num) {
                  if (player.getEquip(1) && card.name == 'sha') return num + 1;
                },
              },
              sub: true,
            },
            fangju: {
              trigger: {
                player: "damageBegin4",
              },
              forced: true,
              filter: function (event, player) {
                return player.getEquip(2) && event.num > 1;
              },
              content: function () {
                trigger.num = 1;
              },
              sub: true,
            },
            zuoji: {
              trigger: {
                player: "phaseDrawBegin",
              },
              forced: true,
              filter: function (event, player) {
                return player.getEquip(3) || player.getEquip(4) || player.getEquip(6);
              },
              content: function () {
                trigger.num++;
              },
              sub: true,
            },
            baowu: {
              trigger: {
                player: "phaseJudgeBefore",
              },
              forced: true,
              filter: function (event, player) {
                return player.getEquip(5);
              },
              content: function () {
                trigger.cancel();
                game.log(player, '跳过了判定阶段');
              },
              sub: true,
            },
            "baowu2": {
              init: function (player) {
                if (player.isTurnedOver()) {
                  player.logSkill('PSaozhan1');
                  player.turnOver();
                }
              },
              trigger: {
                player: "turnOverBefore",
              },
              filter: function (event, player) {
                return !player.isTurnedOver();
              },
              forced: true,
              content: function () {
                trigger.cancel();
              },
              sub: true,
            },
          },
        },
        "PSshenwei2": {
          mod: {
            maxHandcard: function (player, current) {
              return player.maxHp;
            },
          },
          audio: "xiuluo",
          trigger: {
            player: "phaseJudgeBegin",
          },
          charlotte: true,
          forced: true,
          filter: function (event, player) {
            return player.countCards('j') && player.countCards('hes') > 1;
          },
          content: function () {
            "step 0"
            player.chooseToDiscard('hes', 2, '神威：弃置两张牌并弃置自己判定区的所有牌', true).set('logSkill', 'PSshenwei2').ai = function (card) {
              return 6 - get.value(card);
            };
            "step 1"
            if (result.bool) {
              player.discard(player.getCards('j'));
            }
          },
          group: "PSshenwei2_draw",
          subSkill: {
            draw: {
              audio: "shenwei",
              trigger: {
                player: "phaseDrawBegin",
              },
              forced: true,
              content: function () {
                trigger.num += 3;
              },
              sub: true,
            },
          },
        },
        "PSshenji2": {
          audio: "shenji",
          enable: "phaseUse",
          usable: 2,
          filter: function (event, player) {
            return player.countCards('hes');
          },
          content: function () {
            'step 0'
            player.chooseToDiscard('hes', true);
            'step 1'
            var list = [
              '使用【杀】可以额外指定两名目标。',
              '使用【杀】无距离限制，且次数+1。',
              '使用【杀】造成伤害+1。',
              '使用【杀】指定目标时，目标须弃置一张牌。'
            ];
            if (player.storage.PSshenji2) list.remove(player.storage.PSshenji2);
            player.chooseControl().set('choiceList', list).set('ai', function () {
              var listx = list.length == 4 ? [0, 1, 2, 3] : [0, 1, 2];
              return listx.randomGet();
            }).set('prompt', '神戟：请选择你要获得的效果');
            event.list = list;
            'step 2'
            var name = event.list[result.index];
            player.storage.PSshenji2 = name;
            switch (name) {
              case '使用【杀】可以额外指定两名目标。':
                player.addTempSkill('PSshenji2_multi');
                break;
              case '使用【杀】无距离限制，且次数+1。':
                player.addTempSkill('PSshenji2_distance');
                break;
              case '使用【杀】造成伤害+1。':
                player.addTempSkill('PSshenji2_damage');
                break;
              default:
                player.addTempSkill('PSshenji2_discard');
            }
          },
          group: "PSshenji2_clear",
          subSkill: {
            clear: {
              trigger: {
                player: "phaseUseEnd",
              },
              direct: true,
              nopup: true,
              filter: function (event, player) {
                return player.storage.PSshenji2;
              },
              content: function () {
                player.storage.PSshenji2 = undefined;
              },
              sub: true,
            },
            multi: {
              mod: {
                selectTarget: function (card, player, range) {
                  if (card.name == 'sha' && range[1] != -1) {
                    range[1] += 2;
                  }
                },
              },
              sub: true,
            },
            distance: {
              mod: {
                cardUsable: function (card, player, num) {
                  if (card.name == 'sha') return num + 1;
                },
                targetInRange: function (card, player, target, now) {
                  if (get.name(card) == 'sha') return true;
                },
              },
              sub: true,
            },
            damage: {
              trigger: {
                source: "damageBegin1",
              },
              filter: function (event) {
                return event.card && event.card.name == 'sha';
              },
              forced: true,
              direct: true,
              content: function () {
                trigger.num++;
              },
              ai: {
                damageBonus: true,
              },
              sub: true,
            },
            discard: {
              trigger: {
                player: "shaBegin",
              },
              filter: function (event, player) {
                return event.target.countCards('he');
              },
              forced: true,
              check: function (event, player) {
                return get.attitude(player, event.target) < 0;
              },
              logTarget: "target",
              content: function () {
                trigger.target.chooseToDiscard('he', 1, true);
              },
              sub: true,
            },
          },
        },
        PSshenzhu: {
          audio: "qiaosi",
          enable: "phaseUse",
          filter: function (event, player) {
            var he = player.getCards('he');
            var num = 0;
            for (var i = 0; i < he.length; i++) {
              var info = lib.card[he[i].name];
              if (info.type == 'equip') {
                num++;
                if (num >= 2) return true;
              }
            }
          },
          filterCard: function (card) {
            if (ui.selected.cards.length && card.name == ui.selected.cards[0].name) return false;
            var info = get.info(card);
            return info.type == 'equip';
          },
          selectCard: 2,
          position: "hes",
          prompt: "请选择需要合成的两张装备牌，装备类型以先选择的牌为准",
          check: function (card) {
            return get.value(card);
          },
          content: function () {
            var name = cards[0].name + '_' + cards[1].name;
            var info1 = get.info(cards[0]), info2 = get.info(cards[1]);
            if (!lib.card[name]) {
              var info = {
                enable: true,
                type: 'equip',
                subtype: get.subtype(cards[0]),
                vanish: true,
                cardimage: info1.cardimage || cards[0].name,
                filterTarget: function (card, player, target) {
                  return target == player;
                },
                selectTarget: -1,
                modTarget: true,
                content: lib.element.content.equipCard,
                legend: true,
                source: [cards[0].name, cards[1].name],
                onEquip: [],
                onLose: [],
                skills: [],
                distance: {},
                ai: {
                  order: 8.9,
                  equipValue: 10,
                  useful: 2.5,
                  value: function (card, player) {
                    var value = 0;
                    var info = get.info(card);
                    var current = player.getEquip(info.subtype);
                    if (current && card != current) {
                      value = get.value(current, player);
                    }
                    var equipValue = info.ai.equipValue || info.ai.basic.equipValue;
                    if (typeof equipValue == 'function') return equipValue(card, player) - value;
                    return equipValue - value;
                  },
                  result: {
                    target: function (player, target) {
                      return get.equipResult(player, target, name);
                    }
                  }
                }
              }
              for (var i in info1.distance) {
                info.distance[i] = info1.distance[i];
              }
              for (var i in info2.distance) {
                if (typeof info.distance[i] == 'number') {
                  info.distance[i] += info2.distance[i];
                }
                else {
                  info.distance[i] = info2.distance[i];
                }
              }
              if (info1.skills) {
                info.skills = info.skills.concat(info1.skills);
              }
              if (info2.skills) {
                info.skills = info.skills.concat(info2.skills);
              }
              if (info1.onEquip) {
                if (Array.isArray(info1.onEquip)) {
                  info.onEquip = info.onEquip.concat(info1.onEquip);
                }
                else {
                  info.onEquip.push(info1.onEquip);
                }
              }
              if (info2.onEquip) {
                if (Array.isArray(info2.onEquip)) {
                  info.onEquip = info.onEquip.concat(info2.onEquip);
                }
                else {
                  info.onEquip.push(info2.onEquip);
                }
              }
              if (info1.onLose) {
                if (Array.isArray(info1.onLose)) {
                  info.onLose = info.onLose.concat(info1.onLose);
                }
                else {
                  info.onLose.push(info1.onLose);
                }
              }
              if (info2.onLose) {
                if (Array.isArray(info2.onLose)) {
                  info.onLose = info.onLose.concat(info2.onLose);
                }
                else {
                  info.onLose.push(info2.onLose);
                }
              }
              if (info.onEquip.length == 0) delete info.onEquip;
              if (info.onLose.length == 0) delete info.onLose;
              lib.card[name] = info;
              lib.translate[name] = get.translation(cards[0].name, 'skill') + get.translation(cards[1].name, 'skill');
              var str = lib.translate[cards[0].name + '_info'];
              if (str[str.length - 1] == '.' || str[str.length - 1] == '。') {
                str = str.slice(0, str.length - 1);
              }
              lib.translate[name + '_info'] = str + '；' + lib.translate[cards[1].name + '_info'];
              try {
                game.addVideo('newcard', null, {
                  name: name,
                  translate: lib.translate[name],
                  info: lib.translate[name + '_info'],
                  card: cards[0].name,
                  legend: true,
                });
              }
              catch (e) {
                console.log(e);
              }
            }
            player.gain(game.createCard({ name: name, suit: cards[0].suit, number: cards[0].number }), 'gain2');
          },
          ai: {
            order: 9.5,
            result: {
              player: 1,
            },
          },
        },
        PSwantian: {
          audio: "pingxiang",
          enable: "phaseUse",
          usable: 1,
          filter: function (event, player) {
            return player.maxHp > 1;
          },
          content: function () {
            var num1 = player.hp - 1, num2 = player.maxHp - 1;
            if (num1 < 0) num1 = 0;
            player.loseMaxHp(num2);
            player.draw(num1 + num2);
          },
          ai: {
            order: 1.5,
          },
        },
        PStaoluan: {
          audio: "taoluan",
          enable: ["chooseToUse", "chooseToRespond"],
          filter: function (event, player) {
            if (!player.countCards('hse')) return false;
            for (var i of lib.inpile) {
              var type = get.type2(i);
              if ((type == 'basic' || type == 'trick') && event.filterCard({ name: i }, player, event)) return true;
            }
            return false;
          },
          init: function (player) {
            if (!player.storage.PStaoluan) player.storage.PStaoluan = [];
          },
          chooseButton: {
            dialog: function (event, player) {
              var list = [];
              for (var i = 0; i < lib.inpile.length; i++) {
                var name = lib.inpile[i];
                if (player.storage.PStaoluan && player.storage.PStaoluan.contains(name)) continue;
                if (name == 'sha') {
                  if (event.filterCard({ name: name }, player, event)) list.push(['基本', '', 'sha']);
                  for (var j of lib.inpile_nature) {
                    if (event.filterCard({ name: name, nature: j }, player, event)) list.push(['基本', '', 'sha', j]);
                  }
                }
                else if (get.type2(name) == 'trick' && event.filterCard({ name: name }, player, event)) list.push(['锦囊', '', name]);

                else if (get.type(name) == 'basic' && event.filterCard({ name: name }, player, event)) list.push(['基本', '', name]);
              }
              return ui.create.dialog('滔乱', [list, 'vcard']);
            },
            filter: function (button, player) {
              return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
            },
            check: function (button) {
              if (_status.event.getParent().type != 'phase') return 1;
              var player = _status.event.player;
              if (['wugu', 'zhulu_card', 'yiyi', 'lulitongxin', 'lianjunshengyan', 'diaohulishan'].contains(button.link[2])) return 0;
              return player.getUseValue({
                name: button.link[2],
                nature: button.link[3],
              });
            },
            backup: function (links, player) {
              return {
                filterCard: true,
                audio: 'taoluan',
                popname: true,
                check: function (card) {
                  return 8 - get.value(card);
                },
                position: 'hse',
                viewAs: { name: links[0][2], nature: links[0][3] },
                onuse: function (result, player) {
                  player.storage.PStaoluan.add(result.card.name);
                },
              }
            },
            prompt: function (links, player) {
              return '将一张牌当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
            },
          },
          hiddenCard: function (player, name) {
            if (!lib.inpile.contains(name)) return false;
            var type = get.type2(name);
            return (type == 'basic' || type == 'trick') && player.countCards('she') > 0
          },
          ai: {
            fireAttack: true,
            respondSha: true,
            respondShan: true,
            skillTagFilter: function (player) {
              if (!player.countCards('hse')) return false;
            },
            order: 1,
            result: {
              player: function (player) {
                if (_status.event.dying) return get.attitude(player, _status.event.dying);
                return 1;
              },
            },
          },
          group: ["PStaoluan_draw", "PStaoluan_clear"],
          subSkill: {
            draw: {
              trigger: {
                player: ["useCardAfter", "respondAfter"],
              },
              forced: true,
              charlotte: true,
              popup: false,
              filter: function (event, player) {
                return event.skill == 'PStaoluan_backup';
              },
              content: function () {
                player.draw();
              },
              sub: true,
            },
            clear: {
              trigger: {
                global: "phaseJieshuEnd",
              },
              forced: true,
              charlotte: true,
              popup: false,
              filter: function (event, player) {
                return player.storage.PStaoluan;
              },
              content: function () {
                player.storage.PStaoluan = [];
              },
              sub: true,
            },
          },
        },
        "PSbaguan2": {
          enable: "phaseUse",
          filter: function (event, player) {
            return !player.hasSkill("PSbaguan2_clear");
          },
          content: function () {
            'step 0'
            var skills = ['PSshenji2_multi', 'PSshenji2_distance', 'PSshenji2_damage', 'PSshenji2_discard'];
            var skillsx = [];
            for (var i of skills) {
              if (player.hasSkill(i)) skillsx.push(i);
            }
            if (player.storage.PSjiwu3 && player.storage.PSjiwu3.length > 0) {
              for (var j of player.storage.PSjiwu3) {
                skillsx.push(j);
              }
            }
            event.skills = skillsx;
            event.num1 = player.maxHp;
            event.num2 = player.hp;
            'step 1'
            var list = ['暴怒战神', '神鬼无前', '炼狱修罗'];
            switch (player.name) {
              case 'PSboss_lvbu2':
                list.remove('暴怒战神');
                break;
              case 'PSboss_lvbu3':
                list.remove('神鬼无前');
                break;
              case 'PSboss_lvbu4':
                list.remove('炼狱修罗');
                break;
              default: break;
            }
            list.push('cancel2');
            player.chooseControl(list, function () {
              return list.randomGet();
            }).set('prompt', '请选择你要变换的形态：');
            'step 2'
            if (result.control == '暴怒战神') {
              player.init('PSboss_lvbu2');
            }
            else if (result.control == '神鬼无前') {
              player.init('PSboss_lvbu3');
            }
            else if (result.control == '炼狱修罗') {
              player.init('PSboss_lvbu4');
            }
            else event.finish();
            'step 3'
            player.logSkill('PSbaguan1_bianshen');
            player.addSkill("PSbaguan2_clear");
            player.maxHp = event.num1;
            player.hp = event.num2;
            player.update();
            'step 4'
            if (event.skills.length > 0) {
              for (var i of event.skills) {
                player.addTempSkill(i);
              }
            }
          },
          group: "PSbaguan2_else",
          subSkill: {
            else: {
              trigger: {
                player: ["phaseZhunbeiBegin", "phaseJieshuBegin"],
              },
              direct: true,
              priority: -1,
              filter: function (event, player) {
                return !player.hasSkill("PSbaguan2_clear");
              },
              content: function () {
                'step 0'
                var skills = ['PSshenji2_multi', 'PSshenji2_distance', 'PSshenji2_damage', 'PSshenji2_discard'];
                var skillsx = [];
                for (var i of skills) {
                  if (player.hasSkill(i)) skillsx.push(i);
                }
                if (player.storage.PSjiwu3 && player.storage.PSjiwu3.length > 0) {
                  for (var j of player.storage.PSjiwu3) {
                    skillsx.push(j);
                  }
                }
                event.skills = skillsx;
                event.num1 = player.maxHp;
                event.num2 = player.hp;
                'step 1'
                var list = ['暴怒战神', '神鬼无前', '炼狱修罗'];
                switch (player.name) {
                  case 'PSboss_lvbu2':
                    list.remove('暴怒战神');
                    break
                  case 'PSboss_lvbu3':
                    list.remove('神鬼无前');
                    break;
                  case 'PSboss_lvbu4':
                    list.remove('炼狱修罗');
                    break;
                  default: break;
                }
                list.push('cancel2');
                player.chooseControl(list, function () {
                  return list.randomGet();
                }).set('prompt', '请选择你要变换的形态：');
                'step 2'
                if (result.control == '暴怒战神') {
                  player.init('PSboss_lvbu2');
                }
                else if (result.control == '神鬼无前') {
                  player.init('PSboss_lvbu3');
                }
                else if (result.control == '炼狱修罗') {
                  player.init('PSboss_lvbu4');
                }
                else event.finish();
                'step 3'
                player.logSkill('PSbaguan1_bianshen');
                player.addSkill("PSbaguan2_clear");
                player.maxHp = event.num1;
                player.hp = event.num2;
                player.update();
                'step 4'
                if (event.skills.length > 0) {
                  for (var i of event.skills) {
                    player.addTempSkill(i);
                  }
                }
              },
              sub: true,
            },
            clear: {
              direct: true,
              charlotte: true,
              sub: true,
              trigger: {
                global: "roundStart",
              },
              content: function () {
                player.removeSkill("PSbaguan2_clear");
              },
            },
          },
        },
        "PSshenqu3": {
          audio: "shenqu",
          group: "PSshenqu3_tao",
          trigger: {
            global: "phaseZhunbeiBegin",
          },
          filter: function (event, player) {
            return player.countCards('h') <= player.maxHp;
          },
          forced: true,
          content: function () {
            var num = Math.min(2, player.getDamagedHp());
            player.draw(num + 1);
          },
          subSkill: {
            tao: {
              trigger: {
                player: "damageAfter",
              },
              direct: true,
              filter: function (event, player) {
                if (!player.canUse('tao', player, false)) return false;
                return player.hasSkillTag('respondTao') || player.countCards('h', 'tao') > 0;
              },
              content: function () {
                player.chooseToUse({ name: 'tao' }, '神躯：请使用一张桃', true).logSkill = 'shenqu';
              },
              sub: true,
            },
          },
        },
        "PSjiwu3": {
          init: function (player) {
            player.addSkill('PSjiwu3_clear');
            player.addSkill('PSjiwu3_audio');
            if (!player.storage.PSjiwu3) player.storage.PSjiwu3 = [];
          },
          derivation: ["qiangxix", "retieji", "decadexuanfeng", "rewansha"],
          audio: "jiwu",
          enable: "phaseUse",
          usable: 2,
          filter: function (event, player) {
            if (player.countCards('h') == 0) return false;
            if (!player.hasSkill('qiangxix')) return true;
            if (!player.hasSkill('retieji')) return true;
            if (!player.hasSkill('decadexuanfeng')) return true;
            if (!player.hasSkill('rewansha')) return true;
            return false;
          },
          filterCard: true,
          position: "he",
          check: function (card) {
            if (get.position(card) == 'e' && _status.event.player.hasSkill('decadexuanfeng')) return 16 - get.value(card);
            return 7 - get.value(card);
          },
          content: function () {
            'step 0'
            var list = [];
            if (!player.hasSkill('qiangxix')) list.push('qiangxix');
            if (!player.hasSkill('retieji')) list.push('retieji');
            if (!player.hasSkill('decadexuanfeng')) list.push('decadexuanfeng');
            if (!player.hasSkill('rewansha')) list.push('rewansha');
            if (list.length == 1) {
              player.addTempSkill(list[0]);
              event.finish();
            }
            else {
              player.chooseControl(list, function () {
                if (list.contains('decadexuanfeng') && player.countCards('he', { type: 'equip' })) return 'decadexuanfeng';
                if (!player.getStat().skill.qiangxix) {
                  if (player.hasSkill('qiangxix') && player.getEquip(1) && list.contains('decadexuanfeng')) return 'decadexuanfeng';
                  if (list.contains('rewansha') || list.contains('qiangxix')) {
                    var players = game.filterPlayer();
                    for (var i = 0; i < players.length; i++) {
                      if (players[i].hp == 1 && get.attitude(player, players[i]) < 0) {
                        if (list.contains('rewansha')) return 'rewansha';
                        if (list.contains('qiangxix')) return 'qiangxix';
                      }
                    }
                  }
                }
                if (list.contains('qiangxix')) return 'qiangxix';
                if (list.contains('rewansha')) return 'rewansha';
                if (list.contains('decadexuanfeng')) return 'decadexuanfeng';
                return 'retieji';
              }).set('prompt', '选择获得一项技能直到回合结束');
            }
            'step 1'
            player.addTempSkill(result.control);
            player.storage.PSjiwu3.push(result.control);
            player.popup(get.translation(result.control));
          },
          ai: {
            order: function () {
              var player = _status.event.player;
              if (player.countCards('e', { type: 'equip' })) return 10;
              if (!player.getStat().skill.qiangxix) {
                if (player.hasSkill('qiangxix') && player.getEquip(1) && !player.hasSkill('decadexuanfeng')) return 10;
                if (player.hasSkill('rewansha')) return 1;
                var players = game.filterPlayer();
                for (var i = 0; i < players.length; i++) {
                  if (players[i].hp == 1 && get.attitude(player, players[i]) < 0) return 10;
                }
              }
              return 1;
            },
            result: {
              player: function (player) {
                if (player.countCards('e', { type: 'equip' })) return 1;
                if (!player.getStat().skill.qiangxix) {
                  if (player.hasSkill('qiangxix') && player.getEquip(1) && !player.hasSkill('decadexuanfeng')) return 1;
                  if (!player.hasSkill('rewansha') || !player.hasSkill('qiangxix')) {
                    var players = game.filterPlayer();
                    for (var i = 0; i < players.length; i++) {
                      if (players[i].hp == 1 && get.attitude(player, players[i]) < 0) return 1;
                    }
                  }
                }
                return 0;
              },
            },
          },
          subSkill: {
            clear: {
              trigger: {
                player: "phaseAfter",
              },
              direct: true,
              superCharlotte: true,
              popup: false,
              filter: function (event, player) {
                return player.storage.PSjiwu3;
              },
              content: function () {
                player.storage.PSjiwu3 = [];
              },
              sub: true,
            },
            audio: {
              trigger: {
                player: ["logSkill", "useSkillBegin"],
              },
              direct: true,
              superCharlotte: true,
              popup: false,
              filter: function (event, player) {
                return event.skill == 'qiangxix' || event.skill == 'rewansha' || event.skill == 'retieji' || event.skill == 'decadexuanfeng' || event.skill == 'wushuang';
              },
              content: function () {
                switch (trigger.skill) {
                  case 'qiangxix':
                    var audio1 = ['qiangxix1', 'qiangxix2'].randomGet();
                    game.playAudio('..', 'extension', 'PS武将/audio', audio1);
                    break;
                  case 'rewansha':
                    var audio2 = ['rewansha1', 'rewansha2'].randomGet();
                    game.playAudio('..', 'extension', 'PS武将/audio', audio2);
                    break;
                  case 'retieji':
                    var audio3 = 'retieji1';
                    game.playAudio('..', 'extension', 'PS武将/audio', audio3);
                    break;
                  case 'decadexuanfeng':
                    var audio4 = ['decadexuanfeng1', 'decadexuanfeng2'].randomGet();
                    game.playAudio('..', 'extension', 'PS武将/audio', audio4);
                    break;
                  default:
                    var audio5 = ['wushuang1', 'wushuang2', 'wushuang3', 'wushuang4', 'wushuang5', 'wushuang6', 'wushuang7', 'wushuang8'].randomGet();
                    game.playAudio('..', 'extension', 'PS武将/audio', audio5);
                    break;
                }
              },
              sub: true,
            },
          },
        },
        "PSkuangbao4": {
          audio: "baonu",
          marktext: "💢",
          superCharlotte: true,
          trigger: {
            source: "damageSource",
            player: "damageEnd",
          },
          forced: true,
          init: function (player) {
            player.addMark('PSkuangbao4', 2);
            player.logSkill('PSkuangbao4');
            game.log(player, '获得了两枚“暴怒”标记');
          },
          filter: function (event, player) {
            return event.num > 0 && player.countMark('PSkuangbao4') < 6;
          },
          content: function () {
            player.addMark('PSkuangbao4', 1);
          },
          intro: {
            name: "暴怒",
            content: "mark",
          },
          ai: {
            combo: "ol_shenfen",
            maixie: true,
            "maixie_hp": true,
          },
        },
        PSxianfu: {
          trigger: {
            global: ["phaseBefore", "dieAfter"],
            player: "enterGame",
          },
          forced: true,
          filter: function (event, player) {
            if (event.name == 'die') return !player.storage.PSxianfu_target.length;
            return game.players.length > 1 && (event.name != 'phase' || game.phaseNumber == 0);
          },
          audio: "xianfu",
          content: function () {
            'step 0'
            player.chooseTarget('请选择【先辅】的目标', lib.skill.PSxianfu_info, true, function (card, player, target) {
              return target != player && (!player.storage.PSxianfu_target || !player.storage.PSxianfu_target.contains(target));
            }).set('ai', function (target) {
              var att = get.attitude(_status.event.player, target);
              if (att > 0) return att + 1;
              if (att == 0) return Math.random();
              return att;
            }).animate = false;
            'step 1'
            if (result.bool) {
              var target = result.targets[0];
              if (!player.storage.PSxianfu_target) player.storage.PSxianfu_target = [];
              player.storage.PSxianfu_target.push(target);
              player.addSkill('PSxianfu_target');
            }
          },
          group: ["PSxianfu_target", "PSxianfu_lose"],
          subSkill: {
            target: {
              audio: "xianfu",
              charlotte: true,
              trigger: {
                global: ["damageEnd", "recoverEnd", "gainEnd", "loseEnd"],
              },
              forced: true,
              filter: function (event, player) {
                if (event.player.isDead() || !player.storage.PSxianfu_target || !player.storage.PSxianfu_target.contains(event.player) || event.num <= 0) return false;
                if (event.name == 'gain') return event.getParent().name == 'draw';
                if (event.name == 'lose') return event.type == 'discard';
                if (event.name == 'recover') return player.isDamaged();
                return true;
              },
              logTarget: "player",
              content: function () {
                'step 0'
                var target = trigger.player;
                if (!target.storage.PSxianfu_mark) target.storage.PSxianfu_mark = [];
                target.storage.PSxianfu_mark.add(player);
                target.storage.PSxianfu_mark.sortBySeat();
                target.markSkill('PSxianfu_mark');
                game.delayx();
                'step 1'
                if (['damage', 'recover'].contains(trigger.name)) player[trigger.name](trigger.num, 'nosource');
                if (trigger.name == 'gain') player.draw(trigger.cards.length);
                if (trigger.name == 'lose') player.chooseToDiscard('he', trigger.cards.length, true);
              },
              onremove: function (player) {
                if (!player.storage.PSxianfu_target) return;
                game.countPlayer(function (current) {
                  if (player.storage.PSxianfu_target.contains(current) && current.storage.PSxianfu_mark) {
                    current.storage.PSxianfu_mark.remove(player);
                    if (!current.storage.PSxianfu_mark.length) current.unmarkSkill('PSxianfu_mark');
                    else current.markSkill('PSxianfu_mark');
                  }
                });
                delete player.storage.PSxianfu_target;
              },
              sub: true,
            },
            mark: {
              marktext: "先辅",
              intro: {
                name: "先辅",
                content: "当你受到伤害/回复体力/摸牌/弃牌后，$受到等量的伤害/回复等量的体力/摸等量的牌/弃置等量的牌",
              },
              sub: true,
            },
            lose: {
              trigger: {
                global: "dieBegin",
              },
              silent: true,
              filter: function (event, player) {
                return event.player == player || player.storage.PSxianfu_target && player.storage.PSxianfu_target.contains(event.player);
              },
              content: function () {
                if (player == trigger.player) lib.skill.PSxianfu_target.onremove(player);
                else player.storage.PSxianfu_target.remove(trigger.player);
              },
              forced: true,
              popup: false,
              sub: true,
            },
          },
        },
        PSchouce: {
          audio: "chouce",
          trigger: {
            player: "damageEnd",
          },
          content: function () {
            'step 0'
            event.num = trigger.num;
            'step 1'
            player.judge();
            'step 2'
            event.color = result.color;
            if (event.color == 'black') {
              if (game.hasPlayer(function (current) {
                return current.countDiscardableCards(player, 'hej') > 0;
              })) player.chooseTarget('弃置一名角色区域内的一张牌', function (card, player, target) {
                return target.countDiscardableCards(player, 'hej');
              }, true).set('ai', function (target) {
                var player = _status.event.player;
                var att = get.attitude(player, target);
                if (att < 0) {
                  att = -Math.sqrt(-att);
                }
                else {
                  att = Math.sqrt(att);
                }
                return att * lib.card.guohe.ai.result.target(player, target);
              });
              else event.finish();
            }
            else {
              var next = player.chooseTarget('令一名角色摸一张牌');
              if (player.storage.PSxianfu_target && player.storage.PSxianfu_target.length) {
                next.set('prompt2', '（若目标为' + get.translation(player.storage.PSxianfu_target) + '则改为摸两张牌）');
              }
              next.set('ai', function (target) {
                var player = _status.event.player;
                var att = get.attitude(player, target) / Math.sqrt(1 + target.countCards('h'));
                if (target.hasSkillTag('nogain')) att /= 10;
                if (player.storage.PSxianfu_target && player.storage.PSxianfu_target.contains(target)) return att * 2;
                return att;
              })
            }
            'step 3'
            if (result.bool) {
              var target = result.targets[0];
              player.line(target, 'green');
              if (event.color == 'black') {
                player.discardPlayerCard(target, 'hej', true);
              }
              else {
                if (player.storage.PSxianfu_target && player.storage.PSxianfu_target.contains(target)) {
                  if (!target.storage.PSxianfu_mark) target.storage.PSxianfu_mark = [];
                  target.storage.PSxianfu_mark.add(player);
                  target.storage.PSxianfu_mark.sortBySeat();
                  target.markSkill('PSxianfu_mark');
                  target.draw(2);
                }
                else {
                  target.draw();
                }
              }
            }
            'step 4'
            if (--event.num > 0) {
              player.chooseBool(get.prompt2('chouce'));
            }
            else {
              event.finish();
            }
            'step 5'
            if (result.bool) {
              player.logSkill('chouce');
              event.goto(1);
            }
          },
          ai: {
            maixie: true,
            "maixie_hp": true,
            effect: {
              target: function (card, player, target) {
                if (get.tag(card, 'damage')) {
                  if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
                  if (!target.hasFriend()) return;
                  if (target.hp >= 4) return [1, get.tag(card, 'damage') * 1.5];
                  if (target.hp == 3) return [1, get.tag(card, 'damage') * 1];
                  if (target.hp == 2) return [1, get.tag(card, 'damage') * 0.5];
                }
              },
            },
          },
        },
        PSdanda: {
          audio: "liedan",
          trigger: {
            global: "phaseZhunbeiBegin",
          },
          forced: true,
          filter: function (event, player) {
            return player != event.player;
          },
          logTarget: "player",
          content: function () {
            var num = 0;
            if (player.hp > trigger.player.hp) num++;
            if (player.countCards('h') > trigger.player.countCards('h')) num++;
            if (player.countCards('e') > trigger.player.countCards('e')) num++;
            if (num) {
              player.draw(num);
              if (num == 3) player.gainMaxHp();
            }
          },
        },
        PSxiaozhan: {
          audio: "jiang",
          trigger: {
            source: "damageEnd",
          },
          frequent: true,
          filter: function (event, player) {
            return event.card && event.card.name == 'sha';
          },
          intro: {
            name: "骁战",
            content: "本回合【杀】使用次数+#",
          },
          init: function (player) {
            if (!player.storage.PSxiaozhan) player.storage.PSxiaozhan = 0;
          },
          content: function () {
            player.storage.PSxiaozhan += trigger.num;
            player.draw(trigger.num);
            player.addTempSkill('PSxiaozhan_use');
            player.markSkill('PSxiaozhan');
            player.syncStorage('PSxiaozhan');
          },
          group: ["PSxiaozhan_clear", "PSxiaozhan_kill"],
          subSkill: {
            use: {
              mod: {
                cardUsable: function (card, player, num) {
                  if (card.name == 'sha') return num + player.storage.PSxiaozhan;
                },
              },
              sub: true,
            },
            clear: {
              trigger: {
                player: "phaseUseEnd",
              },
              charlotte: true,
              forced: true,
              silent: true,
              content: function () {
                player.storage.PSxiaozhan = 0;
              },
              sub: true,
              popup: false,
            },
            kill: {
              audio: "jiang",
              trigger: {
                source: "dieAfter",
              },
              frequent: true,
              filter: function (event, player) {
                return player.countCards('h') < player.maxHp;
              },
              content: function () {
                player.drawTo(player.maxHp);
              },
              sub: true,
            },
          },
        },
        PSzengxi: {
          skillAnimation: true,
          animationColor: "wood",
          audio: "hunzi",
          juexingji: true,
          animationStr: "赠玺",
          derivation: "PShuju",
          unique: true,
          trigger: {
            player: "phaseZhunbeiBegin",
          },
          filter: function (event, player) {
            return player.countCards('e') >= 2 && !player.storage.PSzengxi;
          },
          forced: true,
          content: function () {
            'step 0'
            player.gainMaxHp();
            player.recover();
            player.awakenSkill(event.name);
            player.storage[event.name] = true;
            player.chooseTarget('赠玺：选择一名其他角色，你交给他装备区所有牌，他交给你一半手牌（向下取整）', 1, true).set('filterTarget', function (card, player, target) {
              return target != player;
            }).set('ai', function (target) {
              var player = _status.event.player; if (player.countCards('e') > target.countCards('h') && get.attitude(player, target) > 0) return 2;
              if (player.countCards('e') > target.countCards('h') && get.attitude(player, target) <= 0) return -1;
              if (player.countCards('e') < target.countCards('h') && get.attitude(player, target) <= 0) return 3;
              if (player.countCards('e') < target.countCards('h') && get.attitude(player, target) > 0) return 1;
              return 0;
            });
            'step 1'
            if (result.bool) {
              event.target = result.targets[0];
              player.give(player.getCards('e'), event.target);
            }
            'step 2'
            var num = Math.floor(event.target.countCards('h') / 2);
            event.target.chooseCard(num, true).set('prompt', '赠玺：请将' + get.cnNumber(num) + '张手牌交给' + get.translation(player));
            'step 3'
            if (result.cards) {
              event.target.give(result.cards, player);
            }
            'step 4'
            player.addSkill('PShuju');
          },
        },
        PShuju: {
          mod: {
            targetInRange: function (card, player, target, now) {
              return true;
            },
          },
          audio: "reyingzi",
          "audioname2": {
            PSqun_sunce: "reyingzi_sunce",
          },
          enable: "phaseUse",
          filter: function (event, player) {
            return player.maxHp > 0;
          },
          content: function () {
            if (player.isDamaged()) player.draw(player.maxHp - player.hp);
            player.loseMaxHp();
            player.addTempSkill("PShuju_base");
          },
          subSkill: {
            base: {
              trigger: {
                player: "useCard",
              },
              forced: true,
              filter: function (event, player) {
                return event.baseDamage && player.getStat().skill.PShuju;
              },
              content: function () {
                if (player.getStat().skill.PShuju > 0) trigger.baseDamage += player.getStat().skill.PShuju;
              },
              sub: true,
            },
          },
        },
        PSluansha: {
          audio: "olxueyi",
          trigger: {
            player: "useCardAfter",
          },
          forced: true,
          filter: function (event, player) {
            return event.targets.length && !player.hasHistory('sourceDamage', function (evt) {
              return evt.card == event.card;
            });
          },
          content: function () {
            player.draw(trigger.targets.length);
          },
        },
        PShengce: {
          trigger: {
            player: "phaseZhunbeiBegin",
          },
          priority: 1,
          frequent: true,
          filter: function (event, player) {
            return true;
          },
          content: function () {
            'step 0'
            var choiceList = [
              '对一名角色造成两点伤害',
              '令一名角色摸四张牌',
              '令一名角色弃四张牌',
              '获得一名角色两张牌',
              '令一名角色回复两点体力',
              '令一名角色增加两点体力上限'
            ];
            player.chooseControl().set('choiceList', choiceList).set('ai', function () {
              var num = choiceList.length - 1;
              return get.RandomIntInclusive(0, num);
            }).set('prompt', '衡策：请选择一项');
            'step 1'
            switch (result.control) {
              case '选项一':
                event.goto(2);
                break;
              case '选项二':
                event.goto(4);
                break;
              case '选项三':
                event.goto(6);
                break;
              case '选项四':
                event.goto(8);
                break;
              case '选项五':
                event.goto(10);
                break;
              default:
                event.goto(12);
            }
            'step 2'
            player.chooseTarget('衡策：对一名角色造成两点伤害', 1, false).set('ai', function (target) {
              var player = _status.event.player;
              if (get.attitude(player, target) < 0) return 5;
              return 0;
            });
            'step 3'
            if (result.targets) {
              player.line(result.targets[0], 'fire');
              result.targets[0].damage(2, 'nocard', player);
              game.playSkillAudio('xinfu_langxi');
              event.finish();
            }
            else event.finish();
            'step 4'
            player.chooseTarget('衡策：令一名角色摸四张牌', 1, false).set('ai', function (target) {
              var player = _status.event.player;
              if (get.attitude(player, target) > 0) return 5;
              return 0;
            });
            'step 5'
            if (result.targets) {
              player.line(result.targets[0], 'green');
              result.targets[0].draw(4);
              game.playSkillAudio('shuliang');
              event.finish();
            }
            else event.finish();
            'step 6'
            player.chooseTarget('衡策：令一名角色弃四张牌', 1, false).set('filterTarget', function (card, player, target) {
              return target.countCards('he') > 0;
            }).set('ai', function (target) {
              var player = _status.event.player;
              if (get.attitude(player, target) < 0) return 5;
              return 0;
            });
            'step 7'
            if (result.targets) {
              player.line(result.targets[0], 'fire');
              var target = result.targets[0];
              if (target.countCards('he') <= 4) target.discard(target.getCards('he'));
              else target.chooseToDiscard(4, true);
              game.playSkillAudio('remieji');
              event.finish();
            }
            else event.finish();
            'step 8'
            player.chooseTarget('衡策：获得一名角色两张牌', 1, false).set('filterTarget', function (card, player, target) {
              return target.countCards('he') > 0;
            }).set('ai', function (target) {
              var player = _status.event.player;
              if (get.attitude(player, target) < 0) return 5;
              return 0;
            });
            'step 9'
            if (result.targets) {
              player.line(result.targets[0], 'fire');
              var target = result.targets[0];
              if (target.countCards('he') <= 2) player.gainPlayerCard(target, true, 'he', target.countCards('he'));
              else player.gainPlayerCard(target, 2, 'he');
              game.playSkillAudio('tuxi');
              event.finish();
            }
            else event.finish();
            'step 10'
            player.chooseTarget('衡策：令一名角色回复两点体力', 1, false).set('filterTarget', function (card, player, target) {
              return target.isDamaged();
            }).set('ai', function (target) {
              var player = _status.event.player;
              if (get.attitude(player, target) > 0) return 5;
              return 0;
            });
            'step 11'
            if (result.targets) {
              player.line(result.targets[0], 'green');
              result.targets[0].recover(2);
              game.playSkillAudio('qingnang');
              event.finish();
            }
            else event.finish();
            'step 12'
            player.chooseTarget('衡策：令一名角色增加两点体力上限', 1, false).set('ai', function (target) {
              var player = _status.event.player;
              if (get.attitude(player, target) > 0) return 5;
              return 0;
            });
            'step 13'
            if (result.targets) {
              player.line(result.targets[0], 'green');
              result.targets[0].gainMaxHp(2);
              game.playSkillAudio('yongdi');
              event.finish();
            }
            else event.finish();
          },
        },
        "PSdwww_zhiheng": {
          audio: "rezhiheng",
          audioname: ["shen_caopi"],
          enable: "phaseUse",
          usable: 1,
          content: function () {
            'step 0'
            var num = Math.max(player.countCards('h'), 1);
            player.draw(num + 1);
            player.chooseToDiscard('he', num, true);
            'step 1'
            if (result.cards) {
              var bool = [false, false];
              var list = ['trick', 'equip'];
              for (var i = 0; i < bool.length; i++) {
                for (var j = 0; j < result.cards.length; j++) {
                  if ([list[i]].contains(get.type(result.cards[j], 'trick', result.cards[j].original == 'h' ? player : false))) {
                    bool[i] = true; break;
                  }
                }
              }
              if (bool[0] == true && !player.hasSkill('PSdwww_zhiheng_expire')) {
                delete player.getStat('skill').PSdwww_zhiheng;
                player.addTempSkill('PSdwww_zhiheng_expire', { player: "phaseUseEnd" });
              }
              if (bool[1] == true && !player.hasSkill('PSdwww_zhiheng_range')) player.addTempSkill('PSdwww_zhiheng_range');
            }
          },
          ai: {
            order: 5,
          },
          subSkill: {
            range: {
              mod: {
                targetInRange: function (card, player, target, now) {
                  return true;
                },
              },
              sub: true,
            },
            expire: {
              charlotte: true,
              locked: true,
              sub: true,
            },
          },
        },
        PSxiangong: {
          audio: "PShuiwan",
          trigger: {
            player: "loseAfter",
            global: "loseAsyncAfter",
          },
          groupSkill: true,
          forced: true,
          silent: true,
          filter: function (event, player) {
            if (!game.filterPlayer(current => { return !current.getExpansions('PSxiangong_cards').length }).length) return false;
            if (player.group != 'wei') return false;
            if (event.type != 'discard') return false;
            if (event.getParent(3).name == 'phaseDiscard') return false;
            var evt = event.getl(player);
            for (var card of evt.cards2) {
              if (get.position(card) == 'd') return true;
            }
            return false;
          },
          content: function () {
            "step 0"
            if (trigger.delay == false) game.delay();
            player.chooseTarget('将弃置的牌置于一名没有【贡】的角色武将牌上', true).set('filterTarget', function (card, player, target) {
              return !target.getExpansions('PSxiangong_cards').length;
            }).set('ai', function (target) {
              var player = _status.event.player;
              return -get.attitude(player, target);
            });
            "step 1"
            if (result.bool == true) {
              var cards = [], target = result.targets[0];
              var evt = trigger.getl(player);
              for (var card of evt.cards2) {
                if (get.position(card) == 'd') {
                  cards.push(card);
                }
              }
              player.logSkill('PSxiangong', target);
              target.addSkill('PSxiangong_cards');
              target.addToExpansion(player, 'give', cards).gaintag.add('PSxiangong_cards');
              target.storage.xinyingshi_source = player;
            }
          },
          group: "PSxiangong_damage",
          subSkill: {
            cards: {
              marktext: "贡",
              intro: {
                content: "expansion",
                markcount: "expansion",
              },
              onremove: function (player, skill) {
                var cards = player.getExpansions(skill);
                if (cards.length) player.loseToDiscardpile(cards);
              },
              sub: true,
            },
            damage: {
              trigger: {
                player: "damageBegin4",
              },
              filter: function (event, player) {
                if (event.num == 0) return false;
                return game.hasPlayer(current => { return current.getExpansions('PSxiangong_cards').length >= event.num });
              },
              direct: true,
              content: function () {
                'step 0'
                player.chooseTarget('是否将伤害转移给有“贡”的角色？', false).set('filterTarget', function (card, player, target) {
                  return target.getExpansions('PSxiangong_cards').length >= trigger.num;
                }).set('ai', function (target) {
                  var player = _status.event.player;
                  return -get.attitude(player, target);
                });
                'step 1'
                if (result.targets) {
                  var target = result.targets[0];
                  player.logSkill('PSxiangong', target);
                  event.target = target;
                  trigger.player = target;
                  target.chooseButton(['献贡：请选择你的贡品', target.getExpansions('PSxiangong_cards')], trigger.num, true);
                }
                'step 2'
                if (result.bool) {
                  event.target.gain(result.links, 'gain2', 'log');
                }
              },
              sub: true,
            },
          },
          popup: false,
        },
        PScuicheng: {
          skillAnimation: true,
          animationColor: "fire",
          audio: "sbtongye",
          juexingji: true,
          unique: true,
          groupSkill: true,
          trigger: {
            player: "phaseZhunbeiBegin",
          },
          filter: function (event, player) {
            if (player.group != 'wu') return false;
            return player.getAllHistory('useSkill', evt => evt.skill == 'PSdwww_zhiheng').length >= 3 && player.hasAllHistory('sourceDamage', evt => { return true });
          },
          forced: true,
          content: function () {
            'step 0'
            player.recover();
            player.draw();
            player.awakenSkill('PScuicheng');
            'step 1'
            var list;
            if (_status.characterlist) {
              list = [];
              for (var i = 0; i < _status.characterlist.length; i++) {
                var name = _status.characterlist[i];
                if (lib.character[name][1] == 'wu' && lib.skill.PSfushi.characterList().contains(name)) list.push(name);
              }
            }
            else if (_status.connectMode) {
              list = get.charactersOL(function (i) {
                return lib.character[i][1] != 'wu' && !lib.skill.PSfushi.characterList().contains(i);
              });
            }
            else {
              list = get.gainableCharacters(function (info, i) {
                return info[1] == 'wu' && lib.skill.PSfushi.characterList().contains(i);
              });
            }
            var players = game.players.concat(game.dead);
            for (var i = 0; i < players.length; i++) {
              list.remove(players[i].name);
              list.remove(players[i].name1);
              list.remove(players[i].name2);
            }
            list.remove('WU_sunquan');
            list.remove('sunquan');
            list.remove('sb_sunquan');
            list.remove('PSsunquan');
            list.remove('PSquansun');
            list.remove('PShw_sunquan');
            list = list.randomGets(4);
            var skills = [];
            if (player.isUnderControl()) {
              game.swapPlayerAuto(player);
            }
            if (lib.config.extensions && lib.config.extensions.contains('天牢令') && lib.config['extension_天牢令_enable'] && game.TLHasExt) {
              for (var i = 0; i < list.length; i++) {
                skills[i] = (lib.character[list[i]][3] || []);
              }
              if (!list.length || !skills.length) { event.finish(); return; }
              var next = game.createEvent('chooseToFuHan');
              next.player = player;
              next.list1 = list;
              next.list2 = skills;
              next.topic = '摧城';
              next.total = 3;
              next.setContent(lib.skill.PSfushi.chooseToFuHan);
              event.finish();
              return;
            }
            for (var i of list) {
              skills.addArray(lib.character[i][3] || []);
            }
            if (!list.length || !skills.length) { event.finish(); return; }
            var switchToAuto = function () {
              _status.imchoosing = false;
              event._result = {
                bool: true,
                skills: skills.randomGets(3),
              };
              if (event.dialog) event.dialog.close();
              if (event.control) event.control.close();
            };
            var chooseButton = function (list, skills) {
              var event = _status.event;
              if (!event._result) event._result = {};
              event._result.skills = [];
              var rSkill = event._result.skills;
              var dialog = ui.create.dialog('请选择获得至多三个技能', [list, 'character'], 'hidden');
              event.dialog = dialog;
              var table = document.createElement('div');
              table.classList.add('add-setting');
              table.style.margin = '0';
              table.style.width = '100%';
              table.style.position = 'relative';
              for (var i = 0; i < skills.length; i++) {
                var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                td.link = skills[i];
                table.appendChild(td);
                td.innerHTML = '<span>' + get.translation(skills[i]) + '</span>';
                td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                  if (_status.dragged) return;
                  if (_status.justdragged) return;
                  _status.tempNoButton = true;
                  setTimeout(function () {
                    _status.tempNoButton = false;
                  }, 500);
                  var link = this.link;
                  if (!this.classList.contains('bluebg')) {
                    if (rSkill.length >= 3) return;
                    rSkill.add(link);
                    this.classList.add('bluebg');
                  }
                  else {
                    this.classList.remove('bluebg');
                    rSkill.remove(link);
                  }
                });
              }
              dialog.content.appendChild(table);
              dialog.add('　　');
              dialog.open();

              event.switchToAuto = function () {
                event.dialog.close();
                event.control.close();
                game.resume();
                _status.imchoosing = false;
              };
              event.control = ui.create.control('ok', function (link) {
                event.dialog.close();
                event.control.close();
                game.resume();
                _status.imchoosing = false;
              });
              for (var i = 0; i < event.dialog.buttons.length; i++) {
                event.dialog.buttons[i].classList.add('selectable');
              }
              game.pause();
              game.countChoose();
            };
            if (event.isMine()) {
              chooseButton(list, skills);
            }
            else if (event.isOnline()) {
              event.player.send(chooseButton, list, skills);
              event.player.wait();
              game.pause();
            }
            else {
              switchToAuto();
            }
            'step 2'
            var map = event.result || result;
            if (map && map.skills && map.skills.length) {
              for (var i of map.skills) player.addSkillLog(i);
            }
            game.broadcastAll(function (list) {
              game.expandSkills(list);
              for (var i of list) {
                var info = lib.skill[i];
                if (!info) continue;
                if (!info.audioname2) info.audioname2 = {};
                info.audioname2.old_yuanshu = 'weidi';
              }
            }, map.skills);
          },
        },
        PSzhaohan: {
          audio: "zhaohan",
          trigger: {
            player: "phaseZhunbeiBegin",
          },
          forced: true,
          content: function () {
            player.gainMaxHp();
            player.recover();
          },
        },
        PSyizheng: {
          audio: "yizheng",
          enable: "phaseUse",
          usable: 2,
          filter: function (event, player) {
            return game.hasPlayer(function (current) {
              return current.hp <= player.hp && player.canCompare(current);
            });
          },
          filterTarget: function (card, player, current) {
            return current.hp <= player.hp && player.canCompare(current);
          },
          content: function () {
            'step 0'
            player.chooseToCompare(target);
            'step 1'
            if (result.bool) {
              target.skip('phaseDraw');
              target.addTempSkill('yizheng2', { player: 'phaseDrawSkipped' });
            }
            else {
              target.loseMaxHp();
              target.discard(target.getCards('hej'));
            }
          },
          ai: {
            order: 1,
            result: {
              target: function (player, target) {
                if (target.skipList.contains('phaseDraw') || target.hasSkill('pingkou')) return 0;
                var hs = player.getCards('h').sort(function (a, b) {
                  return b.number - a.number;
                });
                var ts = target.getCards('h').sort(function (a, b) {
                  return b.number - a.number;
                });
                if (!hs.length || !ts.length) return 0;
                if (hs[0].number > ts[0].number) return -1;
                return 0;
              },
            },
          },
        },
        PStanbei: {
          audio: "xinfu_tanbei",
          enable: "phaseUse",
          filterTarget: function (card, player, target) {
            return player != target && !target.hasSkill('tanbei_effect1') && !target.hasSkill('tanbei_effect2');
          },
          content: function () {
            "step 0"
            if (target.countCards('hej') == 0) {
              event._result = { index: 1 };
            }
            else {
              player.chooseControl().set('choiceList', [
                '随机获得' + get.translation(target) + '区域内的一张牌，然后其本回合内不能再对' + get.translation(target) + '使用牌。',
                '本回合内对' + get.translation(target) + '使用牌没有次数与距离限制。',
              ]).set('ai', function () {
                var list = [0, 1];
                return list.randomGet();
              });
            }
            "step 1"
            player.addTempSkill('tanbei_effect3');
            if (result.index == 0) {
              var card = target.getCards('hej').randomGet();
              player.gain(card, target, 'giveAuto', 'bySelf');
              target.addTempSkill('tanbei_effect2');
            }
            else {
              target.addTempSkill('tanbei_effect1');
            }
          },
          ai: {
            order: function () {
              return [2, 4, 6, 8, 10].randomGet();
            },
            result: {
              target: function (player, target) {
                return -2 - target.countCards('h');
              },
            },
            threaten: 1.1,
          },
        },
        PSsidao: {
          audio: "xinfu_sidao",
          trigger: {
            player: "useCardAfter",
          },
          filter: function (event, player) {
            if (!player.countCards('hs')) return false;
            if (event.getParent(2).name == 'PSsidao') return false;
            if (!event.targets || !event.targets.length || !event.isPhaseUsing(player)) return false;
            var history = player.getHistory('useCard');
            var index;
            if (event) index = history.indexOf(event) - 1;
            else index = history.length - 1;
            if (index < 0) return false;
            var evt = history[index];
            if (!evt || !evt.targets || !evt.targets.length || !evt.isPhaseUsing(player)) return false;
            for (var i = 0; i < event.targets.length; i++) {
              var num = 1;
              for (var j = 0; j <= index; j++) {
                if (history[index - j].targets.contains(event.targets[i])) num++;
                else break;
              } if (evt.targets.contains(event.targets[i]) && num % 2 == 0 && lib.filter.filterTarget({ name: 'shunshou' }, player, event.targets[i])) return true;
            }
            return false;
          },
          direct: true,
          content: function () {
            var targets = player.getLastUsed(1).targets;
            var next = player.chooseToUse();
            next.set('targets', game.filterPlayer(function (current) {
              return targets.contains(current) && trigger.targets.contains(current);
            }));
            next.set('openskilldialog', get.prompt('PSsidao') + lib.translate.PSsidao_info);
            next.set('norestore', true);
            next.set('_backupevent', 'xinfu_sidaox');
            next.set('custom', {
              add: {},
              replace: { window: function () { } }
            });
            next.backup('xinfu_sidaox');
          },
        },
        "PSshenfen4": {
          audio: "shenfen",
          enable: "phaseUse",
          usable: 2,
          filter: function (event, player) {
            return player.hasMark('PSkuangbao4');
          },
          content: function () {
            'step 0'
            var list = [
              '回复一点体力或令一名其他角色失去一点体力',
              '使用的下一张普通锦囊牌额外指定两名角色（【铁索连环】改为一名，若目标包括自己，则可收回锦囊牌）',
              '摸三张牌并弃置所有其他角色装备区所有牌和4张手牌',
              '所有其他角色受到一点无来源伤害，然后自己获得X个“💢”标记（X为场上已受伤角色数，至多为3）'
            ];
            var contorl = ['一个', '两个', '三个', '四个'];
            var num = player.countMark('PSkuangbao4');
            if (num < 4) {
              list = list.slice(0, num);
              contorl = contorl.slice(0, num);
            };
            player.chooseControl(contorl).set('choiceList', list).set('ai', function () {
              return get.RandomIntInclusive(0, contorl.length);
            }).set('prompt', '神愤：请选择你要弃置的“💢”标记个数');
            'step 1'
            switch (result.index) {
              case 0:
                player.removeMark('PSkuangbao4', 1);
                if (player.hasMark('PSkuangbao4')) player.markSkill('PSkuangbao4');
                else player.unmarkSkill('PSkuangbao4');
                event.goto(2);
                break;
              case 1:
                player.removeMark('PSkuangbao4', 2);
                if (player.hasMark('PSkuangbao4')) player.markSkill('PSkuangbao4');
                else player.unmarkSkill('PSkuangbao4');
                player.addSkill('PSshenfen4_use');
                event.finish();
                break;
              case 2:
                player.removeMark('PSkuangbao4', 3);
                if (player.hasMark('PSkuangbao4')) player.markSkill('PSkuangbao4');
                else player.unmarkSkill('PSkuangbao4');
                event.goto(4);
                break;
              default:
                player.removeMark('PSkuangbao4', 4);
                event.goto(6);
            }
            'step 2'
            player.chooseTarget(1, lib.filter.notMe, '神愤：是否令一名角色失去一点体力？或点击“取消”回复一点体力', false).set('ai', function (target) {
              var att = -get.attitude(_status.event.player, target);
              return att / target.hp;
            });
            'step 3'
            if (result.bool) {
              result.targets[0].loseHp();
            }
            else player.recover();
            event.finish();
            'step 4'
            player.draw(3);
            var targets = game.filterPlayer(target => { return target != player });
            targets.sort(lib.sort.seat);
            for (var i = 0; i < targets.length; i++) {
              var num = targets[i].getCards('e').length;
              if (num) player.discardPlayerCard('e', num, targets[i], true);
            }
            event.targets = targets;
            event.num = 0;
            player.line(targets, 'green');
            'step 5'
            if (num < event.targets.length) {
              var hs = event.targets[num].getCards('h');
              if (hs.length) {
                if (hs.length <= 4) player.discardPlayerCard('h', hs.length, event.targets[num], true);
                else player.discardPlayerCard('h', 4, event.targets[num], true);
              }
              event.num++;
              event.redo();
            }
            else event.finish();
            'step 6'
            var targets = game.filterPlayer(target => { return target != player });
            targets.sort(lib.sort.seat);
            for (var i = 0; i < targets.length; i++) {
              targets[i].damage('nosource');
            }
            var num = game.countPlayer(current => { return current.isDamaged() });
            num = Math.min(3, num);
            player.addMark('PSkuangbao4', num);
            player.markSkill('PSkuangbao4');
          },
          subSkill: {
            use: {
              trigger: {
                player: "useCard2",
              },
              direct: true,
              filter: function (event, player) {
                var type = get.type(event.card);
                return type == 'trick';
              },
              content: function () {
                'step 0'
                player.removeSkill('PSshenfen4_use');
                var goon = false;
                var info = get.info(trigger.card);
                if (trigger.targets && !info.multitarget) {
                  var players = game.filterPlayer();
                  for (var i = 0; i < players.length; i++) {
                    if (lib.filter.targetEnabled2(trigger.card, player, players[i]) && !trigger.targets.contains(players[i])) {
                      goon = true; break;
                    }
                  }
                }
                if (goon && trigger.card.name != 'tiesuo') {
                  player.chooseTarget('神愤：是否额外指定一至两名' + get.translation(trigger.card) + '的目标？', [1, 2], function (card, player, target) {
                    var trigger = _status.event;
                    if (trigger.targets.contains(target)) return false;
                    return lib.filter.targetEnabled2(trigger.card, _status.event.player, target);
                  }).set('ai', function (target) {
                    var trigger = _status.event.getTrigger();
                    var player = _status.event.player;
                    return get.effect(target, trigger.card, player, player);
                  }).set('targets', trigger.targets).set('card', trigger.card);
                }
                if (goon && trigger.card.name == 'tiesuo') {
                  player.chooseTarget('神愤：是否额外指定一名' + get.translation(trigger.card) + '的目标？', 1, function (card, player, target) {
                    var trigger = _status.event;
                    if (trigger.targets.contains(target)) return false;
                    return lib.filter.targetEnabled2(trigger.card, _status.event.player, target);
                  }).set('ai', function (target) {
                    var trigger = _status.event.getTrigger();
                    var player = _status.event.player;
                    return get.effect(target, trigger.card, player, player);
                  }).set('targets', trigger.targets).set('card', trigger.card);
                }
                'step 1'
                if (result.bool) {
                  if (!event.isMine()) game.delayx();
                  event.targets = result.targets;
                }
                else {
                  event.goto(3);
                }
                'step 2'
                if (event.targets) {
                  player.logSkill('PSshenfen4', event.targets);
                  for (var target of event.targets) {
                    trigger.targets.add(target);
                  }
                }
                'step 3'
                if (trigger.cards && trigger.cards.length && trigger.targets.contains(player)) {
                  player.gain(trigger.cards);
                  player.$gain2(trigger.cards);
                  game.log(player, '收回了', trigger.cards);
                }
              },
              sub: true,
            },
          },
        },
        PSdingjun: {
          shaRelated: true,
          audio: "sbliegong",
          trigger: {
            player: "useCardToPlayered",
          },
          check: function (event, player) {
            return get.attitude(player, event.target) <= 0;
          },
          init: function (player) {
            if (!player.storage.PSdingjun) player.storage.PSdingjun = 0;
          },
          intro: {
            markcount: function (storage, player) {
              var num = player.getHistory('useCard', evt => { return evt.card.name == 'sha' && evt.addCount != false; }).length;
              num = storage + 1 - num;
              if (num < 0) num = 0;
              return num;
            },
            content: function (storage, player) {
              var num = player.getHistory('useCard', evt => { return evt.card.name == 'sha' && evt.addCount != false; }).length;
              num = storage + 1 - num;
              if (num < 0) num = 0;
              if (num == 0) player.unmarkSkill('PSdingjun');
              return '本回合额外使用【杀】次数+' + num;
            },
          },
          onremove: function (player) {
            player.unmarkSkill('PSdingjun');
          },
          "prompt2": function (event) {
            var suit = get.suit(event.card);
            var num = get.number(event.card);
            if (suit == 'spade') return "令" + get.translation(event.card) + "造成伤害+" + num;
            if (suit == 'club') return "本回合额外使用【杀】次数+" + num;
            if (suit == 'heart') return "获得" + get.cnNumber(num) + "点护甲";
            if (suit == 'diamond') return "摸" + get.cnNumber(num) + "张牌";
          },
          filter: function (event, player) {
            if (event.card.name != 'sha') return false;
            return event.targets.length == 1 && get.suit(event.card) != 'none' && get.number(event.card) != null;
          },
          preHidden: true,
          content: function () {
            'step 0'
            var suit = get.suit(trigger.card);
            var num = get.number(trigger.card);
            switch (suit) {
              case 'spade':
                var id = trigger.target.playerid;
                var map = trigger.getParent().customArgs;
                if (!map[id]) map[id] = {};
                if (typeof map[id].extraDamage != 'number') {
                  map[id].extraDamage = 0;
                }
                map[id].extraDamage += num;
                break;
              case 'club':
                player.storage.PSdingjun += num;
                player.markSkill('PSdingjun');
                player.addTempSkill('PSdingjun_sha', { global: "phaseUseEnd" });
                break;
              case 'heart':
                player.changeHujia(num, null, false);
                break;
              default:
                player.draw(num);
                break;
            }
          },
          group: "PSdingjun_clear",
          subSkill: {
            sha: {
              mod: {
                cardUsable: function (card, player, num) {
                  if (card.name == 'sha') return num + player.storage.PSdingjun;
                },
              },
              sub: true,
            },
            clear: {
              trigger: {
                global: "phaseUseEnd",
              },
              direct: true,
              charlotte: true,
              forced: true,
              content: function () {
                if (player.storage.PSdingjun) player.storage.PSdingjun = 0;
                player.syncStorage('PSdingjun');
                player.unmarkSkill('PSdingjun');
              },
              sub: true,
            },
          },
        },
        PShuishi: {
          audio: "shuishi",
          enable: "phaseUse",
          usable: 1,
          frequent: true,
          filter: function (event, player) {
            return true;
          },
          content: function () {
            'step 0'
            event.cards = [];
            event.numbers = [];
            'step 1'
            player.judge(function (result) {
              var evt = _status.event.getParent('PShuishi');
              if (evt && evt.numbers && evt.numbers.contains(get.number(result))) return 0;
              return 1;
            }).set('callback', lib.skill.PShuishi.callback).judge2 = function (result) {
              return result.bool ? true : false;
            };
            'step 2'
            var cards = cards.filterInD();
            if (cards.length) player.chooseTarget('将' + get.translation(cards) + '交给一名角色', true).set('ai', function (target) {
              var player = _status.event.player;
              var att = get.attitude(player, target) / Math.sqrt(1 + target.countCards('h'));
              if (target.hasSkillTag('nogain')) att /= 10;
              return att;
            });
            else event.finish();
            'step 3'
            if (result.bool) {
              var target = result.targets[0];
              event.target = target;
              player.line(target, 'green');
              target.gain(cards, 'gain2').giver = player;
            }
            else event.finish();
            'step 4'
            if (target.isMaxHandcard()) player.loseMaxHp();
          },
          callback: function () {
            'step 0'
            var evt = event.getParent(2);
            event.getParent().orderingCards.remove(event.judgeResult.card);
            evt.cards.push(event.judgeResult.card);
            if (event.getParent().result.bool) {
              evt.numbers.push(event.getParent().result.number);
              if (player.maxHp < 10) player.gainMaxHp();
              player.chooseBool('是否继续发动【慧识】？').set('frequentSkill', 'PShuishi');
            }
            else event._result = { bool: false };
            'step 1'
            if (result.bool) event.getParent(2).redo();
          },
          ai: {
            order: 9,
            result: {
              player: 1,
            },
          },
        },
        PSluoshen: {
          audio: "sbluoshen",
          trigger: {
            global: "phaseJieshuBegin",
          },
          forced: true,
          filter: function (event, player) {
            return true;
          },
          content: function () {
            'step 0'
            trigger.player.chooseToDiscard('hes', 2, function (card, player) {
              if (get.color(card) != 'black') return false;
              if (ui.selected.cards.length) {
                var suit = get.suit(card, trigger.player);
                for (var i of ui.selected.cards) {
                  if (get.suit(i, trigger.player) == suit) return false;
                }
              }
              return true;
            }).set('ai', function (card) {
              var player = _status.event.player;
              return 10 - player.hp - get.value(card);
            }).set('prompt', '洛神：请弃置两张花色不同的黑色牌，否则展示牌堆底三张牌，将其中的黑色牌置于' + get.translation(player) + '武将牌上').set('complexCard', true);
            'step 1'
            if (!result.bool) {
              var cards = get.bottomCards(3);
              game.cardsGotoOrdering(cards);
              trigger.player.showCards(cards, '洛神');
              var cardsx = [];
              for (var i = 0; i < cards.length; i++) {
                if (get.color(cards[i]) == "black") {
                  cardsx.push(cards[i]);
                }
              }
              if (cardsx.length) {
                game.log(player, '将', cardsx, '作为“洛神牌”置于了', player, '武将牌上');
                player.loseToSpecial(cardsx, 'PSluoshen').visible = true;
              }
            }
            'step 2'
            player.markSkill('PSluoshen');
            game.delayx();
          },
          marktext: "洛神",
          intro: {
            mark: function (dialog, storage, player) {
              var cards = player.getCards('s', function (card) {
                return card.hasGaintag('PSluoshen');
              });
              if (!cards || !cards.length) return;
              dialog.addAuto(cards);
            },
            markcount: function (storage, player) {
              return player.countCards('s', function (card) {
                return card.hasGaintag('PSluoshen');
              });
            },
            onunmark: function (storage, player) {
              var cards = player.getCards('s', function (card) {
                return card.hasGaintag('PSluoshen');
              });
              if (cards.length) {
                player.loseToDiscardpile(cards);
              }
            },
          },
        },
        PSqingguo: {
          mod: {
            aiValue: function (player, card, num) {
              if (get.name(card) != 'shan' && get.color(card) != 'black') return;
              var cards = player.getCards('hs', function (card) {
                return get.name(card) == 'shan' || get.color(card) == 'black';
              });
              cards.sort(function (a, b) {
                return (get.name(b) == 'shan' ? 1 : 2) - (get.name(a) == 'shan' ? 1 : 2);
              });
              var geti = function () {
                if (cards.contains(card)) {
                  return cards.indexOf(card);
                }
                return cards.length;
              };
              if (get.name(card) == 'shan') return Math.min(num, [6, 4, 3][Math.min(geti(), 2)]) * 0.6;
              return Math.max(num, [6.5, 4, 3][Math.min(geti(), 2)]);
            },
            aiUseful: function () {
              return lib.skill.qingguo.mod.aiValue.apply(this, arguments);
            },
          },
          locked: false,
          audio: "ext:PS武将/audio/skill:2",
          enable: ["chooseToRespond", "chooseToUse"],
          filterCard: function (card) {
            return get.color(card) == 'black' || card.hasGaintag('PSluoshen');
          },
          viewAs: {
            name: "shan",
          },
          viewAsFilter: function (player) {
            if (!player.countCards('s', function (card) {
              return card.hasGaintag('PSluoshen');
            }) && !player.countCards('hs', { color: 'black' })) return false;
          },
          position: "hs",
          prompt: "将一张黑色手牌或洛神牌当闪使用或打出",
          check: function () { return 1 },
          ai: {
            order: 3,
            respondShan: true,
            skillTagFilter: function (player) {
              if (!player.countCards('s', function (card) {
                return card.hasGaintag('PSluoshen');
              }) && !player.countCards('hs', { color: 'black' })) return false;
            },
            effect: {
              target: function (card, player, target, current) {
                if (get.tag(card, 'respondShan') && current < 0) return 0.6
              },
            },
            basic: {
              useful: [7, 5.1, 2],
              value: [7, 5.1, 2],
            },
            result: {
              player: 1,
            },
          },
          group: "PSqingguo_use",
          subSkill: {
            use: {
              trigger: {
                player: ["useCardAfter", "respondAfter"],
              },
              forced: true,
              nopop: false,
              filter: function (event, player) {
                return event.card.name == 'shan' && event.skill == 'PSqingguo';
              },
              content: function () {
                'step 0'
                player.chooseBool('是否将' + get.translation(trigger.cards) + '置于牌堆底？');
                'step 1'
                if (result.bool) {
                  game.log(player, '将', trigger.cards, '置于了牌堆底');
                  ui.cardPile.appendChild(trigger.cards[0]);
                  player.popup(get.cnNumber(0) + '上' + get.cnNumber(1) + '下');
                  game.delayx();
                }
              },
              sub: true,
            },
          },
        },
        "PSwu_tuxi": {
          audio: "retuxi",
          trigger: {
            player: "phaseDrawBegin2",
          },
          direct: true,
          preHidden: true,
          filter: function (event, player) {
            return event.num > 0 && !event.numFixed && game.hasPlayer(function (target) {
              return target.countCards('he') > 0 && player != target;
            });
          },
          gainMultiple: function () {
            'step 0'
            event.delayed = false;
            event.num = 0;
            event.cards = [];
            'step 1'
            player.gainPlayerCard(targets[num], event.position, [1, targets.length], true).set('boolline', false).set('delay', num == targets.length - 1);
            'step 2'
            if (result.bool) {
              event.cards.addArray(result.cards);
              if (num == targets.length - 1) event.delayed = true;
            }
            event.num++;
            if (event.num < targets.length) {
              event.goto(1);
            }
            'step 3'
            if (!event.delayed) game.delay();
          },
          content: function () {
            'step 0'
            var num = get.copy(trigger.num);
            if (get.mode() == 'guozhan' && num > 2) num = 2;
            player.chooseTarget(get.prompt('new_retuxi'), '获得至多' + get.translation(num) + '名角色的各一张手牌，然后少摸等量的牌', [1, num], function (card, player, target) {
              return target.countCards('he') > 0 && player != target;
            }, function (target) {
              var att = get.attitude(_status.event.player, target);
              if (target.hasSkill('tuntian')) return att / 10;
              return 1 - att;
            }).setHiddenSkill('PSwu_tuxi');
            'step 1'
            if (result.bool) {
              result.targets.sortBySeat();
              player.logSkill('PSwu_tuxi', result.targets);
              var next = game.createEvent('gainMultiple', false);
              next.player = player;
              next.targets = result.targets;
              next.position = 'hej';
              next.setContent(lib.skill.PSwu_tuxi.gainMultiple);
              trigger.num -= result.targets.length;
            }
            else {
              event.finish();
            }
            'step 2'
            if (trigger.num <= 0) game.delay();
          },
          ai: {
            threaten: 1.6,
            expose: 0.2,
          },
        },
        "PSwu_zhenzhan": {
          audio: "ext:PS武将/audio/skill:2",
          trigger: {
            global: ["useCard2", "discardAfter"],
          },
          forced: true,
          priority: -1,
          logTarget: "player",
          filter: function (event, player) {
            if (!event.player.isAlive()) return false;
            if (event.player == player) return false;
            if (event.name == 'discard') return event.getParent(2).name != "phaseDiscard";
            else return event.targets.length > 1;
          },
          content: function () {
            player.line(trigger.player, 'fire');
            var num = trigger.name == 'discard' ? trigger.cards.length : trigger.targets.length;
            num = Math.min(player.getDamagedHp(), num);
            if (num <= 0) num = 1;
            trigger.player.damage(num, 'nocard', player);
          },
        },
        PSyingjian: {
          trigger: {
            player: ["phaseZhunbeiBegin", "phaseJudgeBegin", "phaseDrawBegin", "phaseDiscardBegin", "phaseJieshuBegin"],
          },
          direct: true,
          audio: "qingyi",
          content: function () {
            var card = {
              name: 'sha',
              storage: { PSyingjian: true }
            };
            player.chooseUseTarget('###是否发动【影箭】？###视为使用一张没有距离限制的【杀】', card, false, 'nodistance').logSkill = 'yingjian';
          },
          ai: {
            unequip: true,
            skillTagFilter: function (player, tag, arg) {
              if (!arg || !arg.card || !arg.card.storage || !arg.card.storage.PSyingjian) return false;
            },
            threaten: function (player, target) {
              return 1.6;
            },
          },
          group: "PSyingjian_use",
          subSkill: {
            use: {
              audio: "qingyi",
              enable: "phaseUse",
              usable: 1,
              content: function () {
                var card = {
                  name: 'sha',
                  storage: { PSyingjian: true }
                };
                player.chooseUseTarget('影箭：视为使用一张没有距离限制的【杀】', card, false, 'nodistance').logSkill = 'yingjian';
              },
              ai: {
                unequip: true,
                skillTagFilter: function (player, tag, arg) {
                  if (!arg || !arg.card || !arg.card.storage || !arg.card.storage.PSyingjian) return false;
                },
                threaten: function (player, target) {
                  return 1.6;
                },
              },
              sub: true,
            },
          },
        },
        PSshixin: {
          audio: "shixin",
          trigger: {
            player: "damageBegin4",
          },
          filter: function (event) {
            return true;
          },
          forced: true,
          content: function () {
            if (trigger.nature == 'fire') trigger.cancel();
            else trigger.num--;
          },
          ai: {
            nofire: true,
            effect: {
              target: function (card, player, target, current) {
                if (get.tag(card, 'fireDamage')) return 'zerotarget';
              },
            },
          },
          group: "PSshixin_end",
          subSkill: {
            end: {
              trigger: {
                source: "damageBegin2",
              },
              forced: true,
              filter: function (event, player) {
                return _status.currentPhase == player && !player.hasSkill("PSshixin_blocker");
              },
              content: function () {
                player.recover();
                player.addTempSkill("PSshixin_blocker");
              },
              sub: true,
            },
            blocker: {
              charlotte: true,
              forced: true,
              sub: true,
            },
          },
        },
        PSxingtu: {
          init: function (player) {
            if (!lib.translate.xingtu1) lib.translate.xingtu1 = '无次数限制';
          },
          trigger: {
            player: "useCard",
          },
          filter: function (event, player) {
            if (player.hasSkill('PSxingtu_disable')) return false;
            var num1 = get.number(event.card), num2 = player.storage.PSxingtu;
            return typeof num1 == 'number' && typeof num2 == 'number';
          },
          forced: true,
          popup: false,
          shuffle: function (array) {
            var j, x, i;
            for (i = array.length; i; i--) {
              j = Math.floor(Math.random() * i);
              x = array[i - 1];
              array[i - 1] = array[j];
              array[j] = x;
            }
            return array;
          },
          content: function () {
            'step 0'
            var num = 3;
            var num1 = get.number(trigger.card), num2 = player.storage.PSxingtu, num3 = [0, 1, 2].randomGet(); //随机给出0~2的数字num3
            var prompt;
            switch (num3) {
              case 0:
                prompt = num2 + '+' + num1 + '=' + '?'; break;
              case 1:
                prompt = num2 + '-' + num1 + '=' + '?'; break;
              default:
                prompt = num2 + '*' + num1 + '=' + '?';
            }//根据随机数字num3得到提示内容
            var answer = [
              num2 + num1,
              num2 - num1,
              num2 * num1,
            ];
            var list = [answer[num3] + 1, answer[num3], answer[num3] - 1];//根据随机数字num3得到答案数组，新的数组元素为正确答案+1/-1
            event.num = answer[num3];
            lib.skill.PSxingtu.shuffle(list);//调用上面声明的函数shuffle
            list.push('放弃');
            var next = player.chooseControl(list);
            next.set('prompt', '行图：请回答' + prompt);
            next.set('ai', function () {
              return event.num;
            });
            player.popup(num--);//玩家武将牌弹出数字
            event.popup = setInterval(function () {
              player.popup(num);
              num--;
              if (num == 0) num = '时间到！';
            }, 1000);//每过1秒弹出一次 
            var o = {
              O: function (num = 3) {
                if (typeof num != 'number') num = 3;
                ui.timer.show();
                game.countDown(num, function () {
                  ui.timer.hide();
                });
              },
            };
            o.O('尊嘟假嘟');//显示倒计时  
            setTimeout(function () {
              clearInterval(event.popup);//停止弹出函数
              if (next.controlbars) {
                for (var i = 0; i < next.controlbars.length - 1; i++) {
                  next.controlbars[i].close();//按钮关闭
                }
              }
            }, 3000);//3秒后停止弹出，除最后一个按钮外，其他按钮关闭
            'step 1'
            clearInterval(event.popup);//停止弹出函数 
            if (result.control == event.num) {
              player.logSkill('xingtu');
              player.draw();
            }
            else player.addTempSkill('PSxingtu_disable');//答错或时间到技能失效
          },
          mod: {
            cardUsable: function (card, player) {
              if (get.itemtype(card) == 'card') {
                if (card.hasGaintag('xingtu1')) return Infinity;
              }
              else if (card.isCard && card.cards) {
                if (card.cards.some(card => card.hasGaintag('xingtu1'))) return Infinity;
              }//if（card.hasGaintag('xingtu1')）这样写会报错TAT
            },
            aiOrder: function (player, card, num) {
              if (get.itemtype(card) == 'card') {
                if (card.hasGaintag('xingtu1')) return num + 5;
              }
              else if (card.isCard && card.cards) {
                if (card.cards.some(card => card.hasGaintag('xingtu1'))) return num + 5;
              }//if（card.hasGaintag('xingtu1')）这样写会报错TAT
            },
          },
          group: ["PSxingtu_record", "PSxingtu_tag"],
          intro: {
            content: "当前记录：X=#",
            markcount: () => undefined,
          },
          subSkill: {
            record: {
              audio: "xingtu",
              trigger: {
                player: "useCardAfter",
              },
              filter: function (event, player) {
                return typeof get.number(event.card) == 'number';
              },
              forced: true,
              content: function () {
                'step 0'
                player.storage.PSxingtu = get.number(trigger.card);
                player.markSkill('PSxingtu');
                game.log(player, '当前记录', '#g【行图】', '点数为', '#y' + get.number(trigger.card));
                'step 1'
                if (game.HasExtension) {
                  game.broadcastAll(function (player, storage) {
                    if (player.marks.PSxingtu) player.marks.PSxingtu.firstChild.innerHTML = ((game.HasExtension('十周年UI') ? 'X=' : '') + storage);
                  }, player, player.storage.PSxingtu);
                }
              },
              sub: true,
            },
            tag: {
              trigger: {
                player: "gainAfter",
              },
              forced: true,
              filter: function (event, player) {
                return event.getParent(2).name == 'PSxingtu';
              },
              content: function () {
                player.addGaintag(trigger.cards, "xingtu1");
              },
              sub: true,
              onremove: function (player) {
                player.removeGaintag('xingtu1');
                delete player.storage.PSxingtu;
              },
            },
            disable: {
              charlotte: true,
              sub: true,
            },
          },
        },
        PSjuezhi: {
          enable: "phaseUse",
          audio: "juezhi",
          filter: function (event, player) {
            return player.countCards('he') > 1;
          },
          filterCard: true,
          position: "he",
          usable: 1,
          prompt: function () {
            var player = _status.event.player;
            if (player.hasSkill('PSxingtu') && !player.hasSkill('PSxingtu_disable')) return '〖行图〗②未失效，是否继续发动技能？' + lib.translate.PSjuezhi_info;
            return lib.translate.PSjuezhi_info;
          },
          selectCard: 2,
          check: function (card) {
            if (ui.selected.cards.length > 1) return 0;
            return 4 - get.value(card);
          },
          content: function () {
            player.draw(2);
            if (player.hasSkill('PSxingtu_disable')) player.removeSkill('PSxingtu_disable');
          },
          ai: {
            order: 1,
            result: {
              player: 1,
            },
          },
        },
        PSlongnu: {
          mark: true,
          locked: true,
          zhuanhuanji: true,
          marktext: "☯",
          derivation: ["nuzhan", "liyong"],
          init: (player) => {
            if (player.storage.PSlongnu == void 0) player.changeZhuanhuanji('PSlongnu');
            if (!lib.skill.nuzhan.audioname2) lib.skill.nuzhan.audioname2 = {};
            lib.skill.nuzhan.audioname2.PSshen_liubei = "wusheng_jsp_guanyu";
          },
          intro: {
            content: function (storage, player, skill) {
              if (player.storage.PSlongnu == true) return '锁定技，出牌阶段开始时，你失去1点体力并摸一张牌，然后本阶段内你视为拥有技能〖怒斩〗，且你的红色手牌均视为火【杀】且无距离限制。';
              return '锁定技，出牌阶段开始时，你减1点体力上限并摸一张牌，然后本阶段内你然后本阶段内你视为拥有技能〖厉勇〗，且你的锦囊牌均视为雷【杀】且无使用次数限制。';
            },
          },
          audio: "nzry_longnu",
          trigger: {
            player: "phaseUseBegin",
          },
          forced: true,
          content: function () {
            'step 0'
            if (player.storage.PSlongnu == true) {
              player.loseHp();
            }
            else {
              player.loseMaxHp();
            }
            player.draw();
            'step 1'
            if (player.storage.PSlongnu == true) {
              player.addTempSkill('PSlongnu_yang', 'phaseUseAfter');
              player.addTempSkill('nuzhan', 'phaseUseAfter');
            }
            else {
              player.addTempSkill('PSlongnu_yin', 'phaseUseAfter');
              player.addTempSkill('liyong', 'phaseUseAfter');
            }
            player.changeZhuanhuanji('PSlongnu');
          },
          subSkill: {
            yang: {
              mod: {
                cardname: function (card, player) {
                  if (get.color(card) == 'red') return 'sha';
                },
                cardnature: function (card, player) {
                  if (get.color(card) == 'red') return 'fire';
                },
                targetInRange: function (card) {
                  if (get.color(card) == 'red') return true;
                },
              },
              ai: {
                effect: {
                  target: function (card, player, target, current) {
                    if (get.tag(card, 'respondSha') && current < 0) return 0.6
                  },
                },
                respondSha: true,
              },
              sub: true,
            },
            yin: {
              mod: {
                cardname: function (card, player) {
                  if (['trick', 'delay'].contains(lib.card[card.name].type)) return 'sha';
                },
                cardnature: function (card, player) {
                  if (['trick', 'delay'].contains(lib.card[card.name].type)) return 'thunder';
                },
                cardUsable: function (card, player) {
                  if (card.name == 'sha' && card.nature == 'thunder') return Infinity;
                },
              },
              ai: {
                effect: {
                  target: function (card, player, target, current) {
                    if (get.tag(card, 'respondSha') && current < 0) return 0.6
                  },
                },
                respondSha: true,
              },
              sub: true,
            },
          },
          ai: {
            fireAttack: true,
            halfneg: true,
            threaten: 1.05,
          },
        },
        "PSlb_jieying": {
          audio: "nzry_jieying",
          locked: true,
          global: "PSlb_jieying_3",
          ai: {
            effect: {
              target: function (card) {
                if (card.name == 'tiesuo') return 'zeroplayertarget';
              },
            },
          },
          group: ["PSlb_jieying_1", "PSlb_jieying_2"],
          subSkill: {
            "1": {
              audio: "nzry_jieying",
              trigger: {
                player: ["linkBefore", "enterGame"],
                global: "phaseBefore",
              },
              forced: true,
              filter: function (event, player) {
                if (event.name == 'link') return player.isLinked();
                return (event.name != 'phase' || game.phaseNumber == 0) && !player.isLinked();
              },
              content: function () {
                if (trigger.name != 'link') player.link(true);
                else trigger.cancel();
              },
              sub: true,
            },
            "2": {
              audio: "nzry_jieying",
              trigger: {
                player: ["changeHp", "loseMaxHpAfter"],
              },
              direct: true,
              content: function () {
                "step 0"
                player.draw();
                if (game.hasPlayer(function (current) {
                  return current != player && !current.isLinked();
                })) player.chooseTarget(true, '请选择【结营】的目标', function (card, player, target) {
                  return target != player && !target.isLinked();
                }).ai = function (target) {
                  return 1 + Math.random();
                };
                else event.finish();
                "step 1"
                if (result.bool) {
                  player.line(result.targets);
                  player.logSkill('PSlb_jieying');
                  result.targets[0].link(true);
                } else {
                  event.finish();
                };
              },
              sub: true,
            },
            "3": {
              mod: {
                maxHandcard: function (player, num) {
                  if (game.countPlayer(function (current) { return current.hasSkill('PSlb_jieying') }) > 0 && player.isLinked()) return num + 2;
                },
              },
              sub: true,
            },
          },
        },
        PSsanchen: {
          audio: "sanchen",
          enable: "phaseUse",
          usable: 3,
          init: function (player) {
            if (!player.storage.PSsanchen) player.storage.PSsanchen = 0;
          },
          content: function () {
            'step 0'
            player.draw(3);
            player.storage.PSsanchen++;
            'step 1'
            if (!game.hasPlayer(current => { return current.countCards('h') > 0 && current != player })) { event.finish(); return; }
            player.chooseTarget('弃置一名其他角色手牌').set('filterTarget', function (card, player, target) {
              return target != player && target.countCards('h') > 0;
            }).set('ai', function (target) {
              var player = _status.event.player;
              return -get.attitude(player, target);
            });
            'step 2'
            if (result.bool) {
              var target = result.targets[0];
              player.logSkill('PSsanchen', target);
              player.discardPlayerCard(target, [1, Infinity], 'h', false, 'visible').set('filterButton', function (button) {
                for (var i = 0; i < ui.selected.buttons.length; i++) {
                  if (get.suit(button.link) == get.suit(ui.selected.buttons[i].link)) return false;
                };
                return true;
              }).set('ai', function (card) {
                return 10 - target.hp - get.value(card);
              }).set('prompt', '三陈：弃置' + get.translation(target) + '花色不同的牌').set('complexCard', true);
            }
          },
          ai: {
            order: 10,
          },
        },
        PSzhaotao: {
          audio: "zhaotao",
          forbid: ["guozhan"],
          trigger: {
            player: "phaseJieshuBegin",
          },
          forced: true,
          juexingji: true,
          skillAnimation: true,
          animationColor: "thunder",
          filter: function (event, player) {
            return player.storage.PSsanchen && player.storage.PSsanchen > 2;
          },
          content: function () {
            player.awakenSkill('PSzhaotao');
            player.gainMaxHp();
            player.recover();
            if (!player.isDisabledJudge()) {
              player.disableJudge();
              game.log(player, '废除了判定区');
            }
            player.addSkillLog('PSjin_miewu');
          },
          derivation: "PSjin_miewu",
        },
        PSpozhu: {
          audio: "pozhu",
          enable: "phaseUse",
          filter: function (event, player) {
            return player.countCards('he') > 1;
          },
          filterCard: function () {
            if (ui.selected.targets.length) return false;
            return true;
          },
          position: "he",
          selectCard: 2,
          complexSelect: true,
          complexCard: true,
          filterTarget: function (card, player, target) {
            return target != player;
          },
          check: function (card) {
            return 6 - get.value(card);
          },
          content: function () {
            target.damage('nocard');
          },
          ai: {
            damage: true,
            order: 2,
            result: {
              target: function (player, target) {
                return get.damageEffect(target, player);
              },
            },
            threaten: 1.5,
            expose: 0.3,
          },
        },
        "PSjin_miewu": {
          audio: "spmiewu",
          trigger: {
            player: "phaseJudgeBefore",
          },
          forced: true,
          filter: function (event, player) {
            return player.isDisabledJudge();
          },
          content: function () {
            'step 0'
            trigger.cancel();
            'step 1'
            var next = player.phaseDraw();
            event.next.remove(next);
            trigger.getParent().next.push(next);
          },
          ai: {
            effect: {
              target: function (card, player, target) {
                if (get.type(card) == 'delay') return 'zerotarget';
              },
            },
          },
        },
        "PSsb_pingjian": {
          audio: "ext:PS武将/audio/skill:2",
          trigger: {
            player: ["damageEnd", "phaseJieshuBegin"],
          },
          initList: function () {
            var list = [];
            if (_status.connectMode) var list = get.charactersOL();
            else {
              var list = [];
              for (var i in lib.character) {
                if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) continue;
                list.push(i);
              }
            }
            game.countPlayer2(function (current) {
              list.remove(current.name);
              list.remove(current.name1);
              list.remove(current.name2);
              if (current.storage.rehuashen && current.storage.rehuashen.character) list.removeArray(current.storage.rehuashen.character)
            });
            _status.characterlist = list;
          },
          frequent: true,
          //搬运魔改自“天牢令”的chooseToFuHan函数，已得到原作者允许，感谢铝宝和雷佬
          chooseToPingJian: function () {
            'step 0'
            var list1 = event.list1,
              list2 = event.list2;
            var switchToAuto = function () {
              _status.imchoosing = false;
              var newList = list2.flat();
              for (var i = 0; i < newList.length; i++) {
                if (lib.skill[newList[i]].ai && lib.skill[newList[i]].ai.combo) newList.remove(newList[i]);
              }
              event._result = {
                bool: true,
                skills: newList.randomGets(event.total),
              };
              if (event.initbg) event.initbg.close();
              if (event.control) event.control.close();
            };
            var chooseButton = function (list1, list2) {
              var event = _status.event;
              if (!event._result) event._result = {};
              event._result.skills = [];
              if (game.TLHasExt('十周年')) {
                var con = document.getElementById('dui-controls');
                if (con) con.classList.add('Tlao_confirmdown2');
              }
              event.initbg = ui.create.div('.Tlao_initbg', document.body);
              event.initbg.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                game.TLremoveSkillInfo();
              }, true)
              var initDialog = ui.create.div('.Tlao_init', event.initbg);
              initDialog.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                game.TLremoveSkillInfo();
              }, true)
              if (!game.TLHasExt('十周年')) initDialog.style.transform = 'translate(-50%,-90%)';
              var initTopic = ui.create.div('.Tlao_inittishi', initDialog);
              initTopic.textContent = event.topic;
              game.TLCreateStand(player, initDialog, 266, 1);
              var initBord = ui.create.div('', initDialog);
              initBord.style.cssText = 'width:586px;height:216px;top:33px;right:60px;positon:"absolute";';
              var skills = event.list2.flat(), num = 0;
              for (var i = 0; i < event.list1.length; i++) {
                var x = i * (104 - list1.length * 4) + (8 - list1.length) * 35 + 35;
                game.TLCreateHead(event.list1[i], initBord, 68, x, 12);
                for (var j = 0; j < event.list2[i].length; j++) {
                  var td = ui.create.div('.Tlao_skillnode', initBord);
                  if (get.info(list2[i][j]).limited || get.info(list2[i][j]).juexingji) td.classList.add('Tlao_skillnodelimit');
                  td.link = skills[num];
                  num++;
                  td.textContent = get.translation(event.list2[i][j]);
                  td.style.left = (x - 3) + 'px';
                  td.style.top = (84 + j * 40) + 'px';
                  td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                    this.style.animation = 'initbutton 0.2s forwards';
                    this.addEventListener('animationend', function () { this.style.animation = ''; });
                    game.TLremoveSkillInfo();
                    if (this.classList.contains('Tlao_initselected')) {
                      this.classList.remove('Tlao_initselected');
                      event._result.skills.remove(this.link);
                    } else if (this.classList.contains('Tlao_initselected2')) {
                      this.classList.remove('Tlao_initselected2');
                      event._result.skills.remove(this.link);
                    } else {
                      if (event._result.skills.length < event.total) {
                        if (this.classList.contains('Tlao_skillnodelimit')) this.classList.add('initselected2');
                        else this.classList.add('Tlao_initselected');
                        event._result.skills.push(this.link);
                      }
                      game.TLcreateSkillInfo(this.link, event.initbg);
                    }
                  }, true)
                }
              }
              var prompt = ui.create.div('', initDialog);
              prompt.style.cssText = 'width:100%;height:20px;left:0;bottom:0;text-align:center;font-family:"yuanli";font-size:20px;line-height:18px;color:#f1dfcc;filter: drop-shadow(1px 0 0 #664934) drop-shadow(-1px 0 0 #664934) drop-shadow(0 1px 0 #664934) drop-shadow(0 -1px 0 #664934);transform:translateY(220%);letter-spacing:3px;pointer-events:none;';
              prompt.textContent = '请选择' + get.cnNumber(event.total) + '个武将技能';
              event.switchToAuto = function () {
                if (game.TLHasExt('十周年')) {
                  var con = document.getElementById('dui-controls');
                  if (con) con.classList.remove('Tlao_confirmdown2');
                }
                event.initbg.remove();
                event.control.close();
                game.resume();
                _status.imchoosing = false;
              };
              event.control = ui.create.control('ok', function (link) {
                if (game.TLHasExt('十周年')) {
                  var con = document.getElementById('dui-controls');
                  if (con) con.classList.remove('Tlao_confirmdown2');
                }
                event.initbg.remove();
                event.control.close();
                game.resume();
                _status.imchoosing = false;
              });
              game.pause();
              game.countChoose();
            };
            if (event.isMine()) {
              chooseButton(list1, list2);
            }
            else if (event.isOnline()) {
              event.player.send(chooseButton, list1, list2);
              event.player.wait();
              game.pause();
            }
            else {
              switchToAuto();
            }
            'step 1'
            var map = event.result || result;
            if (map && map.skills && map.skills.length) {
              for (var i of map.skills) {
                if (event.triggername == 'phaseUse') {
                  player.storage.PSsb_pingjian.add(i);
                  player.addTempSkill(i, 'phaseUseEnd');
                  player.addTempSkill('PSsb_pingjian_temp', 'phaseUseEnd');
                  if (!player.storage.PSsb_pingjian_temp) player.storage.PSsb_pingjian_temp = [];
                  player.storage.PSsb_pingjian_temp.add(i);
                }
                else {
                  player.storage.PSsb_pingjian.add(i);
                  player.addTempSkill(i, event.triggername == 'damageEnd' ? 'damageAfter' : 'phaseJieshu');
                }
              }
            }
            game.broadcastAll(function (list) {
              game.expandSkills(list);
              for (var i of list) {
                var info = lib.skill[i];
                if (!info) continue;
                if (!info.audioname2) info.audioname2 = {};
                info.audioname2.old_yuanshu = 'weidi';
              }
            }, map.skills);
          },
          content: function () {
            'step 0'
            if (!player.storage.PSsb_pingjian) player.storage.PSsb_pingjian = [];
            event._result = { bool: true };
            'step 1'
            if (result.bool) {
              if (!_status.characterlist) {
                lib.skill.PSsb_pingjian.initList();
              }
              var list = [];
              var skills = [];
              var map = [];
              _status.characterlist.randomSort();
              var name2 = event.triggername;
              for (var i = 0; i < _status.characterlist.length; i++) {
                var name = _status.characterlist[i];
                if (!name || (name.indexOf('zuoci') != -1 || name.indexOf('xushao') != -1)) continue;
                var skills2 = lib.character[name][3];
                for (var j = 0; j < skills2.length; j++) {
                  if (player.storage.PSsb_pingjian.contains(skills2[j])) continue;
                  if (skills.contains(skills2[j]) && lib.skill.PSfushi.characterList().contains(name)) {
                    list.add(name);
                    if (!map[name]) map[name] = [];
                    map[name].push(skills2[j]);
                    skills.add(skills2[j]);
                    continue;
                  }
                  var list2 = [skills2[j]];
                  game.expandSkills(list2);
                  for (var k = 0; k < list2.length; k++) {
                    var info = lib.skill[list2[k]];
                    if (!info || !info.trigger || !info.trigger.player || info.silent || info.limited || info.juexingji || info.zhuanhuanji || info.hiddenSkill || info.dutySkill) continue;
                    if ((info.trigger.player == name2 || Array.isArray(info.trigger.player) && info.trigger.player.contains(name2)) && lib.skill.PSfushi.characterList().contains(name)) {
                      if (info.init || info.ai && (info.ai.combo || info.ai.notemp || info.ai.neg)) continue;
                      if (info.filter) {
                        try {
                          var bool = info.filter(trigger, player, name2);
                          if (!bool) continue;
                        }
                        catch (e) {
                          continue;
                        }
                      }
                      list.add(name);
                      if (!map[name]) map[name] = [];
                      map[name].push(skills2[j]);
                      skills.add(skills2[j]);
                      break;
                    }
                  }
                }
                if (list.length > 5) break;
              }
              if (!skills.length) {
                //player.draw();
                event.finish();
              }
              else {
                //skills.unshift('摸一张牌');
                if (player.isUnderControl()) {
                  game.swapPlayerAuto(player);
                }
                if (lib.config.extensions && lib.config.extensions.contains('天牢令') && lib.config['extension_天牢令_enable'] && game.TLHasExt) {
                  var skillx = skills.slice(0);
                  skills = [];
                  for (var i = 0; i < list.length; i++) {
                    skills[i] = (lib.character[list[i]][3] || []).filter(function (skill) {
                      return skillx.contains(skill);
                    });
                  }
                  if (!list.length || !skills.length) { event.finish(); return; }
                  var next = game.createEvent('chooseToPingJian');
                  next.player = player;
                  next.list1 = list;
                  next.list2 = skills;
                  next.topic = '评荐';
                  next.total = 2;
                  next.triggername = event.triggername == 'damageEnd' ? 'damageAfter' : 'phaseJieshu';
                  next.setContent(lib.skill.PSsb_pingjian.chooseToPingJian);
                  event.finish();
                  return;
                }
                var switchToAuto = function () {
                  _status.imchoosing = false;
                  event._result = {
                    bool: true,
                    skills: skills.randomGets(2),
                  };
                  if (event.dialog) event.dialog.close();
                  if (event.control) event.control.close();
                };
                var chooseButton = function (list, skills) {
                  var event = _status.event;
                  if (!event._result) event._result = {};
                  event._result.skills = [];
                  var rSkill = event._result.skills;
                  var dialog = ui.create.dialog('请选择发动至多两个技能', [list, 'character'], 'hidden');
                  event.dialog = dialog;
                  var table = document.createElement('div');
                  table.classList.add('add-setting');
                  table.style.margin = '0';
                  table.style.width = '100%';
                  table.style.position = 'relative';
                  for (var i = 0; i < skills.length; i++) {
                    var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                    td.link = skills[i];
                    table.appendChild(td);
                    td.innerHTML = '<span>' + get.translation(skills[i]) + '</span>';
                    td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                      if (_status.dragged) return;
                      if (_status.justdragged) return;
                      _status.tempNoButton = true;
                      setTimeout(function () {
                        _status.tempNoButton = false;
                      }, 500);
                      var link = this.link;
                      if (!this.classList.contains('bluebg')) {
                        if (rSkill.length >= 2) return;
                        rSkill.add(link);
                        this.classList.add('bluebg');
                      }
                      else {
                        this.classList.remove('bluebg');
                        rSkill.remove(link);
                      }
                    });
                  }
                  dialog.content.appendChild(table);
                  dialog.add('　　');
                  dialog.open();

                  event.switchToAuto = function () {
                    event.dialog.close();
                    event.control.close();
                    game.resume();
                    _status.imchoosing = false;
                  };
                  event.control = ui.create.control('ok', function (link) {
                    event.dialog.close();
                    event.control.close();
                    game.resume();
                    _status.imchoosing = false;
                  });
                  for (var i = 0; i < event.dialog.buttons.length; i++) {
                    event.dialog.buttons[i].classList.add('selectable');
                  }
                  game.pause();
                  game.countChoose();
                };
                if (event.isMine()) {
                  chooseButton(list, skills);
                }
                else if (event.isOnline()) {
                  event.player.send(chooseButton, list, skills);
                  event.player.wait();
                  game.pause();
                }
                else {
                  switchToAuto();
                }
              }
            }
            else event.finish();
            'step 2'
            var map = event.result || result;
            if (map && map.skills && map.skills.length) {
              for (var i of map.skills) {
                player.storage.PSsb_pingjian.add(i);
                player.addTempSkill(i, event.triggername == 'damageEnd' ? 'damageAfter' : 'phaseJieshu');
              }
            }
            game.broadcastAll(function (list) {
              game.expandSkills(list);
              for (var i of list) {
                var info = lib.skill[i];
                if (!info) continue;
                if (!info.audioname2) info.audioname2 = {};
                info.audioname2.old_yuanshu = 'weidi';
              }
            }, map.skills);


            if (result.control == '摸一张牌') {
              player.draw();
              return;
            }

          },
          group: "PSsb_pingjian_use",
          "phaseUse_special": ["xinfu_lingren"],
          subSkill: {
            use: {
              usable: 1,
              sub: true,
              audio: "pingjian",
              enable: "phaseUse",
              position: "he",
              content: function () {
                'step 0'
                if (!player.storage.PSsb_pingjian) player.storage.PSsb_pingjian = [];
                event._result = { bool: true };
                'step 1'
                if (result.bool) {
                  var list = [];
                  var skills = [];
                  var map = [];
                  if (!_status.characterlist) {
                    lib.skill.PSsb_pingjian.initList();
                  }
                  _status.characterlist.randomSort();
                  for (var i = 0; i < _status.characterlist.length; i++) {
                    var name = _status.characterlist[i];
                    if (!name || (name.indexOf('zuoci') != -1 || name.indexOf('xushao') != -1)) continue;
                    var skills2 = lib.character[name][3];
                    for (var j = 0; j < skills2.length; j++) {
                      if (player.storage.PSsb_pingjian.contains(skills2[j])) continue;
                      if ((skills.contains(skills2[j]) || lib.skill.PSsb_pingjian.phaseUse_special.contains(skills2[j])) && lib.skill.PSfushi.characterList().contains(name)) {
                        list.add(name);
                        if (!map[name]) map[name] = [];
                        map[name].push(skills2[j]);
                        skills.add(skills2[j]);
                        continue;
                      }
                      var list2 = [skills2[j]];
                      game.expandSkills(list2);
                      for (var k = 0; k < list2.length; k++) {
                        var info = lib.skill[list2[k]];
                        if (!info || !info.enable || info.viewAs || info.limited || info.juexingji || info.zhuanhuanji || info.hiddenSkill || info.dutySkill) continue;
                        if ((info.enable == 'phaseUse' || Array.isArray(info.enable) && info.enable.contains('phaseUse')) && lib.skill.PSfushi.characterList().contains(name)) {
                          if (info.init || info.onChooseToUse || info.ai && (info.ai.combo || info.ai.notemp || info.ai.neg)) continue;
                          if (info.filter) {
                            try {
                              var bool = info.filter(event.getParent(2), player);
                              if (!bool) continue;
                            }
                            catch (e) {
                              continue;
                            }
                          }
                          list.add(name);
                          if (!map[name]) map[name] = [];
                          map[name].push(skills2[j]);
                          skills.add(skills2[j]);
                          break;
                        }
                      }
                    }
                    if (list.length > 5) break;
                  }
                  if (!skills.length) {
                    //player.draw();
                    event.finish();
                  }
                  else {
                    if (player.isUnderControl()) {
                      game.swapPlayerAuto(player);
                    }
                    if (lib.config.extensions && lib.config.extensions.contains('天牢令') && lib.config['extension_天牢令_enable'] && game.TLHasExt) {
                      var skillx = skills.slice(0);
                      skills = [];
                      for (var i = 0; i < list.length; i++) {
                        skills[i] = (lib.character[list[i]][3] || []).filter(function (skill) {
                          return skillx.contains(skill);
                        });
                      }
                      if (!list.length || !skills.length) { event.finish(); return; }
                      var next = game.createEvent('chooseToPingJian');
                      next.player = player;
                      next.list1 = list;
                      next.list2 = skills;
                      next.topic = '评荐';
                      next.total = 2;
                      next.triggername = 'phaseUse';
                      next.setContent(lib.skill.PSsb_pingjian.chooseToPingJian);
                      event.finish();
                      return;
                    }//skills.unshift('摸一张牌');
                    var switchToAuto = function () {
                      _status.imchoosing = false;
                      event._result = {
                        bool: true,
                        skills: skills.randomGets(2),
                      };
                      if (event.dialog) event.dialog.close();
                      if (event.control) event.control.close();
                    };
                    var chooseButton = function (list, skills) {
                      var event = _status.event;
                      if (!event._result) event._result = {};
                      event._result.skills = [];
                      var rSkill = event._result.skills;
                      var dialog = ui.create.dialog('请选择发动至多两个技能', [list, 'character'], 'hidden');
                      event.dialog = dialog;
                      var table = document.createElement('div');
                      table.classList.add('add-setting');
                      table.style.margin = '0';
                      table.style.width = '100%';
                      table.style.position = 'relative';
                      for (var i = 0; i < skills.length; i++) {
                        var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                        td.link = skills[i];
                        table.appendChild(td);
                        td.innerHTML = '<span>' + get.translation(skills[i]) + '</span>';
                        td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                          if (_status.dragged) return;
                          if (_status.justdragged) return;
                          _status.tempNoButton = true;
                          setTimeout(function () {
                            _status.tempNoButton = false;
                          }, 500);
                          var link = this.link;
                          if (!this.classList.contains('bluebg')) {
                            if (rSkill.length >= 2) return;
                            rSkill.add(link);
                            this.classList.add('bluebg');
                          }
                          else {
                            this.classList.remove('bluebg');
                            rSkill.remove(link);
                          }
                        });
                      }
                      dialog.content.appendChild(table);
                      dialog.add('　　');
                      dialog.open();

                      event.switchToAuto = function () {
                        event.dialog.close();
                        event.control.close();
                        game.resume();
                        _status.imchoosing = false;
                      };
                      event.control = ui.create.control('ok', function (link) {
                        event.dialog.close();
                        event.control.close();
                        game.resume();
                        _status.imchoosing = false;
                      });
                      for (var i = 0; i < event.dialog.buttons.length; i++) {
                        event.dialog.buttons[i].classList.add('selectable');
                      }
                      game.pause();
                      game.countChoose();
                    };
                    if (event.isMine()) {
                      chooseButton(list, skills);
                    }
                    else if (event.isOnline()) {
                      event.player.send(chooseButton, list, skills);
                      event.player.wait();
                      game.pause();
                    }
                    else {
                      switchToAuto();
                    }
                  }
                }
                else event.finish();
                'step 2'
                var map = event.result || result;
                if (map && map.skills && map.skills.length) {
                  for (var i of map.skills) {
                    player.storage.PSsb_pingjian.add(i);
                    player.addTempSkill(i, 'phaseUseEnd');
                    player.addTempSkill('PSsb_pingjian_temp', 'phaseUseEnd');
                    if (!player.storage.PSsb_pingjian_temp) player.storage.PSsb_pingjian_temp = [];
                    player.storage.PSsb_pingjian_temp.add(i);
                  }
                }


                //event.getParent(2).goto(0);
              },
              ai: {
                order: 10,
                result: {
                  player: 1,
                },
              },
            },
            temp: {
              onremove: true,
              trigger: {
                player: ["useSkillBegin", "useCard1"],
              },
              silent: true,
              firstDo: true,
              filter: function (event, player) {
                var info = lib.skill[event.skill];
                if (!info) return false;
                if (!player.storage.PSsb_pingjian_temp) return false;
                if (player.storage.PSsb_pingjian_temp.contains(event.skill)) return true;
                if (player.storage.PSsb_pingjian_temp.contains(info.sourceSkill) || player.storage.PSsb_pingjian_temp.contains(info.group)) return true;
                if (Array.isArray(info.group) && (info.group.contains(player.storage.PSsb_pingjian_temp[0]) || info.group.contains(player.storage.PSsb_pingjian_temp[1]))) return true;
                return false;
              },
              content: function () {
                var info = lib.skill[trigger.skill];
                for (var i of player.storage.PSsb_pingjian_temp) {
                  if (Array.isArray(info.group) && info.group.contains(i)) {
                    player.removeSkill(i);
                    player.storage.PSsb_pingjian_temp.remove(i);
                    break;
                  }
                  if (info.sourceSkill == i || info.group == i || trigger.skill == i) {
                    player.removeSkill(i);
                    player.storage.PSsb_pingjian_temp.remove(i);
                    break;
                  }
                }
                if (!player.storage.PSsb_pingjian_temp.length) {
                  player.removeSkill('PSsb_pingjian_temp');
                }
              },
              forced: true,
              popup: false,
              sub: true,
            },
          },
        },
        PSwengua: {
          global: "PSwengua_use",
          group: ["PSwengua_tag", "PSwengua_draw"],
          audio: "wengua",
          subSkill: {
            use: {
              audio: "wengua",
              enable: "phaseUse",
              filter: function (event, player) {
                if (player.hasSkill('wengua3')) return false;
                return player.countCards('he') && game.hasPlayer(function (current) {
                  return current.hasSkill('PSwengua');
                });
              },
              log: false,
              delay: false,
              filterCard: function (card, player) {
                var list = game.filterPlayer(function (current) {
                  return current.hasSkill('PSwengua');
                });
                if (list.length == 1 && list[0] == player && player.storage.PSfuzhu) return false;
                return true;
              },
              selectCard: function () {
                var player = _status.event.player;
                var list = game.filterPlayer(function (current) {
                  return current.hasSkill('PSwengua');
                });
                if (list.length == 1 && list[0] == player && player.storage.PSfuzhu) return -1;
                return 1;
              },
              discard: false,
              lose: false,
              position: "he",
              prompt: function () {
                var player = _status.event.player;
                var list = game.filterPlayer(function (current) {
                  return current.hasSkill('PSwengua');
                });
                if (list.length == 1 && list[0] == player) {
                  if (player.storage.PSfuzhu) return;
                  return '将一张牌置于牌堆顶或是牌堆底';
                }
                var str = '将一张牌交给' + get.translation(list);
                if (list.length > 1) str += '中的一人';
                return str;
              },
              check: function (card) {
                if (card.name == 'sha') return 5;
                return 8 - get.value(card);
              },
              content: function () {
                "step 0"
                var targets = game.filterPlayer(function (current) {
                  return current.hasSkill('PSwengua');
                });
                if (targets.length == 1) {
                  event.target = targets[0];
                  event.goto(2);
                }
                else if (targets.length > 0) {
                  player.chooseTarget(true, '选择【问卦】的目标', function (card, player, target) {
                    return _status.event.list.contains(target);
                  }).set('list', targets).set('ai', function (target) {
                    var player = _status.event.player;
                    return get.attitude(player, target);
                  });
                }
                else {
                  event.finish();
                }
                "step 1"
                if (result.bool && result.targets.length) {
                  event.target = result.targets[0];
                }
                else {
                  event.finish();
                }
                "step 2"
                if (event.target) {
                  player.logSkill('PSwengua', event.target);
                  player.addTempSkill('wengua3', 'phaseUseEnd');
                  event.card = cards[0];
                  if (event.target != player) {
                    player.give(cards, event.target);
                  }
                }
                else {
                  event.finish();
                }
                delete _status.noclearcountdown;
                game.stopCountChoose();
                "step 3"
                if (event.target.storage.PSfuzhu) {
                  event.goto(8);
                }
                "step 4"
                if (event.target.getCards('he').contains(event.card)) {
                  event.target.chooseControlList('问卦', '将' + get.translation(event.card) + '置于牌堆顶', '将' + get.translation(event.card) + '置于牌堆底', event.target == player, function () {
                    if (get.attitude(event.target, player) < 0) return 2;
                    return 1;
                  });
                }
                else {
                  event.finish();
                }
                "step 5"
                event.index = result.index;
                if (event.index == 0 || event.index == 1) {
                  var next = event.target.lose(event.card, ui.cardPile);
                  if (event.index == 0) next.insert_card = true;
                  game.broadcastAll(function (player) {
                    var cardx = ui.create.card();
                    cardx.classList.add('infohidden');
                    cardx.classList.add('infoflip');
                    player.$throw(cardx, 1000, 'nobroadcast');
                  }, event.target);
                }
                else event.finish();
                "step 6"
                game.delay();
                "step 7"
                if (event.index == 1) {
                  game.log(event.target, '将获得的牌置于牌堆底');
                  if (ui.cardPile.childElementCount == 1 || player == event.target) {
                    player.draw();
                  }
                  else {
                    game.asyncDraw([player, target], null, null);
                  }
                }
                else if (event.index == 0) {
                  game.log(player, '将获得的牌置于牌堆顶');
                  if (ui.cardPile.childElementCount == 1 || player == event.target) {
                    player.draw('bottom');
                  }
                  else {
                    game.asyncDraw([player, target], null, null, true);
                  }
                }
                event.finish();
                "step 8"
                event.target.chooseControl(['从牌堆顶摸牌', '从牌堆底摸牌']).set('ai', () => { return '从牌堆顶摸牌' });
                "step 9"
                if (result.index == 0) {
                  if (ui.cardPile.childElementCount == 1 || player == event.target) {
                    player.draw();
                  }
                  else {
                    game.asyncDraw([player, target], null, null);
                  }
                }
                else {
                  if (ui.cardPile.childElementCount == 1 || player == event.target) {
                    player.draw('bottom');
                  }
                  else {
                    game.asyncDraw([player, target], null, null, true);
                  }
                }
              },
              ai: {
                order: 2,
                threaten: 1.5,
                result: {
                  player: function (player, target) {
                    var target = game.findPlayer(function (current) {
                      return current.hasSkill('PSwengua');
                    });
                    if (target) {
                      return get.attitude(player, target);
                    }
                  },
                },
              },
              sub: true,
            },
            tag: {
              mod: {
                ignoredHandcard: function (card, player) {
                  if (player.storage.PSfuzhu && card.hasGaintag('wengua')) return true;
                },
              },
              trigger: {
                player: "gainAfter",
              },
              forced: true,
              filter: function (event, player) {
                if (!player.storage.PSfuzhu) return false;
                return event.getParent().name == 'draw' && event.getParent(2).name == 'PSwengua_use';
              },
              content: function () {
                player.addGaintag(trigger.cards, "wengua");
              },
              onremove: function () {
                player.removeGaintag("wengua");
              },
              "audioname2": {
                "old_yuanshu": "weidi",
              },
              sub: true,
            },
            draw: {
              trigger: {
                player: "loseAfter",
                global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
              },
              forced: true,
              filter: function (event, player) {
                if (!player.storage.PSfuzhu) return false;
                var evt = event.getl(player);
                if (!evt || !evt.cards2 || !evt.cards2.length) return false;
                if (event.name == 'lose') {
                  for (var i in event.gaintag_map) {
                    if (event.gaintag_map[i].contains('wengua')) return true;
                  }
                  return false;
                }
                return player.hasHistory('lose', function (evt) {
                  if (event != evt.getParent()) return false;
                  for (var i in evt.gaintag_map) {
                    if (evt.gaintag_map[i].contains('wengua')) return true;
                  }
                  return false;
                });
              },
              content: function () {
                player.draw();
              },
              sub: true,
            },
          },
        },
        "PSwengua_1": {
          audio: "wengua",
        },
        PSfuzhu: {
          audio: "fuzhu",
          dutySkill: true,
          derivation: "PSwengua_1",
          group: ["PSfuzhu_achieve", "PSfuzhu_fail"],
          trigger: {
            global: "phaseJieshuBegin",
          },
          filter: function (event, player) {
            return event.player != player && event.player.hasSex('male') && ui.cardPile.childElementCount <= player.hp * 10;
          },
          check: function (event, player) {
            return get.attitude(player, event.player) < 0 && get.effect(event.player, { name: 'sha' }, player, player) > 0;
          },
          logTarget: "player",
          onWash: function () {
            _status.event.getParent('PSfuzhu').washed = false;
            return 'remove';
          },
          content: function () {
            'step 0'
            event.washed = false;
            lib.onwash.push(lib.skill.PSfuzhu.onWash);
            event.total = game.players.length + game.dead.length;
            if (!player.storage.PSfuzhu_target) player.storage.PSfuzhu_target = trigger.player;
            'step 1'
            event.total--;
            var card = get.cardPile2(function (card) {
              return card.name == 'sha' && player.canUse(card, trigger.player, false);
            });
            if (card) {
              card.remove();
              game.updateRoundNumber();
              player.useCard(card, trigger.player, false);
            }
            'step 2'
            if (event.total > 0 && !event.washed && ui.cardPile.childElementCount <= player.hp * 10 && trigger.player.isIn()) event.goto(1);
            'step 3'
            lib.onwash.remove(lib.skill.PSfuzhu.onWash);
            var cards = get.cards(ui.cardPile.childElementCount + 1);
            for (var i = 0; i < cards.length; i++) {
              ui.cardPile.insertBefore(cards[i], ui.cardPile.childNodes[get.rand(ui.cardPile.childElementCount)]);
            }
            game.updateRoundNumber();
          },
          ai: {
            threaten: 1.5,
          },
          subSkill: {
            achieve: {
              audio: "ext:PS武将/audio/skill:2",
              trigger: {
                source: "dieAfter",
              },
              forced: true,
              skillAnimation: true,
              animationColor: "fire",
              filter: function (event, player) {
                return event.getParent(5).name == 'PSfuzhu' && event.player == player.storage.PSfuzhu_target;
              },
              content: function () {
                game.log(player, '成功完成使命');
                game.log(player, '升级了〖问卦〗');
                player.popup('使命成功', 'wood');
                player.awakenSkill('PSfuzhu');
                player.storage.PSfuzhu = true;
                var num = 0;
                player.getHistory('sourceDamage', function (evt) {
                  if (evt.card && evt.getParent(3).name == 'PSfuzhu') num += evt.num;
                });
                num = Math.ceil(num / 2);
                player.draw(num);
              },
              sub: true,
            },
            fail: {
              audio: "ext:PS武将/audio/skill:2",
              trigger: {
                player: "PSfuzhuAfter",
              },
              forced: true,
              filter: function (event, player) {
                return true;
              },
              content: function () {
                game.log(player, '使命失败');
                player.popup('使命失败', 'fire');
                player.awakenSkill('PSfuzhu');
                if (player.isDamaged()) player.recover();
                else player.draw();
              },
              sub: true,
            },
          },
        },

        PSluanwu: {
          audio: "luanwu",
          enable: "phaseUse",
          usable: 1,
          filterTarget: true,
          selectTarget: [1, Infinity],
          multiline: true,
          content: function () {
            var targetx = targets.slice().sortBySeat(target)[1];
            var card = { name: 'sha', isCard: true };
            if (target.canUse(card, targetx, false)) target.useCard(card, targetx, false);
          },
          ai: {
            threaten: 3,
            order: 7,
            result: {
              target: -1,
            },
          },
        },
        PSwansha: {
          audio: "ext:PS武将/audio/skill:2",
          trigger: {
            global: "dying",
          },
          forced: true,
          logTarget: function (event, player) {
            return event.player;
          },
          preHidden: true,
          firstDo: true,
          filter: function (event, player, name) {
            return _status.currentPhase == player && event.player != player;
          },
          content: function () {
            'step 0'
            player.line(trigger.player);
            trigger.player.die({ source: trigger.source });
            'step 1'
            if (!trigger.player.isAlive()) {
              trigger.cancel(true);
            }
          },
        },
        PSduorui: {
          audio: "drlt_duorui",
          trigger: {
            source: "damageSource",
          },
          filter: function (event, player) {
            var list = [];
            var listm = [];
            var listv = [];
            if (event.player.name1 != undefined) listm = lib.character[event.player.name1][3];
            else listm = lib.character[event.player.name][3];
            if (event.player.name2 != undefined) listv = lib.character[event.player.name2][3];
            listm = listm.concat(listv);
            var func = function (skill) {
              var info = get.info(skill);
              if (!info || info.charlotte || info.hiddenSkill) return false;
              return true;
            };
            for (var i = 0; i < listm.length; i++) {
              if (func(listm[i])) list.add(listm[i]);
            }
            for (var i in event.player.disabledSkills) {
              if (list.contains(i)) list.remove(i);
            };
            return player != event.player && event.player.isIn() && list.length && player.isPhaseUsing();
          },
          check: function (event, player) {
            return true;
          },
          content: function () {
            'step 0'
            var list = [];
            var listm = [];
            var listv = [];
            if (trigger.player.name1 != undefined) listm = lib.character[trigger.player.name1][3];
            else listm = lib.character[trigger.player.name][3];
            if (trigger.player.name2 != undefined) listv = lib.character[trigger.player.name2][3];
            listm = listm.concat(listv);
            var func = function (skill) {
              var info = get.info(skill);
              if (!info || info.charlotte || info.hiddenSkill) return false;
              return true;
            };
            for (var i = 0; i < listm.length; i++) {
              if (func(listm[i])) list.add(listm[i]);
            }
            for (var i in trigger.player.disabledSkills) {
              if (list.contains(i)) list.remove(i);
            };
            event.skills = list;
            'step 1'
            if (event.skills.length > 1) {
              player.chooseControl(event.skills).set('prompt', '请选择禁用' + get.translation(trigger.player) + '的一个技能').set('ai', function () { return event.skills.randomGet() });
            }
            else if (event.skills.length == 1) event._result = { control: event.skills[0] };
            else event.finish();
            'step 2'
            if (!trigger.player.storage.PSduorui) trigger.player.storage.PSduorui = [];
            trigger.player.storage.PSduorui.add(result.control);
            trigger.player.disableSkill('PSduorui_disable', result.control);
            trigger.player.addTempSkill('PSduorui_disable', { player: 'phaseAfter' });
            game.log(trigger.player, '的〖', result.control, '〗失效了');
          },
          group: "PSduorui_add",
          subSkill: {
            add: {
              enable: "phaseUse",
              filter: function (event, player) {
                return player.countDisabled() < 5;
              },
              popup: false,
              content: function () {
                'step 0'
                player.chooseToDisable().ai = function (event, player, list) {
                  if (list.contains('equip5')) return 'equip5';
                  return list.randomGet();
                };
                'step 1'
                var skills = [], list = [], players = game.filterPlayer(current => current != player);
                for (var target of players) {
                  if (target.name) list.add(target.name);
                  if (target.name2) list.add(target.name2);
                  if (target.name3) list.add(target.name3);
                  skills.addArray(target.getStockSkills('无名杀', '启动').filter(function (skill) {
                    var info = get.info(skill);
                    return info;
                  }));
                }
                var skillsx = [];
                for (var i of skills) {
                  if (player.hasSkill(i)) skillsx.add(i);
                }
                skills.removeArray(skillsx);
                if (!list.length || !skills.length) { event.finish(); return; }
                if (player.isUnderControl()) {
                  game.swapPlayerAuto(player);
                }
                if (lib.config.extensions && lib.config.extensions.contains('天牢令') && lib.config['extension_天牢令_enable'] && game.TLHasExt) {
                  skills = [];
                  for (var i = 0; i < list.length; i++) {
                    skills[i] = (lib.character[list[i]][3] || []).filter(function (skill) {
                      if (player.hasSkill(skill)) return false;
                      return true;
                    });
                  }
                  if (!list.length || !skills.length) { event.finish(); return; }
                  var next = game.createEvent('chooseToFuHan');
                  next.player = player;
                  next.list1 = list;
                  next.list2 = skills;
                  next.topic = '夺锐';
                  next.total = 1;
                  next.setContent(lib.skill.PSfushi.chooseToFuHan);
                  player.logSkill('PSduorui');
                  event.finish();
                  return;
                }
                var switchToAuto = function () {
                  _status.imchoosing = false;
                  event._result = {
                    bool: true,
                    skills: skills.randomGets(),
                  };
                  if (event.dialog) event.dialog.close();
                  if (event.control) event.control.close();
                };
                var chooseButton = function (list, skills) {
                  var event = _status.event;
                  if (!event._result) event._result = {};
                  event._result.skills = [];
                  var rSkill = event._result.skills;
                  var dialog = ui.create.dialog('请选择获得一个技能', [list, 'character'], 'hidden');
                  event.dialog = dialog;
                  var table = document.createElement('div');
                  table.classList.add('add-setting');
                  table.style.margin = '0';
                  table.style.width = '100%';
                  table.style.position = 'relative';
                  for (var i = 0; i < skills.length; i++) {
                    var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                    td.link = skills[i];
                    table.appendChild(td);
                    td.innerHTML = '<span>' + get.translation(skills[i]) + '</span>';
                    td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                      if (_status.dragged) return;
                      if (_status.justdragged) return;
                      _status.tempNoButton = true;
                      setTimeout(function () {
                        _status.tempNoButton = false;
                      }, 500);
                      var link = this.link;
                      if (!this.classList.contains('bluebg')) {
                        if (rSkill.length >= 1) return;
                        rSkill.add(link);
                        this.classList.add('bluebg');
                      }
                      else {
                        this.classList.remove('bluebg');
                        rSkill.remove(link);
                      }
                    });
                  }
                  dialog.content.appendChild(table);
                  dialog.add('　　');
                  dialog.open();

                  event.switchToAuto = function () {
                    event.dialog.close();
                    event.control.close();
                    game.resume();
                    _status.imchoosing = false;
                  };
                  event.control = ui.create.control('ok', function (link) {
                    event.dialog.close();
                    event.control.close();
                    game.resume();
                    _status.imchoosing = false;
                  });
                  for (var i = 0; i < event.dialog.buttons.length; i++) {
                    event.dialog.buttons[i].classList.add('selectable');
                  }
                  game.pause();
                  game.countChoose();
                };
                if (event.isMine()) {
                  chooseButton(list, skills);
                }
                else if (event.isOnline()) {
                  event.player.send(chooseButton, list, skills);
                  event.player.wait();
                  game.pause();
                }
                else {
                  switchToAuto();
                }
                'step 2'
                var map = event.result || result;
                if (map && map.skills && map.skills.length) {
                  player.logSkill('PSduorui');
                  for (var i of map.skills) player.addSkillLog(i);
                }
                game.broadcastAll(function (list) {
                  game.expandSkills(list);
                  for (var i of list) {
                    var info = lib.skill[i];
                    if (!info) continue;
                    if (!info.audioname2) info.audioname2 = {};
                    info.audioname2.old_yuanshu = 'weidi';
                  }
                }, map.skills);
              },
              sub: true,
            },
            disable: {
              onremove: function (player, skill) {
                player.enableSkill(skill);
                delete player.storage.PSduorui;
              },
              locked: true,
              mark: true,
              marktext: "🔒",
              charlotte: true,
              intro: {
                content: function (storage, player, skill) {
                  var list = [];
                  for (var i in player.disabledSkills) {
                    if (player.disabledSkills[i].contains(skill)) list.push(i);
                  };
                  if (list.length) {
                    var str = '失效技能：';
                    for (var i = 0; i < list.length; i++) {
                      if (lib.translate[list[i] + '_info']) str += get.translation(list[i]) + '、';
                    };
                    return str.slice(0, -1);
                  };
                },
              },
              sub: true,
            },
          },
        },
        PSwusheng: {
          mod: {
            aiOrder: function (player, card, num) {
              if (get.itemtype(card) == 'card' && card.name == 'sha' && get.suit(card) == 'heart') return num + 0.2;
              if (get.itemtype(card) == 'card' && card.name == 'sha' && get.suit(card) == 'diamond') return num + 0.1;
            },
            targetInRange: function (card) {
              if (get.suit(card) == 'diamond' && card.name == 'sha') return true;
            },
          },
          locked: false,
          audio: "ext:PS武将/audio/skill:2",
          audioname: ["re_guanyu", "guanzhang", "jsp_guanyu", "guansuo", "re_guanzhang", "dc_jsp_guanyu"],
          enable: ["chooseToRespond", "chooseToUse"],
          filterCard: function (card, player) {
            if (get.zhu(player, 'shouyue')) return true;
            return get.color(card) == 'red';
          },
          position: "hes",
          viewAs: {
            name: "sha",
            isCard: true,
          },
          viewAsFilter: function (player) {
            if (get.zhu(player, 'shouyue')) {
              if (!player.countCards('hes')) return false;
            }
            else {
              if (!player.countCards('hes', { color: 'red' })) return false;
            }
          },
          prompt: "将一张红色牌当杀使用或打出",
          check: function (card) {
            var val = get.value(card);
            if (_status.event.name == 'chooseToRespond') return 1 / Math.max(0.1, val);
            return 5 - val;
          },
          ai: {
            respondSha: true,
            skillTagFilter: function (player) {
              if (get.zhu(player, 'shouyue')) {
                if (!player.countCards('hes')) return false;
              }
              else {
                if (!player.countCards('hes', { color: 'red' })) return false;
              }
            },
            yingbian: function (card, player, targets, viewer) {
              if (get.attitude(viewer, player) <= 0) return 0;
              var base = 0, hit = false;
              if (get.cardtag(card, 'yingbian_hit')) {
                hit = true;
                if (targets.filter(function (target) {
                  return target.hasShan() && get.attitude(viewer, target) < 0 && get.damageEffect(target, player, viewer, get.nature(card)) > 0;
                })) base += 5;
              }
              if (get.cardtag(card, 'yingbian_all')) {
                if (game.hasPlayer(function (current) {
                  return !targets.contains(current) && lib.filter.targetEnabled2(card, player, current) && get.effect(current, card, player, player) > 0;
                })) base += 5;
              }
              if (get.cardtag(card, 'yingbian_damage')) {
                if (targets.filter(function (target) {
                  return get.attitude(player, target) < 0 && (hit || !target.mayHaveShan() || player.hasSkillTag('directHit_ai', true, {
                    target: target,
                    card: card,
                  }, true)) && !target.hasSkillTag('filterDamage', null, {
                    player: player,
                    card: card,
                    jiu: true,
                  })
                })) base += 5;
              }
              return base;
            },
            canLink: function (player, target, card) {
              if (!target.isLinked() && !player.hasSkill('wutiesuolian_skill')) return false;
              if (target.mayHaveShan() && !player.hasSkillTag('directHit_ai', true, {
                target: target,
                card: card,
              }, true)) return false;
              if (player.hasSkill('jueqing') || player.hasSkill('gangzhi') || target.hasSkill('gangzhi')) return false;
              return true;
            },
            basic: {
              useful: [5, 3, 1],
              value: [5, 3, 1],
            },
            order: function (item, player) {
              if (player.hasSkillTag('presha', true, null, true)) return 10;
              if (lib.linked.contains(get.nature(item))) {
                if (game.hasPlayer(function (current) {
                  return current != player && current.isLinked() && player.canUse(item, current, null, true) && get.effect(current, item, player, player) > 0 && lib.card.sha.ai.canLink(player, current, item);
                }) && game.countPlayer(function (current) {
                  return current.isLinked() && get.damageEffect(current, player, player, get.nature(item)) > 0;
                }) > 1) return 3.1;
                return 3;
              }
              return 3.05;
            },
            result: {
              target: function (player, target, card, isLink) {
                var eff = function () {
                  if (!isLink && player.hasSkill('jiu')) {
                    if (!target.hasSkillTag('filterDamage', null, {
                      player: player,
                      card: card,
                      jiu: true,
                    })) {
                      if (get.attitude(player, target) > 0) {
                        return -7;
                      }
                      else {
                        return -4;
                      }
                    }
                    return -0.5;
                  }
                  return -1.5;
                }();
                if (!isLink && target.mayHaveShan() && !player.hasSkillTag('directHit_ai', true, {
                  target: target,
                  card: card,
                }, true)) return eff / 1.2;
                return eff;
              },
            },
            tag: {
              respond: 1,
              respondShan: 1,
              damage: function (card) {
                if (card.nature == 'poison') return;
                return 1;
              },
              natureDamage: function (card) {
                if (card.nature) return 1;
              },
              fireDamage: function (card, nature) {
                if (card.nature == 'fire') return 1;
              },
              thunderDamage: function (card, nature) {
                if (card.nature == 'thunder') return 1;
              },
              poisonDamage: function (card, nature) {
                if (card.nature == 'poison') return 1;
              },
            },
          },
          group: "PSwusheng_effect",
          subSkill: {
            effect: {
              trigger: {
                player: "useCardToPlayered",
              },
              forced: true,
              filter: function (event, player) {
                return event.card && event.card.name == 'sha' && (get.suit(event.card) == 'heart' || get.suit(event.card) == 'diamond') && event.card.isCard;
              },
              logTarget: "target",
              content: function () {
                if (get.suit(trigger.card) == 'heart') {
                  var id = trigger.target.playerid;
                  var map = trigger.getParent().customArgs;
                  if (!map[id]) map[id] = {};
                  if (typeof map[id].extraDamage != 'number') {
                    map[id].extraDamage = 0;
                  }
                  map[id].extraDamage++;
                  if (!trigger.getParent().directHit.contains(trigger.target)) {
                    if (typeof map[id].shanRequired == 'number') {
                      map[id].shanRequired++;
                    }
                    else {
                      map[id].shanRequired = 2;
                    }
                  }
                }
                else {
                  var target = trigger.target;
                  player.gainPlayerCard(target, 'he', true);
                }
              },
              sub: true,
            },
          },
        },
        PSmashu: {
          mod: {
            globalFrom: function (from, to, distance) {
              return distance - 1;
            },
            globalTo: function (from, to, distance) {
              return distance + 1;
            },
          },
        },
        PSyijue: {
          audio: "yijue",
          enable: "phaseUse",
          usable: 1,
          position: "he",
          filterTarget: function (card, player, target) {
            return player != target && target.countCards('he');
          },
          filter: function (event, player) {
            return player.countCards('he');
          },
          filterCard: true,
          check: function (card) {
            return 8 - get.value(card);
          },
          content: function () {
            "step 0"
            if (!target.countCards('he')) {
              event.finish();
            }
            "step 1"
            if (player.isUnderControl()) {
              game.swapPlayerAuto(player);
            }
            var switchToAuto = function () {
              _status.imchoosing = false;
              var types = ['任意'].concat(['basic', 'trick', 'equip']);
              event._result = {
                bool: true,
                suit: ['任意'].concat(lib.suit.randomGet()),
                type: types.randomGet(),
              };
              if (event.dialog) event.dialog.close();
              if (event.control) event.control.close();
            };
            var chooseButton = function (player) {
              var event = _status.event;
              player = player || event.player;
              if (!event._result) event._result = {};
              var dialog = ui.create.dialog('义绝：请声明牌的类型和花色', 'forcebutton', 'hidden');
              event.dialog = dialog;
              dialog.addText('类型');
              var table = document.createElement('div');
              table.classList.add('add-setting');
              table.style.margin = '0';
              table.style.width = '100%';
              table.style.position = 'relative';
              var types = ['任意', 'basic', 'trick', 'equip'];
              for (var i = 0; i < types.length; i++) {
                var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                td.link = types[i];
                table.appendChild(td);
                td.innerHTML = '<span>' + get.translation(types[i]) + '</span>';
                td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                  if (_status.dragged) return;
                  if (_status.justdragged) return;
                  _status.tempNoButton = true;
                  setTimeout(function () {
                    _status.tempNoButton = false;
                  }, 500);
                  var link = this.link;
                  var current = this.parentNode.querySelector('.bluebg');
                  if (current) {
                    current.classList.remove('bluebg');
                  }
                  this.classList.add('bluebg');
                  event._result.type = link;
                });
              }
              dialog.content.appendChild(table);
              dialog.addText('花色');
              var table2 = document.createElement('div');
              table2.classList.add('add-setting');
              table2.style.margin = '0';
              table2.style.width = '100%';
              table2.style.position = 'relative';
              var suits = ['任意'].concat(lib.suit);
              for (var i = 0; i < suits.length; i++) {
                var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                var suit = suits[i];
                td.link = suit;
                table2.appendChild(td);
                td.innerHTML = '<span>' + get.translation(suit) + '</span>';
                td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                  if (_status.dragged) return;
                  if (_status.justdragged) return;
                  _status.tempNoButton = true;
                  setTimeout(function () {
                    _status.tempNoButton = false;
                  }, 500);
                  var link = this.link;
                  var current = this.parentNode.querySelector('.bluebg');
                  if (current) {
                    current.classList.remove('bluebg');
                  }
                  this.classList.add('bluebg');
                  event._result.suit = link;
                });
              }
              dialog.content.appendChild(table2);
              dialog.add('　　');
              event.dialog.open();
              event.switchToAuto = function () {
                event._result = {
                  bool: true,
                  type: types.randomGet(),
                  suit: suits.randomGet(),
                };
                event.dialog.close();
                event.control.close();
                game.resume();
                _status.imchoosing = false;
              };
              event.control = ui.create.control('ok', function (link) {
                var result = event._result;
                result.bool = true;
                event.dialog.close();
                event.control.close();
                game.resume();
                _status.imchoosing = false;
              });
              for (var i = 0; i < event.dialog.buttons.length; i++) {
                event.dialog.buttons[i].classList.add('selectable');
              }
              game.pause();
              game.countChoose();
            };
            if (event.isMine()) {
              chooseButton(player);
            }
            else if (event.isOnline()) {
              event.player.send(chooseButton, player);
              event.player.wait();
              game.pause();
            }
            else {
              switchToAuto();
            }
            "step 2"
            var map = event.result || result;
            if (map.bool) {
              if (map.type && map.type != '任意') event.type = map.type;
              if (map.suit && map.suit != '任意') event.suit = map.suit;
              game.log(player, '声明了', (event.type || '任意类型'), '和', (event.suit || '任意花色'));
              player.popup(get.translation(event.suit + 2 || '任意花色') + '<br/>' + get.translation(event.type || '任意类型'), 'thunder');
            }
            "step 3"
            if (!target.hasCard(card => {
              return get.suit(card) == (event.suit || get.suit(card)) && get.type2(card) == (event.type || get.type2(card));
            }, 'he')) event._result = { bool: false };
            else target.chooseCard(false, 'he', function (card) {
              return get.suit(card) == (event.suit || get.suit(card)) && get.type2(card) == (event.type || get.type2(card));
            }).set('ai', function (card) {
              var player = _status.event.player;
              if ((player.hasShan() || player.hp < 3) && get.color(card) == 'black') return 0.5;
              return Math.max(1, 20 - get.value(card));
            }).set('prompt', '交给' + get.translation(player) + '一张牌，否则获得负面效果');
            "step 4"
            if (result.bool && result.cards) {
              player.gain(result.cards[0], target, 'give', 'bySelf');
              if (target.hp < target.maxHp) {
                player.chooseBool('是否让' + get.translation(target) + '回复一点体力？').ai = function (event, player) {
                  return get.recoverEffect(target, player, player) > 0;
                };
              }
            }
            else {
              player.draw();
              if (!target.hasSkill('fengyin')) {
                target.addTempSkill('fengyin');
              }
              target.addTempSkill('PSyijue_effect');
              event.finish();
            }
            "step 5"
            if (result.bool) {
              target.recover();
            }
          },
          ai: {
            result: {
              target: function (player, target) {
                var hs = player.getCards('h');
                if (hs.length < 3) return 0;
                if (target.countCards('h') > target.hp + 1 && get.recoverEffect(target) > 0) {
                  return 1;
                }
                if (player.canUse('sha', target) && (player.countCards('h', 'sha') || player.countCards('he', { color: 'red' }))) {
                  return -2;
                }
                return -0.5;
              },
            },
            order: 9,
            "directHit_ai": true,
            skillTagFilter: function (player, tag, arg) {
              if (!arg.target.hasSkillTag('new_yijue2')) return false;
            },
          },
          subSkill: {
            effect: {
              trigger: {
                player: "damageBegin1",
              },
              filter: function (event) {
                return event.source && event.source == _status.currentPhase && event.card && event.card.name == 'sha' && event.notLink();
              },
              popup: false,
              forced: true,
              charlotte: true,
              content: function () {
                trigger.num++;
              },
              mark: true,
              mod: {
                "cardEnabled2": function (card) {
                  if (get.position(card) == 'h') return false;
                },
              },
              intro: {
                content: "不能使用或打出手牌",
              },
              sub: true,
            },
          },
        },
        PSshencai: {
          audio: "shencai",
          enable: "phaseUse",
          usable: 5,
          filter: function (event, player) {
            var count = player.getStat('skill').PSshencai;
            if (count && count > player.countMark('PSshencai')) return false;
            return true;
          },
          filterTarget: function (card, player, target) {
            return player != target;
          },
          onremove: true,
          prompt: "选择一名其他角色进行地狱审判",
          content: function () {
            var next = target.judge();
            next.callback = lib.skill.PSshencai.contentx;
          },
          ai: {
            order: 8,
            result: {
              target: -1,
            },
          },
          contentx: function () {
            var card = event.judgeResult.card;
            var player = event.getParent(2).player;
            var target = event.getParent(2).target;
            if (get.position(card, true) == 'o') player.gain(card, 'gain2');
            var list = [], str = lib.skill.PSshencai.getStr(card);
            for (var i in lib.skill.PSshencai.filterx) {
              if (str.indexOf(lib.skill.PSshencai.filterx[i]) != -1) list.push('PSshencai_' + i);
            }
            if (list.length) {
              if (target.isIn()) {
                for (var i of list) {
                  target.addSkill(i);
                  target.addMark(i, 1);
                }
              }
            }
            else if (target.isIn()) {
              player.gainPlayerCard(target, true, 'hej');
              target.addMark('PSshencai_death', 1);
              target.addSkill('PSshencai_death');
            }
          },
          filterx: {
            losehp: "体力",
            weapon: "武器",
            respond: "打出",
            distance: "距离",
          },
          getStr: function (node) {
            var str = '', name = node.name;
            if (lib.translate[name + '_info']) {
              if (lib.card[name].type && lib.translate[lib.card[name].type]) str += ('' + get.translation(lib.card[name].type) + '牌|');
              if (get.subtype(name)) {
                str += ('' + get.translation(get.subtype(name)) + '|');
              }
              if (lib.card[name] && lib.card[name].addinfomenu) {
                str += ('' + lib.card[name].addinfomenu + '|');
              }
              if (get.subtype(name) == 'equip1') {
                var added = false;
                if (lib.card[node.name] && lib.card[node.name].distance) {
                  var dist = lib.card[node.name].distance;
                  if (dist.attackFrom) {
                    added = true;
                    str += ('攻击范围：' + (-dist.attackFrom + 1) + '|');
                  }
                }
                if (!added) {
                  str += ('攻击范围：1|');
                }
              }
            }
            if (lib.card[name].cardPrompt) {
              str += ('' + lib.card[name].cardPrompt(node) + '|');
            }
            else if (lib.translate[name + '_info']) {
              str += ('' + lib.translate[name + '_info'] + '|');
            }
            if (lib.card[name].yingbian_prompt && get.is.yingbian(node)) {
              if (typeof lib.card[name].yingbian_prompt == 'function') str += ('应变：' + lib.card[name].yingbian_prompt(node) + '|');
              else str += ('应变：' + lib.card[name].yingbian_prompt + '|');
            }
            return str;
          },
          subSkill: {
            losehp: {
              charlotte: true,
              marktext: "笞",
              trigger: {
                player: "damageEnd",
              },
              forced: true,
              content: function () {
                player.loseHp(trigger.num);
              },
              ai: {
                effect: {
                  target: function (card, player, target, current) {
                    if (get.tag(card, 'damage') && current < 0) return 1.6;
                  },
                },
              },
              intro: {
                name: "神裁 - 体力",
                "name2": "笞",
                content: "锁定技。当你受到伤害后，你失去等量的体力。",
                onunmark: true,
              },
              sub: true,
            },
            weapon: {
              charlotte: true,
              marktext: "杖",
              trigger: {
                target: "useCardToTargeted",
              },
              forced: true,
              filter: function (event, player) {
                return event.card.name == 'sha';
              },
              content: function () {
                trigger.directHit.add(player);
                game.log(player, '不可响应', trigger.card);
              },
              intro: {
                name: "神裁 - 武器",
                "name2": "杖",
                content: "锁定技。当你成为【杀】的目标后，你不能使用牌响应此【杀】。",
                onunmark: true,
              },
              global: "PSshencai_weapon_ai",
              sub: true,
            },
            ai: {
              ai: {
                "directHit_ai": true,
                skillTagFilter: function (player, tag, arg) {
                  if (!arg || !arg.card || arg.card.name != 'sha') return false;
                  if (!arg.target || !arg.target.hasSkill('PSshencai_weapon')) return false;
                  return true;
                },
              },
              sub: true,
            },
            respond: {
              charlotte: true,
              marktext: "徒",
              trigger: {
                player: "loseAfter",
                global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
              },
              forced: true,
              filter: function (event, player) {
                if (!player.hasCard(function (card) {
                  return lib.filter.cardDiscardable(card, player, 'PSshencai_respond');
                }, 'h')) return false;
                var evt = event.getParent('PSshencai_respond');
                if (evt && evt.player == player) return false;
                evt = event.getl(player);
                return evt && evt.hs && evt.hs.length > 0;
              },
              content: function () {
                var cards = player.getCards('h', function (card) {
                  return lib.filter.cardDiscardable(card, player, 'PSshencai_respond');
                });
                if (cards.length > 0) player.discard(cards.randomGet());
              },
              intro: {
                name: "神裁 - 打出",
                "name2": "徒",
                content: "锁定技。当你失去手牌后，你随机弃置一张手牌（不嵌套触发）。",
                onunmark: true,
              },
              sub: true,
            },
            distance: {
              charlotte: true,
              marktext: "流",
              trigger: {
                player: "phaseJieshuBegin",
              },
              forced: true,
              content: function () {
                player.turnOver();
              },
              intro: {
                name: "神裁 - 距离",
                "name2": "流",
                content: "锁定技。结束阶段开始时，你翻面。",
                onunmark: true,
              },
              sub: true,
            },
            death: {
              charlotte: true,
              marktext: "死",
              mod: {
                maxHandcard: function (player, num) {
                  return num - player.countMark('PSshencai_death');
                },
              },
              trigger: {
                player: "phaseEnd",
              },
              forced: true,
              filter: function (event, player) {
                return player.countMark('PSshencai_death') > game.countPlayer();
              },
              content: function () {
                player.die();
              },
              intro: {
                name: "神裁 - 死",
                "name2": "死",
                content: "锁定技。你的角色手牌上限-#；回合结束时，若场上存活人数小于#，则你死亡。",
                onunmark: true,
              },
              sub: true,
            },
          },
          intro: {
            content: "发动次数上限+#",
          },
        },
        PSxunshi: {
          trigger: {
            player: "useCard2",
          },
          forced: true,
          direct: true,
          priority: -1,
          filter: function (event, player) {
            return get.color(event.card) == 'none';
          },
          content: function () {
            if (player.countMark('PSshencai') < 4 && player.hasSkill('PSshencai', null, null, false)) player.addMark('PSshencai', 1, false);
          },
          group: "xunshi",
        },
        PStaoyuan: {
          audio: "ext:PS武将/audio/skill:2",
          trigger: {
            player: "changeHp",
          },
          charlotte: true,
          forced: true,
          filter: function (event, player) {
            return event.num < 0 && game.hasPlayer(current => current.group === 'shu');
          },
          content: function () {
            'step 0'
            let num = game.countPlayer(current => current.group === 'shu');
            event.cards = get.cards(num);
            player.showCards(event.cards, '桃园');
            let bool = false;
            for (var card of event.cards) {
              if (get.color(card) !== 'black') {
                bool = true;
                break;
              }
            }
            event.bool = bool;
            'step 1'
            if (event.bool) {
              if (player.hp < 1) player.recover(1 - player.hp);
            }
            else event.finish();
            'step 2'
            player.chooseTarget('桃园：选择一名角色，让其挑选武将牌').set('ai', function (target) {
              var player = _status.event.player;
              var att = get.attitude(player, target) / Math.sqrt(1 + target.countCards('h'));
              return att;
            });
            'step 3'
            if (result.targets) {
              let target = result.targets[0];
              let list;
              if (_status.characterlist) {
                list = [];
                for (var i = 0; i < _status.characterlist.length; i++) {
                  var name = _status.characterlist[i];
                  if (lib.character[name][1] == 'shu' && lib.skill.PSfushi.characterList().contains(name)) list.push(name);
                }
              }
              else if (_status.connectMode) {
                list = get.charactersOL(function (i) {
                  return lib.character[i][1] != 'shu' && !lib.skill.PSfushi.characterList().contains(i);
                });
              }
              else {
                list = get.gainableCharacters(function (info, i) {
                  return info[1] == 'shu' && lib.skill.PSfushi.characterList().contains(i);
                });
              }
              var players = game.players.concat(game.dead);
              for (var i = 0; i < players.length; i++) {
                list.remove(players[i].name);
                list.remove(players[i].name1);
                list.remove(players[i].name2);
              }
              if (!list.length) {
                event.finish();
                return;
              }
              target.chooseButton(['桃园：选择获得一张武将牌上的所有技能', [list.randomGets(3), 'character']], true);
              event.target = target;
            }
            else event.finish();
            'step 4'
            if (result.bool) {
              let name = result.links[0];
              event.target.flashAvatar('PStaoyuan', name);
              game.log(event.target, '获得了', '#y' + get.translation(name), '的所有技能');
              event.target.addSkill(lib.character[name][3]);
            }
          },
        },
        PSshiren: {
          mod: {
            maxHandcard: function (player, num) {
              return num + game.countPlayer(current => current.group === 'shu');
            },
          },
          audio: "ext:PS武将/audio/skill:2",
          enable: "phaseUse",
          usable: 1,
          filter: function (event, player) {
            return game.hasPlayer(function (current) {
              return player.canCompare(current) && current.inRangeOf(player);
            });
          },
          filterTarget: function (card, player, current) {
            return player.canCompare(current) && current.inRangeOf(player);
          },
          content: () => {
            'step 0'
            player.chooseToCompare(target);
            'step 1'
            if (result.bool) {
              target.changeGroup('shu');
            }
          },
          ai: {
            order: 3,
            result: {
              player: function (player) {
                var num = player.countCards('h');
                if (num > player.hp) return 0;
                if (num == 1) return -2;
                if (num == 2) return -1;
                return -0.7;
              },
              target: function (player, target) {
                var num = target.countCards('h');
                if (num == 1) return -1;
                if (num == 2) return -0.7;
                return -0.5
              },
            },
          },
        },
        PSxianjin: {
          audio: "dcxianjin",
          inherit: "dcxianjin",
          init: (player) => {
            var list = ['dctuoyu_fengtian', 'dctuoyu_qingqu', 'dctuoyu_junshan'];
            for (var i of list) {
              game.log(player, '激活了副区域', '#y' + get.translation(i));
              player.markAuto('dctuoyu', [i]);
              player.popup(get.translation(i + '_tag'));
            }
          },
        },
        PSlingce: {
          audio: "lingce",
          trigger: {
            global: "washCard",
          },
          forced: true,
          /* filter: function (event, player) {
              return game.shuffleNumber <= 2;
          }, */
          content: () => {
            "step 0"
            var cards = get.cards(8);
            event.cards = cards;
            if (player.storage.PSdinghan == true) player.chooseCardButton(cards, '选择获得至多六张牌', [1, 6]);
            else player.chooseCardButton(cards, '选择获得的牌名不同的牌', [1, Infinity]).set('filterButton', function (button) {
              let name = get.name(button.link);
              for (var i of ui.selected.buttons) {
                if (get.name(i.link) === name) return false;
              }
              return true;
            });
            "step 1"
            if (result.bool) {
              player.gain(result.links, 'draw');
            }
            game.cardsDiscard(event.cards.removeArray(result.links));
          },
        },
        PStianzuo: {
          audio: "tianzuo",
          trigger: {
            player: ["damageEnd", "phaseEnd"],
          },
          init: function (player) {
            if (!player.storage.PStianzuo) player.storage.PStianzuo = 0;
          },
          filter: function (event, player) {
            if (event.name != 'phase') return event.num > 0;
            return true;
          },
          content: () => {
            'step 0'
            event.num = trigger.num || 1;
            'step 1'
            event.num--;
            var cards = get.cards(ui.cardPile.childElementCount + 1);
            for (var i = 0; i < cards.length; i++) {
              ui.cardPile.insertBefore(cards[i], ui.cardPile.childNodes[get.rand(ui.cardPile.childElementCount)]);
            }
            game.updateRoundNumber();
            player.storage.PStianzuo++;
            if (event.num > 0) event.redo();
          },
          group: 'PStianzuo_use',
          subSkill: {
            use: {
              audio: "tianzuo",
              enable: "phaseUse",
              usable: 1,
              content: () => {
                var cards = get.cards(ui.cardPile.childElementCount + 1);
                for (var i = 0; i < cards.length; i++) {
                  ui.cardPile.insertBefore(cards[i], ui.cardPile.childNodes[get.rand(ui.cardPile.childElementCount)]);
                }
                player.storage.PStianzuo++;
                game.updateRoundNumber();
                event.trigger('PStianzuoAfter');
              },
              sub: true,
            },
          },
          ai: {
            maixie: true,
            "maixie_hp": true,
          },
        },
        PSdinghan: {
          skillAnimation: true,
          animationColor: "fire",
          derivation: "PSzuoding",
          audio: "dinghan",
          juexingji: true,
          unique: true,
          forced: true,
          trigger: {
            player: "PStianzuoAfter",
          },
          filter: (event, player) => {
            return player.storage.PStianzuo && player.storage.PStianzuo >= 3;
          },
          content: () => {
            player.awakenSkill(event.name);
            player.storage[event.name] = true;
            player.gainMaxHp();
            player.recover();
            player.addSkill('PSzuoding');
          },
        },
        PSzuoding: {
          audio: "ext:PS武将/audio/skill:2",
          enable: "phaseUse",
          usable: 3,
          filterCard: function (card) {
            return get.color(card) == 'black';
          },
          position: "hes",
          viewAs: {
            name: "qizhengxiangsheng",
          },
          viewAsFilter: function (player) {
            if (!player.countCards('hes')) return false;
          },
          prompt: "将一张牌当【奇正相生】使用",
          check: function (card) { return 4 - get.value(card) },
        },
        PSzhengu: {
          audio: "drlt_zhenggu",
          trigger: {
            player: "phaseJieshuBegin",
          },
          direct: true,
          filter: function (event, player) {
            return game.hasPlayer(current => current != player && !current.hasSkill("PSzhengu_mark"));
          },
          content: function () {
            "step 0"
            player.chooseTarget(get.prompt2('PSzhengu'), function (card, player, target) {
              return target != player && !target.hasSkill("PSzhengu_mark");
            }).set('ai', function (target) {
              var player = _status.event.player;
              var num = (Math.min(5, player.countCards('h')) - target.countCards('h'));
              var att = get.attitude(player, target);
              return num * att;
            });
            "step 1"
            if (result.bool) {
              var target = result.targets[0];
              player.logSkill('PSzhengu', target);
              player.line(target, 'fire');
              var num = player.countCards('h') - target.countCards('h');
              if (num > 0) target.draw(num);
              if (num < 0) target.chooseToDiscard('h', true, -num);
              target.addTempSkill("PSzhengu_mark", { player: "phaseJieshuBegin" });
              target.storage.PSzhengu_mark.add(player);
              target.markSkill("PSzhengu_mark");
            }
          },
          group: "PSzhengu_mark",
          subSkill: {
            mark: {
              init: function (player, skill) {
                if (!player.storage[skill]) player.storage[skill] = [];
              },
              onremove: function (player) {
                player.storage.PSzhengu_mark = [];
                player.unmarkSkill("PSzhengu_mark");
              },
              marktext: "镇",
              intro: {
                name: "镇骨",
                content: "已成为$〖镇骨〗的目标",
              },
              trigger: {
                global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
              },
              forced: true,
              filter: function (event, player) {
                let target = player.storage.PSzhengu_mark[0];
                return target && target.isIn() && target.isAlive() && target.countCards('h') !== player.countCards('h');
              },
              content: function () {
                let target = player.storage.PSzhengu_mark[0];
                let num = target.countCards('h') - player.countCards('h');
                target.logSkill("PSzhengu", player);
                target.line(player, 'fire');
                if (num > 0) player.draw(num);
                else player.chooseToDiscard('h', -num, true);
              },
              sub: true,
            },
          },
        },
        PSchenglve: {
          mark: true,
          locked: false,
          zhuanhuanji: true,
          marktext: "☯",
          intro: {
            content: function (storage, player, skill) {
              var str = `出牌阶段限一次，你可以摸${player.storage.PSchenglve ? '两' : '一'}张牌，然后弃置${player.storage.PSchenglve ? '一' : '两'}张手牌。若如此做，直到本回合结束，你使用与弃置牌花色相同的牌无距离和次数限制，且当你使用/打出/弃置与弃置牌花色相同的牌后，你摸一张牌`;
              if (player.storage.PSchenglve_effect) {
                str += '<br><li>当前花色：';
                str += get.translation(player.storage.PSchenglve_effect);
              }
              return str;
            },
          },
          enable: "phaseUse",
          usable: 1,
          audio: "nzry_chenglve",
          content: function () {
            'step 0'
            if (player.storage.PSchenglve == true) {
              player.draw(2);
              player.chooseToDiscard('h', true);
            }
            else {
              player.draw();
              player.chooseToDiscard('h', 2, true);
            }
            player.changeZhuanhuanji('PSchenglve')
            'step 1'
            if (result.bool) {
              player.storage.PSchenglve_effect = [];
              for (var i = 0; i < result.cards.length; i++) {
                player.storage.PSchenglve_effect.add(get.suit(result.cards[i], player));
              }
              player.markSkill('PSchenglve');
              player.addTempSkill('PSchenglve_effect');
            };
          },
          ai: {
            order: 2.7,
            result: {
              player: function (player) {
                if (!player.storage.PSchenglve && player.countCards('h') < 3) return 0;
                return 1;
              },
            },
          },
          subSkill: {
            effect: {
              mod: {
                cardUsable: function (card, player) {
                  var cards = player.storage.PSchenglve_effect;
                  for (var i = 0; i < cards.length; i++) {
                    if (cards[i] == get.suit(card)) return Infinity;
                  };
                },
                targetInRange: function (card, player) {
                  var cards = player.storage.PSchenglve_effect;
                  for (var i = 0; i < cards.length; i++) {
                    if (cards[i] == get.suit(card)) return true;
                  };
                },
              },
              trigger: {
                player: ["useCardAfter", "respondAfter", "discardAfter"],
              },
              forced: true,
              filter(event, player) {
                let cards = player.storage.PSchenglve_effect;
                return cards.contains(get.suit(event.card));
              },
              content() {
                player.draw();
              },
              onremove: true,
              sub: true,
            },
          },
        },
        PSshicai: {
          audio: "nzry_shicai_2",
          trigger: {
            player: ["useCardAfter"],
            target: "useCardToTargeted",
          },
          filter: function (event, player, name) {
            if (name == 'useCardToTargeted' && ('equip' != get.type(event.card) || event.player != player)) return false;
            if (name == 'useCardAfter' && ['equip', 'delay'].contains(get.type(event.card))) return false;
            if (event.cards.filterInD().length <= 0) return false;
            var history = player.getHistory('useCard');
            var evt = name == 'useCardAfter' ? event : event.getParent();
            for (var i = 0; i < history.length; i++) {
              if (history[i] != evt && get.name(history[i].card) == get.name(event.card)) return false;
              else if (history[i] == evt) return true;
            }
            return false;
          },
          check: function (event, player) {
            if (get.type(event.card) == 'equip') {
              if (get.subtype(event.card) == 'equip6') return true;
              if (get.equipResult(player, event.target, event.card.name) <= 0) return true;
              var eff1 = player.getUseValue(event.card);
              var subtype = get.subtype(event.card);
              return player.countCards('h', function (card) {
                return get.subtype(card) == subtype && player.getUseValue(card) >= eff1;
              }) > 0;
            }
            return true;
          },
          content: function () {
            "step 0"
            event.cards = trigger.cards.filterInD();
            if (event.cards.length > 1) {
              var next = player.chooseToMove('恃才：将牌按顺序置于牌堆顶');
              next.set('list', [['牌堆顶', event.cards]]);
              next.set('reverse', ((_status.currentPhase && _status.currentPhase.next) ? get.attitude(player, _status.currentPhase.next) > 0 : false));
              next.set('processAI', function (list) {
                var cards = list[0][1].slice(0);
                cards.sort(function (a, b) {
                  return (_status.event.reverse ? 1 : -1) * (get.value(b) - get.value(a));
                });
                return [cards];
              });
            }
            "step 1"
            if (result.bool && result.moved && result.moved[0].length) cards = result.moved[0].slice(0);
            while (cards.length) {
              var card = cards.pop();
              if (get.position(card, true) == 'o') {
                card.fix();
                ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
                game.log(player, '将', card, '置于牌堆顶');
              }
            }
            game.updateRoundNumber();
            player.draw();
          },
          ai: {
            reverseOrder: true,
            skillTagFilter: function (player) {
              if (player.getHistory('useCard', function (evt) {
                return get.type(evt.card) == 'equip';
              }).length > 0) return false;
            },
            effect: {
              target: function (card, player, target) {
                if (player == target && get.type(card) == 'equip' && !player.getHistory('useCard', function (evt) {
                  return get.type(evt.card) == 'equip'
                }).length == 0) return [1, 3];
              },
            },
            threaten: 2.4,
          },
        },
        PSyuheng: {
          getList: function () {
            var list;
            if (_status.characterlist) {
              list = [];
              for (var i = 0; i < _status.characterlist.length; i++) {
                var name = _status.characterlist[i];
                if (lib.character[name][1] == 'wu' && lib.skill.PSfushi.characterList().contains(name)) list.push(name);
              }
            }
            else if (_status.connectMode) {
              list = get.charactersOL(function (i) {
                return lib.character[i][1] != 'wu' && !lib.skill.PSfushi.characterList().contains(i);
              });
            }
            else {
              list = get.gainableCharacters(function (info) {
                return info[1] == 'wu' && lib.skill.PSfushi.characterList().contains(i);
              });
            }
            var players = game.players.concat(game.dead);
            for (var i = 0; i < players.length; i++) {
              list.remove(players[i].name);
              list.remove(players[i].name1);
              list.remove(players[i].name2);
            }
            //list=list.randomGets(Math.max(4,game.countPlayer()));
            var skills = [];
            for (var i of list) {
              skills.addArray((lib.character[i][3] || []).filter(function (skill) {
                var info = get.info(skill);
                return info && !info.zhuSkill && !info.hiddenSkill && !info.charlotte;
              }));
            }
            return skills;
          },
          group: "PSyuheng_remove",
          audio: "yuheng",
          trigger: {
            player: "phaseBegin",
          },
          filter: function (event, player) {
            return player.hasCard(function (card) {
              return lib.filter.cardDiscardable(card, player, 'PSyuheng');
            }, 'he');
          },
          frequent: true,
          keepSkill: true,
          marktext: "驭衡",
          intro: {
            name: "驭衡",
            content: function (storage, player) {
              return `因〖驭衡〗获得的技能：${get.translation(player.additionalSkills.PSyuheng)}`;
            },
            markcount: function (storage, player) {
              return player.additionalSkills.PSyuheng.length;
            },
          },
          content: function () {
            'step 0'
            let num = player.getCards('he').reduce(function (arr, card) {
              return arr.add(get.suit(card, player)), arr;
            }, []).length;
            player.chooseToDiscard('he', false, [1, num], function (card, player) {
              if (!ui.selected.cards.length) return true;
              var suit = get.suit(card, player);
              for (var i of ui.selected.cards) {
                if (get.suit(i, player) == suit) return false;
              }
              return true;
            }).set('complexCard', true).set('ai', function (card) {
              var list = lib.skill.PSyuheng.getList();
              if (ui.selected.cards.length >= list.length) return 0;
              if (!player.hasValueTarget(card)) return 5;
              return 1 / (get.value(card) || 0.5);
            }).set('prompt', '驭衡：弃置花色不同的牌获得等量吴势力角色的技能');
            'step 1'
            if (result.bool) {
              var list = lib.skill.PSyuheng.getList().slice(0);
              list = list.filter(function (skill) {
                return !player.hasSkill(skill);
              });
              player.draw(result.cards.length);
              var skills = list.randomGets(Math.min(list.length, result.cards.length));
              if (player.additionalSkills.PSyuheng && player.additionalSkills.PSyuheng.length) {
                skills.addArray(player.additionalSkills.PSyuheng);
              }
              player.addAdditionalSkill('PSyuheng', skills);
              player.markSkill('PSyuheng');
              game.log(player, '获得了以下技能：', '#g' + get.translation(skills));
            }
          },
          subSkill: {
            remove: {
              audio: "yuheng",
              trigger: {
                player: "phaseEnd",
              },
              filter: function (event, player) {
                return player.additionalSkills.PSyuheng && player.additionalSkills.PSyuheng.length;
              },
              frequent: true,
              content: function () {
                'step 0'
                let skills = player.additionalSkills.PSyuheng;
                event.num = skills.length;
                player.chooseButton(['驭衡：选择失去任意数量个技能，摸等量的牌', [skills, 'vcard']], [1, event.num], false).set('ai', function (button) { });
                'step 1'
                if (result.bool) {
                  let links = result.links.map(ele => ele[ele.length - 1]);
                  game.log(player, '失去了以下技能：', '#g' + get.translation(links));
                  player.draw(links.length);
                  player.removeSkill(links);
                  player.additionalSkills.PSyuheng.length ? player.markSkill('PSyuheng') : player.unmarkSkill('PSyuheng');
                }
              },
              sub: true,
            },
          },
        },
        PSdili: {
          derivation: ["junkshengzhi", "junkquandao", "junkchigang"],
          juexingji: true,
          audio: "dili",
          trigger: {
            global: "phaseBefore",
            player: ["enterGame", "loseMaxHpEnd", "gainMaxHpEnd", "addSkill", "removeSkill"],
          },
          filter: function (event, player, name) {
            if (event.name == 'phase' && game.phaseNumber > 0) return false;
            return player.additionalSkills.PSyuheng && player.additionalSkills.PSyuheng.length > player.maxHp;
          },
          forced: true,
          skillAnimation: true,
          animationColor: "wood",
          content: function () {
            player.awakenSkill('PSdili');
            player.removeSkill('PSyuheng');
            player.addSkill(lib.skill.PSdili.derivation);
          },
        },
        PSbolan: {
          trigger: {
            player: ["phaseDrawBegin1", "phaseZhunbeiBegin"],
          },
          forced: true,
          derivation: "PSgongxin",
          mod: {
            globalFrom: function (from, to, distance) {
              return distance - (from.storage.PSbolan);
            },
            maxHandcard: function (player, num) {
              return num + player.storage.PSbolan;
            },
          },
          filter: function (event, player, name) {
            if (name === "phaseZhunbeiBegin") return player.storage.PSbolan >= 5;
            return player.hp > 0 && !event.numFixed;
          },
          init: function (player, skill) {
            if (!player.storage[skill]) player.storage[skill] = 0;
          },
          marktext: "识",
          intro: {
            name: "博览",
            content: "mark",
          },
          content: function () {
            if (event.triggername === "phaseZhunbeiBegin") {
              player.addSkill('PSgongxin');
              game.playSkillAudio("botu");
            }
            else {
              trigger.changeToZero();
              player.draw(player.hp);
              player.storage.PSbolan += Math.max(player.hp - 2, 0);
              player.markSkill('PSbolan');
              game.playSkillAudio("qinxue");
            }
          },
        },
        PSgongxin: {
          mark: true,
          locked: false,
          zhuanhuanji: true,
          marktext: "☯",
          intro: {
            content: function (storage, player, skill) {
              return `出牌阶段限一次，你可以观看一名其他角色的手牌，然后获得其中任意张花色${player.storage.PSgongxin == true ? '相同' : '不同'}的牌。每以此法获得一张牌，你移去一个“识”。`;
            },
          },
          enable: "phaseUse",
          usable: 1,
          audio: "gongxin",
          prompt: () => {
            var player = _status.event.player;
            return `观看一名其他角色的手牌，获得其任意张花色${player.storage.PSgongxin ? '相同' : '不同'}的牌`;
          },
          filterTarget: function (card, player, target) {
            return target != player && target.countCards('h');
          },
          content: function () {
            'step 0'
            event.videoId = lib.status.videoId++;
            var cards = target.getCards('h');
            if (player.isOnline2()) {
              player.send(function (cards, id) {
                ui.create.dialog('攻心', cards).videoId = id;
              }, cards, event.videoId);
            }
            event.dialog = ui.create.dialog('攻心', cards);
            event.dialog.videoId = event.videoId;
            if (!event.isMine()) {
              event.dialog.style.display = 'none';
            }
            player.chooseButton([1, Infinity]).set('filterButton', function (button) {
              if (!ui.selected.buttons.length) return true;
              var suit = get.suit(button.link);
              for (var i of ui.selected.buttons) {
                if (player.storage.PSgongxin == true) {
                  if (get.suit(i.link) != suit) return false;
                }
                else {
                  if (get.suit(i.link) == suit) return false;
                }
              }
              return true;
            }).set('dialog', event.videoId);
            'step 1'
            if (player.isOnline2()) player.send('closeDialog', event.videoId);
            event.dialog.close();
            if (result.bool) {
              player.gain(result.links, target, 'giveAuto');
              player.storage.PSbolan -= Math.min(result.links.length, player.storage.PSbolan);
              player.storage.PSbolan ? player.markSkill('PSbolan') : player.unmarkSkill('PSbolan');
            }
            player.changeZhuanhuanji('PSgongxin');
          },
          ai: {
            order: 12,
            expose: 0.4,
            result: {
              target: function (player, target) {
                return -target.countCards('h');
              },
            },
          },
          group: "PSgongxin_remove",
          subSkill: {
            remove: {
              trigger: {
                player: "phaseJieshuBegin",
              },
              forced: true,
              filter: (event, player) => player.storage.PSbolan < 5,
              content: () => {
                player.removeSkill('PSgongxin');
              },
            },
          },
        },
        PSjuanjia: {
          trigger: {
            global: "phaseBefore",
            player: "enterGame",
          },
          forced: true,
          filter: function (event, player) {
            return (event.name != 'phase' || game.phaseNumber == 0);
          },
          content: function () {
            for (let i = 1; i < 6; i++) {
              if (player.hasEnabledSlot(i) && i !== 1) {
                player.disableEquip(i);
                player.expandEquip(1);
              }
            }
          },
          "_priority": 0,
        },
        PSquanshu: {
          audio: "xinquanji",
          trigger: {
            player: "damageEnd",
            source: "damageSource",
          },
          filter: function (event, player) {
            return true;
          },
          "prompt2": function (event, player) {
            return `摸${get.cnNumber(player.getDamagedHp(true))}张牌，再将一张牌置于武将牌上`;
          },
          content: function () {
            'step 0'
            player.draw(player.getDamagedHp(true));
            'step 1'
            var hs = player.getCards('h');
            if (hs.length > 0) {
              if (hs.length == 1) event._result = { bool: true, cards: hs };
              else player.chooseCard('h', true, '选择一张牌作为“权”');
            }
            else event.finish();
            'step 2'
            if (result.bool) {
              var cs = result.cards;
              player.addToExpansion(cs, player, 'give').gaintag.add('PSquanshu');
            }
          },
          intro: {
            content: "expansion",
            markcount: "expansion",
          },
          onremove: function (player, skill) {
            var cards = player.getExpansions(skill);
            if (cards.length) player.loseToDiscardpile(cards);
          },
          locked: false,
          mod: {
            maxHandcard: function (player, num) {
              return num + player.getExpansions('PSquanshu').length;
            },
          },
          ai: {
            maixie: true,
            "maixie_hp": true,
            effect: {
              target: function (card, player, target) {
                if (get.tag(card, 'damage')) {
                  if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
                  if (!target.hasFriend()) return;
                  var num = 1;
                  if (get.attitude(player, target) > 0) {
                    if (player.needsToDiscard()) {
                      num = 0.7;
                    }
                    else {
                      num = 0.5;
                    }
                  }
                  if (target.hp >= 4) return [1, num * 2];
                  if (target.hp == 3) return [1, num * 1.5];
                  if (target.hp == 2) return [1, num * 0.5];
                }
              },
            },
          },
        },
        PSpaiyi: {
          audio: 'xinpaiyi',
          enable: "phaseUse",
          usable: 1,
          filter: function (event, player) {
            return player.getExpansions('PSquanshu').length > 0;
          },
          chooseButton: {
            dialog: function (event, player) {
              return ui.create.dialog('排异', player.getExpansions('PSquanshu'), 'hidden')
            },
            backup: function (links, player) {
              return {
                audio: 'xinpaiyi',
                filterTarget: true,
                filterCard: function () { return false },
                selectCard: -1,
                card: links[0],
                delay: false,
                content: lib.skill.PSpaiyi.contentx,
                ai: {
                  order: 10,
                  result: {
                    target: function (player, target) {
                      if (target != player) return 0;
                      if (player.getExpansions('PSquanshu').length <= 1 || (player.needsToDiscard() && !player.getEquip('zhuge') && !player.hasSkill('new_paoxiao'))) return 0;
                      return 1;
                    }
                  },
                },
              }
            },
            prompt: function (event, player) {
              var num = player.getExpansions('PSquanshu').length - 1;
              var max = Math.max(1, num);
              return `令一名角色摸${get.cnNumber(max)}张牌，然后该角色可以对其他角色造成伤害`;
            },
          },
          contentx: function () {
            "step 0"
            var card = lib.skill.PSpaiyi_backup.card;
            player.loseToDiscardpile(card);
            "step 1"
            var num = player.getExpansions('PSquanshu').length;
            var max = Math.max(1, num);
            target.draw(max);
            target.chooseTarget(false, [1, max], '对至多' + get.cnNumber(max) + '名角色各造成1点伤害').set('ai', function (target) {
              var player = _status.event.player;
              return get.damageEffect(target, player, player);
            });
            "step 2"
            if (result.bool) {
              var targets = result.targets.sortBySeat();
              target.line(targets, 'green');
              for (var i of targets) i.damage('nocard', target);
            }
          },
          ai: {
            order: function (item, player) {
              var num = player.getExpansions('PSquanshu').length;
              if (num == 1) return 8;
              return 1;
            },
            result: {
              player: 1,
            },
          },
          "_priority": 0,
        },
        PSjiuxian: {
          audio: "dclbjiuxian",
          trigger: {
            player: ["useCardAfter", "gainAfter"],
          },
          forced: true,
          filter: function (event, player, name) {
            if (lib.config.extension_PS武将_PS_pingzeTip == true) {
              let hs = player.getCards('h', (card) => !card.hasGaintag("PSshixian_ping") && !card.hasGaintag("PSshixian_ze"));
              let hs1 = player.getCards('h', (card) => hs.contains(card) && get.PS_pingZe(get.translation(card.name)) == '平');
              let hs2 = hs.removeArray(hs1);
              player.addGaintag(hs1, "PSshixian_ping");
              player.addGaintag(hs2, "PSshixian_ze");
            }
            else {
              player.removeGaintag("PSshixian_ping");
              player.removeGaintag("PSshixian_ze");
            }
            if (name == "gainAfter") return false;
            return event.card.name === 'jiu' && player.hasSkill('PSshixian');
          },
          prompt2: function (event, player) {
            return `令你使用的下一张牌无视条件触发技能〖诗仙〗？`
          },
          content: function () {
            player.addTempSkill('PSjiuxian_ignore', 'useCardEnd');
          },
          group: "dclbjiuxian",
          subSkill: {
            ignore: {
              charlotte: true,
              forced: true,
              popup: false,
            },
          },
        },
        PSshixian: {
          audio: "dcshixian",
          trigger: {
            player: "useCard",
          },
          intro: {
            content: function (storage, player, skill) {
              let evt = player.getAllHistory('useCard').at(-1);
              return `当前记录：${get.PS_pingZe(get.translation(evt.card.name))}`;
            },
          },
          locked: false,
          filter: function (event, player) {
            player.markSkill('PSshixian');
            player.marks.PSshixian.firstChild.innerHTML = get.PS_pingZe(get.translation(event.card.name));
            player.markSkill('PSshixian');
            if (player.hasSkill('PSjiuxian_ignore')) return true;
            var history = player.getAllHistory('useCard'), index = history.indexOf(event);
            if (index < 1) return false;
            var evt = history[index - 1];
            let pingze1 = get.PS_pingZe(get.translation(event.card.name));
            let pingze2 = get.PS_pingZe(get.translation(evt.card.name));
            return pingze1 !== pingze2;
          },
          filterx: function (event) {
            if (event.targets.length == 0) return false;
            var type = get.type(event.card);
            if (type != 'basic' && type != 'trick') return false;
            return true;
          },
          "prompt2": function (event, player) {
            if (lib.skill.PSshixian.filterx(event)) return '摸一张牌并令' + get.translation(event.card) + '额外结算一次？';
            return '摸一张牌。';
          },
          check: function (event, player) {
            if (lib.skill.PSshixian.filterx(event)) return !get.tag(event.card, 'norepeat');
            return true;
          },
          content: function () {
            player.draw();
            if (lib.skill.PSshixian.filterx(trigger)) {
              trigger.effectCount++;
              game.log(trigger.card, '额外结算一次');
            }
          },
          mod: {
            aiOrder: function (player, card, num) {
              if (typeof card == 'object' && !get.tag(card, 'norepeat')) {
                var history = player.getAllHistory('useCard');
                if (history.length > 0) {
                  var cardx = history[history.length - 1].card;
                  if (get.PS_pingZe(get.translation(card.name)) !== get.PS_pingZe(get.translation(cardx.name))) return num + 20;
                }
              }
            },
          },

          "_priority": 0,
        },
        PSxiqu: {
          audio: "sbtongye",
          enable: "phaseUse",
          limited: true,
          charlotte: true,
          skillAnimation: true,
          animationColor: "gray",
          filter: function (event, player) {
            return game.hasPlayer(current => current != player && (current.countCards('e') > 0 || current.countGainableCards(player, 'h') > 0));
          },
          filterTarget: lib.filter.notMe,
          content: function () {
            'step 0'
            player.awakenSkill('PSxiqu');
            let cards = target.getCards('e');
            target.discard(cards);
            'step 1'
            if (target.countGainableCards(player, 'h') > 0) player.gainPlayerCard(target, [1, 2], 'h', true);
          },
          ai: {
            order: 100,
            result: {
              player: 100,
            },
          },
          mark: true,
          intro: {
            content: "limited",
          },
          init: (player, skill) => player.storage[skill] = false,
          "_priority": 0,
        },
        PSzongheng: {
          audio: "rezhiheng",
          audioname: ["shen_caopi"],
          enable: "phaseUse",
          position: "h",
          filter: function (event, player) {
            const skills = player.getHistory('useSkill', evt => evt.skill == 'PSzongheng');
            if (!skills.length) return true;
            let suits = [];
            let num = lib.suit.length;
            skills.forEach(skill => {
              skill.event.cards.forEach(card => {
                suits.add(get.suit(card));
              });
              num -= suits.length;
              suit = [];
            });

            return num > 0;
          },
          complexCard: true,
          filterCard: function (card, player, event) {
            if (ui.selected.cards.length > 1) {
              var suit = get.suit(card);
              if (get.suit(ui.selected.cards[0]) != get.suit(ui.selected.cards[1])) {
                for (var i of ui.selected.cards) {
                  if (get.suit(i) == suit) return false;
                }
              }
              else {
                for (var i of ui.selected.cards) {
                  if (get.suit(i) != suit) return false;
                }
              }
            }
            event = event || _status.event;
            if (typeof event != 'string') event = event.getParent().name;
            var mod = game.checkMod(card, player, event, 'unchanged', 'cardDiscardable', player);
            return mod != 'unchanged' ? mod : true;
          },
          discard: false,
          lose: false,
          delay: false,
          selectCard: [1, Infinity],
          check: function (card) {
            var player = _status.event.player;
            if (get.position(card) == 'h' && !player.countCards('h', 'du') && (player.hp > 2 || !player.countCards('h', function (card) {
              return get.value(card) >= 8;
            }))) {
              return 1;
            }
            return 6 - get.value(card)
          },
          content: function () {
            'step 0'
            player.discard(cards);
            let num = cards.length > 3 ? 1 : 0;
            player.draw(num + cards.length);
          },
          subSkill: {
            draw: {
              trigger: {
                player: "loseEnd",
              },
              silent: true,
              filter: function (event, player) {
                if (event.getParent(2).skill != 'PSzongheng' && event.getParent(2).skill != 'jilue_zhiheng') return false;
                if (player.countCards('h')) return false;
                for (var i = 0; i < event.cards.length; i++) {
                  if (event.cards[i].original == 'h') return true;
                }
                return false;
              },
              content: function () {
                player.addTempSkill('PSzongheng_delay', trigger.getParent(2).skill + 'After');
              },
              sub: true,
              forced: true,
              popup: false,
              "_priority": 1,
            },
            delay: {
              sub: true,
              "_priority": 0,
            },
          },
          ai: {
            order: 1,
            result: {
              player: 1,
            },
            threaten: 1.55,
          },
          "_priority": 0,
        },
        PSchengchen: {
          audio: "sbzhiheng",
          skillAnimation: true,
          animationColor: "wood",
          juexingji: true,
          unique: true,
          derivation: ["rezhiheng"],
          trigger: {
            source: "dieAfter",
          },
          filter: function (event, player) {
            return game.hasPlayer(current => current != player && current.group == 'wei') && player.countCards('h') > 0;
          },
          forced: true,
          content: function () {
            'step 0'
            player.removeSkill('PSzongheng');
            player.addSkill('rezhiheng');
            game.log(player, '失去了技能', '#g【纵横】');
            game.log(player, '获得了技能', '#g【制衡】');
            player.awakenSkill(event.name);
            player.storage[event.name] = true;
            player.chooseTarget('将所有手牌交给一名魏势力角色', true).set('filterTarget', function (card, player, target) {
              return target != player && target.group == 'wei';
            }).set('ai', target => get.attitude(_status.event.player, target));
            'step 1'
            if (result.bool) {
              let cards = player.getCards('h');
              player.give(cards, result.targets[0]);
              player.changeGroup('wei');
            }
          },
          ai: {
            order: 1,
            result: {
              target: function (player, target) {
                if (target.hasSkillTag('nogain')) return 0;
                if (player.countCards('h') == player.countCards('h', 'du')) return -1;
                if (target.hasJudge('lebu')) return 0;
                if (get.attitude(player, target) > 3) {
                  var basis = get.threaten(target);
                  if (player == get.zhu(player) && player.hp <= 2 && player.countCards('h', 'shan') && !game.hasPlayer(function (current) {
                    return get.attitude(current, player) > 3 && current.countCards('h', 'tao') > 0;
                  })) return 0;
                  if (target.countCards('h') + player.countCards('h') > target.hp + 2) return basis * 0.8;
                  return basis;
                }
                return 0;
              },
            },
          },
          "_priority": 0,
        },
      },
      translate: {
        "PScharacter_wei": '<span style="color:#0054ff;font-family:xingkai;font-size:24px">建安风骨</span>',
        "PScharacter_shu": '<span style="color:#ff453e;font-family:xingkai;font-size:24px">汉祚延绵</span>',//#ff5400
        "PScharacter_wu": '<span style="color:#338c00;font-family:xingkai;font-size:24px">江东铁壁</span>',
        "PScharacter_qun": '<span style="color:#8c8c8c;font-family:xingkai;font-size:24px">群雄并起</span>',
        "PScharacter_jin": '<span style="color:#991cff;font-family:xingkai;font-size:24px">三分归晋</span>',
        "PScharacter_shen": '<span style="color:#dc9e18;font-family:xingkai;font-size:24px">诸神降临</span>',
        "PScharacter_db": "<style>#双势力{animation:changeS 8s linear 4s infinite;}@keyframes changeS{ 0% {color:#0054ff;}35%{color: #ff453e;}65%{color: #338c00;}100% {color:#0054ff;}}</style><body><hhh id='双势力'><span style='font-family:xingkai;font-size:24px'>双势力</span></hhh></body>",
        PSshouyige: "双倍收益哥",
        // PSshouyige_prefix: 'PS',
        PSrexusheng: "PS大宝",
        PSsunquan: "PS孙权",
        PScaocao: "PS曹操",
        PSdianwei: "PS典韦",
        PSzhangjiao: "PS张角",
        PSsunshangxiang: "PS孙尚香",
        PSliuzan: "PS留赞",
        PSyuanshu: "PS袁术",
        PSzhanghe: "PS张郃",
        "PSsh_zhangfei": "拾荒张飞",
        PStongxiangge: "同甘共苦哥",
        "PSrs_wolong": "燃伤卧龙",
        PShuanggai: "PS黄盖",
        PSxushao: "PS许劭",
        PScaoxiu: "PS曹休",
        "PSshen_zhuge": "PS神诸葛",
        PShuangyueying: "PS黄月英",
        "PSshen_ganning": "PS神甘宁",
        PSguanning: "PS管宁",
        PSzhaoxiang: "PS赵襄",
        PSlukang: "PS陆抗",
        PSliru: "PS李儒",
        PScaoang: "PS曹昂",
        PSzuoci: "PS左慈",
        PSzhoutai: "PS周泰",
        PSerciyuan: "二次袁",
        PSdahantianzi: "大汉天子",
        PSnanhualaoxian: "PS南华老仙",
        PSzhangsong: "PS张松",
        PSquansun: "权孙",
        PSjiesuanjie: "额外结算姐",
        PSguanyunchang: "关云长",
        PSshen_zhaoyun: "PS神赵云",
        PSzhangxuan: "PS张嫙",
        PScenhun: "PS岑昏",
        PSshiniangongzhu: "十年公主",
        PScaojinyu: "PS曹金玉",
        PSzhaoyun: "PS赵云",
        PScaochun: "PS曹纯",
        PScaoshuang: "PS曹爽",
        "PSxian_caozhi": "仙界曹植",
        PSsunben: "PS孙笨",
        PSduyu: "PS杜预",
        "PSshen_jiangweix": "神姜维·改",
        "PSshen_jiangweix_prefix": '神',
        "PShs_zhonghui": "PS欢杀钟会",
        PSzhuangbeidashi: "装备大师",
        "PSboss_lvbu2": "新暴怒战神",
        "PSboss_lvbu3": "新神鬼无前",
        "PSboss_lvbu1": "新最强神话",
        "PSboss_lvbu4": "新炼狱修罗",
        PSshengui: "PS神鬼无前",
        PSzhangrang: "PS张让",
        PSxizhicai: "PS戏志才",
        PSxiahoujie: "PS夏侯杰",
        PSqun_sunce: "PS群孙策",
        PSgaoguimingmen: "高贵名门",
        PSsishouyige: "四收益哥",
        db_PSdaweiwuwang: "大魏吴王",
        "PShw_sunquan": "会玩的孙权",
        PSyangbiao: "PS杨彪",
        PSguosi: "PS郭汜",
        "PSshen_huangzhong": "PS神黄忠",
        "PSshen_guojia": "PS神郭嘉",
        PSzhenji: "PS甄姬",
        "PSwu_zhangliao": "武张辽",
        PSsunru: "PS孙茹",
        PSfuzhijie: "复制姐",
        "PSfx_shen_guanyu": "羽关神",
        PSpeixiu: "PS裴秀",
        "PSshen_liubei": "PS神刘备",
        "PSjin_duyu": "PS杜预",
        "PSsb_xushao": "双倍许劭",
        PSxushi: "PS徐氏",
        PSjiaxu: "PS贾诩",
        "PSshen_zhangliao": "PS神张辽",
        PSguanyu: "PS关羽",
        "PSshen_zhangfei": "PS神张飞",
        "PSmeng_liubei": "梦刘备",
        "PSshen_dengai": "PS神邓艾",
        "PSshen_xunyu": "PS神荀彧",
        "PShaozhao": "PS郝昭",
        "PSxuyou": "PS许攸",
        "PSshen_sunquan": "PS神孙权",
        PSlvmeng: "PS吕蒙",
        "PSshen_dianwei": "PS神典韦",
        PSzhonghui: "PS钟会",
        PSlibai: "PS李白",
        "PSxie_sunquan": "屑孙权",
        "PSshu_sunshangxiang": "PS蜀孙尚香",

        "PSshixian_ping": "平",
        "PSshixian_ze": "仄",
        PSliangzhu: "良助",
        "PSliangzhu_info": "当一名角色回复体力后，你可以摸一张牌，然后你可以弃置一张牌令其摸两张牌。",
        "PSfanxiang": "返乡",
        "PSfanxiang_info": "觉醒技，准备阶段开始时，若场上有已受伤且你发动过〖良助〗令其摸牌的角色，则你选择一项：1.增加一点体力上限并回复一点体力；2.获得技能〖枭姬〗；3.背水：失去技能〖良助〗，然后依次执行上述所有选项。",
        "PSzongheng": "纵横",
        "PSzongheng_info": "出牌阶段限X次，你可以弃置任意张花色相同或不同的手牌，并摸等量的牌。若弃置的牌大于三张，你多摸一张牌（X为你本回合未以此法弃置的花色数）。",
        "PSxiqu": "袭取",
        "PSxiqu_info": "限定技，出牌阶段，你可以选择一名其他角色，你令其弃置装备区所有牌，且可以获得其至多两张手牌。",
        "PSchengchen": "称臣",
        "PSchengchen_info": "觉醒技，当你杀死一名角色后，你将所有手牌交给一名其他“魏”势力角色，将势力改为“魏”，然后失去技能〖纵横〗，获得技能〖制衡〗。",
        "PSjiuxian": "酒仙",
        "PSjiuxian_info": "①你可以将额定目标数大于1的锦囊牌当做【酒】使用。②你使用【酒】无次数限制。③当你使用【酒】后，你使用的下一张牌无视条件触发技能〖诗仙〗。",
        "PSshixian": "诗仙",
        "PSshixian_info": "当你使用一张牌时，若此牌牌名的最后一个字的平仄声与你于本局游戏使用的上一张牌的不同，则你可以摸一张牌，并令此牌额外结算一次。(以平水韵为标准)",
        "PSpaiyi_backup": "权术",
        "PSquanshu": "权术",
        "PSquanshu_info": "当你造成或受到伤害后，你可以摸Y张牌，然后将一张手牌置于你的武将牌上，称为“权”，你的手牌上限+Z（Y为你已损失的体力值，Z为“权”的数量）。",
        "PSpaiyi": "排异",
        "PSpaiyi_info": "出牌阶段限一次，你可以移去一张“权”并令一名角色摸Z张牌，然后其对至多Z名角色各造成1点伤害（Z为“权”的数量且至少为1）",
        "PSjuanjia": "捐甲",
        "PSjuanjia_info": "锁定技，游戏开始时，你废除一个宝物栏、防具栏、攻击马栏和防御马栏，然后获得等量的额外武器栏。",
        PSbolan: "博览",
        "PSbolan_info": "锁定技,摸牌阶段,你改为摸与你体力值相等的牌，然后你记录本次以此法摸的牌为X，你获得X-2个“识”标记。每有一个“识”，你的手牌上限+1，计算与其他角色的距离-1。准备阶段,若你的“识”不小于5,你获得〖攻心〗。",
        PSgongxin: "攻心",
        "PSgongxin_info": "转换技,出牌阶段限一次。阳:你可以观看一名其他角色的手牌，然后获得其中任意张花色相同的牌。阴:你可以观看一名其他角色的手牌,然后选择获得其中任意张花色不同的牌。每以此法获得一张牌，你移去一个“识”。结束阶段,若你的“识”小于5，你失去〖攻心〗。",
        "PSyuheng": "驭衡",
        "PSyuheng_info": "①回合开始时，你可以弃置任意张花色不同的牌，然后摸等量的牌并获得等量吴势力的技能。②回合结束时，你可以选择失去任意个因〖驭衡①〗获得的技能，然后摸等量的牌。",
        "PSdili": "帝力",
        "PSdili_info": "觉醒技，当你因〖驭衡①〗获得的技能数大于你的体力上限时，你失去技能〖驭衡〗，然后获得技能〖圣质〗、〖权道〗、〖持纲〗。",
        PSfenyin: "奋音",
        "PSfenyin_info": " 你的回合内，当你使用第X张牌时，你摸X张牌。（X最多为5）",
        PSjieyin: "结姻",
        "PSjieyin_info": "出牌阶段限一次，你可以选择一名男性角色并弃置一张手牌或将装备区内的一张装备牌置于其装备区，你与其之中体力值等于体力上限的角色摸一张牌，体力值小于体力上限的角色摸一张牌的角色回复1点体力。",
        PSxiaoji: "枭姬",
        "PSxiaoji_info": "当一张装备牌进入或离开你的装备区后，你可以摸一张牌，若当前回合角色不是你，你改为摸三张牌。",
        PSliangquan: "两全",
        "PSliangquan_info": "锁定技，当你使用【杀】或【决斗】指定目标后，你令此牌需要依次使用或打出两张【闪】或【杀】响应。",
        PSshuangquan: "双全",
        "PSshuangquan_info": "锁定技。<br/>①你视为拥有技能〖马术〗〖飞影〗和〖无双〗。<br/>②你使用【杀】可以额外指定一名目标。<br/>③你造成的所有伤害翻倍，你受到的所有伤害减半（向上取整）。<br/>④你拥有双倍的初始手牌。摸牌阶段，你额外摸等量的牌。<br/>⑤你使用牌后，额外使用对应实体卡牌（不嵌套触发）。<br/>⑥当你不因此技能获得的回合结束后，你执行一个额外的回合。<br/>⑦限定技，当你进入濒死状态且未被救活时，你将体力值回复至体力上限。<br/>⑧游戏开始时，你获得等量的装备区副类别栏。<br/>⑨你回复体力时，回复效果翻倍。<br/>⑩你使用【铁索连环】时可额外指定两名目标，使用单体普通锦囊牌时可额外指定一名目标。",
        PSpojun: "破军",
        "PSpojun_info": "当你使用【杀】指定目标后，你可以获得其至多X张牌（X为其体力值）。当你因执行【杀】的效果而对一名角色造成伤害时，若该角色的手牌数和装备区内的牌数均不大于你，则此伤害+1。",
        PStongxiang: "同享",
        "PStongxiang_info": "当其他角色摸牌后，你可以摸等量的牌；当你的牌因弃置进入弃牌堆时，你可以令一名其他角色弃置等量的牌。",
        PSshihuang: "拾荒",
        "PSshihuang_info": "每当其他角色有牌非因使用或打出进入弃牌堆时，你可以获得之。",
        PSpaoxiao: "咆哮",
        "PSpaoxiao_info": "锁定技，出牌阶段，你使用【杀】没有数量限制。当你于回合内使用的【杀】数量不大于X，则你跳过你的弃牌阶段。（X为当前场上存活的人数）",
        PSleiji: "雷击",
        "PSleiji_info": "当一名角色使用或打出一张【闪】时，你可令一名其他角色进行一次判定：若结果为梅花，其受到一点雷电伤害，然后你回复一点体力；若结果为黑桃，其受到两点雷电伤害。",
        PSqiangxi: "强袭",
        "PSqiangxi_info": "出牌阶段限两次。你可以弃置一张武器牌或受到1点无来源伤害，然后对一名本回合内未成为过〖强袭〗目标的其他角色造成<span class=firetext>1</span>点伤害。然后你令描述中有颜色的数字+1。",
        PSranshang: "燃伤",
        "PSranshang_info": "当你对一名角色造成火焰伤害后，你可以令目标随机弃置一张牌，并获得等同于伤害数的“燃”标记；有“燃”的角色结束阶段开始时，其失去X点体力。（X为“燃”标记的数量）",
        PSzhiheng: "制衡",
        "PSzhiheng_info": "①出牌阶段限一次/②每回合限一次，当你成为一名角色使用牌的唯一目标时，你可以弃置任意张牌并摸等量的牌，若你在发动〖制衡〗时弃置了所有手牌，则你多摸一张牌。",
        PSjianxiong: "奸雄",
        "PSjianxiong_info": "当一名其他角色使用牌指定你为目标，你可以在你结算后从弃牌堆中获得此牌并摸一张牌。",
        PSqifan: "七反",
        "PSqifan_info": "锁定技，游戏开始时，你的身份更改为主公，你令其他角色的身份更改为反贼且明置。",
        PSjiwei: "继位",
        "PSjiwei_info": "锁定技，当你对主公使用【杀】造成伤害后，若你的身份不是主公，你与主公交换身份，然后增加一点体力上限并回复一点体力。",
        PSqiaobian: "巧变",
        "PSqiaobian_info": "你可以摸一张牌并跳过自己的一个阶段(准备阶段和结束阶段除外)；若你以此法跳过了摸牌阶段，则你可以获得至多两名其他角色的各一张手牌；若你以此法跳过了出牌阶段，则你可以移动场上的一张牌。",
        PSkurou: "苦肉",
        "PSkurou_info": "出牌阶段，你可以弃置一张牌，然后失去1点体力。",
        PSpingjian: "评荐",
        "PSpingjian_info": "准备阶段开始时/摸牌阶段开始时/结束阶段开始时/当你受到伤害后/当你进入濒死状态时/出牌阶段限一次，你可以令系统随机从剩余武将牌堆中检索出三张拥有发动时机为准备阶段开始时/摸牌阶段开始时/结束阶段开始时/当你受到伤害后/进入濒死状态时/出牌阶段的技能的武将牌。然后你可以选择尝试发动其中一个技能。每个技能每局只能选择一次。",
        PSqianju: "千驹",
        "PSqianju_info": "锁定技，游戏开始时，废除你的一个攻击马栏和防御马栏；你计算与其他角色之间的距离减X，其他角色计算与你之间的距离+X；你的坐骑牌均视为杀。（X为你当前已损失的体力值且至少为1）",
        PSqingxi: "倾袭",
        "PSqingxi_info": "当你使用伤害类锦囊或杀指定一名其他角色时，你可以弃置其1张牌，若此牌造成伤害，该伤害+1；若本回合此技能的发动次数等于你的攻击范围，你令此技能失效直到本回合结束。",
        PSqixing: "七星",
        "PSqixing_info": "游戏开始时/准备阶段开始时，若你的“星”少于7，你将牌堆顶的牌至于你的武将牌上，称之为“星”，你的“星”至多为7。然后/摸牌阶段结束后，你可用任意数量的手牌等量交换这些“星”。",
        PSkuangfeng: "狂风",
        "PSkuangfeng_info": "结束阶段，你可以弃置X张“星”并指定等量的角色：直到你的出牌阶段结束，该角色受到火焰伤害时，此伤害+1。",
        PSdawu: "大雾",
        "PSdawu_info": "结束阶段，你可以弃置X张“星”并指定等量的角色：直到你的出牌阶段结束，当这些角色受到非雷电伤害时，防止此伤害。",
        PSjizhi: "集智",
        "PSjizhi_info": "当你使用锦囊牌时，你可以摸两张牌。若此牌为基本牌，则你可以弃置之，然后令本回合手牌上限+1。",
        PSjieying: "劫营",
        "PSjieying_info": "回合开始时，若场上没有拥有“营”标记的角色，你获得1个“营”标记；结束阶段，你可以将你的一个“营”标记交给一名角色；有“营”标记的角色摸牌阶段多摸一张牌，出牌阶段使用【杀】的次数上限+1，手牌上限+1。有“营”的其他角色出牌阶段开始时，其移去“营”标记，然后你获得其所有手牌。",
        PSfushi: "扶世",
        "PSfushi_info": "回合结束阶段开始时，你可以移去所有\"梅影\"标记并摸等量的牌，然后从8张武将牌中选择并获得至多3个技能。若此时你是体力值最低的角色，你回复1点体力。",
        "PSfushi_append": '<span style="font-family: yuanli">开启扩展“天牢令”体验更佳</span>',
        PSdunshi: "遁世",
        "PSdunshi_info": "每回合限一次。你可以视为使用或打出一张即时牌，然后当前回合角色于本回合内下一次造成伤害时，你选择两项：<br/>⒈防止此伤害。系统从技能描述中包含“出牌/受伤/结束”字样的技能中随机选择4个其未拥有的技能，然后你令当前回合角色获得其中一个技能。<br/>⒉从〖遁世〗中删除你本次使用或打出的牌并获得一个“席”。<br/>⒊减1点体力上限并摸X张牌（X为你的“席”数）。",
        PSjueyan: "决偃",
        "PSjueyan_info": "出牌阶段限一次，你可以废除一种装备栏，然后执行对应一项：武器栏，你使用【杀】的次数上限+3；防具栏，你摸三张牌，且手牌上限+3；坐骑栏，你使用牌无距离限制；宝物栏，你获得〖集智〗。",
        PSjuece: "绝策",
        "PSjuece_info": "出牌阶段，你可以弃置一张【火杀】或【火攻】，然后重置技能〖焚城〗。结束阶段，你可以对一名本回合内失去过牌的角色造成1点伤害。",
        PSkangkai: "慷慨",
        "PSkangkai_info": "当一名角色成为伤害类牌的目标后，你可以摸一张牌。若如此做，你选择一名除其外的角色，除非该角色交一张牌给对方，否则失去一点体力。若交出的是装备牌，该角色可以使用此牌。",
        PSjiwu: "极武",
        "PSjiwu_info": "出牌阶段，你可以弃置一张牌，然后选择获得【强袭】、【铁骑】、【旋风】、【完杀】中的一项技能直到回合结束。",
        "PSmn_qiangxi": "强袭",
        "PSmn_qiangxi_info": "出牌阶段对每名其他角色限一次，你可以失去1点体力并摸一张牌，对你攻击范围内的一名其他角色造成1点伤害；其他角色受到伤害时，你可以弃置一张装备牌并令伤害值+1。",
        PShuiwan: "会玩",
        "PShuiwan_info": "你可以将〖制衡〗获得的牌当任意基本牌或锦囊牌使用或打出。",
        PShuashen: "化身",
        "PShuashen_info": "①游戏开始时，你随机获得两张未加入游戏的武将牌（均称为“化身牌”），然后你选择一项：1、制衡化身：弃置至多两张化身牌并重新获得等量+1张化身牌；2、更换技能：移除上次因化身获得的所有技能（若有），然后重新挑选化身牌上的至多三个技能（限定技、觉醒技、隐匿技、使命技、主公技等特殊技能除外）。准备阶段或回合结束阶段开始时，你可以选择“制衡化身”或“更换技能”。<br/>②出牌阶段，你可以改变你的性别和势力。",
        PSxinsheng: "新生",
        "PSxinsheng_info": "当你造成/受到一点伤害后，你获得一张“化身牌”。",
        PSbuqu: "不屈",
        "PSbuqu_info": "锁定技，当你处于濒死状态时，你亮出牌堆顶的一张牌并置于你的武将牌上，称之为“创”。若此牌的点数与你武将牌上已有的“创”点数均不同，则你回复至1体力。若点数相同，则将此牌置入弃牌堆。只要你的武将牌上有“创”，你的手牌上限/摸牌阶段摸牌数/〖奋激〗摸牌数/【杀】使用次数便+X（X为“创”的数量）。",
        PSfenji: "奋激",
        "PSfenji_info": "当一名角色的手牌不因赠予或交给而被其他角色获得后，或一名角色的手牌被其他角色弃置后，你可以令其摸两张牌。",
        PSzanhe: "暂和",
        "PSzanhe_info": "①你于回合内使用牌或于回合外失去牌后，可以重铸两张牌；<br/>②你每阶段使用杀的次数＋5且目标＋1，你使用普通锦囊牌时目标可以指定任意名角色；<br/>③每轮结束时，若你杀死过其他角色，则你须流失一点体力或弃置两张牌。",
        PSshengshi: "盛世",
        "PSshengshi_info": "锁定技，每当有人恢复体力后 ，你令全场流失一点体力并弃置一张你指定的牌，若没有牌，则改为流失一点体力。",
        PSluanshi: "乱世",
        "PSluanshi_info": "锁定技，每当你成为伤害类牌的目标后，展示并弃置牌堆顶三张牌，若点数之和：<br/>① 大于21，你恢复一点体力；<br/>②等于21 ，你流失一点体力；<br/>③小于21，你令来源承受此效果。",
        PSshanrang: "禅让",
        "PSshanrang_info": "主公技，锁定技，当你濒死时摸两张牌并与一名角色拼点，①若你赢则令其成为主公并获得〖盛世、乱世、禅让〗技能且你阵亡；②若你没赢则令全场流失一点体力且你阵亡。（若无法拼点则你选择一名其他角色令其执行效果① ）​",

        PSyufeng: "御风",
        "PSyufeng_info": "出牌阶段限两次，你可以选择X项（X为当前游戏轮数）:<br/>1.你可以选择一名角色让其摸5张牌，再将手牌弃置为X（X为其体力上限）。<br/>2.你选择2名角色调换座位。<br/>3.摸两张牌。<br/>4.选择至多3名角色各弃置其2张牌。<br/>当你的体力值变动时，你可令其中一项发动两次。",
        PStianshu: "天书",
        "PStianshu_info": "锁定技，你的宝物区视为装备【太平要术】。",
        PSyinshi: "隐士",
        "PSyinshi_info": "锁定技，你只有摸牌阶段、出牌阶段和弃牌阶段。",
        PSshenwu: "神武",
        "PSshenwu_info": "锁定技，你的♥牌均视为【桃】；你的【桃】可以对其他角色使用。",
        PShunwu: "魂武",
        "PShunwu_info": "当你回复体力至满状态后，你可以进行一次判定，若结果不为【杀】【雷杀】【火杀】【决斗】【南蛮】【万剑】【火攻】，你令一名已阵亡的角色复活并回复体力至体力上限。",
        PSqiangzhi: "强识",
        "PSqiangzhi_info": "出牌阶段开始时，你可以观看并展示一名其他角色的一张手牌。若如此做，当你于此阶段内使用与此牌类别相同的牌时，你可以摸一张牌。",
        PSxiantu: "献图",
        "PSxiantu_info": "一名其他角色的出牌阶段开始时，你可以摸两张牌，然后交给其一张牌，再获得其两张牌。若如此做，此阶段结束时，若该角色未于此阶段内杀死过角色，则你失去1点体力。",
        PShengzhi: "衡制",
        "PShengzhi_info": "出牌阶段限X次，你可以摸你手牌区和装备区牌数量的牌，然后弃置等量的牌。（X为你已损失的体力值且至少为1）",
        PSnengwan: "能玩",
        "PSnengwan_info": "锁定技，你的摸牌阶段和出牌阶段阶段不能被跳过。",
        PSzailaiyici: "再来一次",
        "PSzailaiyici_info": "一名角色使用即时牌指定第一个目标后，你可令此牌额外结算一次。",
        PSweizhen: "威震",
        "PSweizhen_info": "①你拥有以下效果：<br/>1：使用红色杀的距离+0 ；<br/>2：使用红色杀造成伤害+0；<br/> 3：使用红色杀可以额外指定0名目标；<br/>4：使用红色杀的次数+0；<br/>5：每回合使用第0张红色杀不能被响应。<br/>当一名角色使用红色杀造成一点伤害后，或你的准备阶段/回合结束阶段开始时，你选择上述中的一个数字+1。<br/>②出牌阶段，你可以重铸黑色牌。",
        PSjuejing: "绝境",
        "PSjuejing_info": "锁定技，你的手牌上限+2；当你失去手牌时，你摸一张牌。",
        PSfuzhi: "复制",
        "PSfuzhi_info": "一名角色使用牌结算后，你可以使用同名实体牌。",
        PStongli: "同礼",
        "PStongli_info": "出牌阶段，当你使用即时牌指定第一个目标后，你可令此牌效果额外执行X次（X为你的手牌数）。",
        PSlianhuo: "链祸",
        "PSlianhuo_info": "锁定技，当你受到火焰伤害时，若你的武将牌处于横置状态且此伤害不为连环伤害，则此伤害+X。(X为处于横置状态的角色数)。你是所有铁索连环伤害的源头。",
        PSyuqi: "隅泣",
        "PSyuqi_info": "每回合限三次。当有角色受到伤害后，若你至其的距离不大于<span class=thundertext>0</span>，则你可以观看牌堆顶的<span class=firetext>3</span>张牌。你将其中至多<span class=greentext>1</span>张牌交给受伤角色，然后可以获得剩余牌中的至多<span class=yellowtext>1</span>张牌，并将其余牌以原顺序放回牌堆顶。",
        PSshanshen: "善身",
        "PSshanshen_info": "当有角色死亡时，你可令你的〖隅泣〗中的所有数字+2。然后若你未对该角色造成过伤害，则你回复1点体力。",
        PSxianjing: "娴静",
        "PSxianjing_info": "准备阶段，你可令你的〖隅泣〗中的所有数字+1。",
        PShuwei: "虎威",
        "PShuwei_info": "锁定技，若你的体力值：为4或更少，你视为拥有技能〖涯角〗；为3或更少，你视为拥有技能〖冲阵〗；为2或更少，你视为拥有技能〖龙魂〗；为1或更少，你视为拥有技能〖绝境〗。",
        PSreshanjia: "缮甲",
        "PSreshanjia_info": "出牌阶段开始时，你可以摸3张牌,然后弃置3张牌，若弃置的牌包含：基本牌，视为对一名角色使用一张【杀】（无距离限制且不计入次数）；锦囊牌，视为使用一张不能被无懈的普通锦囊牌；装备牌，“缮甲”摸牌数+1。",
        PSxiaorui: "骁锐",
        "PSxiaorui_info": "出牌阶段限一次，你可以失去一点体力获得一名角色两张牌并对其造成一点伤害，若获得牌中有装备你恢复一点体力。",
        PSshanjia: "缮甲",
        "PSshanjia_info": "出牌阶段开始时，你可以摸三张牌，然后弃置3-X张牌(X为你本局游戏内不因使用而失去过的装备牌的数目且至多为3)。若你没有以此法弃置延时锦囊牌，则你可以视为使用了一张无距离限制且不计入出牌阶段使用次数且无视防具的【杀】，若此杀造成伤害，本局游戏“缮甲”摸牌数和伤害+1。",
        PStuogu: "托孤",
        "PStuogu_info": "一名角色死亡时，你可以获得其武将牌上的一个技能。",
        PSjiushi: "酒诗",
        "PSjiushi_info": "锁定技，你永久处于喝酒状态，你可以将一张牌当『酒』使用，你使用『酒』无次数限制",
        PSluoying: "落英",
        "PSluoying_info": "锁定技：你立即获得任何方式进入弃牌堆的♣牌（自己的牌除外），以此法获得牌不计入手牌上限。",
        PSbaiban: "白板",
        "PSbaiban_info": "锁定技，若你的体力值为2时，你防止受到小于2的伤害。",
        "PSbb_hunzi": "魂姿",
        "PSbb_hunzi_info": "觉醒技，准备阶段，若你的体力值为1，你减1点体力上限，并获得技能〖英姿〗和〖英魂〗。",
        "PSbb_yingzi": "英姿",
        "PSbb_yingzi_info": "摸牌阶段，你可以多摸X张牌（X为你的体力上限），你的手牌上限为你的体力上限。",
        "PSbb_yinghun": "英魂",
        "PSbb_yinghun_info": "准备阶段开始时，你可令一名角色执行一项：摸X张牌，然后弃置一张牌；或摸一张牌，然后弃置X张牌（X为你的体力上限）。",
        PSmiewu: "灭吴",
        "PSmiewu_info": "每回合限一次，你可以将一张牌当做任意一张基本牌或锦囊牌使用或打出，然后你摸一张牌。",
        PSqiyang: "弃养",
        "PSqiyang_info": "锁定技，你的回合外，若你不因〖灭吴〗获得牌时，弃置之。",
        "PSmn_quanji": "权计",
        "PSmn_quanji_info": "你的手牌上限基数为0。当你受到1点伤害后，你可以摸两张牌。出牌阶段，你可以将任意张手牌置于武将牌上，称为“权”。你的手牌上限+X（X为武将牌上“权”的数量）。",
        "PSmn_paiyi_backup": "排异",
        "PSmn_paiyi": "排异",
        "PSmn_paiyi_info": "出牌阶段限X次，你可以移去一张“权”并选择一名角色，令其摸两张牌，然后若其手牌数大于你，你对其造成1伤害。（X为场上与你距离不大于1的角色数）",
        PSjiufa: "九伐",
        "PSjiufa_info": "锁定技，当你使用牌指定其他角色时，你获得等同于目标数的“伐”标记。每回合限一次，当你的“伐”不小于九时，你移去九个“伐”并展示牌堆顶的九张牌，获得其中较多的同色牌。",
        PSkefu: "克复",
        "PSkefu_info": "你可以将X张牌当作不计入次数且无次数限制的【杀】使用或打出（X为你当前体力值），此【杀】造成伤害后你回复一点体力，若不能回复则增加一点体力上限。",
        "PSjingjia1": "精甲",
        "PSjingjia1_info": "锁定技，游戏开始时，你将五张对应装备栏的装备牌置入你的装备区；当你即将废除装备区或失去装备区的牌时，取消之。",
        "PSbaguan1": "霸关",
        "PSbaguan1_info": "锁定技，你的初始手牌数为8，游戏开始时，你将四张虎牢关专属装备置入牌堆，每名角色回合结束后，你执行一个额外回合，你无法因此连续行动两个回合。当你的体力值不大于已损失体力值/游戏第二轮开始时/你将要阵亡时，终止阵亡结算，选择将武将牌替换为“暴怒战神”、“神鬼无前”或“炼狱修罗”，然后将体力值和体力上限调整为6并立即开始你的回合。",
        "PSaozhan1": "鏖战",
        "PSaozhan1_info": "锁定技，若你装备区内有：武器牌，你可以多使用一张【杀】；防具牌，你受到的伤害始终为一；坐骑牌，摸牌阶段多摸一张牌；宝物牌，跳过你的判定阶段，且你无法被翻面。",
        "PSshenwei2": "神威",
        "PSshenwei2_info": "锁定技，判定阶段，若你的判定区有牌，则你须弃置两张牌，然后弃置自己判定区内的所有牌；摸牌阶段，你额外摸三张牌，你的手牌上限为你的体力上限。",
        "PSshenji2": "神戟",
        "PSshenji2_info": "出牌阶段限两次，你可以弃置一张牌，然后获得未拥有的一项效果直到回合结束：<br/>一、使用【杀】可以额外指定两名目标。<br/>二、使用【杀】无距离限制，且次数+1。<br/>三、使用【杀】造成伤害+1。<br/>四、使用【杀】指定目标时，目标须弃置一张牌。",
        PSshenzhu: "神铸",
        "PSshenzhu_info": "出牌阶段，你可以将两张装备牌合成一张装备牌。",
        PSwantian: "挽天",
        "PSwantian_info": "出牌阶段限一次，你可以将体力上限调整为一，你每以此法失去一点体力或体力上限摸一张牌。",
        PStaoluan: "滔乱",
        "PStaoluan_info": "每回合每种牌名限一次，你可以将一张牌当做任意一张基本牌或锦囊牌使用或打出，然后你摸一张牌。",
        "PSbaguan2": "霸关",
        "PSbaguan2_info": "每轮限一次，回合开始阶段/出牌阶段/回合结束阶段可发动，你可以将武将牌替换为“暴怒战神”“神鬼无前”或“炼狱修罗”（三种形态共享次数），〖狂暴〗或由〖神戟〗〖极武〗获得的效果不会因武将牌替换而消失。",
        "PSshenqu3": "神躯",
        "PSshenqu3_info": "锁定技，一名角色准备阶段，若你的手牌数不大于体力上限，你摸X+1张牌（X为你已损失的体力值且至多为2）。当你受到伤害后，若你手牌中有【桃】，则你使用之。",
        "PSjiwu3": "极武",
        "PSjiwu3_info": "出牌阶段限两次，你可以弃置一张牌，然后选择获得【强袭】、【铁骑】、【旋风】、【完杀】中的一项技能直到回合结束。",
        "PSkuangbao4": "狂暴",
        "PSkuangbao4_info": "锁定技，游戏开始时，你获得两枚“暴怒”标记；当你造成/受到伤害后，你获得1枚“暴怒”标记。（你的“暴怒”标记至多为6）",
        PSxianfu: "先辅",
        "PSxianfu_info": "锁定技，游戏开始时，你选择一名其他角色，当其受到伤害/回复体力/摸牌/弃牌后，你受到等量的伤害/回复等量的体力/摸等量的牌/弃置等量的牌。〖先辅〗角色死亡后，你重新选择一名〖先辅〗角色。",
        PSchouce: "筹策",
        "PSchouce_info": "当你受到1点伤害后，你可以判定，若结果为：黑色，你弃置一名角色区域里的一张牌；红色，你选择一名角色，其摸一张牌，若其是〖先辅〗选择的角色，改为其摸两张牌。",
        PSdanda: "胆大",
        "PSdanda_info": "锁定技，其他角色的准备阶段，你与其依次比较双方的手牌数，体力值与装备区牌数，你每有一项大于该角色则摸一张牌。 若均大于该角色，你加1点体力上限。",
        PSxiaozhan: "骁战",
        "PSxiaozhan_info": "当你使用【杀】造成伤害后，你摸X张牌且当前回合使用【杀】次数+X（X为此【杀】造成的伤害数），每当你击杀一名角色时你将手牌数摸至体力上限。",
        PSzengxi: "赠玺",
        "PSzengxi_info": "觉醒技，准备阶段，若你装备区的牌数不少于2，你加一点体力上限并回复一点体力，将装备区的所有牌交给一名其他角色，其将一半手牌（向下取整）交给你，然后你获得技能〖虎踞〗。",
        PShuju: "虎踞",
        "PShuju_info": "你使用牌无距离限制。出牌阶段，你可以摸等同于自身已损失体力值的牌，然后减一点体力上限，本回合使用牌的伤害基数和回复基数+1。",
        PSluansha: "乱杀",
        "PSluansha_info": "锁定技，当你使用牌结算后，若此牌没有造成伤害，你摸等同于此牌目标数的牌。",
        PShengce: "衡策",
        "PShengce_info": "准备阶段，你可以从以下选项中选择一项：<br/> 1.对一名角色造成两点伤害 <br/>2.令一名角色摸四张牌 <br/>3.令一名角色弃四张牌<br/> 4.获得一名角色两张牌 <br/>5.令一名角色恢复两点体力 <br/>6.令一名角色增加两点体力上限",
        "PSdwww_zhiheng": "制衡",
        "PSdwww_zhiheng_info": "出牌阶段限一次，你可以摸 X+1张牌，然后弃置 X张牌  ，若你以此法弃置的牌中包含：1．锦囊牌，本回合你可以将制衡修改为出牌阶段限两次；2．装备牌，你本回合使用牌没有距离限制。( x 为你的手牌数且最少为 1)",
        PSxiangong: "献贡",
        "PSxiangong_info": "魏势力技，锁定技，当你不于弃牌阶段弃置牌时，你将弃置的牌置于一名没有【贡】武将上，称之为【贡】。当你受到伤害时，你选择有【贡】且【贡】数量不小于伤害值的角色，其获得等量的【贡】然后将你此伤害转移给该角色。",
        PScuicheng: "摧城",
        "PScuicheng_info": "吴势力技，觉醒技，准备阶段开始时，若你本局游戏造成过伤害且发动过至少三次【制衡】，你恢复一点体力并摸一张牌，然后从你已开通的吴势力武将中挑选四名武将，并选择三个技能获得之。",
        "PScuicheng_append": '<span style="font-family: yuanli">开启扩展“天牢令”体验更佳</span>',
        PSzhaohan: "昭汉",
        "PSzhaohan_info": "锁定技，准备阶段，你加一点体力上限并回复一点体力。",
        PSyizheng: "义争",
        "PSyizheng_info": "出牌阶段限两次，你可以与一名体力值不大于你的角色拼点：若你赢，跳过其下个摸牌阶段；若你没赢，其减一点体力上限并弃置区域内所有牌。",
        PStanbei: "贪狈",
        "PStanbei_info": "出牌阶段对每名其他角色限一次，你可以指定一个目标角色，选择一项：1. 你随机获得其一个区域的一张牌，此回合不能再对其使用牌；2. 令你此回合对其使用牌没有次数和距离限制。",
        PSsidao: "伺盗",
        "PSsidao_info": "出牌阶段，当你对一名其他角色每连续使用两张牌后，你可将一张手牌当无距离限制的顺手牵羊对其使用",
        "PSshenfen4": "神愤",
        "PSshenfen4_info": "出牌阶段限两次，你可以弃置一定数量的“狂暴”标记，然后执行一项效果: <br/>一枚：你选择回复一点体力或令一名其他角色失去一点体力<br/>两枚：你使用的下一张非延时锦囊牌可额外指定两名角色为目标(铁锁连环改为增加一个目标)，若该锦囊牌的目标包括自己，你收回此牌<br/>三枚：你摸三张牌并弃置场上所有其他角色四张手牌和装备区内的所有牌<br/>四枚:所有其他角色受到一点无来源伤害，然后你获得X枚“狂暴”标记( X为场上受到伤害的角色数，以此法获得的“狂暴”标记最多为3 )",
        PSdingjun: "定军",
        "PSdingjun_info": "每当你使用【杀】指定唯一目标时，你根据此【杀】的花色获得以下效果：<br/>黑桃，此【杀】伤害＋X ；<br/>梅花，本回合使用【杀】次数＋X ；<br/>方片，摸X张牌；<br/>红桃，获得X点护甲；<br/>X为此【杀】的点数。",
        PShuishi: "慧识",
        "PShuishi_info": "出牌阶段限一次。你可进行判定牌不置入弃牌堆的判定。若判定结果与本次发动技能时的其他判定结果的点数均不相同，则你加1点体力上限（若你的体力上限不小于10则不加），且可以重复此流程。然后你将所有位于处理区的判定牌交给一名角色。若其手牌数为全场最多，则你减1点体力上限。",
        PSluoshen: "洛神",
        "PSluoshen_info": "锁定技，每名角色回合结束阶段开始时，须选择一项：1.弃置两张花色不同的黑色牌；2.展示牌堆底三张牌，将其中的黑色牌置于你武将牌上，称为“洛神”，你可以将洛神牌如手牌般使用或打出。",
        PSqingguo: "倾国",
        "PSqingguo_info": "你可以将一张黑色牌或洛神牌当【闪】使用或打出，该【闪】生效后，你可以将之置于牌堆底。",
        "PSwu_tuxi": "突袭",
        "PSwu_tuxi_info": "摸牌阶段，你可以少摸任意张牌并获得等量的其他角色区域内等量的牌。",
        "PSwu_zhenzhan": "阵斩",
        "PSwu_zhenzhan_info": "锁定技。其他角色使用多目标的牌指定目标时/于弃牌阶段外弃置牌后，你对其造成X点伤害。（X为此牌目标数/弃置的牌数，且至多为你已损失体力值，至少为1）",
        PSyingjian: "影箭",
        "PSyingjian_info": "准备阶段开始时/判定阶段开始时/摸牌阶段开始时/弃牌阶段开始时/结束阶段开始时/出牌阶段限一次，你可以视为使用一张无视防具，无距离限制，不计入次数的【杀】。",
        PSshixin: "释衅",
        "PSshixin_info": "锁定技，防止你受到火属性伤害，你受到的非火焰伤害-1；你于回合内第一次造成伤害时，回复一点体力。",
        PSxingtu: "行图",
        "PSxingtu_info": "锁定技。①当你使用有点数的牌结算结束后，你将此牌点数记录为X。②当你使用牌时，系统随机给出此牌的点数Y与X的四则运算式子（除法除外），你需要在3秒内选择答案；若答案正确，你摸一张牌，否则此效果本回合失效③你使用②摸到的牌无次数限制。",
        PSjuezhi: "爵制",
        "PSjuezhi_info": "出牌阶段限一次，你可以弃置两张牌，然后摸两张牌，令〖行图〗②重新生效。",
        PSlongnu: "龙怒",
        "PSlongnu_info": "转换技，锁定技，阳：出牌阶段开始时，你失去1点体力并摸一张牌，然后本阶段内你视为拥有技能〖怒斩〗，且你的红色手牌均视为火【杀】且无距离限制。阴：出牌阶段开始时，你减1点体力上限并摸一张牌，然后本阶段内你然后本阶段内你视为拥有技能〖厉勇〗，且你的锦囊牌均视为雷【杀】且无使用次数限制。",
        "PSlb_jieying": "结营",
        "PSlb_jieying_info": "锁定技，游戏开始时或当你的武将牌重置时，你横置；所有已横置的角色手牌上限+2；当你的体力或体力上限变化后，你摸一张牌，然后横置一名其他角色。",
        PSsanchen: "三陈",
        "PSsanchen_info": "出牌阶段限三次，你可以摸3张牌，然后观看一名其他角色的手牌，从中弃置任意张花色不同的牌。",
        PSzhaotao: "诏讨",
        "PSzhaotao_info": "觉醒技，结束阶段开始时，若你本局游戏已发动两次以上〖三陈〗，你增加一点体力上限并回复一点体力，废除判定区，然后获得〖灭吴〗。",
        PSpozhu: "破竹",
        "PSpozhu_info": "出牌阶段，你可以弃置两张牌，对一名其他角色造成一点伤害。",
        "PSjin_miewu": "灭吴",
        "PSjin_miewu_info": "锁定技，若你的判定区已废除，则你的判定阶段视为摸牌阶段。",
        "PSsb_pingjian": "评荐",
        "PSsb_pingjian_info": "结束阶段开始时</font>/当你受到伤害后</font>/出牌阶段限一次，你可以令系统随机从剩余武将牌堆中检索出6张拥有发动时机为结束阶段开始时/当你受到伤害后/出牌阶段的技能的武将牌。然后你可以选择尝试发动其中2个技能。每个技能每局只能选择一次。",
        "PSsb_pingjian_append": '<span style="font-family: yuanli">开启扩展“天牢令”体验更佳</span>',
        PSwengua: "问卦",
        "PSwengua_info": "其他角色/你的出牌阶段限一次，其可以交给你一张牌，(若当前回合角色为你，则跳过此步骤)，你可以将此牌/一张牌置于牌堆顶或牌堆底，然后你与其/你从另一端摸一张牌",
        "PSwengua_1": "问卦·升级",
        "PSfuzhu_info": "使命技。①一名男性角色的结束阶段，若牌堆剩余牌数不大于你体力值的十倍，则你可以依次对其使用牌堆中所有的【杀】（不能超过游戏人数），然后洗牌。②成功：当你因〖伏诛〗①杀死该角色后，你摸Y张牌，然后升级〖问卦〗（Y为你发动〖伏诛〗①造成伤害数的一半，向上取整）。③失败：当你发动〖伏诛〗①没有杀死该角色，你回复一点体力（若体力值已满，则摸一张牌）。",
        PSfuzhu: "伏诛",
        "PSwengua_1_info": "其他角色/你的出牌阶段限一次，其可以交给你一张牌，(若当前回合角色为你，则跳过此步骤)，然后你与其/你从牌堆顶或牌堆底摸一张牌。你的问卦牌不计入手牌上限，当你失去问卦牌时，你摸一张牌。",
        PSluanwu: "乱武",
        "PSluanwu_info": "出牌阶段限一次。你可以选择至少两名角色，然后每名你选择的角色依次视为对这些角色中与其逆时针座次最近的另一名角色使用一张不计入次数的【杀】。",
        PSwansha: "完杀",
        "PSwansha_info": "锁定技，你的回合内，除你以外，进入濒死状态的角色立即死亡，且使其进入濒死状态的角色视为杀死其的角色。",
        PSduorui: "夺锐",
        "PSduorui_info": "出牌阶段，你可以废除一个装备栏，然后获得场上的一个技能。当你于出牌阶段内对一名其他角色造成伤害后，你可以令该角色的一个技能失效直到其回合结束。",
        "PSduorui_append": '<span style="font-family: yuanli">开启扩展“天牢令”体验更佳</span>',
        PSwusheng: "武圣",
        "PSwusheng_info": "你可以将一张红色牌当做【杀】使用或打出。你使用的♦杀没有距离限制且可以获得对方一张牌；你使用的♥杀造成伤害+1，且目标需要连续使用两张【闪】才能抵消。",
        PSmashu: "马术",
        "PSmashu_info": "锁定技，你计算与其他角色的距离时-1，其他角色计算与你的距离时+1。",
        PSyijue: "义绝",
        "PSyijue_info": "出牌阶段限一次，你可以弃置一张牌并令一名有牌的其他角色选择交给你一张由你声明花色和类型的牌。若其选择不交出，你摸一张牌，该角色不能使用或打出牌，非锁定技失效且受到来自你的【杀】伤害+1直到回合结束。否则你可以令其回复一点体力。",
        PSshencai: "神裁",
        "PSshencai_info": "出牌阶段限一次，你可以令一名其他角色进行判定。你获得此判定牌，然后若此判定牌：包含以下要素中的任意一个，获得对应的效果：{⒈体力：当其受到伤害后，其失去等量的体力、⒉武器：其不能使用牌响应杀、⒊打出：当其失去手牌后，其再随机弃置一张手牌（不嵌套触发）、⒋距离：其的结束阶段开始时，其翻面}；若均不包含，你获得其区域里的一张牌，其获得一枚“死”并获得如下效果：其的角色手牌上限-X、其的回合结束时，若X大于场上存活人数，则其死亡（X为其“死”标记数）。",
        PSxunshi: "巡使",
        "PSxunshi_info": "锁定技。①你手牌区内所有的多目标锦囊牌均视为花色为none的普【杀】。②你使用颜色为none的牌无距离和次数限制。③当你使用无颜色的牌选择目标后，你令你的〖神裁〗的发动次数上限+1（至多为5），然后可以为此牌增加任意个目标。",
        PStaoyuan: "桃园",
        "PStaoyuan_info": "锁定技，当你体力减少后，你从牌堆顶亮出X张牌，若亮出的牌颜色不全为黑色，则你将体力回复到1，然后你指定一名角色，令其从三张未登场的蜀势力武将牌中选择一名获得上面所有技能。（X为场上蜀势力角色的数量）",
        PSshiren: "识人",
        "PSshiren_info": "你的手牌上限加X。出牌阶段限制一次，你可以与你攻击范围内的一名角色进行拼点，若你赢，则该角色的势力变为蜀势力。（X为场上蜀势力角色的数量）",
        PSxianjin: "拓域",
        "PSxianjin_info": "锁定技。游戏开始时，你激活所有副区域。当你造成或受到伤害后，若这是你本局游戏内第偶数次造成或受到伤害，则你激活一个副区域标签并摸X张牌（X为你已激活的副区域数，若你的手牌数为全场最多则改为摸一张牌）。",
        PSlingce: "灵策",
        "PSlingce_info": "锁定技，当牌堆洗牌时，你观看牌堆顶8张牌，并从中获得牌名不同的牌，剩余的牌进入弃牌堆。",
        PStianzuo: "天佐",
        "PStianzuo_info": "出牌阶段限一次/当你受到一点伤害后/回合结束时，你可以令牌堆洗牌。",
        PSdinghan: "定汉",
        "PSdinghan_info": "觉醒技，当你本局游戏至少发动过三次〖天佐〗，你增加一点体力上限并回复一点体力，获得技能〖佐定〗，然后将〖灵策〗中“获得牌名不同的牌”修改为“ 获得其中至多六张牌”。",
        PSzuoding: "佐定",
        "PSzuoding_info": "出牌阶段限三次，你可以将一张牌当【奇正相生】使用。",
        "PSzhengu": "镇骨",
        "PSzhengu_info": "结束阶段，你可以选择一名未被【镇骨】的其他角色，直到其回合结束时，其手牌数保持与你一致。",
        "PSchenglve": "成略",
        "PSchenglve_info": "转换技，出牌阶段限一次，阴：你可以摸一张牌，然后弃置两张手牌。阳：你可以摸两张牌，然后弃置一张手牌。若如此做，直到本回合结束，你使用与弃置牌花色相同的牌无距离和次数限制，且当你使用/打出/弃置与弃置牌花色相同的牌后，你摸一张牌。",
        "PSshicai": "恃才",
        "PSshicai_info": "当你使用牌时，若此牌与你本回合使用的牌名均不同，则你可以将此牌置于牌堆顶，然后摸一张牌。",
        "PSpingjian_use": "评荐",
      },
      dynamicTranslate: {
        //PS徐氏〖问卦〗动态翻译
        PSwengua: function (player) {
          if (player.storage.PSfuzhu) return '其他角色/你的出牌阶段限一次，其可以交给你一张牌，(若当前回合角色为你，则跳过此步骤)，然后你与其/你从牌堆顶或牌堆底摸一张牌。你的问卦牌不计入手牌上限，当你失去问卦牌时，你摸一张牌。';
          return '其他角色/你的出牌阶段限一次，其可以交给你一张牌，(若当前回合角色为你，则跳过此步骤)，你可以将此牌/一张牌置于牌堆顶或牌堆底，然后你与其/你从另一端摸一张牌';
        },

        //PS周泰〖奋激〗动态翻译
        PSfenji: function (player) {
          var num = 2;
          if (player.getExpansions('PSbuqu').length) num += player.getExpansions('PSbuqu').length;
          return '当一名角色的手牌不因赠予或交给而被其他角色获得后，或一名角色的手牌被其他角色弃置后，你可以令其摸' + get.cnNumber(num) + '张牌。';
        },
        //PS生熏鱼〖灵策〗动态翻译
        PSlingce: function (player) {
          if (player.storage.PSdinghan) return '锁定技，当牌堆洗牌时，你观看牌堆顶8张牌，并从中获得至多六张牌，剩余的牌进入弃牌堆。';
          return '锁定技，当牌堆洗牌时，你观看牌堆顶8张牌，并从中获得牌名不同的牌，剩余的牌进入弃牌堆。';
        },
        //PS吕蒙〖攻心〗动态翻译
        PSgongxin: function (player) {
          if (player.storage.PSgongxin == true) return '转换技,出牌阶段限一次。<span class="bluetext">阳:你可以观看一名其他角色的手牌，然后获得其中任意张花色相同的牌。</span>阴:你可以观看一名其他角色的手牌,然后选择获得其中任意张花色不同的牌。每以此法获得一张牌，你移去一个“识”。结束阶段,若你的“识”小于5，你失去〖攻心〗。';
          return '转换技,出牌阶段限一次。阳:你可以观看一名其他角色的手牌，然后获得其中任意张花色相同的牌。<span class="bluetext">阴:你可以观看一名其他角色的手牌,然后选择获得其中任意张花色不同的牌。</span>每以此法获得一张牌，你移去一个“识”。结束阶段,若你的“识”小于5，你失去〖攻心〗。';
        },
        //PS神刘备〖龙怒〗动态翻译
        PSlongnu: function (player) {
          if (player.storage.PSlongnu == true) return '转换技，锁定技，<span class="bluetext">阳：出牌阶段开始时，你失去1点体力并摸一张牌，然后本阶段内你视为拥有技能〖怒斩〗，且你的红色手牌均视为火【杀】且无距离限制。</span>阴：出牌阶段开始时，你减1点体力上限并摸一张牌，然后本阶段内你然后本阶段内你视为拥有技能〖厉勇〗，且你的锦囊牌均视为雷【杀】且无使用次数限制。';
          return '转换技，锁定技，阳：出牌阶段开始时，你失去1点体力并摸一张牌，然后本阶段内你视为拥有技能〖怒斩〗，且你的红色手牌均视为火【杀】且无距离限制。<span class="bluetext">阴：出牌阶段开始时，你减1点体力上限并摸一张牌，然后本阶段内你然后本阶段内你视为拥有技能〖厉勇〗，且你的锦囊牌均视为雷【杀】且无使用次数限制。</span>';
        },
      },
    };
    for (var i in PScharacter.character) {
      PScharacter.character[i][4].push(((lib.device || lib.node) ? 'ext:' : 'db:extension-') + 'PS武将/image/character/' + i + '.jpg');
      if (!PScharacter.character[i][4].some(tag => /^die:.+$/.test(tag))) PScharacter.character[i][4].push(`die:../audio/die/${i.replace('PS', '')}.mp3`);
      if (i.includes('PS')) {
        lib.translate[i + '_prefix'] = i.includes('PSshen_') ? 'PS神' : 'PS';
      }
    }
    return PScharacter;
  });

  lib.config.all.characters.push('PScharacter');
  lib.config.all.sgscharacters.push('PScharacter');
  if (!lib.config.characters.contains('PScharacter')) lib.config.characters.push('PScharacter');
  lib.translate['PScharacter_character_config'] = 'PS武将';
});
/*  <-------------------------武将包与卡包模板（搬运自“活动武将”）-------------------------> */
//复杂武将包模板(可关闭)
/* game.import('character', function () {
  var 武将包英文名 = {
    name: '武将包英文名',
    connect: true,
    characterSort: {
      武将包英文名: {
      },
    },
    character: {
    },
    skill: {
    },
    translate: {
    },
  };
  for (var i in 武将包英文名.character) {
    武将包英文名.character[i][4].push(((lib.device || lib.node) ? 'ext:' : 'db:extension-') + '活动武将/' + i + '.jpg');
  }
  return 武将包英文名;
});
lib.config.all.characters.push('武将包英文名');
lib.config.all.sgscharacters.push('武将包英文名');
if (!lib.config.characters.contains('武将包英文名')) lib.config.characters.remove('武将包英文名');//remove默认关闭，push默认开启
lib.translate['武将包英文名_character_config'] = '武将包中文名';
 
//复杂卡包模板(可关闭)
game.import('card', function () {
  return {
    name: '卡包英文名',
    connect: true,
    card: {
    },
    skill: {
    },
    translate: {
    },
    list: [],
  };
});
lib.config.all.cards.push('卡包英文名');
if (!lib.config.cards.contains('卡包英文名')) lib.config.cards.remove('卡包英文名');
lib.translate['卡包英文名_card_config'] = '卡包中文名'; */