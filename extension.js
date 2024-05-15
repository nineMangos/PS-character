game.import("extension", function (lib, game, ui, get, ai, _status) {
  window.PScharacter = {
    import: function (func) {
      func(lib, game, ui, get, ai, _status);
    },
    updateHistory: {},
    deepClone: function (obj) {
      return new Promise((resolve) => {
        const { port1, port2 } = new MessageChannel();
        port1.postMessage(obj);
        port2.onmessage = (msg) => {
          resolve(msg.data);
        }
      });
    },//window.PScharacter.deepClone(obj).then(i => obj2 = i)
    characters: [],
    savedFilter: null,
    forbidaiShow: function () {
      if (!game.getExtensionConfig('PS武将', 'enable')) {
        alert('请先启用PS武将扩展');
        return;
      }

      const CONFIG = game.getExtensionConfig('PS武将', 'forbidai');
      const savedFilter = window.PScharacter.savedFilter;
      const selectedBannedList = [];
      const reducedBannedList = [];

      let MODE = '默认'; // 分类方式
      let ACTIVE1 = 'all'; // 选中的武将包按钮
      let ACTIVE2 = 'all'; // 选中的武将包分类按钮
      let SCROLL = 0; // 武将包横向滚动位置
      let FORBIDAI = false;  //是否开启“禁将列表”按钮

      let SEARCHING = false; // 是否正在搜索
      let CONTAINER;// 定义容器

      function load(reload) {
        if (reload && Array.from(ui.window.childNodes).includes(CONTAINER)) ui.window.removeChild(CONTAINER);
        CONTAINER = ui.create.div('.PSdiv#PSforbidai-container');
        const record = CONFIG.record;
        if (CONFIG.remember && record && record.length) {
          try {
            MODE = record[0];
            ACTIVE1 = record[1];
            ACTIVE2 = record[2];
            SCROLL = record[3];
            FORBIDAI = record[4];
            init();
          } catch (e) {
            console.log(e);
            console.log('加载出错，恢复默认设置重新加载');
            reinit();
          }
        } else {
          reinit();
        }
      }
      load();

      function reinit() {
        if (Array.from(ui.window.childNodes).includes(CONTAINER)) ui.window.removeChild(CONTAINER);
        CONTAINER.innerHTML = '';
        MODE = '默认';
        ACTIVE1 = 'all';
        ACTIVE2 = 'all';
        SCROLL = 0;
        FORBIDAI = false;
        init();
      }

      /* 初始化函数 */
      function init() {
        ui.window.appendChild(CONTAINER);
        /* 整体容器赋值HTML结构 */
        CONTAINER.innerHTML = `
          <div class="PSdiv PSheader">
          <div class="PSdiv PShelp"></div>
          <div class="PSdiv PSpack">
            <div class="PSdiv PSselectAll">
              全选
            </div>
            <div class="PSdiv PSsetUp"></div>
            <div class="PSdiv PSselect">
              分类方式：<span style="color: #ffe6b7;">默认</span><img src="${lib.assetURL}extension/PS武将/image/other/T3.png">
              <div class="PSdiv PSselect-content">
                <div class="PSdiv">
                  <span>默认</span>
                  <span>评级</span>
                  <span>势力</span>
                  <span>性别</span>
                </div>
              </div>
            </div>
          </div>
          <div class="PSdiv PSsearch">
            <input type="text" class="PSinput" placeholder="输入武将名称/拼音以搜索">
            <div class="PSdiv PSbutton"></div>
          </div>
          <div class="PSdiv PSloginfo">
            共搜索到<span style="color: #ffe6b7;">0</span>个武将
          </div>
          <div class="PSdiv PSclose"></div>
        </div>
        <div class="PSdiv PSlist">
          <div class="PSdiv PSleft"></div>
          <div class="PSdiv PSright"></div>
          <ul></ul>
        </div>
        <div class="PSdiv PScontent">
          <div class="PSdiv PScharacterSort">
            <ol></ol>
            <div class="PSdiv PSresult">
              <div class="PSdiv PSforbiden">禁将列表</div>
              <div class="PSdiv PSconfirm">确定</div>
            </div>
          </div>
        </div>
        `;

        /* 头部区域-帮助按钮添加点击事件 */
        let help = document.querySelector('#PSforbidai-container .PSheader .PShelp');
        help.addEventListener('click', function () {
          let popupContainer = ui.create.div('#popupContainer', '<div class="PSdiv"><h2>AI禁将——帮助</h2><span></span></div>', CONTAINER);
          let popupClose = popupContainer.querySelector('span');
          popupClose.addEventListener('click', function () {
            CONTAINER.removeChild(this.parentNode.parentNode);
          });
          let popup = ui.create.div('.PSdiv', popupContainer.firstElementChild);
          popup.innerHTML = `             
          <h3>一、简介</h3>
            <h4>此功能可以帮助玩家快速筛选武将，并将其加入禁将列表，禁将列表里的武将不会在对局中被AI选择到（仅点将可选）。</h4>
          <br>
          <h3>二、使用说明</h3>
            <h4>1. 点击“分类方式”按钮，选择分类方式。</h4>
            <h4>2. 点击任意“武将包”按钮，选择武将包。</h4>
            <h4>3. 点击任意“武将包分类”按钮，选择武将包的分类。</h4>
            <h4>4. 点击“搜索框”，输入武将名称/拼音，搜索武将。</h4>
            <h4>5. 选中页面出现的任意个“武将”，被选择的武将会处于“红框状态”，若此武将未加入“禁将列表”，其武将牌右上角会出现小红点。</h4>
            <h4>6. 点击“确定”按钮，所有选中的武将加入“禁将列表”，武将牌右上角小红点消失。</h4>
            <h4>7. 如需将任意“武将”移出禁将列表，则点击已被选择的武将（红框状态），再次点击“确定”。</h4>
          <br>
          <h3>三、其他说明</h3>
            <h4>1. “全选”按钮：点击此按钮，当前页面的所有武将都会被选中，再次点击“全选”按钮，当前页面的所有武将都会被取消选中。</h4>
            <h4>2. “禁将列表”按钮：点击此按钮，会展示当前页面已被加入“禁将列表”的武将。</h4>
            <h4>3. “左/右箭头”按钮：点击此按钮，所有的武将包按钮向左/向右移动一格，长按此按钮会持续移动。</h4>
            <h4>4. “齿轮”按钮：点击此按钮，打开设置页。</h4>
            <h4>5. “半透明的武将”：不可点击，默认已加入“禁将列表”——为了兼容本体/其他扩展的的禁将，如果一些武将已被本体/其他扩展加入了禁将，则无法编辑这些角色的禁将状态（例如我用“搬运自用”的禁将功能将部分武将设置为AI禁用，这些武将在这里会变成“半透明状态”）。</h4>
          <br>
          <h3>四、关于</h3>
            <h4>此功能由“九个芒果”制作，bug反馈请联系本人。</h4>
          <br>
          `;
        })

        /* 头部区域-齿轮按钮添加点击事件 */
        let setUp = document.querySelector('#PSforbidai-container .PSheader .PSsetUp');
        setUp.addEventListener('click', function () {
          let popupContainer = ui.create.div('#popupContainer', '<div class="PSdiv"><h2>AI禁将——设置</h2><span></span></div>', CONTAINER);
          let popupClose = popupContainer.querySelector('span');
          popupClose.addEventListener('click', function () {
            CONTAINER.removeChild(this.parentNode.parentNode);
          });
          let popup = ui.create.div('.PSdiv', popupContainer.firstElementChild);
          popup.innerHTML = `                
          <div class="PSdiv" data-id="small"><h3>小型布局</h3><span></span></div>  
          <div class="PSdiv" data-id="defaultImage"><h3>不加载武将原画（性能更好）</h3><span></span></div>  
          <div class="PSdiv" data-id="remember"><h3>进入功能页时加载上次退出的页面</h3><span></span></div>
          <div class="PSdiv" data-id="addMenu"><h3>将此功能添加到游戏顶部菜单栏</h3><span></span></div>
          <div class="PSdiv"><h3>导入禁将设置</h3></div>    
          <div class="PSdiv PShidden" data-id="import" style="height:4.5vh; font-size:1.7vh;"><input type="file" accept="*/*"><button style="padding:0 1vh;">确定</button></div>  
          <div class="PSdiv" data-id="export"><h3>导出禁将设置</h3></div>  
          <div class="PSdiv" data-id="clear"><h3>一键清除禁将记录并恢复默认设置</h3></div>  
          `;

          /**
           * 设置小布局
           */
          let config0 = popup.querySelector('.PSdiv[data-id="small"] span');
          if (CONFIG.small) config0.classList.add('active');
          config0.addEventListener('click', function () {
            if (this.classList.toggle('active')) {
              CONFIG.small = true;
              game.saveExtensionConfigValue('PS武将', 'forbidai');
              renderCharacterList();
            } else {
              CONFIG.small = false;
              game.saveExtensionConfigValue('PS武将', 'forbidai');
              renderCharacterList();
            }
          });

          /**
           * 设置不加载武将原画
           */
          let config1 = popup.querySelector('.PSdiv[data-id="defaultImage"] span');
          if (CONFIG.defaultImage) config1.classList.add('active');
          config1.addEventListener('click', function () {
            if (this.classList.toggle('active')) {
              CONFIG.defaultImage = true;
              game.saveExtensionConfigValue('PS武将', 'forbidai');
            } else {
              CONFIG.defaultImage = false;
              game.saveExtensionConfigValue('PS武将', 'forbidai');
            }
          });

          /**
           * 设置加载上次退出的页面
           */
          let config2 = popup.querySelector('.PSdiv[data-id="remember"] span');
          if (CONFIG.remember) config2.classList.add('active');
          config2.addEventListener('click', function () {
            if (this.classList.toggle('active')) {
              CONFIG.remember = true;
              game.saveExtensionConfigValue('PS武将', 'forbidai');
            } else {
              CONFIG.remember = false;
              game.saveExtensionConfigValue('PS武将', 'forbidai');
            }
          });

          /**
           * 设置添加到游戏顶部菜单栏
           */
          let config3 = popup.querySelector('.PSdiv[data-id="addMenu"] span');
          if (CONFIG.addMenu) config3.classList.add('active');
          config3.addEventListener('click', function () {
            if (this.classList.toggle('active')) {
              CONFIG.addMenu = true;
              game.saveExtensionConfigValue('PS武将', 'forbidai');
            } else {
              CONFIG.addMenu = false;
              game.saveExtensionConfigValue('PS武将', 'forbidai');
            }
          });

          /**
           * 设置导入禁将设置
           */
          let config4 = popup.querySelector('.PSdiv[data-id="import"] button');
          config4.addEventListener('click', function () {
            var fileToLoad = this.previousSibling.files[0];
            if (fileToLoad) {
              var fileReader = new FileReader();
              fileReader.onload = function (fileLoadedEvent) {
                var data = fileLoadedEvent.target.result;
                if (!data) return;
                try {
                  data = JSON.parse(lib.init.decode(data));
                  if (!data || typeof data != 'object') {
                    throw ('文件数据不是一个对象');
                  }
                  if (!['bannedList', 'defaultImage', 'addMenu', 'remember', 'record', 'small'].some(i => Object.keys(data).includes(i))) {
                    throw ('文件数据不足');
                  }
                  console.log(data);
                }
                catch (e) {
                  console.log(e);
                  alert('导入失败');
                  return;
                }

                {
                  CONFIG.record = data.record || [];
                  CONFIG.bannedList = data.bannedList || [];
                  CONFIG.defaultImage = data.defaultImage || false;
                  CONFIG.addMenu = data.addMenu || false;
                  CONFIG.remember = data.remember || true;
                  CONFIG.small = data.small || false;
                  game.saveExtensionConfigValue('PS武将', 'forbidai');
                }
                alert('导入成功');

                load(true);
              }
              fileReader.readAsText(fileToLoad, "UTF-8");
            }
          });
          config4.parentNode.previousElementSibling.addEventListener('click', function () {
            config4.parentNode.classList.toggle('PShidden');
          });


          /**
           * 设置导出禁将设置
           */
          let config5 = popup.querySelector('.PSdiv[data-id="export"]');
          config5.addEventListener('click', function () {
            let export_data = function (data) {
              game.export(lib.init.encode(JSON.stringify(data)), 'AI禁将 - 数据 - ' + (new Date()).toLocaleString());
            }
            export_data({
              record: [MODE, ACTIVE1, ACTIVE2, SCROLL, FORBIDAI],
              bannedList: CONFIG.bannedList,
              defaultImage: CONFIG.defaultImage,
              addMenu: CONFIG.addMenu,
              remember: CONFIG.remember,
              small: CONFIG.small
            });
          });


          /**
          * 设置一键清除记录
          */
          let config6 = popup.querySelector('.PSdiv[data-id="clear"]');
          config6.addEventListener('click', function () {
            if (window.confirm('确定要清除禁将记录并恢复默认设置吗？')) {
              {
                CONFIG.record = [];
                CONFIG.bannedList = [];
                CONFIG.defaultImage = false;
                CONFIG.addMenu = false;
                CONFIG.remember = true;
                CONFIG.small = false;
                game.saveExtensionConfigValue('PS武将', 'forbidai');
              }
              alert('清除成功！');
              load(true);
            }
          });
        })


        /* 头部区域-全选按钮添加点击事件 */
        let selectAll = document.querySelector('#PSforbidai-container .PSheader .PSselectAll');
        selectAll.addEventListener('click', function (e) {
          let items = document.querySelectorAll('#PSforbidai-container .PScharacterList .PSitem');
          if (this.classList.toggle('active')) {
            for (let i = 0; i < items.length; i++) {
              if (items[i].style.opacity === '0.5') continue;
              if (!items[i].classList.contains('selected')) {
                items[i].classList.add('selected');
                if (!lib.filter.characterDisabled(items[i].dataset.name)) {
                  let child = ui.create.div('.PSdiv .PStip');
                  items[i].appendChild(child);
                }
                selectedBannedList.push(items[i].dataset.name);
                reducedBannedList.remove(items[i].dataset.name);
              }
            }
          } else {
            for (let i = 0; i < items.length; i++) {
              if (items[i].style.opacity === '0.5') continue;
              if (items[i].classList.contains('selected')) {
                items[i].classList.remove('selected');
                if (items[i].lastChild.classList.contains('PStip')) {
                  items[i].removeChild(items[i].lastChild);
                }
                selectedBannedList.remove(items[i].dataset.name);
                reducedBannedList.push(items[i].dataset.name);
              }
            }
          }
        });

        /* 头部区域-分类方式切换按钮添加点击事件 */
        let selectButton = document.querySelector('#PSforbidai-container .PSheader .PSselect .PSselect-content');
        document.querySelector('#PSforbidai-container .PSheader .PSselect>span').innerHTML = MODE;
        selectButton.addEventListener('click', function (e) {
          if (e.target.tagName.toLowerCase() !== 'span') return;
          let span = document.querySelector('#PSforbidai-container .PSheader .PSselect>span');
          MODE = e.target.innerText;
          span.innerHTML = MODE;
          renderOlList();
        });

        /* 头部区域-搜索框按钮添加点击事件 */
        let button = document.querySelector('#PSforbidai-container .PSheader .PSsearch .PSbutton');
        button.addEventListener('click', function () {
          let value = this.previousElementSibling.value;
          if (value === "" || value === null || value === undefined) return game.alert("请输入正确内容");
          if (value.length > 20) return game.alert("输入内容过长");
          let characters = getCharactersId();
          if (characters.length === 0) return game.alert("此页面无法搜索");
          let result = [];
          let reg = new RegExp(value);
          for (let j of characters) {
            if (reg.test(j) || reg.test(lib.translate[j])) {
              result.push(j);
            }
          }
          if (result.length === 0) return game.alert("没有找到相关的武将");
          else {
            SEARCHING = true;
            renderCharacterList(result);
          }
        })



        /* 头部区域-关闭按钮添加点击事件 */
        let close = document.querySelector('#PSforbidai-container .PSheader .PSclose');
        close.addEventListener('click', function () {
          SCROLL = document.querySelector('#PSforbidai-container .PSlist ul').scrollLeft;
          ui.arena.classList.add('menupaused');
          ui.menuContainer.show();
          if (ui.dialog) ui.dialog.show();
          ui.window.removeChild(CONTAINER);
          CONFIG.record = [MODE, ACTIVE1, ACTIVE2, SCROLL, FORBIDAI];
          game.saveExtensionConfigValue('PS武将', 'forbidai');
        });

        /* 武将包列表区域-左右按钮添加点击/长按事件 */
        let timeId;
        let timeId2;
        let ul = document.querySelector('#PSforbidai-container .PSlist ul');

        function hold() {
          let num = this.className === 'PSdiv PSleft' ? -100 : 100;
          ul.scrollLeft += num;
          timeId2 = setTimeout(() => timeId = setInterval(() => ul.scrollLeft += num, 100), 300);
        };
        let left = document.querySelector('#PSforbidai-container .PSlist .PSleft');
        let right = document.querySelector('#PSforbidai-container .PSlist .PSright');
        left.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', hold);
        right.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', hold);

        /* 武将包名称栏绑定横向滚动操作逻辑 */
        ul.addEventListener('wheel', function (e) {
          e.preventDefault();
          ul.scrollLeft += e.deltaY / 2;
        });
        setTimeout(() => {
          ul.scrollLeft = SCROLL;
        }, 50);

        /* 内容区域-左侧禁将列表按钮添加点击事件 */
        let forbiden = document.querySelector('#PSforbidai-container .PScontent .PSresult .PSforbiden');
        if (FORBIDAI) forbiden.classList.add('active');
        forbiden.addEventListener('click', function () {
          if (this.classList.toggle('active')) {
            FORBIDAI = true;
            renderCharacterList();
          } else {
            FORBIDAI = false;
            renderCharacterList();
          }
        });

        /* 内容区域-左侧确定按钮添加点击事件 */
        let confirm = document.querySelector('#PSforbidai-container .PScontent .PSresult .PSconfirm');
        confirm.addEventListener(lib.config.touchscreen ? 'touchstart' : 'mousedown', function () {
          this.style.boxShadow = `rgba(0, 0, 0, 0.2) 0 0 0 1px, rgba(0, 255, 0, 0.4) 0 0 5px, rgba(0, 255, 0, 0.4) 0 0 12px, rgba(0, 255, 0, 0.8) 0 0 15px`
          this.style.transform = `scale(0.84)`;
        });
        confirm.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', function () {
          let allBannedList1 = Object.keys(lib.character).filter(id => lib.filter.characterDisabled(id) && !savedFilter(id, 'PS武将'));// 1.当前禁将
          let allBannedList2 = [...new Set([...selectedBannedList, ...allBannedList1])];// 2.当前禁将 + 已选禁将
          let allBannedList3 = allBannedList2.filter(id => !reducedBannedList.includes(id));// 3.过滤掉2的已移除禁将和系统禁将
          /* let allBannedList3 = [...new Set([...allBannedList1, ...allBannedList2])].filter(id => {
            return !reducedBannedList.includes(id)
          }); */
          selectedBannedList.splice(0, selectedBannedList.length);
          reducedBannedList.splice(0, reducedBannedList.length);

          {
            CONFIG.record = [MODE, ACTIVE1, ACTIVE2, SCROLL, FORBIDAI];
            CONFIG.bannedList = allBannedList3;
            CONFIG.defaultImage = CONFIG.defaultImage;
            CONFIG.addMenu = CONFIG.addMenu;
            CONFIG.remember = CONFIG.remember;
            CONFIG.small = CONFIG.small;
            game.saveExtensionConfigValue('PS武将', 'forbidai');
          }
          game.alert(`新增禁用武将${allBannedList3.length - allBannedList1.length}个<br><br>合计禁用武将${Object.keys(lib.character).filter(id => lib.filter.characterDisabled(id)).length}个`);
          const items = document.querySelectorAll('#PSforbidai-container .PScharacterList .PSitem');
          items.forEach(item => {
            if (item.lastChild.classList.contains('PStip')) {
              item.removeChild(item.lastChild);
            }
          });
          // renderCharacterList();
        });

        CONTAINER.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', function () {
          let confirm = document.querySelector('#PSforbidai-container .PScontent .PSresult .PSconfirm');
          confirm.style.boxShadow = 'none';
          confirm.style.transform = `scale(0.8)`;
          clearInterval(timeId);
          clearTimeout(timeId2);
        });

        /* 武将包列表-渲染每一个武将包 */
        let packlist = [];
        for (let i = 0; i < lib.config.all.characters.length; i++) {
          if (!lib.config.characters.includes(lib.config.all.characters[i])) continue;
          packlist.push(lib.config.all.characters[i]);
        }
        for (let i in lib.characterPack) {
          if (!lib.config.all.characters.includes(i) && Object.keys(lib.characterPack[i]).length) {
            packlist.push(i);
          }
        }
        //packlist开启的武将包id数组
        packlist.unshift('all');
        //渲染每一个ul>li并添加点击事件
        packlist.forEach(ele => {
          let li = document.createElement('li');
          li.setAttribute('data-id', ele);
          if (ele === ACTIVE1) li.classList.add('active');
          li.innerHTML = ele === 'all' ? '全扩' : lib.translate[ele + '_character_config'];
          li.addEventListener('click', function () {
            let liAct = document.querySelector('.PSlist li.active');
            if (liAct === this && !SEARCHING || !liAct) return;
            if (SEARCHING) {
              SEARCHING = false;
            }
            liAct.classList.remove('active');
            ACTIVE1 = this.getAttribute('data-id');
            this.classList.add('active');
            renderOlList();
          });
          ul.appendChild(li);
        });
        if (!document.querySelector('.PSlist ul li.active')) {
          ACTIVE1 = ul.firstChild.getAttribute('data-id');
          ul.firstChild.classList.add('active');
        }
        renderOlList();
      }

      /* 内容区域-渲染武将包分类信息 */
      function renderOlList() {
        let ol = document.querySelector('#PSforbidai-container .PScontent ol');
        ol.innerHTML = '';
        let characterSortList = [];
        let liAct = document.querySelector('.PSlist ul li.active');
        switch (MODE) {
          case '默认':
            characterSortList = liAct.dataset.id === 'all' ? [] : Object.keys(lib.characterSort[liAct.dataset.id] || {});
            characterSortList.unshift('all');
            break;
          case '评级':
            characterSortList = ['all', ...Object.keys(lib.rank.rarity)];
            break;
          case '势力':
            characterSortList = ['all', ...lib.group];
            break;
          case '性别':
            characterSortList = ['all', 'male', 'female', 'double'];
            break;
        }
        characterSortList.forEach(ele => {
          let li = document.createElement('li');
          li.setAttribute('data-id', ele);
          if (ele === ACTIVE2) li.classList.add('active');
          li.innerHTML = ele === 'all' ? '所有武将' : lib.translate[ele];
          li.addEventListener('click', function () {
            let li = document.querySelector('.PScontent li.active');
            if (li === this && !SEARCHING || !li) return;
            if (SEARCHING) {
              SEARCHING = false;
            }
            li.classList.remove('active');
            ACTIVE2 = this.getAttribute('data-id');
            this.classList.add('active');
            renderCharacterList();
          });
          ol.appendChild(li);
        });
        if (!document.querySelector('.PScontent ol li.active')) {
          ACTIVE2 = ol.firstChild.dataset.id;
          ol.firstChild.classList.add('active');
        }
        renderCharacterList();
      }

      /* 内容区域-渲染每一个武将 */
      function renderCharacterList(characterArr) {
        let characters = characterArr || getCharactersId();
        if (FORBIDAI) characters = characters.filter(id => lib.filter.characterDisabled(id) || selectedBannedList.includes(id));
        document.querySelector('#PSforbidai-container .PSheader .PSloginfo span').innerHTML = `${characters.length}`;
        let PScontent = document.querySelector('#PSforbidai-container .PScontent');
        var oldDialog = _status.event.dialog || ui.dialog;
        var dialog = ui.create.dialog();
        dialog.classList.add('PSdiv');
        dialog.classList.add('PScharacterList');
        dialog.classList.remove('nobutton');
        dialog.classList.add('content');
        dialog.classList.add('fixed');
        dialog.style.transform = '';
        dialog.style.opacity = '';
        dialog.style.height = '';
        ui.dialog = oldDialog;
        if (PScontent.lastElementChild.classList.contains('PScharacterList')) {
          PScontent.removeChild(PScontent.lastElementChild);
        }
        PScontent.appendChild(dialog);

        let buttons = ui.create.div('.buttons', dialog.content);
        if (CONFIG.small) buttons.classList.add('smallzoom');

        characters.forEach(ele => {
          let node = ui.create.button(ele, 'character', buttons, false);
          dialog.buttons.push(node);
          if (CONFIG.defaultImage) node.style.backgroundImage = `url(${lib.assetURL}extension/PS武将/image/other/default_character.png)`;
          node.setAttribute('data-src', node.style.backgroundImage);
          node.style.backgroundImage = '';
          node.classList.add('PSitem');
          node.setAttribute('data-name', ele);
          if ((selectedBannedList.includes(ele) && !reducedBannedList.includes(ele) || (lib.filter.characterDisabled(ele) && !savedFilter(ele, 'PS武将')))) {
            node.classList.add('selected');
            if (!lib.filter.characterDisabled(ele)) {
              let child = ui.create.div('.PSdiv .PStip');
              node.appendChild(child);
            }
          }
          if (savedFilter(ele, 'PS武将')) {
            node.style.opacity = '0.5';
          } else {
            node.addEventListener('click', function () {
              if (this.classList.toggle('selected')) {
                // this.style.transform = 'scale(1.1)';
                if (!lib.filter.characterDisabled(this.dataset.name)) {
                  let child = ui.create.div('.PSdiv .PStip');
                  this.appendChild(child);
                }
                selectedBannedList.push(ele);
                reducedBannedList.remove(ele);
              } else {
                // this.style.transform = 'scale(1)';
                if (this.lastChild.classList.contains('PStip')) {
                  this.removeChild(this.lastChild);
                }
                selectedBannedList.remove(ele);
                reducedBannedList.push(ele);
              }
            });
          }
        });
        lazyLoad();
        dialog.open();
      }

      function lazyLoad() {
        const imgs = document.querySelectorAll('#PSforbidai-container .PScharacterList .PSitem');
        const io = new IntersectionObserver((entries) => {
          entries.forEach(item => {
            if (item.isIntersecting) {//item.isIntersecting
              let oImg = item.target
              if (item.intersectionRatio > 0 && item.intersectionRatio <= 1) {
                // console.log(oImg.getAttribute('data-src'));
                oImg.style.backgroundImage = oImg.getAttribute('data-src');
                //oImg.setAttribute('src', oImg.getAttribute('data-src'))
                io.unobserve(oImg);
              }
            }//
          })
        })
        Array.from(imgs).forEach((it) => {
          // console.log(it.getAttribute('data-src'))
          io.observe(it)
        })
      }


      function getCharactersId() {
        let characters = [];
        if (ACTIVE1 === 'all' && ACTIVE2 === 'all') {
          characters = Object.keys(lib.character);
        }
        else {
          switch (MODE) {
            case '默认':
              if (ACTIVE2 === 'all') characters = Object.keys(lib.characterPack[ACTIVE1]);
              else characters = lib.characterSort[ACTIVE1][ACTIVE2];
              break;
            case '评级':
              if (ACTIVE1 === 'all') {
                characters = lib.rank.rarity[ACTIVE2];
              } else if (ACTIVE2 === 'all') {
                characters = Object.keys(lib.characterPack[ACTIVE1]);
              } else {
                characters = [...new Set(Object.keys(lib.characterPack[ACTIVE1]))].filter(id => lib.rank.rarity[ACTIVE2].includes(id));
              }
              break;
            case '势力':
              if (ACTIVE1 === 'all') {
                characters = Object.keys(lib.character).filter(id => lib.character[id][1] === ACTIVE2);
              } else if (ACTIVE2 === 'all') {
                characters = Object.keys(lib.characterPack[ACTIVE1]);
              } else {
                characters = Object.keys(lib.characterPack[ACTIVE1]).filter(id => lib.character[id][1] === ACTIVE2);
              }
              break;
            case '性别':
              if (ACTIVE1 === 'all') {
                characters = Object.keys(lib.character).filter(id => lib.character[id][0] === ACTIVE2);
              } else if (ACTIVE2 === 'all') {
                characters = Object.keys(lib.characterPack[ACTIVE1]);
              } else {
                characters = Object.keys(lib.characterPack[ACTIVE1]).filter(id => lib.character[id][0] === ACTIVE2);
              }
              break;
          }
        }
        return characters.filter(id => id !== undefined && Object.keys(lib.character).includes(id));
      }
    },
  };

  lib.init.css(lib.assetURL + 'extension/PS武将/css', "extension");//调用css样式
  const VERSION = "2.1.5";

  return {
    name: "PS武将",
    editable: false,
    content: function (config, pack) {
      /* <-------------------------武将评级-------------------------> */
      //垃圾武将
      lib.rank.rarity.junk.addArray(['PScenhun', 'PSliru', 'PSben_sunben', 'PSquansun', 'PSrs_wolong', 'PSsunshangxiang', 'PSfx_shen_guanyu']);
      //精品武将
      lib.rank.rarity.rare.addArray(['PScaoang', 'PSliubei', 'PSlifeng', 'PSqun_zhaoyun', 'PSxionghuo', 'PScaoren', 'PSzhangfei', 'PSsp_jiugechenpi', 'PSsp_jiugemangguo', 'PSlingcao', 'PSpanzhangmazhong', 'PSzhugeliang', 'PSmenghuo', 'PSsp_yebai', 'PSshu_sunshangxiang', 'PSxie_sunquan', 'PSxushi', 'PSguanyu', 'PSshen_zhangfei', 'PSlvmeng', 'PSxuyou', 'PShaozhao', 'PSpeixiu', 'PSjiaxu', 'PSshen_liubei', 'PSjiaxu', 'PSzhuangbeidashi', 'PScaocao', 'PSzhoutai', 'PSzhangsong', 'PSshiniangongzhu', 'PSzhanghe', 'PSzhangjiao', 'PSsp_yeshou', 'PSyuanshu', 'PSxizhicai', 'PSsunben', 'PSsunquan', 'PSliuzan', 'PSshen_jiangweix', 'PSshen_zhuge', 'PSrexusheng', 'PSshen_huangzhong', 'PSshen_guojia', 'PScaochun', 'PSqun_sunce', 'PScaoshuang', 'PSlukang', 'PScaoxiu', 'PSdahantianzi', 'db_PSdaweiwuwang', 'PSdianwei', 'PSduyu', 'PSerciyuan', 'PSgaoguimingmen', 'PSguosi', 'PShs_zhonghui', 'PShuanggai', 'PShuangyueying', 'PShw_sunquan']);
      //史诗武将
      lib.rank.rarity.epic.addArray(['PSpeixiu', 'PSsp_jiugeshadiao', 'PSchenshi', 'PSlibai', 'PSzhonghui', 'PSshen_sunquan', 'PSshen_dengai', 'PSshen_xunyu', 'PSmeng_liubei', 'PScaojinyu', 'PSjin_duyu', 'PSsb_xushao', 'PSfuzhijie', 'PSfuzhijie', 'PSwu_zhangliao', 'PSzuoci', 'PSzhangrang', 'PSzhenji', 'PSzhaoxiang', 'PSzhaoyun', 'PSxiahoujie', 'PSguanning', 'PSxushao', 'PSyangbiao', 'PSguanyunchang', 'PSsishouyige', 'PStongxiangge', 'PSsunru', 'PSjiesuanjie', 'PSshengui', 'PSnanhualaoxian', 'PSsh_zhangfei', 'PSshen_ganning']);
      //传说武将
      lib.rank.rarity.legend.addArray(['PSshen_zhangliao', 'PSshen_dianwei', 'PSboss_lvbu1', 'PSxian_caozhi', 'PSzhangxuan', , 'PSboss_lvbu2', 'PSboss_lvbu3', 'PSboss_lvbu4', 'PSshen_zhaoyun', 'PSshouyige']);

      /* <-------------------------添加时机翻译-------------------------> */
      lib.translate.phaseBegin = '回合开始阶段';
      lib.translate.phaseZhunbei = '准备阶段';
      lib.translate.phaseJudge = '判定阶段';
      lib.translate.phaseDraw = '摸牌阶段';
      lib.translate.phaseUse = '出牌阶段';
      lib.translate.phaseDiscard = '弃牌阶段';
      lib.translate.phaseJieshu = '回合结束阶段';

      /* <-------------------------花色符号染色-------------------------> */
      get.suitTranslation = function (suit) {
        if (Array.isArray(suit)) {
          return suit.map(function (s) {
            return get.suitTranslation(s);
          }).join('、');
        }
        else if (typeof suit !== 'string') {
          return void 0;
        }
        const obj = {
          'spade': '<font color="black">♠︎</font>',
          'heart': '<font color="red">♥︎</font>',
          'club': '<font color="black">♣︎</font>',
          'diamond': '<font color="red">♦︎</font>',
        }
        return obj[suit];
      }

      /* <-------------------------AI禁将-------------------------> */
      game.saveExtensionConfigValue = game.saveExtensionConfigValue || function (extension, key) {
        return game.saveExtensionConfig(extension, key, game.getExtensionConfig(extension, key))
      }
      if (game.getExtensionConfig('PS武将', 'forbidai') === undefined) {
        game.saveExtensionConfig('PS武将', 'forbidai', {
          record: [],
          bannedList: [],
          defaultImage: false,
          addMenu: false,
          remember: true,
          small: false
        });
      }

      (function () {
        let savedFilter = lib.filter.characterDisabled;
        let stockDisabled = false;
        /**
         * 从《玄武江湖》抄来的AI禁将
        */
        lib.filter.characterDisabled = function (i, libCharacter) {
          if (Array.isArray(lib.config['extension_PS武将_PS_bannedList'])) game.saveExtensionConfig('PS武将', 'PS_bannedList', []);//重置旧设置
          if (stockDisabled) return savedFilter(i, libCharacter);
          let list = game.getExtensionConfig('PS武将', 'forbidai').bannedList || [];
          if (lib.character[i] && list.includes(i)) {
            return true;
          }
          return savedFilter(i, libCharacter);
        };
        /**
         * 判断是否为本体或者其他扩展的禁将
         */
        window.PScharacter.savedFilter = function (i, libCharacter) {
          stockDisabled = true;
          let result = lib.filter.characterDisabled(i, libCharacter);
          stockDisabled = false;
          return result;
        };
      }());

      /* <-------------------------从《全能搜索》抄来的加入顶部菜单栏-------------------------> */
      if (game.getExtensionConfig('PS武将', 'forbidai').addMenu) {
        const getSystem = setInterval(() => {
          if (ui.system1 || ui.system2) {
            clearInterval(getSystem);
            ui.create.system('🈲', function () {
              window.PScharacter.forbidaiShow();
            });
          }
        }, 500);
      }

      /* <-------------------------播放阵亡语音-------------------------> */
      /* lib.skill._PSdieAudio = {
        trigger: {
          global: 'dieBegin'
        },
        //direct:true,
        priority: 2,
        forced: true,
        unique: true,
        popup: false,
        filter: function (event, player) {
          return player.name.includes('PS');
        },
        content: function () {
          game.playAudio('..', 'extension', 'PS武将/audio/die', trigger.player.name);
          // trigger.audioed = true;
        },
      }; */

      /* <-------------------------适配千幻聆音换肤-------------------------> */
      /* if (!lib.qhlypkg) {
        lib.qhlypkg = [];
      }
      lib.qhlypkg.push({
        isExt: true,
        filterCharacter: function (name) {
          return name.indexOf('PS') == 0;
        },
 
        isLutou: lib.config.xwLutou,
        prefix: 'extension/PS武将/',
        lutouPrefix: 'extension/PS武将/lutou/',
        skin: {
          standard: 'extension/PS武将/skin/standard/',
          lutou: 'extension/PS武将/skin/lutou/',
        },
        audioOrigin: 'extension/PS武将/audio/',
        audio: 'extension/PS武将/skin/audio/',
 
      }); */
    },
    precontent: function (PScharacter) {

      /* <-------------------------给字符串添加查找方法-------------------------> */
      Object.defineProperty(String.prototype, "searchAll", {
        configurable: true,
        enumerable: false,
        writable: true,
        value: function (subStr) {
          if (typeof subStr !== 'string' && subStr instanceof RegExp === false) throw new Error('参数必须为字符串或正则表达式');
          const arr = [];
          if (subStr instanceof RegExp) {//如果subStr为正则表达式
            let array1;
            if (!subStr.global) {//如果subStr为非全局正则表达式
              subStr = new RegExp(subStr.source, subStr.flags + 'g');//重新编译为全局正则表达式
            }
            while ((array1 = subStr.exec(this)) !== null) {//执行正则表达式匹配
              arr.push(subStr.lastIndex - array1[0].length);//记录匹配位置
            }
          } else {
            let index = this.search(subStr);//使用字符串的search方法查找子串
            if (subStr.length === 0) return [];//如果子串为空，则直接返回
            while (index !== -1) {//如果查找到子串，则继续查找下一个子串
              arr.push(index);//记录匹配位置
              const subIndex = this.slice(index + subStr.length).search(subStr);//查找下一个子串的位置
              index = subIndex === -1 ? -1 : index + subStr.length + subIndex;//如果下一个子串不存在，则退出循环
            }
          }
          return arr;//返回记录匹配位置的数组
        }
      });//const str = 'aabbccaabbcc'; str.searchAll('a') --> [0, 1, 6, 7]; str.searchAll(/a/) --> [0, 1, 6, 7]

      /* <-------------------------加载json文件函数，搬运自福瑞拓展，已获得原作者允许，感谢钫酸酱-------------------------> */
      game.PS_loadJsonFromFile = function (filePath, callback, targetObject) {
        // 默认参数处理
        if (!targetObject) {
          targetObject = Array.isArray(targetObject) ? [] : {};
        }

        // 参数校验
        if (typeof filePath !== 'string' || typeof callback !== 'function') {
          throw new Error('无效的参数');
        }

        // 读取配置文件
        game.readFile(filePath, function (data) {
          try {
            // 解析配置文件内容
            var isBuffer = data instanceof ArrayBuffer;
            var config;
            if (isBuffer) {
              var decoder = new TextDecoder("UTF-8");
              var decodedData = decoder.decode(data);
              config = JSON.parse(decodedData);
            } else {
              config = JSON.parse(data);
            }

            // 合并配置到目标对象
            if (Array.isArray(config)) {
              if (Array.isArray(targetObject)) {
                targetObject.push.apply(targetObject, config);
              }
            } else {
              for (var key in config) {
                if (config.hasOwnProperty(key)) {
                  targetObject[key] = config[key];
                }
              }
            }

            callback(null, targetObject);
          } catch (err) {
            callback('无法解析 JSON 文件', null);
          }
        }, function (err) {
          callback('无法读取 JSON 文件', null);
        });
      };

      //将updateHistory.json文件里的更新日志存入window.PScharacter.updateHistory
      game.PS_loadJsonFromFile('extension/PS武将/json/updateHistory.json', function (error, data) {
        if (error) {
          alert(error);
        } else {
          // console.log(data);
        }
      }, window.PScharacter.updateHistory);

      /* <-------------------------调用js-------------------------> */
      if (PScharacter.enable) {
        lib.init.js(lib.assetURL + 'extension/PS武将/js', "character");
        lib.init.js(lib.assetURL + 'extension/PS武将/js', "chooseButtonContorl");
        lib.init.js(lib.assetURL + 'extension/PS武将/js', "update");
        if (lib.config.extension_PS武将_PS_spCharacter === true) lib.init.js(lib.assetURL + 'extension/PS武将/js', "sp_character");
        if (lib.config.extension_PS武将_pswj_hudong === true) lib.init.js(lib.assetURL + 'extension/PS武将/js', "emotion");
      }

      /* <-------------------------改变启动页背景图-------------------------> */
      if (game.getExtensionConfig('PS武将', 'PS_splash') !== 'default') {
        function getAvatars() {
          let avatars = document.querySelectorAll('.avatar');
          if (avatars.length) {
            clearInterval(timeId);
            for (let i = 0; i < avatars.length; i++) {
              let url = avatars[i].style.backgroundImage;
              let imgName = url.slice(url.searchAll(/[/]/).at(-1)).slice(0, -2);
              avatars[i].style.backgroundImage = `url(${lib.assetURL}extension/PS武将/image/splash/${lib.config.extension_PS武将_PS_splash}${imgName})`;
              avatars[i].style.backgroundPosition = `center top`;
            }
          }
        }
        let timeId = setInterval(getAvatars, 30);
        setTimeout(() => {
          clearInterval(timeId);
        }, 3000);
      }

      /* <-------------------------往lib.namePrefix添加武将前缀-------------------------> */
      if (lib.namePrefix) {
        lib.namePrefix.set('PS', {
          color: '#fdd559',
          nature: 'soilmm',
          // showName: '℗',
          getSpan: (prefix, name) => {
            if (lib.config['extension_PS武将_PS_prefix'] === "hidden") return '';
            else if (lib.config['extension_PS武将_PS_prefix'] === "symbol") {
              return `<span style="writing-mode:horizontal-tb;-webkit-writing-mode:horizontal-tb;font-family:MotoyaLMaru;transform:scaleY(0.85)"><font color=#fdd559>℗</font></span>`;
            }
            return `<span style="writing-mode:horizontal-tb;-webkit-writing-mode:horizontal-tb;font-family:MotoyaLMaru;transform:scaleY(0.85)"><font color=#fdd559>PS</font></span>`;
          },
        });
        lib.namePrefix.set('PS神', {
          getSpan: (prefix, name) => {
            return `${get.prefixSpan('PS')}${get.prefixSpan('神')}`;
          },
        });
      }

      /* <-------------------------平仄声相关-------------------------> */
      //将rusheng.json文件里的入声字数组存入lib.PS_rusheng
      lib.PS_rusheng = [];
      game.PS_loadJsonFromFile('extension/PS武将/json/rusheng.json', function (error, data) {
        if (error) {
          alert(error);
        } else {
          // console.log(data);
        }
      }, lib.PS_rusheng);

      //获取平仄的函数
      get.PS_pingZe = function (str) {
        //以平水韵为标准   
        if (typeof str !== 'string') return;
        if (str === '大宛') return '平';
        if (lib.PS_rusheng.contains(str.at(-1))) return '仄';
        const ping = ['ā', 'á', 'ē', 'é', 'ī', 'í', 'ō', 'ó', 'ū', 'ú', 'ǖ', 'ǘ'];
        const ze = ['ǎ', 'à', 'ě', 'è', 'ǐ', 'ì', 'ǒ', 'ò', 'ǔ', 'ù', 'ǚ', 'ǜ'];
        let pinyin = get.pinyin(str, true);
        pinyin = pinyin.at(-1);
        if (ping.some(yin => pinyin.includes(yin))) return '平';
        else if (ze.some(yin => pinyin.includes(yin))) return '仄';
      };

      /* <-------------------------改变技能配音函数-------------------------> */
      game.changeSkillAudio = function (skillName, playerName, audioName) {
        if (!lib.skill[skillName]) return;
        if (!lib.skill[skillName].audioname2) lib.skill[skillName].audioname2 = {};
        lib.skill[skillName].audioname2[playerName] = audioName;
      };

      //改变“强袭”的配音
      game.changeSkillAudio('qiangxix', 'PSboss_lvbu2', 'mashu');
      game.changeSkillAudio('qiangxix', 'PSboss_lvbu3', 'mashu');
      game.changeSkillAudio('qiangxix', 'PSboss_lvbu4', 'mashu');
      //改变“完杀”的配音
      game.changeSkillAudio('rewansha', 'PSboss_lvbu2', 'mashu');
      game.changeSkillAudio('rewansha', 'PSboss_lvbu3', 'mashu');
      game.changeSkillAudio('rewansha', 'PSboss_lvbu4', 'mashu');
      //改变“铁骑”的配音 
      game.changeSkillAudio('retieji', 'PSboss_lvbu2', 'mashu');
      game.changeSkillAudio('retieji', 'PSboss_lvbu3', 'mashu');
      game.changeSkillAudio('retieji', 'PSboss_lvbu4', 'mashu');
      //改变“旋风”的配音
      game.changeSkillAudio('decadexuanfeng', 'PSboss_lvbu2', 'mashu');
      game.changeSkillAudio('decadexuanfeng', 'PSboss_lvbu3', 'mashu');
      game.changeSkillAudio('decadexuanfeng', 'PSboss_lvbu4', 'mashu');
      //改变“无双”的配音
      game.changeSkillAudio('wushuang', 'PSboss_lvbu2', 'mashu');
      game.changeSkillAudio('wushuang', 'PSboss_lvbu3', 'mashu');
      game.changeSkillAudio('wushuang', 'PSboss_lvbu4', 'mashu');

      /* <-------------------------播放BGM函数，搬运自福瑞拓展，已获得原作者允许，感谢钫酸酱-------------------------> */
      if (lib.config.extension_PS武将_Background_Music && lib.config.extension_PS武将_Background_Music != "1") {
        lib.arenaReady.push(function () {
          //ui.backgroundMusic.autoplay=true;
          //ui.backgroundMusic.pause();
          game.PS_playBackgroundMusic();
          ui.backgroundMusic.addEventListener('ended', game.PS_playBackgroundMusic);
        });
      };
      game.PS_playBackgroundMusic = function () {
        //if(lib.config.background_music=='music_off'){
        //ui.backgroundMusic.src='';
        //}
        //ui.backgroundMusic.autoplay=true;
        var temp = lib.config.extension_PS武将_Background_Music;
        if (temp == '0') {
          temp = get.rand(2, 30);
          //生成一个范围2到30的整数
          temp = temp.toString();
          //转为字符串
        };
        ui.backgroundMusic.pause();
        var item = {
          "2": "一战成名.m4a",
          "3": "逐鹿天下.mp3",
          "4": "三国杀牌局重制版.mp3",
          "5": "争流.mp3",
          "6": "征战虎牢.mp3",
          "7": "决战虎牢关旧版.mp3",
          "8": "决战虎牢关.mp3",
          "9": "洛神赋.mp3",
          "10": "群英会.mp3",
          "11": "逍遥津.mp3",
          "12": "单刀赴会变奏版.mp3",
          "13": "幻化之战.mp3",
          "14": "黄巾之乱.mp3",
          "15": "军争三国.mp3",
          "16": "乱世乾坤.mp3",
          "17": "天书乱斗.mp3",
          "18": "帐前点兵.mp3",
          "19": "许昌.mp3",
          "20": "自走棋.mp3",
          "21": "OL排位.mp3",
          "22": "大闹长坂坡.mp3",
          "23": "烽火连天.mp3",
          "24": "官阶系统.mp3",
          "25": "欢乐三国杀征战.mp3",
          "26": "洛阳.mp3",
          "27": "三国杀烈.mp3",
          "28": "太虚-黄巾之乱.mp3",
          "29": "太虚-进军广宗.mp3",
          "30": "太虚-长设之战.mp3",
        };
        if (item[temp]) {
          ui.backgroundMusic.src = lib.assetURL + 'extension/PS武将/audio/BGM/' + item[temp];
        } else {
          game.playBackgroundMusic();
          ui.backgroundMusic.addEventListener('ended', game.playBackgroundMusic);
        }
      };

    },
    help: {},
    config: {
      "PS_versionUpdate": {
        name: `版本：${VERSION}`,
        init: '1',
        unfrequent: true,
        intro: "查看此版本更新说明",
        "item": {
          "1": "<font color=#2cb625>更新说明",
          //"2": "<font color=#00FF00>更新说明",
        },
        "textMenu": function (node, link) {
          lib.setScroll(node.parentNode);
          node.parentNode.style.transform = "translateY(-100px)";
          //node.parentNode.style.height = "710px";
          node.parentNode.style.width = "350px";
          node.style.cssText = "width: 350px; padding:5px; box-sizing: border-box;";
          let str = '';
          if (!lib.extensionPack.PS武将) {
            node.innerHTML = '<font color=red>[需要开启本扩展并重启才能查看]</font>';
          }
          else {
            let changeLog = window.PScharacter.updateHistory[lib.extensionPack.PS武将.version].changeLog.slice(0);
            changeLog.forEach(i => {
              if (i !== "/setPlayer/" && i !== "/setCard/") {
                window.PScharacter.characters.forEach(j => {
                  if (i.includes(lib.translate[j]) || (i.includes('〖') && i.includes('〗'))) {
                    i = i
                      .replace(new RegExp(lib.translate[j], 'g'), `<font color=#ff9800>${lib.translate[j]}</font>`)
                      .replace(new RegExp('〖', 'g'), `<font color=#24c022>〖`)
                      .replace(new RegExp('〗', 'g'), `〗</font>`)
                  }
                });
                str += `·${i}<br>`;
              }
            });
            str = `<span style="width:335px; display:block; font-size: 15px">${str}<span>`;
            /* '·<span style="color:#ffce46">PS左慈</span>增强，制衡化身时额外获得一张化身牌。',
            '·<span style="color:#ffce46">PS裴秀</span><span style="color:#24c022">【行图】</span>增加了“倒计时”显示。',
            '·优化了<span style="color:#ffce46">PS赵襄、大魏吴王、双倍许劭、PS神张辽</span>选技能时的loading框样式。（需要开启扩展<span style="color:#24c022">“天牢令”</span>，已征得<span style="color:#bd6420">铝宝</span>和<span style="color:#bd6420">雷佬</span>同意）', */
            node.innerHTML = str;
          }
        },
      },

      bd1: {
        clear: true,
        name: '兼容本体版本：1.10.4以上',
        nopointer: true
      },

      "PS_jieshao": {
        name: "扩展介绍",
        init: '1',
        unfrequent: true,
        intro: "查看扩展介绍",
        "item": {
          "1": "<font color=#2cb625>查看",
          //"2": "<font color=#00FF00>更新说明",
        },
        "textMenu": function (node, link) {
          lib.setScroll(node.parentNode);
          node.parentNode.style.transform = "translateY(-100px)";
          //node.parentNode.style.height = "710px";
          node.parentNode.style.width = "350px";
          node.style.cssText = "width: 350px; padding:5px; box-sizing: border-box;";
          node.innerHTML = '<p style="line-height: 1.3; margin:0; padding: 0; text-indent: 2em;">本扩展主要是对本体武将进行不同方向的强化设计，设计方案大部分来自于网友，小部分来自本人（均有备注），强度基本上处<font class="firetext">半阴</font>到<font class="firetext">阴间</font>的范围。如果你在游玩过程中遇到bug，可以通过qq群或b站私信（b站同名）向本人反馈。</p>';
        },
      },

      "PS_jiaqun": {
        name: '交流群<img style="vertical-align: text-top; transition: all .8s; linear; transform: rotate(-90deg); width:16px;" src=' + lib.assetURL + 'extension/PS武将/image/other/T2.png>',
        clear: true,
        onclick: function () {
          if (this.jiaqun == undefined) {
            this.jiaqun = ui.create.div('.PSjiaqun');
            this.icon = this.querySelector('img');
            var more = ui.create.div('.PSjiaqun-content', `<a href="https://qm.qq.com/q/Lm30YLypeq"><img src="${lib.assetURL}extension/PS武将/image/other/QQgroup.jpg" style="width:100%; vertical-align:bottom;"></a>`);
            this.parentNode.insertBefore(this.jiaqun, this.nextSibling);
            this.jiaqun.appendChild(more);
            setTimeout(() => this.jiaqun.style.gridTemplateRows = '1fr', 0);
            this.jiaqun.dataset.id = '1';
            this.icon.style.transform = 'rotate(0deg)';
          } else if (this.jiaqun.dataset.id == '1') {
            this.jiaqun.style.gridTemplateRows = '0fr';
            this.jiaqun.firstElementChild.style.border = '0';
            this.jiaqun.dataset.id = '0';
            // this.icon.style.transformOrigin = '50% 33.33%';
            this.icon.style.transform = 'rotate(-90deg)';
          }
          else {
            //this.parentNode.removeChild(this.jiaqun);
            //delete this.jiaqun;    
            this.jiaqun.style.gridTemplateRows = '1fr';
            this.jiaqun.firstElementChild.style.border = '2px solid gray';
            this.jiaqun.dataset.id = '1';
            // this.icon.style.transformOrigin = '33.33% 50%';
            this.icon.style.transform = 'rotate(0deg)';
          }
        },
      },

      "PS_splash": {
        name: "启动页美化",
        init: game.getExtensionConfig('PS武将', 'PS_splash') === undefined ? "default" : game.getExtensionConfig('PS武将', 'PS_splash'),
        unfrequent: true,
        intro: "更改启动页背景图（重启生效）",
        "item": {
          "default": "不更改",
          "solarTerms": "节气图",
          "skin": "皮肤图",
        },
        onclick: function (item) {
          game.saveExtensionConfig('PS武将', 'PS_splash', item);
        },
        "textMenu": function (node, link) {
          lib.setScroll(node.parentNode);
          node.parentNode.style.transform = "translateY(-100px)";
          //node.parentNode.style.height = "710px";
          node.parentNode.style.width = "296px";
          node.style.cssText = "width: 296px; height: 170px; position:relative; padding:0; border-radius:10px; color: white; box-sizing:border-box;";
          if (link === "default") {
            node.style.height = "38px";
            node.innerHTML = '<div style="font-family: xingkai, xinwei;line-height:28px; text-align: center; width: 288px; height:30px; box-sizing:border-box; border-radius:10px; border:2px solid gray; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);">不更改</div>';
          }
          else {
            node.innerHTML = `<div class="PSselect-item" style="background:url(${lib.assetURL}extension/PS武将/image/splash/${link}.jpg) no-repeat right center/cover"><span style="font-family: xingkai, xinwei;">${node.innerText}</span></div>`;
          }
        },
      },

      "PS_prefix": {
        name: "武将前缀",
        init: lib.config.extension_PS武将_PS_prefix === undefined ? "PS" : lib.config.extension_PS武将_PS_prefix,
        unfrequent: true,
        intro: "更改武将前缀样式（重启生效）",
        "item": {
          "PS": "默认",
          "none": "隐藏",
          "p": "符号",
        },
        onclick: function (item) {
          game.saveConfig('extension_PS武将_PS_prefix', item);
        },
        "textMenu": function (node, link) {
          lib.setScroll(node.parentNode);
          node.parentNode.style.transform = "translateY(-100px)";
          // node.parentNode.style.height = "240px";
          node.parentNode.style.cssText = "display: flex; width: 381px; justify-content:space-evenly; ";
          node.style.cssText = "width: 127px; height: 150px; position:relative; padding:0; margin:0; border-radius:12px; box-sizing:border-box;";
          node.innerHTML = `<div class="PSselect-item" style="width: 121px; height: 144px; border-radius: 12px; padding-top: 60px; background:url(${lib.assetURL}extension/PS武将/image/prefix/${link}.jpg) no-repeat right center/cover"><span style="font-family: xingkai, xinwei;font-size:20px" class="firetext">${node.innerText}</span></div>`;
        },
      },

      //切换BGM
      "Background_Music": {
        name: `背景音乐<div class="PSmusic-container"><div class="PSneedle" style="background: url(${lib.assetURL}extension/PS武将/image/music/needle.png) no-repeat 0 0/cover"></div><div class="PSrecord-box"><div class="PSrecord" style="background: url(${lib.assetURL}extension/PS武将/image/music/coverall.png) no-repeat -140px -580px"></div><div class="PSrecord-img" style="background: url(${lib.assetURL}extension/PS武将/image/music/${lib.config.extension_PS武将_Background_Music || '1'}.jpg) no-repeat 0 0/cover"></div></div></div>`,
        clear: true,
        intro: "背景音乐：可随意点播、切换优质动听的背景音乐",
        init: lib.config.extension_PS武将_Background_Music === undefined ? "1" : lib.config.extension_PS武将_Background_Music,
        item: {
          "0": "随机播放",
          "1": "默认音乐",
          "2": "一战成名",
          "3": "逐鹿天下",
          "4": "三国杀牌局重制版",
          "5": "争流",
          "6": "征战虎牢",
          "7": "决战虎牢关旧版",
          "8": "决战虎牢关",
          "9": "洛神赋",
          "10": "群英会",
          "11": "逍遥津",
          "12": "单刀赴会变奏版",
          "13": "幻化之战",
          "14": "黄巾之乱",
          "15": "军争三国",
          "16": "乱世乾坤",
          "17": "天书乱斗",
          "18": "帐前点兵",
          "19": "许昌",
          "20": "自走棋",
          "21": "OL排位",
          "22": "大闹长坂坡",
          "23": "烽火连天",
          "24": "官阶系统",
          "25": "欢乐三国杀征战",
          "26": "洛阳",
          "27": "三国杀烈",
          "28": "太虚-黄巾之乱",
          "29": "太虚-进军广宗",
          "30": "太虚-长设之战",
        },
        onclick: function (item) {
          let div = document.querySelector('.PSrecord-box .PSrecord-img');
          div.style.backgroundImage = `url(${lib.assetURL}extension/PS武将/image/music/${item}.jpg)`;
          game.saveConfig('extension_PS武将_Background_Music', item);
          game.PS_playBackgroundMusic();
          ui.backgroundMusic.addEventListener('ended', game.PS_playBackgroundMusic);
        },
        "visualMenu": function (node, link) {
          lib.setScroll(node.parentNode);
          node.parentNode.style.cssText = "padding: 8px; color: white;";
          node.style.cssText = `width: 94px; height: 80px; box-sizing: border-box; border-radius: 10px 0 0 10px; margin: 8px; background: url(${lib.assetURL}extension/PS武将/image/music/coverall.png) no-repeat -240px -1120px`;
          node.innerHTML = `<div style="width: 80px; height: 80px; box-sizing: border-box; border-radius: 10px; font-family: xingkai, xinwei; padding: 3px; background:url(${lib.assetURL}extension/PS武将/image/music/${link}.jpg) no-repeat right center/cover ">${node.innerText}</div>`;
        },
      },

      "PS_spCharacter": {
        "name": "特殊武将",
        "intro": '开启/关闭PS特殊武将包（重启生效）',
        "init": lib.config.extension_PS武将_PS_spCharacter === undefined ? false : lib.config.extension_PS武将_PS_spCharacter,
        onclick: function (item) {
          game.saveConfig('extension_PS武将_PS_spCharacter', item);
        },
      },

      "PS_hudong": {
        "name": "表情互动",
        "intro": '开启后玩家与ai在特定情景会触发表情（重启生效）<img src="' + lib.assetURL + 'image/emotion/zhenji_emotion/13.gif"><img src="' + lib.assetURL + 'image/emotion/guojia_emotion/13.gif">',
        "init": lib.config.extension_PS武将_PS_hudong === undefined ? false : lib.config.extension_PS武将_PS_hudong,
        onclick: function (item) {
          game.saveConfig('extension_PS武将_PS_hudong', item);
        },
      },

      "PS_pingzeTip": {
        "name": "平仄提示",
        "intro": '开启后使用武将PS李白，手牌会有相应提示（即时生效）',
        "init": lib.config.extension_PS武将_PS_pingzeTip === undefined ? false : lib.config.extension_PS武将_PS_pingzeTip,
        onclick: function (item) {
          game.saveConfig('extension_PS武将_PS_pingzeTip', item);
        },
      },

      //编辑武将功能，搬运自“活动武将”，已得到原作者允许，感谢萌新（转型中）
      "edit_PScharacters": {
        name: '<ins>编辑将池</ins>',
        "intro": '打开“编辑武将”功能页面',
        clear: true,
        onclick: function () {
          debugger
          var container = ui.create.div('.popup-container.editor');
          var editorpage = ui.create.div(container);
          var discardConfig = ui.create.div('.editbutton', '取消', editorpage, function () {
            ui.window.classList.remove('shortcutpaused');
            ui.window.classList.remove('systempaused');
            container.delete(null);
            delete window.saveNonameInput;
          });
          var node = container;
          var map = lib.config.extension_PS武将_PScharacters || [];
          var shed = lib.config.extension_PS武将_PSremoveCharacters || [];
          var add = lib.config.extension_PS武将_PSaddCharacter || [];
          var remove = lib.config.extension_PS武将_PSremoveCharacter || [];
          var str = '//编辑将池，适用武将：PS赵襄、PS左慈、大魏吴王、PS许劭、双倍许劭、梦刘备、PS神孙权，请按照示例正确书写';
          str += '\n//均用英文标点符号！！！\n';
          str += '\n//PScharacters是添加的武将包，“[]”内填武将包名（武将包名可以在武将面板上查看），不写默认为全扩武将包'
          str += '\n//示例：PScharacters = ["界限突破","PS武将","欢乐三国杀"];';
          str += '\nPScharacters=[\n';
          for (var i = 0; i < map.length; i++) {
            str += '"' + map[i] + '",';
            if (i + 1 < map.length && (i + 1) % 5 == 0) str += '\n';
          }
          str += '\n];\n';
          str += '\n//PSremoveCharacters是移除的武将包，“[]”内填武将包名，示例同上';
          str += '\nPSremoveCharacters=[\n';
          for (var i = 0; i < shed.length; i++) {
            str += '"' + shed[i] + '",';
            if (i + 1 < shed.length && (i + 1) % 5 == 0) str += '\n';
          }
          str += '\n];\n';
          str += '\n//PSaddCharacter是添加的武将，“[]”内填武将id'
          str += '\n//示例：PSaddCharacter = ["liubei","guanyu","zhangfei"];';
          str += '\nPSaddCharacter=[\n';
          for (var i = 0; i < add.length; i++) {
            str += '"' + add[i] + '",';
            if (i + 1 < add.length && (i + 1) % 5 == 0) str += '\n';
          }
          str += '\n];\n';
          str += '\n//PSremoveCharacter是移除的武将，“[]”内填武将id，示例同上'
          str += '\nPSremoveCharacter=[\n';
          for (var i = 0; i < remove.length; i++) {
            str += '"' + remove[i] + '",';
            if (i + 1 < remove.length && (i + 1) % 5 == 0) str += '\n';
          }
          str += '\n];\n';
          str += '\n//将池 = （添加的武将包 - 移除的武将包）内的所有武将 + 添加的武将 - 移除的武将';
          node.code = str;
          ui.window.classList.add('shortcutpaused');
          ui.window.classList.add('systempaused');
          var saveInput = function () {
            var code;
            if (container.editor) {
              code = container.editor.getValue();
            }
            else if (container.textarea) {
              code = container.textarea.value;
            }
            try {
              var PScharacters = null;
              var PSremoveCharacters = null;
              var PSaddCharacter = null;
              var PSremoveCharacter = null;
              eval(code);
              if (!Array.isArray(PScharacters) || !Array.isArray(PSremoveCharacters) || !Array.isArray(PSaddCharacter) || !Array.isArray(PSremoveCharacter)) {
                throw ('err');
              }
            }
            catch (e) {
              alert('代码语法有错误，请仔细检查（' + e + '）');
              return;
            }
            game.saveConfig('extension_PS武将_PScharacters', PScharacters);
            game.saveConfig('extension_PS武将_PSremoveCharacters', PSremoveCharacters);
            game.saveConfig('extension_PS武将_PSaddCharacter', PSaddCharacter);
            game.saveConfig('extension_PS武将_PSremoveCharacter', PSremoveCharacter);
            ui.window.classList.remove('shortcutpaused');
            ui.window.classList.remove('systempaused');
            container.delete();
            container.code = code;
            delete window.saveNonameInput;
          };
          window.saveNonameInput = saveInput;
          var saveConfig = ui.create.div('.editbutton', '保存', editorpage, saveInput);
          var editor = ui.create.div(editorpage);
          if (node.aced) {
            ui.window.appendChild(node);
            node.editor.setValue(node.code, 1);
          }
          else if (lib.device == 'ios') {
            ui.window.appendChild(node);
            if (!node.textarea) {
              var textarea = document.createElement('textarea');
              editor.appendChild(textarea);
              node.textarea = textarea;
              lib.setScroll(textarea);
            }
            node.textarea.value = node.code;
          }
          else {
            var aceReady = function () {
              ui.window.appendChild(node);
              var mirror = window.CodeMirror(editor, {
                value: node.code,
                mode: "javascript",
                lineWrapping: !lib.config.touchscreen && lib.config.mousewheel,
                lineNumbers: true,
                indentUnit: 4,
                autoCloseBrackets: true,
                theme: 'mdn-like'
              });
              lib.setScroll(editor.querySelector('.CodeMirror-scroll'));
              node.aced = true;
              node.editor = mirror;
            }
            if (!window.ace) {
              import('../../game/codemirror.js').then(() => {
                aceReady();
              });
              lib.init.css(lib.assetURL + 'layout/default', 'codemirror');
            }
            else {
              aceReady();
            }
          };
        },
      },

      /* "PS_joinUs": {
        "clear": true,
        name: '<span class="PSjoinUs">点击加入交流群</span>',
        onclick: function () {
          ui.click.configMenu();
          window.open('https://qm.qq.com/q/Lm30YLypeq');
        },
      }, */

      "PS_forbidai": {
        "clear": true,
        name: '<ins>AI禁将</ins>',
        onclick: function () {
          window.PScharacter.forbidaiShow();
        },
      },
    },

    package: {
      //  intro:"",
      author: '九个芒果',
      diskURL: "",
      forumURL: "",
      version: VERSION,
    }, files: { "character": [], "card": [], "skill": [] },
  }
})