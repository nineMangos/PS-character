//game.import( name:"PS武将"
import { VERSION } from './extension/version.js';
import { lib, get, _status, ui, game, ai } from './extension/noname.js';
import { CONFIG } from './extension/config.js';
import { CONTENT } from './extension/content.js';
import { PRECONTENT } from './extension/precontent.js';

window.PScharacter = {
	updateHistory: {},
	deepClone(obj) {
		return new Promise((resolve) => {
			const { port1, port2 } = new MessageChannel();
			port1.postMessage(obj);
			port2.onmessage = (msg) => {
				resolve(msg.data);
			}
		});
	},//let obj2; -> deepClone(obj).then(i => obj2 = i);
	characters: [],
};

lib.init.css(lib.assetURL + 'extension/PS武将/css', "extension");//调用css样式


const mainPackage = {
	name: "PS武将",
	editable: false,
	content: CONTENT,
	precontent: PRECONTENT,
	help: {},
	config: CONFIG,
	package: {
		//  intro:"",
		author: '九个芒果',
		diskURL: "",
		forumURL: "",
		version: VERSION,
	},
	files: {
		"character": [],
		"card": [],
		"skill": []
	},
}

export let type = 'extension';

export default mainPackage;
