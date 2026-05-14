(() => {
    const KEY_LIST = 'torrswitch_list';
    const KEY_ACTIVE = 'torrswitch_active';

    function getList() {
        let list = Lampa.Storage.get(KEY_LIST, []);
        return Array.isArray(list) ? list : [];
    }

    function saveList(list) {
        Lampa.Storage.set(KEY_LIST, list);
    }

    function getActive() {
        return Lampa.Storage.get(KEY_ACTIVE, '');
    }

    function setActive(url) {
        Lampa.Storage.set(KEY_ACTIVE, url);
    }

    function Component() {
        let list = getList();
        let active = getActive();

        let html = $('<div class="settings-container"></div>');

        html.append('<div class="settings-param-title">Список серверов</div>');

        list.forEach((url, i) => {
            let row = $('<div class="settings-param"></div>');
            let input = $('<input class="settings-input" placeholder="http://IP:8090/">');
            let btn = $('<div class="settings-param__name" style="color:#00a1ff;margin-top:5px">Сделать активным</div>');

            input.val(url);

            input.on('change', () => {
                list[i] = input.val().trim();
                saveList(list);
            });

            btn.on('click', () => {
                setActive(url);
                Lampa.Noty.show('Активный сервер: ' + url);
            });

            row.append(input);
            row.append(btn);
            html.append(row);
        });

        let addBtn = $('<div class="settings-param settings-param--button"><div class="settings-param__name">Добавить сервер</div></div>');
        addBtn.on('click', () => {
            list.push('');
            saveList(list);
            Lampa.SettingsApi.update();
        });

        html.append(addBtn);

        html.append('<div class="settings-param-title" style="margin-top:20px">Текущий активный сервер</div>');
        html.append('<div class="settings-param"><div class="settings-param__name">' + (active || 'Не выбран') + '</div></div>');

        this.render = function (body) {
            body.append(html);
        };
    }

    Lampa.SettingsApi.addComponent({
        name: 'Переключатель TorrServer',
        component: Component
    });

    Lampa.Noty.show('Переключатель TorrServer загружен');
})();
