import { lib, game, ui, get, ai, _status } from "../../extension/noname.js";

const str = (lib.device || lib.node) ? "ext:" : "db:extension-";
const url = "PS武将/image/character/";
const characterSubstitute = {
	//武将替换
	PSzhaoxiang: [["PSzhaoxiang2", [str + url + "PSzhaoxiang2.jpg", "die:ext:PS武将/audio/die:true"]]],
	PSshen_dengai: [["PSshen_dengai2", [str + url + "PSshen_dengai2.jpg", "die:ext:PS武将/audio/die:true"]]],
	PSshen_zuoci: []
};

export default characterSubstitute
