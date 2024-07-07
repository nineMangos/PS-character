const characterTranslation = {
	PSsp_jiugeshadiao: "九个鲨雕",
	PSsp_yebai: "夜白",
	PSsp_yeshou: "野兽先辈",
	PSsp_jiugemangguo: "九个芒果",
	PSsp_jiugechenpi: "九个陈皮",
	PSsp_huli: "狐狸",
}

const skillTranslation = {
	PSsp_pojin: "破筋",
	PSsp_pojin_info:
		"出牌阶段限一次，你可以将所有手牌当作无距离限制，无视防具，伤害基数为X，不计入次数且无次数限制的【杀】使用。若此【杀】对目标角色生效且未对其造成过伤害，你摸X张牌。（X为此【杀】对应的实体牌数）",
	PSsp_jiuchen: "九陈",
	PSsp_jiuchen_info:
		"结束阶段开始时，若你的手牌数为全场最少，你摸两张牌。",
	PSsp_sucai: "素材",
	PSsp_sucai_info:
		"游戏开始时，你获得四枚花色徽章（每花色各一枚），十三枚点数徽章（每点数各一枚），三张白板卡，以及四枚牌名徽章（每基本牌各一枚）。",
	PSsp_linggan: "灵感",
	PSsp_linggan_info:
		"每回合限一次，一张你参与的即时牌结算后，你获得对应牌名/花色/点数的徽章各一枚。（每个牌名/花色/点数的徽章最多持有一枚）",
	PSsp_nagao: "纳稿",
	PSsp_nagao_info:
		"准备阶段，或你受到伤害后，你可以摸一张牌并获得一张白板卡。（上限五张，已满则改为多摸一张牌）",
	PSsp_chongzu: "重组",
	PSsp_chongzu_info:
		"当你需要使用或打出牌时，可以用一张白板卡，以及其他每种徽章各一枚组成一张牌（以此法组成的牌称为“创生牌”）使用。目标角色可以依次质疑你使用的牌为创生牌。若有质疑的角色：若为且其猜对，此牌作废；若为且其猜错，你获得其一张牌或摸一张牌。",
	PSsp_chongzu_tag: "创生牌",
	PSsp_blank: "\u200d",
	PSsp_blank_info: "一张没有什么作用的牌。",
	PSsp_jiuzhuan: "九转",
	PSsp_jiuzhuan_info:
		"回合开始时，你可以调整本回合所有阶段的执行顺序。",
	PSsp_xiemen: "邪门",
	PSsp_xiemen_info:
		"①转换技，回合开始时，你可以展示并标记任意张花色各不相同的牌，若如此做，阴：本回合你将前等量个非摸牌阶段改为摸牌阶段；阳：本回合你将前等量个非出牌阶段改为出牌阶段。<br>②当你失去因此标记的牌时，你摸一张牌。<br>③你的出牌阶段使用杀次数上限+X（X为你因此展示的牌数）",
	PSsp_shadiao: "鲨雕",
	PSsp_shadiao_info:
		"你可以弃置X张花色不同的牌视为使用或打出任意即时牌（X为此技能发动的次数）。当X=4时，你可以摸两张牌，然后重置X的发动次数。锁定技，当X>4时，你对所有其他角色各造成1点伤害并摸造成伤害数的牌，然后重置X的发动次数。",
	PSsp_echou: "恶臭",
	PSsp_echou_info: "当你造成伤害时，你可以将伤害值改为114514。",
	PSsp_echou_1: "恶臭·升级",
	PSsp_echou_1_info:
		"当你造成伤害时，你可以将伤害值改为1919810，然后令目标角色的非锁定技和防具失效，直到伤害结算完毕。",
	PSsp_juexing: "撅醒",
	PSsp_juexing_info:
		"撅醒技，当你击杀一名角色后，你升级〖恶臭〗。",
	PSsp_jiuwei: "九尾",
	PSsp_jiuwei_info: "锁定技，当一张点数为3的倍数，或点数为7的牌进入弃牌堆时，你摸一张牌。",
	PSsp_mingshu: "命数",
	PSsp_mingshu_info: "狐狸技，当你即将受到伤害时，你可以获得一枚“屑”标记，并防止此次伤害。你的回合结束时，你移去所有的“屑”标记并弃置X张牌，然后若你弃置的牌数不足X，你失去Y点体力（X为“屑”标记数，Y为X与弃置牌数之差）。",
	PSsp_jiuming: "九命",
	PSsp_jiuming_info: "限定技，当你进入濒死状态时，你可以移去所有的“屑”标记并弃置所有手牌，然后增加一点体力上限，回复所有体力并摸三张牌。",
}

export { characterTranslation, skillTranslation }
