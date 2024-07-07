import { lib, game, ui, get, ai, _status } from "../../extension/noname.js";

const dynamicTranslate = {
	//PS徐氏〖问卦〗动态翻译
	PSwengua: function (player) {
		if (player.storage.PSfuzhu)
			return "其他角色/你的出牌阶段限一次，其可以交给你一张牌，(若当前回合角色为你，则跳过此步骤)，然后你与其/你从牌堆顶或牌堆底摸一张牌。你的问卦牌不计入手牌上限，当你失去问卦牌时，你摸一张牌。";
		return "其他角色/你的出牌阶段限一次，其可以交给你一张牌，(若当前回合角色为你，则跳过此步骤)，你可以将此牌/一张牌置于牌堆顶或牌堆底，然后你与其/你从另一端摸一张牌";
	},
	//PS周泰〖奋激〗动态翻译
	PSfenji: function (player) {
		var num = 2;
		if (player.getExpansions("PSbuqu").length)
			num += player.getExpansions("PSbuqu").length;
		return (
			"当一名角色的手牌不因赠予或交给而被其他角色获得后，或一名角色的手牌被其他角色弃置后，你可以令其摸" +
			get.cnNumber(num) +
			"张牌。"
		);
	},
	//PS生熏鱼〖灵策〗动态翻译
	PSlingce: function (player) {
		if (player.storage.PSdinghan)
			return "锁定技，当牌堆洗牌时，你观看牌堆顶8张牌，并从中获得至多六张牌，剩余的牌进入弃牌堆。";
		return "锁定技，当牌堆洗牌时，你观看牌堆顶8张牌，并从中获得牌名不同的牌，剩余的牌进入弃牌堆。";
	},
	//PS吕蒙〖攻心〗动态翻译
	PSgongxin: function (player) {
		if (player.storage.PSgongxin == true)
			return '转换技,出牌阶段限一次。<span class="bluetext">阳:你可以观看一名其他角色的手牌，然后获得其中任意张花色相同的牌。</span>阴:你可以观看一名其他角色的手牌,然后选择获得其中任意张花色不同的牌。每以此法获得一张牌，你移去一个“识”。结束阶段,若你的“识”小于5，你失去〖攻心〗。';
		return '转换技,出牌阶段限一次。阳:你可以观看一名其他角色的手牌，然后获得其中任意张花色相同的牌。<span class="bluetext">阴:你可以观看一名其他角色的手牌,然后选择获得其中任意张花色不同的牌。</span>每以此法获得一张牌，你移去一个“识”。结束阶段,若你的“识”小于5，你失去〖攻心〗。';
	},
	//PS神刘备〖龙怒〗动态翻译
	PSlongnu: function (player) {
		if (player.storage.PSlongnu == true)
			return '转换技，锁定技，<span class="bluetext">阳：出牌阶段开始时，你失去1点体力并摸一张牌，然后本阶段内你视为拥有技能〖怒斩〗，且你的红色手牌均视为火【杀】且无距离限制。</span>阴：出牌阶段开始时，你减1点体力上限并摸一张牌，然后本阶段内你然后本阶段内你视为拥有技能〖厉勇〗，且你的锦囊牌均视为雷【杀】且无使用次数限制。';
		return '转换技，锁定技，阳：出牌阶段开始时，你失去1点体力并摸一张牌，然后本阶段内你视为拥有技能〖怒斩〗，且你的红色手牌均视为火【杀】且无距离限制。<span class="bluetext">阴：出牌阶段开始时，你减1点体力上限并摸一张牌，然后本阶段内你然后本阶段内你视为拥有技能〖厉勇〗，且你的锦囊牌均视为雷【杀】且无使用次数限制。</span>';
	},
	//PS文鸯〖膂力〗动态翻译
	PSlvli: function (player) {
		const str1 = player.storage.PSchoujue ? '' : '每回合限一次，';
		const str2 = player.storage.PSbeishui ? '或受到' : '';
		return `${str1}当你造成${str2}伤害后，你可以将手牌摸至与体力值相同或将体力回复至与手牌数相同。`;
	},
	//PS神南华老仙〖道骨〗动态翻译
	PSnandou: function (player) {
		const str = player.storage.PSdaogu_nandou ? '' : '限定技，';
		return `${str}你可以将一张基本牌当作锦囊牌使用。`;
	},
	//PS神南华老仙〖道骨〗动态翻译
	PSbeidou: function (player) {
		const str = player.storage.PSdaogu_beidou ? '' : '限定技，';
		return `${str}你可以将一张装备牌当作基本牌使用。`;
	},
	//PS神左慈〖汲魂〗动态翻译
	PSshen_jihun: function (player) {
		let str1 = '你受到伤害后';
		let str2 = '其他角色脱离濒死状态后';
		if (player.storage.PSshen_huashen.damage) str1 = `<del>${str1}</del>`;
		if (player.storage.PSshen_huashen.dyingAfter) str2 = `<del>${str2}</del>`;
		return `当[${str1}]，或[${str2}]，你可以将剩余武将牌堆的一张牌置于武将牌上，称为“魂”。`;
	},
	//PS神南华老仙〖道骨〗动态翻译
	PSdaogu: function (player) {
		const num = player.storage.PSdaogu_count;
		return `锁定技，你每发动过【${num}】次技能（〖道骨〗除外），你选择一项：1、失去你的一个技能，然后将〖道骨〗描述中【】内的数字减1（至少为1）。2、重置或恢复场上的一个技能（若为〖南斗〗或〖北斗〗，则改为重置并失去限定技标签）。3、随机获得场上的一个技能，直到你下回合结束。`;
	},
	//华容曹操〖发笑〗动态翻译
	PSfaxiao: function (player) {
		if (!player.storage.PSfaxiao) return '转换技，当你受到伤害后，或当你于回合外失去牌后，<span class="bluetext">阳：你可以念一句文本包含“哼”、“呵”、“哈”的台词（随机三个自选其一）；</span>阴：你获得你上一次所念的台词所属的技能。若已获得该技能，则：若因伤害触发，则对所有其他角色各造成一点伤害，否则弃置所有其他角色各一张牌。';
		return '转换技，当你受到伤害后，或当你于回合外失去牌后，阳：你可以念一句文本包含“哼”、“呵”、“哈”的台词（随机三个自选其一）；<span class="bluetext">阴：你获得你上一次所念的台词所属的技能。若已获得该技能，则：若因伤害触发，则对所有其他角色各造成一点伤害，否则弃置所有其他角色各一张牌。</span>'
	},
}

export default dynamicTranslate
