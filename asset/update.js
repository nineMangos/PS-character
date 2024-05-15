window.PScharacter.import(function (lib, game, ui, get, ai, _status) {
	//搬运自“活动武将”
	game.PS_showChangeLog = function (version) {
		version = version || lib.extensionPack["PS武将"].version;
		let changeInfo = window.PScharacter.updateHistory[lib.extensionPack.PS武将.version];
		//加载
		var dialog = ui.create.dialog('hidden');
		dialog.addText('<div style="font-size:24px;margin-top:5px;text-align:center;">PS武将 ' + version + ' 版本更新内容</div>');
		dialog.style.left = '25%';
		dialog.style.width = '50%';
		for (var log of changeInfo.changeLog) {
			switch (log) {
				case '/setPlayer/':
					dialog.addText('<div style="font-size:17.5px;text-align:center;">更新角色：</div>')
					dialog.addSmall([changeInfo.players, 'character']);
					break;
				case '/setCard/':
					dialog.addText('<div style="font-size:17.5px;text-align:center;">更新卡牌：</div>')
					dialog.addSmall([changeInfo.cards, 'vcard']);
					break;
				default:
					var li = document.createElement('li');
					window.PScharacter.characters.forEach(j => {
						if (log.includes(lib.translate[j]) || (log.includes('〖') && log.includes('〗'))) {
							log = log
								.replace(new RegExp(lib.translate[j], 'g'), `<font color=#ff9800>${lib.translate[j]}</font>`)
								.replace(new RegExp('〖', 'g'), `<font color=#24c022>〖`)
								.replace(new RegExp('〗', 'g'), `〗</font>`)
						}
					});
					li.innerHTML = log;
					li.style.textAlign = 'left';
					li.style.marginLeft = '25px';
					li.style.marginTop = '2.5px';
					dialog.content.appendChild(li);
			}
		}
		var ul = document.createElement('ul');
		dialog.content.appendChild(ul);
		dialog.open();
		var hidden = false;
		if (!ui.auto.classList.contains('hidden')) {
			ui.auto.hide();
			hidden = true;
		}
		game.pause();
		var control = ui.create.control('确定', function () {
			dialog.close();
			control.close();
			if (hidden) ui.auto.show();
			game.resume();
		});
	};
	lib.skill._PS_changeLog = {
		charlotte: true,
		ruleSkill: true,
		trigger: {
			global: [/*'chooseButtonBefore',*/'gameStart', 'gameDrawAfter', 'phaseBefore']
		},
		filter: function (event, player) {
			//if(event.name=='chooseButton'&&event.parent.name!='chooseCharacter') return false;
			return !lib.config.extension_PS武将_PS_version || lib.config.extension_PS武将_PS_version != lib.extensionPack.PS武将.version;
		},
		direct: true,
		priority: 1919810,
		content: function () {
			game.saveConfig('extension_PS武将_PS_version', lib.extensionPack.PS武将.version);
			game.PS_showChangeLog();
		},
	};
})