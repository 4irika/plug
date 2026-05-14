/*
    Lampa Plugin: Дополнительные TorrServer
    Version: 1.0.1
*/

(function () {
    'use strict';

    var STORAGE_KEY = 'torrserver_extra_urls';

    function getStoredUrls() {
        var urls = Lampa.Storage.get(STORAGE_KEY, []);
        if (!Array.isArray(urls)) urls = [];
        return urls;
    }

    function saveUrls(urls) {
        Lampa.Storage.set(STORAGE_KEY, urls);
    }

    function renderSettings() {
        var urls = getStoredUrls();

        var settings = new Lampa.Settings({
            title: 'Дополнительные TorrServer',
            onBack: function () {
                Lampa.Controller.toggle('settings');
            }
        });

        var body = settings.body();

        var info = $('<div class="settings-param-title">Дополнительные ссылки на TorrServer</div>');
        body.append(info);

        urls.forEach(function (url, index) {
            var item = $('<div class="settings-param"></div>');
            var input = $('<input class="settings-input" placeholder="http://IP:8090/" />');

            input.val(url);

            input.on('change', function () {
                urls[index] = $(this).val().trim();
                saveUrls(urls);
            });

            item.append(input);
            body.append(item);
        });

        var addBtn = $('<div class="settings-param settings-param--button"><div class="settings-param__name">Добавить поле</div></div>');

        addBtn.on('click', function () {
            urls.push('');
            saveUrls(urls);
            settings.update();
        });

        body.append(addBtn);

        settings.create();
    }

    function startPlugin() {
        // Добавляем пункт в настройки
        Lampa.Settings.add({
            title: 'Дополнительные TorrServer',
            group: 'torrserver',
            onSelect: function () {
                renderSettings();
            }
        });
    }

    Lampa.Plugin.create('torrserver_extra', startPlugin, 'Доп. TorrServer', 'torrent');
})();
