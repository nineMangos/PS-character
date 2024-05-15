import { VERSION } from './version.js';
import { lib, get, _status, ui, game, ai } from './noname.js';


export let CONFIG = {
	"PS_versionUpdate": {
		name: `版本：${VERSION}`,
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
			node.style.cssText = "width: 350px; padding:5px; box-sizing: border-box;";
			let str = '';
			if (!lib.extensionPack.PS武将) {
				node.innerHTML = '<font color=red>[需要开启本扩展并重启才能查看]</font>';
			}
			else {
				const info = window.PScharacter.updateHistory[VERSION];
				if (!info) {
					node.innerHTML = '<font color=red>[读取更新说明出现异常]</font>';
					return;
				}
				const changeLog = info.changeLog.slice(0);
				changeLog.forEach(i => {
					if (i !== "/setPlayer/" && i !== "/setCard/") {
						window.PScharacter.characters.forEach(j => {
							if ((i.includes(lib.translate[j]) || (i.includes('〖') && i.includes('〗'))) && !i.startsWith('收录了')) {
								i = i
									.replace(new RegExp(lib.translate[j], 'g'), `<font color=#ff9800>${lib.translate[j]}</font>`)
									.replace(new RegExp('〖', 'g'), `<font color=#24c022>〖`)
									.replace(new RegExp('〗', 'g'), `〗</font>`)
							}
						});
						str += `·${i}<br>`;
					}
				});
				str = `<span style="width:335px; display:block; font-size: 15px">${str}<span>`;
				/* '·<span style="color:#ffce46">PS左慈</span>增强，制衡化身时额外获得一张化身牌。',
				'·<span style="color:#ffce46">PS裴秀</span><span style="color:#24c022">【行图】</span>增加了“倒计时”显示。',
				'·优化了<span style="color:#ffce46">PS赵襄、大魏吴王、双倍许劭、PS神张辽</span>选技能时的loading框样式。（需要开启扩展<span style="color:#24c022">“天牢令”</span>，已征得<span style="color:#bd6420">铝宝</span>和<span style="color:#bd6420">雷佬</span>同意）', */
				node.innerHTML = str;
			}
		},
	},

	bd1: {
		clear: true,
		name: '适配本体版本：1.10.8',
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
			node.style.cssText = "width: 350px; padding:5px; box-sizing: border-box;";
			node.innerHTML = '<p style="line-height: 1.3; margin:0; padding: 0; text-indent: 2em;">本扩展主要是对本体武将进行不同方向的强化设计，设计方案大部分来自于网友，小部分来自本人（均有备注），强度基本上处<font class="firetext">半阴</font>到<font class="firetext">阴间</font>的范围。如果你在游玩过程中遇到bug，可以通过qq群或b站私信（b站同名）向本人反馈。</p>';
		},
	},

	"PS_jiaqun": {
		name: '交流群<img style="vertical-align: text-top; transition: all .8s; linear; transform: rotate(-90deg); width:16px;" src=' + lib.assetURL + 'extension/PS武将/image/other/T2.png>',
		clear: true,
		onclick: function () {
			if (this.jiaqun == undefined) {
				this.jiaqun = ui.create.div('.PSjiaqun');
				this.icon = this.querySelector('img');
				var more = ui.create.div('.PSjiaqun-content', `<a href="https://qm.qq.com/q/Lm30YLypeq"><img src="${lib.assetURL}extension/PS武将/image/other/QQgroup.jpg" style="width:100%; vertical-align:bottom;"></a>`);
				this.parentNode.insertBefore(this.jiaqun, this.nextSibling);
				this.jiaqun.appendChild(more);
				setTimeout(() => this.jiaqun.style.gridTemplateRows = '1fr', 0);
				this.jiaqun.dataset.id = '1';
				this.icon.style.transform = 'rotate(0deg)';
			} else if (this.jiaqun.dataset.id == '1') {
				this.jiaqun.style.gridTemplateRows = '0fr';
				this.jiaqun.firstElementChild.style.border = '0';
				this.jiaqun.dataset.id = '0';
				// this.icon.style.transformOrigin = '50% 33.33%';
				this.icon.style.transform = 'rotate(-90deg)';
			}
			else {
				//this.parentNode.removeChild(this.jiaqun);
				//delete this.jiaqun;    
				this.jiaqun.style.gridTemplateRows = '1fr';
				this.jiaqun.firstElementChild.style.border = '2px solid gray';
				this.jiaqun.dataset.id = '1';
				// this.icon.style.transformOrigin = '33.33% 50%';
				this.icon.style.transform = 'rotate(0deg)';
			}
		},
	},

	"PS_splash": {
		name: "启动页美化",
		init: game.getExtensionConfig('PS武将', 'PS_splash') === undefined ? "default" : game.getExtensionConfig('PS武将', 'PS_splash'),
		unfrequent: true,
		intro: "更改启动页背景图（重启生效）",
		"item": {
			"default": "不更改",
			"solarTerms": "节气图",
			"skin": "皮肤图",
		},
		onclick: function (item) {
			game.saveExtensionConfig('PS武将', 'PS_splash', item);
		},
		"textMenu": function (node, link) {
			lib.setScroll(node.parentNode);
			node.parentNode.style.transform = "translateY(-100px)";
			//node.parentNode.style.height = "710px";
			node.parentNode.style.width = "296px";
			node.style.cssText = "width: 296px; height: 170px; position:relative; padding:0; border-radius:10px; color: white; box-sizing:border-box;";
			if (link === "default") {
				node.style.height = "38px";
				node.innerHTML = '<div style="font-family: xingkai, xinwei;line-height:28px; text-align: center; width: 288px; height:30px; box-sizing:border-box; border-radius:10px; border:2px solid gray; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);">不更改</div>';
			}
			else {
				node.innerHTML = `<div class="PSselect-item" style="background:url(${lib.assetURL}extension/PS武将/image/splash/${link}.jpg) no-repeat right center/cover"><span style="font-family: xingkai, xinwei;">${node.innerText}</span></div>`;
			}
		},
	},

	/* "PS_prefix": {
	 name: "武将前缀",
	 init: lib.config.extension_PS武将_PS_prefix === undefined ? "PS" : lib.config.extension_PS武将_PS_prefix,
	 unfrequent: true,
	 intro: "更改武将前缀样式（重启生效）",
	 "item": {
	   "PS": "默认",
	   "none": "隐藏",
	   "p": "符号",
	 },
	 onclick: function (item) {
	   game.saveExtensionConfig('PS武将', 'PS_prefix', item);
	 },
	 "textMenu": function (node, link) {
	   lib.setScroll(node.parentNode);
	   node.parentNode.style.transform = "translateY(-100px)";
	   // node.parentNode.style.height = "240px";
	   node.parentNode.style.cssText = "display: flex; width: 381px; justify-content:space-evenly; ";
	   node.style.cssText = "width: 127px; height: 150px; position:relative; padding:0; margin:0; border-radius:12px; box-sizing:border-box;";
	   node.innerHTML = `<div class="PSselect-item" style="width: 121px; height: 144px; border-radius: 12px; padding-top: 60px; background:url(${lib.assetURL}extension/PS武将/image/prefix/${link}.jpg) no-repeat right center/cover"><span style="font-family: xingkai, xinwei;font-size:20px" class="firetext">${node.innerText}</span></div>`;
	 },
   }, */

	//切换BGM
	"Background_Music": {
		name: `背景音乐<div class="PSmusic-container"><div class="PSneedle" style="background: url(${lib.assetURL}extension/PS武将/image/music/needle.png) no-repeat 0 0/cover"></div><div class="PSrecord-box"><div class="PSrecord" style="background: url(${lib.assetURL}extension/PS武将/image/music/coverall.png) no-repeat -140px -580px"></div><div class="PSrecord-img" style="background: url(${lib.assetURL}extension/PS武将/image/music/${lib.config.extension_PS武将_Background_Music || '1'}.jpg) no-repeat 0 0/cover"></div></div></div>`,
		clear: true,
		intro: "背景音乐：可随意点播、切换优质动听的背景音乐",
		init: lib.config.extension_PS武将_Background_Music === undefined ? "1" : lib.config.extension_PS武将_Background_Music,
		item: {
			"0": "随机播放",
			"1": "默认音乐",
			"2": "一战成名",
			"3": "逐鹿天下",
			"4": "三国杀牌局重制版",
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
			let div = document.querySelector('.PSrecord-box .PSrecord-img');
			div.style.backgroundImage = `url(${lib.assetURL}extension/PS武将/image/music/${item}.jpg)`;
			game.saveConfig('extension_PS武将_Background_Music', item);
			game.PS_playBackgroundMusic();
			ui.backgroundMusic.addEventListener('ended', game.PS_playBackgroundMusic);
		},
		"visualMenu": function (node, link) {
			lib.setScroll(node.parentNode);
			node.parentNode.style.cssText = "padding: 8px; color: white;";
			node.style.cssText = `width: 94px; height: 80px; box-sizing: border-box; border-radius: 10px 0 0 10px; margin: 8px; background: url(${lib.assetURL}extension/PS武将/image/music/coverall.png) no-repeat -240px -1120px`;
			node.innerHTML = `<div style="width: 80px; height: 80px; box-sizing: border-box; border-radius: 10px; font-family: xingkai, xinwei; padding: 3px; background:url(${lib.assetURL}extension/PS武将/image/music/${link}.jpg) no-repeat right center/cover ">${node.innerText}</div>`;
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
		name: '<ins>编辑将池</ins>',
		"intro": '打开“编辑武将”功能页面',
		clear: true,
		onclick: function () {
			debugger
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
					import('../../../game/codemirror.js').then(() => {
						aceReady();
					});
					lib.init.css(lib.assetURL + 'layout/default', 'codemirror');
				}
				else {
					aceReady();
				}
			};
		},
	},

	/* "PS_joinUs": {
	  "clear": true,
	  name: '<span class="PSjoinUs">点击加入交流群</span>',
	  onclick: function () {
		ui.click.configMenu();
		window.open('https://qm.qq.com/q/Lm30YLypeq');
	  },
	}, */

}
