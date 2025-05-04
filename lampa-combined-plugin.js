
(function () {
    'use strict';

    // Установка пользовательских доменов и зеркал
    localStorage.setItem('cub_domain', 'lampadev.ru');
    localStorage.setItem('cub_mirrors', JSON.stringify(['lampadev.ru', 'cub.rip']));

    // Активация режима TV-платформы
    if (typeof Lampa !== 'undefined' && Lampa.Platform && typeof Lampa.Platform.tv === 'function') {
        Lampa.Platform.tv();
    }

    // Список альтернативных IP-адресов для TMDB
    const tmdbIPs = {
        'api.themoviedb.org': ['108.157.4.61'],
        'image.tmdb.org': ['89.187.169.39']
    };

    // Переопределение функции fetch для проксирования запросов
    const originalFetch = window.fetch;
    window.fetch = function (input, init) {
        let url = typeof input === 'string' ? input : input.url;
        try {
            const parsedUrl = new URL(url);
            const host = parsedUrl.hostname;

            if (tmdbIPs[host]) {
                const ip = tmdbIPs[host][0];
                parsedUrl.hostname = ip;
                const modifiedUrl = parsedUrl.toString();

                const newInit = Object.assign({}, init, {
                    headers: Object.assign({}, init?.headers, {
                        'Host': host
                    })
                });

                return originalFetch(modifiedUrl, newInit);
            }
        } catch (e) {
            console.error('Ошибка при проксировании запроса:', e);
        }

        return originalFetch(input, init);
    };

    console.log('Объединённый плагин для Lampa активирован');
})();
