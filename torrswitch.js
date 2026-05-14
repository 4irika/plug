export default function () {
    const STORAGE_LIST = 'torrswitch_list';
    const STORAGE_ACTIVE = 'torrswitch_active';

    function getList() {
        return Lampa.Storage.get(STORAGE_LIST, []);
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

        const modal = new Lampa.Modal({
            title: 'Переключатель TorrServer',
            onBack: () => Lampa.Controller.toggle('settings')
        });

        const body = modal.body();

        body.append('<div class="settings-param-title">Список серверов</div>');

        list.forEach((url, i) => {
            const row = $('<div class="settings-param"></div>');
            const input = $('<input class="settings-input" placeholder="http://IP:8090/">');
            const btn = $('<div class="settings-param__name" style="color:#00a1ff;margin-top:5px">Сделать активным</div>');

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
            body.append(row);
        });

        const addBtn = $('<div class="settings-param settings-param--button"><div class="settings-param__name">Добавить сервер</div></div>');
        addBtn.on('click', () => {
            list.push('');
            saveList(list);
            modal.update();
        });

        body.append(addBtn);

        body.append('<div class="settings-param-title" style="margin-top:20px">Текущий активный сервер</div>');
        body.append('<div class="settings-param"><div class="settings-param__name">' + (active || 'Не выбран') + '</div></div>');

        modal.create();
    }

    Lampa.SettingsApi.addComponent({
        title: 'Переключатель TorrServer',
        onRender: openSettings
    });
}
