(function () {
    'use strict';

    if (window.lampa_adblock_ready) return;
    window.lampa_adblock_ready = true;

    // Паттерны рекламных запросов
    var AD_PATTERNS = [
        '/vast',
        '/vpaid',
        '/preroll',
        '/adv?',
        '/ads?',
        'ad_place_type=',
        'content_type=avod',
        'cachebuster=',
        'adfox',
        'betweendigital.com',
        'yandex.ru/ads',
        'an.yandex.ru',
        'doubleclick.net',
        'googlesyndication',
        'mc.yandex.ru/watch',
        'ad.mail.ru',
        'ads.',
        'advert'
    ];

    // Блокируем сетевые запросы рекламы
    function blockAds() {
        // Перехват fetch
        if (window.fetch) {
            var originalFetch = window.fetch;
            window.fetch = function () {
                var url = arguments[0];
                if (typeof url === 'string') {
                    for (var i = 0; i < AD_PATTERNS.length; i++) {
                        if (url.toLowerCase().indexOf(AD_PATTERNS[i]) !== -1) {
                            return Promise.reject(new Error('Ad blocked'));
                        }
                    }
                }
                return originalFetch.apply(this, arguments);
            };
        }

        // Перехват XMLHttpRequest
        if (window.XMLHttpRequest) {
            var originalOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function (method, url) {
                if (typeof url === 'string') {
                    for (var i = 0; i < AD_PATTERNS.length; i++) {
                        if (url.toLowerCase().indexOf(AD_PATTERNS[i]) !== -1) {
                            this.abort = function () {};
                            return;
                        }
                    }
                }
                return originalOpen.apply(this, arguments);
            };
        }
    }

    // Патчим плеер Lampa — убираем vast/preroll
    function patchPlayer() {
        if (!window.Lampa || !Lampa.Player) return false;

        if (Lampa.Player.play && !Lampa.Player._adBlocked) {
            var originalPlay = Lampa.Player.play;

            Lampa.Player.play = function (element) {
                if (element) {
                    // Полностью очищаем рекламные поля
                    element.vast = null;
                    element.vast_url = null;
                    element.vast_msg = null;
                    element.vast_region = null;
                    element.vast_platform = null;
                    element.vast_screen = null;
                    element.preroll = null;
                    element.advert = null;
                    element.ad = null;
                }
                return originalPlay.apply(this, arguments);
            };

            Lampa.Player._adBlocked = true;
        }
        return true;
    }

    // Скрываем рекламные элементы через CSS
    function hideAdElements() {
        var style = document.createElement('style');
        style.id = 'lampa-adblock-css';
        style.textContent = `
            .ad-preroll,
            .ad-notify,
            .player-video__ad,
            .player__advert,
            .advert,
            .vast,
            [class*="ad-"],
            [class*="advert"],
            [id*="ad-"],
            [id*="advert"] {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
                height: 0 !important;
                width: 0 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Основной запуск
    function init() {
        blockAds();
        hideAdElements();

        // Пробуем сразу пропатчить плеер
        if (!patchPlayer()) {
            // Если Lampa ещё не готова — ждём
            Lampa.Listener.follow('app', function (e) {
                if (e.type === 'ready') {
                    patchPlayer();
                }
            });
        }

        // Дополнительно ловим события плеера
        Lampa.Listener.follow('player', function (e) {
            if (e.type === 'start' || e.type === 'ready') {
                patchPlayer();
            }
        });
    }

    // Запуск
    if (window.appready || (window.Lampa && Lampa.Manifest)) {
        init();
    } else {
        document.addEventListener('appready', init);
        // Запасной вариант
        setTimeout(init, 3000);
    }

})();
