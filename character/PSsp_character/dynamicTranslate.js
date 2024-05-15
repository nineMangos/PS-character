const dynamicTranslate = {
	//野兽先辈〖恶臭〗动态翻译
	PSsp_echou: function (player) {
		if (player.storage.PSsp_juexing)
			return "当你造成伤害时，你可以将伤害值改为1919810，然后令目标角色的非锁定技和防具失效，直到伤害结算完毕。";
		return "当你造成伤害时，你可以将伤害值改为114514。";
	},
	//夜白〖邪门〗动态翻译
	PSsp_xiemen: function (player) {
		if (player.storage.PSsp_xiemen == true)
			return '①转换技，回合开始时，你可以展示并标记任意张花色各不相同的牌，若如此做，阴：本回合你将前等量个非摸牌阶段改为摸牌阶段；<span class="bluetext">阳：本回合你将前等量个非出牌阶段改为出牌阶段。</span><br>②当你失去因此标记的牌时，你摸一张牌。<br>③你的出牌阶段使用杀次数上限+X（X为你因此展示的牌数）';
		return '①转换技，回合开始时，你可以展示并标记任意张花色各不相同的牌，若如此做，<span class="bluetext">阴：本回合你将前等量个非摸牌阶段改为摸牌阶段；</span>阳：本回合你将前等量个非出牌阶段改为出牌阶段。<br>②当你失去因此标记的牌时，你摸一张牌。<br>③你的出牌阶段使用杀次数上限+X（X为你因此展示的牌数）';
	},
}

export default dynamicTranslate
