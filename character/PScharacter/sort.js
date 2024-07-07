const characterSort = {
	//武将分类
	PScharacter: {
		PScharacter_wei: [
			"PScaocao",
			"PScaoying",
			"PSzhonghui",
			"PScaopi",
			"PSxuzhu",
			"PScaoren",
			"PSdianwei",
			"PSzhanghe",
			"PScaoxiu",
			"PScaoang",
			"PSshiniangongzhu",
			"PScaojinyu",
			"PScaochun",
			"PScaoshuang",
			"PShs_zhonghui",
			"PSxizhicai",
			"PSxiahoujie",
			"PSzhenji",
			"PSwu_zhangliao",
			"PShaozhao",
			"PSwenyang",
			"PShr_caocao"
		],
		PScharacter_shu: [
			"PSsh_zhangfei",
			"PSliubei",
			"PSmachao",
			"PShuangzhong",
			"PSliaohua",
			"PSchenshi",
			"PSlifeng",
			"PSzhangfei",
			"PSzhugeliang",
			"PSmenghuo",
			"PSshu_sunshangxiang",
			"PStongxiangge",
			"PSrs_wolong",
			"PShuangyueying",
			"PSzhaoxiang",
			"PSzhangsong",
			"PSguanyunchang",
			"PSzhaoyun",
			"PSzhuangbeidashi",
			"PSguanyu",
			"PSmeng_liubei"
		],
		PScharacter_wu: [
			"PSrexusheng",
			"PSluji",
			"PSlingcao",
			"PSreluxun",
			"PSluxun",
			"PSben_sunben",
			"PSdian_huanggai",
			"PSlvmeng",
			"PSpanzhangmazhong",
			"PSxie_sunquan",
			"PSsunquan",
			"PSsunshangxiang",
			"PSliuzan",
			"PShuanggai",
			"PSlukang",
			"PSzhoutai",
			"PSquansun",
			"PSjiesuanjie",
			"PSzhangxuan",
			"PScenhun",
			"PSsunben",
			"PShw_sunquan",
			"PSsunru",
			"PSfuzhijie",
			"PSxushi",
		],
		PScharacter_qun: [
			"PSzhangjiao",
			"PSlvbu",
			"PSreyuanshu",
			"PSqun_machao",
			"PSlibai",
			"PSyue_caiwenji",
			"PSquyi",
			"PSdongzhuo",
			"PSgongsunzan",
			"PSqun_zhaoyun",
			"PSxurong",
			"PSyuanshu",
			"PSxushao",
			"PSguanning",
			"PSliru",
			"PSzuoci",
			"PSerciyuan",
			"PSdahantianzi",
			"PSnanhualaoxian",
			"PSduyu",
			"PSzhangrang",
			"PSqun_sunce",
			"PSgaoguimingmen",
			"PSsishouyige",
			"PSyangbiao",
			"PSguosi",
			"PSpeixiu",
			"PSsb_xushao",
			"PSjiaxu",
			"PSxuyou",
			"PSshenpei"
		],
		PScharacter_jin: ["PSjin_duyu", "PSzhongyan"],
		PScharacter_shen: [
			"PSshen_sunquan",
			"PSshen_zuoci",
			"PSshen_simayi",
			"PSshen_dianwei",
			"PSshouyige",
			"PSshen_zhuge",
			"PSshen_ganning",
			"PSshen_zhaoyun",
			"PSxian_caozhi",
			"PSshen_jiangweix",
			"PSboss_lvbu1",
			"PSboss_lvbu2",
			"PSboss_lvbu3",
			"PSboss_lvbu4",
			"PSshengui",
			"PSshen_huangzhong",
			"PSshen_guojia",
			"PSfx_shen_guanyu",
			"PSshen_liubei",
			"PSshen_zhangliao",
			"PSshen_zhangfei",
			"PSshen_dengai",
			"PSshen_xunyu",
			"PSshen_nanhualaoxian"
		],
		PScharacter_db: ["db_PSdaweiwuwang"],
	},
};

const sortTranslation = {
	PScharacter_wei:
		'<span style="color:#0054ff;font-family:xingkai;font-size:24px">建安风骨</span>',
	PScharacter_shu:
		'<span style="color:#ff453e;font-family:xingkai;font-size:24px">汉祚延绵</span>', //#ff5400
	PScharacter_wu:
		'<span style="color:#338c00;font-family:xingkai;font-size:24px">江东铁壁</span>',
	PScharacter_qun:
		'<span style="color:#8c8c8c;font-family:xingkai;font-size:24px">群雄并起</span>',
	PScharacter_jin:
		'<span style="color:#991cff;font-family:xingkai;font-size:24px">三分归晋</span>',
	PScharacter_shen:
		'<span style="color:#dc9e18;font-family:xingkai;font-size:24px">诸神降临</span>',
	PScharacter_db: `
		<style>
			#双势力{
				animation:changeS 8s linear 4s infinite;
			}
			@keyframes changeS{
				0% {
					color:#0054ff;
				}
				35%{
					color: #ff453e;
				}
				65%{
					color: #338c00;
				}
				100% {
					color:#0054ff;
				}
			}
		</style>
		<body>
			<span id='双势力' style="display: block; position: unset; transition: unset;">
				<span style='font-family:xingkai;font-size:24px'>双势力</span>
			</span>
		</body>
	`,
};

export { characterSort, sortTranslation };
