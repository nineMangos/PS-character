import { lib, game, ui, get, ai, _status } from '../../extension/noname.js'
import { characterSort, sortTranslation } from "./sort.js";
import character from "./character.js";
import characterIntro from "./characterIntro.js";
import characterReplace from "./characterReplace.js";
import characterFilter from "./characterFilter.js";
import characterSubstitute from "./characterSubstitute.js";
import skill from "./skill.js";
import { characterTranslation, skillTranslation } from './translate.js'
import voices from "./voices.js";
import dynamicTranslate from "./dynamicTranslate.js";

"use strict";
game.import("character", function (lib, game, ui, get, ai, _status) {
	var PScharacter = {
		name: "PScharacter",
		connect: true,
		characterSort,
		character,
		characterIntro, //武将介绍
		characterTitle: {}, //武将称号
		characterReplace, //武将切换
		characterFilter, //武将在特定模式下禁用
		characterSubstitute, //武将替换
		perfectPair: {}, //珠联璧合
		card: {},
		skill,
		translate: { ...sortTranslation, ...characterTranslation, ...skillTranslation, ...voices },
		dynamicTranslate
	};
	Object.keys(PScharacter.character).forEach(i => {
		window.PScharacter.characters.push(i);
		const character = PScharacter.character[i];
		character.trashBin.push(
			(lib.device || lib.node ? "ext:" : "db:extension-") + `PS武将/image/character/${i}.jpg`
		);
		if (!character.dieAudios.length) {
			character.dieAudios.push(`die:../audio/die/${i.replace("PS", "")}.mp3`);
		}
		if (i.includes("PS") && !PScharacter.translate[i + "_prefix"]) {
			lib.translate[i + "_prefix"] = i.includes("PSshen_") ? "PS神" : "PS";
		}
	})
	return PScharacter;
});

/* lib.config.all.characters.push("PScharacter"); //所有武将包
lib.config.all.sgscharacters.push("PScharacter"); //所有本体武将包，push后武将包不可被隐藏*/
/* lib.config.characters//开启的武将包 */
/* if (!lib.config.characters.includes("PScharacter"))
	lib.config.characters.remove("PScharacter"); */ //push后默认启用武将包
lib.translate["PScharacter_character_config"] = "PS武将";
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
if (!lib.config.characters.includes('武将包英文名')) lib.config.characters.remove('武将包英文名');//remove默认关闭，push默认开启
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
if (!lib.config.cards.includes('卡包英文名')) lib.config.cards.remove('卡包英文名');
lib.translate['卡包英文名_card_config'] = '卡包中文名'; */
