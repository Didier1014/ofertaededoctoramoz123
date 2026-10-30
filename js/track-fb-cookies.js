 (function () {
            // 1️⃣ Inserir o Meta Pixel dinamicamente no DOM
            (function (f, b, e, v, n, t, s) {
                if (f.fbq) return;
                n = f.fbq = function () {
                    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
                };
                if (!f._fbq) f._fbq = n;
                n.push = n;
                n.loaded = !0;
                n.version = '2.0';
                n.queue = [];
                t = b.createElement(e);
                t.async = !0;
                t.src = v;
                s = b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t, s);
            })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '3233922930116692');
            fbq('track', 'PageView');

            // 2️⃣ Função para obter cookies
            function getCookie(name) {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop().split(';').shift();
                return null;
            }

            // 3️⃣ Função para adicionar parâmetros à URL
            function addParameterToURL(url, paramName, paramValue) {
                if (!paramValue) return url; // ignora se o valor for nulo
                try {
                    const urlObj = new URL(url, window.location.origin);
                    urlObj.searchParams.set(paramName, paramValue);
                    return urlObj.toString();
                } catch {
                    return url + (url.includes('?') ? '&' : '?') + paramName + '=' + encodeURIComponent(paramValue);
                }
            }

            // 4️⃣ Função principal: adicionar fbp e fbc às URLs
            function appendMetaParams(url) {
                const fbp = getCookie('_fbp');
                const fbc = getCookie('_fbc');
                let newUrl = url;
                if (fbp) newUrl = addParameterToURL(newUrl, 'fbp', fbp);
                if (fbc) newUrl = addParameterToURL(newUrl, 'fbc', fbc);
                return newUrl;
            }

            // 5️⃣ Interceptar cliques em âncoras
            document.addEventListener('click', function (event) {
                const anchor = event.target.closest('a');
                if (!anchor || !anchor.href) return;
                const newUrl = appendMetaParams(anchor.href);
                if (newUrl !== anchor.href) {
                    event.preventDefault();
                    console.log('🔗 Redirecionando com parâmetros Meta:', newUrl);
                    window.location.assign(newUrl);
                }
            }, true);

            // 6️⃣ Interceptar redirecionamentos via JS
            const originalAssign = window.location.assign;
            window.location.assign = function (url) {
                const newUrl = appendMetaParams(url);
                console.log('➡️ Redirecionando via assign com Meta params:', newUrl);
                return originalAssign.call(window.location, newUrl);
            };

            const originalReplace = window.location.replace;
            window.location.replace = function (url) {
                const newUrl = appendMetaParams(url);
                console.log('♻️ Substituindo via replace com Meta params:', newUrl);
                return originalReplace.call(window.location, newUrl);
            };
        })();
