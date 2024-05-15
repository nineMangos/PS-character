import { lib, game, ui, get, ai, _status } from '../extension/noname.js'

/* <-------------------------emotion互动功能-------------------------> */
//将emotion.json文件里的表情分类对象存入lib.emotionSort
lib.emotionSort = {};
game.PS_loadJsonFromFile('extension/PS武将/json/emotion.json', function (error, data) {
	if (error) {
		alert(error);
	} else {
		// console.log(data);
	}
}, lib.emotionSort);

//emotion高兴
lib.skill._emotion_happy = {
	trigger: {
		player: ["judgeEnd", "gainAfter", "chooseToCompareAfter", "compareMultipleAfter"],
		target: ["chooseToCompareAfter", "compareMultipleAfter"],
	},
	priority: 2,
	ruleSkill: true,
	forced: true,
	unique: true,
	popup: false,
	filter: function (event, player, name) {
		if (!lib.config.extension_PS武将_PS_hudong) return false;
		if (name === 'gainAfter') return event.getParent().name === 'draw' && event.getParent(2).name !== 'phaseDraw' && event.cards.length > 1;
		else if (["chooseToCompareAfter", "compareMultipleAfter"].includes(name)) {
			if (event.preserve) return false;
			if (player == event.player) {
				if (event.num1 > event.num2) {
					return !get.owner(event.card2);
				}
				else {
					return !get.owner(event.card1);
				}
			}
			else {
				if (event.num1 < event.num1) {
					return !get.owner(event.card1);
				}
				else {
					return !get.owner(event.card2);
				}
			}
		}
		else {
			if (event.card && event.card.viewAs) {
				return lib.card[event.card.viewAs].type === 'delay' && event.result.bool === true;
			}
			return event.card && get.type(event.card) === 'delay' && event.result.bool === true;
		}
	},
	emotion: function (exp) {
		let pack = [];
		let emotions = lib.emotionSort[exp];
		for (let key in emotions) {
			if (emotions.hasOwnProperty(key)) pack.add(key);
		}
		let emotion = pack.randomGet();
		let num = typeof emotions[emotion] === 'number' ? emotions[emotion] : emotions[emotion].randomGet();
		return [emotion, num];
	},
	content: function () {
		'step 0'
		if (player.name.includes('guojia')) {
			player.emotion('guojia_emotion', [3, 13, 18, 19].randomGet());
		}
		else if (player.name.includes('zhenji')) {
			player.emotion('zhenji_emotion', [2, 11, 13].randomGet());
		}
		else player.emotion(...lib.skill._emotion_happy.emotion('happy'));
		'step 1'
		let players = game.filterPlayer(current => {
			return current != player && get.attitude(player, current) < 0;
		}).sortBySeat();
		players.forEach(current => {
			if (current.name.includes('guojia')) {
				current.emotion('guojia_emotion', 4);
			}
			else if (current.name.includes('zhenji')) {
				current.emotion('zhenji_emotion', 19);
			}
			else {
				current.emotion(...lib.skill._emotion_happy.emotion('shock'));
			}
		});
	},
};

//emotion生气                   
lib.skill._emotion_angry = {
	trigger: {
		global: ["damageEnd", "gainAfter", "loseAfter", "loseAsyncAfter"],
	},
	ruleSkill: true,
	priority: 2,
	forced: true,
	unique: true,
	popup: false,
	filter: function (event, player) {
		if (!lib.config.extension_PS武将_PS_hudong) return false;
		if (event.name == 'damage') return event.num > 1 && event.source;
		if (event.name == 'lose') {
			if (event.type != 'discard' || !event.player.isIn()) return false;
			if ((event.discarder || event.getParent(2).player) == event.player) return false;
			if (!event.getl(event.player).cards.length) return false;
			return true;
		}
		else if (event.name == 'gain') {
			if (event.giver || event.getParent().name == '_yongjian_zengyu') return false;
			var cards = event.getg(event.player);
			if (!cards.length) return false;
			return game.hasPlayer(function (current) {
				if (current == event.player) return false;
				var hs = event.getl(current).cards;
				for (var i of hs) {
					if (cards.includes(i)) return true;
				}
				return false;
			});
		}
		else if (event.type == 'gain') {
			if (event.giver || !event.player || !event.player.isIn()) return false;
			var hs = event.getl(event.player).cards;
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
				return current != event.discarder && event.getl(current).cards.length > 0;
			});
		}
		return false;
	},
	content: function () {
		'step 0'
		let targets = [];
		if (trigger.name == 'damage') targets.push(trigger.player);
		if (trigger.name == 'gain') {
			var cards = trigger.getg(trigger.player);
			targets.addArray(game.filterPlayer(function (current) {
				if (current == trigger.player) return false;
				var hs = trigger.getl(current).cards;
				for (var i of hs) {
					if (cards.includes(i)) return true;
				}
				return false;
			}));
		}
		else if (trigger.name == 'loseAsync' && trigger.type == 'discard') {
			targets.addArray(game.filterPlayer(function (current) {
				return current != trigger.discarder && trigger.getl(current).cards.length > 0;
			}));
		}
		else targets.push(trigger.player);
		event.targets = targets.sortBySeat();
		if (!event.targets.length) event.finish();
		'step 1'
		event.targets.forEach(target => {
			if (target.name.includes('guojia')) {
				target.emotion('guojia_emotion', 8);
			}
			else if (target.name.includes('zhenji')) {
				target.emotion('zhenji_emotion', [12, 20].randomGet());
			}
			else target.emotion(...lib.skill._emotion_happy.emotion('angry'));
		});
	},
};

//emotion难过
lib.skill._emotion_sad = {
	trigger: {
		player: ["turnOverEnd", "phaseDrawSkipped", "phaseDrawCancelled", "phaseUseSkipped", "phaseUseCancelled"],
	},
	priority: -1,
	forced: true,
	ruleSkill: true,
	unique: true,
	popup: false,
	filter: function (event, player, name) {
		if (!lib.config.extension_PS武将_PS_hudong) return false;
		if (name === 'turnOverEnd') return player.isTurnedOver();
		return true;
	},
	content: function () {
		if (player.name.includes('guojia')) {
			player.emotion('guojia_emotion', [5, 9, 20].randomGet());
		}
		else if (player.name.includes('zhenji')) {
			player.emotion('zhenji_emotion', [10, 14, 19].randomGet());
		}
		else player.emotion(...lib.skill._emotion_happy.emotion('sad'));
	},
};

//emotion被雷击
lib.skill._emotion_thunderstruck = {
	trigger: {
		player: "damageEnd",
	},
	priority: 1,
	ruleSkill: true,
	forced: true,
	unique: true,
	popup: false,
	filter: function (event, player, name) {
		if (!lib.config.extension_PS武将_PS_hudong) return false;
		return event.nature === 'thunder' && event.num > 1;
	},
	content: function () {
		if (player.name.includes('guojia')) {
			player.emotion('guojia_emotion', 6);
		}
		else player.emotion(...lib.skill._emotion_happy.emotion('thunderstruck'));
	},
};

//emotion濒死
lib.skill._emotion_dying = {
	trigger: {
		player: "dying",
	},
	priority: 1,
	ruleSkill: true,
	forced: true,
	unique: true,
	popup: false,
	filter: function (event, player, name) {
		if (!lib.config.extension_PS武将_PS_hudong) return false;
		return true;
	},
	content: function () {
		if (player.name.includes('guojia')) {
			player.emotion('guojia_emotion', 12);
		}
		else player.emotion(...lib.skill._emotion_happy.emotion('dying'));
	},
};

//emotion回复
lib.skill._emotion_recover = {
	trigger: {
		player: "recoverEnd",
	},
	priority: 1,
	ruleSkill: true,
	forced: true,
	unique: true,
	popup: false,
	filter: function (event, player, name) {
		if (!lib.config.extension_PS武将_PS_hudong) return false;
		return event.num > 0;
	},
	content: function () {
		if (player.name.includes('guojia')) {
			player.emotion('guojia_emotion', 17);
		}
		if (player.name.includes('zhenji')) {
			player.emotion('zhenji_emotion', 3);
		}
		else player.emotion(...lib.skill._emotion_happy.emotion('recover'));
	},
};

//emotion得到馈赠
lib.skill._emotion_gain = {
	trigger: {
		player: "gainAfter",
	},
	priority: 1,
	ruleSkill: true,
	forced: true,
	unique: true,
	popup: false,
	filter: function (event, player) {
		if (!lib.config.extension_PS武将_PS_hudong) return false;
		return get.itemtype(event.source) == 'player' && event.bySelf != true;
	},
	content: function () {
		if (player.name.includes('guojia')) {
			player.emotion('guojia_emotion', 14);
		}
		if (player.name.includes('zhenji')) {
			player.emotion('zhenji_emotion', 2);
		}
		else player.emotion(...lib.skill._emotion_happy.emotion('gain'));
	},
};

//emotion阵亡
lib.skill._emotion_die = {
	trigger: {
		player: "die",
	},
	priority: 1,
	ruleSkill: true,
	forced: true,
	forceDie: true,
	unique: true,
	popup: false,
	filter: function (event, player) {
		if (!lib.config.extension_PS武将_PS_hudong) return false;
		return true;
	},
	content: function () {
		if (player.name.includes('guojia')) {
			player.emotion('guojia_emotion', 10);
		}
		if (player.name.includes('zhenji')) {
			player.emotion('zhenji_emotion', 15);
		}
		else player.emotion(...lib.skill._emotion_happy.emotion('die'));
	},
};

//emotion震惊
lib.skill._emotion_shock = {
	trigger: {
		player: "damageSource",
	},
	priority: 1,
	ruleSkill: true,
	forced: true,
	forceDie: true,
	unique: true,
	popup: false,
	filter: function (event, player) {
		if (!lib.config.extension_PS武将_PS_hudong) return false;
		return event.num > 2;
	},
	content: function () {
		let players = game.filterPlayer(current => {
			return current != player;
		}).sortBySeat();
		players.forEach(current => {
			if (current.name.includes('guojia')) {
				current.emotion('guojia_emotion', 4);
			}
			else if (current.name.includes('zhenji')) {
				current.emotion('zhenji_emotion', 19);
			}
			else {
				current.emotion(...lib.skill._emotion_happy.emotion('shock'));
			}
		});
	},
};
