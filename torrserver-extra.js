(function () {
    const STORAGE_KEY = 'torrserver_extra_urls';

    function getStoredUrls() {
        return Lampa.Storage.get(STORAGE_KEY, []);
    }

    function saveUrls(urls) {
        Lampa.Storage.set(STORAGE_KEY, urls);
    }

    Lampa.Plugin.create({
        title: 'Доп. TorrServer',
        icon: 'icon',
        onStart: function () {
            const urls = getStoredUrls();

            Lampa.SettingsApi.addComponent({
                component: 'torrserver_extra',
                name: 'Дополнительные TorrServer',
                icon: 'torrent',
                onRender: function (body) {
                    body.append('<div class="settings-param-title">Дополнительные ссылки на TorrServer</div>');

                    urls.forEach((url, index) => {
                        const input = $('<input class="settings-input" placeholder="http://IP:8090/" />');
                        input.val(url);

                        input.on('change', function () {
                            urls[index] = $(this).val();
                            saveUrls(urls);
                        });

                        body.append(input);
                    });

                    const addBtn = $('<div class="settings-param settings-param--button"><div class="settings-param__name">Добавить поле</div></div>');
                    addBtn.on('click', function () {
                        urls.push('');
                        saveUrls(urls);
                        Lampa.Settings.update();
                    });

                    body.append(addBtn);
                }
            });

            Lampa.SettingsApi.addParam({
                component: 'torrserver_extra',
                param: {
                    name: 'info',
                    type: 'text',
                    value: 'Здесь вы можете добавить дополнительные ссылки на TorrServer'
                }
            });
        }
    });
})();
