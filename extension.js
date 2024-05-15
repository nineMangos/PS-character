game.import("extension", function (lib, game, ui, get, ai, _status) {
  window.PScharacter = {
    import: function (func) {
      func(lib, game, ui, get, ai, _status);
    },
    updateHistory: {},
    deepClone: function (obj) {
      return new Promise((resolve) => {
        const { port1, port2 } = new MessageChannel();
        port1.postMessage(obj);
        port2.onmessage = (msg) => {
          resolve(msg.data);
        }
      });
    },//window.PScharacter.deepClone(obj).then(i => obj2 = i)
    characters: []
  };
  return {
    name: "PS武将",
    editable: false,
    content: function (config, pack) {
      /* <-------------------------武将评级-------------------------> */
      //垃圾武将
      lib.rank.rarity.junk.addArray(['PScenhun', 'PSliru', 'PSquansun', 'PSrs_wolong', 'PSsunshangxiang', 'PSfx_shen_guanyu']);
      //精品武将
      lib.rank.rarity.rare.addArray(['PScaoang', 'PSzhugeliang', 'PSmenghuo', 'PSsp_yebai', 'PSshu_sunshangxiang', 'PSxie_sunquan', 'PSxushi', 'PSguanyu', 'PSshen_zhangfei', 'PSlvmeng', 'PSxuyou', 'PShaozhao', 'PSpeixiu', 'PSjiaxu', 'PSshen_liubei', 'PSjiaxu', 'PSzhuangbeidashi', 'PScaocao', 'PSzhoutai', 'PSzhangsong', 'PSshiniangongzhu', 'PSzhanghe', 'PSzhangjiao', 'PSsp_yeshou', 'PSyuanshu', 'PSxizhicai', 'PSsunben', 'PSsunquan', 'PSliuzan', 'PSshen_jiangweix', 'PSshen_zhuge', 'PSrexusheng', 'PSshen_huangzhong', 'PSshen_guojia', 'PScaochun', 'PSqun_sunce', 'PScaoshuang', 'PSlukang', 'PScaoxiu', 'PSdahantianzi', 'db_PSdaweiwuwang', 'PSdianwei', 'PSduyu', 'PSerciyuan', 'PSgaoguimingmen', 'PSguosi', 'PShs_zhonghui', 'PShuanggai', 'PShuangyueying', 'PShw_sunquan']);
      //史诗武将
      lib.rank.rarity.epic.addArray(['PSpeixiu', 'PSsp_jiugeshadiao', 'PSlibai', 'PSzhonghui', 'PSshen_sunquan', 'PSshen_dengai', 'PSshen_xunyu', 'PSmeng_liubei', 'PScaojinyu', 'PSjin_duyu', 'PSsb_xushao', 'PSfuzhijie', 'PSfuzhijie', 'PSwu_zhangliao', 'PSzuoci', 'PSzhangrang', 'PSzhenji', 'PSzhaoxiang', 'PSzhaoyun', 'PSxiahoujie', 'PSguanning', 'PSxushao', 'PSyangbiao', 'PSguanyunchang', 'PSsishouyige', 'PStongxiangge', 'PSsunru', 'PSjiesuanjie', 'PSshengui', 'PSnanhualaoxian', 'PSsh_zhangfei', 'PSshen_ganning']);
      //传说武将
      lib.rank.rarity.legend.addArray(['PSshen_zhangliao', 'PSshen_dianwei', 'PSboss_lvbu1', 'PSxian_caozhi', 'PSzhangxuan', , 'PSboss_lvbu2', 'PSboss_lvbu3', 'PSboss_lvbu4', 'PSshen_zhaoyun', 'PSshouyige']);

      lib.translate.phaseBegin = '回合开始阶段';
      lib.translate.phaseZhunbei = '准备阶段';
      lib.translate.phaseJudge = '判定阶段';
      lib.translate.phaseDraw = '摸牌阶段';
      lib.translate.phaseUse = '出牌阶段';
      lib.translate.phaseDiscard = '弃牌阶段';
      lib.translate.phaseJieshu = '回合结束阶段';
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
    },
    precontent: function (PScharacter) {
      /* <-------------------------加载json文件函数，搬运自福瑞拓展，已获得原作者允许，感谢钫酸酱-------------------------> */
      game.PS_loadJsonFromFile = function (filePath, callback, targetObject) {
        // 默认参数处理
        if (!targetObject) {
          targetObject = Array.isArray(targetObject) ? [] : {};
        }

        // 参数校验
        if (typeof filePath !== 'string' || typeof callback !== 'function') {
          throw new Error('无效的参数');
        }

        // 读取配置文件
        game.readFile(filePath, function (data) {
          try {
            // 解析配置文件内容
            var isBuffer = data instanceof ArrayBuffer;
            var config;
            if (isBuffer) {
              var decoder = new TextDecoder("UTF-8");
              var decodedData = decoder.decode(data);
              config = JSON.parse(decodedData);
            } else {
              config = JSON.parse(data);
            }

            // 合并配置到目标对象
            if (Array.isArray(config)) {
              if (Array.isArray(targetObject)) {
                targetObject.push.apply(targetObject, config);
              }
            } else {
              for (var key in config) {
                if (config.hasOwnProperty(key)) {
                  targetObject[key] = config[key];
                }
              }
            }

            callback(null, targetObject);
          } catch (err) {
            callback('无法解析 JSON 文件', null);
          }
        }, function (err) {
          callback('无法读取 JSON 文件', null);
        });
      };

      //将updateHistory.json文件里的更新日志存入window.PScharacter.updateHistory
      game.PS_loadJsonFromFile('extension/PS武将/json/updateHistory.json', function (error, data) {
        if (error) {
          alert(error);
        } else {
          console.log(data);
        }
      }, window.PScharacter.updateHistory);

      /* <-------------------------调用js-------------------------> */
      if (PScharacter.enable) {
        lib.init.js(lib.assetURL + `extension/PS武将/asset`, "character");
        lib.init.js(lib.assetURL + `extension/PS武将/asset`, "chooseButtonContorl");
        lib.init.js(lib.assetURL + `extension/PS武将/asset`, "update");
        if (lib.config.extension_PS武将_PS_spCharacter === true) lib.init.js(lib.assetURL + `extension/PS武将/asset`, "sp_character");
        if (lib.config.extension_PS武将_pswj_hudong === true) lib.init.js(lib.assetURL + `extension/PS武将/asset`, "emotion");
      }

      /* <-------------------------往lib.namePrefix添加武将前缀-------------------------> */
      lib.namePrefix.set('PS', {
        color: '#fdd559',
        nature: 'soilmm',
        // showName: '℗',
        getSpan: (prefix, name) => {
          if (lib.config['extension_PS武将_PS_prefix'] === "hidden") return '';
          else if (lib.config['extension_PS武将_PS_prefix'] === "symbol") {
            return `<span style="writing-mode:horizontal-tb;-webkit-writing-mode:horizontal-tb;font-family:MotoyaLMaru;transform:scaleY(0.85)"><font color=#fdd559>℗</font></span>`;
          }
          return `<span style="writing-mode:horizontal-tb;-webkit-writing-mode:horizontal-tb;font-family:MotoyaLMaru;transform:scaleY(0.85)"><font color=#fdd559>PS</font></span>`;
        },
      });
      lib.namePrefix.set('PS神', {
        getSpan: (prefix, name) => {
          return `${get.prefixSpan('PS')}${get.prefixSpan('神')}`;
        },
      });

      /* <-------------------------平仄声相关-------------------------> */
      //将rusheng.json文件里的入声字数组存入lib.PS_rusheng
      lib.PS_rusheng = [];
      game.PS_loadJsonFromFile('extension/PS武将/json/rusheng.json', function (error, data) {
        if (error) {
          alert(error);
        } else {
          console.log(data);
        }
      }, lib.PS_rusheng);

      //获取平仄的函数
      get.PS_pingZe = function (str) {
        //以平水韵为标准   
        if (typeof str !== 'string') return;
        if (str === '大宛') return '平';
        if (lib.PS_rusheng.contains(str.at(-1))) return '仄';
        const ping = ['ā', 'á', 'ē', 'é', 'ī', 'í', 'ō', 'ó', 'ū', 'ú', 'ǖ', 'ǘ'];
        const ze = ['ǎ', 'à', 'ě', 'è', 'ǐ', 'ì', 'ǒ', 'ò', 'ǔ', 'ù', 'ǚ', 'ǜ'];
        let pinyin = get.pinyin(str, true);
        pinyin = pinyin.at(-1);
        if (ping.some(yin => pinyin.includes(yin))) return '平';
        else if (ze.some(yin => pinyin.includes(yin))) return '仄';
        return;
      };

      /* <-------------------------求两个数之间的随机值，含最大值，含最小值-------------------------> */
      get.RandomIntInclusive = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      /* <-------------------------改变技能配音函数-------------------------> */
      /* game.changeSkillAudio = function (skillName, playerName, audioName) {
           if (!lib.skill[skillName].audioname2) lib.skill[skillName].audioname2 = {};
           lib.skill[skillName].audioname2[playerName] = audioName;
         };
   
         //改变“强袭”的配音
         game.changeSkillAudio('qiangxix', 'PSboss_lvbu2', 'mashu');
         game.changeSkillAudio('qiangxix', 'PSboss_lvbu3', 'mashu');
         game.changeSkillAudio('qiangxix', 'PSboss_lvbu4', 'mashu');
         //改变“完杀”的配音
         game.changeSkillAudio('rewansha', 'PSboss_lvbu2', 'mashu');
         game.changeSkillAudio('rewansha', 'PSboss_lvbu3', 'mashu');
         game.changeSkillAudio('rewansha', 'PSboss_lvbu4', 'mashu');
         //改变“铁骑”的配音 
         game.changeSkillAudio('retieji', 'PSboss_lvbu2', 'mashu');
         game.changeSkillAudio('retieji', 'PSboss_lvbu3', 'mashu');
         game.changeSkillAudio('retieji', 'PSboss_lvbu4', 'mashu');
         //改变“旋风”的配音
         game.changeSkillAudio('decadexuanfeng', 'PSboss_lvbu2', 'mashu');
         game.changeSkillAudio('decadexuanfeng', 'PSboss_lvbu3', 'mashu');
         game.changeSkillAudio('decadexuanfeng', 'PSboss_lvbu4', 'mashu');
         //改变“无双”的配音
         game.changeSkillAudio('wushuang', 'PSboss_lvbu2', 'mashu');
         game.changeSkillAudio('wushuang', 'PSboss_lvbu3', 'mashu');
         game.changeSkillAudio('wushuang', 'PSboss_lvbu4', 'mashu');
    */
      /* <-------------------------播放BGM函数，搬运自福瑞拓展，已获得原作者允许，感谢钫酸酱-------------------------> */
      if (lib.config.extension_PS武将_Background_Music && lib.config.extension_PS武将_Background_Music != "1") {
        lib.arenaReady.push(function () {
          //ui.backgroundMusic.autoplay=true;
          //ui.backgroundMusic.pause();
          game.PS_playBackgroundMusic();
          ui.backgroundMusic.addEventListener('ended', game.PS_playBackgroundMusic);
        });
      };
      game.PS_playBackgroundMusic = function () {
        //if(lib.config.background_music=='music_off'){
        //ui.backgroundMusic.src='';
        //}
        //ui.backgroundMusic.autoplay=true;
        var temp = lib.config.extension_PS武将_Background_Music;
        if (temp == '0') {
          temp = get.RandomIntInclusive(2, 30);
          //生成一个范围2到30的整数
          temp = temp.toString();
          //转为字符串
        };
        ui.backgroundMusic.pause();
        var item = {
          "2": "一战成名.m4a",
          "3": "逐鹿天下.mp3",
          "4": "三国杀背景音乐重制版.mp3",
          "5": "争流.mp3",
          "6": "征战虎牢.mp3",
          "7": "决战虎牢关旧版.mp3",
          "8": "决战虎牢关.mp3",
          "9": "洛神赋.mp3",
          "10": "群英会.mp3",
          "11": "逍遥津.mp3",
          "12": "单刀赴会变奏版.mp3",
          "13": "幻化之战.mp3",
          "14": "黄巾之乱.mp3",
          "15": "军争三国.mp3",
          "16": "乱世乾坤.mp3",
          "17": "天书乱斗.mp3",
          "18": "帐前点兵.mp3",
          "19": "许昌.mp3",
          "20": "自走棋.mp3",
          "21": "OL排位.mp3",
          "22": "大闹长坂坡.mp3",
          "23": "烽火连天.mp3",
          "24": "官阶系统.mp3",
          "25": "欢乐三国杀征战.mp3",
          "26": "洛阳.mp3",
          "27": "三国杀烈.mp3",
          "28": "太虚-黄巾之乱.mp3",
          "29": "太虚-进军广宗.mp3",
          "30": "太虚-长设之战.mp3",
        };
        if (item[temp]) {
          ui.backgroundMusic.src = lib.assetURL + 'extension/PS武将/audio/BGM/' + item[temp];
        } else {
          game.playBackgroundMusic();
          ui.backgroundMusic.addEventListener('ended', game.playBackgroundMusic);
        }
      };


    },
    help: {},
    config: {
      "PS_versionUpdate": {
        name: `版本：${lib.config.extension_PS武将_PS_version}`,
        init: '1',
        unfrequent: true,
        intro: "查看此版本更新说明",
        "item": {
          "1": "<font color=#2cb625>更新说明",
          //"2": "<font color=#00FF00>更新说明",
        },
        "textMenu": function (node, link) {
          lib.setScroll(node.parentNode);
          node.parentNode.style.transform = "translateY(-100px)";
          //node.parentNode.style.height = "710px";
          node.parentNode.style.width = "350px";
          node.style.width = "350px";
          switch (link) {
            case "1":
              let changeLog = window.PScharacter.updateHistory[lib.extensionPack.PS武将.version].changeLog.slice(0);
              let str = '';
              changeLog.forEach(i => {
                if (i !== "/setPlayer/") {
                  window.PScharacter.characters.forEach(j => {
                    if (i.includes(lib.translate[j])) {
                      i = i.replace(lib.translate[j], `<span style="color:#ffce46">${lib.translate[j]}</span>`);
                    }
                    if (i.includes('〖') && i.includes('〗')) {
                      i = i.replace('〖', '<span style="color:#24c022">〖').replace('〗', '〗</span>');
                    }
                  });
                  str += `·${i}<br>`;
                }
              });
              /* '·<span style="color:#ffce46">PS左慈</span>增强，制衡化身时额外获得一张化身牌。',
              '·<span style="color:#ffce46">PS裴秀</span><span style="color:#24c022">【行图】</span>增加了“倒计时”显示。',
              '·优化了<span style="color:#ffce46">PS赵襄、大魏吴王、双倍许劭、PS神张辽</span>选技能时的loading框样式。（需要开启扩展<span style="color:#24c022">“天牢令”</span>，已征得<span style="color:#bd6420">铝宝</span>和<span style="color:#bd6420">雷佬</span>同意）', */
              node.innerHTML = str;
              break;
          }
        },
      },

      bd1: {
        clear: true,
        name: '适配本体版本：1.10.4',
        nopointer: true
      },

      "PS_jieshao": {
        name: "扩展介绍",
        init: '1',
        unfrequent: true,
        intro: "查看扩展介绍",
        "item": {
          "1": "<font color=#2cb625>查看",
          //"2": "<font color=#00FF00>更新说明",
        },
        "textMenu": function (node, link) {
          lib.setScroll(node.parentNode);
          node.parentNode.style.transform = "translateY(-100px)";
          //node.parentNode.style.height = "710px";
          node.parentNode.style.width = "350px";
          node.style.width = "350px";
          switch (link) {
            case "1":
              node.innerHTML = "早期本人在B站上做了一系列魔改武将技能的视频。由于这些武将大多只是在原基础上修改细枝末叶，类似于P图，且为了对应三国杀的SP系列武将，本人把此包命名为PS武将。目前PS武将包的技能设计大部分来自于网友，小部分来自本人（均有备注），强度基本上处于<font color=#ff9800>半阴</font>到<font color=#ff9800>阴间</font>的范围。如果你在游玩过程中遇到bug，可以通过qq群或b站私信（b站同名）向本人反馈。";
          }
        },
      },

      /* "pswj_update": {
        name: '<b>更新说明</b><span style="color:#87CEEB"><font size="4px">▶▶▶</font></span>',
        clear: true,
        onclick: function () {
          if (this.update == undefined) {
            var log = [
              '·适配了本体1.10.2版本',
              '·新增了武将<font color=#ffce46>PS神典韦、PS钟会、PS李白、屑孙权</font>',
              '·<font color=#ffce46>PS左慈</font>增强，现在可以化身觉醒技、限定技了．．．',
              '·移除了扩展内置的皮肤包，缩减扩展包体积',
              '·为扩展里所有的武将添加了新版本的阵亡语音播放代码。（<font color=#ffce46>野兽先辈</font>没有）',
              '·修复了已知的bug',
            ];
            var more = ui.create.div('.update', '<div style="border:2px solid gray"><P align=left>' + log.join('<br>') + '</P>');
            this.parentNode.insertBefore(more, this.nextSibling);
            this.update = more;
            this.innerHTML = '<b>更新说明</b><span style="color:#87CEEB"><font size="4px">▼▼▼</font></span>';
          } else {
            this.parentNode.removeChild(this.update);
            delete this.update;
            this.innerHTML = '<b>更新说明</b><span style="color:#87CEEB"><font size="4px">▶▶▶</font></span>';
          };
        },
      }, */

      /* "PS_jiaqun": {
        name: '欢迎加群<span style="color:#87CEEB"><font size="4px">▶▶▶</font></span>',
        clear: true,
        onclick: function () {
          if (this.jiaqun == undefined) {
            var more = ui.create.div('.jiaqun', '<div style="border:2px solid gray"><span><img style=width:238px src=' + lib.assetURL + 'extension/PS武将/image/QQgroup/pswj_jiaqun.jpg></span>');
            this.parentNode.insertBefore(more, this.nextSibling);
            this.jiaqun = more;
            this.innerHTML = '欢迎加群<span style="color:#87CEEB"><font size="4px">▼▼▼</font></span>';
          } else {
            this.parentNode.removeChild(this.jiaqun);
            delete this.jiaqun;
            this.innerHTML = '欢迎加群<span style="color:#87CEEB"><font size="4px">▶▶▶</font></span>';
          };
        },
      }, */

      "PS_prefix": {
        name: "武将前缀",
        init: lib.config.extension_PS武将_PS_prefix === undefined ? "default" : lib.config.extension_PS武将_PS_prefix,
        unfrequent: true,
        intro: "更改武将前缀样式（重启生效）",
        "item": {
          "default": "默认",
          "hidden": "隐藏",
          "symbol": "符号",
        },
        onclick: function (item) {
          game.saveConfig('extension_PS武将_PS_prefix', item);
        },
        "textMenu": function (node, link) {
          lib.setScroll(node.parentNode);
          node.parentNode.style.transform = "translateY(-100px)";
          // node.parentNode.style.height = "240px";
          node.parentNode.style.width = "80px";
          // node.style.width = "80px";
          switch (link) {
            case "default":
              node.innerHTML = `<center>默认<br><img style=width:50px src=${lib.assetURL}extension/PS武将/image/prefix/PS.jpg></center>`;
              break;
            case "hidden":
              node.innerHTML = `<center>隐藏<br><img style=width:50px src=${lib.assetURL}extension/PS武将/image/prefix/none.jpg></center>`;
              break;
            case "symbol":
              node.innerHTML = `<center>符号<br><img style=width:50px src=${lib.assetURL}extension/PS武将/image/prefix/p.jpg></center>`;
          }
        },
      },

      //切换BGM
      "Background_Music": {
        name: '背景音乐',
        intro: "背景音乐：可随意点播、切换优质动听的背景音乐",
        init: lib.config.extension_PS武将_Background_Music === undefined ? "1" : lib.config.extension_PS武将_Background_Music,
        item: {
          "0": "随机播放",
          "1": "默认音乐",
          "2": "一战成名",
          "3": "逐鹿天下",
          "4": "三国杀背景音乐重制版",
          "5": "争流",
          "6": "征战虎牢",
          "7": "决战虎牢关旧版",
          "8": "决战虎牢关",
          "9": "洛神赋",
          "10": "群英会",
          "11": "逍遥津",
          "12": "单刀赴会变奏版",
          "13": "幻化之战",
          "14": "黄巾之乱",
          "15": "军争三国",
          "16": "乱世乾坤",
          "17": "天书乱斗",
          "18": "帐前点兵",
          "19": "许昌",
          "20": "自走棋",
          "21": "OL排位",
          "22": "大闹长坂坡",
          "23": "烽火连天",
          "24": "官阶系统",
          "25": "欢乐三国杀征战",
          "26": "洛阳",
          "27": "三国杀烈",
          "28": "太虚-黄巾之乱",
          "29": "太虚-进军广宗",
          "30": "太虚-长设之战",
        },
        onclick: function (item) {
          game.saveConfig('extension_PS武将_Background_Music', item);
          game.PS_playBackgroundMusic();
          ui.backgroundMusic.addEventListener('ended', game.PS_playBackgroundMusic);
        },
      },

      "PS_spCharacter": {
        "name": "特殊武将",
        "intro": '开启/关闭PS特殊武将包（重启生效）',
        "init": lib.config.extension_PS武将_PS_spCharacter === undefined ? false : lib.config.extension_PS武将_PS_spCharacter,
        onclick: function (item) {
          game.saveConfig('extension_PS武将_PS_spCharacter', item);
        },
      },

      "PS_hudong": {
        "name": "表情互动",
        "intro": '开启后玩家与ai在特定情景会触发表情（重启生效）<img src="' + lib.assetURL + 'image/emotion/zhenji_emotion/13.gif"><img src="' + lib.assetURL + 'image/emotion/guojia_emotion/13.gif">',
        "init": lib.config.extension_PS武将_PS_hudong === undefined ? false : lib.config.extension_PS武将_PS_hudong,
        onclick: function (item) {
          game.saveConfig('extension_PS武将_PS_hudong', item);
        },
      },

      "PS_pingzeTip": {
        "name": "平仄提示",
        "intro": '开启后使用武将PS李白，手牌会有相应提示（即时生效）',
        "init": lib.config.extension_PS武将_PS_pingzeTip === undefined ? false : lib.config.extension_PS武将_PS_pingzeTip,
        onclick: function (item) {
          game.saveConfig('extension_PS武将_PS_pingzeTip', item);
        },
      },

      //编辑武将功能，搬运自“活动武将”，已得到原作者允许，感谢萌新（转型中）
      "edit_PScharacters": {
        name: '<span style="text-decoration: underline">编辑将池</span>',
        "intro": '打开“编辑武将”功能页面',
        clear: true,
        onclick: function () {
          var container = ui.create.div('.popup-container.editor');
          var editorpage = ui.create.div(container);
          var discardConfig = ui.create.div('.editbutton', '取消', editorpage, function () {
            ui.window.classList.remove('shortcutpaused');
            ui.window.classList.remove('systempaused');
            container.delete(null);
            delete window.saveNonameInput;
          });
          var node = container;
          var map = lib.config.extension_PS武将_PScharacters || [];
          var shed = lib.config.extension_PS武将_PSremoveCharacters || [];
          var add = lib.config.extension_PS武将_PSaddCharacter || [];
          var remove = lib.config.extension_PS武将_PSremoveCharacter || [];
          var str = '//编辑将池，适用武将：PS赵襄、PS左慈、大魏吴王、PS许劭、双倍许劭、梦刘备、PS神孙权，请按照示例正确书写';
          str += '\n//均用英文标点符号！！！\n';
          str += '\n//PScharacters是添加的武将包，“[]”内填武将包名（武将包名可以在武将面板上查看），不写默认为全扩武将包'
          str += '\n//示例：PScharacters = ["界限突破","PS武将","欢乐三国杀"];';
          str += '\nPScharacters=[\n';
          for (var i = 0; i < map.length; i++) {
            str += '"' + map[i] + '",';
            if (i + 1 < map.length && (i + 1) % 5 == 0) str += '\n';
          }
          str += '\n];\n';
          str += '\n//PSremoveCharacters是移除的武将包，“[]”内填武将包名，示例同上';
          str += '\nPSremoveCharacters=[\n';
          for (var i = 0; i < shed.length; i++) {
            str += '"' + shed[i] + '",';
            if (i + 1 < shed.length && (i + 1) % 5 == 0) str += '\n';
          }
          str += '\n];\n';
          str += '\n//PSaddCharacter是添加的武将，“[]”内填武将id'
          str += '\n//示例：PSaddCharacter = ["liubei","guanyu","zhangfei"];';
          str += '\nPSaddCharacter=[\n';
          for (var i = 0; i < add.length; i++) {
            str += '"' + add[i] + '",';
            if (i + 1 < add.length && (i + 1) % 5 == 0) str += '\n';
          }
          str += '\n];\n';
          str += '\n//PSremoveCharacter是移除的武将，“[]”内填武将id，示例同上'
          str += '\nPSremoveCharacter=[\n';
          for (var i = 0; i < remove.length; i++) {
            str += '"' + remove[i] + '",';
            if (i + 1 < remove.length && (i + 1) % 5 == 0) str += '\n';
          }
          str += '\n];\n';
          str += '\n//将池 = （添加的武将包 - 移除的武将包）内的所有武将 + 添加的武将 - 移除的武将';
          node.code = str;
          ui.window.classList.add('shortcutpaused');
          ui.window.classList.add('systempaused');
          var saveInput = function () {
            var code;
            if (container.editor) {
              code = container.editor.getValue();
            }
            else if (container.textarea) {
              code = container.textarea.value;
            }
            try {
              var PScharacters = null;
              var PSremoveCharacters = null;
              var PSaddCharacter = null;
              var PSremoveCharacter = null;
              eval(code);
              if (!Array.isArray(PScharacters) || !Array.isArray(PSremoveCharacters) || !Array.isArray(PSaddCharacter) || !Array.isArray(PSremoveCharacter)) {
                throw ('err');
              }
            }
            catch (e) {
              alert('代码语法有错误，请仔细检查（' + e + '）');
              return;
            }
            game.saveConfig('extension_PS武将_PScharacters', PScharacters);
            game.saveConfig('extension_PS武将_PSremoveCharacters', PSremoveCharacters);
            game.saveConfig('extension_PS武将_PSaddCharacter', PSaddCharacter);
            game.saveConfig('extension_PS武将_PSremoveCharacter', PSremoveCharacter);
            ui.window.classList.remove('shortcutpaused');
            ui.window.classList.remove('systempaused');
            container.delete();
            container.code = code;
            delete window.saveNonameInput;
          };
          window.saveNonameInput = saveInput;
          var saveConfig = ui.create.div('.editbutton', '保存', editorpage, saveInput);
          var editor = ui.create.div(editorpage);
          if (node.aced) {
            ui.window.appendChild(node);
            node.editor.setValue(node.code, 1);
          }
          else if (lib.device == 'ios') {
            ui.window.appendChild(node);
            if (!node.textarea) {
              var textarea = document.createElement('textarea');
              editor.appendChild(textarea);
              node.textarea = textarea;
              lib.setScroll(textarea);
            }
            node.textarea.value = node.code;
          }
          else {
            var aceReady = function () {
              ui.window.appendChild(node);
              var mirror = window.CodeMirror(editor, {
                value: node.code,
                mode: "javascript",
                lineWrapping: !lib.config.touchscreen && lib.config.mousewheel,
                lineNumbers: true,
                indentUnit: 4,
                autoCloseBrackets: true,
                theme: 'mdn-like'
              });
              lib.setScroll(editor.querySelector('.CodeMirror-scroll'));
              node.aced = true;
              node.editor = mirror;
            }
            if (!window.ace) {
              lib.init.js(lib.assetURL + 'game', 'codemirror', aceReady);
              lib.init.css(lib.assetURL + 'layout/default', 'codemirror');
            }
            else {
              aceReady();
            }
          };
        },
      },

      "PS_join": {
        "clear": true,
        name: '<style>@keyframes ff{to{filter:hue-rotate(360deg)}}</style><body>👉<span style="background: linear-gradient(135deg,#14ffe9,#ffeb3b,#ff00e0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: ff 1s linear infinite">点击此处加入交流群</span></body>',
        onclick: function () {
          ui.click.configMenu();
          window.open('https://qm.qq.com/q/Lm30YLypeq');
        },
      },
    },
    package: {
      //  intro:"",
      author: '九个芒果',
      diskURL: "",
      forumURL: "",
      version: "2.1.0",
    }, files: { "character": [], "card": [], "skill": [] },
  }
})