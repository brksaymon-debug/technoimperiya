# Direction locked before implementation — 2026-11-21

User acceptance: a complete New Year television retail environment, not empty black + a cut-out. TV sale storytelling moves INSIDE the TV. Store/catalog remains an obvious, working destination.

Composition: full-bleed burgundy winter showroom, real materials/curtains/window light/pine/gifts and gold plinth. Generated environment is one coherent original image without lettering, people, UI or TV. A real DOM 16:9 slim-bezel television sits on its plinth, with consistent floor shadow and warm reflected light. No original Santa cutout or old mountain banner. Left HTML: “Новый год. Новый экран.” + explicit televisions/shop CTA. Header remains shopping-first. Warm ivory catalog directly below provides a strong change of plane and actual search/filter/sort/products/empty state.

Screen storyboard, 18s total, no audio:
0–6s: winter light / “Новый год / на большом экране” — reveal ribbon line, ornament and large typography, then reading pause.
6–12s: red/gold offer composition / “−30%” with always-visible “ДЕМО · пример оформления акции”; live HTML “Праздничный повод выбрать телевизор”. Not a real promotion, no invented live prices.
12–18s: product selection / “Ваш следующий / большой экран” + state/diagonal/brand cues and real catalog CTA outside screen; pause.
Transitions 0.65s, reading pause ~5s. Manual next/previous scene buttons, pause/continue, pause on keyboard focus, page-hidden/offscreen suspension. Reduced-motion/manual stop produces static readable screen. Motion uses installed framer-motion; routes/product continuity stay React ViewTransition, never animate same DOM surface twice.

Data: empty live catalogue remains honest. Explicit demo switch exposes test products. Discount is a clearly labeled graphic example, not claimed available. Existing buyer flow untouched. Mobile stacks copy→actual 16:9 screen→catalog, native scrolling and >=44px principal controls; environment remains visible, not compressed desktop artwork.

## Approved refinement
Physical-store colors are black/red; restore Ded Moroz naturally within the scene and gifts on the floor. The TV/support geometry must be grounded, not floating. 30–70% is the current graphic demonstration range, not a business offer. Timing and shopping architecture remain unchanged.
