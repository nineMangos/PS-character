import { lib, get, _status, ui, game, ai } from './noname.js';


export let PRECONTENT = function (config) {

  /* <-------------------------给字符串添加查找方法-------------------------> */
  Object.defineProperty(String.prototype, "searchAll", {
    configurable: true,
    enumerable: false,
    writable: true,
    value: function (subStr) {
      if (typeof subStr !== 'string' && subStr instanceof RegExp === false) throw new Error('参数必须为字符串或正则表达式');
      const arr = [];
      if (subStr instanceof RegExp) {//如果subStr为正则表达式
        let array1;
        if (!subStr.global) {//如果subStr为非全局正则表达式
          subStr = new RegExp(subStr.source, subStr.flags + 'g');//重新编译为全局正则表达式
        }
        while ((array1 = subStr.exec(this)) !== null) {//执行正则表达式匹配
          arr.push(subStr.lastIndex - array1[0].length);//记录匹配位置
        }
      } else {
        let index = this.search(subStr);//使用字符串的search方法查找子串
        if (subStr.length === 0) return [];//如果子串为空，则直接返回
        while (index !== -1) {//如果查找到子串，则继续查找下一个子串
          arr.push(index);//记录匹配位置
          const subIndex = this.slice(index + subStr.length).search(subStr);//查找下一个子串的位置
          index = subIndex === -1 ? -1 : index + subStr.length + subIndex;//如果下一个子串不存在，则退出循环
        }
      }
      return arr;//返回记录匹配位置的数组
    }
  });//const str = 'aabbccaabbcc'; str.searchAll('a') --> [0, 1, 6, 7]; str.searchAll(/a/) --> [0, 1, 6, 7]

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
      // console.log(data);
    }
  }, window.PScharacter.updateHistory);

  /* <-------------------------调用js-------------------------> */
  if (config.enable) {
    lib.init.js(lib.assetURL + 'extension/PS武将/character', "character");
    lib.init.js(lib.assetURL + 'extension/PS武将/asset', "update");
    if (lib.config.extension_PS武将_PS_spCharacter === true) lib.init.js(lib.assetURL + 'extension/PS武将/character', "sp_character");
    if (lib.config.extension_PS武将_pswj_hudong === true) lib.init.js(lib.assetURL + 'extension/PS武将/asset', "emotion");
  }

  /* <-------------------------改变启动页背景图-------------------------> */
  if (game.getExtensionConfig('PS武将', 'PS_splash') !== 'default') {
    function getAvatars() {
      if (document.querySelector('#splash.slim')) {
        let avatars = document.querySelectorAll('.avatar');
        if (avatars.length) {
          clearInterval(timeId);
          const url = `extension/PS武将/image/splash/${game.getExtensionConfig('PS武将', 'PS_splash') || "default"}/`;
          game.getFileList(url, (folders, files) => {
            for (let i = 0; i < avatars.length; i++) {
              if (files.length >= i + 1) {
                avatars[i].style.backgroundImage = `url("${url + files[i]}")`;
                avatars[i].style.backgroundPosition = `center top`;
              }
            }
          });
        }
      }
    }
    let timeId = setInterval(getAvatars, 30);
    setTimeout(() => {
      clearInterval(timeId);
    }, 1000);
  }

  /* <-------------------------往lib.namePrefix添加武将前缀-------------------------> */
  if (lib.namePrefix) {
    lib.namePrefix.set('PS', {
      color: '#fdd559',
      nature: 'soilmm',
      // showName: '℗',
      getSpan: (prefix, name) => {
        const span = document.createElement('span'), style = span.style;
        style.writingMode = style.webkitWritingMode = 'horizontal-tb';
        style.fontFamily = 'MotoyaLMaru';
        style.transform = 'scaleY(0.85)';
        span.textContent = 'PS';
        return span.outerHTML;
        if (game.getExtensionConfig('PS武将', 'PS_prefix') === "hidden") return '';
        else if (game.getExtensionConfig('PS武将', 'PS_prefix') === "symbol") {
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
    lib.namePrefix.set('PS梦', {
      getSpan: (prefix, name) => {
        return `${get.prefixSpan('PS')}${get.prefixSpan('梦')}`;
      },
    });
    lib.namePrefix.set('PS武', {
      getSpan: (prefix, name) => {
        return `${get.prefixSpan('PS')}${get.prefixSpan('武')}`;
      },
    });
    lib.namePrefix.set('PS晋', {
      getSpan: (prefix, name) => {
        return `${get.prefixSpan('PS')}${get.prefixSpan('晋')}`;
      },
    });
    lib.namePrefix.set('PS乐', {
      getSpan: (prefix, name) => {
        return `${get.prefixSpan('PS')}${get.prefixSpan('乐')}`;
      },
    });
    lib.namePrefix.set('PS经典', {
      getSpan: (prefix, name) => {
        return `${get.prefixSpan('PS')}${get.prefixSpan('经典')}`;
      },
    });
  }

  /* <-------------------------平仄声相关-------------------------> */
  //将rusheng.json文件里的入声字数组存入lib.PS_rusheng
  lib.PS_rusheng = [];
  game.PS_loadJsonFromFile('extension/PS武将/json/rusheng.json', function (error, data) {
    if (error) {
      alert(error);
    } else {
      // console.log(data);
    }
  }, lib.PS_rusheng);

  //获取平仄的函数
  get.PS_pingZe = function (str) {
    //以平水韵为标准   
    if (typeof str !== 'string') return;
    if (str === '大宛') return '平';
    if (lib.PS_rusheng.includes(str.at(-1))) return '仄';
    const ping = ['ā', 'á', 'ē', 'é', 'ī', 'í', 'ō', 'ó', 'ū', 'ú', 'ǖ', 'ǘ'];
    const ze = ['ǎ', 'à', 'ě', 'è', 'ǐ', 'ì', 'ǒ', 'ò', 'ǔ', 'ù', 'ǚ', 'ǜ'];
    let pinyin = get.pinyin(str, true);
    pinyin = pinyin.at(-1);
    if (ping.some(yin => pinyin.includes(yin))) return '平';
    else if (ze.some(yin => pinyin.includes(yin))) return '仄';
  };

  /* <-------------------------改变技能配音函数-------------------------> */
  game.changeSkillAudio = function (skillName, playerName, audioName) {
    if (Array.isArray(playerName)) {
      playerName.forEach(ele => game.changeSkillAudio(skillName, ele, audioName));
    } else {
      if (!lib.skill[skillName]) return;
      if (!lib.skill[skillName].audioname2) lib.skill[skillName].audioname2 = {};
      lib.skill[skillName].audioname2[playerName] = audioName;
    }
  };

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
      temp = get.rand(2, 30);
      //生成一个范围2到30的整数
      temp = temp.toString();
      //转为字符串
    };
    ui.backgroundMusic.pause();
    var item = {
      "2": "一战成名.m4a",
      "3": "逐鹿天下.mp3",
      "4": "三国杀牌局重制版.mp3",
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

};