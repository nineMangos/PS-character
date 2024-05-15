'use strict';
window.PScharacter.import(function (lib, game, ui, get, ai, _status) {
  game.import('character', function () {
    var PSsp_character = {
      name: 'PSsp_character',
      connect: true,
      characterSort: {
        PSsp_character: {
          PSsp_character_celebrity: ["PSsp_jiugeshadiao", "PSsp_jiugemangguo", "PSsp_yebai", "PSsp_jiugechenpi"],
          PSsp_character_meme: ["PSsp_jiuzhuan", "PSsp_yeshou"],
        },
      },
      character: {
        PSsp_jiugeshadiao: ["male", "shen", 4, ["PSsp_jiuzhuan", "PSsp_shadiao"], []],
        PSsp_yebai: ["male", "qun", 4, ["PSsp_xiemen", "rewenji"], []],
        PSsp_yeshou: ["male", "qun", 4, ["PSsp_echou", "PSsp_juexing"], []],
        PSsp_jiugemangguo: ["male", "wu", 4, ["PSsp_sucai", "PSsp_linggan", "PSsp_nagao", "PSsp_chongzu"], []],
        PSsp_jiugechenpi: ["male", "qun", 4, ["PSsp_pojin", "PSsp_jiuchen"], []],
      },
      characterIntro: {
        PSsp_jiugeshadiao: '由“九个鲨雕”设计<br>九个鲨雕，创群之初就已加入，目前是Q群里最高头衔的存在，曾声称已跟作者本人姓。',
        PSsp_yebai: '由“九个夜白”设计',
        PSsp_yeshou: '由“sc蓝晨跃”设计',
        PSsp_jiugemangguo: "由“铝宝”设计",
        PSsp_jiugechenpi: "由“九个陈皮”设计",
      },//武将介绍
      characterTitle: {
        PSsp_jiugeshadiao: '鲨鱼中的老雕',
        PSsp_yebai: '代码糕手',
      },//武将称号
      characterReplace: {
      },//武将切换
      characterFilter: {
      },//武将在特定模式下禁用
      perfectPair: {
      },//珠联璧合
      card: {
        PSsp_blank: {
          type: null,
          ai: {
            basic: {
              useful: 0,
              value: 0.1,
            },
          },
        }
      },
      skill: {
        PSsp_echou: {
          audio: "ext:PS武将/audio/skill:2",
          trigger: {
            source: "damageBegin1",
          },
          check: function (event, player) {
            return get.attitude(player, event.player) <= 0;
          },
          "prompt2": function (event, player) {
            if (player.storage.PSsp_juexing) return '将伤害值改为1919810，且' + get.translation(event.player) + '的防具和非锁定技失效直到伤害结算完毕';
            return '将伤害值改为114514';
          },
          content: function () {
            player.chat('哼~哼~哼~啊啊啊啊啊————');
            if (player.storage.PSsp_juexing) {
              trigger.num = 1919810;
              trigger.player.addTempSkill('fengyin', "damageEnd");
              trigger.player.addTempSkill('PSsp_echou_targeted', "damageEnd");
            }
            else trigger.num = 114514;
          },
          subSkill: {
            targeted: {
              locked: true,
              ai: {
                "unequip2": true,
              },
              sub: true,
            },
          },
        },
        "PSsp_echou_1": {
          audio: "PSsp_echou",
        },
        PSsp_juexing: {
          skillAnimation: true,
          animationColor: "metal",
          audio: "ext:PS武将/audio/skill:2",
          juexingji: true,
          derivation: "PSsp_echou_1",
          unique: true,
          forced: true,
          trigger: {
            source: "dieAfter",
          },
          filter: function (event, player) {
            return event.player != player;
          },
          mark: true,
          content: function () {
            player.awakenSkill(event.name);
            player.storage[event.name] = true;
          },
          ai: {
            threaten: 2,
          },
        },
        PSsp_shadiao: {
          audio: 2,
          enable: ["chooseToUse", "chooseToRespond"],
          filter: function (event, player) {
            let num1 = player.getCards('he').reduce(function (arr, card) {
              return arr.add(get.suit(card, player)), arr;
            }, []).length;
            let num2 = player.getAllHistory('useSkill', evt => evt.skill == 'PSsp_shadiao_backup').length;
            if (num2 > num1) return false;
            for (var i of lib.inpile) {
              var type = get.type(i);
              if ((type == 'basic' || type == 'trick') && event.filterCard({ name: i }, player, event)) return true;
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
                else if (get.type(name) == 'basic' && event.filterCard({ name: name }, player, event)) list.push(['基本', '', name]);
              }
              return ui.create.dialog('鲨雕', [list, 'vcard']);
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
                audio: 2,
                filterCard: () => false,
                selectCard: -1,
                popname: true,
                viewAs: { name: links[0][2], nature: links[0][3] },
                precontent: function () {
                  let num = player.getAllHistory('useSkill', evt => evt.skill == 'PSsp_shadiao_backup').length;
                  if (num > 0) player.chooseToDiscard('he', true, num, function (card, player) {
                    if (!ui.selected.cards.length) return true;
                    var suit = get.suit(card, player);
                    for (var i of ui.selected.cards) {
                      if (get.suit(i, player) == suit) return false;
                    }
                    return true;
                  }).set('complexCard', true).set('ai', function (card) {
                    return 1 / (get.value(card));
                  }).set('prompt', `弃置${get.cnNumber(num)}张花色不同的牌`);
                },
              }
            },
            prompt: function (links, player) {
              return '视为使用' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]);
            },
          },
          hiddenCard: function (player, name) {
            let num1 = player.getCards('he').reduce(function (arr, card) {
              return arr.add(get.suit(card, player)), arr;
            }, []).length;
            let num2 = player.getAllHistory('useSkill', evt => evt.skill == 'PSsp_shadiao_backup').length;
            if (num2 > num1) return false;
            if (!lib.inpile.contains(name)) return false;
            var type = get.type(name);
            return type == 'basic' || type == 'trick';
          },
          ai: {
            fireAttack: true,
            respondSha: true,
            respondShan: true,
            skillTagFilter: function (player) {
              let num1 = player.getCards('he').reduce(function (arr, card) {
                return arr.add(get.suit(card, player)), arr;
              }, []).length;
              let num2 = player.getAllHistory('useSkill', evt => evt.skill == 'PSsp_shadiao_backup').length;
              if (num2 > num1) return false;
            },
            order: 1,
            result: {
              player: function (player) {
                if (_status.event.dying) return get.attitude(player, _status.event.dying);
                return 1;
              },
            },
          },
          "_priority": 0,
          group: 'PSsp_shadiao_clear',
          subSkill: {
            clear: {
              trigger: {
                player: 'logSkill',
              },
              filter: function (event, player) {
                if (event.skill != 'PSsp_shadiao_backup') return false;
                return player.getAllHistory('useSkill', evt => evt.skill == 'PSsp_shadiao_backup').length >= 4;
              },
              forced: true,
              direct: true,
              clearSkill: function (player) {
                for (let i = 0; i < player.actionHistory.length; i++) {
                  player.actionHistory[i].useSkill = player.actionHistory[i].useSkill.filter(evt => evt.skill != 'PSsp_shadiao_backup')
                }
              },
              content: function () {
                'step 0'
                if (player.getAllHistory('useSkill', evt => evt.skill == 'PSsp_shadiao_backup').length == 4) {
                  player.chooseBool('是否摸两张牌，重置技能〖鲨雕〗的发动次数').set('ai', function (evt, player) {
                    return true;
                  });
                } else {
                  lib.skill.PSsp_shadiao_clear.clearSkill(player);
                  event.goto(2);
                }
                'step 1'
                if (result.bool) {
                  player.draw(2);
                  lib.skill.PSsp_shadiao_clear.clearSkill(player);
                }
                event.finish();
                'step 2'
                event.targets = game.filterPlayer();
                event.targets.remove(player);
                event.targets.sort(lib.sort.seat);
                player.line(event.targets, 'green');
                event.targets2 = event.targets.slice(0);
                'step 3'
                if (event.targets2.length) {
                  event.targets2.shift().damage('nocard');
                  event.redo();
                }
                else {
                  let num = 0;
                  player.getHistory('sourceDamage', function (evt) {
                    if (evt.getParent().name == 'PSsp_shadiao_clear') num += evt.num;
                  });
                  player.draw(num);
                }
              },
            },
          },
        },
        PSsp_xiemen: {
          audio: 2,
          zhuanhuanji: true,
          trigger: {
            player: "phaseBegin",
          },
          mark: true,
          marktext: "☯",
          mod: {
            cardUsable: function (card, player, num) {
              if (card.name == 'sha') return num + player.storage.PSsp_xiemen_count[0];
            },
          },
          init: function (player) {
            if (!player.storage.PSsp_xiemen_count) player.storage.PSsp_xiemen_count = [0, ''];
          },
          intro: {
            markcount: function (storage, player) {
              return player.storage.PSsp_xiemen_count[0];
            },
            content: function (storage, player) {
              let str = '回合开始，你可以展示并标记任意张花色各不相同的牌，若如此做，';
              if (player.storage.PSsp_xiemen == true) str += '本回合你将前等量个非出牌阶段改为出牌阶段';
              else str += '本回合你将前等量个非摸牌阶段改为摸牌阶段';
              if (player.storage.PSsp_xiemen_count[0]) str += `<br>出牌阶段使用【杀】次数上限+${player.storage.PSsp_xiemen_count[0]}`;
              return str;
            },
          },
          prompt2: function (event, player) {
            if (player.storage.PSsp_xiemen == true) return `展示并标记任意张花色各不相同的牌,然后你本回合前等量个非出牌阶段改为出牌阶段`;
            return `展示并标记任意张花色各不相同的牌,然后你本回合前等量个非摸牌阶段改为摸牌阶段`;
          },
          filter: function (event, player) {
            return player.countCards('h');
          },
          content: function () {
            'step 0'
            let num = player.getCards('h').reduce(function (arr, card) {
              return arr.add(get.suit(card, player)), arr;
            }, []).length;
            player.chooseCard([1, num], 'h', true, function (card, player) {
              if (!ui.selected.cards.length) return true;
              var suit = get.suit(card, player);
              for (var i of ui.selected.cards) {
                if (get.suit(i, player) == suit) return false;
              }
              return true;
            }).set('complexCard', true).set('ai', function (card) {
              return true;
            }).set('prompt', '邪门：请展示任意张花色不同的手牌');
            'step 1'
            if (result.bool && result.cards) {
              player.showCards(result.cards, get.translation(player) + '发动了【邪门】');
              player.addGaintag(result.cards, "PSsp_xiemen");
              result.cards.forEach(card => card.storage.PSsp_xiemen = true);
              player.storage.PSsp_xiemen_count[0] = result.cards.length;
              player.addTempSkill("PSsp_xiemen_next");
              if (player.storage.PSsp_xiemen == true) {
                player.storage.PSsp_xiemen_count[1] = "phaseUse";
              }
              else {
                player.storage.PSsp_xiemen_count[1] = "phaseDraw";
              }
            }
            player.changeZhuanhuanji('PSsp_xiemen');
          },
          group: "PSsp_xiemen_lose",
          subSkill: {
            next: {
              trigger: {
                player: "phaseChange",
              },
              filter: function (event, player, name) {
                if (event.phaseList[event.num].startsWith(player.storage.PSsp_xiemen_count[1])) return false;
                let num = player.getHistory('useSkill', evt => evt.skill === "PSsp_xiemen_next").length;
                return player.storage.PSsp_xiemen_count[0] > num;
              },
              forced: true,
              charlotte: true,
              content: function () {
                game.log(player, '将', `#g${trigger.phaseList[trigger.num]}`, '改为了', `#g${player.storage.PSsp_xiemen_count[1]}`);
                trigger.phaseList[trigger.num] = `${player.storage.PSsp_xiemen_count[1]}|PSsp_xiemen_next`;
                game.delayx();
              },
              ai: {
                effect: {
                  target: function (card, player, target) {
                    if (get.type(card) == 'delay') return 'zerotarget';
                  },
                },
              },
            },
            lose: {
              trigger: {
                player: "loseAfter",
                global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
              },
              forced: true,
              filter: function (event, player) {
                if (event.name == 'gain' && event.player == player) return false;
                var evt = event.getl(player);
                return evt && evt.hs && evt.hs.length && evt.hs.some(card => card.storage && card.storage.PSsp_xiemen);
              },
              content: function () {
                var evt = trigger.getl(player);
                evt.hs.forEach(card => {
                  if (card.storage && card.storage.PSsp_xiemen) {
                    card.storage.PSsp_xiemen = void 0;
                  }
                })
                player.draw();
              },
            },
          },
          "_priority": 0,
        },
        PSsp_jiuzhuan: {
          trigger: {
            player: "phaseBegin",
          },
          direct: true,
          content: function () {
            'step 0'
            var next = player.chooseToMove('九转', true);
            next.set('list', [
              ['调整任意阶段顺序', [trigger.phaseList, 'vcard']],
            ]);
            next.set('filterOk', function (moved) {
              //return moved[0].length>0;
              return true;
            });
            next.set('processAI', function (list) {
              let listx = list[0][1][0].slice(0);
              listx.randomSort();
              const moved = listx.map(ele => [void 0, '', ele]);
              return [moved];
            });
            'step 1'
            if (result.bool) {
              const arr = result.moved[0].map(ele => ele[2]);
              trigger.phaseList = arr;
            }
          },
          "_priority": 0,
        },
        "PSsp_sucai": {
          trigger: {
            global: "phaseBefore",
            player: "enterGame",
          },
          forced: true,
          charlotte: true,
          filter: function (event, player) {
            return (event.name != 'phase' || game.phaseNumber == 0);
          },
          content: function () {
            player.storage.PSsp_sucai = [['spade', 'heart', 'diamond', 'club'], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], ['sha', 'shan', 'tao', 'jiu']];
            let cards = [];
            for (var i = 0; i < 3; i++) {
              let card = ui.create.card(ui.special);
              card.storage.vanish = void 0;
              card.init([null, null, 'PSsp_blank', null]);
              cards.push(card);
              // cards.push(game.createCard2('PSsp_blank', 'blank', 'blank', 'none'));
            }
            player.gain(cards, 'gain2');
          },
        },
        "PSsp_linggan": {
          trigger: {
            player: "useCardAfter",
          },
          filter: function (event, player) {
            if (event.card.PSsp_chongzu === true) event.card.PSsp_chongzu = void 0;
            if (!['basic', 'trick'].contains(get.type(event.card))) return false;
            return player.storage.PSsp_sucai && (!player.storage.PSsp_sucai[0].contains(get.suit(event.card)) || !player.storage.PSsp_sucai[1].contains(get.number(event.card)) || !player.storage.PSsp_sucai[2].contains(get.name(event.card)));
          },
          usable: 1,
          prompt2: function (event, player) {
            let str = '获得';
            if (!player.storage.PSsp_sucai[0].contains(get.suit(event.card))) str += `一枚花色为${get.suitTranslation(get.suit(event.card))}的徽章，`;
            if (!player.storage.PSsp_sucai[1].contains(get.number(event.card))) str += `一枚点数为<span class = "greentext">${get.translation(get.number(event.card))}</span>的徽章，`;
            if (!player.storage.PSsp_sucai[2].contains(get.name(event.card))) str += `一枚牌名为<span class = "greentext">${get.translation(get.name(event.card))}</span>的徽章。`;
            if (str.at(-1) === '，') str = str.slice(0, -1) + '。';
            return str;
          },
          content: function () {
            if (!player.storage.PSsp_sucai[0].contains(get.suit(trigger.card))) player.storage.PSsp_sucai[0].add(get.suit(trigger.card));
            if (!player.storage.PSsp_sucai[1].contains(get.number(trigger.card))) player.storage.PSsp_sucai[1].add(get.number(trigger.card));
            if (!player.storage.PSsp_sucai[2].contains(get.name(trigger.card))) player.storage.PSsp_sucai[2].add(get.name(trigger.card));
            player.storage.PSsp_sucai[0].sort((a, b) => -a.localeCompare(b));
            player.storage.PSsp_sucai[1].sort((a, b) => a - b);
          },
        },
        "PSsp_nagao": {
          trigger: {
            player: ["phaseZhunbeiBegin", "damageEnd"],
          },
          frequent: true,
          content: function () {
            if (player.countCards('h', card => get.name(card) === "PSsp_blank") < 5) {
              player.draw();
              let card = ui.create.card(ui.special);
              card.storage.vanish = void 0;
              card.init([null, null, 'PSsp_blank', null]);
              player.gain(card, 'gain2');
            } else {
              player.draw(2);
            }
          },
        },
        "PSsp_chongzu": {
          enable: "phaseUse",
          filter: function (event, player) {
            if (!player.storage.PSsp_sucai) return false;
            return player.countCards('h', card => get.name(card) === "PSsp_blank") && player.storage.PSsp_sucai[0].length && player.storage.PSsp_sucai[1].length && player.storage.PSsp_sucai[2].length;
          },
          filterCard: function (card) {
            return get.name(card) === 'PSsp_blank';
          },
          discard: false,
          lose: false,
          delay: false,
          silent: true,
          popup: false,
          check: function (card) {
            return 8 - get.value(card);
          },
          prompt: "请选择一张白板卡进行【重组】",
          content: function () {
            'step 0'
            if (player.isUnderControl()) {
              game.swapPlayerAuto(player);
            }
            var switchToAuto = function () {
              _status.imchoosing = false;
              event._result = {
                bool: false,
              };
              if (event.dialog) event.dialog.close();
              if (event.control) event.control.close();
            };
            var chooseButton = function (player) {
              var event = _status.event;
              player = player || event.player;
              if (!event._result) event._result = {};
              var dialog = ui.create.dialog('重组：请选择创生牌的花色、点数和牌名', 'forcebutton', 'hidden');
              event.dialog = dialog;
              dialog.addText('花色');
              var table = document.createElement('div');
              table.classList.add('add-setting');
              table.style.margin = '0';
              table.style.width = '100%';
              table.style.position = 'relative';
              var suits = player.storage.PSsp_sucai[0];//花色列表
              for (var i = 0; i < suits.length; i++) {
                var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                td.link = suits[i];
                table.appendChild(td);
                td.innerHTML = '<span>' + get.suitTranslation(suits[i]) + '</span>';
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
              dialog.content.appendChild(table);
              ////////////////////////////
              dialog.addText('点数');
              var table2 = document.createElement('div');
              table2.classList.add('add-setting');
              table2.style.margin = '0';
              table2.style.width = '100%';
              table2.style.position = 'relative';
              var number = player.storage.PSsp_sucai[1];//点数列表
              for (var i = 0; i < number.length; i++) {
                var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                td.link = number[i];
                table2.appendChild(td);
                td.innerHTML = '<span>' + get.strNumber(number[i]) + '</span>';
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
                  event._result.number = link;
                });
              }
              dialog.content.appendChild(table2);
              ////////////////////////////
              dialog.addText('牌名');
              var table3 = document.createElement('div');
              table3.classList.add('add-setting');
              table3.style.margin = '0';
              table3.style.width = '100%';
              table3.style.position = 'relative';
              var uname = player.storage.PSsp_sucai[2];//牌名列表
              for (var i = 0; i < uname.length; i++) {
                var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                td.link = uname[i];
                table3.appendChild(td);
                td.innerHTML = '<span>' + get.translation(uname[i]) + '</span>';
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
                  event._result.name = link;
                });
              }
              dialog.content.appendChild(table3);
              ////////////////////////////
              dialog.add('　　');
              event.dialog.open();

              event.switchToAuto = function () {
                event._result = {
                  bool: false,
                };
                event.dialog.close();
                event.control.close();
                game.resume();
                _status.imchoosing = false;
              };
              event.control = ui.create.control('ok', 'cancel2', function (link) {
                var result = event._result;
                if (link == 'cancel2') result.bool = false;
                else {
                  if (!result.number || !result.suit || !result.name) return;
                  result.bool = true;
                }
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
              //event.player.send(chooseButton, event.player);
              event.player.wait();
              game.pause();
            }
            else {
              switchToAuto();
            }
            "step 1"
            var map = event.result || result;
            if (map.bool) {
              var card = cards[0];
              card.init([result.suit, result.number, result.name]);
              card.storage.PSsp_chongzu = true;
              player.addGaintag([card], 'PSsp_chongzu_tag');
              player.storage.PSsp_sucai[0].splice(player.storage.PSsp_sucai[0].indexOf(result.suit), 1);
              player.storage.PSsp_sucai[1].splice(player.storage.PSsp_sucai[1].indexOf(result.number), 1);
              player.storage.PSsp_sucai[2].splice(player.storage.PSsp_sucai[2].indexOf(result.name), 1);
            }
          },
          group: ["PSsp_chongzu_else", "PSsp_chongzu_guess"],
          subSkill: {
            else: {
              trigger: {
                player: ["chooseToUseBegin", "chooseToRespondBegin"],
              },
              direct: true,
              silent: true,
              popup: false,
              filter: function (event, player) {
                if (event.getParent().name === 'phaseUse' && player.isPhaseUsing()) return false;
                return lib.skill.PSsp_chongzu.filter(event, player);
              },
              content: function () {
                'step 0'
                player.chooseCard(false, 'h').set('filterCard', function (card) {
                  return card.name == 'PSsp_blank';
                }).set('ai', function (card) { return 1 }).set('prompt', '是否请选择一张白板卡进行【重组】');;
                'step 1'
                if (result.bool) {
                  var next = game.createEvent('PSsp_chongzu');
                  next.player = player;
                  next.cards = result.cards;
                  next.setContent(lib.skill.PSsp_chongzu.content);
                }
              },
            },
            guess: {
              trigger: {
                player: "useCardBefore",
              },
              forced: true,
              silent: true,
              popup: false,
              charlotte: true,
              firstDo: true,
              filter: function (event, player) {
                return ['basic', 'trick'].contains(get.type(event.card)) && event.targets.filter(target => target.isAlive() && target.isIn() && target !== player).length;
              },
              content: function () {
                'step 0'
                event.card = trigger.cards[0];
                event.fake = event.card.storage.PSsp_chongzu || false;//event.fake == true则为创生牌
                player.line(trigger.targets);
                player.popup(get.name(event.card), 'metal');
                event.prompt = '是否质疑' + get.translation(player) + '使用的' + get.translation(event.card) + '为创生牌？';
                event.targets = trigger.targets.filter(target => target.isAlive() && target.isIn() && target !== player).sortBySeat();
                event.targets2 = event.targets.slice(0);
                //player.lose(card, ui.ordering).relatedEvent = trigger;
                if (!event.targets.length) event.goto(5);
                else if (_status.connectMode) event.goto(3);
                event.betrays = [];
                'step 1'
                event.target = targets.shift();
                event.target.chooseButton([event.prompt, [['reguhuo_ally', 'reguhuo_betray'], 'vcard']], true, function (button) {
                  var player = _status.event.player;
                  var evt = _status.event.getParent('PSsp_chongzu_guess');
                  if (!evt) return Math.random();
                  var ally = button.link[2] == 'reguhuo_ally';
                  if (ally && (player.hp <= 1 || get.attitude(player, evt.player) >= 0)) return 1.1;
                  return Math.random();
                });
                'step 2'
                if (result.links[0][2] == 'reguhuo_betray') {
                  event.betrays.push(target);
                  target.addExpose(0.2);
                }
                event.goto(targets.length ? 1 : 5);
                'step 3'
                var list = event.targets.map(function (target) {
                  return [target, [event.prompt, [['reguhuo_ally', 'reguhuo_betray'], 'vcard']], true];
                });
                player.chooseButtonOL(list).set('switchToAuto', function () {
                  _status.event.result = 'ai';
                }).set('processAI', function () {
                  var choice = Math.random() > 0.5 ? 'reguhuo_ally' : 'reguhuo_betray';
                  var player = _status.event.player;
                  var evt = _status.event.getParent('PSsp_chongzu_guess');
                  if (player.hp <= 1 || evt && (get.realAttitude || get.attitude)(player, evt.player) >= 0) choice = 'reguhuo_ally';
                  return {
                    bool: true,
                    links: [['', '', choice]],
                  }
                });
                'step 4'
                for (var i in result) {
                  if (result[i].links[0][2] == 'reguhuo_betray') {
                    event.betrays.push(lib.playerOL[i]);
                    lib.playerOL[i].addExpose(0.2);
                  }
                }
                'step 5'
                for (var i of event.targets2) {
                  var b = event.betrays.contains(i);
                  i.popup(b ? '质疑' : '不质疑', b ? 'fire' : 'wood');
                  game.log(i, b ? '#y质疑' : '#g不质疑');
                }
                game.delay();
                'step 6'
                //player.showCards(trigger.cards);
                if (event.betrays.length) {
                  event.betrays.sortBySeat();
                  if (event.fake) {
                    game.asyncDraw(event.betrays);
                    trigger.cancel();
                    trigger.getParent().goto(0);
                    game.log(player, '使用的', '#y' + get.translation(event.card), '作废了')
                  }
                  else {
                    var next = game.createEvent('PSsp_chongzu_final', false);
                    event.next.remove(next);
                    trigger.after.push(next);
                    next.player = player;
                    next.targets = event.betrays;
                    next.setContent(lib.skill.PSsp_chongzu_guess.contentx);
                    event.finish();
                  }
                }
                else event.finish();
                'step 7'
                game.delayx();
              },
              contentx: function () {
                'step 0'
                event.target = targets.shift();
                if (event.target.countCards('he')) player.gainPlayerCard(event.target, 1, 'he', false).set('prompt', `获得${get.translation(event.target)}一张牌，或点击“取消”摸一张牌`);
                'step 1'
                if (!result.bool) player.draw();
                'step 2'
                if (targets.length) event.goto(0);
              },
              "_priority": 1,
            },
          },
        },
        PSsp_pojin: {
          audio: 2,
          enable: "phaseUse",
          filterCard: true,
          selectCard: -1,
          position: "h",
          usable: 1,
          mod: {
            targetInRange: function (card) {
              if (card.storage && card.storage.PSsp_pojin) return true;
            },
            cardUsable: function (card) {
              if (card.storage && card.storage.PSsp_pojin) return Infinity;
            },
          },
          filter: function (event, player) {
            var hs = player.getCards('h');
            if (!hs.length) return false;
            for (var card of hs) {
              var mod2 = game.checkMod(card, player, 'unchanged', 'cardEnabled2', player);
              if (mod2 === false) return false;
            }
            return true;
          },
          viewAs: {
            name: "sha",
            isCard: false,
            storage: {
              PSsp_pojin: true,
            },
          },
          onuse: function (links, player) {
            player.addTempSkill('PSsp_pojin_draw');
            player.addTempSkill('PSsp_pojin_clear');
          },
          ai: {
            order: 1,
            threaten: 1.14,
            unequip: true,
            "unequip_ai": true,
            skillTagFilter: function (player, tag, arg) {
              if (arg && arg.name == 'sha' && arg.card && arg.card.storage && arg.card.storage.PSsp_pojin) return true;
              return false;
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
                if (game.hasNature(card, 'poison')) return;
                return 1;
              },
              natureDamage: function (card) {
                if (game.hasNature(card)) return 1;
              },
              fireDamage: function (card, nature) {
                if (game.hasNature(card, 'fire')) return 1;
              },
              thunderDamage: function (card, nature) {
                if (game.hasNature(card, 'thunder')) return 1;
              },
              poisonDamage: function (card, nature) {
                if (game.hasNature(card, 'poison')) return 1;
              },
            },
          },
          subSkill: {
            draw: {
              shaRelated: true,
              audio: 2,
              frequent: true,
              trigger: {
                player: "shaAfter",
              },
              filter: function (event, player) {
                if (event.skill !== 'PSsp_pojin') return false;
                return !player.hasHistory('sourceDamage', evt => evt.parent === event);
              },
              content: function () {
                player.draw(trigger.cards.length);
              },
              "_priority": 0,
            },
            clear: {
              trigger: {
                player: "useCard1",
              },
              forced: true,
              silent: true,
              charlotte: true,
              filter: function (event, player) {
                return event.skill === 'PSsp_pojin';
              },
              content: function () {
                trigger.baseDamage = trigger.cards.length;
                if (trigger.addCount !== false) {
                  trigger.addCount = false;
                  if (player.stat[player.stat.length - 1].card.sha > 0) {
                    player.stat[player.stat.length - 1].card.sha--;
                  }
                }
              },
              popup: false,
              sub: true,
              "_priority": 1,
            },
          },
        },
        PSsp_jiuchen: {
          audio: 2,
          trigger: {
            player: "phaseJieshuBegin",
          },
          frequent: true,
          filter(event, player) {
            return player.isMinHandcard();
          },
          content() {
            player.draw(2);
          },
          "_priority": 0,
        },
      },
      translate: {
        "PSsp_character_celebrity": '<span style="color:#22a5f1;font-family:xingkai;font-size:24px">群英荟萃</span>',
        "PSsp_character_meme": '<span style="color:#f4326f;font-family:xingkai;font-size:24px">梗系列</span>',
        "PSsp_jiugeshadiao": "九个鲨雕",
        "PSsp_yebai": "夜白",
        PSsp_yeshou: "野兽先辈",
        "PSsp_jiugemangguo": "九个芒果",
        "PSsp_jiugechenpi": "九个陈皮",

        "PSsp_pojin": "破筋",
        "PSsp_pojin_info": "出牌阶段限一次，你可以将所有手牌当作无距离限制，无视防具，伤害基数为X，不计入次数且无次数限制的【杀】使用。若此【杀】对目标角色生效且未对其造成过伤害，你摸X张牌。（X为此【杀】对应的实体牌数）",
        "PSsp_jiuchen": "九陈",
        "PSsp_jiuchen_info": "结束阶段开始时，若你的手牌数为全场最少，你摸两张牌。",
        'PSsp_sucai': '素材',
        'PSsp_sucai_info': '游戏开始时，你获得四枚花色徽章（每花色各一枚），十三枚点数徽章（每点数各一枚），三张白板卡，以及四枚牌名徽章（每基本牌各一枚）。',
        'PSsp_linggan': '灵感',
        'PSsp_linggan_info': '每回合限一次，一张你参与的即时牌结算后，你获得对应牌名/花色/点数的徽章各一枚。（每个牌名/花色/点数的徽章最多持有一枚）',
        'PSsp_nagao': '纳稿',
        'PSsp_nagao_info': '准备阶段，或你受到伤害后，你可以摸一张牌并获得一张白板卡。（上限五张，已满则改为多摸一张牌）',
        'PSsp_chongzu': '重组',
        'PSsp_chongzu_info': '当你需要使用或打出牌时，可以用一张白板卡，以及其他每种徽章各一枚组成一张牌（以此法组成的牌称为“创生牌”）使用。目标角色可以依次质疑你使用的牌为创生牌。若有质疑的角色：若为且其猜对，此牌作废；若为且其猜错，你获得其一张牌或摸一张牌。',
        'PSsp_chongzu_tag': '创生牌',
        "PSsp_blank": "\u200d",
        "PSsp_blank_info": "一张没有什么作用的牌。",
        "PSsp_jiuzhuan": "九转",
        "PSsp_jiuzhuan_info": "回合开始时，你可以调整本回合所有阶段的执行顺序。",
        PSsp_xiemen: "邪门",
        "PSsp_xiemen_info": "①转换技，回合开始时，你可以展示并标记任意张花色各不相同的牌，若如此做，阴：本回合你将前等量个非摸牌阶段改为摸牌阶段；阳：本回合你将前等量个非出牌阶段改为出牌阶段。<br>②当你失去因此标记的牌时，你摸一张牌。<br>③你的出牌阶段使用杀次数上限+X（X为你因此展示的牌数）",
        PSsp_shadiao: "鲨雕",
        "PSsp_shadiao_info": "你可以弃置X张花色不同的牌视为使用或打出任意即时牌（X为此技能发动的次数）。当X=4时，你可以摸两张牌，然后重置X的发动次数。锁定技，当X>4时，你对所有其他角色各造成1点伤害并摸造成伤害数的牌，然后重置X的发动次数。",
        PSsp_echou: "恶臭",
        "PSsp_echou_info": "当你造成伤害时，你可以将伤害值改为114514。",
        "PSsp_echou_1": "恶臭·升级",
        "PSsp_echou_1_info": "当你造成伤害时，你可以将伤害值改为1919810，然后令目标角色的非锁定技和防具失效，直到伤害结算完毕。",
        PSsp_juexing: "撅醒",
        "PSsp_juexing_info": "撅醒技，当你击杀一名角色后，你升级〖恶臭〗。",
      },
      dynamicTranslate: {
        //野兽先辈〖恶臭〗动态翻译
        PSsp_echou: function (player) {
          if (player.storage.PSsp_juexing) return '当你造成伤害时，你可以将伤害值改为1919810，然后令目标角色的非锁定技和防具失效，直到伤害结算完毕。';
          return '当你造成伤害时，你可以将伤害值改为114514。';
        },
        //夜白〖邪门〗动态翻译
        PSsp_xiemen: function (player) {
          if (player.storage.PSsp_xiemen == true) return '①转换技，回合开始时，你可以展示并标记任意张花色各不相同的牌，若如此做，阴：本回合你将前等量个非摸牌阶段改为摸牌阶段；<span class="bluetext">阳：本回合你将前等量个非出牌阶段改为出牌阶段。</span><br>②当你失去因此标记的牌时，你摸一张牌。<br>③你的出牌阶段使用杀次数上限+X（X为你因此展示的牌数）';
          return '①转换技，回合开始时，你可以展示并标记任意张花色各不相同的牌，若如此做，<span class="bluetext">阴：本回合你将前等量个非摸牌阶段改为摸牌阶段；</span>阳：本回合你将前等量个非出牌阶段改为出牌阶段。<br>②当你失去因此标记的牌时，你摸一张牌。<br>③你的出牌阶段使用杀次数上限+X（X为你因此展示的牌数）';
        },
      },
    };
    for (var i in PSsp_character.character) {
      window.PScharacter.characters.push(i);
      PSsp_character.character[i][4].push(((lib.device || lib.node) ? 'ext:' : 'db:extension-') + 'PS武将/image/character/' + i + '.jpg');
      if (i.includes('PS')) {
        lib.translate[i + '_prefix'] = i.includes('PSshen_') ? 'PS神' : 'PS';
      }
    }
    return PSsp_character;
  });

  lib.config.all.characters.push('PSsp_character');
  lib.config.all.sgscharacters.push('PSsp_character');
  if (!lib.config.characters.contains('PSsp_character')) lib.config.characters.push('PSsp_character');
  lib.translate['PSsp_character_character_config'] = 'PS特殊武将';
});