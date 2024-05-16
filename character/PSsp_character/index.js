import { lib, game, ui, get, ai, _status } from '../../extension/noname.js'
import character from "./character.js";
import card from "./card.js";
import characterTitle from "./characterTitle.js";
import { characterSort, sortTranslation } from "./sort.js";
import characterIntro from "./characterIntro.js";
import skill from "./skill.js";
import { characterTranslation, skillTranslation } from './translate.js'
import voices from "./voices.js";
import dynamicTranslate from "./dynamicTranslate.js";

"use strict";
game.import("character", function (lib, game, ui, get, ai, _status) {
	var PSsp_character = {
		name: "PSsp_character",
		connect: true,
		characterSort,
		character,
		characterIntro, //武将介绍
		characterTitle, //武将称号
		characterReplace: {}, //武将切换
		characterFilter: {}, //武将在特定模式下禁用
		perfectPair: {}, //珠联璧合
		card,
		skill,
		translate: { ...sortTranslation, ...characterTranslation, ...skillTranslation, ...voices },
		dynamicTranslate,
	};
	Object.keys(PSsp_character.character).forEach(i => {
		window.PScharacter.characters.push(i);
		const character = PSsp_character.character[i];
		character.trashBin.push(
			(lib.device || lib.node ? "ext:" : "db:extension-") + `PS武将/image/character/${i}.jpg`
		);
		if (!character.dieAudios.length) {
			character.dieAudios.push(`die:../audio/die/${i.replace("PS", "")}.mp3`);
		}
		if (i.includes("PS") && !PSsp_character.translate[i + "_prefix"]) {
			lib.translate[i + "_prefix"] = i.includes("PSshen_") ? "PS神" : "PS";
		}
	})
	return PSsp_character;
});

lib.config.all.characters.push("PSsp_character");
lib.translate["PSsp_character_character_config"] = "PS特殊武将";

