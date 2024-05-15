window.PScharacter.import(function (lib, game, ui, get, ai, _status) {
  /* <-------------------------chooseButtonContorl函数，感谢狂神-------------------------> */
  //player函数
  lib.element.player.chooseButtonControl = function (object) {
    let next = game.createEvent('chooseButtonControl');
    next.player = this;
    if (arguments.length == 1 && get.objtype(arguments[0]) == 'object') {
      for (var key in object) next[key] = object[key];
    }
    else for (let arg of arguments) {
      //dialog
      if (get.itemtype(arg) == 'dialog') next.dialog = arg;
      else if (typeof arg == 'number') next.dialog = get.idDialog(arg);
      else if (Array.isArray(arg)) next.createDialog = arg;

      else if (typeof arg == 'boolean') {
        if (next.forced == undefined || next.forced == null) next.forced = arg;
        else next.multiButton = arg;
      }

      else if (typeof arg == 'function') {
        if (!next.control) next.control = arg;
        else next.processAI = arg;
      }
    }

    if (typeof next.dialog == 'number') {
      next.dialog = get.idDialog(next.dialog);
    } else if (get.itemtype(next.dialog) == 'dialog') {
      next.closeDialog = true;
    } else if (!next.dialog && Array.isArray(next.createDialog)) {
      next.dialog = ui.create.dialog.apply(this, next.createDialog);
      next.closeDialog = true;
    }

    if (typeof next.forced != 'boolean') next.forced = false;
    if (typeof next.forced != 'boolean') next.multiButton = false;
    if (next.isMine() == false && next.dialog) next.dialog.style.display = 'none';
    if (!next.control) next.control = () => 'ok';
    next.setContent('chooseButtonControl');
    next._args = Array.from(arguments);
    return next;
  };
  //content函数
  lib.element.content.chooseButtonControl = function () {
    'step 0'
    let chooseButton = function (event, player) {
      if (!event.result) event.result = {};
      event.forceMine = true;
      event.buttons = [];
      for (let button of event.dialog.buttons) {
        button.classList.add('pointerdiv');
        button.classList.add('selectable');
      }
      event.dialog.open();

      event.custom.replace.button = function (button) {
        if (!event.dialog.contains(button.parentNode)) return;
        if (button.classList.contains('unselectable')) return;

        if (button.classList.contains('selected')) {
          event.buttons.remove(button);
          button.classList.remove('selected');
          if (!event.multiButton) {
            for (let i of event.dialog.buttons) {
              i.classList.remove('unselectable');
            }
          }
        } else {
          event.buttons.add(button);
          button.classList.add('selected');
          if (!event.multiButton) {
            for (let i of event.dialog.buttons) {
              if (event.buttons.contains(i)) continue;
              i.classList.add('unselectable');
            }
          }
        }

        event.controls.replacex();
      }

      event.custom.replace.window = function () {
        event.buttons = [];
        for (let i of event.dialog.buttons) {
          i.classList.remove('selected');
          i.classList.remove('unselectable');
        }
        event.controls.replacex();
      }

      event.controls = ui.create.control();
      event.controls.replacex = function () {
        let newControls, args = event.control(event.buttons);
        if (Array.isArray(args)) newControls = args;
        else if (args != undefined && args != null) newControls = [args];
        else newControls = [];

        if (event.multiButton) {
          if (newControls.contains('cancel2')) newControls.remove('cancel2');
          if (!event.forced) newControls.add('cancel2');
        }
        else if (!event.forced && !newControls.contains('cancel2')) {
          if (newControls.length == 0 || event.buttons.length == 0) newControls.add('cancel2');
        }

        this.style.opacity = newControls.length > 0 ? 1 : 0;

        newControls.push(function (control) {
          if (control == 'cancel2') event.result.bool = false;
          else {
            event.result.bool = true;
            event.result.buttons = event.buttons;
            event.result.links = event.buttons.map(button => button.link);
            event.result.control = control;
          }
          event.dialog.close();
          event.controls.close();
          game.resume();
          _status.imchoosing = false;
        });

        return this.replace.apply(this, newControls);
      }
      event.controls.replacex();
      game.pause();
      game.countChoose();
    };

    if (event.isMine()) chooseButton(event, player);
    else if (event.isOnline()) {
      event.player.send(chooseButton, event, player);
      event.player.wait();
      game.pause();
    } else {
      if (event.dialog && event.closeDialog) event.dialog.close();
      if (event.controls && event.closeDialog) event.controls.close();
      game.resume();
      _status.imchoosing = false;

      if (event.processAI) event.result = event.processAI(event, player);
      else if (!event.forced) event.result = { bool: false };
      else throw "processAI : " + event.getParent().name + "'s chooseButtonControl is forced";

      event.finish();
    }

    'step 1'
    if (event.result.control == 'cancel2') {
      event.finish();
      return;
    }
  };
})