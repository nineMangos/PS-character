'use strict';
window.PScharacter.import(function (lib, game, ui, get, ai, _status) {
  game.import('character', function () {
    var PSsp_character = {
      name: 'PSsp_character',
      connect: true,
      characterSort: {
        PSsp_character: {
          PSsp_character_celebrity: ["PSsp_jiugeshadiao", "PSsp_yebai"],
          PSsp_character_meme: ["PSsp_yeshou"],
        },
      },
      character: {
        PSsp_jiugeshadiao: ["male", "shen", 4, ["PSsp_shadiao"], []],
        PSsp_yebai: ["male", "qun", 4, ["PSsp_xiemen", "rewenji"], []],
        PSsp_yeshou: ["male", "qun", 4, ["PSsp_echou", "PSsp_juexing"], []],
      },
      characterIntro: {
        PSsp_jiugeshadiao: '由“九个鲨雕”设计<br>九个鲨雕，创群之初就已加入，目前是Q群里最高头衔的存在，曾声称已跟作者本人姓。',
        PSsp_yebai: '由“九个夜白”设计',
        PSsp_yeshou: '由“sc蓝晨跃”设计',
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
      card: {},
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
            let num = player.getCards('he').reduce(function (arr, card) {
              return arr.add(get.suit(card, player)), arr;
            }, []).length;
            player.chooseCard('邪门：请展示任意张花色不同的手牌', [1, num], true, function (card, player) {
              if (!ui.selected.cards.length) return true;
              var suit = get.suit(card, player);
              for (var i of ui.selected.cards) {
                if (get.suit(i, player) == suit) return false;
              }
              return true;
            }).set('complexCard', true).set('ai', function (card) {
              return true;
            });
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
                player: ["phaseZhunbeiBefore", "phaseJudgeBefore", "phaseDrawBefore", "phaseUseBefore", "phaseDiscardBefore"],
              },
              filter: function (event, player, name) {
                let num = player.getHistory('useSkill', evt => evt.skill === "PSsp_xiemen_next").length;
                return player.storage.PSsp_xiemen_count[0] > num && name !== (player.storage.PSsp_xiemen_count[1] + 'Before');
              },
              forced: true,
              charlotte: true,
              content: function () {
                game.log(player, '将', `#g${event.triggername.replace('Before', '')}`, '改为了', `#g${player.storage.PSsp_xiemen_count[1]}`);
                trigger.cancel();
                var next = player[player.storage.PSsp_xiemen_count[1]]();
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
      },
      translate: {
        "PSsp_character_celebrity": '<span style="color:#22a5f1;font-family:xingkai;font-size:24px">群英荟萃</span>',
        "PSsp_character_meme": '<span style="color:#f4326f;font-family:xingkai;font-size:24px">梗系列</span>',
        "PSsp_jiugeshadiao": "九个鲨雕",
        "PSsp_yebai": "夜白",
        PSsp_yeshou: "野兽先辈",

        PSsp_xiemen: "邪门",
        "PSsp_xiemen_info": "①转换技，回合开始，你可以展示并标记任意张花色各不相同的牌，若如此做，阴：本回合你将前等量个非摸牌阶段改为摸牌阶段；阳：本回合你将前等量个非出牌阶段改为出牌阶段。<br>②当你失去因此标记的牌时，你摸一张牌。<br>③你的出牌阶段使用杀次数上限+X（X为你因此展示的牌数）",
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
          if (player.storage.PSsp_xiemen == true) return '①转换技，回合开始，你可以展示并标记任意张花色各不相同的牌，若如此做，阴：本回合你将前等量个非摸牌阶段改为摸牌阶段；<span class="bluetext">阳：本回合你将前等量个非出牌阶段改为出牌阶段。</span><br>②当你失去因此标记的牌时，你摸一张牌。<br>③你的出牌阶段使用杀次数上限+X（X为你手牌中因此标记的牌数）';
          return '①转换技，回合开始，你可以展示并标记任意张花色各不相同的牌，若如此做，<span class="bluetext">阴：本回合你将前等量个非摸牌阶段改为摸牌阶段；</span>阳：本回合你将前等量个非出牌阶段改为出牌阶段。<br>②当你失去因此标记的牌时，你摸一张牌。<br>③你的出牌阶段使用杀次数上限+X（X为你手牌中因此标记的牌数）';
        },
      },
    };
    for (var i in PSsp_character.character) {
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