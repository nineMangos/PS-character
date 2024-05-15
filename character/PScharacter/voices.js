const voices = {
	//PS赵襄变身前
	"#PSfanghun1": "凝傲雪之梅为魄，英魂长存，独耀山河万古明！",
	"#PSfanghun2": "铸凌霜之寒成剑，青锋出鞘，斩尽天下不臣贼！",
	"#PSfushi1": "逝者如斯，亘古长流，唯英烈之魂悬北斗而长存！",
	"#PSfushi2": "赵氏之女，跪祈诸公勿渡黄泉，暂留人间、佑大汉万年！",
	"#PSzhaoxiang": "世受国恩，今当以身殉国。",

	//PS赵襄变身后
	"#PSfanghun_PSzhaoxiang21": "当年明月凝霜刃，此日送尔渡黄泉！",
	"#PSfanghun_PSzhaoxiang22": "已识万里乾坤大，何虑千山草木青。",
	"#PSfushi_PSzhaoxiang21": "龙凤在侧，五虎在前，天命在汉，既寿永昌！",
	"#PSfushi_PSzhaoxiang22": "人言为信，日月为明，言日月为证，佑大汉长明！",
	"#PSzhaoxiang2": "大厦将倾，空余泪两行。",

	//PS徐氏
	"#PSfuzhu_achieve1": "汝等奸贼，何当今日丧命！",
	"#PSfuzhu_achieve2": "诛暴灭奸，平夫君之冤。",
	"#PSfuzhu_fail1": "未能除贼，愧对夫君。",
	"#PSfuzhu_fail2": "计划失策，恐难再有时机。",

	//PS凌操
	"#PSgudan1": "愿效忠勇，敢为先锋。",
	"#PSgudan2": "进军江夏，独破贼兵！",

	//PS孙权
	"#PShuiwan1": "多势纷争,须衡平制稳为上。",
	"#PShuiwan2": "不急一时，且看时局变化。",
	"#PShuiwan3": "多思多谋,筹谋长远。",

	//PS羽关神
	"#PShunwu1": "复活吧，我的爱人！",

	//PS卧龙诸葛
	"#PShuoji1": "业火炽燃，酬其宿债。",
	"#PShuoji2": "水中有火，乃焚敌军。",
	"#PSjiqiao1": "天地以下，八重以列。",
	"#PSjiqiao2": "随时而行，以正合，以奇胜。",
	"#PSpingnan1": "尔等宵小，岂能诈我。",
	"#PSpingnan2": "亮，早有成册在胸，主公大可放心。",

	//PS孟获
	"#PShuoshou1": "南中王孟获在此！",
	"#PShuoshou2": "哈哈！知道南中子弟的厉害了吧！",

	//PS赵云
	"#PShuwei1": "和我一起活着离开此地。",
	"#PShuwei2": "让我了结此战。",

	//PS吕布
	"#PSpanshi_use1": "赴汤蹈火，在所不辞。",
	"#PSpanshi_use2": "相助义父，共图大业。",
	"#PSpanshi1": "老贼，我与你势不两立！",
	"#PSpanshi2": "我堂堂大丈夫，安肯为汝之义子！",
	"#PSpanshi_kill1": "奉先我儿，为何如此啊！",
	"#PSpanshi_kill2": "奉先，何故变心？",

	//PS甄姬
	"#PSqingguo1": "商灵缤兮恭迎,伞盖纷兮若云。",
	"#PSqingguo2": "晨张兮细帷,夕茸兮兰櫋。",

	//PS刘备
	"#PSrende1": "仁义感民，德彰天下。",
	"#PSrende2": "曹魏倚天时，孙吴居地利，唯吾占人和。",

	//PS曹金玉
	"#PSshanshen1": "人家只想做安安静静的小淑女。",
	"#PSshanshen2": "雪花纷飞，独存寒冬。",
	"#PSxianjing1": "得父母之爱，享公主之礼遇。",
	"#PSxianjing2": "哼，可不要小瞧女孩子啊。",
	"#PSyuqi1": "玉儿摔倒了，要阿娘抱抱。",
	"#PSyuqi2": "这么漂亮的雪花，为什么只能在寒冬呢。",
	"#PScaojinyu": "娘亲，雪人不怕冷吗？",

	//PS神左慈
	"#PSshen_huashen1": "性本如空，化身万千。",
	"#PSshen_huashen2": "一念思量，化身无数。",
	"#PSshen_jihun1": "人死其魂，复归于气，汲其气修吾身。",
	"#PSshen_jihun2": "人有三魂，汲命魂，则敌休命。",
	"#PSshen_xinsheng1": "新生之犊，无求其故。",
	"#PSshen_xinsheng2": "醍醐灌顶，如临新生。",
	"#PSshen_zuoci": "道家不入轮回。",

	//PS梦刘备
	"#PSshiren1": "此战有将军在，方可胜。",
	"#PSshiren2": "蜀汉霸业，方需将军出战。",
	"#PStaoyuan1": "备，愿结交天下豪杰。",
	"#PStaoyuan2": "仁之所至,何吝外物。",

	//PS贾诩
	"#PSwansha1": "汝以孤立无援，乖乖领死吧。",
	"#PSwansha2": "且看你如何自救。",

	//PS关云长
	"#PSweizhen1": "狂徒！天下英雄闻我名无不丧胆，可惜我这青龙偃月刀，竟斩你这鼠辈的首级。",
	"#PSweizhen2": "我cnm。",
	"#PSweizhen3": "狂徒！我这青龙偃月刀竟斩你这鼠辈的首级。",
	"#PSweizhen4": "回去吧，你太老了。",

	//PS武张辽
	"#PSwu_zhenzhan1": "兵贵神速，随我来。",
	"#PSwu_zhenzhan2": "行包围之势，尽数诛之。",

	//PS孙尚香
	"#PSxiaoji1": "小女就爱这舞刀弄枪。",
	"#PSxiaoji2": "小看我，你可是要吃亏的。",

	//PS神荀彧
	"#PSzuoding1": "看我二桃杀三士。",
	"#PSzuoding2": "驱邪避恶，佑社稷黎民。",

	//PS神吕布...
	"#wushuang1": "哼！不自量力。",
	"#wushuang2": "纵横沙场，难逢敌手。",
	"#wushuang3": "修罗降世,神鬼辟易。",
	"#wushuang4": "仰云天降，修罗挥兵。",
	"#wushuang5": "尔等营狗之辈，如何配做本将军对手。",
	"#wushuang6": "天下武夫万千,皆非吾一合之将。",
	"#wushuang7": "画戟一击，五脏俱损。",
	"#wushuang8": "尔等凡夫，怎敌吾千钧之力！"
}

export default voices
