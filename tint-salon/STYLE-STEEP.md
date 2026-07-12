# Style: STEEP (refero.design) — для салона TINT

Тема: «аналитика как editorial» — serif-заголовки Signifier парят над почти монохромным белым холстом; один тёплый персиковый акцент #fbe1d1. Editorial-сдержанность, крупный курсивный дисплейный serif, много воздуха, мягкие карточки 24px, пилюли-контролы (weightless).

## Цвета
- Ink Black #17191c — текст, заливка кнопок, лого
- Paper White #ffffff — холст, текст на кнопках, карточки
- Mist Gray #f2f2f3 — карточки, вторичный фон, заливка инпутов
- Fog White #fafafb — вторичный фон секций, hover
- Slate Gray #777b86 — ссылки, приглушённый текст, футер
- Ash Gray #979799 — теги/лейблы
- Smoke Gray #a3a6af — placeholder, disabled
- Blush Peach #fbe1d1 — АКЦЕНТНАЯ карточка/wash, МАКС 1 раз на страницу, только на белом фоне
- Sienna Brown #5d2a1a — текст/штрих ТОЛЬКО на персиковой поверхности

## Типографика
- Display serif: **Signifier weight 400 ТОЛЬКО** (не bold/semibold). Кириллица: Signifier нет в Google → взять 'Source Serif 4' (есть кириллица) ИЛИ 'Cormorant'/'Playfair Display'. Размеры 44/64/90px, line-height 1.3, letter-spacing отрицательный (-2.25px@90, -0.96px@64, -0.66px@44), курсив для акцентов.
- Body sans: **Söhne** → замена 'Inter' (кириллица). Веса 400–500 (полушаги 430/450/480 для иерархии). body 17px/1.35, caption 15px, subheading 22px.
- Шкала: caption15, body17, body-lg20, subheading22, heading-sm26(-0.23), heading44(-0.66), heading-lg64(-0.96), display90(-2.25).

## Радиусы / отступы / тени
- Радиусы: кнопки 9999px (пилюли), карточки 24px, elevated 20px, small 16px, инпуты 16px, фото 12px. НЕ ниже 16px на карточках, только 9999 на кнопках.
- Base 4px; scale 4/8/12/16/20/24/28/32/40/64/80/96/128/160. Section gap 80px. Card padding 20px. Max-width 1200px.
- Тени: ТОЛЬКО на «floating artifacts» (белые всплывающие карточки с UI/фрагментами): subtle-3 = rgba(4,23,43,.05) 0 0 0 1px, rgba(0,0,0,.1) 0 20px 25px -5px, rgba(0,0,0,.1) 0 8px 10px -6px. На обычных контент-карточках теней НЕТ.

## Компоненты
- Pill Button Filled: #17191c fill, #fff text, 9999px, без тени.
- Pill Button Ghost: прозрачный, #17191c border+text, 9999px. (Filled + Ghost как пара.)
- Text Link w/ Arrow: инлайн, стрелка в подписи, underline только на hover.
- Nav Link: без фона/границ.
- Neutral Card: #f2f2f3, 24px, без тени — базовый контейнер.
- Accent Peach Card: #fbe1d1 фон, #5d2a1a текст, 24px — редкий editorial-акцент (макс 1/стр, только на белом).
- Floating Artifact: #ffffff, 20px, subtle-тень — «плавающие» карточки (напр. карточка записи, отзыв, прайс-фрагмент).
- Input: #fff, 1px hairline border, 16px, placeholder #a3a6af.
- Stat Card, Avatar (40px круг, монограмма), Tag (ghost-типографика #979799, без бейджа).

## Do / Don't
- Do: Signifier 400 на 44/64/90 для дисплея/заголовков; персик 1 раз/стр; пилюли 9999; filled+ghost пара; полушаги веса Inter; отриц. трекинг на крупном.
- Don't: хроматика кроме персик/сиена; bold в serif; тени на контент-карточках; радиус <16 на карточках; underline ссылок в покое; персик не на белом; сиену вне персика.

## Surfaces
0 Canvas #fff · 1 Card Mist #f2f2f3 · 2 Section Fog #fafafb · 3 Accent Blush #fbe1d1 · 4 Elevated White #fff (с тенью).
