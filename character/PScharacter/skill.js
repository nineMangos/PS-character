import { lib, game, ui, get, ai, _status } from "../../extension/noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
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
			player.chooseToDiscard(`是否弃置一张牌令${get.translation(trigger.player)}摸两张牌`, 'he', false, 1).set('ai', () => {
				if (get.attitude(player, trigger.player) <= 0) return 0;
				return get.disvalue;
			}).set('player', _status.event.player);
			'step 1'
			if (result.bool) {
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
		init: function (player) {
			game.changeSkillAudio('PSxiaoji', player.name, 'xiaoji_sp_sunshangxiang');
		},
		filter: function (event, player) {
			if (player.storage.PSfanxiang) return false;
			return game.hasPlayer(function (current) {
				return player.storage.PSliangzhu && player.storage.PSliangzhu.includes(current) && current.isDamaged();
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
				if (!player.countCards('h', name => ['jiu', 'tao'].includes(name)) && player.hp == 1) return '选项三';
				return '选项二';
			});
			'step 1'
			switch (result.index) {
				case 0:
					player.gainMaxHp();
					player.recover();
					break;
				case 1:
					player.addSkills('PSxiaoji');
					break;
				case 2:
					player.removeSkills('PSliangzhu');
					player.gainMaxHp();
					player.recover();
					player.addSkills('PSxiaoji');
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
							return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current) && lib.filter.targetInRange(event.card, player, current);
						})) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					'step 0'
					var num = game.countPlayer(function (current) {
						return !trigger.targets.includes(current) && lib.filter.targetEnabled2(trigger.card, player, current) && lib.filter.targetInRange(trigger.card, player, current);
					});
					player.chooseTarget('双全：是否为' + get.translation(trigger.card) + '增加一个目标？', 1, function (card, player, target) {
						var trigger = _status.event.getTrigger();
						var card = trigger.card;
						return !trigger.targets.includes(target) && lib.filter.targetEnabled2(card, player, target) && lib.filter.targetInRange(card, player, target);
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
				filter: function (event, player) {
					return !player.storage.PSshuangquan_niepan;
				},
				content: function () {
					'step 0'
					trigger.cancel();
					player.awakenSkill('PSshuangquan_niepan');
					player.storage.PSshuangquan_niepan = true;
					'step 1'
					player.maxHp = 8;
					player.update();
					if (player.hp < player.maxHp) {
						player.recoverTo(player.maxHp);
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

					if (['shan', 'wuxie'].includes(event.card.name)) return false;
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
			var evt = event.getParent('phaseDraw');
			if (evt && evt.name == 'phaseDraw') return false;
			return event.player != player;
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
					for (var i of event.cards) {
						if (get.position(i, true) == "d") return true;
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
						return get.attitude(_status.event.player, target) < 0;
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
			global: ["loseAfter", "loseAsyncAfter"],
		},
		frequent: true,
		filter: function (event, player) {
			if (event.player === player || ['useCard', 'respond'].includes(event.getParent().name)) return false;
			for (var i of event.cards) {
				if (get.position(i, true) == "d") return true;
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
		audio: "qiangxi_ol_dianwei",
		enable: "phaseUse",
		usable: 2,
		mark: true,
		intro: {
			content: function (storage, player) {
				return `强袭造成${lib.skill.PSqiangxi.getUseSkillTime(player) + 1}点伤害`;
			}
		},
		getUseSkillTime(player) {
			return player.getAllHistory('useSkill', evt => evt.skill == 'PSqiangxi').length;
		},
		filter: function (event, player) {
			if (player.hp < 1 && !player.hasCard((card) => lib.skill.PSqiangxi.filterCard(card), 'he')) return false;
			return game.hasPlayer((current) => lib.skill.PSqiangxi.filterTarget(null, player, current));
		},
		filterCard: function (card) {
			return get.subtype(card) == 'equip1';
		},
		position: "he",
		filterTarget: function (card, player, target) {
			if (target == player) return false;
			var stat = player.getStat()._PSqiangxi;
			return !stat || !stat.includes(target);
		},
		selectCard: function () {
			if (_status.event.player.hp < 1) return 1;
			return [0, 1];
		},
		content: function () {
			'step 0'
			var stat = player.getStat();
			if (!stat._PSqiangxi) stat._PSqiangxi = [];
			stat._PSqiangxi.push(target);
			if (!cards.length) player.damage('nosource', 'nocard');
			'step 1'
			const num = lib.skill.PSqiangxi.getUseSkillTime(player);
			target.damage('nocard', num);
			player.markSkill(event.name);
		},
		ai: {
			damage: true,
			order: 8,
			result: {
				player: function (player, target) {
					if (player.hasSkill('buqu') && player.hasSkill('xinjuejing')) return 0;
					if (ui.selected.cards.length) return 0;
					if (player.hp >= target.hp) return -0.9;
					if (player.hp <= 2) return -2;
					return get.damageEffect(player, player, player);
				},
				target: function (player, target) {
					const num = get.damageEffect(target, player, target) * lib.skill.PSqiangxi.getUseSkillTime(player)
					if (player.hasSkill('buqu') && player.hasSkill('xinjuejing')) return num;
					if (!ui.selected.cards.length) {
						if (player.hp < 2) return 0;
					}
					return num;
				},
			},
			threaten: 1.5,
		},
	},
	PSsizhan: {
		audio: "cuijue",
		dutySkill: true,
		locked: false,
		derivation: ['buqu', 'xinjuejing'],
		init() {
			game.changeSkillAudio('buqu', 'PSdianwei', 'juanjia');
			game.changeSkillAudio('xinjuejing', 'PSdianwei', 'qiexie');
		},
		group: ["PSsizhan_achieve", "PSsizhan_fail", "PSsizhan_defend"],
		subSkill: {
			defend: {
				audio: "cuijue",
				trigger: {
					player: "damageBegin4",
				},
				usable: 1,
				filter: function (event, player) {
					return lib.skill.PSqiangxi.getUseSkillTime(player) > 0;
				},
				check(event, player) {
					if (event.num > 1) return true;
					if (player.hp <= 1) return true;
					return false;
				},
				prompt: "是否令此伤害-1，然后本局游戏〖强袭〗的发动次数-1？",
				content: function () {
					trigger.num--;
					const history = player.actionHistory;
					for (let i = history.length - 1; i >= 0; i--) {
						if (history[i].useSkill.some(evt => evt.skill.includes('PSqiangxi'))) {
							const index = history[i].useSkill.findLastIndex(evt => evt.skill.includes('PSqiangxi'));
							history[i].useSkill.splice(index, 1);
							break;
						}
					}
					if (_status.currentPhase === player) {
						player.getStat().skill.PSqiangxi--;
					}
					player.markSkill('PSqiangxi');
				},
				sub: true,
				"_priority": 0,
			},
			achieve: {
				audio: "cuijue",
				trigger: {
					source: "dieAfter",
				},
				forced: true,
				skillAnimation: true,
				animationColor: "fire",
				filter: function (event, player) {
					return true;
				},
				content: function () {
					game.log(player, '成功完成使命');
					player.awakenSkill('PSsizhan');
					player.loseMaxHp(2);
					player.addSkills(['buqu', 'xinjuejing']);
				},
				sub: true,
				"_priority": 0,
			},
			fail: {
				audio: "cuijue",
				trigger: {
					player: "dying",
				},
				forced: true,
				content: function () {
					game.log(player, '使命失败');
					player.awakenSkill('PSsizhan');
					player.recoverTo(player.maxHp);
					for (let i = 0; i < player.actionHistory.length; i++) {
						player.actionHistory[i].useSkill = player.actionHistory[i].useSkill.filter(evt => evt.skill != 'PSqiangxi');
					}
					if (_status.currentPhase === player) {
						delete player.getStat().skill.PSqiangxi;
					}
					player.markSkill('PSqiangxi');
				},
				sub: true,
				"_priority": 0,
			},
		},
		"_priority": 0,
	},
	PSranshang: {
		audio: "ranshang",
		trigger: {
			source: "damageEnd",
		},
		filter: function (event, player) {
			return event.hasNature('fire') && event.player.isAlive();
		},
		prompt: "是否令目标获得等量的“燃”标记",
		check: function (event, player) {
			return get.attitude(player, event.player) < 0;
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
						if (game.hasNature(card, 'fire') || player.hasSkill('zhuque_skill')) return 2;
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
		inherit: "rezhiheng",
		group: "PSzhiheng_else",
		subSkill: {
			else: {
				trigger: {
					target: "useCardToTarget",
				},
				popup: false,
				log: false,
				usable: 1,
				prompt2: function () {
					return lib.translate.PSzhiheng_info;
				},
				check: function () {
					return true;
				},
				filter: function (event, player) {
					if (event.addedTargets) return false;
					return event.targets.length == 1 && player.countDiscardableCards(player, 'he') > 0;
				},
				async cost(event, trigger, player) {
					const { cards, bool } = await player.chooseToDiscard([1, Infinity], 'he', false)
						.set('ai', () => 1)
						.set('prompt', get.prompt('PSzhiheng'))
						.forResult();
					event.result = {
						bool,
						cards,
						cost_data: {
							hs: player.getCards('h')
						}
					}
				},
				async content(event, trigger, player) {
					const hs = event.cost_data.hs;
					player.logSkill('PSzhiheng');
					let num = 0;
					if (hs.every(card => event.cards.includes(card))) num = 1;
					await player.draw(event.cards.length + num);
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
		audio: "rejianxiong",
		audioname: ["shen_caopi"],
		trigger: {
			target: "useCardToAfter",
		},
		filter: function (event, player) {
			return event.player != player && event.cards.length && ['o', 'd'].includes(get.position(event.cards[0]));
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
		audio: "reqiaobian",
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
					if (!player.canMoveCard()) {
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
				if (player.storage.PSpingjian.includes(skills2[j])) continue;
				if (skills.includes(skills2[j]) && lib.skill.PSfushi.characterList().includes(name)) {
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
				if ((info.trigger.player == name2 || Array.isArray(info.trigger.player) && info.trigger.player.includes(name2)) && lib.skill.PSfushi.characterList().includes(name)) {
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
					if (player.getStorage('PSpingjian').includes(skills2[j])) continue;
					if (skills.includes(skills2[j]) && lib.skill.PSfushi.characterList().includes(name)) {
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
						if ((info.trigger.player == name2 || Array.isArray(info.trigger.player) && info.trigger.player.includes(name2)) && lib.skill.PSfushi.characterList().includes(name)) {
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
					if (player.getStorage('PSpingjian').includes(skills2[j])) continue;
					var info = lib.translate[skills2[j] + '_info'];
					if ((skills.includes(skills2[j]) || (info && info.indexOf('当你于出牌阶段') != -1)) && lib.skill.PSfushi.characterList().includes(name)) {
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
						if (((info.enable == 'phaseUse' || (Array.isArray(info.enable) && info.enable.includes('phaseUse'))) || (info.enable == 'chooseToUse' || (Array.isArray(info.enable) && info.enable.includes('chooseToUse')))) && lib.skill.PSfushi.characterList().includes(name)) {
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
			player.removeSkills(skill);
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
			player.removeSkills(skills);
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
					return event.card && player.storage.PSqingxi_damage.includes(event.card);
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
					return player == _status.currentPhase && player.storage.PSqingxi_damage.includes(event.card);
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
		audio: "qixing",
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
			combo: "PSdawu",
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
						player.logSkill('PSqixing_draw');
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
		audio: "kuangfeng",
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
				var targets = result.targets.sortBySeat();
				player.logSkill('PSkuangfeng', targets, 'fire');
				var length = targets.length;
				targets.forEach(target => {
					target.addAdditionalSkill(`PSkuangfeng_${player.playerid}`, 'PSkuangfeng_storage');
					target.markAuto('PSkuangfeng_storage', [player]);
				});
				player.addTempSkill('PSkuangfeng_damage', { player: 'phaseUseEnd' })
				player.chooseCardButton('选择弃置' + get.cnNumber(length) + '张“星”', length, player.getExpansions('PSqixing'), true);
			}
			else {
				event.finish();
			}
			"step 2"
			player.loseToDiscardpile(result.links);
		},
		ai: {
			combo: "PSqixing",
		},
		subSkill: {
			storage: {
				charlotte: true,
				intro: {
					content: function (storage) {
						return `共有${storage.length}枚标记`;
					},
				},
				ai: {
					effect: {
						target: function (card, player, target, current) {
							if (get.tag(card, 'fireDamage') && current < 0) return 1.5;
						},
					},
				},
				"_priority": 0,
			},
			damage: {
				trigger: {
					global: "damageBegin3",
				},
				filter: function (event, player) {
					return event.hasNature('fire') && event.player.getStorage('PSkuangfeng_storage').includes(player);
				},
				charlotte: true,
				forced: true,
				logTarget: "player",
				content: function () {
					trigger.num++;
				},
				onremove: function (player) {
					game.countPlayer2(current => {
						if (current.getStorage('PSkuangfeng_storage').includes(player)) {
							current.unmarkAuto('PSkuangfeng_storage', player);
							current.removeAdditionalSkill(`PSkuangfeng_${player.playerid}`);
						}
					}, true);
				},
				"_priority": 0,
			},
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
		audio: "dawu",
		content: function () {
			"step 0"
			var num = Math.min(game.countPlayer(), player.getExpansions('PSqixing').length);
			player.chooseTarget(get.prompt('PSdawu'), '令至多' + get.cnNumber(num) + '名角色获得“大雾”标记',
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
				var targets = result.targets.sortBySeat();
				player.logSkill('PSdawu', result.targets, 'thunder');
				var length = targets.length;
				targets.forEach(target => {
					target.addAdditionalSkill(`PSdawu_${player.playerid}`, 'PSdawu_storage');
					target.markAuto('PSdawu_storage', [player]);
				});
				player.addTempSkill('PSdawu_damage', { player: 'phaseUseEnd' })
				player.chooseCardButton('选择弃置' + get.cnNumber(length) + '张“星”', length, player.getExpansions('PSqixing'), true);
			}
			else {
				event.finish();
			}
			"step 2"
			player.loseToDiscardpile(result.links);
		},
		ai: {
			combo: "PSqixing",
		},
		/* "PSdawu_storage" */
		subSkill: {
			storage: {
				charlotte: true,
				ai: {
					nofire: true,
					nodamage: true,
					effect: {
						target: function (card, player, target, current) {
							if (get.tag(card, 'damage') && !get.tag(card, 'thunderDamage')) return 'zeroplayertarget';
						},
					},
				},
				intro: {
					content: function (storage) {
						return `共有${storage.length}枚标记`;
					},
				},
				"_priority": 0,
			},
			damage: {
				trigger: {
					global: "damageBegin4",
				},
				filter: function (event, player) {
					return !event.hasNature('thunder') && event.player.getStorage('PSdawu_storage').includes(player);
				},
				forced: true,
				charlotte: true,
				logTarget: "player",
				content: function () {
					trigger.cancel();
				},
				onremove: function (player) {
					game.countPlayer2(current => {
						if (current.getStorage('PSdawu_storage').includes(player)) {
							current.unmarkAuto('PSdawu_storage', player);
							current.removeAdditionalSkill(`PSdawu_${player.playerid}`);
						}
					}, true);
				},
				"_priority": 0,
			},
			/* clear: {
				trigger: {
				player: ["phaseUseEnd", "dieBegin"],
				},
				silent: true,
				charlotte: true,
				content: function () {
				for (var i = 0; i < game.players.length; i++) {
					if (game.players[i].hasSkill('PSdawu_storage')) {
					game.players[i].removeSkill('PSdawu_storage');
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
			}, */
		},
	},
	PSjizhi: {
		audio: "rejizhi",
		audioname: ["lukang"],
		locked: false,
		trigger: {
			player: "useCard",
		},
		forced: true,
		filter: function (event) {
			return get.cardNameLength(event.card) >= 3;
		},
		content: function () {
			'step 0'
			event.cards = get.cards(2);
			player.showCards(event.cards, '集智');
			"step 1"
			let cardsx = [cards[0]];
			for (var i = 1; i < cards.length; i++) {
				if (get.cardNameLength(cards[i]) > get.cardNameLength(cardsx[0])) cardsx = [cards[i]];
				else if (get.cardNameLength(cards[i]) == get.cardNameLength(cardsx[0])) cardsx.push(cards[i]);
			}
			const card = cardsx.randomGet();
			player.gain(card, 'gain2');
			game.cardsDiscard(cards.filter(c => c !== card));
		},
		ai: {
			threaten: 1.4,
			noautowuxie: true,
		},
		mod: {
			aiOrder: function (player, card, num) {
				if (get.cardNameLength(card) >= 3) return 13;
			},
		}
	},
	PSqicai: {
		isUse: function (event) {
			if (event.name != 'cardsDiscard') return false;
			var evtx = event.getParent();
			if (evtx.name != 'orderingDiscard') return false;
			var evt2 = (evtx.relatedEvent || evtx.getParent());
			return (evt2.name == 'phaseJudge' || evt2.name == 'useCard');
		},
		mod: {
			targetInRange(card, player, target, now) {
				if (get.cardNameLength(card) >= 2) return true;
			},
			cardUsable: function (card, player, num) {
				if (get.cardNameLength(card) >= 1) return Infinity;
			},
			maxHandcard: function (player, numx) {
				var num = 0;
				var history = game.getGlobalHistory('cardMove', function (evt) {
					if (evt.name == 'lose') return evt.position == ui.discardPile;
					return evt.name == 'cardsDiscard';
				});
				for (var i = history.length - 1; i >= 0; i--) {
					var evt = history[i];
					var cards2 = evt.cards;
					if (cards2.length && !lib.skill.PSqicai.isUse(evt)) {
						num += cards2.length;
					}
				}
				return numx + num;
			},
		}
	},
	PSjieying: {
		audio: "drlt_jieying",
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
		audio: "ext:PS武将/audio/skill:2",
		trigger: {
			player: "phaseJieshuBegin",
		},
		skillAnimation: true,
		animationColor: "orange",
		filter: function (event, player) {
			// const list = [];
			/* game.players.concat(game.dead).forEach(cur => list.add(cur.group));
			if (player.getAllHistory('useSkill', evt => evt.skill === 'PSfushi').length >= list.length) return false; */
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
			list.removeArray(lib.skill.PShuashen.banned);
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
				for (var i of map.skills) player.addSkills(i);
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
			player.changeSkin("PSfushi", "PSzhaoxiang2");
			lib.character.PSzhaoxiang.dieAudios = ['ext:PS武将/audio/die/PSzhaoxiang2.mp3'];
			event.num = player.storage.fanghun;
			player.draw(event.num);
			player.removeMark('fanghun', player.storage.fanghun);
			'step 1'
			var list;
			if (_status.characterlist) {
				list = [];
				for (var i = 0; i < _status.characterlist.length; i++) {
					var name = _status.characterlist[i];
					if (lib.skill.PSfushi.characterList().includes(name)) list.push(name);
				}
			}
			else if (_status.connectMode) {
				list = get.charactersOL(function (i) {
					return !lib.skill.PSfushi.characterList().includes(i);
				});
			}
			else {
				list = get.gainableCharacters(function (info, i) {
					return lib.skill.PSfushi.characterList().includes(i);
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
			if (false/* lib.config.extensions && lib.config.extensions.includes('天牢令') && lib.config['extension_天牢令_enable'] && game.TLHasExt */) {
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
				var dialog = ui.create.dialog(`请选择获得至多${get.cnNumber(3)}个技能`, [list, 'character'], 'hidden');
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
				for (var i of map.skills) player.addSkills(i);
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
			return (!player.getStorage('PSdunshi').includes(name) && !player.getStat('skill').PSdunshi && lib.inpile.includes(name));
		},
		init: function (player, skill) {
			if (!player.storage[skill]) player.storage[skill] = [[], 0];
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
					if (lib.inpile.length === storage[0].length) str += '已删除所有牌名';
					else str += `已删除牌名：${get.translation(storage[0])}`;
				} else {
					str += '暂无已删除牌名';
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
					if (player.storage.PSdunshi[0].includes(name)) continue;
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
					if (!skill || skill.zhuSkill || skill.dutySkill || lib.skill.bolan.banned.includes(j)) continue;
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
							/* for (var j in lib.element.button) {
								next[j] = lib.element.button[j];
							} */
							Object.setPrototypeOf(next, lib.element.Button.prototype);
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
					if (event.links.includes(0)) {
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
								if (controls.includes('cslilu')) return 'cslilu';
								return controls[0];
							});
						}
					}
					else event.goto(3);
					'step 2'
					game.broadcastAll('closeDialog', event.videoId);
					target.addSkills(result.control);
					'step 3'
					var storage = player.storage.PSdunshi;
					if (event.links.includes(1)) {
						storage[0].add(event.cardname);
						storage[1]++;
						player.markSkill('PSdunshi');
					}
					if (event.links.includes(2)) {
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
		init: function (player, skill) {
			game.changeSkillAudio('PSjizhi', player.name, 'rejizhi_lukang');
		},
		derivation: "PSjizhi",
		filter: function (event, player) {
			return player.hasEnabledSlot(1) || player.hasEnabledSlot(2) || player.hasEnabledSlot(5) || player.hasEnabledSlot('horse');
		},
		content: function () {
			'step 0'
			player.chooseToDisable(true).set('ai', function (event, player, list) {
				if (list.includes('equip2')) return 'equip2';
				if (list.includes('equip1') && (player.countCards('h', function (card) {
					return get.name(card, player) == 'sha' && player.hasUseTarget(card);
				}) - player.getCardUsable('sha')) > 1) return 'equip1';
				if (list.includes('equip5') && player.countCards('h', function (card) {
					return get.type2(card, player) == 'trick' && player.hasUseTarget(card);
				}) > 1) return 'equip5';
			});
			'step 1'
			switch (result.control) {
				case 'equip1':
					player.addSkills('drlt_jueyan1');
					break;
				case 'equip2':
					player.draw(3);
					player.addSkills('drlt_jueyan3');
					break;
				case 'equip3_4':
					player.addSkills('drlt_jueyan2');
					break;
				case 'equip5':
					player.addSkills('PSjizhi');
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
			if (!player.awakenedSkills.includes('xinfencheng') && !player.awakenedSkills.includes('fencheng') && !player.awakenedSkills.includes('dcfencheng')) return false;
			return player.hasCard(function (card) {
				return (get.name(card) == 'sha' && game.hasNature(card, 'fire')) || get.name(card) == "huogong"
			}, 'h');
		},
		filterCard: function (card) {
			return (get.name(card) == 'sha' && game.hasNature(card, 'fire')) || get.name(card) == "huogong";
		},
		selectCard: 1,
		discard: true,
		content: function () {
			if (player.awakenedSkills.includes('xinfencheng')) player.restoreSkill('xinfencheng');
			if (player.awakenedSkills.includes('fencheng')) player.restoreSkill('fencheng');
			if (player.awakenedSkills.includes('dcfencheng')) player.restoreSkill('dcfencheng');
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
			if (trigger.target.getCards('h').includes(card) && get.type(card) == 'equip') {
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
		init() {

		},
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
					if (list.includes('decadexuanfeng') && player.countCards('he', { type: 'equip' })) return 'decadexuanfeng';
					if (!player.getStat().skill.PSmn_qiangxix) {
						if (player.hasSkill('PSmn_qiangxi') && player.getEquip(1) && list.includes('decadexuanfeng')) return 'decadexuanfeng';
						if (list.includes('rewansha') || list.includes('PSmn_qiangxi')) {
							var players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								if (players[i].hp == 1 && get.attitude(player, players[i]) < 0) {
									if (list.includes('rewansha')) return 'rewansha';
									if (list.includes('PSmn_qiangxi')) return 'PSmn_qiangxi';
								}
							}
						}
					}
					if (list.includes('PSmn_qiangxi')) return 'PSmn_qiangxi';
					if (list.includes('rewansha')) return 'rewansha';
					if (list.includes('decadexuanfeng')) return 'decadexuanfeng';
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
	PSshenqu: {
		audio: "shenqu",
		group: 'PSshenqu2',
		trigger: { global: 'phaseZhunbeiBegin' },
		filter: function (event, player) {
			return player.countCards('h') <= player.maxHp;
		},
		frequent: true,
		content: function () {
			player.draw(2);
		}
	},
	PSshenqu2: {
		trigger: { player: 'damageAfter' },
		direct: true,
		filter: function (event, player) {
			return player.hasSkillTag('respondTao') || player.countCards('h', 'tao') > 0;
		},
		content: function () {
			player.chooseToUse({ name: 'tao' }, '神躯：是否使用一张桃？').logSkill = 'shenqu';
		}
	},
	"PSmn_qiangxi": {
		audio: "qiangxi_boss_lvbu3",
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
			player.chooseToDiscard('he', get.prompt('PSmn_qiangxi', trigger.player), '弃置一张装备牌并令此伤害+1', function (card) {
				return get.type(card) == 'equip';
			}).set('goon', get.damageEffect(trigger.player, player, player) > 0).set('ai', function (card) {
				if (_status.event.goon) return 12 - get.value(card);
				return 0;
			});
			'step 1'
			if (result.bool) trigger.num++;
		},
		ai: {
			expose: 0.25,
		},
		subSkill: {
			damage: {
				audio: "qiangxi_boss_lvbu3",
				enable: "phaseUse",
				filter: function (event, player) {
					return game.hasPlayer(function (target) {
						return player.inRange(target) && !target.hasSkill('PSmn_qiangxi_used');
					});
				},
				filterTarget: function (card, player, target) {
					if (player == target) return false;
					if (target.hasSkill('PSmn_qiangxi_used')) return false;
					return player.inRange(target);
				},
				prompt: "失去1点体力并摸一张牌，对一名其他角色造成1点伤害",
				content: function () {
					'step 0'
					player.loseHp();
					player.draw();
					'step 1'
					target.addTempSkill('PSmn_qiangxi_used');
					target.damage();
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
			used: {
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
				if (['wugu', 'zhulu_card', 'yiyi', 'lulitongxin', 'lianjunshengyan', 'diaohulishan'].includes(button.link[2])) return 0;
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
			if (!lib.inpile.includes(name)) return false;
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
				onremove: function (player) {
					player.removeGaintag("zhiheng");
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
		unique: true,
		audio: "rehuashen",
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "phaseBegin", "phaseEnd", "PShuashen"],
		},
		filter: function (event, player, name) {
			if (event.name != 'phase') return true;
			if (name == 'phaseBefore') return game.phaseNumber == 0;
			return player.storage.PShuashen && player.storage.PShuashen.character.length > 0;
		},
		direct: true,
		content: function () {
			/* 
			player.storage.PShuashen.current //当前化身牌武将id
			player.storage.PShuashen.current2 //当前化身的技能id数组
			event.card //选中的化身牌（新化身牌）
			event.videoId //窗口对话框id
			event.aiChoice //ai根据优先度选择的技能
			event.logged //true则为已经log过这个技能了 
			event.num //选择技能的次数
			event.aiSkills //ai的化身技能数组
			*/
			"step 0"
			event.num = 1;
			var name = event.triggername;
			//游戏开始时获得三张化身牌
			if (trigger.name != 'phase' || (name == 'phaseBefore' && game.phaseNumber == 0)) {
				player.logSkill('PShuashen');
				lib.skill.PShuashen.addHuashens(player, 3);
				event.logged = true;
			}
			_status.noclearcountdown = true;
			event.videoId = lib.status.videoId++;
			var cards = player.storage.PShuashen.character.slice(0);
			var skills = [];
			var sto = player.storage.PShuashen;
			for (var i in player.storage.PShuashen.map) {
				skills.addArray(player.storage.PShuashen.map[i]);
			}
			var cond = 'out';
			if (event.triggername == 'phaseBegin') {
				cond = 'in';
			}
			skills.randomSort();
			//技能根据优先度排序
			skills.sort(function (a, b) {
				return get.skillRank(b, cond) - get.skillRank(a, cond);
			});
			event.aiSkills = skills.slice();
			event.aiChoice = skills[0];
			var choice = '更换技能';
			if (event.aiChoice == player.storage.PShuashen.current2 || get.skillRank(event.aiChoice, cond) < 1 || Math.random() < 0.3) choice = '制衡化身';
			if (player.isOnline2()) {
				player.send(function (cards, id) {
					var dialog = ui.create.dialog('是否发动【化身】？', [cards, (item, type, position, noclick, node) => lib.skill.PShuashen.$createButton(item, type, position, noclick, node)]);
					dialog.videoId = id;
				}, cards, event.videoId);
			}
			//创建对话框
			event.dialog = ui.create.dialog(get.prompt('PShuashen'), [cards, (item, type, position, noclick, node) => lib.skill.PShuashen.$createButton(item, type, position, noclick, node)]);
			event.dialog.videoId = event.videoId;
			if (!event.isMine()) {
				event.dialog.style.display = 'none';
			}

			if (event.logged && !event.isMine() && !event.isOnline()) event._result = { control: '更换技能' };// 在托管状态
			// if (event.logged) event._result = { control: '更换技能' };
			else player.chooseControl('制衡化身', '更换技能', 'cancel2').set('ai', function () {
				return _status.event.choice;
			}).set('choice', choice);
			"step 1"
			event.control = result.control;
			if (event.control == 'cancel2') {
				if (player.isOnline2()) {
					player.send('closeDialog', event.videoId);
				}
				delete _status.noclearcountdown;
				if (!_status.noclearcountdown) {
					game.stopCountChoose();
				}
				event.dialog.close();
				event.finish(); return;
			}
			if (!event.logged) { player.logSkill('PShuashen'); event.logged = true }
			var next = player.chooseButton(false).set('dialog', event.videoId);
			if (event.control == '制衡化身') {
				next.set('selectButton', [1, 2]);
				next.set('filterButton', function (button) {
					// return button.link != _status.event.current;
					return true;
				});
				next.set('current', player.storage.PShuashen.current);
			}
			else {
				next.set('ai', function (button) {
					return player.storage.PShuashen.map[button.link].includes(_status.event.choice) ? 2.5 : 1 + Math.random();
				});
				next.set('choice', event.aiChoice);
			}
			var prompt = event.control == '制衡化身' ? '选择制衡至多两张化身' : `选择要获得的第${get.cnNumber(event.num, true)}个技能`;
			var func = function (id, prompt) {
				var dialog = get.idDialog(id);
				if (dialog) {
					dialog.content.childNodes[0].innerHTML = prompt;
				}
			}
			if (player.isOnline2()) {
				player.send(func, event.videoId, prompt);
			}
			else if (event.isMine()) {
				func(event.videoId, prompt);
			}
			"step 2"
			if (!result.bool) {
				if (player.isOnline2()) {
					player.send('closeDialog', event.videoId);
				}
				event.dialog.close();
				delete _status.noclearcountdown;
				if (!_status.noclearcountdown) {
					game.stopCountChoose();
				}
				event.finish();
				return;
			}
			if (result.bool && event.control === '更换技能') {
				event.card = result.links[0];
				var func = function (card, id) {
					var dialog = get.idDialog(id);
					if (dialog) {
						for (var i = 0; i < dialog.buttons.length; i++) {
							if (dialog.buttons[i].link == card) {
								dialog.buttons[i].classList.add('selectedx');
							}
							else {
								dialog.buttons[i].classList.add('unselectable');
							}
						}
					}
				}
				if (player.isOnline2()) {
					player.send(func, event.card, event.videoId);
				}
				else if (event.isMine()) {
					func(event.card, event.videoId);
				}
				var list = player.storage.PShuashen.map[event.card].slice(0).filter((skill) => {
					if (event.num === 1) return true;
					return !player.additionalSkills.PShuashen.includes(skill);
				});
				list.push('返回');
				player.chooseControl(list).set('choice', event.aiChoice).set('ai', function () {
					return _status.event.choice;
				});
			}
			else {
				lib.skill.PShuashen.removeHuashen(player, result.links.slice(0));
				lib.skill.PShuashen.addHuashens(player, result.links.length + 1);
			}
			"step 3"
			let defaultDialog = function () {
				let func = function (id) {
					var dialog = get.idDialog(id);
					if (dialog) {
						for (var i = 0; i < dialog.buttons.length; i++) {
							dialog.buttons[i].classList.remove('selectedx');
							dialog.buttons[i].classList.remove('unselectable');
						}
					}
				}
				if (player.isOnline2()) {
					player.send(func, event.videoId);
				}
				else if (event.isMine()) {
					func(event.videoId);
				}
			}
			if (result.control == '返回') {
				defaultDialog();
				event._result = { control: '更换技能' };
				event.goto(1);
				return;
			}

			let closeDialog = function () {
				if (player.isOnline2()) {
					player.send('closeDialog', event.videoId);
				}
				event.dialog.close();
				delete _status.noclearcountdown;
				if (!_status.noclearcountdown) {
					game.stopCountChoose();
				}
			}
			if (event.control == '制衡化身') {
				closeDialog();
				event.finish();
				return;
			} else {
				event.num++;
				var link = result.control;
				if (event.num === 2) {
					const old2 = player.storage.PShuashen.current2;
					player.storage.PShuashen.current2 = [link];
					player.removeAdditionalSkill('PShuashen');
					//清除文字颜色
					const dialog = get.idDialog(event.videoId);
					if (dialog) {
						dialog.buttons.forEach(btn => {
							const textNode = btn.querySelector('.caption>.text');
							if (textNode.innerHTML.includes('✓</span>')) {
								textNode.innerHTML = textNode.innerHTML
									.replaceAll('<span style="color:#0a9b43; text-shadow: rgba(0, 0, 0, 0.6) 0 0 2px, rgba(0, 0, 0, 0.6) 0 0 5px, rgba(0, 0, 0, 0.6) 0 0 5px, rgba(0, 0, 0, 0.6) 0 0 5px, black 0 0 1px">', '')
									.replaceAll('✓</span>', '');
							};
						});
					}
				} else {
					player.storage.PShuashen.current2.add(link);
				}
				//更改文字颜色
				const dialog = get.idDialog(event.videoId);
				if (dialog) {
					const button = dialog.buttons.find(btn => btn.link === event.card);
					if (button) {
						const textNode = button.querySelector('.caption>.text');
						const skillName = '[' + get.translation(result.control) + ']';
						textNode.innerHTML = textNode.innerHTML.replace(skillName, `<span style="color:#0a9b43; text-shadow: rgba(0, 0, 0, 0.6) 0 0 2px, rgba(0, 0, 0, 0.6) 0 0 5px, rgba(0, 0, 0, 0.6) 0 0 5px, rgba(0, 0, 0, 0.6) 0 0 5px, black 0 0 1px">${skillName}✓</span>`);
					}
				}
				if (!player.additionalSkills.PShuashen || !player.additionalSkills.PShuashen.includes(link)) {
					player.addAdditionalSkill('PShuashen', link, true);
					game.log(player, '获得了技能', '#g【' + get.translation(link) + '】');
					player.popup(link);
					player.syncStorage('PShuashen');
					player.updateMarks('PShuashen');
					if (event.num <= 3) {
						event._result = { control: '更换技能' };
						defaultDialog();

						event.aiSkills.remove(link);
						if (!event.aiSkills.length) event.aiChoice = link;
						else {
							event.aiSkills.randomSort();
							event.aiSkills.sort(function (a, b) {
								return get.skillRank(b, cond) - get.skillRank(a, cond);
							});
							event.aiChoice = event.aiSkills[0];
						}

						event.goto(1);
					} else {
						closeDialog();
					}
					// lib.skill.PShuashen.createAudio(event.card,link,'re_zuoci');
				}
			}

			/* if (player.storage.PShuashen.current != event.card) {
				const old = player.storage.PShuashen.current;
				player.storage.PShuashen.current = event.card;
				game.broadcastAll(function (player, character, old) {
				player.tempname.remove(old);
				player.tempname.add(character);
				player.sex = lib.character[event.card][0];
				}, player, event.card, old);
				game.log(player, '将性别变为了', '#y' + get.translation(lib.character[event.card][0]) + '性');
				player.changeGroup(lib.character[event.card][1]);
			} */


		},
		init: function (player, skill) {
			if (!player.storage[skill]) player.storage[skill] = {
				character: [],
				map: {},
			}
			lib.skill.PShuashen.player = player;
		},
		banned: ["lisu", "sp_xiahoudun", "PSxushao", "PSsb_xushao", "db_PSdaweiwuwang", "PSzhaoxiang", "PSmeng_liubei", "xushao", "jsrg_xushao", "zhoutai", "old_zhoutai", "shixie", "xin_zhoutai", "dc_shixie", "old_shixie"],
		// bannedType: ["Charlotte", "主公技", "觉醒技", "限定技", "隐匿技", "使命技"],
		bannedType: [],
		addHuashen: function (player) {
			if (!player.storage.PShuashen) return;
			if (!_status.characterlist) {
				lib.skill.pingjian.initList();
			}
			_status.characterlist.randomSort();
			for (let i = 0; i < _status.characterlist.length; i++) {
				let name = _status.characterlist[i];
				if (!lib.skill.PSfushi.characterList().includes(name)) continue; // 必须是“编辑将池”里的武将
				if (name.indexOf('zuoci') != -1 || name.indexOf('key_') == 0 || name.indexOf('sp_key_') == 0 /* || get.is.double(name) */ || lib.skill.PShuashen.banned.includes(name) || player.storage.PShuashen.character.includes(name)) continue;
				let skills = lib.character[name][3].filter(skill => {
					const categories = get.skillCategoriesOf(skill);
					return !categories.some(type => lib.skill.PShuashen.bannedType.includes(type));
				})
				if (skills.length) {
					player.storage.PShuashen.character.push(name);
					player.storage.PShuashen.map[name] = skills;
					_status.characterlist.remove(name);
					return name;
				}
			}
		},
		addHuashens: function (player, num) {
			var list = [];
			for (var i = 0; i < num; i++) {
				var name = lib.skill.PShuashen.addHuashen(player);
				if (name) list.push(name);
			}
			if (list.length) {
				player.syncStorage('PShuashen');
				player.updateMarks('PShuashen');
				game.log(player, '获得了', get.cnNumber(list.length) + '张', '#g化身');
				lib.skill.PShuashen.drawCharacter(player, list);
			}
		},
		removeHuashen: function (player, links) {
			player.storage.PShuashen.character.removeArray(links);
			_status.characterlist.addArray(links);
			game.log(player, '移去了', get.cnNumber(links.length) + '张', '#g化身')
		},
		drawCharacter: function (player, list) {
			game.broadcastAll(function (player, list) {
				if (player.isUnderControl(true)) {
					var cards = [];
					for (var i = 0; i < list.length; i++) {
						var cardname = 'PShuashen_card_' + list[i];
						lib.card[cardname] = {
							fullimage: true,
							image: 'character:' + list[i]
						}
						lib.translate[cardname] = get.rawName2(list[i]);
						cards.push(game.createCard(cardname, '', ''));
					}
					player.$draw(cards, 'nobroadcast');
				}
			}, player, list);
		},
		"$createButton": function (item, type, position, noclick, node) {
			node = ui.create.buttonPresets.character(item, 'character', position, noclick);
			const info = lib.character[item];
			const skills = info[3].filter(function (skill) {
				const categories = get.skillCategoriesOf(skill);
				return !categories.some(type => lib.skill.PShuashen.bannedType.includes(type));
			});
			if (skills.length) {
				const skillstr = skills.map(i => {
					const player = lib.skill.PShuashen.player;
					if (player.additionalSkills.PShuashen && player.additionalSkills.PShuashen.includes(i)) return `<span style="color:#0a9b43; text-shadow: rgba(0, 0, 0, 0.6) 0 0 2px, rgba(0, 0, 0, 0.6) 0 0 5px, rgba(0, 0, 0, 0.6) 0 0 5px, rgba(0, 0, 0, 0.6) 0 0 5px, black 0 0 1px">[${get.translation(i)}]✓</span>`;
					return `[${get.translation(i)}]`;
				}).join('<br>');
				const skillnode = ui.create.caption(
					`<div class="text" data-nature=${get.groupnature(info[1], 'raw')
					}m style="font-family: ${(lib.config.name_font || 'xinwei')
					},xinwei">${skillstr}</div>`, node);
				skillnode.style.left = '2px';
				skillnode.style.bottom = '2px';
			}
			node._customintro = function (uiintro, evt) {
				const character = node.link, characterInfo = get.character(node.link);
				let capt = get.translation(character);
				if (characterInfo) {
					capt += `&nbsp;&nbsp;${get.translation(characterInfo[0])}`;
					let charactergroup;
					const charactergroups = get.is.double(character, true);
					if (charactergroups) charactergroup = charactergroups.map(i => get.translation(i)).join('/');
					else charactergroup = get.translation(characterInfo[1]);
					capt += `&nbsp;&nbsp;${charactergroup}`;
				}
				uiintro.add(capt);

				if (lib.characterTitle[node.link]) {
					uiintro.addText(get.colorspan(lib.characterTitle[node.link]));
				}
				for (let i = 0; i < skills.length; i++) {
					if (lib.translate[skills[i] + '_info']) {
						let translation = lib.translate[skills[i] + '_ab'] || get.translation(skills[i]).slice(0, 2);
						if (lib.skill[skills[i]] && lib.skill[skills[i]].nobracket) {
							uiintro.add('<div><div class="skilln">' + get.translation(skills[i]) + '</div><div>' + get.skillInfoTranslation(skills[i]) + '</div></div>');
						}
						else {
							uiintro.add('<div><div class="skill">【' + translation + '】</div><div>' + get.skillInfoTranslation(skills[i]) + '</div></div>');
						}
						if (lib.translate[skills[i] + '_append']) {
							uiintro._place_text = uiintro.add('<div class="text">' + lib.translate[skills[i] + '_append'] + '</div>')
						}
					}
				}
			}
			return node;
		},
		mark: true,
		intro: {
			onunmark: function (storage, player) {
				_status.characterlist.addArray(storage.character);
				storage.character = [];
			},
			mark: function (dialog, storage, player) {
				if (storage && storage.current) dialog.addSmall([[storage.current], (item, type, position, noclick, node) => lib.skill.PShuashen.$createButton(item, type, position, noclick, node)]);
				if (storage && storage.current2) {
					for (var i = 0; i < storage.current2.length; i++) {
						dialog.add('<div><div class="skill">【' + get.translation(lib.translate[storage.current2[i] + '_ab'] || get.translation(storage.current2[i]).slice(0, 2)) + '】</div><div>' + get.skillInfoTranslation(storage.current2[i], player) + '</div></div>');
					}
				}
				if (storage && storage.character.length) {
					if (player.isUnderControl(true)) {
						dialog.addSmall([storage.character, (item, type, position, noclick, node) => lib.skill.PShuashen.$createButton(item, type, position, noclick, node)]);
					}
					else {
						dialog.addText('共有' + get.cnNumber(storage.character.length) + '张“化身”');
					}
				}
				else {
					return '没有化身';
				}
			},
			content: function (storage, player) {
				return '共有' + get.cnNumber(storage.character.length) + '张“化身”'
			},
			markcount: function (storage, player) {
				if (storage && storage.character) return storage.character.length;
				return 0;
			},
		},
		group: "PShuashen_change",
		subSkill: {
			change: {
				audio: "rehuashen",
				enable: "phaseUse",
				usable: 1,
				async content(event, trigger, player) {
					_status.noclearcountdown = true;
					event.videoId = lib.status.videoId++;
					const cards = player.storage.PShuashen.character.slice(0);
					const prompt = '是否将性别和势力改为与一张“化身牌”相同？';
					if (player.isOnline2()) {
						player.send(function (cards, id) {
							var dialog = ui.create.dialog('是否将性别和势力改为与一张“化身牌”相同？', [cards, (item, type, position, noclick, node) => lib.skill.PShuashen.$createButton(item, type, position, noclick, node)]);
							dialog.videoId = id;
						}, cards, event.videoId);
					}
					event.dialog = ui.create.dialog(prompt, [cards, (item, type, position, noclick, node) => lib.skill.PShuashen.$createButton(item, type, position, noclick, node)]);
					event.dialog.videoId = event.videoId;
					if (!event.isMine()) {
						event.dialog.style.display = 'none';
					}
					const next = player.chooseButton(false);
					next.set('dialog', event.videoId);
					next.set('filterButton', function (button) {
						const { gender, group } = get.character(button.link);
						const gender2 = player.sex;
						const group2 = player.group;
						return gender !== gender2 || group !== group2;
					});
					next.set('current', player.storage.PShuashen.current);
					next.set('ai', function (button) {
						const character = lib.character[button.link];
						const gender = character[0];
						const group = character[1];
						let num = 1;
						if (player.sex !== gender) num++;
						if (player.group !== group) num++;
						return num;
					});
					const { bool, links } = await next.forResult();
					if (player.isOnline2()) {
						player.send('closeDialog', event.videoId);
					}
					event.dialog.close();
					delete _status.noclearcountdown;
					if (!_status.noclearcountdown) {
						game.stopCountChoose();
					}
					if (bool) {
						event.card = links[0];
						const old = player.storage.PShuashen.current;
						const sex = get.character(event.card).sex;
						player.storage.PShuashen.current = event.card;
						game.broadcastAll(function (player, character, old) {
							player.tempname.remove(old);
							player.tempname.add(character);
							player.sex = sex;
						}, player, event.card, old, sex);
						player.flashAvatar('PShuashen', event.card);
						game.log(player, '将性别变为了', '#y' + get.translation(sex) + '性');
						let group = get.character(event.card).group;
						if (get.is.double(event.card)) {
							const { control } = await player.chooseControl(get.is.double(name, true)).set("prompt", "请选择你的势力");
							group = control;
						}
						await player.changeGroup(group);
					}
				},
				sub: true,
			},
		},
		"_priority": 0,
	},
	PSxinsheng: {
		unique: true,
		audio: "rexinsheng",
		trigger: {
			player: "damageEnd",
			// source:"damageSource",
		},
		frequent: true,
		content: function () {
			'step 0'
			event.num = trigger.num;
			'step 1'
			lib.skill.PShuashen.addHuashens(player, 1);
			'step 2'
			if (--event.num > 0 && player.hasSkill(event.name) && !get.is.blocked(event.name, player)) {
				player.chooseBool(get.prompt2('PSxinsheng')).set('frequentSkill', event.name);
			}
			else event.finish();
			'step 3'
			if (result.bool && player.hasSkill('PSxinsheng')) {
				player.logSkill('PSxinsheng');
				event.goto(1);
			}
		},
		"_priority": 0,
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
				player.recoverTo(1);
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
						if (cards.includes(i)) return true;
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
						if (hs.includes(i)) return true;
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
						if (cards.includes(i)) return true;
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
							return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current) && lib.filter.targetInRange(event.card, player, current);
						})) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					'step 0'
					var num = game.countPlayer(function (current) {
						return !trigger.targets.includes(current) && lib.filter.targetEnabled2(trigger.card, player, current) && lib.filter.targetInRange(trigger.card, player, current);
					});
					player.chooseTarget('暂和：是否为' + get.translation(trigger.card) + '增加任意个目标？', [1, Infinity], function (card, player, target) {
						var trigger = _status.event.getTrigger();
						var card = trigger.card;
						return !trigger.targets.includes(target) && lib.filter.targetEnabled2(card, player, target) && lib.filter.targetInRange(card, player, target);
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
		filter: function (event, player) {
			if (_status.dying.length) return false;
			return true;
		},
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
					target.addSkills(i);
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
					/* for (var j in lib.element.button) {
						next[j] = lib.element.button[j];
					} */
					Object.setPrototypeOf(next, lib.element.Button.prototype);
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
							/* for (var j in lib.element.button) {
								next[j] = lib.element.button[j];
							} */
							Object.setPrototypeOf(next, lib.element.Button.prototype);
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
			if (event.hasNature()) return true;
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
		audio: "ext:PS武将/audio/skill:2",
		trigger: {
			player: "phaseBegin",
		},
		forced: true,
		priority: 99,
		filter: function (event, player) {
			return event.phaseList.length;
		},
		content: function () {
			trigger.phaseList = ['phaseDraw', 'phaseUse', 'phaseDiscard'];
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
				if (['sha', 'juedou', 'nanman', 'wanjian', 'huogong'].includes(card.name)) return 10;
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
				target.recoverTo(target.maxHp);
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
			var str = (["phaseDrawSkipped", "phaseDrawCancelled"].includes(event.triggername)) ? '摸牌阶段' : '出牌阶段';
			game.log(player, '恢复了', str);
			player[trigger.name]();
		},
	},
	PSzailaiyici: {
		audio: "tongli",
		trigger: {
			global: "useCard",
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
			if (['shan', 'wuxie'].includes(get.name(event.card, event.player))) return false;
			for (var i = 0; i < event.targets.length; i++) {
				if (!event.targets[i].isAlive()) return false;
				if (!event.player.canUse({ name: event.card.name }, event.targets[i], false, false)) {
					return false;
				}
			}
			return true;
		},
		content: function () {
			trigger.effectCount++;
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

			if (['shan', 'wuxie'].includes(event.card.name)) return false;
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
			return player.isLinked() && event.notLink() && event.hasNature('fire');
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
					return event.player != player && player.isLinked() && event.player.isLinked() && event.hasNature('fire');
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
						if ([list[i]].includes(get.type(result.cards[j], 'trick', result.cards[j].original == 'h' ? player : false))) {
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
					if (['delay'].includes(get.type(result.cards[i], null, result.cards[i].original == 'h' ? player : false))) {
						bool = false; break;
					}
				}
			}
			if (bool) {
				player.chooseTarget('是否视为使用一张【杀】？').set('filterTarget', function (card, player, target) {
					return player.canUse({ name: 'sha' }, target, false);
				}).set('ai', function (target) {
					const player = get.event().player;
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
				player.addSkills(result.control);
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
			player.addSkills('PSbb_yingzi');
			player.addSkills('PSbb_yinghun');
			player.removeSkills('PSbaiban');
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
				if (['wugu', 'zhulu_card', 'yiyi', 'lulitongxin', 'lianjunshengyan', 'diaohulishan'].includes(button.link[2])) return 0;
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
			if (!lib.inpile.includes(name)) return false;
			var type = get.type(name);
			return (type == 'basic' || type == 'trick' || type == 'delay') && !player.hasSkill('PSmiewu_failure') && player.countCards('she') > 0
		},
		ai: {
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
		locked: false,
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
			combo: "PSmn_quanji",
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
			if (!event.addedTargets && event.targets.length == 1 && event.targets.includes(player)) return false;
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
						return !targets.includes(current) && lib.filter.targetEnabled2(card, player, current) && get.effect(current, card, player, player) > 0;
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
				if (lib.linked.includes(get.nature(item))) {
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
				if (lib.inpile.includes(i)) {
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
				if (player.getCards('e').includes(card)) return false;
			},
			canBeDiscarded: function (card, source, player) {
				if (player.getCards('e').includes(card)) return false;
			},
			canBeReplaced: function (card, player) {
				if (player.getCards('e').includes(card)) return false;
			},
			cardDiscardable: function (card, player) {
				if (player.getCards('e').includes(card)) return false;
			},
			"cardEnabled2": function (card, player) {
				if (player.getCards('e').includes(card)) return false;
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
					return event.cards.some(card => player.getCards('e').includes(card));
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
						if (!lib.inpile.includes(i)) {
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
						if (!lib.inpile.includes(name)) {
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
					if (trigger.name == 'die') trigger.cancel();
					var list = ['暴怒战神', '神鬼无前', '炼狱修罗'];
					player.chooseControl(list, function () {
						return list.randomGet();
					}).set('prompt', '请选择一个变身形态：');
					'step 1'
					if (result.control == '暴怒战神') {
						player.reinitCharacter2('PSboss_lvbu1', 'PSboss_lvbu2', [6, 6]);
					}
					else if (result.control == '神鬼无前') {
						player.reinitCharacter2('PSboss_lvbu1', 'PSboss_lvbu3', [6, 6]);
					}
					else player.reinitCharacter2('PSboss_lvbu1', 'PSboss_lvbu4', [6, 6]);
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
					if (player.storage.PStaoluan && player.storage.PStaoluan.includes(name)) continue;
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
				if (['wugu', 'zhulu_card', 'yiyi', 'lulitongxin', 'lianjunshengyan', 'diaohulishan'].includes(button.link[2])) return 0;
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
			if (!lib.inpile.includes(name)) return false;
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
			const name = player.name1.startsWith('PSboss_lvbu') ? player.name1 : player.name2 && player.name2.startsWith('PSboss_lvbu') ? player.name2 : player.name1;
			if (result.control == '暴怒战神') {
				player.reinitCharacter2(name, 'PSboss_lvbu2');
			}
			else if (result.control == '神鬼无前') {
				player.reinitCharacter2(name, 'PSboss_lvbu3');
			}
			else if (result.control == '炼狱修罗') {
				player.reinitCharacter2(name, 'PSboss_lvbu4');
			}
			else event.finish();
			'step 3'
			player.logSkill('PSbaguan1_bianshen');
			player.addSkill("PSbaguan2_clear");
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
					const name = player.name1.startsWith('PSboss_lvbu') ? player.name1 : player.name2 && player.name2.startsWith('PSboss_lvbu') ? player.name2 : player.name1;
					if (result.control == '暴怒战神') {
						player.reinitCharacter2(name, 'PSboss_lvbu2');
					}
					else if (result.control == '神鬼无前') {
						player.reinitCharacter2(name, 'PSboss_lvbu3');
					}
					else if (result.control == '炼狱修罗') {
						player.reinitCharacter2(name, 'PSboss_lvbu4');
					}
					else event.finish();
					'step 3'
					player.logSkill('PSbaguan1_bianshen');
					player.addSkill("PSbaguan2_clear");
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
					player.chooseToUse({ name: 'tao' }, '神躯：请使用一张桃', true).logSkill = 'PSshenqu3';
				},
				sub: true,
			},
		},
	},
	"PSjiwu3": {
		init: function (player) {
			player.addSkill('PSjiwu3_clear');
			// player.addSkill('PSjiwu3_audio');
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
					if (list.includes('decadexuanfeng') && player.countCards('he', { type: 'equip' })) return 'decadexuanfeng';
					if (!player.getStat().skill.qiangxix) {
						if (player.hasSkill('qiangxix') && player.getEquip(1) && list.includes('decadexuanfeng')) return 'decadexuanfeng';
						if (list.includes('rewansha') || list.includes('qiangxix')) {
							var players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								if (players[i].hp == 1 && get.attitude(player, players[i]) < 0) {
									if (list.includes('rewansha')) return 'rewansha';
									if (list.includes('qiangxix')) return 'qiangxix';
								}
							}
						}
					}
					if (list.includes('qiangxix')) return 'qiangxix';
					if (list.includes('rewansha')) return 'rewansha';
					if (list.includes('decadexuanfeng')) return 'decadexuanfeng';
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
			// 以下技能已作废
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
							game.playAudio('..', 'extension', 'PS武将/audio/skill', audio1);
							break;
						case 'rewansha':
							var audio2 = ['rewansha1', 'rewansha2'].randomGet();
							game.playAudio('..', 'extension', 'PS武将/audio/skill', audio2);
							break;
						case 'retieji':
							var audio3 = 'retieji1';
							game.playAudio('..', 'extension', 'PS武将/audio/skill', audio3);
							break;
						case 'decadexuanfeng':
							var audio4 = ['decadexuanfeng1', 'decadexuanfeng2'].randomGet();
							game.playAudio('..', 'extension', 'PS武将/audio/skill', audio4);
							break;
						default:
							var audio5 = ['wushuang1', 'wushuang2', 'wushuang3', 'wushuang4', 'wushuang5', 'wushuang6', 'wushuang7', 'wushuang8'].randomGet();
							game.playAudio('..', 'extension', 'PS武将/audio/skill', audio5);
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
			combo: "PSshenfen4",
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
				return target != player && (!player.storage.PSxianfu_target || !player.storage.PSxianfu_target.includes(target));
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
					if (event.player.isDead() || !player.storage.PSxianfu_target || !player.storage.PSxianfu_target.includes(event.player) || event.num <= 0) return false;
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
					if (['damage', 'recover'].includes(trigger.name)) player[trigger.name](trigger.num, 'nosource');
					if (trigger.name == 'gain') player.draw(trigger.cards.length);
					if (trigger.name == 'lose') player.chooseToDiscard('he', trigger.cards.length, true);
				},
				onremove: function (player) {
					if (!player.storage.PSxianfu_target) return;
					game.countPlayer(function (current) {
						if (player.storage.PSxianfu_target.includes(current) && current.storage.PSxianfu_mark) {
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
					return event.player == player || player.storage.PSxianfu_target && player.storage.PSxianfu_target.includes(event.player);
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
					if (player.storage.PSxianfu_target && player.storage.PSxianfu_target.includes(target)) return att * 2;
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
					if (player.storage.PSxianfu_target && player.storage.PSxianfu_target.includes(target)) {
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
			player.addSkills('PShuju');
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
				return get.rand(0, num);
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
						if ([list[i]].includes(get.type(result.cards[j], 'trick', result.cards[j].original == 'h' ? player : false))) {
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
					if (lib.character[name][1] == 'wu' && lib.skill.PSfushi.characterList().includes(name)) list.push(name);
				}
			}
			else if (_status.connectMode) {
				list = get.charactersOL(function (i) {
					return lib.character[i][1] != 'wu' && !lib.skill.PSfushi.characterList().includes(i);
				});
			}
			else {
				list = get.gainableCharacters(function (info, i) {
					return info[1] == 'wu' && lib.skill.PSfushi.characterList().includes(i);
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
			if (false/* lib.config.extensions && lib.config.extensions.includes('天牢令') && lib.config['extension_天牢令_enable'] && game.TLHasExt */) {
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
				for (var i of map.skills) player.addSkills(i);
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
					if (target.skipList.includes('phaseDraw') || target.hasSkill('pingkou')) return 0;
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
					if (history[index - j].targets.includes(event.targets[i])) num++;
					else break;
				} if (evt.targets.includes(event.targets[i]) && num % 2 == 0 && lib.filter.filterTarget({ name: 'shunshou' }, player, event.targets[i])) return true;
			}
			return false;
		},
		direct: true,
		content: function () {
			var targets = player.getLastUsed(1).targets;
			var next = player.chooseToUse();
			next.set('targets', game.filterPlayer(function (current) {
				return targets.includes(current) && trigger.targets.includes(current);
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
				return get.rand(0, contorl.length);
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
							if (lib.filter.targetEnabled2(trigger.card, player, players[i]) && !trigger.targets.includes(players[i])) {
								goon = true; break;
							}
						}
					}
					if (goon && trigger.card.name != 'tiesuo') {
						player.chooseTarget('神愤：是否额外指定一至两名' + get.translation(trigger.card) + '的目标？', [1, 2], function (card, player, target) {
							var trigger = _status.event;
							if (trigger.targets.includes(target)) return false;
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
							if (trigger.targets.includes(target)) return false;
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
					if (trigger.cards && trigger.cards.length && trigger.targets.includes(player)) {
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
				if (evt && evt.numbers && evt.numbers.includes(get.number(result))) return 0;
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
				const player = get.event().player;
				const target = get.event().target;
				if (get.attitude(player, target) >= 0) return 0;
				return 10 - player.hp - get.value(card);
			}).set('prompt', '洛神：请弃置两张花色不同的黑色牌，否则展示牌堆底三张牌，将其中的黑色牌置于' + get.translation(player) + '武将牌上').set('complexCard', true).set('target', player);
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
					if (cards.includes(card)) {
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
			if (trigger.hasNature('fire')) trigger.cancel();
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
		audio: "xingtu",
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
			list.randomSort();//list里的元素随机排序
			list.push('放弃');
			var next = player.chooseControl(list);
			next.set('prompt', '行图：请回答' + prompt);
			next.set('ai', function () {
				return event.num.toString();
			});
			/* player.popup(num--);//玩家武将牌弹出数字
			event.popup = setInterval(function () {
				player.popup(num);
				num--;
				if (num == 0) num = '时间到！';
			}, 1000);//每过1秒弹出一次 */
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
					/* for (var i = 0; i < next.controlbars.length - 1; i++) {
						next.controlbars[i].close();//按钮关闭
					} */
					next.controlbars.at(-1).click();
				}
			}, 3000);//3秒后自动点击“取消”
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
						if (['trick', 'delay'].includes(lib.card[card.name].type)) return 'sha';
					},
					cardnature: function (card, player) {
						if (['trick', 'delay'].includes(lib.card[card.name].type)) return 'thunder';
					},
					cardUsable: function (card, player) {
						if (card.name == 'sha' && game.hasNature(card, 'thunder')) return Infinity;
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
			player.addSkills('PSjin_miewu');
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
		audio: "pingjian",
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
						if (player.storage.PSsb_pingjian.includes(skills2[j])) continue;
						if (skills.includes(skills2[j]) && lib.skill.PSfushi.characterList().includes(name)) {
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
							if ((info.trigger.player == name2 || Array.isArray(info.trigger.player) && info.trigger.player.includes(name2)) && lib.skill.PSfushi.characterList().includes(name)) {
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
					if (false/* lib.config.extensions && lib.config.extensions.includes('天牢令') && lib.config['extension_天牢令_enable'] && game.TLHasExt */) {
						var skillx = skills.slice(0);
						skills = [];
						for (var i = 0; i < list.length; i++) {
							skills[i] = (lib.character[list[i]][3] || []).filter(function (skill) {
								return skillx.includes(skill);
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
								if (player.storage.PSsb_pingjian.includes(skills2[j])) continue;
								if ((skills.includes(skills2[j]) || lib.skill.PSsb_pingjian.phaseUse_special.includes(skills2[j])) && lib.skill.PSfushi.characterList().includes(name)) {
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
									if ((info.enable == 'phaseUse' || Array.isArray(info.enable) && info.enable.includes('phaseUse')) && lib.skill.PSfushi.characterList().includes(name)) {
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
							if (false/* lib.config.extensions && lib.config.extensions.includes('天牢令') && lib.config['extension_天牢令_enable'] && game.TLHasExt */) {
								var skillx = skills.slice(0);
								skills = [];
								for (var i = 0; i < list.length; i++) {
									skills[i] = (lib.character[list[i]][3] || []).filter(function (skill) {
										return skillx.includes(skill);
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
					if (player.storage.PSsb_pingjian_temp.includes(event.skill)) return true;
					if (player.storage.PSsb_pingjian_temp.includes(info.sourceSkill) || player.storage.PSsb_pingjian_temp.includes(info.group)) return true;
					if (Array.isArray(info.group) && (info.group.includes(player.storage.PSsb_pingjian_temp[0]) || info.group.includes(player.storage.PSsb_pingjian_temp[1]))) return true;
					return false;
				},
				content: function () {
					var info = lib.skill[trigger.skill];
					for (var i of player.storage.PSsb_pingjian_temp) {
						if (Array.isArray(info.group) && info.group.includes(i)) {
							player.removeSkills(i);
							player.storage.PSsb_pingjian_temp.remove(i);
							break;
						}
						if (info.sourceSkill == i || info.group == i || trigger.skill == i) {
							player.removeSkills(i);
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
							return _status.event.list.includes(target);
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
					if (event.target.getCards('he').includes(event.card)) {
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
				onremove: function (player) {
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
							if (event.gaintag_map[i].includes('wengua')) return true;
						}
						return false;
					}
					return player.hasHistory('lose', function (evt) {
						if (event != evt.getParent()) return false;
						for (var i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes('wengua')) return true;
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
		filter: function (event, player) {
			return game.countPlayer(current => {
				return current != player;
			}) > 1;
		},
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
				if (list.includes(i)) list.remove(i);
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
				if (list.includes(i)) list.remove(i);
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
						if (list.includes('equip5')) return 'equip5';
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
					if (false/* lib.config.extensions && lib.config.extensions.includes('天牢令') && lib.config['extension_天牢令_enable'] && game.TLHasExt */) {
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
						for (var i of map.skills) player.addSkills(i);
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
							if (player.disabledSkills[i].includes(skill)) list.push(i);
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
		audio: "wusheng_re_guanyu",
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
						return !targets.includes(current) && lib.filter.targetEnabled2(card, player, current) && get.effect(current, card, player, player) > 0;
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
				if (lib.linked.includes(get.nature(item))) {
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
						if (!trigger.getParent().directHit.includes(trigger.target)) {
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
					suit: ['任意', ...lib.suit].randomGet(),
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
				game.log(player, '声明了', (event.suit || '任意花色'), '和', (event.type || '任意类型'));
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
						if (lib.character[name][1] == 'shu' && lib.skill.PSfushi.characterList().includes(name)) list.push(name);
					}
				}
				else if (_status.connectMode) {
					list = get.charactersOL(function (i) {
						return lib.character[i][1] != 'shu' && !lib.skill.PSfushi.characterList().includes(i);
					});
				}
				else {
					list = get.gainableCharacters(function (info, i) {
						return info[1] == 'shu' && lib.skill.PSfushi.characterList().includes(i);
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
				event.target.addSkills(lib.character[name][3]);
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
	PStuoyu: {
		audio: "dctuoyu",
		inherit: "dctuoyu",
		audioname2: {
			PSshen_dengai2: ['ext:PS武将/audio/skill/PStuoyu_PSshen_dengai21', 'ext:PS武将/audio/skill/PStuoyu_PSshen_dengai22']
		},
		cardIsIgnored(card) {
			const tags = ["dctuoyu_fengtian", "dctuoyu_qingqu", "dctuoyu_junshan"];
			for (let i = 0; i < tags.length; i++) {
				if (card.hasGaintag(tags[i] + "_tag")) {
					return true;
				}
			}
			return false;
		},
		mod: {
			ignoredHandcard(card) {
				if (get.info('PStuoyu').cardIsIgnored(card)) return true;
			},
			cardDiscardable(card, _, name) {
				if (name == "phaseDiscard" && get.info('PStuoyu').cardIsIgnored(card)) return false;
			},
		},
		ai: {
			combo: "PSxianjin",
		},
	},
	PSxianjin: {
		audio: "dcxianjin",
		audioname2: {
			PSshen_dengai2: ['ext:PS武将/audio/skill/PSxianjin_PSshen_dengai21', 'ext:PS武将/audio/skill/PSxianjin_PSshen_dengai22']
		},
		inherit: "dcxianjin",
		trigger: {
			global: "roundStart",
			player: "damageEnd",
			source: "damageSource",
		},
		filter(event, player, name) {
			return name === "roundStart" || player.countMark("dcxianjin") % 2 == 0;
		},
		content() {
			"step 0";
			var tags = ["dctuoyu_fengtian", "dctuoyu_qingqu", "dctuoyu_junshan"];
			tags.removeArray(player.getStorage("dctuoyu"));
			if (!tags.length) {
				player.insertPhase();
			} else if (tags.length == 1) {
				event._result = { control: tags[0] };
			} else player.chooseControl(tags).set("prompt", "险进：选择激活一个副区域标签");
			"step 1";
			var control = result.control;
			if (control) {
				game.log(player, "激活了副区域", "#y" + get.translation(control));
				player.markAuto("dctuoyu", [control]);
				player.popup(get.translation(control + "_tag"));
			}
			player.draw(player.getStorage("dctuoyu").length);
		},
	},
	PSqijing: {
		audio: "dcqijing",
		audioname2: {
			PSshen_dengai2: ['ext:PS武将/audio/skill/PSqijing_PSshen_dengai21', 'ext:PS武将/audio/skill/PSqijing_PSshen_dengai22']
		},
		trigger: {
			global: ['phaseAfter', 'phaseCancelled', 'phaseSkipped']
		},
		filter: function (event, player) {
			return !event.skill && event.player.next == _status.roundStart && player.getStorage("dctuoyu").length == 3;
		},
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "orange",
		forceDie: true,
		priority: -Infinity,
		lastDo: true,
		content() {
			"step 0";
			player.changeSkin("PSqijing", "PSshen_dengai2");
			lib.character.PSshen_dengai.dieAudios = ['ext:PS武将/audio/die/PSshen_dengai2.mp3'];
			player.awakenSkill("PSqijing");
			player.loseMaxHp();
			player.addSkills("dccuixin");
			"step 1";
			if (game.countPlayer() > 2) {
				if (player == trigger.player && !trigger.skill) {
					var evt = trigger.getParent();
					if (evt.name == "phaseLoop" && evt._isStandardLoop) evt.player = player.next;
				}
				player
					.chooseTarget(
						"请选择一名要更换座次的角色，将自己移动到该角色的上家位置",
						function (card, player, target) {
							return target != player && target != player.next;
						},
						true
					)
					.set("ai", function (target) {
						var player = _status.event.player;
						var current = _status.currentPhase.next;
						var max = 20,
							att = 0;
						while (max > 0) {
							max--;
							if (current == target) return att;
							att -= get.attitude(player, current);
							current = current.next;
						}
						return att;
					});
			} else event.finish();
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				game.broadcastAll(
					function (target1, target2) {
						game.swapSeat(target1, target2, null, true);
					},
					player,
					target
				);
			}
		},
		ai: {
			combo: "PStuoyu",
		},
		"_priority": 0,
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
		content() {
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
		/* init: function (player) {
			if (!player.storage.PStianzuo) player.storage.PStianzuo = 0;
		}, */
		filter: function (event, player) {
			if (!ui.discardPile.childNodes.length) return false;
			if (event.name != 'phase') return event.num > 0;
			return true;
		},
		async content(event, trigger, player) {
			'step 0'
			const num = event.triggername === "damageEnd" ? trigger.num : 1;
			// event.num--;
			/* var cards = get.cards(ui.cardPile.childElementCount + 1);
			for (var i = 0; i < cards.length; i++) {
				ui.cardPile.insertBefore(cards[i], ui.cardPile.childNodes[get.rand(ui.cardPile.childElementCount)]);
			}
			game.updateRoundNumber();
			player.storage.PStianzuo++; */
			for (let i = 0; i < num; i++) {
				await game.washCard();
			}
		},
		group: 'PStianzuo_use',
		subSkill: {
			use: {
				audio: "tianzuo",
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					if (!ui.discardPile.childNodes.length) return false;
					return true;
				},
				content: () => {
					game.washCard();
					/* var cards = get.cards(ui.cardPile.childElementCount + 1);
					for (var i = 0; i < cards.length; i++) {
						ui.cardPile.insertBefore(cards[i], ui.cardPile.childNodes[get.rand(ui.cardPile.childElementCount)]);
					}
					player.storage.PStianzuo++;
					game.updateRoundNumber(); */
					// event.trigger('PStianzuoAfter');
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
			return player.getAllHistory('useSkill', evt => ['PStianzuo', 'PStianzuo_use'].includes(evt.skill)).length >= 3;
		},
		content: () => {
			player.awakenSkill(event.name);
			player.storage[event.name] = true;
			player.gainMaxHp();
			player.recover();
			player.addSkills('PSzuoding');
		},
	},
	PSzuoding: {
		audio: "ext:PS武将/audio/skill:2",
		enable: "phaseUse",
		usable: 3,
		filterCard: true,
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
		filter: function (event, player) {
			return !player.hasSkill("PSzhengu_mark") || game.hasPlayer(current => current != player && !current.hasSkill("PSzhengu_mark"));
		},
		async cost(event, trigger, player) {
			event.result = await player.chooseTarget(get.prompt2('PSzhengu'), function (card, player, target) {
				if (target === player) return false;
				if (!player.hasSkill("PSzhengu_mark")) return true;
				return !target.hasSkill("PSzhengu_mark");
			})
				.set('ai', function (target) {
					const att = get.attitude(player, target);
					const num = target.countCards('h') - player.countCards('h');
					if (player.hasSkill("PSzhengu_mark") && num <= 0) return 0;
					if (target.hasSkill("PSzhengu_mark") && num <= 0) return 0;
					if (att <= 0) {
						if (num > 0) return num;
						return 0;
					}
					return Math.abs(num);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			let control;
			if (player.hasSkill("PSzhengu_mark")) {
				control = target;
			} else if (target.hasSkill("PSzhengu_mark")) {
				control = player;
			} else {
				({ control } = await player.chooseControl()
					.set('controls', ['自己', target])
					.set('prompt', `令你或${get.translation(target)}变成“高达”：手牌数始终保持与另一方一致，直到“高达”的回合结束时`)
					.set('target', target)
					.set('ai', function () {
						const { controls, target } = get.event();
						const att = get.attitude(player, target);
						const num = target.countCards('h') - player.countCards('h');
						if (att <= 0 && num > 0) return controls[0];
						return num > 0 ? controls[0] : controls[1];
					})
					.forResult());
			}

			const current = control === '自己' ? player : target;
			const buffTarget = control === '自己' ? target : player;

			game.log(current, '变成了“高达”！对象是：', buffTarget);
			var num = buffTarget.countCards('h') - current.countCards('h');
			if (num > 0) current.draw(num);
			if (num < 0) current.chooseToDiscard('h', true, -num);
			current.storage.PSzhengu_mark = buffTarget;
			current.addTempSkill("PSzhengu_mark", { player: "phaseJieshuBegin" });
			current.markSkill("PSzhengu_mark");
		},
		subSkill: {
			mark: {
				onremove: function (player) {
					player.unmarkSkill("PSzhengu_mark");
					delete player.storage.PSzhengu_mark;
				},
				mark: "character",
				intro: {
					content: "已经变成了$的形状",
				},
				trigger: {
					global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				forced: true,
				filter: function (event, player) {
					let target = player.storage.PSzhengu_mark;
					return target && target.isIn() && target.isAlive() && target.countCards('h') !== player.countCards('h');
				},
				content: function () {
					let target = player.storage.PSzhengu_mark;
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
					return cards.includes(get.suit(event.card));
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
			if (name == 'useCardAfter' && ['equip', 'delay'].includes(get.type(event.card))) return false;
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
					if (lib.character[name][1] == 'wu' && lib.skill.PSfushi.characterList().includes(name)) list.push(name);
				}
			}
			else if (_status.connectMode) {
				list = get.charactersOL(function (i) {
					return lib.character[i][1] != 'wu' && !lib.skill.PSfushi.characterList().includes(i);
				});
			}
			else {
				list = get.gainableCharacters(function (info) {
					return info[1] == 'wu' && lib.skill.PSfushi.characterList().includes(i);
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
						player.removeSkills(links);
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
			player.removeSkills('PSyuheng');
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
				player.addSkills('PSgongxin');
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
					player.removeSkills('PSgongxin');
				},
			},
		},
	},
	PSjuanjia: {
		audio: "juanjia",
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
				let hs1 = player.getCards('h', (card) => hs.includes(card) && get.PS_pingZe(get.translation(card.name)) == '平');
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
			skills.forEach(evt => {
				evt.event.cards.forEach(card => {
					suits.add(get.suit(card));
				});
				num -= suits.length;
				suits = [];
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
			player.removeSkills('PSzongheng');
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
	PShuoshou: {
		audio: "ext:PS武将/audio/skill:2",
		inherit: "huoshou",
		trigger: {
			source: "damageSource",
		},
		filter: function (event, player) {
			return event.card && event.card.name === 'nanman' && event.player.isAlive() && event.player.isIn() && event.player.countCards('he');
		},
		content: function () {
			player.gainPlayerCard(trigger.player, 1, 'he', true);
		},
	},
	PSxingluan: {
		audio: "sppanqin",
		trigger: {
			global: "useCardAfter",
		},
		locked: true,
		getNum: function (event, player) {
			let damageNum = 0;
			player.getHistory('sourceDamage', function (evt) {
				if (evt.card === event.card) {
					damageNum += evt.num;
				}
			});
			const num = Math.max(event.targets.length - damageNum, 0);
			return num;
		},
		filter: function (event, player) {
			if (event.card.name !== 'nanman') return false;
			if (event.cards.filterInD('od').length === 0) return false;
			return player.countCards('he') >= lib.skill.PSxingluan.getNum(event, player);
		},
		"prompt2": function (event, player) {
			const num = lib.skill.PSxingluan.getNum(event, player);
			let str = num > 0 ? `弃置${get.cnNumber(num)}张牌，` : '';
			str += `获得 ${get.translation(event.cards)} `;
			return str;
		},
		content: function () {
			const num = lib.skill.PSxingluan.getNum(trigger, player);
			if (num > 0) player.chooseToDiscard('he', num, true);
			const cards = trigger.cards.filterInD('od');
			player.gain(cards, 'gain2');
		}
	},
	PSjiqiao: {
		audio: "ext:PS武将/audio/skill:2",
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter: function (event, player) {
			return (event.name != 'phase' || game.phaseNumber == 0);
		},
		content: function () {
			const cards = ['muniu', 'bagua', 'zhuge'];
			/* for (let i of cards) {
				 var card = get.cardPile2(function (card) {
				 return player.canUse(card, player) && card.name === i;
				 }); 
				 }
				player.equip(card);*/
			cards.forEach(name => {
				const card = game.createCard(name, lib.suit.randomGet(), get.rand(1, 13));
				if (player.canUse(card, player)) player.equip(card);
			});
		},
		group: "PSjiqiao_use",
		subSkill: {
			use: {
				audio: "PSjiqiao",
				trigger: {
					global: ["logSkill", "useSkillBegin"],
				},
				forced: true,
				filter: function (event, player) {
					return event.skill && get.info(event.skill).equipSkill && ['muniu_skill', 'bagua_skill', 'zhuge_skill'].includes(event.skill);
				},
				content: () => {
					player.draw();
				},
			},
		},
	},
	PShuoji: {
		audio: "ext:PS武将/audio/skill:2",
		enable: "phaseUse",
		usable: 3,
		content: function () {
			var card = get.cardPile2(function (card) {
				return get.translation(card).includes('火') || lib.translate[card.name + '_info'].includes('火');
			});
			if (card) {
				player.gain(card, 'gain2')
			} else {
				game.log(player, '从牌堆中没有检索到带', '#y火', '字的牌');
				player.chat('没有检索到带"火"字的牌');
			}
		},
		ai: {
			order: 10,
		},
	},
	PSpingnan: {
		audio: "ext:PS武将/audio/skill:2",
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		selectTarget: [1, 3],
		multitarget: true,
		content: function () {
			'step 0'
			targets.sort(lib.sort.seat);
			targets.forEach(target => target.damage());
			const filterTarget = targets.filter(current => current.isAlive() && current.isIn() && current !== player && current.countGainableCards(player, 'he') > 0);
			if (filterTarget.length) {
				player.chooseTarget('平南：是否获得其中一名角色的一张牌？').set('filterTarget', function (card, player, target) {
					return filterTarget.includes(target);
				}).set('ai', function (target) {
					var att = get.attitude(_status.event.player, target);
					if (target.hasSkill('tuntian')) return att / 10;
					return 1 - att;
				});
			}
			'step 1'
			if (result.bool && result.targets) {
				player.gainPlayerCard(result.targets[0], 1, 'he', true);
			}
		},
		ai: {
			damage: true,
			order: 8,
			result: {
				player: function (player, target) {
					return get.damageEffect(player, player, player);
				},
				target: function (player, target) {
					return get.damageEffect(target, player, target);
				},
			},
			threaten: 1.5,
		},
	},
	PSduodao: {
		audio: "reduodao",
		trigger: {
			player: "damageEnd",
			target: "useCardToTargeted",
		},
		filter: function (event, player, name) {
			if (name === "useCardToTargeted") return event.player !== player && event.card.name == 'sha';
			return event.source && event.source !== player;
		},
		direct: true,
		check: function (event, player) {
			return 1;
		},
		content: function () {
			'step 0'
			player.draw();
			var target = event.triggername === 'useCardToTargeted' ? trigger.player : trigger.source;
			if (target && target.countGainableCards(player, 'he') > 0) {
				player.gainPlayerCard(target, 1, 'he', false);
			}
			'step 1'
			if (!result.bool || (result.bool && result.cards[0].original !== 'h')) {
				player.draw();
			}
		},
		ai: {
			"maixie_defend": true,
		},
		"_priority": 0,
	},
	PSanjian: {
		mod: {
			targetEnabled: function (card, player, target, now) {
				if (player.getEquips(1).length === 0) {
					if (card.name == 'sha') return false;
				}
			},
		},
		audio: "reanjian",
		trigger: {
			player: "useCardToPlayered",
		},
		forced: true,
		filter: function (event, player) {
			return event.card.name == 'sha' && !event.target.getEquips(1).length;
		},
		logTarget: "target",
		content: function () {
			trigger.directHit.add(trigger.target);
			var map = trigger.customArgs;
			var id = trigger.target.playerid;
			if (!map[id]) map[id] = {};
			if (!map[id].extraDamage) map[id].extraDamage = 0;
			map[id].extraDamage++;
		},
	},
	PSdujin: {
		audio: "dujin",
		trigger: {
			player: "phaseDrawBegin2",
		},
		forced: true,
		filter: function (event, player) {
			return !event.numFixed;
		},
		content: function () {
			trigger.num += Math.max(1, player.countCards('e'));
		},
		mod: {
			maxHandcard: function (player, num) {
				return num + Math.max(1, player.countCards('e'));
			},
		},
	},
	PSgudan: {
		audio: "ext:PS武将/audio/skill:2",
		trigger: {
			player: "damageBegin4",
			target: "useCardToTargeted",
		},
		forced: true,
		filter: function (event, player, name) {
			if (name === "useCardToTargeted") return get.type2(event.card) === 'trick' && get.color(event.card) === 'black' && event.targets.length === 1 && event.targets[0] === player;
			if (!event.source || event.source === player) return false;
			let card = event.cards ? event.cards[0] : event.card;
			if (get.itemtype(card) == 'card' && card.original === 'h') return false;
			return true;
		},
		content: function () {
			'step 0'
			if (event.triggername === "damageBegin4") {
				trigger.num++;
				event.finish();
			} else {
				player.chooseToDiscard('he', 1).ai = function (card) {
					return 6 - get.value(card);
				};
			}
			'step 1'
			if (!result.bool) {
				player.loseHp();
			}
		},
	},
	PSrende: {
		audio: "ext:PS武将/audio/skill:2",
		enable: "phaseUse",
		filter: function (event, player) {
			return game.hasPlayer(function (current) {
				return current.countCards('h') && !current.hasSkill('PSrende_used');
			});
		},
		filterTarget: function (card, player, target) {
			if (!ui.selected.targets.length) return !target.hasSkill('PSrende_used') && target.countCards('h');
			return true;
		},
		targetprompt: ["交出牌", "获得牌"],
		selectTarget: 2,
		multitarget: true,
		content: function () {
			'step 0'
			targets[0].addTempSkill('PSrende_used', 'phaseUseEnd');
			targets[0].chooseCard('h', true, [1, targets[0].countCards('h')], '选择交给' + get.translation(targets[1]) + '至少一张牌').set('ai', card => {
				if (_status.event.attitude) return 0;
				return 7 - get.value(card);
			}).set('attitude', get.attitude(targets[0], targets[1]) < 0);;
			'step 1'
			if (result.bool && result.cards && result.cards.length) {
				targets[0].give(result.cards, targets[1]);
				if (result.cards.length >= 2) {
					let next = game.createEvent('chooseToUse');
					next.player = targets[0];
					next.setContent(lib.skill.PSrende.chooseToUse);
				}
			}
		},
		chooseToUse: function () {
			'step 0'
			var list = [];
			if (lib.filter.cardUsable({ name: 'sha' }, player, event.getParent('chooseToUse')) && game.hasPlayer(function (current) {
				return player.canUse('sha', current);
			})) {
				list.push(['基本', '', 'sha']);
			}
			for (var i of lib.inpile_nature) {
				if (lib.filter.cardUsable({ name: 'sha', nature: i }, player, event.getParent('chooseToUse')) && game.hasPlayer(function (current) {
					return player.canUse({ name: 'sha', nature: i }, current);
				})) {
					list.push(['基本', '', 'sha', i]);
				}
			}
			if (lib.filter.cardUsable({ name: 'tao' }, player, event.getParent('chooseToUse')) && game.hasPlayer(function (current) {
				return player.canUse('tao', current);
			})) {
				list.push(['基本', '', 'tao']);
			}
			if (lib.filter.cardUsable({ name: 'jiu' }, player, event.getParent('chooseToUse')) && game.hasPlayer(function (current) {
				return player.canUse('jiu', current);
			})) {
				list.push(['基本', '', 'jiu']);
			}
			if (list.length) {
				player.chooseButton(['是否视为使用一张基本牌？', [list, 'vcard']]).set('ai', function (button) {
					var player = _status.event.player;
					var card = { name: button.link[2], nature: button.link[3], isCard: true };
					if (card.name == 'tao') {
						if (player.hp == 1 || (player.hp == 2 && !player.hasShan()) || player.needsToDiscard()) {
							return 5;
						}
						return 1;
					}
					if (card.name == 'sha') {
						if (game.hasPlayer(function (current) {
							return player.canUse(card, current) && get.effect(current, card, player, player) > 0
						})) {
							if (card.nature == 'fire') return 2.95;
							if (card.nature == 'thunder' || card.nature == 'ice') return 2.92;
							return 2.9;
						}
						return 0;
					}
					if (card.name == 'jiu') {
						return 0.5;
					}
					return 0;
				});
			}
			else {
				event.finish();
			}
			'step 1'
			if (result && result.bool && result.links[0]) {
				var card = { name: result.links[0][2], nature: result.links[0][3] };
				player.chooseUseTarget(card, true);
			}
		},
		ai: {
			order: 8,
			result: {
				target: function (player, target) {
					if (ui.selected.targets.length == 0) {
						return -1;
					}
					else {
						return 1.2;
					}
				},
				player: 1.1,
			},
			expose: 0.4,
			threaten: 3,
		},
		subSkill: {
			used: {
				charlotte: true,
				silent: true,
				nopup: true,
			},
		},
		"_priority": 0,
	},
	PSjushou: {
		audio: "xinjushou",
		trigger: {
			global: "phaseBegin",
		},
		filter(event, player, name) {
			if (player.isTurnedOver()) return false;
			for (var i of lib.inpile) {
				var type = get.type(i);
				if (type === 'trick' && lib.filter.cardUsable({ name: i }, player, event.getParent('chooseToUse')) && player.hasUseTarget({ name: i })) {
					return true;
				}
			}
			return true;
		},
		content() {
			'step 0'
			var list = [];
			for (var name of lib.inpile) {
				if (get.type(name) === 'trick' && lib.filter.cardUsable({ name: name }, player, event.getParent('chooseToUse')) && player.hasUseTarget({ name: name })) {
					list.push(['锦囊', '', name]);
				}
			}
			if (list.length) {
				player.chooseButton(['据守：视为使用一张锦囊牌', [list, 'vcard']]).set('ai', function (button) {
					var player = _status.event.player;
					var card = { name: button.link[2], nature: button.link[3], isCard: true };
					if (event.type != 'phase') return 1;
					if (['wugu', 'zhulu_card', 'yiyi', 'lulitongxin', 'lianjunshengyan', 'diaohulishan'].includes(card.name)) return 0;
					return player.getUseValue({
						name: card.name,
					});
				});
			}
			else {
				event.finish();
			}
			'step 1'
			if (result && result.bool && result.links[0]) {
				player.turnOver();
				var card = { name: result.links[0][2], nature: result.links[0][3] };
				player.chooseUseTarget(card, true);
			}
		},
		group: ["PSjushou_turnOver", "PSjushou_chooseUse"],
		subSkill: {
			chooseUse: {
				audio: "xinjushou",
				enable: "chooseToUse",
				filter: function (event, player) {
					if (player.isTurnedOver()) return false;
					for (var i of lib.inpile) {
						var type = get.type(i);
						if (type === 'trick' && event.filterCard({ name: i }, player, event)) return true;
					}
					return false;
				},
				chooseButton: {
					dialog: function (event, player) {
						var list = [];
						for (var i = 0; i < lib.inpile.length; i++) {
							var name = lib.inpile[i];
							if (get.type(name) == 'trick' && event.filterCard({ name: name }, player, event)) list.push(['锦囊', '', name]);
						}
						return ui.create.dialog('据守', [list, 'vcard']);
					},
					filter: function (button, player) {
						return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
					},
					check: function (button) {
						if (_status.event.getParent().type != 'phase') return 1;
						var player = _status.event.player;
						if (['wugu', 'zhulu_card', 'yiyi', 'lulitongxin', 'lianjunshengyan', 'diaohulishan'].includes(button.link[2])) return 0;
						return player.getUseValue({
							name: button.link[2],
							nature: button.link[3],
						});
					},
					backup: function (links, player) {
						return {
							audio: 'xinjushou',
							popname: true,
							filterCard: false,
							selectCard: 0,
							check: function (card) {
								return 8 - get.value(card);
							},
							viewAs: { name: links[0][2], nature: links[0][3] },
							precontent: function () {
								player.turnOver();
							},
						}
					},
					prompt: function (links, player) {
						return '请选择' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '的目标';
					},
				},
				hiddenCard: function (player, name) {
					if (!lib.inpile.includes(name)) return false;
					if (player.isTurnedOver()) return false;
					var type = get.type(name);
					return type == 'trick';
				},
				ai: {
					fireAttack: true,
					skillTagFilter: function (player) {
						if (!player.countCards('he')) return false;
					},
					order: 1,
					result: {
						player: function (player) {
							return 1;
						},
					},
				},
			},
			turnOver: {
				audio: "xinjushou",
				trigger: {
					player: "turnOverEnd",
				},
				direct: true,
				filter(event, player) {
					return player.hasCard(function (card) {
						return lib.filter.cardDiscardable(card, player, 'PSjushou_turnOver');
					}, 'he');
				},
				content() {
					'step 0'
					player.chooseToDiscard('he', 1, get.prompt('PSjushou_turnOver'), '当你翻面时，你可以弃置一张牌，然后选择回血或者移动场上的牌').set('ai', function (card) {
						if (_status.event.goon) return 6 - get.value(card);
						return 0;
					})
					'step 1'
					if (result.bool) {
						let list = player.isDamaged() ? ['回复一点体力'] : [];
						if (player.canMoveCard()) list.push('移动场上一张牌');
						if (!list.length) { event.finish(); return; }
						else if (list.length === 2) {
							player.chooseControl(list, true).set('ai', function () {
								if (!player.countCards('h', name => ['jiu', 'tao'].includes(name)) && player.hp <= 2) return '回复一点体力';
								if (player.canMoveCard(true)) return '移动场上一张牌';
								return '回复一点体力';
							});
						}
						else {
							event._result = {
								bool: true,
								control: list[0],
								index: 0,
							}
						}
					}
					'step 2'
					if (result.control && result.control !== 'cancel2') {
						if (result.control === '回复一点体力') player.recover();
						else player.moveCard(true);
					}
				},
			},
		},
		ai: {
			maixie: true,
			"maixie_hp": true,
			result: {
				effect: function (card, player, target) {
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
						if (target.maxHp - target.countCards('h') >= 3) return [1, num * 2];
						if (target.maxHp - target.countCards('h') === 2) return [1, num * 1.5];
						if (target.maxHp - target.countCards('h') < 2) return [1, num * 0.5];
					}
				},
			},
			threaten: 0.6,
		},
	},
	PSbianzhen: {
		audio: "kuiwei",
		trigger: {
			player: "damageEnd",
		},
		forced: true,
		content() {
			let num = player.countCards('h'), num2 = player.maxHp;
			if (num <= num2) player.draw(num2);
			if (num >= num2) player.draw();
			if (player.isTurnedOver()) player.turnOver();
		},
	},
	PSrepaoxiao: {
		audio: 'paoxiao_re_zhangfei',
		firstDo: true,
		trigger: {
			player: ["useCard1", "useCard", "respond"],
		},
		forced: true,
		shaRelated: true,
		filter(event, player, name) {
			if (name === "useCard1") return !event.audioed && event.card.name == 'sha' && player.countUsed('sha', true) > 1 && event.getParent().type == 'phase';
			if (!event.cards.length || event.card.name !== 'sha' || event.cards.length && !['o', 'd'].includes(get.position(event.cards[0]))) return false;
			if (name === "respond") return player.getHistory('respond', evt => evt.card.name === 'sha').length === 1;
			return player.getHistory('useCard', evt => evt.card.name === 'sha').length === 1;
		},
		async content(event, trigger, player) {
			trigger.audioed = true;
			if (event.triggername === "useCard" && player.getHistory('useCard', evt => evt.card.name === 'sha').length === 1) {
				player.gain(trigger.cards, 'gain2');
			} else if (player.getHistory('respond', evt => evt.card.name === 'sha').length === 1) {
				player.gain(trigger.cards, 'gain2');
			}
		},
		mod: {
			cardUsable(card, player, num) {
				if (card.name == 'sha') return Infinity;
			},
			targetInRange: function (card, player, target) {
				if (card.name == 'sha' && player.getEquips(1).length > 0) return true;
			},
		},
		ai: {
			unequip: true,
			skillTagFilter(player, tag, arg) {
				if (!get.zhu(player, 'shouyue')) return false;
				if (arg && arg.name == 'sha') return true;
				return false;
			},
		},
		"_priority": 0,
	},
	PSliyong: {
		audio: 'liyong',
		trigger: {
			player: ["shaMiss", "useCardToPlayered"],
			source: "damageSource",
		},
		forced: true,
		direct: true,
		shaRelated: true,
		filter: function (event, player, name) {
			switch (name) {
				case "shaMiss":
					return true;
				case "useCardToPlayered":
					return event.card && get.name(event.card) === "sha";
				case "damageSource":
					return event.card && event.card.name == 'sha' && event.player != player && event.player.isIn() && event.player.isAlive();
			}
		},
		init(player, skill) {
			if (!player.storage[skill]) player.storage[skill] = [];
		},
		intro: {
			content: function (storage, player) {
				return storage.join('');
			},
			markcount: function (storage, player) {
				return storage.length;
			},
		},
		content: function () {
			switch (event.triggername) {
				case "shaMiss":
					player.getHistory('custom').push({ PSliyong_effect: true });
					break;
				case "useCardToPlayered":
					player.logSkill(event.name);
					player.markSkill(event.name);
					if (player.getHistory('useCard', evt => evt.card.name === "sha").length > 1) {
						player.storage[event.name].add('加伤！');
						var id = trigger.target.playerid;
						var map = trigger.getParent().customArgs;
						if (!map[id]) map[id] = {};
						if (typeof map[id].extraDamage != 'number') {
							map[id].extraDamage = 0;
						}
						map[id].extraDamage++;
					}
					if (player.hasHistory('custom', evt => evt.PSliyong_effect) && trigger.isFirstTarget) {
						player.storage[event.name].add('强命！');
						trigger.getParent().directHit.addArray(game.players);
					}
					break;
				case "damageSource":
					player.storage[event.name].add('铁骑！');
					trigger.player.addTempSkill('fengyin');
			}
		},
		group: 'PSliyong_draw',
		subSkill: {
			draw: {
				audio: 'liyong',
				trigger: {
					global: "phaseEnd",
				},
				filter: function (event, player, name) {
					return player.storage.PSliyong && player.storage.PSliyong.length > 0;
				},
				forced: true,
				content() {
					const num = player.storage.PSliyong.length;
					player.storage.PSliyong = [];
					player.unmarkSkill('PSliyong');
					player.draw(num);
				},
			},
		},
		ai: {
			ignoreSkill: true,
			"directHit_ai": true,
			skillTagFilter: function (player, tag, arg) {
				if (tag == 'directHit_ai') {
					return get.attitude(player, arg.target) <= 0;
				}
				if (!arg || arg.isLink || !arg.card || arg.card.name != 'sha') return false;
				if (!arg.target || get.attitude(player, arg.target) >= 0) return false;
				if (!arg.skill || !lib.skill[arg.skill] || lib.skill[arg.skill].charlotte || get.is.locked(arg.skill) || !arg.target.getSkills(true, false).includes(arg.skill)) return false;
			},
		},
	},
	PSreqianxun: {
		audio: "reqianxun",
		trigger: {
			target: "useCardToBegin",
			player: "judgeBefore",
		},
		filter: function (event, player) {
			if (player.countCards('h') == 0) return false;
			if (event.getParent().name == 'phaseJudge') {
				return true;
			}
			if (event.name == 'judge') return false;
			if (event.targets && event.targets.length > 1) return false;
			if (event.card && get.type(event.card) == 'trick' && event.player != player) return true;
		},
		content: function () {
			var cards = player.getCards('h');
			player.loseToSpecial(cards, 'PSreqianxun').visible = false;
			player.markSkill('PSreqianxun');
			// player.addToExpansion(cards, 'giveAuto', player).gaintag.add('PSreqianxun_storage');
			player.addSkill('PSreqianxun_gain');
		},
		marktext: "谦",
		intro: {
			mark: function (dialog, storage, player) {
				var content = player.getCards('s', function (card) {
					return card.hasGaintag('PSreqianxun');
				})
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						dialog.addAuto(content);
					}
					else {
						return '共有' + get.cnNumber(content.length) + '张牌';
					}
				}
			},
			markcount: function (storage, player) {
				return player.getCards('s', function (card) {
					return card.hasGaintag('PSreqianxun');
				}).length;
			},
			onunmark: function (storage, player) {
				var cards = player.getCards('s', function (card) {
					return card.hasGaintag('PSreqianxun');
				});
				if (cards.length) {
					player.lose(cards, ui.discardPile);
					player.$throw(cards, 1000);
					game.log(cards, '进入了弃牌堆');
				}
			},
		},
		ai: {
			effect: function (card, player, target) {
				if (!target.hasFriend()) return;
				if (player == target) return;
				var type = get.type(card);
				var nh = target.countCards();
				if (type == 'trick') {
					if (!get.tag(card, 'multitarget') || get.info(card).singleCard) {
						if (get.tag(card, 'damage')) {
							if (nh < 3 || target.hp <= 2) return 0.8;
						}
						return [1, nh];
					}
				}
				else if (type == 'delay') {
					return [0.5, 0.5];
				}
			},
		},
		"_priority": 0,
		subSkill: {
			gain: {
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				audio: false,
				content: function () {
					'step 0'
					var cards = player.getCards('s', function (card) {
						return card.hasGaintag('PSreqianxun');
					});
					if (cards.length) player.gain(cards, 'draw');
					'step 1'
					game.delay();
					player.unmarkSkill('PSreqianxun');
					player.removeSkill('PSreqianxun_gain');
				},
				"_priority": 0,
			},
		},
	},
	PSrelianying: {
		audio: "relianying",
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		direct: true,
		filter: function (event, player) {
			if (player.countCards('h')) return false;
			var evt = event.getl(player);
			return evt && evt.hs && evt.hs.length;
		},
		content: function () {
			"step 0"
			var num = trigger.getl(player).hs.length;
			player.chooseTarget(get.prompt('relianying'), '令至多' + get.cnNumber(num) + '名角色各摸一张牌', [1, num]).ai = function (target) {
				var player = _status.event.player;
				if (player == target) return get.attitude(player, target) + 10;
				return get.attitude(player, target);
			}
			"step 1"
			if (result.bool) {
				player.logSkill('PSrelianying', result.targets);
				game.asyncDraw(result.targets);
			}
			else event.finish();
			"step 2"
			game.delay();
		},
		ai: {
			threaten: 0.8,
			effect: {
				target: function (card) {
					if (card.name == 'guohe' || card.name == 'liuxinghuoyu') return 0.5;
				},
			},
			noh: true,
		},
		"_priority": 0,
		group: "PSrelianying_else",
		subSkill: {
			else: {
				trigger: {
					player: ["useCardEnd", "respondEnd"],
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseBool(`是否弃置${_status.currentPhase === player ? '' : get.translation(_status.currentPhase) + '的'}一张手牌，然后摸一张牌`).set('ai', function () { return 1 });
					'step 1'
					if (result.bool) {
						if (_status.currentPhase === player) {
							player.chooseToDiscard('h', true);
						} else {
							player.discardPlayerCard(_status.currentPhase, 'h', true);
						}
						player.draw();
					}
				},
			},
		},
	},
	PSxionghuo: {
		audio: 'xinfu_xionghuo',
		enable: "phaseUse",
		filter: function (event, player) {
			return player.countMark('PSxionghuo') > 0;
		},
		filterTarget: function (card, player, target) {
			return player != target;
		},
		content: function () {
			player.removeMark('PSxionghuo', 1);
			target.addMark('PSxionghuo', 1);
		},
		ai: {
			order: 11,
			result: {
				target: function (player, target) {
					if ((player.countMark('PSxionghuo') >= 2 || !game.hasPlayer(function (current) {
						return current != player && get.attitude(player, current) < 0 && current.hasMark('PSxionghuo');
					})) && player.countCards('h', function (card) {
						return get.tag(card, 'damage') && player.canUse(card, target, null, true)
							&& player.getUseValue(card) > 0 && get.effect_use(target, card, player) > 0
							&& target.hasSkillTag('filterDamage', null, {
								player: player,
								card: card,
							});
					})) return 3 / Math.max(1, target.hp);
					if ((!player.hasUnknown() && game.countPlayer(function (current) {
						return get.attitude(player, current) < 0;
					}) <= 1) || player.countMark('PSxionghuo') >= 2) {
						return -1;
					}
					return 0;
				},
			},
			effect: {
				player: function (card, player, target) {
					if (player != target && get.tag(card, 'damage') && target && target.hasMark('PSxionghuo') && !target.hasSkillTag('filterDamage', null, {
						player: player,
						card: card,
					})) return [1, 0, 1, -2];
				},
			},
			threaten: 1.6,
		},
		marktext: "戾",
		intro: {
			name: "暴戾",
			content: "mark",
		},
		group: ["PSxionghuo_init", "PSxionghuo_damage", "PSxionghuo_effect"],
		subSkill: {
			init: {
				audio: 'xinfu_xionghuo',
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter: function (event, player) {
					return event.name != 'phase' || game.phaseNumber == 0;
				},
				forced: true,
				locked: false,
				content: function () {
					player.addMark('PSxionghuo', 3);
				},
				sub: true,
				"_priority": 0,
			},
			damage: {
				audio: 'xinfu_xionghuo',
				trigger: {
					source: "damageBegin1",
				},
				filter: function (event, player) {
					return event.player.countMark('PSxionghuo') > 0 && event.player != player;
				},
				forced: true,
				locked: false,
				logTarget: "player",
				content: function () {
					trigger.num += trigger.player.countMark('PSxionghuo');
				},
				sub: true,
				"_priority": 0,
			},
			effect: {
				audio: 'xinfu_xionghuo',
				trigger: {
					global: "phaseUseBegin",
				},
				filter: function (event, player) {
					return event.player.countMark('PSxionghuo') > 0 && event.player != player;
				},
				line: false,
				forced: true,
				locked: false,
				logTarget: "player",
				content() {
					const num = trigger.player.countMark('PSxionghuo');
					trigger.player.removeMark('PSxionghuo', num);
					const arr = [0, 1, 2].randomGets(Math.min(num, 3));
					for (let i = 0; i < arr.length; i++) {
						switch (arr[i]) {
							case 0:
								player.line(trigger.player, 'fire');
								trigger.player.damage('fire');
								trigger.player.addTempSkill('PSxionghuo_disable');
								trigger.player.markAuto('PSxionghuo_disable', [player]);
								break;
							case 1:
								player.line(trigger.player, 'water');
								trigger.player.loseHp();
								trigger.player.addMark('PSxionghuo_low', 1, false);
								trigger.player.addTempSkill('PSxionghuo_low');
								break;
							case 2:
								player.line(trigger.player, 'green');
								var card1 = trigger.player.getCards('h').randomGet();
								var card2 = trigger.player.getCards('e').randomGet();
								var list = [];
								if (card1) list.push(card1);
								if (card2) list.push(card2);
								if (list.length) player.gain(list, trigger.player, 'giveAuto', 'bySelf');
								break;
						}
					}
					game.delay();
				},
				sub: true,
				"_priority": 0,
			},
			disable: {
				mod: {
					playerEnabled: function (card, player, target) {
						if (card.name == 'sha' && player.getStorage('PSxionghuo_disable').includes(target)) return false;
					},
				},
				charlotte: true,
				onremove: true,
				mark: true,
				marktext: "禁",
				intro: {
					content: "不能对$使用【杀】",
				},
				sub: true,
				"_priority": 0,
			},
			low: {
				mod: {
					maxHandcard: function (player, num) {
						return num - player.countMark('PSxionghuo_low');
					},
				},
				charlotte: true,
				onremove: true,
				mark: true,
				marktext: "减",
				intro: {
					content: "手牌上限-#",
				},
				sub: true,
				"_priority": 0,
			},
		},
		"_priority": 0,
	},
	PSshajue: {
		audio: "xinfu_shajue",
		trigger: {
			global: "dying",
		},
		filter: function (event, player) {
			return event.player != player;
		},
		forced: true,
		content: function () {
			player.addMark('PSxionghuo', 1);
			//player.markSkill('PSxionghuo');
			if (trigger.player.hp < 0 && get.itemtype(trigger.parent.cards) == 'cards' && get.position(trigger.parent.cards[0], true) == 'o') {
				player.gain(trigger.parent.cards, 'gain2');
			}
		},
		"_priority": 0,
	},
	PStunchu: {
		audio: "tunchu",
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter: function (event, player) {
			return (event.name != 'phase' || game.phaseNumber == 0);
		},
		onremove: function (player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
		},
		intro: {
			markcount: "expansion",
			content: "expansion",
			/* mark: function (dialog, content, player) {
				var content = player.getExpansions('olxinggu');
				if (content && content.length) {
				if (player == game.me || player.isUnderControl()) {
					dialog.addAuto(content);
				} else {
					return '剩余' + get.cnNumber(content.length) + '张粮';
				}
				}
			}, */
		},
		content: function () {
			'step 0'
			player.draw(2);
			var hs = player.getCards('h');
			if (hs.length) {
				if (hs.length <= 2) event._result = { bool: true, cards: hs };
				else player.chooseCard('h', 2, true, '选择两张手牌作为“粮”').set('ai', function (card) {
					return 5 - get.value(card);
				});
			}
			'step 1'
			if (result.bool && result.cards && result.cards.length) {
				player.addToExpansion(result.cards, player, 'giveAuto').gaintag.add('PStunchu');
			}
		},
		ai: {
			threaten: 3,
		},
		group: ["PStunchu_draw", "PStunchu_choose"],
		subSkill: {
			draw: {
				audio: "tunchu",
				trigger: {
					player: "phaseDrawBegin2",
				},
				forced: true,
				preHidden: true,
				filter: function (event, player) {
					return !event.numFixed && player.getExpansions('PStunchu').length;
				},
				content: function () {
					trigger.num += player.getExpansions('PStunchu').length;
				},
				mod: {
					maxHandcard: function (player, num) {
						return num + player.getExpansions('PStunchu').length;
					},
				},
				sub: true,
			},
			choose: {
				audio: "tunchu",
				trigger: {
					player: "phaseDrawEnd",
				},
				forced: true,
				popup: false,
				filter: function (event, player) {
					return player.getExpansions('PStunchu').length <= Math.min(player.maxHp, 3) && player.countCards('h');
				},
				content: function () {
					'step 0'
					const num = Math.min(player.maxHp, 3);
					player.chooseCard('h', [1, num], false, `屯储：是否选择至多${get.cnNumber(num)}张手牌作为“粮”`).set('ai', function (card) {
						return 5 - get.value(card);
					});
					'step 1'
					if (result.bool && result.cards && result.cards.length) {
						player.addToExpansion(result.cards, player, 'giveAuto').gaintag.add('PStunchu');
					}
				},
				sub: true,
			},
		},
	},
	PSshuliang: {
		audio: "shuliang",
		trigger: {
			global: "phaseJieshuBegin",
		},
		direct: true,
		filter: function (event, player) {
			return player.getExpansions('PStunchu').length > 0 && event.player.countCards('h') < event.player.getHandcardLimit() && event.player.isIn();
		},
		content: function () {
			'step 0'
			var goon = (get.attitude(player, trigger.player) > 0);
			player.chooseCardButton(get.prompt('PSshuliang', trigger.player), player.getExpansions('PStunchu')).set('ai', function () {
				if (_status.event.goon) return 1;
				return 0;
			}).set('goon', goon);
			'step 1'
			if (result.bool) {
				player.logSkill('PSshuliang', trigger.player);
				player.loseToDiscardpile(result.links);
				trigger.player.draw(2);
			}
		},
		ai: {
			combo: "PStunchu",
		},
		"_priority": 0,
	},
	PSqingbei: {
		audio: "qingbei",
		trigger: {
			global: "roundStart",
		},
		direct: true,
		content: function () {
			'step 0'
			var next = player.chooseButton(['###擎北：是否选择任意种花色？###<div class="text center">本轮你使用牌后，若此牌的花色与你以此法选择花色均不相同，你摸X张牌，否则你须弃置X张牌（X为你本轮以此法选择的花色数）</div>', [lib.suit.map(i => ['', '', 'lukai_' + i]), 'vcard']], [1, 4]);
			next.set('ai', button => {
				var player = _status.event.player;
				var suit = button.link[2].slice(6);
				var val = player.getCards('hs', { suit: suit }).map(card => {
					return get.value(card) + player.getUseValue(card) / 3;
				}).reduce((p, c) => {
					return p + c;
				}, 0);
				if (val > 10 && ui.selected.buttons.length > 0) return -1;
				if (val > 6 && ui.selected.buttons.length == 2) return -1;
				if (ui.selected.buttons.length == 3) return -1;
				return 1 + 1 / val;
			});
			'step 1'
			if (result.bool) {
				var suits = result.links.map(i => i[2].slice(6));
				player.logSkill('PSqingbei');
				player.addTempSkill('PSqingbei_effect', 'roundStart');
				player.setStorage('PSqingbei_effect', suits);
				player.markSkill('PSqingbei_effect');
			}
		},
		ai: {
			threaten: 2.3,
		},
		subSkill: {
			effect: {
				audio: "qingbei",
				trigger: {
					player: "useCardAfter",
				},
				charlotte: true,
				onremove: true,
				forced: true,
				filter: function (event, player) {
					// if (!lib.suit.includes(get.suit(event.card))) return false;
					return player.getStorage('PSqingbei_effect').length;
				},
				content: function () {
					const suit = get.suit(trigger.card);
					if (player.getStorage('PSqingbei_effect').includes(suit)) player.chooseToDiscard('hes', true, player.getStorage('PSqingbei_effect').length);
					else player.draw(player.getStorage('PSqingbei_effect').length);
				},
				mark: true,
				intro: {
					content: (storage) => `本轮内使用非${get.translation(storage)}花色的牌后，摸${get.cnNumber(storage.length)}张牌；<br>使用${get.translation(storage)}花色的牌后，弃置${get.cnNumber(storage.length)}张牌。`,
				},
				ai: {
					effect: {
						player: function (card, player, target) {
							const num = player.getStorage('PSqingbei_effect').length;
							if (player.getStorage('PSqingbei_effect').includes(get.suit(card))) return [1, -num];
							else return [1, num];
						},
					},
				},
				sub: true,
				"_priority": 0,
			},
		},
		"_priority": 0,
	},
	PShunzi: {
		audio: "rehunzi",
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter: function (event, player) {
			return !player.storage.PShunzi;
		},
		skillAnimation: true,
		animationColor: "wood",
		juexingji: true,
		derivation: ["reyingzi", "gzyinghun", "PSduwu", "PSchoushang", "PShuaiji", "PSchanhuo"],
		unique: true,
		forced: true,
		content: function () {
			player.gainMaxHp();
			player.addSkills('reyingzi');
			player.addSkills('gzyinghun');
			player.addSkills('PSduwu');
			// game.log(player, '获得了技能', '#g【英姿】【英魂】【崩勇】');
			player.awakenSkill(event.name);
			player.storage[event.name] = true;
		},
		"_priority": 1,
	},
	PSduwu: {
		audio: "rehunzi",
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter: function (event, player) {
			return !player.storage.PSduwu && !player.getHistory('useSkill', evt => evt.skill === 'PShunzi').length;
		},
		skillAnimation: true,
		animationColor: "wood",
		juexingji: true,
		derivation: ["dushi", "yaowu", "PSchoushang"],
		unique: true,
		forced: true,
		content: function () {
			player.gainMaxHp();
			player.addSkills('dushi');
			player.addSkills('yaowu');
			player.addSkills('PSchoushang');
			player.awakenSkill(event.name);
			player.storage[event.name] = true;
		},
		"_priority": 1,
	},
	PSchoushang: {
		audio: "rehunzi",
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter: function (event, player) {
			return !player.storage.PSchoushang && !player.getHistory('useSkill', evt => evt.skill === 'PSduwu').length;
		},
		skillAnimation: true,
		animationColor: "wood",
		juexingji: true,
		derivation: ["chouhai", "ranshang", "PShuaiji"],
		unique: true,
		forced: true,
		content: function () {
			player.gainMaxHp();
			player.addSkills('chouhai');
			player.addSkills('ranshang');
			player.addSkills('PShuaiji');
			player.awakenSkill(event.name);
			player.storage[event.name] = true;
		},
		"_priority": 1,
	},
	PShuaiji: {
		audio: "rehunzi",
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter: function (event, player) {
			return !player.storage.PShuaiji && !player.getHistory('useSkill', evt => evt.skill === 'PSchoushang').length;
		},
		skillAnimation: true,
		animationColor: "wood",
		juexingji: true,
		derivation: ["benghuai", "tongji", "PSchanhuo"],
		unique: true,
		forced: true,
		content: function () {
			player.gainMaxHp();
			player.addSkills('benghuai');
			player.addSkills('tongji');
			player.addSkills('PSchanhuo');
			player.awakenSkill(event.name);
			player.storage[event.name] = true;
		},
		"_priority": 1,
	},
	PSchanhuo: {
		audio: "rehunzi",
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter: function (event, player) {
			return !player.storage.PSchanhuo && !player.getHistory('useSkill', evt => evt.skill === 'PShuaiji').length;
		},
		skillAnimation: true,
		animationColor: "wood",
		juexingji: true,
		derivation: ["chanyuan", "lianhuo"],
		unique: true,
		forced: true,
		content: function () {
			player.gainMaxHp();
			player.addSkills('chanyuan');
			player.addSkills('lianhuo');
			player.awakenSkill(event.name);
			player.storage[event.name] = true;
		},
		"_priority": 1,
	},
	PSlongwei: {
		audio: "chongzhen",
		trigger: {
			player: "useCardToPlayer",
			target: "useCardToTarget",
		},
		filter: function (event, player, name) {
			const target = name === "useCardToPlayer" ? event.target : event.player;
			return event.card.name == 'sha' && target && target.countDiscardableCards(player, 'he') > 0;
		},
		shaRelated: true,
		logTarget: function (event, player) {
			return event.name === "useCardToPlayer" ? event.target : event.player;
		},
		content: function () {
			'step 0'
			const target = event.triggername === "useCardToPlayer" ? trigger.target : trigger.player;
			player.discardPlayerCard(target, 1, 'he', true);
			'step 1'
			if (result.bool && result.cards && result.cards.length && get.color(trigger.card) === get.color(result.cards[0]) && ['o', 'd'].includes(get.position(result.cards[0]))) {
				player.gain(result.cards, 'gain2');
			}
		},
		ai: {
			effect: {
				player: function (card, player, target) {
					if (get.name(card) === 'sha') {
						if (target.countDiscardableCards(player, 'he') > 0) return [1, 1.75];
						return [1, 1];
					}
				},
				target: function (card, player, target) {
					if (get.name(card) === 'sha') {
						if (player.countDiscardableCards(target, 'he') > 0) return [1, -0.5];
						return [1, 1];
					}
				},
			},
		}
	},
	PSqiangshu: {
		audio: "ollongdan",
		enable: ["chooseToUse", "chooseToRespond"],
		usable: 1,
		viewAs: {
			name: "sha",
			storage: {
				PSqiangshu: true,
			},
		},
		filterCard: true,
		position: "hes",
		filter: function (event, player) {
			return player.countCards('hes');
		},
		check: function (card) {
			return 6 - get.value(card) && get.cardNameLength(card) > 1;
		},
		precontent: function () {
			event.getParent().addCount = false;
		},
		mod: {
			targetInRange: function (card) {
				if (card.storage && card.storage.PSqiangshu) return true;
			},
			selectTarget: function (card, player, range) {
				if (card.name == 'sha' && card.storage && card.storage.PSqiangshu && range[1] != -1) {
					try {
						range[1] = get.cardNameLength(card.cards.length ? card.cards[0] : card);
					} catch (e) {
						range[1] = lib.translate[(card.cards.length ? card.cards[0] : card).name].length;
					}
				}
			},
		},
		ai: {
			order: () => get.order({ name: 'sha' }) + 0.2,
			result: {
				player: 1,
				target: function (player, target, card, isLink) {
					let eff = -1.5, odds = 1.35, num = 1;
					if (isLink) {
						let cache = _status.event.getTempCache('sha_result', 'eff');
						if (typeof cache !== 'object' || cache.card !== get.translation(card)) return eff;
						if (cache.odds < 1.35 && cache.bool) return 1.35 * cache.eff;
						return cache.odds * cache.eff;
					}
					if (player.hasSkill('jiu') || player.hasSkillTag('damageBonus', true, {
						target: target,
						card: card
					})) {
						if (target.hasSkillTag('filterDamage', null, {
							player: player,
							card: card,
							jiu: true,
						})) eff = -0.5;
						else {
							num = 2;
							if (get.attitude(player, target) > 0) eff = -7;
							else eff = -4;
						}
					}
					if (!player.hasSkillTag('directHit_ai', true, {
						target: target,
						card: card,
					}, true)) odds -= 0.7 * target.mayHaveShan(player, 'use', target.getCards(i => {
						return i.hasGaintag('sha_notshan');
					}), 'odds');
					_status.event.putTempCache('sha_result', 'eff', {
						bool: target.hp > num && get.attitude(player, target) > 0,
						card: get.translation(card),
						eff: eff,
						odds: odds
					});
					return odds * eff;
				},
			},
			yingbian: function (card, player, targets, viewer) {
				if (get.attitude(viewer, player) <= 0) return 0;
				var base = 0, hit = false;
				if (get.cardtag(card, 'yingbian_hit')) {
					hit = true;
					if (targets.some(target => {
						return target.mayHaveShan(viewer, 'use', target.getCards(i => {
							return i.hasGaintag('sha_notshan');
						})) && get.attitude(viewer, target) < 0 && get.damageEffect(target, player, viewer, get.natureList(card)) > 0;
					})) base += 5;
				}
				if (get.cardtag(card, 'yingbian_add')) {
					if (game.hasPlayer(function (current) {
						return !targets.includes(current) && lib.filter.targetEnabled2(card, player, current) && get.effect(current, card, player, player) > 0;
					})) base += 5;
				}
				if (get.cardtag(card, 'yingbian_damage')) {
					if (targets.some(target => {
						return get.attitude(player, target) < 0 && (hit || !target.mayHaveShan(viewer, 'use', target.getCards(i => {
							return i.hasGaintag('sha_notshan');
						})) || player.hasSkillTag('directHit_ai', true, {
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
				if (player.hasSkill('jueqing') || player.hasSkill('gangzhi') || target.hasSkill('gangzhi')) return false;
				return true;
			},
			basic: {
				useful: [5, 3, 1],
				value: [5, 3, 1],
			},
			tag: {
				respond: 1,
				respondShan: 1,
				damage: function (card) {
					if (game.hasNature(card, 'poison')) return;
					return 1;
				},
				natureDamage: function (card) {
					if (game.hasNature(card, 'linked')) return 1;
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
		"_priority": 0,
	},
	PSdangkou: {
		audio: "dcqiaomeng",
		enable: "phaseUse",
		filter: function (event, player) {
			return player.countCards('hes') > 0 && !player.hasSkill('PSdangkou_used');
		},
		async content(event, trigger, player) {
			const { control } = await player.chooseControl(['失去体力', '回复体力', 'cancel2']).set('ai', function () {
				if (player.hp > player.getDamagedHp()) return '失去体力';
				else return '回复体力';
			}).set('prompt', lib.translate.PSdangkou_info).forResult();
			if (control === 'cancel2') {
				return;
			}
			player.addTempSkill('PSdangkou_used');
			if (control === '失去体力') {
				await player.loseHp();
				await player.gainMaxHp();
				await player.chooseUseTarget('sha', '是否使用一张【杀】？', false);
			} else {
				await player.recover();
				await player.loseMaxHp();
				await player.draw(2);
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				forced: true,
				popup: false
			}
		},
		ai: {
			order: 8,
			result: {
				player: 1,
			},
		},
		"_priority": 0,
	},
	PSbaima: {
		audio: "reyicong",
		trigger: {
			player: "changeHp",
		},
		forced: true,
		locked: true,
		content() { },
		mod: {
			globalFrom: function (from, to, current) {
				return current - Math.max(from.hp, 1);
			},
			globalTo: function (from, to, current) {
				return current + Math.max(to.getDamagedHp(), 1);
			},
		},
		ai: {
			threaten: 0.8,
		},
		"_priority": 0,
	},
	PSluoyi: {
		enable: "phaseUse",
		audio: "luoyi",
		usable: 2,
		viewAsFilter: function (player) {
			return [1, 2, 3, 4, 5].some(ele => player.hasEnabledSlot(ele));;
		},
		viewAs: {
			name: "juedou",
			isCard: true,
		},
		filterCard: () => false,
		selectCard: -1,
		// log: false,
		precontent: function () {
			'step 0'
			player.chooseToDisable().set('ai', function (event, player, list) {
				if (list.includes('equip5')) return 'equip5';
				return list.randomGet();
			});
			'step 1'
			player.when({ source: 'damageBegin2', player: "useCardEnd" }).filter(evt => {
				if (evt.name == "useCard") return true;
				return evt.getParent().skill === 'PSluoyi' && player.countCards('e') <= evt.player.countCards('e');
			}).then(() => {
				if (event.triggername === "useCardEnd") return;
				trigger.num++;
			});
		},
		ai: {
			order: function () {
				return get.order({ name: 'juedou' }) - 0.5;
			},
			wuxie: function (target, card, player, viewer, status) {
				if (player === game.me && get.attitude(viewer, player._trueMe || player) > 0) return 0;
				if (status * get.attitude(viewer, target) * get.effect(target, card, player, target) >= 0) return 0;
			},
			basic: {
				order: 5,
				useful: 1,
				value: 5.5,
			},
			result: {
				target: -1.5,
				player: function (player, target, card) {
					if (player.hasSkillTag('directHit_ai', true, {
						target: target,
						card: card,
					}, true)) {
						return 0;
					}
					if (get.damageEffect(target, player, target) > 0 && get.attitude(player, target) > 0 && get.attitude(target, player) > 0) {
						return 0;
					}
					var hs1 = target.getCards('h', 'sha');
					var hs2 = player.getCards('h', 'sha');
					if (hs1.length > hs2.length + 1) {
						return -2;
					}
					var hsx = target.getCards('h');
					if (hsx.length > 2 && hs2.length == 0 && hsx[0].number < 6) {
						return -2;
					}
					if (hsx.length > 3 && hs2.length == 0) {
						return -2;
					}
					if (hs1.length > hs2.length && (!hs2.length || hs1[0].number > hs2[0].number)) {
						return -2;
					}
					return -0.5;
				},
			},
			tag: {
				respond: 2,
				respondSha: 2,
				damage: 1,
			},
		},
	},
	PShanzhan: {
		audio: "reluoyi",
		trigger: {
			global: "dying",
		},
		usable: 1,
		check: () => true,
		async content(event, trigger, player) {
			if (player.countDiscardableCards(player, 'hes') > 0) {
				const { result } = await player.chooseToDiscard([1, 2], 'hes', '是否弃置至多两张牌，恢复等量的装备栏？', false).set('ai', get.disvalue);
				if (result.cards && result.cards.length) {
					const num = result.cards.length;
					if (num >= player.countDisabledSlot()) {
						for (let i = 1; i <= 5; i++) {
							let type = 'equip' + i;
							let number = player.disabledSlots[type];
							if (typeof number === 'number' && number !== 0) {
								for (let j = 0; j < number; j++) {
									await player.enableEquip(i);
								}
							}
						}
						player.enableEquip(result.control);
					} else {
						for (let i = 0; i < num; i++) {
							await player.chooseToEnable();
						}
					}
				}
			}
			player.drawTo(4);
		}
	},
	PSlingbao: {
		audio: "starweilin",
		trigger: {
			player: "useCard",
		},
		check: function (event, player) {
			return get.value(event.card) > 4;
		},
		prompt2: function (event, player) {
			return `令${get.translation(event.card)}额外结算一次`;
		},
		filter: function (event, player) {
			if (!['club', 'spade'].includes(get.suit(event.card))) return false;
			var evt = player.getLastUsed(1);
			if (!evt || !evt.card) return false;
			if (!player.isPhaseUsing()) return false;
			var evt2 = evt.getParent('phaseUse');
			if (!evt2 || evt2.name != 'phaseUse' || evt2.player != player) return false;
			return get.suit(evt.card) === get.suit(event.card);
		},
		usable: 1,
		content() {
			trigger.effectCount++;
		},
	},
	PSjiuchi: {
		mod: {
			cardUsable: function (card, player, num) {
				if (card.name == 'jiu') return Infinity;
			},
		},
		audio: "oljiuchi",
		enable: "chooseToUse",
		filterCard: function (card) {
			return get.suit(card) == 'spade';
		},
		viewAs: {
			name: "jiu",
		},
		position: "hes",
		viewAsFilter: function (player) {
			return player.hasCard(card => get.suit(card) == 'spade', 'hs');
		},
		prompt: "将一张黑桃牌当酒使用",
		check: function (cardx, player) {
			if (player && player == cardx.player) return true;
			if (_status.event.type == 'dying') return 1;
			var player = _status.event.player;
			var shas = player.getCards('hs', function (card) {
				return card != cardx && get.name(card, player) == 'sha';
			});
			if (!shas.length) return -1;
			if (shas.length > 1 && (player.getCardUsable('sha') > 1 || player.countCards('hs', 'zhuge'))) {
				return 0;
			}
			shas.sort(function (a, b) {
				return get.order(b) - get.order(a);
			});
			var card = false;
			if (shas.length) {
				for (var i = 0; i < shas.length; i++) {
					if (shas[i] != cardx && lib.filter.filterCard(shas[i], player)) {
						card = shas[i]; break;
					}
				}
			}
			if (card) {
				if (game.hasPlayer(function (current) {
					return (get.attitude(player, current) < 0 &&
						!current.hasShan()
						&& current.hp + current.countCards('h', { name: ['tao', 'jiu'] }) > 1 + (player.storage.jiu || 0)
						&& player.canUse(card, current, true, true) &&
						!current.hasSkillTag('filterDamage', null, {
							player: player,
							card: card,
							jiu: true,
						}) &&
						get.effect(current, card, player) > 0);
				})) {
					return 4 - get.value(cardx);
				}
			}
			return -1;
		},
		ai: {
			threaten: 1.5,
			basic: {
				useful: (card, i) => {
					if (_status.event.player.hp > 1) {
						if (i === 0) return 4;
						return 1;
					}
					if (i === 0) return 7.3;
					return 3;
				},
				value: (card, player, i) => {
					if (player.hp > 1) {
						if (i === 0) return 5;
						return 1;
					}
					if (i === 0) return 7.3;
					return 3;
				},
			},
			order: () => {
				if (_status.event.dying) return 9;
				let sha = get.order({ name: 'sha' });
				if (sha > 0) return sha + 0.2;
				return 0;
			},
			result: {
				target: (player, target, card) => {
					if (target && target.isDying()) return 2;
					if (!target || target._jiu_temp || !target.isPhaseUsing()) return 0;
					let usable = target.getCardUsable('sha');
					if (!usable || lib.config.mode === 'stone' && !player.isMin() && player.getActCount() + 1 >= player.actcount || !target.mayHaveSha(player, 'use', card)) return 0;
					let effs = { order: 0 }, temp;
					target.getCards('hs', i => {
						if (get.name(i) !== 'sha' || ui.selected.cards.includes(i)) return false;
						temp = get.order(i, target);
						if (temp < effs.order) return false;
						if (temp > effs.order) effs = { order: temp };
						effs[i.cardid] = {
							card: i,
							target: null,
							eff: 0
						};
					});
					delete effs.order;
					for (let i in effs) {
						if (!lib.filter.filterCard(effs[i].card, target)) continue;
						game.filterPlayer(current => {
							if (get.attitude(target, current) >= 0 || !target.canUse(effs[i].card, current, null, true) || current.hasSkillTag('filterDamage', null, {
								player: target,
								card: effs[i].card,
								jiu: true
							})) return false;
							temp = get.effect(current, effs[i].card, target, player);
							if (temp <= effs[i].eff) return false;
							effs[i].target = current;
							effs[i].eff = temp;
							return false;
						});
						if (!effs[i].target) continue;
						if (target.hasSkillTag('directHit_ai', true, {
							target: effs[i].target,
							card: i
						}, true) || usable === 1 && (target.needsToDiscard() > Math.max(0, 3 - target.hp) || !effs[i].target.mayHaveShan(player, 'use', effs[i].target.getCards(i => {
							return i.hasGaintag('sha_notshan');
						})))) {
							delete target._jiu_temp;
							return 1;
						}
					}
					delete target._jiu_temp;
					return 0;
				},
			},
			tag: {
				save: 1,
				recover: 0.1,
			},
		},
		"_priority": 0,
	},
	PSzongyu: {
		audio: "roulin",
		trigger: {
			global: "damageEnd",
		},
		forced: true,
		filter: function (event, player) {
			return event.player.isIn() && event.player !== player && event.player.sex === 'female' && event.player.countCards('he');
		},
		logTarget: "player",
		content: function () {
			player.gainPlayerCard(trigger.player, 1, 'he', true);
		},
		group: "PSzongyu_lose",
		subSkill: {
			lose: {
				audio: "benghuai",
				trigger: {
					player: "phaseJieshuBegin",
				},
				forced: true,
				filter: function (event, player) {
					return game.hasPlayer(function (current) {
						return current.sex === 'female';
					});
				},
				content() {
					"step 0"
					player.chooseControl('baonue_hp', 'baonue_maxHp', function (event, player) {
						if (player.hp == player.maxHp) return 'baonue_hp';
						if (player.hp < player.maxHp - 1 || player.hp <= 2) return 'baonue_maxHp';
						return 'baonue_hp';
					}).set('prompt', '纵欲：失去1点体力或减1点体力上限');
					"step 1"
					if (result.control == 'baonue_hp') {
						player.loseHp();
					}
					else {
						player.loseMaxHp(true);
					}
				},
			},
		},
	},
	PSxujin: {
		getUseNumber: function (player) {
			// player.markSkill('PSxujin');
			const num = player.storage.PSxujin || 0;
			return game.getGlobalHistory('useCard').length - num;
		},
		getSuitNumber: function (show) {
			const suits = [];
			game.getGlobalHistory('useCard', evt => {
				if (lib.suit.includes(get.suit(evt.card))) suits.add(get.suit(evt.card));
			});
			if (show) return get.translation(suits);
			return suits.length;
		},
		mod: {
			targetInRange: function (card, player, target) {
				if (card.name == 'sha' && lib.skill.PSxujin.getUseNumber(player) >= 1) return true;
			},
		},
		mark: true,
		intro: {
			content: function (storage, player) {
				let str = '<li>本回合已使用花色：';
				str += lib.skill.PSxujin.getSuitNumber(true);
				str += '<br><li>本回合已使用花色数：';
				str += lib.skill.PSxujin.getSuitNumber();
				str += '<br><li>本回合“蓄劲”计数：';
				str += lib.skill.PSxujin.getUseNumber(player);
				return str;
			},
			markcount: function (storage, player) {
				if (player.storage.PSxujin) return game.getGlobalHistory('useCard').length - player.storage.PSxujin;
				return game.getGlobalHistory('useCard').length;
			}
		},
		audio: "xinliegong",
		trigger: {
			player: "useCardToPlayered",
			global: ["phaseEnd", "useCard"],
		},
		forced: true,
		lastDo: true,
		filter: function (event, player, name) {
			if (name === 'phaseEnd' || name === 'useCard') {
				player.markSkill('PSxujin');
				if (name === 'phaseEnd') delete player.storage.PSxujin;
				return false;
			}
			return get.name(event.card) === 'sha' && lib.skill.PSxujin.getUseNumber(player) >= 2;
		},
		content: function () {
			trigger.getParent().directHit.addArray(game.players);
			game.log(trigger.card, '不可被响应');
			player.when({ source: 'damageBegin2' })
				.filter(evt => {
					return evt.getParent(2) === trigger.getParent() && lib.skill.PSxujin.getUseNumber(player) >= 3 && evt.card === trigger.card;
				})
				.then(() => {
					trigger.num += lib.skill.PSxujin.getSuitNumber() - 1;
					game.log(trigger.card, '造成伤害+', lib.skill.PSxujin.getSuitNumber());
				});
			player.when('useCardAfter')
				.filter(evt => {
					return get.name(evt.card) === 'sha' && lib.skill.PSxujin.getUseNumber(player) >= 4;
				})
				.then(() => {
					player.drawTo(player.maxHp);
					player.storage.PSxujin = lib.skill.PSxujin.getUseNumber(player);
				});
		},
		ai: {
			"directHit_ai": true,
			skillTagFilter: function (player, tag, arg) {
				if (!arg || !arg.card || !arg.target || arg.card.name != 'sha' && lib.skill.PSxujin.getUseNumber(player) >= 2) return false;
				return true;
			},
		},
		sub: true,
		"_priority": 0,
	},
	PSrenjie: {
		mod: {
			aiOrder: (player, card, num) => {
				if (num <= 0 || typeof card !== 'object' || !player.isPhaseUsing()) return num;
				if (lib.skill.PSrenjie.derivation.filter(skill => !player.hasSkill(skill)).length /* && player.getUseValue(card) < Math.min(4, player.hp * player.hp / 4) */) return 0;
			},
		},
		audio: "renjie2",
		trigger: {
			player: ["damageEnd", "loseAfter"],
			global: "loseAsyncAfter",
		},
		init(player, skill) {
			game.changeSkillAudio('reguicai', player.name, 'jilue_guicai');
			game.changeSkillAudio('PSfangzhu', player.name, 'jilue_fangzhu');
			game.changeSkillAudio('PSjizhi', player.name, 'jilue_jizhi');
			game.changeSkillAudio('PSzhiheng', player.name, 'jilue_zhiheng');
			game.changeSkillAudio('PSwansha', player.name, 'wansha_shen_simayi');
		},
		derivation: ["reguicai", "PSfangzhu", "PSjizhi", "PSzhiheng", "PSwansha"],
		forced: true,
		notemp: true,
		filter(event, player, name) {
			if (!lib.skill.PSrenjie.derivation.filter(skill => !player.hasSkill(skill)).length) return false;
			if (name === "damageEnd") return event.num > 0;
			else {
				if (event.type != 'discard' || event.getlx === false) return false;
				var evt = event.getParent('phaseDiscard'), evt2 = event.getl(player);
				return evt && evt2 && evt.name == 'phaseDiscard' && evt.player == player && evt2.cards2 && evt2.cards2.length > 0;
			}
		},
		async content(event, trigger, player) {
			/**
			 * 旧写法
			 */
			/* if (!lib.skill.PSrenjie.derivation.filter(skill => !player.hasSkill(skill)).length) return;
			if (player.storage.PSrenjie === void 0) player.storage.PSrenjie = event.triggername === "damageEnd" ? trigger.num : trigger.getl(player).cards2.length;
			const skills = lib.skill.PSrenjie.derivation.filter(skill => !player.hasSkill(skill));
			const choiceList = skills.map(skill => get.translation(skill) + '：' + get.translation(skill + '_info'));
			const { result: { control } } = await player.chooseControl(skills)
				.set('prompt', '忍戒：选择获得一个技能')
				.set('choiceList', choiceList).set('displayIndex', false).set('ai', () => get.event('controls').randomGet());
			await player.addSkills(control);
			player.storage.PSrenjie--;
			if (player.storage.PSrenjie > 0) {
				await lib.skill.PSrenjie.content(event, trigger, player);
			}
			player.storage.PSrenjie === 0 && delete player.storage.PSrenjie; */

			const num = event.triggername === "damageEnd" ? trigger.num : trigger.getl(player).cards2.length;
			const skills = lib.skill.PSrenjie.derivation.filter(skill => !player.hasSkill(skill));
			if (num >= skills.length) {
				player.addSkills(skills);
				return;
			};
			const choiceList = skills.map((skill, i) => [i, get.translation(skill) + '：' + get.translation(skill + '_info')]);
			const { result: { links } } = await player.chooseButton([
				`忍戒：请选择获得${get.cnNumber(num)}个技能`, [choiceList, 'textbutton']
			])
				.set('dialog', event.videoId)
				.set('forced', true)
				.set('selectButton', num)
				.set('ai', function (button) {
					return 1 + Math.random();
				});
			player.addSkills(links.map(i => {
				player.popup(skills[i]);
				return skills[i];
			}));
		},
		intro: {
			"name2": "忍",
			content: "mark",
		},
		ai: {
			maixie: true,
			"maixie_hp": true,
			effect: {
				/* target: function (card, player, target) {
					if (get.tag(card, 'damage') && !target.hasSkill('oltiaoxin', null, null, false)) {
					if (!target.hasFriend()) return;
					if (target.hp >= 4) return [0, 1];
					}
				}, */
				target(card, player, target) {
					if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
					if (get.tag(card, 'damage')) {
						if (target.hp == target.maxHp) {
							if (!target.hasSkill('PSjilue')) {
								return [0, 1];
							}
							return [0.7, 1];
						}
						return 0.7;
					}
				},
			},
		},
		"_priority": 0,
	},
	PSbaiyin: {
		skillAnimation: "epic",
		animationColor: "thunder",
		juexingji: true,
		trigger: {
			player: "changeSkillsAfter",
		},
		forced: true,
		unique: true,
		audio: "sbaiyin",
		derivation: "lianpo",
		filter(event, player) {
			return lib.skill.PSrenjie.derivation.every(skill => player.hasSkill(skill)) && event.getParent(2).skill === 'PSrenjie';
		},
		async content(event, trigger, player) {
			player.awakenSkill('PSbaiyin');
			player.loseMaxHp();
			await player.removeSkills('PSrenjie');
			await player.addSkills('lianpo');
		},
		"_priority": 0,
		ai: {
			combo: "PSrenjie",
		},
	},
	PSshuangjia: {
		audio: "dcshuangjia",
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "gainBegin"],
		},
		forced: true,
		filter: function (event, player) {
			return (event.name !== 'phase' || game.phaseNumber === 0) && event.getParent(2).skill != 'dcbeifen';
		},
		content: function () {
			if (event.triggername !== "gainBegin") {
				var cards = player.getCards('h');
				player.addGaintag(cards, 'dcshuangjia_tag');
			} else {
				trigger.gaintag.add('dcshuangjia_tag');
			}
		},
		sub: true,
		onremove: function (player) {
			player.removeGaintag("dcshuangjia_tag");
		},
		mod: {
			ignoredHandcard: function (card, player) {
				if (card.hasGaintag('dcshuangjia_tag')) {
					return true;
				}
			},
			cardDiscardable: function (card, player, name) {
				if (name == 'phaseDiscard' && card.hasGaintag('dcshuangjia_tag')) {
					return false;
				}
			},
			globalTo: function (from, to, distance) {
				return distance + Math.min(5, to.countCards('h', card => card.hasGaintag('dcshuangjia_tag')));
			},
		},
		"_priority": 0,
	},
	PSfangzhu: {
		mod: {
			targetEnabled(card, player, target, now) {
				if (target.isTurnedOver() !== player.isTurnedOver() && _status.currentPhase === player) return false;
			},
		},
		audio: "refangzhu",
		trigger: {
			player: "damageEnd",
		},
		direct: true,
		content: function () {
			"step 0"
			player.chooseTarget(get.prompt2('PSfangzhu'), function (card, player, target) {
				return true;
			}).ai = function (target) {
				if (target.hasSkillTag('noturn')) return 0;
				var player = _status.event.player;
				if (get.attitude(_status.event.player, target) == 0) return 0;
				if (get.attitude(_status.event.player, target) > 0) {
					if (target.classList.contains('turnedover')) return 1000 - target.countCards('h');
					return -1;
				}
				else {
					if (target.hp <= 1) return 1000;
					return 1 + target.countCards('h');
				}
			}
			"step 1"
			if (result.bool) {
				player.logSkill('PSfangzhu', result.targets);
				event.target = result.targets[0];
				const list = ['摸牌翻面', '弃牌扣血'];
				player.chooseControl(list, function (event, player) {
					return _status.event.choice;
				})
					.set('choice', (get.attitude(player, event.target) > 0 || event.target.hp > 1) ? list[0] : list[1])
					.set('prompt', `放逐：令${get.translation(event.target)}执行一项`);
			}
			else event.finish();
			"step 2"
			if (result.control) {
				if (result.control === '摸牌翻面') {
					event.target.draw();
					event.target.turnOver();
				} else {
					if (event.target.countDiscardableCards(event.target, 'he') > 0) {
						event.target.chooseToDiscard('he', 1, true).set('ai', function (card) {
							return 6 - get.value(card);
						});
					}
					event.target.loseHp();
				}
			}

		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target: function (card, player, target) {
					if (get.tag(card, 'damage')) {
						if (player.hasSkillTag('jueqing', false, target)) return [1, -1.5];
						if (target.hp <= 1) return;
						if (!target.hasFriend()) return;
						var hastarget = false;
						var turnfriend = false;
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (get.attitude(target, players[i]) < 0 && !players[i].isTurnedOver()) {
								hastarget = true;
							}
							if (get.attitude(target, players[i]) > 0 && players[i].isTurnedOver()) {
								hastarget = true;
								turnfriend = true;
							}
						}
						if (get.attitude(player, target) > 0 && !hastarget) return;
						if (turnfriend || target.hp == target.maxHp) return [0.5, 1];
						if (target.hp > 1) return [1, 0.5];
					}
				},
			},
		},
		"_priority": 0,
	},
	PSxingshang: {
		audio: "rexingshang",
		trigger: {
			global: ["die", "turnOverAfter"],
		},
		filter: function (event, player) {
			return true;
		},
		direct: true,
		forced: true,
		content: function () {
			"step 0"
			player.logSkill(event.name, trigger.player);
			if (event.triggername === "turnOverAfter") {
				game.asyncDraw([player, trigger.player]);
				event.finish();
				return;
			}
			player.recover();
			var choice = ['视为受到过伤害'];
			if (trigger.player.countCards('he')) choice.push('获得牌');
			choice.push('cancel2');
			player.chooseControl(choice).set('prompt', get.prompt2('PSxingshang')).set('ai', function () {
				if (choice.length == 2) return choice[0];
				if (get.value(trigger.player.getCards('he')) > 8) return choice[1];
				return choice[0];
			});
			"step 1"
			if (result.control != 'cancel2') {
				if (result.control == '获得牌') {
					event.togain = trigger.player.getCards('he');
					player.gain(event.togain, trigger.player, 'giveAuto', 'bySelf');
				}
				else {
					player.damage('nosource', 'unreal');
				}
			}
		},
		"_priority": 0,
	},
	PSlingren: {
		audio: "xinfu_lingren",
		trigger: {
			global: "useCardToTargeted",
		},
		filter(event, player) {
			return event.player === player && player.getHistory('useCard', evt => evt.targets.includes(event.target)).length === 1;
		},
		direct: true,
		init: function (player, skill) {
			if (!player.storage.PSlingren_damage) player.storage.PSlingren_damage = [];
			if (!player.storage.PSlingren_multi) player.storage.PSlingren_multi = [];
		},
		content() {
			'step 0'
			player.logSkill('PSlingren', event.target);
			var target = trigger.target;
			event.target = target;
			event.choice = {
				basic: false,
				trick: false,
				equip: false,
			}
			player.chooseButton([`凌人：是否猜测${get.translation(target)}有哪些类别的手牌`, [['basic', 'trick', 'equip'], 'vcard']], [0, 3], false).set('ai', function (button) {
				switch (button.link[2]) {
					case 'basic':
						var rand = 0.95;
						if (!target.countCards('h', { type: ['basic'] })) rand = 0.05;
						if (!target.countCards('h')) rand = 0;
						return Math.random() < rand ? true : false;
					case 'trick':
						var rand = 0.9;
						if (!target.countCards('h', { type: ['trick', 'delay'] })) rand = 0.1;
						if (!target.countCards('h')) rand = 0;
						return Math.random() < rand ? true : false;
					case 'equip':
						var rand = 0.75;
						if (!target.countCards('h', { type: ['equip'] })) rand = 0.25;
						if (!target.countCards('h')) rand = 0;
						return Math.random() < rand ? true : false;
				}
			})
			'step 1'
			if (result.bool) {
				var choices = result.links.map(i => i[2]);
				if (!event.isMine() && !event.isOnline()) game.delayx();
				var list = [];
				event.num = 0;
				['basic', 'trick', 'equip'].forEach(type => {
					if (choices.includes(type) == target.countCards('h', card => get.type2(card, target) === type) > 0) event.num++;
				})
			} else {
				event.finish();
			}
			'step 2'
			player.popup('猜对' + get.cnNumber(event.num) + '项');
			game.log(player, '猜对了' + get.cnNumber(event.num) + '项');
			const num = event.num;
			if (num >= 0) {
				player.draw(2);
			}
			if (num >= 1) {
				player.addTempSkill('PSlingren_damage');
				player.storage.PSlingren_damage.push(target);
			}
			if (num >= 2) {
				player.addTempSkill('PSlingren_multi', { global: "roundStart" });
				player.storage.PSlingren_multi.push(target);
			}
			if (num >= 3) {
				const skill = lib.skill[event.name].getSkill(player);
				if (skill !== void 0) {
					const audioName = ['lingren_xingshang', 'lingren_jianxiong'].randomGet();
					game.changeSkillAudio(skill, player.name, audioName);
					player.popup(skill);
					player.addTempSkill(skill, { player: "phaseBegin" });
				}
			}
		},
		getSkill: function (player) {
			var list, skills = [];
			const banned = [];
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
			list = list.filter(char => lib.character[char][4].includes("zhu") && lib.character[char][1] === "wei");
			for (var i of list) {
				if (i.indexOf('gz_jun') == 0) continue;
				for (var j of lib.character[i][3]) {
					var skill = lib.skill[j];
					if (!skill || banned.includes(j)) continue;
					if (skill.ai && (skill.ai.combo || skill.ai.notemp || skill.ai.neg)) continue;
					if (!player.hasSkill(j)) skills.push(j);
				}
			}
			return skills.randomGet();
		},
		subSkill: {
			damage: {
				trigger: {
					source: "damageBegin1",
				},
				direct: true,
				popup: false,
				onremove: function (player, skill) {
					player.storage.PSlingren_damage = [];
				},
				filter: function (event, player) {
					return player.storage.PSlingren_damage && player.storage.PSlingren_damage.includes(event.player);
				},
				async content(event, trigger, player) {
					const list = ['令此伤害+1', '令此伤害-1', 'cancel2'];
					const { result: { control } } = await player.chooseControl(list)
						.set('prompt', `凌人：是否改变对${get.translation(trigger.player)}造成的伤害？`)
						.set('ai', function () {
							const att = get.attitude(_status.event.player, trigger.player);
							if (att == 0) return 'cancel2';
							if (att > 0) return '令此伤害-1';
							return '令此伤害+1';
						});
					if (control === '令此伤害+1') trigger.num++;
					else if (control === '令此伤害-1') trigger.num--;
				},
			},
			multi: {
				trigger: {
					global: "roundStart",
				},
				forced: true,
				popup: false,
				onremove: function (player, skill) {
					player.storage.PSlingren_multi = [];
				},
			},
		},
	},
	PSfujian: {
		audio: "xinfu_fujian",
		trigger: {
			player: "phaseJieshuBegin",
		},
		filter: function (event, player) {
			return game.hasPlayer(function (current) {
				return current.countCards('h') !== 0 && current !== player;
			});
		},
		locked: true,
		async content(event, trigger, player) {
			const filter = function (target) {
				return target.countCards('h') !== 0 && player.storage.PSlingren_multi && !player.storage.PSlingren_multi.includes(target) && target !== player;
			}
			let Targets = (player.storage.PSlingren_multi || []).slice(0).remove(player);
			const players = game.filterPlayer(current => filter(current));
			if (players.length === 1) Targets.addArray(players);
			else if (players.length > 1) {
				const { result: { targets } } = await player.chooseTarget(function (card, player, target) {
					return players.includes(target);
				}, true).set('ai', function (target) {
					if (get.attitude(_status.event.player, target) < 0) return 100;
					return 1;
				});
				Targets.addArray(targets);
			}
			Targets = Targets.filter(current => current.isAlive() && current.isIn()).sortBySeat();
			for (let target of Targets) {
				const num = Math.abs(player.hp - target.hp) || 1;
				var cards = target.getCards('h').randomGets(num);
				player.line(target);
				var content = [get.translation(target) + '的部分手牌', cards];
				game.log(player, '观看了', target, '的部分手牌');
				await player.chooseControl('ok').set('dialog', content);
			}
		},
		"_priority": 0,
	},
	PSshiming: {
		audio: "sbkurou",
		trigger: {
			player: "dying",
		},
		usable: 1,
		forced: true,
		init: function (player) {
			game.changeSkillAudio("xinfu_qinguo", player.name, "zhaxiang");
			game.changeSkillAudio("xinfu_qinguo_recover", player.name, "zhaxiang");
			game.changeSkillAudio("new_repaoxiao", player.name, "sbzhaxiang");
			game.changeSkillAudio("buqu", player.name, "rekurou");
		},
		derivation: ["xinfu_qinguo", "new_repaoxiao", "buqu"],
		filter: function (event, player) {
			return player.maxHp > 1;
		},
		content: function () {
			player.loseMaxHp();
			player.recover();
			for (var i of lib.skill.PSshiming.derivation) {
				if (!player.hasSkill(i, null, null, false)) {
					player.popup(i);
					player.addSkills(i);
					break;
				}
			}
		},
	},
	PSdangxian: {
		audio: "dangxian_re_liaohua1",
		trigger: {
			player: "phaseBegin",
		},
		forced: true,
		content: function () {
			trigger.phaseList.splice(trigger.num, 0, 'phaseDraw|xindangxian', 'phaseUse|xindangxian');
		},
		group: ["PSdangxian_rewrite", "PSdangxian_end"],
		subSkill: {
			rewrite: {
				trigger: {
					player: ["phaseDrawBegin", "phaseUseBegin"],
				},
				forced: true,
				popup: false,
				filter: function (event, player) {
					return true;
				},
				content() {
					'step 0'
					var card = get.cardPile2(function (card) {
						return card.name == 'sha';
					});
					if (card) player.gain(card, 'gain2').gaintag = ['PSdangxian'];
					'step 1'
					game.updateRoundNumber();
				},
				mod: {
					ignoredHandcard: function (card, player) {
						if (card.hasGaintag('PSdangxian')) {
							return true;
						}
					},
					cardDiscardable: function (card, player, name) {
						if (name == 'phaseDiscard' && card.hasGaintag('PSdangxian')) {
							return false;
						}
					},
				},
			},
			end: {
				audio: "dangxian_re_liaohua1",
				trigger: {
					player: "phaseEnd",
				},
				forced: true,
				popup: false,
				filter: function (event, player) {
					return player.countCards('h', card => card.hasGaintag('PSdangxian')) > 0;
				},
				async content(event, trigger, player) {
					const hs = player.getCards('h', card => card.hasGaintag('PSdangxian'));
					await player.discard(hs);
					await player.loseHp(hs.length);
					const list = get.inpileVCardList(info => {
						if (info[0] != 'trick') return false;
						var name = info[2];
						return get.tag({ name: name }, 'damage') > 0 && player.hasUseTarget({ name: name, isCard: true });
					});
					if (list.length) {
						const { result: { bool, links } } = await player.chooseButton(['当先：视为使用一张伤害类锦囊牌', [list, 'vcard']], true).set('ai', button => {
							return get.player().getUseValue({ name: button.link[2] });
						});
						if (bool) {
							var name = links[0][2];
							player.chooseUseTarget({ name: name, isCard: true }, true, false).logSkill = 'PSdangxian';
						}
					}
				},
			},
		},
	},
	PSfuli: {
		skillAnimation: true,
		animationColor: "soil",
		audio: "refuli",
		enable: "chooseToUse",
		filter: function (event, player) {
			if (event.type != 'dying') return false;
			if (player != event.dying) return false;
			if (player.maxHp <= 1) return false;
			if (player.hasSkill('PSfuli_used')) return false;
			return true;
		},
		async content(event, trigger, player) {
			await player.loseMaxHp();
			const hs = player.getCards('h', card => card.hasGaintag('PSdangxian'));
			if (hs.length) await player.discard(hs);
			await player.recoverTo(player.maxHp);
			player.addTempSkill('PSfuli_used', 'roundStart');
			const next = game.createEvent('chooseToAddSkill');
			next.player = player;
			next.setContent(lib.skill.PSfuli.chooseToAddSkill);
			if (!player.isTurnedOver()) await player.turnOver();
		},
		chooseToAddSkill() {
			'step 0'
			var list;
			if (_status.characterlist) {
				list = [];
				for (var i = 0; i < _status.characterlist.length; i++) {
					var name = _status.characterlist[i];
					if (true/* lib.character[name][1] == 'shu' */) list.push(name);
				}
			}
			else if (_status.connectMode) {
				list = get.charactersOL(function (i) {
					return true;
					// return lib.character[i][1] != 'shu';
				});
			}
			else {
				list = get.gainableCharacters(function (info) {
					return true;
					// return info[1] == 'shu';
				});
			}
			var players = game.players.concat(game.dead);
			for (var i = 0; i < players.length; i++) {
				list.remove(players[i].name);
				list.remove(players[i].name1);
				list.remove(players[i].name2);
			}
			list = list.randomGets(5);
			var skills = [];
			for (var i of list) {
				skills.addArray((lib.character[i][3] || []).filter(function (skill) {
					var info = get.info(skill);
					return info && !info.charlotte;
				}));
			}
			if (!list.length || !skills.length) {
				event.result = {
					bool: false,
					skills: [],
				};
				return;
			}
			if (player.isUnderControl()) {
				game.swapPlayerAuto(player);
			}
			var switchToAuto = function () {
				_status.imchoosing = false;
				event._result = {
					bool: true,
					skills: skills.randomGets(1),
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
			'step 1'
			var map = event.result || result;
			if (map.skills && map.skills.length) {
				player.popup(map.skills);
				player.addSkills(map.skills);
			}
		},
		subSkill: {
			used: {
				locked: true,
				charlotte: true,
			},
		},
		ai: {
			save: true,
			skillTagFilter: function (player, arg, target) {
				return player == target && player.maxHp > 1;
			},
			result: {
				player: 10,
			},
			threaten: function (player, target) {
				if (!target.storage.fuli) return 0.9;
			},
		},
		"_priority": 0,
	},
	PSjiaozi: {
		audio: "jiaozi",
		trigger: {
			player: "damageBegin3",
			source: "damageBegin1",
		},
		forced: true,
		filter: function (event, player) {
			if (!event.source) return false;
			const target = event.source === player ? event.player : event.source;
			return player.countCards('h') >= target.countCards('h');
		},
		content: function () {
			trigger.num++;
		},
		ai: {
			presha: true,
		},
		group: "PSjiaozi_else",
		subSkill: {
			else: {
				audio: "jiaozi",
				trigger: {
					player: ["phaseBegin", "phaseDiscardBegin"],
				},
				forced: true,
				content() {
					const num = game.countPlayer(current => current.hp <= player.hp);
					if (event.triggername === "phaseBegin") {
						player.draw(num);
					} else {
						player.chooseToDiscard('he', num, true);
					}
				},
			},
		},
		"_priority": 0,
	},
	PSfuqi: {
		audio: "fuqi",
		forced: true,
		trigger: {
			player: "useCard",
		},
		filter: function (event, player) {
			return event.card && (get.type(event.card) == 'trick' || get.type(event.card) == 'basic' && !['shan', 'tao', 'jiu', 'du'].includes(event.card.name)) && game.hasPlayer(function (current) {
				return current != player && get.distance(current, player) <= 1;
			});
		},
		content: function () {
			trigger.directHit.addArray(game.filterPlayer(function (current) {
				return current != player && get.distance(current, player) <= 1;
			}));
		},
		ai: {
			"directHit_ai": true,
			skillTagFilter: function (player, tag, arg) {
				return get.distance(arg.target, player) <= 1;
			},
		},
		mod: {
			globalFrom: function (from, to, distance) {
				if (get.distance(to, from) <= 1) return -Infinity;
			},
		},
		"_priority": 0,
	},
	PStieji: {
		audio: "sbtieji",
		trigger: {
			player: "useCardToPlayered",
		},
		logTarget: "target",
		filter: function (event, player) {
			return player != event.target && event.card.name == 'sha' && event.target.isIn();
		},
		check: function (event, player) {
			return get.attitude(player, event.target) < 0;
		},
		content: function () {
			'step 0'
			var target = trigger.target;
			event.target = target;
			if (!target.hasSkill('fengyin')) target.addTempSkill('fengyin');
			trigger.directHit.add(target);
			if (player.hasHistory('custom', evt => evt.PStieji_target === target)) {
				event.finish();
				return;
			}
			player.chooseToDuiben(target).set('title', '谋弈').set('namelist', [
				'出阵迎战', '拱卫中军', '直取敌营', '扰阵疲敌'
			])
				.set('ai', button => {
					var source = get.event().getParent().player, target = get.event().getParent().target;
					if (!target.countCards('he') && button.link[2] == 'db_def2') return 10;
					if (!target.countCards('he') && get.attitude(target, source) <= 0 && button.link[2] == 'db_atk1') return 10;
					return 1 + Math.random();
				})
				.set('translationList',
					[
						`以防止${get.translation(player)}摸两张牌`,
						`以防止${get.translation(player)}获得你的牌`,
						`若成功，你获得${get.translation(target)}的一张牌`,
						`若成功，你摸两张牌`,
					]
				);
			'step 1'
			if (result.bool) {
				target.addTempSkill('fengyin', { player: "phaseEnd" });
				player.addTempSkill('PStieji_mark');
				player.addMark('PStieji_mark', 1, false);
				if (result.player == 'db_def1') player.gainPlayerCard(target, 'he', true);
				else player.draw(2);
			} else {
				event.choice = result.player;
				const str = event.choice === 'db_def1' ? '摸两张牌' : `获得${get.translation(target)}的一张牌`;
				player.chooseBool(`是否${str}？然后你本回合对${get.translation(target)}发动〖铁骑〗时不能与其进行谋弈`)
					.set('ai', (event, player) => {
						if (!player.isPhaseUsing()) return true;
						const evt = event.getParent('chooseToUse');
						if (evt && evt.getParent().name === 'phaseUse' && evt.filterCard({ name: 'sha' }, player, evt) && player.countCards('hs', 'sha')) return false;
						return _status.event.canGain;
					})
					.set('canGain', result.player === 'db_def1' || result.player === 'db_def2' && target.countDiscardableCards(player, 'he') > 0);
			}
			'step 2'
			if (event.choice && result.bool && result.confirm) {
				player.getHistory('custom').push({ PStieji_target: target });
				if (event.choice === 'db_def1') player.draw(2);
				else player.gainPlayerCard(target, 'he', true);
			}
		},
		shaRelated: true,
		ai: {
			ignoreSkill: true,
			skillTagFilter: function (player, tag, arg) {
				if (tag == 'directHit_ai') {
					return get.attitude(player, arg.target) <= 0;
				}
				if (!arg || arg.isLink || !arg.card || arg.card.name != 'sha') return false;
				if (!arg.target || get.attitude(player, arg.target) >= 0) return false;
				if (!arg.skill || !lib.skill[arg.skill] || lib.skill[arg.skill].charlotte || get.is.locked(arg.skill) || !arg.target.getSkills(true, false).includes(arg.skill)) return false;
			},
			"directHit_ai": true,
		},
		subSkill: {
			"true1": {
				audio: true,
				sub: true,
				"_priority": 0,
			},
			"true2": {
				audio: true,
				sub: true,
				"_priority": 0,
			},
			false: {
				audio: true,
				sub: true,
				"_priority": 0,
			},
			mark: {
				mod: {
					cardUsable: function (card, player, num) {
						if (card.name == 'sha') return num + player.countMark('PStieji_mark');
					},
				},
				charlotte: true,
				onremove: true,
				"_priority": 0,
			},
		},
		"audioname2": {
			PSshengui: "retieji_boss_lvbu3",
		},
		"_priority": 0,
	},
	PScema: {
		mod: {
			globalFrom(from, to, distance) {
				return distance - 1;
			},
		},
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard(card, player) {
			return get.subtype(card) == 'equip3' || get.subtype(card) == 'equip4' || get.subtype(card) == 'equip6';
		},
		position: "hes",
		viewAs: {
			name: "sha",
		},
		shaRelated: true,
		locked: true,
		viewAsFilter(player) {
			if (!player.countCards('hes', card => {
				return get.subtype(card) == 'equip3' || get.subtype(card) == 'equip4' || get.subtype(card) == 'equip6'
			})) return false;
		},
		prompt: "将一张坐骑牌当杀使用或打出",
		check(card) {
			const val = get.value(card);
			if (_status.event.name == 'chooseToRespond') return 1 / Math.max(0.1, val);
			return 5 - val;
		},
		precontent() {
			player.when('useCard1')
				.assign({
					firstDo: true,
				})
				.filter(evt => evt.skill === 'PScema' && evt.card.name === 'sha')
				.then(() => {
					trigger.baseDamage = 2;
				});
		},
		ai: {
			skillTagFilter(player) {
				if (!player.countCards('hes', card => {
					return get.subtype(card) == 'equip3' || get.subtype(card) == 'equip4' || get.subtype(card) == 'equip6'
				})) return false;
			},
			respondSha: true,
			yingbian: function (card, player, targets, viewer) {
				if (get.attitude(viewer, player) <= 0) return 0;
				var base = 0, hit = false;
				if (get.cardtag(card, 'yingbian_hit')) {
					hit = true;
					if (targets.some(target => {
						return target.mayHaveShan(viewer, 'use', target.getCards('h', i => {
							return i.hasGaintag('sha_notshan');
						})) && get.attitude(viewer, target) < 0 && get.damageEffect(target, player, viewer, get.natureList(card)) > 0;
					})) base += 5;
				}
				if (get.cardtag(card, 'yingbian_add')) {
					if (game.hasPlayer(function (current) {
						return !targets.includes(current) && lib.filter.targetEnabled2(card, player, current) && get.effect(current, card, player, player) > 0;
					})) base += 5;
				}
				if (get.cardtag(card, 'yingbian_damage')) {
					if (targets.some(target => {
						return get.attitude(player, target) < 0 && (hit || !target.mayHaveShan(viewer, 'use', target.getCards('h', i => {
							return i.hasGaintag('sha_notshan');
						})) || player.hasSkillTag('directHit_ai', true, {
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
				if (player.hasSkill('jueqing') || player.hasSkill('gangzhi') || target.hasSkill('gangzhi')) return false;
				return true;
			},
			basic: {
				useful: [5, 3, 1],
				value: [5, 3, 1],
			},
			order: function (item, player) {
				if (player.hasSkillTag('presha', true, null, true)) return 10;
				if (typeof item === 'object' && game.hasNature(item, 'linked')) {
					if (game.hasPlayer(function (current) {
						return current != player && lib.card.sha.ai.canLink(player, current, item) && player.canUse(item, current, null, true) && get.effect(current, item, player, player) > 0;
					}) && game.countPlayer(function (current) {
						return current.isLinked() && get.damageEffect(current, player, player, get.nature(item)) > 0;
					}) > 1) return 3.1;
					return 3;
				}
				return 3.05;
			},
			result: {
				target: function (player, target, card, isLink) {
					let eff = -1.5, odds = 1.35, num = 1;
					if (isLink) {
						let cache = _status.event.getTempCache('sha_result', 'eff');
						if (typeof cache !== 'object' || cache.card !== get.translation(card)) return eff;
						if (cache.odds < 1.35 && cache.bool) return 1.35 * cache.eff;
						return cache.odds * cache.eff;
					}
					if (player.hasSkill('jiu') || player.hasSkillTag('damageBonus', true, {
						target: target,
						card: card
					})) {
						if (target.hasSkillTag('filterDamage', null, {
							player: player,
							card: card,
							jiu: true,
						})) eff = -0.5;
						else {
							num = 2;
							if (get.attitude(player, target) > 0) eff = -7;
							else eff = -4;
						}
					}
					if (!player.hasSkillTag('directHit_ai', true, {
						target: target,
						card: card,
					}, true)) odds -= 0.7 * target.mayHaveShan(player, 'use', target.getCards('h', i => {
						return i.hasGaintag('sha_notshan');
					}), 'odds');
					_status.event.putTempCache('sha_result', 'eff', {
						bool: target.hp > num && get.attitude(player, target) > 0,
						card: get.translation(card),
						eff: eff,
						odds: odds
					});
					return odds * eff;
				},
			},
			tag: {
				respond: 1,
				respondShan: 1,
				damage: function (card) {
					if (game.hasNature(card, 'poison')) return;
					return 2;
				},
				natureDamage: function (card) {
					if (game.hasNature(card, 'linked')) return 2;
				},
				fireDamage: function (card, nature) {
					if (game.hasNature(card, 'fire')) return 2;
				},
				thunderDamage: function (card, nature) {
					if (game.hasNature(card, 'thunder')) return 2;
				},
				poisonDamage: function (card, nature) {
					if (game.hasNature(card, 'poison')) return 2;
				},
			},
		},
		"_priority": 0,
	},
	PSzhuiming: {
		audio: "ol_shichou",
		trigger: {
			player: "useCardToPlayer",
		},
		shaRelated: true,
		filter(event, player) {
			return event.card.name == 'sha' && get.distance(player, event.target) === 1;
		},
		check(event, player) {
			return get.attitude(player, event.target) <= 0;
		},
		content() {
			'step 0'
			const target = trigger.target;
			event.target = target;
			var choices = ['选项一'], choiceList = [
				`令${get.translation(trigger.card)}无视你的防具、对你造成伤害+1，且你不能响应`,
				`你获得${get.translation(trigger.cards)}，然后${get.translation(player)}获得你两张牌`,
			];
			if (target.countGainableCards(player, 'he')) choices.push('选项二');
			else choiceList[1] = '<span style="opacity:0.5; ">' + choiceList[1] + '</span>';

			if (choices.length === 1) event._result = { control: '选项一', index: 0 };
			else target.chooseControl(choices).set('prompt', '追命：请选择一项').set('choiceList', choiceList).set('ai', () => {
				const target = _status.event.targetx;
				const player = _status.event.playerx;
				if (target.hasSkillTag('maixie') && target.hp > 2) return 0;
				if (get.damageEffect(target, player, target) >= 0) return 0;
				return 1;
			}).set('targetx', target).set('playerx', player);
			'step 1'
			if (result.control) {
				switch (result.index) {
					case 0:
						player.markAuto('PSzhuiming', event.target);
						player.when("useCardToPlayered")
							.then(() => {
								delete player.storage.PSzhuiming;
							});
						trigger.getParent().directHit.add(event.target);
						var id = event.target.playerid;
						var map = trigger.getParent().customArgs;
						if (!map[id]) map[id] = {};
						if (typeof map[id].extraDamage != 'number') {
							map[id].extraDamage = 0;
						}
						map[id].extraDamage++;
						break;
					case 1:
						if (trigger.cards.length && ['o', 'd'].includes(get.position(trigger.cards[0]))) event.target.gain(trigger.cards, 'gain2');
						player.gainPlayerCard(event.target, 'he', 2, true);
						break;
				}
			}
		},
		ai: {
			unequip: true,
			skillTagFilter: function (player, tag, arg) {
				if (tag == 'unequip') {
					if (arg && arg.card && arg.card.name === 'sha' && arg.target && player.storage.PSzhuiming && player.storage.PSzhuiming.includes(arg.target)) return false;
				}
			},
		},
	},
	PSjinge: {
		mod: {
			globalFrom(from, to, distance) {
				return distance - 2;
			},
			cardname: function (card, player, name) {
				if (get.cardNameLength({ name: card.name }) === 2) return 'sha';
			},
			cardUsable: function (card, player, num) {
				if (card.cards && card.cards.length === 1 && get.name(card) === 'sha' && get.cardNameLength({ name: card.cards[0].name }) === 2) return Infinity;
			},
		},
		trigger: {
			player: "useCard1",
		},
		forced: true,
		silent: true,
		charlotte: true,
		filter: function (event, player) {
			if (!event.card.cards || event.card.cards.length !== 1 || event.addCount === false) return false;
			return get.name(event.card) === 'sha' && get.cardNameLength(event.card.cards[0]) === 2;
		},
		content: function () {
			trigger.addCount = false;
			if (player.stat[player.stat.length - 1].card.sha > 0) {
				player.stat[player.stat.length - 1].card.sha--;
			}
		},
		popup: false,
		sub: true,
		"_priority": 1,
	},
	PShuaiju: {
		marktext: "橘",
		intro: {
			name: "怀橘",
			"name2": "橘",
			content: "当前有#个“橘”",
		},
		onremove: function () {
			game.players.forEach(current => {
				if (current.hasMark('nzry_huaiju')) current.removeMark('nzry_huaiju', current.countMark('nzry_huaiju'));
			});
		},
		audio: "nzry_huaiju",
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter: function (event, player) {
			return (event.name != 'phase' || game.phaseNumber == 0);
		},
		content: function () {
			player.addMark('nzry_huaiju', 3);
			player.addSkill('PShuaiju_ai');
		},
		group: ["PShuaiju_effect"],
		subSkill: {
			effect: {
				audio: "nzry_huaiju",
				trigger: {
					global: ["damageBegin4", "drawBegin"],
				},
				forced: true,
				filter: function (event, player) {
					return event.player.hasMark('nzry_huaiju');
				},
				content: function () {
					player.line(trigger.player, 'green');
					if (trigger.name == 'damage') {
						trigger.cancel();
						trigger.player.removeMark('nzry_huaiju', 1);
					}
					else trigger.num += trigger.player.countMark('nzry_huaiju');
				},
				"_priority": 0,
			},
			ai: {
				charlotte: true,
				ai: {
					filterDamage: true,
					skillTagFilter: function (player, tag, arg) {
						if (!player.hasMark('nzry_huaiju')) return false;
						if (!game.hasPlayer(function (current) {
							return current.hasSkill('PShuaiju_effect');
						})) return false;
						if (arg && arg.player) {
							if (arg.player.hasSkillTag('jueqing', false, player)) return false;
						}
					},
				},
				"_priority": 0,
			},
		},
		"_priority": 0,
	},
	PSzhenglun: {
		audio: "nzry_zhenglun",
		trigger: {
			player: "phaseDrawBefore",
		},
		filter(event, player) {
			return true;
		},
		check(event, player) {
			return player.countCards("h") >= 2 || player.skipList.includes("phaseUse");
		},
		content() {
			trigger.cancel();
			player.addMark("nzry_huaiju", 1);
		},
		ai: {
			combo: "PShuaiju",
		},
		"_priority": 0,
	},
	PSqianxun: {
		mod: {
			targetEnabled(card, player, target, now) {
				if (card.name == 'shunshou' || get.type(card) === 'delay' || card.name == 'guohe') return false;
			},
		},
		audio: 2,
		"_priority": 0,
	},
	PSlianying: {
		audio: "lianying",
		trigger: {
			player: ["useCard", "respond"],
		},
		frequent: true,
		getSuitsLength: function (player) {
			const suits = [];
			for (let i = 0; i < player.getCards().length; i++) {
				const suit = get.suit(player.getCards()[i], player);
				if (!lib.suit.includes(suit) || suits.includes(suit)) continue;
				suits.add(suit);
				if (lib.suit.length === suits.length) break;
			}
			return suits.length;
		},
		filter: function (event, player) {
			return 4 - lib.skill.PSlianying.getSuitsLength(player) > 0;
		},
		content() {
			player.draw(4 - lib.skill.PSlianying.getSuitsLength(player));
		},
	},
	PSwushuang: {
		audio: "wushuang",
		locked: true,
		derivation: "wushuangfangtianji",
		group: ["PSwushuang_wushuangfangtianji", "wushuang1", "wushuang2"],
		subSkill: {
			wushuangfangtianji: {
				nobracket: true,
				equipSkill: true,
				trigger: {
					source: "damageSource",
				},
				filter: function (event, player) {
					if (!player.hasEmptySlot(1) || !lib.card.wushuangfangtianji) return false;
					return lib.skill.wushuangfangtianji_skill.filter(event, player);
				},
				direct: true,
				locked: false,
				content: function () {
					'step 0'
					var target = trigger.player;
					var choices = ['摸一张牌'];
					if (target.hasCard(function (card) {
						return lib.filter.canBeDiscarded(card, player, target);
					}, 'he')) choices.push('弃置' + get.translation(target) + '的一张牌');
					player.chooseControl('cancel2').set('choiceList', choices).set('prompt', get.prompt('wushuangfangtianji_skill')).set('ai', function () {
						var player = _status.event.player, target = _status.event.getTrigger().player;
						if (target.hasCard(function (card) {
							return lib.filter.canBeDiscarded(card, player, target);
						}, 'he') && get.effect(target, { name: 'guohe_copy2' }, player, player) > get.effect(player, { name: 'draw' }, player, player)) return 1;
						return 0;
					});
					'step 1'
					if (result.control == 'cancel2') return;
					if (result.index == 0) {
						player.logSkill('wushuangfangtianji_skill');
						player.draw();
					}
					else {
						var target = trigger.player;
						player.logSkill('wushuangfangtianji_skill', target);
						player.discardPlayerCard(target, 'he', true);
					}
				},
				mod: {
					attackRange: function (player, num) {
						if (lib.card.wushuangfangtianji && player.hasEmptySlot(1)) return num - lib.card.wushuangfangtianji.distance.attackFrom;
					},
				},
				sub: true,
				"_priority": -25,
			},
		},
		"_priority": 0,
	},
	PSbaifu: {
		audio: "ext:PS武将/audio/skill:2",
		trigger: {
			source: "damageBegin1",
		},
		logTarget: "player",
		log: false,
		check: function (event, player) {
			const target = game.findPlayer(current => current.storage.PSbaifu_yifu && current.storage.PSbaifu_yifu.includes(player));
			if (target && get.attitude(player, target) > 0) return false;
			return true;
		},
		filter: function (event, player) {
			if (event.player === player) return false;
			return !event.player.storage.PSbaifu_yifu || !event.player.storage.PSbaifu_yifu.includes(player);
		},
		async content(event, trigger, player) {
			const yifu = game.filterPlayer(current => current.storage.PSbaifu_yifu && current.storage.PSbaifu_yifu.includes(player));
			if (yifu.length) {
				for (let i = 0; i < yifu.length; i++) {
					await yifu[i].damage('nocard');
					yifu[i].storage.PSbaifu_yifu.remove(player);
					yifu[i].markAuto('PSbaifu_yifu');
				}
			}
			if (!trigger.player.hasSkill('PSbaifu_yifu')) trigger.player.addSkill('PSbaifu_yifu');
			trigger.player.storage.PSbaifu_yifu.add(player);
			trigger.player.markAuto('PSbaifu_yifu');
			player.gainPlayerCard(trigger.player, 'he', true);
			game.playAudio('..', 'extension', 'PS武将/audio/skill', ['PSbaifu1', 'PSbaifu2'].randomGet());
			trigger.cancel();
		},
		subSkill: {
			yifu: {
				intro: {
					content: function (storage, player) {
						return player.storage['PSbaifu_yifu'].reduce((a, b) => a + `我儿${get.translation(b)}天下无双！<br>`, '');
					},
					markcount: function (storage, player) {
						return storage.length;
					},
				},
				onremove: true,
				init(player, skill) {
					if (!player.storage[skill]) player.storage[skill] = [];
				}
			},
		},
		"_priority": 0,
	},
	PSpanshi: {
		audio: "ext:PS武将/audio/skill:2",
		trigger: {
			source: "damageBegin1",
			global: "useCardBefore",
		},
		direct: true,
		forced: true,
		filter: function (event, player, name) {
			if (!event.player.storage.PSbaifu_yifu || !event.player.storage.PSbaifu_yifu.includes(player)) return false;
			if (name === "damageBegin1") return true;
			if (event.player.hasHistory('custom', evt => evt.PSpanshi_use)) return false;
			if (!event.targets || event.targets.length === 1 && event.targets[0] === player) return false;
			if (event.player.hasHistory('useCard', evt => get.tag(evt.card, 'damage') > 0)) return false;
			return get.tag(event.card, 'damage') > 0;
		},
		logTarget: (event, player) => event.name === 'damage' ? event.player : player,
		content: function () {
			if (event.triggername === "damageBegin1") {
				trigger.num++;
				player.when({ source: 'dieBegin' })
					.filter((evt, player) => evt.player.storage.PSbaifu_yifu && evt.player.storage.PSbaifu_yifu.includes(player))
					.then(() => {
						game.playAudio('..', 'extension', 'PS武将/audio/die', ['PSpanshi_kill1', 'PSpanshi_kill2'].randomGet());
					});
				game.playAudio('..', 'extension', 'PS武将/audio/skill', ['PSpanshi1', 'PSpanshi2'].randomGet());
			} else {
				trigger.player.getHistory('custom').push({ PSpanshi_use: true });
				trigger.targets.remove(player);
				if (trigger.targets.every(target => player.canUse(trigger.card, target, true, true))) {
					trigger.player = player;
					game.playAudio('..', 'extension', 'PS武将/audio/skill', ['PSpanshi_use1', 'PSpanshi_use2'].randomGet());
					trigger.noai = true;
					game.delay(0.5);
				}
			}
		},
	},
	PSshen_huashen: {
		unique: true,
		audio: "ext:PS武将/audio/skill:2",
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", /* "phaseBegin", */ "phaseAfter", "PSshen_huashen"],
		},
		filter: function (event, player, name) {
			if (player.storage.PSshen_huashen.invalid) return false;
			if (event.name !== 'phase') return true;
			if (name == 'phaseBefore') return game.phaseNumber == 0 || event.player === player;
			return player.storage.PSshen_huashen && player.storage.PSshen_huashen.character.length > 0;
		},
		direct: true,
		content: function () {
			/* 
			 player.storage.PSshen_huashen.current //当前化身牌武将id
			 player.storage.PSshen_huashen.current2 //当前化身的技能id数组
			 event.card //选中的化身牌（新化身牌）  
			*/
			"step 0"
			var name = event.triggername;
			if (trigger.name != 'phase' || (name == 'phaseBefore' && game.phaseNumber == 0)) {
				player.logSkill('PSshen_huashen');
				lib.skill.PSshen_huashen.addHuashens(player, 2);
				event.logged = true;
				/* if (name == 'phaseBefore' && game.phaseNumber == 0 && trigger.player !== player) {
					event.finish();
					return;
				} */
			}
			_status.noclearcountdown = true;
			event.videoId = lib.status.videoId++;
			var cards = player.storage.PSshen_huashen.character.slice(0);
			if (player.isOnline2()) {
				player.send(function (cards, id) {
					var dialog = ui.create.dialog('###是否发动【化身】？###<div class="text center">选择一张“魂”作为你的表象武将</div>', [cards, (item, type, position, noclick, node) => lib.skill.PSshen_huashen.$createButton(item, type, position, noclick, node)]);
					dialog.videoId = id;
				}, cards, event.videoId);
			}
			event.dialog = ui.create.dialog('###是否发动【化身】？###<div class="text center">选择一张“魂”作为你的表象武将</div>', [cards, (item, type, position, noclick, node) => lib.skill.PSshen_huashen.$createButton(item, type, position, noclick, node)]);
			event.dialog.videoId = event.videoId;
			if (!event.isMine()) {
				event.dialog.style.display = 'none';
			}
			if (!event.logged) { player.logSkill('PSshen_huashen'); event.logged = true }
			var next = player.chooseButton(false).set('dialog', event.videoId);
			next.set('filterButton', function (button) {
				return button.link != _status.event.current;
			});
			next.set('current', player.storage.PSshen_huashen.current);
			next.set('ai', function (button) {
				const rarity = lib.rank.rarity;
				const num = rarity.legend.includes(button.link) ?
					4 : rarity.epic.includes(button.link) ?
						3 : rarity.rare.includes(button.link) ?
							2 : 1;
				return num;
			});
			"step 1"
			if (player.isOnline2()) {
				player.send('closeDialog', event.videoId);
			}
			event.dialog.close();
			delete _status.noclearcountdown;
			if (!_status.noclearcountdown) {
				game.stopCountChoose();
			}
			if (result.bool) {
				//切换形象
				event.card = result.links[0];
				const old = player.storage.PSshen_huashen.current;
				player.storage.PSshen_huashen.current = event.card;
				const name = player.name2 === 'PSshen_zuoci' ? player.name2 : player.name;
				player.changeSkin("PSshen_huashen", event.card);
				// player.setAvatar(name, event.card, true, true);
				game.broadcastAll(function (player, character, old) {
					player.tempname.remove(old);
					player.tempname.add(character);
					player.sex = lib.character[event.card][0];
				}, player, event.card, old);
				game.log(player, '将性别变为了', '#y' + get.translation(lib.character[event.card][0]) + '性');
				player.changeGroup(lib.character[event.card][1]);
				game.log(player, '将', '#y' + get.translation(event.card), '作为了表象武将');
				//获得技能
				const skills = get.character(event.card, 3).filter(function (skill) {
					const categories = get.skillCategoriesOf(skill);
					return !categories.some(type => lib.skill.PSshen_huashen.bannedType.includes(type));
				});
				if (skills.length) {
					const old2 = player.storage.PSshen_huashen.current2;
					player.storage.PSshen_huashen.current2 = skills;
					player.addAdditionalSkills('PSshen_huashen', skills);
					player.syncStorage('PSshen_huashen');
					player.updateMarks('PSshen_huashen');
				} else {
					player.removeAdditionalSkill('PSshen_huashen');
				}
			}
		},
		group: 'PSshen_huashen_use',
		subSkill: {
			use: {
				audio: 'PSshen_huashen',
				enable: "chooseToUse",
				filter: function (event, player) {
					if (!player.storage.PSshen_huashen.invalid || !player.storage.PSshen_huashen.character.length) return false;
					for (var i of lib.inpile) {
						var type = get.type2(i);
						if ((type == 'basic' || type == 'trick') && !player.hasHistory('custom', evt => evt.PSshen_huashen_use && evt.card && evt.card.name === i) && event.filterCard(get.autoViewAs({ name: i }, 'unsure'), player, event)) return true;
					}
					return false;
				},
				chooseButton: {
					dialog: function (event, player) {
						var list = [];
						for (var i = 0; i < lib.inpile.length; i++) {
							const filter = function (name) {
								return !player.hasHistory('custom', evt => evt.PSshen_huashen_use && evt.card && get.name(evt.card) === name);
							};
							var name = lib.inpile[i];
							if (name == 'sha') {
								if (event.filterCard(get.autoViewAs({ name }, 'unsure'), player, event) && filter(name)) list.push(['基本', '', 'sha']);
								for (var nature of lib.inpile_nature) {
									if (event.filterCard(get.autoViewAs({ name, nature }, 'unsure'), player, event)) list.push(['基本', '', 'sha', nature]);
								}
							}
							else if (get.type(name) == 'trick' && filter(name) && event.filterCard(get.autoViewAs({ name }, 'unsure'), player, event)) list.push(['锦囊', '', name]);
							else if (get.type(name) == 'basic' && filter(name) && event.filterCard(get.autoViewAs({ name }, 'unsure'), player, event)) list.push(['基本', '', name]);
						}
						return ui.create.dialog('化身', [list, 'vcard']);
					},
					check: function (button) {
						if (_status.event.getParent().type != 'phase') return 1;
						var player = _status.event.player;
						if (['wugu', 'zhulu_card', 'yiyi', 'lulitongxin', 'lianjunshengyan', 'diaohulishan'].includes(button.link[2])) return 0;
						return player.getUseValue({
							name: button.link[2],
							nature: button.link[3],
						});
					},
					backup: function (links, player) {
						return {
							filterCard: () => false,
							selectCard: -1,
							audio: 'PSshen_huashen',
							popname: true,
							viewAs: { name: links[0][2], nature: links[0][3], isCard: true },
							onuse: function (links, player) {
								const next = game.createEvent('chooseHuashenCharacter');
								next.player = player;
								next.links = links;
								next.setContent(lib.skill.PSshen_huashen_use.chooseHuashenCharacter);
							},
						}
					},
					prompt: function (links, player) {
						return '将一张牌当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
					},
				},
				chooseHuashenCharacter: function () {
					'step 0'
					const links = event.links;
					_status.noclearcountdown = true;
					event.videoId = lib.status.videoId++;
					var cards = player.storage.PSshen_huashen.character.slice(0);
					if (player.isOnline2()) {
						player.send(function (cards, id) {
							var dialog = ui.create.dialog('###是否发动【化身】？###<div class="text center">选择展示一张武将牌上的“魂”并将其置入剩余武将牌堆</div>', [cards, (item, type, position, noclick, node) => lib.skill.PSshen_huashen.$createButton(item, type, position, noclick, node)]);
							dialog.videoId = id;
						}, cards, event.videoId);
					}
					event.dialog = ui.create.dialog('###是否发动【化身】？###<div class="text center">选择展示一张武将牌上的“魂”并将其置入剩余武将牌堆</div>', [cards, (item, type, position, noclick, node) => lib.skill.PSshen_huashen.$createButton(item, type, position, noclick, node)]);
					event.dialog.videoId = event.videoId;
					if (!event.isMine()) {
						event.dialog.style.display = 'none';
					}
					var next = player.chooseButton(true).set('dialog', event.videoId);
					next.set('ai', function (button) {
						return 1;
					});
					'step 1'
					if (player.isOnline2()) {
						player.send('closeDialog', event.videoId);
					}
					event.dialog.close();
					delete _status.noclearcountdown;
					if (!_status.noclearcountdown) {
						game.stopCountChoose();
					}
					if (result.bool) {
						player.getHistory('custom').push({ card: event.links.card, PSshen_huashen_use: true });
						const cardname = 'huashen_card_' + result.links[0];
						lib.card[cardname] = {
							fullimage: true,
							image: 'character:' + result.links[0]
						}
						lib.translate[cardname] = get.rawName2(result.links[0]);
						player.showCards(game.createCard(cardname, '', ''));
						lib.skill.PSshen_huashen.removeHuashen(player, result.links.slice(0));
						player.syncStorage('PSshen_huashen');
						player.updateMarks('PSshen_huashen');
					}
				},
				hiddenCard: function (player, name) {
					if (!lib.inpile.includes(name)) return false;
					var type = get.type2(name);
					return (type == 'basic' || type == 'trick') && player.storage.PSshen_huashen.character.length && player.storage.PSshen_huashen.invalid;
				},
				ai: {
					combo: "PSshen_jihun",
					fireAttack: true,
					respondSha: true,
					respondShan: true,
					skillTagFilter: function (player) {
						if (!player.storage.PSshen_huashen.character.length || !player.storage.PSshen_huashen.invalid) return false;
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
			},
		},
		init: function (player, skill) {
			if (!player.storage[skill]) player.storage[skill] = {
				character: [],
				map: {},
			}

			player.flashAvatar = () => { };
			player.setAvatar = () => { };
			player.setAvatarQueue = () => { };
			player.setBackgroundImage = () => { };

			player.when('dieBegin').then(() => {
				const name = player.name ? player.name : player.name1;
				if (name) {
					const sex = get.character(name, 0);
					const group = get.character(name, 1);
					if (player.sex != sex) {
						game.broadcastAll((player, sex) => {
							player.sex = sex;
						}, player, sex);
						player.changeSkin("PSshen_huashen", "PSshen_zuoci");
						// player.setAvatar('PSshen_zuoci', 'PSshen_zuoci', true, true);
						game.log(player, '将性别变为了', '#y' + get.translation(sex) + '性');
					}
					if (player.group != group) player.changeGroup(group);
				}
			});
		},
		banned: ["lisu", "sp_xiahoudun", "xushao", "jsrg_xushao", "zhoutai", "old_zhoutai", "shixie", "xin_zhoutai", "dc_shixie", "old_shixie"],
		bannedType: [/* "Charlotte", */ "主公技", "隐匿技",  /* "觉醒技", "限定技", "使命技" */],
		addHuashen: function (player) {
			if (!player.storage.PSshen_huashen) return;
			if (!_status.characterlist) {
				lib.skill.pingjian.initList();
			}
			_status.characterlist.randomSort();
			for (let i = 0; i < _status.characterlist.length; i++) {
				let name = _status.characterlist[i];
				if (name.indexOf('zuoci') != -1 || name.indexOf('key_') == 0 || name.indexOf('sp_key_') == 0 /* || get.is.double(name) */ || lib.skill.PSshen_huashen.banned.includes(name) || player.storage.PSshen_huashen.character.includes(name)) continue;
				let skills = lib.character[name][3].filter(skill => {
					const categories = get.skillCategoriesOf(skill);
					return !categories.some(type => lib.skill.PSshen_huashen.bannedType.includes(type));
				})
				if (skills.length) {
					player.storage.PSshen_huashen.character.push(name);
					player.storage.PSshen_huashen.map[name] = skills;
					_status.characterlist.remove(name);
					return name;
				}
			}
		},
		addHuashens: function (player, num) {
			var list = [];
			for (var i = 0; i < num; i++) {
				var name = lib.skill.PSshen_huashen.addHuashen(player);
				if (name) list.push(name);
			}
			if (list.length) {
				player.syncStorage('PSshen_huashen');
				player.updateMarks('PSshen_huashen');
				game.log(player, '获得了', get.cnNumber(list.length) + '张', '#g魂');
				lib.skill.PSshen_huashen.drawCharacter(player, list);
			}
		},
		removeHuashen: function (player, links) {
			player.storage.PSshen_huashen.character.removeArray(links);
			_status.characterlist.addArray(links);
			game.log(player, '移去了', get.cnNumber(links.length) + '张', '#g魂')
		},
		drawCharacter: function (player, list) {
			game.broadcastAll(function (player, list) {
				if (player.isUnderControl(true)) {
					var cards = [];
					for (var i = 0; i < list.length; i++) {
						var cardname = 'huashen_card_' + list[i];
						lib.card[cardname] = {
							fullimage: true,
							image: 'character:' + list[i]
						}
						lib.translate[cardname] = get.rawName2(list[i]);
						cards.push(game.createCard(cardname, '', ''));
					}
					player.$draw(cards, 'nobroadcast');
				}
			}, player, list);
		},
		"$createButton": function (item, type, position, noclick, node) {
			node = ui.create.buttonPresets.character(item, 'character', position, noclick);
			const info = lib.character[item];
			const skills = info[3].filter(function (skill) {
				const categories = get.skillCategoriesOf(skill);
				return !categories.some(type => lib.skill.PSshen_huashen.bannedType.includes(type));
			});
			if (skills.length) {
				const skillstr = skills.map(i => `[${get.translation(i)}]`).join('<br>');
				const skillnode = ui.create.caption(
					`<div class="text" data-nature=${get.groupnature(info[1], 'raw')
					}m style="font-family: ${(lib.config.name_font || 'xinwei')
					},xinwei">${skillstr}</div>`, node);
				skillnode.style.left = '2px';
				skillnode.style.bottom = '2px';
			}
			node._customintro = function (uiintro, evt) {
				const character = node.link, characterInfo = get.character(node.link);
				let capt = get.translation(character);
				if (characterInfo) {
					capt += `&nbsp;&nbsp;${get.translation(characterInfo[0])}`;
					let charactergroup;
					const charactergroups = get.is.double(character, true);
					if (charactergroups) charactergroup = charactergroups.map(i => get.translation(i)).join('/');
					else charactergroup = get.translation(characterInfo[1]);
					capt += `&nbsp;&nbsp;${charactergroup}`;
				}
				uiintro.add(capt);

				if (lib.characterTitle[node.link]) {
					uiintro.addText(get.colorspan(lib.characterTitle[node.link]));
				}
				for (let i = 0; i < skills.length; i++) {
					if (lib.translate[skills[i] + '_info']) {
						let translation = lib.translate[skills[i] + '_ab'] || get.translation(skills[i]).slice(0, 2);
						if (lib.skill[skills[i]] && lib.skill[skills[i]].nobracket) {
							uiintro.add('<div><div class="skilln">' + get.translation(skills[i]) + '</div><div>' + get.skillInfoTranslation(skills[i]) + '</div></div>');
						}
						else {
							uiintro.add('<div><div class="skill">【' + translation + '】</div><div>' + get.skillInfoTranslation(skills[i]) + '</div></div>');
						}
						if (lib.translate[skills[i] + '_append']) {
							uiintro._place_text = uiintro.add('<div class="text">' + lib.translate[skills[i] + '_append'] + '</div>')
						}
					}
				}
			}
			return node;
		},
		mark: true,
		intro: {
			onunmark: function (storage, player) {
				_status.characterlist.addArray(storage.character);
				storage.character = [];
			},
			mark: function (dialog, storage, player) {
				if (storage && storage.current) dialog.addSmall([[storage.current], (item, type, position, noclick, node) => lib.skill.PSshen_huashen.$createButton(item, type, position, noclick, node)]);
				if (storage && storage.current2) {
					for (var i = 0; i < storage.current2.length; i++) {
						dialog.add('<div><div class="skill">【' + get.translation(lib.translate[storage.current2[i] + '_ab'] || get.translation(storage.current2[i]).slice(0, 2)) + '】</div><div>' + get.skillInfoTranslation(storage.current2[i], player) + '</div></div>');
					}
				}
				if (storage && storage.character.length) {
					if (player.isUnderControl(true)) {
						dialog.addSmall([storage.character, (item, type, position, noclick, node) => lib.skill.PSshen_huashen.$createButton(item, type, position, noclick, node)]);
					}
					else {
						dialog.addText('共有' + get.cnNumber(storage.character.length) + '张“化身”');
					}
				}
				else {
					return '没有化身';
				}
			},
			content: function (storage, player) {
				return '共有' + get.cnNumber(storage.character.length) + '张“化身”'
			},
			markcount: function (storage, player) {
				if (storage && storage.character) return storage.character.length;
				return 0;
			},
		},
		"_priority": 0,
	},
	PSshen_jihun: {
		audio: "ext:PS武将/audio/skill:2",
		trigger: {
			player: "damageEnd",
			global: "dyingAfter",
		},
		frequent: true,
		filter(event, player, name) {
			if (!player.hasSkill('PSshen_huashen')) return false;
			if (name === "dyingAfter") return event.player !== player && event.player.isAlive() && !player.storage.PSshen_huashen.dyingAfter;
			return !player.storage.PSshen_huashen.damage;
		},
		content() {
			lib.skill.PSshen_huashen.addHuashens(player, 1);
		},
	},
	PSshen_xinsheng: {
		audio: "ext:PS武将/audio/skill:2",
		trigger: {
			player: "dieBefore",
		},
		forced: true,
		filter(event, player) {
			if (player.maxHp <= 0) return false;
			const storage = player.storage && player.storage.PSshen_huashen;
			if (!storage) return false;
			return !storage.invalid || !storage.damage || !storage.dyingAfter;
		},
		async content(event, trigger, player) {
			const choices = [], choiceList = [
				`将表象角色置入剩余武将牌堆，并变为本体武将`,
				`删去〖汲魂〗第一个获得“魂”的途径（当你受到伤害后）`,
				`删去〖汲魂〗第二个获得“魂”的途径（其他角色脱离濒死后）`,
			];
			const storage = player.storage.PSshen_huashen;

			if (!storage.invalid && storage.current) choices.push('选项一');
			else choiceList[0] = '<span style="opacity:0.5; ">' + choiceList[0] + '</span>';
			if (!storage.damage) choices.push('选项二');
			else choiceList[1] = '<span style="opacity:0.5; ">' + choiceList[1] + '</span>';
			if (!storage.dyingAfter) choices.push('选项三');
			else choiceList[2] = '<span style="opacity:0.5; ">' + choiceList[2] + '</span>';

			let control;
			if (choices.length === 1) {
				control = choices[0];
			} else if (choices.length > 1) {
				({ control } = await player.chooseControl(choices)
					.set('prompt', '新生：请选择一项')
					.set('choiceList', choiceList)
					.set('ai', () => {
						return choices.length - 1;
					})
					.forResult());
			}
			switch (control) {
				case '选项一':
					player.storage.PSshen_huashen.invalid = true;
					const name = player.name ? player.name : player.name1;
					if (name) {
						const sex = get.character(name, 0);
						const group = get.character(name, 1);
						if (player.sex != sex) {
							game.broadcastAll((player, sex) => {
								player.sex = sex;
							}, player, sex);
							game.log(player, '将性别变为了', '#y' + get.translation(sex) + '性');
						}
						if (player.group != group) await player.changeGroup(group);
					}
					player.changeSkin("PSshen_huashen", "PSshen_zuoci");
					// player.setAvatar('PSshen_zuoci', 'PSshen_zuoci', true, true);
					if (player.additionalSkills.PSshen_huashen && player.additionalSkills.PSshen_huashen.length) {
						await player.removeAdditionalSkills('PSshen_huashen');
					}
					game.log(player, '移去了表象武将', '#y' + get.translation(player.storage.PSshen_huashen.current));
					delete player.storage.PSshen_huashen.current;
					delete player.storage.PSshen_huashen.current2;
					break;
				case '选项二':
					player.storage.PSshen_huashen.damage = true;
					break;
				case '选项三':
					player.storage.PSshen_huashen.dyingAfter = true;
					break;
			}
			await player.recoverTo(!storage.disable + !storage.damage + !storage.dyingAfter + 1);
			trigger.cancel();
		},
	},
	PSshelian: {
		audio: "xinyongsi",
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		selectCard: [1, Infinity],
		discard: false,
		lose: false,
		delay: false,
		position: "h",
		complexCard: true,
		check: function (card) {
			var player = _status.event.player;
			if (get.cardsSuitsLength(ui.selected.cards, player) === 4) return 0;
			for (var i = 0; i < ui.selected.cards.length; i++) {
				if (get.suit(card) == get.suit(ui.selected.cards[i])) return 0;
			}
			return 1;
		},
		filter(event, player) {
			return player.countCards('h') > 0;
		},
		content() {
			'step 0'
			player.showCards(cards, get.translation(player) + '展示了部分手牌');
			'step 1'
			const list = Array.from({ length: 8 }, (_, i) => (i + 1).toString());
			const num = get.cardsSuitsLength(cards, player);
			player.chooseControl(list).set('prompt', '请选择要亮出牌堆顶的牌数').set('ai', () => {
				return _status.event.choice;
			}).set('choice', num - 2 + (player.awakenedSkills.includes('PSjixi') && num > 2));
			'step 2'
			if (result.control) {
				event.cardsx = get.cards(+result.control);
				const bool = get.cardsSuitsLength(cards, player) > get.cardsSuitsLength(event.cardsx);
				const prompt = `花色数${bool ? '<span class="greentext">小于</span>' : '<span class="firetext">不小于</span>'}${get.translation(player)}展示的手牌花色数`;
				player.showCards(event.cardsx, prompt);
				if (bool) {
					player.draw(event.cardsx.length);
				} else {
					player.loseHp();
				}
			}
		},
		ai: {
			order: 10,
			result: {
				player: function (player) {
					if (get.cardsSuitsLength(player.getCards(), player) <= 1) return -1;
					return 1;
				},
			}
		},
	},
	PSjixi: {
		derivation: "rewangzun",
		audio: "weidi",
		trigger: {
			player: "phaseJieshuBegin",
		},
		forced: true,
		filter: function (event, player) {
			if (player.phaseNumber < 3) return false;
			var num = 0;
			for (var i = player.actionHistory.length - 1; i >= 0; i--) {
				if (!player.actionHistory[i].isMe) continue;
				if (_status.globalHistory[i].changeHp.some(evt => evt.player == player && evt.getParent().name == 'loseHp' && evt.getParent(2).name == 'PSshelian')) return false;
				else {
					num++;
					if (num >= 3) break;
				}
			}
			return true;
		},
		skillAnimation: true,
		animationColor: "gray",
		unique: true,
		juexingji: true,
		content: function () {
			'step 0'
			player.awakenSkill('PSjixi');
			player.gainMaxHp();
			player.recover();
			'step 1'
			var str = '摸两张牌';
			var mode = get.mode();
			var choice = '选项一';
			if (mode == 'identity' || (mode == 'versus' && _status.mode == 'four')) {
				var list = [];
				var zhu = get.zhu(player);
				if (zhu && zhu != player && zhu.skills) {
					for (var i = 0; i < zhu.skills.length; i++) {
						if (lib.skill[zhu.skills[i]] && lib.skill[zhu.skills[i]].zhuSkill) {
							list.push(zhu.skills[i]);
						}
					}
				}
				if (list.length) {
					str += '并获得技能' + get.translation(list);
					event.list = list;
					choice = '选项二';
				}
			}
			player.chooseControl(function (event, player) {
				return _status.event.choice;
			}).set('choiceList', ['获得技能〖妄尊〗', str]).set('choice', choice);
			'step 2'
			if (result.control == '选项一') {
				player.addSkills('rewangzun');
			}
			else {
				player.draw(2);
				if (event.list) {
					player.addSkills(event.list);
					game.broadcastAll(function (list) {
						game.expandSkills(list);
						for (var i of list) {
							var info = lib.skill[i];
							if (!info) continue;
							if (!info.audioname2) info.audioname2 = {};
							info.audioname2.old_yuanshu = 'weidi';
						}
					}, event.list);
				}
			}
		},
		"_priority": 0,
	},
	PSlvli: {
		audio: "lvli",
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		filter: function (event, player, name) {
			if (name == "damageEnd" && !player.storage.PSbeishui) return false;
			var stat = player.getStat().skill;
			if (!stat.PSlvli) stat.PSlvli = 0;
			if (stat.PSlvli > 0 && !player.storage.PSchoujue) return false;
			if (player.hp == player.countCards("h")) return false;
			if (player.hp < player.countCards("h") && player.isHealthy()) return false;
			return true;
		},
		content: function () {
			var stat = player.getStat().skill;
			stat.PSlvli++;
			var num = player.hp - player.countCards("h");
			if (num > 0) player.draw(num);
			else player.recover(-num);
		},
		"_priority": 0,
	},
	PSchoujue: {
		audio: "choujue",
		derivation: ["PSbeishui", "PSqingjiao"],
		trigger: {
			global: "phaseAfter",
		},
		skillAnimation: true,
		animationColor: "water",
		unique: true,
		juexingji: true,
		forced: true,
		init: function (player, skill) {
			if (!player.storage[skill]) player.storage[skill] = false;
		},
		filter: function (event, player) {
			if (player.storage.PSchoujue) return false;
			return player.maxHp > 4;
		},
		content: function () {
			player.awakenSkill("PSchoujue");
			player.storage.PSchoujue = true;
			player.addSkills("PSbeishui");
		},
		"_priority": 0,
	},
	PSbeishui: {
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		audio: "beishui",
		skillAnimation: "epic",
		animationColor: "thunder",
		unique: true,
		juexingji: true,
		forced: true,
		init: function (player, skill) {
			if (!player.storage[skill]) player.storage[skill] = false;
		},
		filter: function (event, player) {
			if (player.storage.PSbeishui) return false;
			return player.hp >= 3;
		},
		content: function () {
			player.awakenSkill("PSbeishui");
			player.storage.PSbeishui = true;
			player.addSkills("PSqingjiao");
		},
		"_priority": 0,
	},
	PSqingjiao: {
		audio: "qingjiao",
		trigger: {
			player: "phaseDrawBegin2",
		},
		forced: true,
		preHidden: true,
		filter: function (event, player) {
			return !event.numFixed;
		},
		content: function () {
			trigger.num += 2;
		},
		mod: {
			cardUsable: function (card, player, num) {
				if (card.name == "sha") return num + 1;
			},
			targetInRange: function (card) {
				if (card.name == 'sha') return true;
			},
		},
		ai: {
			threaten: 1.5,
			unequip: true,
			"unequip_ai": true,
			skillTagFilter: function (player, tag, arg) {
				if (
					arg &&
					arg.name == "sha"
				)
					return true;
				return false;
			},
		},
	},
	PSrebolan: {
		audio: 'bolan',
		banned: ["kotomi_chuanxiang"],
		global: "PSrebolan_g",
		initList(player) {
			var list,
				skills = [];
			if (get.mode() == "guozhan") {
				list = [];
				for (var i in lib.characterPack.mode_guozhan) {
					if (lib.character[i]) list.push(i);
				}
			} else if (_status.connectMode) list = get.charactersOL();
			else {
				list = [];
				for (var i in lib.character) {
					if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) continue;
					list.push(i);
				}
			}
			for (var i of list) {
				if (i.indexOf("gz_jun") == 0) continue;
				for (var j of lib.character[i][3]) {
					if (j == "PSrebolan") continue;
					var skill = lib.skill[j];
					if (!skill || skill.juexingji || skill.hiddenSkill || skill.zhuSkill || skill.dutySkill || skill.chargeSkill || lib.skill.PSrebolan.banned.includes(j)) continue;
					if (skill.init || (skill.ai && (skill.ai.combo || skill.ai.notemp || skill.ai.neg))) continue;
					var info = lib.translate[j + "_info"];
					if (info && info.indexOf("出牌阶段") != -1) skills.add(j);
				}
			}
			player.storage.PSrebolan = skills;
		},
		enable: "phaseUse",
		usable: 2,
		async content(event, trigger, player) {
			if (!player.isIn()) {
				return;
			}
			if (!player.storage.PSrebolan) lib.skill.PSrebolan.initList(player);
			const list = player.storage.PSrebolan.randomGets(6);
			if (!list.length) {
				return;
			}
			const { control } = await player
				.chooseControl(list)
				.set(
					"choiceList",
					list.map(function (i) {
						return '<div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, player) + "</div>";
					})
				)
				.set("displayIndex", false)
				.set("prompt", "博览：请选择你要获得的技能")
				.set("ai", () => {
					var list = _status.event.controls.slice();
					return list.sort((a, b) => {
						return get.skillRank(b, "in") - get.skillRank(a, "in");
					})[0];
				})
				.forResult();
			const { bool, targets } = await player
				.chooseTarget(`令一名角色获得【${get.translation(control)}】直到其回合结束`, function (card, player, target) {
					return true;
				})
				.set('ai', function (target) {
					return get.attitude(_status.event.player, target) > 0;
				})
				.forResult();
			if (bool) {
				targets[0].addTempSkills(control, { player: "phaseEnd" });
				targets[0].popup(control);
			}
			// game.log(player,'获得了','#g【'+get.translation(result.control)+'】');
		},
		ai: {
			threaten: 0.9,
		},
		subSkill: {
			g: {
				audio: "bolan",
				forceaudio: true,
				enable: "phaseUse",
				usable: 1,
				prompt: "出牌阶段限一次。你可以令一名有〖博览〗的角色从六个描述中包含“出牌阶段”的技能中选择一个，你获得此技能直到此阶段结束。",
				filter: function (event, player) {
					return game.hasPlayer(function (current) {
						return current != player && current.hasSkill("PSrebolan");
					});
				},
				filterTarget: function (card, player, target) {
					return player != target && target.hasSkill("PSrebolan");
				},
				selectTarget: function () {
					if (
						game.countPlayer(current => {
							return lib.skill.PSrebolan_g.filterTarget(null, _status.event.player, current);
						}) == 1
					)
						return -1;
					return 1;
				},
				content: function () {
					"step 0";
					player.loseHp();
					"step 1";
					if (target.isIn() && player.isIn()) {
						if (!target.storage.PSrebolan) lib.skill.PSrebolan.initList(target);
						var list = target.storage.PSrebolan.randomGets(6);
						if (!list.length) {
							event.finish();
							return;
						}
						target
							.chooseControl(list)
							.set(
								"choiceList",
								list.map(function (i) {
									return '<div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, player) + "</div>";
								})
							)
							.set("displayIndex", false)
							.set("prompt", "博览：请选择令" + get.translation(player) + "获得的技能")
							.set("ai", () => {
								var list = _status.event.controls.slice();
								return list.sort((a, b) => {
									return (get.skillRank(b, "in") - get.skillRank(a, "in")) * get.attitude(_status.event.player, _status.event.getParent().player);
								})[0];
							});
					} else event.finish();
					"step 2";
					target.line(player);
					player.addTempSkills(result.control, "phaseUseEnd");
					player.popup(result.control);
				},
				ai: {
					order: function (item, player) {
						if (player.hp >= 5 || player.countCards("h") >= 10) return 10;
						var list = game.filterPlayer(current => lib.skill.PSrebolan_g.filterTarget(null, player, current));
						for (var target of list) {
							if (get.attitude(target, player) > 0) return 10;
						}
						return 4;
					},
					result: {
						player: function (player, target) {
							if (player.hasUnknown()) return player.hp + player.countCards("h") / 4 - 5 > 0 ? 1 : 0;
							var tao = player.countCards("h", "tao");
							if (player.hp + tao > 4) return 4 + get.attitude(player, target);
							if (player.hp + tao > 3) return get.attitude(player, target) - 2;
							return 0;
						},
					},
				},
				sub: true,
				"_priority": 0,
			},
		},
		"_priority": 0,
	},
	PSguangu: {
		audio: 'clanguangu',
		trigger: {
			global: ["useSkillAfter", "logSkill"],
		},
		usable: 1,
		filter(event, player) {
			if (player.hp <= 0) return false;
			if (event.type != "player") return false;
			var skill = event.sourceSkill || event.skill;
			var info = get.info(skill);
			if (info.charlotte) return false;
			var translation = get.skillInfoTranslation(skill, event.player);
			if (!translation) return false;
			var match = translation.match(/“?出牌阶段/g);
			if (!match || match.every(value => value != "出牌阶段")) return false;
			return game.hasPlayer(current => {
				return current.countCards("h");
			});
		},
		check(event, player) {
			return true;
		},
		async cost(event, trigger, player) {
			const num = parseInt(player.hp) || 1;
			event.result = await player
				.chooseTarget(get.prompt("PSguangu"), `观看一名角色至多${get.cnNumber(num)}张牌`, function (card, player, target) {
					return target.countCards("h");
				})
				.set('ai', function (target) {
					const att = get.attitude(_status.event.player, target);
					return 1 + Math.abs(att) - att;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const num = parseInt(player.hp) || 1;

			const { cards } = await player
				.choosePlayerCard(target, "h", true, [1, num])
				.set("prompt", `观骨：观看${get.translation(target)}的至多${get.cnNumber(num)}张牌`)
				.set("ai", button => {
					if (ui.selected.buttons.length >= _status.event.num) return 0;
					return Math.random();
				})
				.set("num", num)
				.forResult();
			event.getParent().viewedCount = cards.length;

			const topCards = get.cards(num);
			const { moved } = await player
				.chooseToMove("观骨：与牌堆顶交换任意牌")
				.set('list', [
					["牌堆顶", topCards],
					[`${get.translation(target)}的手牌`, cards],
				])
				.set('filterMove', function (from, to) {
					function handleGaintag(card) {
						setTimeout(() => {
							try {
								if (!card || !card.node) return;
								const source = card.link;
								const gaintag = get.owner(source) === target && _status.event.moved[0].includes(source);
								card.node.gaintag.innerHTML = gaintag ? '被交换' : get.owner(source) === target ? '未被交换' : '';
							} catch (e) { console.log(e); }
						}, 0)
					}
					handleGaintag(from);
					handleGaintag(to);
					return typeof to != 'number';
				})
				.set('processAI', function (list) {
					const player = _status.event.player;
					const target = _status.event.target;
					const cards = list[0][1].concat(list[1][1]).sort(function (a, b) {
						return get.attitude(player, target) >= 0
							? get.useful(a) - get.useful(b)
							: get.useful(b) - get.useful(a);
					}), cards2 = cards.splice(0, _status.event.num);
					return [cards2, cards];
				})
				.set('target', target)
				.set('num', num)
				.forResult();

			const loses = moved[0].slice(), gains = moved[1].slice();
			loses.removeArray(topCards);
			gains.removeArray(cards);
			if (loses.length) await target.lose(loses, ui.cardPile);
			if (gains.length) await target.gain(gains, "draw");

			const filterCards = cards.filter(card => !moved[1].includes(card) && player.hasUseTarget(card, null, false));
			if (!filterCards.length) {
				return
			}

			const { bool, links } = await player
				.chooseButton(["观骨：是否使用其中一张被交换的手牌？", filterCards])
				.set("filterButton", button => {
					return true;
				})
				.set("ai", button => {
					return get.useful(button.link);
				})
				.forResult();

			if (bool) {
				const card = links[0];
				const cardx = {
					name: get.name(card, get.owner(card)),
					nature: get.nature(card, get.owner(card)),
					cards: [card],
				};
				const next = player.chooseUseTarget(cardx, [card], true, false).set("oncard", card => {
					const owner = _status.event.getParent().owner;
					if (owner) owner.$throw(card.cards);
				});
				if (card.name === cardx.name && get.is.sameNature(card, cardx, true)) next.viewAs = false;
				const owner = get.owner(card);
				if (owner != player && get.position(card) == "h") {
					next.throw = false;
					next.set("owner", owner);
				}
			}
		},
		"_priority": 0,
	},
	PSnandou: {
		audio: "ext:PS武将/audio/skill:2",
		enable: ["chooseToUse", "chooseToRespond"],
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		onremove: true,
		filter: function (event, player) {
			// if (!player.countMark("spwuku") || !player.countCards("hse") || player.hasSkill("spmiewu2")) return false;
			if (!player.countCards("hse", card => get.type(card) === "basic")) return false;
			for (var i of lib.inpile) {
				var type = get.type2(i);
				if ((type == "trick") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) return true;
			}
			return false;
		},
		chooseButton: {
			dialog: function (event, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (get.type2(name) == "trick" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["锦囊", "", name]);
				}
				return ui.create.dialog("南斗", [list, "vcard"]);
			},
			check: function (button) {
				if (_status.event.getParent().type != "phase") return 1;
				var player = _status.event.player;
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup: function (links, player) {
				return {
					filterCard(card, player) {
						return get.type(card, player) == "basic";
					},
					// audio: "PSnandou",
					popname: true,
					log: false,
					check: function (card) {
						return 8 - get.value(card);
					},
					position: "hse",
					viewAs: { name: links[0][2], nature: links[0][3] },
					precontent: function () {
						player.logSkill("PSnandou");
						if (!player.storage.PSdaogu_nandou) {
							player.awakenSkill("PSnandou");
						}
					},
				};
			},
			prompt: function (links, player) {
				return "将一张基本牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		hiddenCard: function (player, name) {
			if (!lib.inpile.includes(name)) return false;
			var type = get.type2(name);
			return (type == "trick") && player.countCards("hse", card => get.type(card) === "basic") > 0;
		},
		ai: {
			fireAttack: true,
			skillTagFilter: function (player) {
				if (!player.countCards("hse", card => get.type(card) === "basic")) return false;
			},
			order: 1,
			result: {
				player: function (player) {
					return 1;
				},
			},
		},
		"_priority": 0,
	},
	PSbeidou: {
		audio: "ext:PS武将/audio/skill:2",
		enable: ["chooseToUse", "chooseToRespond"],
		limited: true,
		skillAnimation: true,
		animationColor: "water",
		onremove: true,
		filter: function (event, player) {
			if (!player.countCards("hse", card => get.type(card) === "equip")) return false;
			for (var i of lib.inpile) {
				var type = get.type(i);
				if ((type == "basic") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) return true;
			}
			return false;
		},
		chooseButton: {
			dialog: function (event, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (name == "sha") {
						if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["基本", "", "sha"]);
						for (var nature of lib.inpile_nature) {
							if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) list.push(["基本", "", "sha", nature]);
						}
					} else if (get.type(name) == "basic" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["基本", "", name]);
				}
				return ui.create.dialog("北斗", [list, "vcard"]);
			},
			check: function (button) {
				if (_status.event.getParent().type != "phase") return 1;
				var player = _status.event.player;

				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup: function (links, player) {
				return {
					filterCard(card, player) {
						return get.type(card, player) == "equip";
					},
					// audio: 2,
					popname: true,
					log: false,
					check: function (card) {
						return 8 - get.value(card);
					},
					position: "hse",
					viewAs: { name: links[0][2], nature: links[0][3] },
					precontent: function () {
						player.logSkill("PSbeidou");
						if (!player.storage.PSdaogu_beidou) {
							player.awakenSkill("PSbeidou");
						}
					},
				};
			},
			prompt: function (links, player) {
				return "将一张装备牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		hiddenCard: function (player, name) {
			if (!lib.inpile.includes(name)) return false;
			var type = get.type2(name);
			return (type == "basic") && player.countCards("hse", card => get.type(card) === "equip") > 0;
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter: function (player) {
				if (!player.countCards("hse", card => get.type(card) === "equip")) return false;
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
	},
	PSwuji: {
		audio: "ext:PS武将/audio/skill:2",
		enable: ["chooseToUse", "chooseToRespond"],
		filter: function (event, player) {
			if (!player.countCards("hse", card => get.type2(card) === "trick")) return false;
			for (var i of lib.inpile) {
				var type = get.type(i);
				if ((type == "basic") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) return true;
			}
			return false;
		},
		chooseButton: {
			dialog: function (event, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					const card = get.autoViewAs({ name }, "unsure");
					card.storage.PSwuji = true;
					if (name == "sha") {
						if (event.filterCard(card, player, event)) list.push(["基本", "", "sha"]);
						for (var nature of lib.inpile_nature) {
							const card = get.autoViewAs({ name, nature }, "unsure");
							card.storage.PSwuji = true;
							if (event.filterCard(card, player, event)) list.push(["基本", "", "sha", nature]);
						}
					} else if (get.type(name) == "basic" && event.filterCard(card, player, event)) list.push(["基本", "", name]);
				}
				return ui.create.dialog("武吉", [list, "vcard"]);
			},
			check: function (button) {
				if (_status.event.getParent().type != "phase") return 1;
				var player = _status.event.player;

				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup: function (links, player) {
				return {
					filterCard(card, player) {
						return get.type2(card, player) == "trick";
					},
					// audio: 2,
					popname: true,
					log: false,
					check: function (card) {
						return 8 - get.value(card);
					},
					position: "hse",
					viewAs: { name: links[0][2], nature: links[0][3], storage: { PSwuji: true } },
					precontent: function () {
						player.logSkill("PSwuji");
					},
				};
			},
			prompt: function (links, player) {
				return "将一张锦囊牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用（无次数限制）";
			},
		},
		hiddenCard: function (player, name) {
			if (!lib.inpile.includes(name)) return false;
			var type = get.type2(name);
			return (type == "basic") && player.countCards("hse", card => get.type2(card) === "trick") > 0;
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter: function (player) {
				if (!player.countCards("hse", card => get.type2(card) === "trick")) return false;
			},
			order: 1,
			result: {
				player: function (player) {
					if (_status.event.dying) return get.attitude(player, _status.event.dying);
					return 1;
				},
			},
		},
		mod: {
			cardUsable: function (card, player, num) {
				if (card.storage && card.storage.PSwuji) return Infinity;
			},
		},
		"_priority": 0,
	},
	PSdaogu: {
		audio: "ext:PS武将/audio/skill:2",
		trigger: {
			player: ["logSkill", "useSkillAfter"]
		},
		forced: true,
		init(player) {
			if (!player.storage.PSdaogu_count) player.storage.PSdaogu_count = 3;
		},
		filter(event, player) {
			const num = player.storage.PSdaogu_count;
			if (event.skill === "PSdaogu") return false;
			const skills = player.getSkills(true, false, false).filter(skill => !skill.startsWith("player_when_") && skill !== "PSdaogu");
			if (!skills.includes(event.skill)) return false;
			return player.getAllHistory('useSkill', evt => skills.includes(evt.skill)).length % num === 0;
		},
		getResetableSkills(current) {
			const skills = current.getSkills(true, false, false).filter(skill => !skill.startsWith("player_when_"));
			game.expandSkills(skills);
			const resetSkills = [];
			const suffixs = ["used", "round", "block", "blocker"];
			for (const skill of skills) {
				var info = get.info(skill);
				if (skill === 'PSnandou' && !current.storage.PSdaogu_nandou) {
					resetSkills.add(skill);
				}
				if (skill === 'PSbeidou' && !current.storage.PSdaogu_beidou) {
					resetSkills.add(skill);
				}
				if (typeof info.usable == "number") {
					if (current.hasSkill("counttrigger") && current.storage.counttrigger[skill] && current.storage.counttrigger[skill] >= 1) {
						resetSkills.add(skill);
					}
					if (typeof get.skillCount(skill) == "number" && get.skillCount(skill) >= 1) {
						resetSkills.add(skill);
					}
				}
				if (info.round && current.storage[skill + "_roundcount"]) {
					resetSkills.add(skill);
				}
				if (current.storage[`temp_ban_${skill}`]) {
					resetSkills.add(skill);
				}
				if (Object.keys(current.disabledSkills).includes(skill)) {
					resetSkills.add(skill);
				}
				if (current.awakenedSkills.includes(skill)) {
					resetSkills.add(skill);
				}
				for (var suffix of suffixs) {
					if (current.hasSkill(skill + "_" + suffix)) {
						resetSkills.add(skill);
					}
				}
			}
			return resetSkills;
		},
		resetSkill(player, skill) {
			const info = get.info(skill);
			const suffixs = ["used", "round", "block", "blocker"];
			if (typeof info.usable == "number") {
				if (player.hasSkill("counttrigger") && player.storage.counttrigger[skill] && player.storage.counttrigger[skill] >= 1) {
					delete player.storage.counttrigger[skill];
				}
				if (typeof get.skillCount(skill) == "number" && get.skillCount(skill) >= 1) {
					delete player.getStat("skill")[skill];
				}
			}
			if (info.round && player.storage[skill + "_roundcount"]) {
				delete player.storage[skill + "_roundcount"];
			}
			if (player.storage[`temp_ban_${skill}`]) {
				delete player.storage[`temp_ban_${skill}`];
			}
			if (Object.keys(player.disabledSkills).includes(skill)) {
				player.enableSkill(skill);
			}
			if (player.awakenedSkills.includes(skill)) {
				player.restoreSkill(skill);
			}
			for (var suffix of suffixs) {
				if (player.hasSkill(skill + "_" + suffix)) {
					player.removeSkill(skill + "_" + suffix);
				}
			}
			const str = "【" + get.translation(skill) + "】、";
			if (skill === 'PSnandou') {
				player.storage.PSdaogu_nandou = true;
			}
			if (skill === 'PSbeidou') {
				player.storage.PSdaogu_beidou = true;
			}
			/* if (['PSnandou', 'PSbeidou'].includes(skill)) {
				player.storage.PSdaogu = true;
			} */
			game.log(player, "重置了技能", "#g" + str);
		},
		async content(event, trigger, player) {
			const choiceList = [
				`失去你的一个技能，然后令〖道骨〗描述中【】内的数子-1（当前数字：${player.storage.PSdaogu_count}）`,
				'重置或恢复场上的一个技能（若为〖南斗〗或〖北斗〗，则改为重置并失去限定技标签）',
				'随机获得场上的一个技能，直到本回合结束',
			];
			const choices = [
				'选项一',
				'选项二',
				'选项三',
			];
			const getResetableSkills = lib.skill[event.name].getResetableSkills;
			const resetSkill = lib.skill[event.name].resetSkill;

			/* if (!player.getSkills(true, false, false).filter(skill => !skill.startsWith("player_when_")).length || player.storage.PSdaogu_count <= 1) {
				choices.remove('选项一');
				choiceList[0] = '<span style="opacity:0.5; ">' + choiceList[0] + "</span>";
			} */
			if (game.players.every(cur => getResetableSkills(cur).length === 0)) {
				choices.remove('选项二');
				choiceList[1] = '<span style="opacity:0.5; ">' + choiceList[1] + "</span>";
			}
			if (game.players.flatMap(cur => cur.getSkills(true, false, false).filter(skill => !skill.startsWith("player_when_"))).every(skill => player.hasSkill(skill))) {
				choices.remove('选项三');
				choiceList[2] = '<span style="opacity:0.5; ">' + choiceList[2] + "</span>";
			}

			let control;
			if (choices.length === 1) {
				control = choices[0];
			} else if (choices.length > 1) {
				({ control } = await player.chooseControl(choices)
					.set('choiceList', choiceList)
					.set('ai', () => {
						if (player.getSkills(true, false, false).filter(skill => !skill.startsWith("player_when_")) >= 3) return '选项一';
						else if ((!player.storage.PSdaogu_nandou || !player.storage.PSdaogu_beidou) && choices.includes('选项二')) return '选项二';
						return choices.at(-1);
					})
					.forResult());
			} else {
				return;
			}

			player.logSkill(event.name);
			switch (control) {
				case '选项一': {
					const { control } = await player
						.chooseControl(player.getSkills(true, false, false).filter(skill => !skill.startsWith("player_when_")))
						.set('ai', () => {
							const choices = get.event().controls.slice().remove('PSdaogu');
							return choices.randomGet();
						})
						.set('prompt', '请选择要失去的技能')
						.forResult();
					await player.removeSkills(control);
					if (player.storage.PSdaogu_count > 1) player.storage.PSdaogu_count--;
					break;
				}
				case '选项二': {
					const { targets } = await player.chooseTarget('请选择要重置或恢复技能的角色', true)
						.set('filterTarget', (card, player, target) => {
							return getResetableSkills(target).length > 0;
						})
						.set('ai', (target) => {
							const att = get.attitude(player, target);
							if (att <= 0) return 0;
							return att;
						})
						.forResult();
					const target = targets[0];
					const { control } = await player
						.chooseControl(target.getSkills(true, false, false).filter(skill => !skill.startsWith("player_when_")).filter(skill => getResetableSkills(player).includes(skill)))
						.set('ai', () => {
							const choices = get.event().controls;
							return choices.randomGet();
						})
						.set('prompt', '请选择要重置或恢复技能')
						.forResult();
					resetSkill(target, control);
					break;
				}
				case '选项三': {
					const skill = game.players.flatMap(cur => cur.getSkills(true, false, false).filter(skill => !skill.startsWith("player_when_"))).filter(skill => !player.hasSkill(skill)).randomGet();
					player.addTempSkills(skill, { player: "phaseEnd" }).set('$handle', (player, add, remove, event) => {
						player.popup(add[0]);
					});
				}
			}
		}
	},
	PSfaxiao: {
		// audio: "ext:PS武将/audio/skill:true",
		trigger: {
			player: ["loseAfter", "damageEnd"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		frequent: true,
		preHidden: true,
		zhuanhuanji: true,
		mark: true,
		marktext: "☯",
		intro: {
			mark(dialog, storage, player) {
				if (storage) {
					const skill = player.storage.PSfaxiao_pending;
					if (skill) {
						dialog.addText(`当你受到伤害后，或当你于回合外失去牌后，你获得技能〖${get.translation(skill)}〗。若已获得该技能，则：若因伤害触发，则对所有其他角色各造成一点伤害，否则弃置所有其他角色各一张牌。`, false);
						dialog.add('<div><div class="skill">【' + get.translation(lib.translate[skill + "_ab"] || get.translation(skill).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(skill, player) + "</div></div>");
					}
				} else {
					return "当你受到伤害后，或当你于回合外失去牌后，你可以念一句文本包含“哼”、“呵”、“哈”的台词（随机三个自选其一）。";
				}
			},
		},
		onremove(player) {
			delete player.storage.PSfaxiao;
			delete player.storage.PSfaxiao_pending;
		},
		filter(event, player, name) {
			if (name === "damageEnd") return event.num > 0;
			if (player == _status.currentPhase) return false;
			if (event.name == "gain" && event.player == player) return false;
			const evt = event.getl(player);
			return evt && evt.cards2 && evt.cards2.length > 0;
		},
		async content(event, trigger, player) {
			player.changeZhuanhuanji("PSfaxiao");
			if (player.storage.PSfaxiao) {
				const map = lib.skill.PSfaxiao.getMap(),
					list = Object.keys(map);
				if (list.length > 0) {
					const skill = list.randomGet(),
						voiceMap = game.parseSkillTextMap(skill, map[skill]);
					player.storage.PSfaxiao_pending = skill;
					for (let data of voiceMap) {
						if (!data.text) continue;
						if (/[哼呵哈]/.test(data.text)) {
							player.chat(data.text);
							game.broadcastAll(file => game.playAudio(file), data.file);
							break;
						}
					}
				}
			} else {
				game.broadcastAll(file => game.playAudio(file), '../extension/PS武将/audio/skill/PSfaxiao');
				const skill = player.storage.PSfaxiao_pending;
				if (skill) {
					if (player.hasSkill(skill, null, false)) {
						const targets = game.filterPlayer(current => current != player).sortBySeat();
						if (event.triggername === "damageEnd") {
							player.line(targets, "fire");
							for (let target of targets) {
								if (target.isIn()) await target.damage();
							}
						} else {
							player.line(targets, "thunder");
							for (let target of targets) {
								if (target.isIn()) await player.discardPlayerCard('he', target, true);
							}
						}
					} else {
						await player.addAdditionalSkills('PSfaxiao', skill, true);
						player.popup(skill, 'fire');
					}
					delete player.storage.PSfaxiao_pending;
				} else {
					game.log(player, '没有技能可获得');
				}
			}
		},
		getMap() {
			if (!_status.PSfaxiao_map) {
				_status.PSfaxiao_map = {};
				let list;
				if (_status.connectMode) {
					list = get.charactersOL();
				} else {
					list = get.gainableCharacters();
				}
				list.forEach(name => {
					if (name !== "PShr_caocao") {
						const skills = get.character(name, 3);
						skills.forEach(skill => {
							const info = get.info(skill);
							if (!info || (info.ai && info.ai.combo)) return;
							const voices = game.parseSkillText(skill, name);
							if (skill in _status.PSfaxiao_map) {
								return;
							}
							if (voices.some(text => /[哼呵哈]/.test(text))) {
								_status.PSfaxiao_map[skill] = name;
							}
						});
					}
				});
			}
			return _status.PSfaxiao_map;
		},
	},
	PSshouye: {
		audio: "shouye",
		trigger: {
			global: "roundStart",
		},
		derivation: "PSxieshou",
		direct: true,
		async content(event, trigger, player) {
			await player.addTempSkills('PSxieshou', { global: "roundStart" });
			const { targets, bool } = await player.chooseTarget('是否令一名其他角色也获得技能〖协守〗？', lib.filter.notMe).set('ai', function (target) {
				var att = get.attitude(_status.event.player, target);
				if (att <= 0) return 0;
				return att;
			}).forResult();
			if (bool) {
				const target = targets[0];
				player.logSkill('PSshouye', target);
				await target.addTempSkills('PSxieshou', { global: "roundStart" });
			} else {
				player.logSkill('PSshouye');
			}
		},
		group: "PSshouye_onremove",
		subSkill: {
			onremove: {
				trigger: {
					global: "changeSkillsBegin",
				},
				forced: true,
				filter(event, player) {
					return event.removeSkill.includes("PSxieshou");
				},
				async content(event, trigger, player) {
					await trigger.player.recover();
				}
			},
		}
	},
	PSliezhi: {
		audio: "liezhi",
		trigger: {
			player: ["phaseBegin", "phaseEnd"],
		},
		filter(event, player) {
			return player.countDiscardableCards(player, "h") > 0 && player.hasUseTarget("wanjian");
		},
		check(event, player) {
			const friends = player.getFriends();
			const enemies = game.filterPlayer(cur => cur !== player).removeArray(friends);
			if (friends.length > enemies.length) return false;
			if (friends.some(cur => cur.getHp(true) <= 1)) return false;

			const basicNum = player.getDiscardableCards(player, "h", card => get.type(card) === 'basic').length;
			const trickNum = player.getDiscardableCards(player, "h", card => get.type2(card) === 'trick').length;
			const equipNum = player.getDiscardableCards(player, "h", card => get.type(card) === 'equip').length;
			const num = Math.min(basicNum, trickNum, equipNum);
			if (player.hasSkill('PSxieshou')) return num <= enemies.length + player.hp + 1;
			return num <= enemies.length + 1;
		},
		async content(event, trigger, player) {
			await player.chooseUseTarget("wanjian", true);
			const types = [];
			const basic = player.getDiscardableCards(player, "h", card => get.type(card) === 'basic');
			const trick = player.getDiscardableCards(player, "h", card => get.type2(card) === 'trick');
			const equip = player.getDiscardableCards(player, "h", card => get.type(card) === 'equip');
			if (trick.length) {
				types.push('trick');
			}
			if (equip.length) {
				types.push('equip');
			}
			if (basic.length) {
				types.push('basic');
			}
			const map = new Map([
				["trick", trick],
				["equip", equip],
				["basic", basic]
			]);

			let control;
			if (types.length === 1) {
				control = types[0];
			} else {
				({ control } = await player.chooseControl(types).set('ai', () => {
					let choices = get.event().controls.slice();
					choices.sort((a, b) => {
						map.get(a).length - map.get(b).length
					})
					return choices[0];
				}).set('prompt', '烈直：请弃置一种类型的所有手牌').forResult());
			}
			await player.discard(map.get(control));
		}
	},
	PSxieshou: {
		audio: "beizhan",
		mod: {
			targetEnabled(card, player, target, now) {
				if (card.name == "juedou") return false;
			},
			cardEnabled(card) {
				if (card.name == "juedou") return false;
			},
		},
		locked: true,
		trigger: {
			player: "loseAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player, name) {
			if (event.type != "discard" || event.getlx === false) return;
			var evt = event.getl(player);
			if (!evt || !evt.hs || !evt.hs.length) return false;
			for (var i = 0; i < evt.hs.length; i++) {
				if (get.position(evt.hs[i]) == "d") {
					return true;
				}
			}
			return false;
		},
		async cost(event, trigger, player) {
			const cards = [];
			const evt = trigger.getl(player);
			for (let i = 0; i < evt.hs.length; i++) {
				if (get.position(evt.hs[i], true) == "d") {
					cards.push(evt.hs[i]);
				}
			}
			const num = Math.min(player.getHp(true), cards.length);
			const { bool, links } = await player.chooseCardButton(`协守：是否将其中至多${get.cnNumber(num)}张牌交给同势力或拥有〖协守〗的角色`, false, cards, [1, num])
				.set("ai", function (button) {
					return 1;
				})
				.forResult();
			event.result = {
				bool,
				cards: links,
			};
		},
		async content(event, trigger, player) {
			const cards = event.cards;
			const { targets } = await player.chooseTarget('请选择获得牌的角色', true).set('filterTarget', function (card, player, target) {
				return target.hasSkill('PSxieshou') || target.group === player.group;
			})
				.set('ai', function (target) {
					return get.attitude(get.event().player, target);
				})
				.forResult();
			if (targets.length) {
				const target = targets[0];
				if (player === target) {
					target.gain(cards, 'gain2');
				} else {
					player.give(cards, target, 'giveAuto');
				}
			}
		},
		group: "PSxieshou_else",
		subSkill: {
			else: {
				audio: "beizhan",
				trigger: {
					player: ["useCardEnd", "respondEnd"],
				},
				filter(event, player, name) {
					if (!game.hasPlayer(cur => cur.hasSkill('PSxieshou') && cur !== player)) return false;
					return name === "respondEnd" || (event.card && ["shan", "wuxie"].includes(get.name(event.card)));
				},
				async cost(event, trigger, player) {
					event.result = await player.chooseTarget('协守：是否令一名拥有〖协守〗的其他角色摸一张牌？').set('filterTarget', function (card, player, target) {
						return target.hasSkill('PSxieshou') && target !== player;
					})
						.set('ai', function (target) {
							return get.attitude(get.event().player, target);
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					await target.draw();
				}
			}
		}
	},
};

export default skills;
