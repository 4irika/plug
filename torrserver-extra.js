/*
    Lampa Plugin: TorrServer Switcher
    Version: 1.2.0
    Author: 4irika + Copilot
*/

(function () {
    'use strict';

    const STORAGE_LIST = 'torrserver_extra_urls';
    const STORAGE_ACTIVE = 'torrserver_active_url';

    function getList() {
        let list = Lampa.Storage.get(STORAGE_LIST, []);
        if (!Array.isArray(list)) list = [];
        return list;
    }

    function saveList(list) {
        Lampa.Storage.set(STORAGE_LIST, list);
    }

    function getActive() {
        return Lampa.Storage.get(STORAGE_ACTIVE, '');
    }

    function setActive(url) {
        Lampa.Storage.set(STORAGE_ACTIVE, url);
    }

    function openSettings() {
        const list = getList();
        const active = getActive();

        const settings = new Lampa.Settings({
            title: 'Переключатель TorrServer',
            onBack: function () {
                Lampa.Controller.toggle('settings');
            }
        });

        const body = settings.body();

        body.append('<div class="settings-param-title">Список TorrServer</div>');

        list.forEach((url, index) => {
            const item = $('<div class="settings-param"></div>');
            const input = $('<input class="settings-input" placeholder="http://IP:8090/" />');
            const selectBtn = $('<div class="settings-param__name" style="margin-top:5px;cursor:pointer;color:#00a1ff">Сделать активным</div>');

            input.val(url);

            input.on('change', function () {
                list[index] = $(this).val().trim();
                saveList(list);
            });

            selectBtn.on('click', function () {
                setActive(url);
                Lampa.Noty.show('Активный сервер: ' + url);
            });

            item.append(input);
            item.append(selectBtn);
            body.append(item);
        });

        const addBtn = $('<div class="settings-param settings-param--button"><div class="settings-param__name">Добавить сервер</div></div>');
        addBtn.on('click', function () {
            list.push('');
            saveList(list);
            settings.update();
        });

        body.append(addBtn);

        const activeBlock = $('<div class="settings-param-title" style="margin-top:20px">Текущий активный сервер</div>');
        const activeValue = $('<div class="settings-param"><div class="settings-param__name">' + (active || 'Не выбран') + '</div></div>');

        body.append(activeBlock);
        body.append(activeValue);

        settings.create();
    }

    function startPlugin() {
        Lampa.Settings.add({
            title: 'Переключатель TorrServer',
            group: 'torrserver',
            onSelect: function () {
                openSettings();
            }
        });
    }

    Lampa.Plugin.create(
        'torrserver_switcher',
        startPlugin,
        'Переключатель TorrServer',
        'torrent'
    );
})();
