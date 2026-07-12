# Style: PERK (refero.design) — для барбершопа Al Capone

Тема: «электрический лайм на тёплом пергаменте». Лайм #beff50 заряжает ахроматику (ink #14140f, парчмент #f5f5eb). Активный, не декоративный. Один шрифт (OTSono→Inter) 90px..10px, вес 500 акцент / 400 body. Мягкие радиусы (28px карточки/кнопки, 9999px пилюли/теги). Слои — тональным контрастом, БЕЗ теней (плоско, editorial, быстро).

## Цвета
- Electric Lime #beff50 — ЕДИНСТВЕННЫЙ chromatic: заливка кнопок, hero-панели, акцент-блоки
- Off-Black Ink #14140f — весь текст/заголовки/иконки (НЕ #000, кроме инпутов)
- Off-White Canvas #f5f5eb — карточки, вторичный фон (пергамент вместо белого)
- Pure White #ffffff — высший уровень: карточки-формы, инпуты
- Ash #d2d2c8 — границы/делители/линии
- Graphite #6e6e64 — приглушённый текст
- Deep Charcoal #30302a — тёмные «острова» (отзывы/статы, редко)
- Stone #919183 / Smoke #b9b9b7 — тонкие штрихи/washes

## Типографика
- Один шрифт OTSono → замена 'Inter' (кириллица). Веса ТОЛЬКО 400 (body) и 500 (заголовки/лейблы/CTA). НЕ 600/700.
- Display 90 (lh .89), heading-lg 60 (lh 1), heading 28 — всё с letter-spacing -0.03em (28px+). body 16/1.5 default tracking. eyebrow/caption 10-12px UPPERCASE tracking .1em.
- На дисплее (60px+) НЕ system-fallback — Inter 500 с -0.03em.

## Радиусы/отступы/тени
- Радиусы: карточки/кнопки 28px, пилюли/теги 9999px, инпуты 8px, inner 18px. НЕ смешивать в одном типе.
- Base 4px; section gap 80–120px; card padding 32–48px; element gap 16–24px; max-width 1200px.
- ТЕНЕЙ НЕТ ВООБЩЕ. Слои: white → parchment #f5f5eb → lime #beff50 → dark island #30302a. Разделение — тон, не elevation. Без градиентов.

## Компоненты
- Primary Button (Lime Pill): bg #beff50, text #14140f, radius 28px, вес 500 16px. ЕДИНСТВЕННАЯ заливная кнопка. Давать воздух вокруг (контраст громкий).
- Ghost Text Button: прозрачный, text #14140f/#6e6e64, без границы.
- Underline Link: bottom-border 1px #14140f, underline = аффорданс.
- Parallax Card: #f5f5eb, 28px, padding 32-48, без тени.
- White Surface Card / форма: #ffffff, 28px.
- Dark Island: #30302a, 28px, белый текст — редкий тёмный момент (отзывы/статы).
- Lime Accent Block: full-bleed #beff50 под дисплей-типографику.
- Tag/eyebrow: uppercase 12px 500 tracking .1em, pill 9999px или инлайн.
- Input: #fff, border 1px #d2d2c8, radius 8px, вес 400 16px.
- Иконки — типографические глифы 16-24px #14140f (не иллюстрации).
- Footer тёмный #14140f, белый текст.

## Do / Don't
- Do: лайм — единственная заливная кнопка; 28px карточки/кнопки, 9999 пилюли; вес 500 заголовки/400 body; -0.03em на 28px+; стек white→parchment→lime без теней; eyebrow uppercase .1em; текст #14140f не #000.
- Don't: тени на карточках; #000 для текста; второй акцент-цвет (только лайм); смешивать радиусы в одном компоненте; system-fallback на дисплее; 600/700; градиенты.

## Surfaces
0 Canvas #fff · 1 Parchment #f5f5eb · 2 Lime #beff50 · 3 Dark island #30302a.

## Imagery
Фото — editorial-вставки, full-bleed или в 28px-карточках на пергаменте/белом. Для барбершопа: мужские стрижки, борода, интерьер, инструменты — контентно, не «атмосферный сток». Лайм — только UI/действия, не на фото.
