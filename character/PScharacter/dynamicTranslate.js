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
}

export default dynamicTranslate
