/*
    Lampa Plugin: Test plugin
    Version: 0.0.1
*/

(function () {
    'use strict';

    function start() {
        Lampa.Noty.show('Тестовый плагин загрузился');
    }

    Lampa.Plugin.create(
        'test_plugin',
        start,
        'Тестовый плагин',
        'time'
    );
})();
