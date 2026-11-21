> Current authoritative closeout: [MASTER-CLOSEOUT.md](MASTER-CLOSEOUT.md). Earlier entries below are historical measurements.

# Lighthouse и axe: реальные измерения

21 ноября 2026, Asia/Shanghai (UTC+8). Lighthouse 13.6.0 и axe-core 4.14.0 установлены разово в /workspace/technoimperiya-audit-tools с --ignore-scripts, вне проекта. Production-зависимости и lockfile не изменены. Chrome 156, подготовленный локальный Pages build /technoimperiya/.

| Последний полный Lighthouse | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Mobile, simulated | 63 | 100 | 100 | 66 | 4.683s | 14.478s | 62ms | 0.05847 |
| Desktop, simulated | 86 | 96* | 100 | 66 | 0.846s | 2.523s | 1ms | 0.0001295 |

*После desktop Lighthouse исправлено последнее отсутствие имени ссылки «Кабинет». Повторён только затронутый axe desktop home/catalog: 0 violations; новый балл Lighthouse после этой одноатрибутной правки не заявляется.

Первый замер: mobile 73/96/96/66, desktop 86/96/96/66. Во время ограниченной проверки устранены реальные serious-ошибки label-content-name-mismatch (ТВ-меню/счётчик, подборки, изображения демо-товаров, пауза), link-name у desktop кабинета, порядок заголовков сравнения, слишком узкие переключатели кадров, 404 favicon. Крупный favicon заменён отдельным 96×96 PNG (9607 байт), верным уменьшением целого оригинального логотипа на прозрачном поле. Оригинал/основной PNG не затронуты. Добавлено раннее обнаружение hero-изображения.

Итоговый axe: 7 мобильных маршрутов (главная, каталог с товарами/корзиной, карточка, сравнение, оформление, privacy, 404) — 0 violations; дополнительно финальные desktop главная и каталог — 0 violations. Остались incomplete/manual-review для контраста на изображениях (4–43 узла в зависимости от маршрута) и один ARIA review на главной. Нельзя выдавать это за полное соответствие WCAG.

**Открытый performance-риск:** мобильный лабораторный LCP остаётся высоким. PNG Деда Мороза ~822KB, адаптивный PNG логотипа ~563KB, исторические JS/CSS и отсутствие сжатия/кэша в локальном измерительном сервере дают тяжёлый сетевой путь. Это не скрыто и не объявлено решённым. Разброс mobile performance 63–73 показывает чувствительность лабораторной модели; не выбирается только лучший балл. SEO 66 не означает готовность индексации: noindex сохраняется намеренно, Pages использует HashRouter. Список остальных SEO замечаний и точные настройки в qc/audit-tools-summary.json.

Не измерялись реальный телефон, полевой INP, 60FPS или работа GitHub CDN. Ничего не отправлялось в PageSpeed/WebPageTest. Полные HTML/JSON Lighthouse, первоначальные и повторные отчёты, axe nodes/manual-review — в evidence/ комплекта /workspace/technoimperiya-master-g_dgt9zo. Проверки 11 frontend / 14 API / 11 managed-browser / 10 preview-browser предыдущего прохода не повторялись; после найденных ошибок пересобраны source/Pages и повторены только инструментальные затронутые проверки.

## Последующая узкая мобильная оптимизация
Последний mobile Lighthouse: 73/100/100/66, FCP1.952с, LCP8.703с, TBT59мс, CLS0.05847. Верхняя таблица сохранена как предыдущий этап. Ограничение замера и восстановление исходного crop описаны в [MOBILE-PERFORMANCE.md](MOBILE-PERFORMANCE.md); точный финальный crop повторно не измерялся.
