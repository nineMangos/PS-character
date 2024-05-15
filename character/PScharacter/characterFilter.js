const characterFilter = {
	//武将在特定模式下禁用
	PSzuoci: function (mode) {
		return mode != "guozhan";
	},
	db_PSdaweiwuwang: function (mode) {
		return mode != "guozhan";
	},
};

export default characterFilter
