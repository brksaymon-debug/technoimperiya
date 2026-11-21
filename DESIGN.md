> Historical design evolution below. Current implementation/evidence and unresolved performance gate: docs/MASTER-CLOSEOUT.md. Node/SQLite admin/orders work locally; Pages remains static preview.

> CURRENT UPDATE: the separate new transparent PNG is now complete and integrated over a clean plate. See PNG-COMPLETION.md. Prior no-PNG statements below describe the earlier pass only.

# Актуальное уточнение — чёрно-красный физический магазин + Дед Мороз

Родной бренд владельца BLACK+RED применён к header, логотипу, CTA, главной, брендам, каталогу и footer. Бордо/ivory не являются основой текущей версии; золото осталось только небольшим праздничным акцентом в украшении/ленте. Локальные Commissioner (основная и продуктовая типографика) и Russo One (логотип/числовые акценты) сохранены, не заменены на очередную шаблонную пару. Кириллические glyphs и реальные computed styles повторно проверены.

Дед Мороз добавлен в само цельное фотографическое окружение — с тенью, светом, красной длинной шубой и подарком, а не старым вырезанным Santa. Дополнительное точечное редактирование добавило подарки на пол после отдельного уточнения владельца. Ширина/положение телевизора оставляют лицо видимым. TV стоит на опоре: desktop ножки выровнены с плоскостью реальной тумбы и локальными контактными тенями, без широкого glow. В мобильной композиции foreground-тумба имеет точную общую support line с ножками; координаты проверены скриптом. Дед Мороз остаётся справа и не закрывает CTA/controls.

Сохранены три сцены Framer Motion, пауза, reduced-motion, каталог и весь shopping-flow. Диапазон 30–70% внутри TV — чётко подписанная демонстрация акции, не реальная скидка. Отдельное видео и отдельный прозрачный PNG Деда Мороза не создавались: персонаж интегрирован непосредственно в новую фотографическую среду.

Текущий backup: /workspace/technoimperiya-before-black-red/. Текущий основной QC: qc/holiday-world-report.json + qc/black-red-craft-report.json. Ниже — исходное направление предыдущего прохода для provenance, не описание нынешней палитры.

---
# Техноимперия / Holiday World — действующее направление

## Что изменено по прямому исправлению пользователя
Не косметика старого баннера: убраны чёрная пустота, cutout Santa, имитация desktop-OS и отдельная карточка кампании. Создана цельная зимняя фотографическая среда с бордовыми стенами, морозным окном, настоящими материалами, ёлкой/огнями/подарками и золотым подиумом. Сам телевизор — DOM-объект нормальной пропорции 16:9 с общей перспективой, опорой и контактной тенью. Вся типографика и motion внутри его поверхности — код, а не текст в картинке или hotspot-скриншот.

Главная сразу называет товар: телевизоры с уценкой. HTML-заголовок «Новый год. Новый экран.»; primary CTA прокручивает к настоящему каталогу на той же странице, не к очередному рекламному экрану. Бренды — ссылки-фильтры. Ниже тёплая светлая торговая плоскость и понятные действия покупателя. Телефон — отдельная вертикальная композиция с сохранённой средой и TV, нативным скроллом и touch controls.

## Storyboard, записан до реализации
HOLIDAY-STORYBOARD.md зафиксировал окружение/иерархию и три сцены по 6 секунд. Около 0.65–0.8 секунды на переход, затем пауза для чтения. Золотая лента рисуется по SVG path; украшение имеет материальный свет и тихое pendulum-движение; композиция и крупное число раскрываются Framer Motion. Это не один hover pulse и не фон-видео. Кадры/пауза работают вручную. Reduced-motion статичен; автоцикл не работает вне viewport/активной вкладки или при keyboard focus.

## Честность
Кадр «−30%» — пример оформления акции. Постоянный stamp «ДЕМО · НЕ ДЕЙСТВУЮЩАЯ АКЦИЯ», дополнительное пояснение под TV и в footer сцены. Нет реальных скидок, остатков, отзывов/контактов или цен, которых не дал владелец. Странная «наценка» из старого референса не повторяется. Реальный каталог пуст; примеры включаются явно. Backend, оплата, отправка и вход не подключены.

## Источники качества, без новых циклов исследования
Ранее ограниченно исследованные проекты: https://www.eseagency.ch/en (масштаб композиции/тихая навигация; визуальные наблюдения координатора), https://revenant.tv/ → kevmccrae.com (cinematic still + contextual overlay, наблюдение координатора), https://www.relyonkaide.com/ (последовательность по метаданным канала; anti-bot, визуальный аудит не заявляется), https://steamboat.pha5e.com/ (одна цельная метафора по описанию канала), https://kzero.com/ (progressive storytelling по метаданным/title). Не заявляем просмотр тысяч сайтов или копирование анимаций. Теперь эти принципы служат именно новогоднему магазину, не агентскому портфолио.

## Применённые skills
UI UX Pro Max: прочитан полный upstream manual (тот же проверенный SHA256), выполнен релевантный --design-system “television ecommerce cinematic holiday”, результат в docs/holiday-design-guidance.md. Использованы showcase/CTA hierarchy, depth, separate content planes, focus/reduced-motion. Автоматически предложенные зелёно-оранжевая палитра и Rubik/Nunito отвергнуты как не соответствующие бренду: сохранены Commissioner/Russo One, бордо/золото/зимний свет. Не придумывали social proof из suggested pattern.
Vercel: React ViewTransition сохранён только для product continuity; Framer Motion — только для самой презентации. Они не анимируют одну и ту же поверхность. Functional state updater для цикла, корректный cleanup timeout/listeners/observer, derived running-state, размеры изображения/WebP и нативные links/buttons. Выполнялся только текущий визуальный brief, не отложенный 20-пунктный технический аудит.

## Что не утверждается
Это frontend-концепция, не готовый production-backend; тесты не доказывают «лучший магазин» или субъективный уровень 2026 года. Нет human video review, device-lab/cross-browser/полного WCAG/Core Web Vitals аудита. Наследованные compressed source/переопределения CSS и дальнейшая интеграция данных остаются техническим долгом. Код предыдущей версии сохранён в /workspace/technoimperiya-before-holiday-world/.


## t836 reference-informed signature (no concept restart)
Idea: the room is the TV showroom; the picture becomes the buying surface. Signature: a short compositor camera push while leaving the existing grounded hero, then a visibly expanding TV inside its collection mask over a controlled red material panel. No added scroll height, pinning or catalog gating. Emotion: warm, assured technical retail. Motion verb: frame → open → choose. Screenshot frame: hero camera/first collection at .2/.4 progress.
Reference provenance: parent actually reviewed ESE /2732 and Kaide /2736 videos; executor inspected frames at6s/5s. Borrowed principles only (TV-as-mask, material panel stacking), not assets/branding or presumed GSAP/3D implementation. Source videos stay outside publication.
