> Historical application audit of the earlier product-OS pass. Current active composition and evidence: DESIGN.md, HOLIDAY-STORYBOARD.md and QC.md. The earlier Home inspector/favorite-button scenario is not the current homepage.

# Official Vercel skills: applied audit

Scope: React/ReactDOM 19.3.1, React Router SPA, Vite; no Next.js, RSC, SSR or backend. Actual exports/types for ViewTransition/addTransitionType checked before coding. Imported original sources are staged, not installed in the user's skill library. Exact URLs and SHA-256 are in /workspace/vercel-skills-import/{sources.json,INVENTORY.json}.

## Navigation map / decisions
- Home model A ↔ B: ordered identity transition, stable selection-screen/selection-copy names + keyed ViewTransition + startTransition/addTransitionType.
- Home inspect open/close: anonymous panel enter/exit; React.lazy + Suspense content reveal. Heading outside fallback.
- Catalog → product: one globally unique catalog-tv-{id} name per Catalog ProductCard only. Favorites/related cards have no matching name.
- Search/filter/sort: URL state, immediate useful results, no forced crossfade/reordering spectacle.
- Header/footer, shopping controls, cart totals and checkout validation: live UI, not animated navigation surfaces. Root snapshot suppressed and transition overlay pointer-events:none.
- Browser without native API: React fallback verified; no hand-written document.startViewTransition/flushSync.

## Material rule application
- src/Home.tsx: conditional module loading — FocusDetails via React.lazy, only mounted on explicit inspection. Build produces independent ~0.98 kB JS chunk; browser verifies absent until opened.
- src/Home.tsx: derived-state-no-effect — selected object/index and inspector state derive from current catalog+URL, not mirrored in effect/state. Unknown/missing model safely falls back to available object.
- src/Home.tsx: move-effect-to-event — model preference is saved in selection handler, not a synchronization effect. Functional URL updater preserves other query state; existing functional cart/favorite updates retained in src/shop.tsx.
- src/Home.tsx: localstorage-schema — new key ti-selection:v1 stores only {v:1,id}; reads/writes guarded. Legacy ti-cart/ti-favorites keys deliberately not silently migrated this pass; remain a follow-up schema cleanup, not claimed compliant.
- src/RemoteNavigation.ts: existing single global key listener with cleanup retained; model-rail keyboard handling is local, with defaultPrevented honored globally. SWR was not installed solely to dedupe one listener.
- src/Home.tsx: rendering-conditional-render — explicit ternaries for optional products/inspector; no numeric && leakage in new UI.
- src/App.tsx: labeled search with name, autocomplete off and ellipsis placeholder; meaningful desktop/mobile menu and native navigation links.
- src/Home.tsx, src/TheaterScreen.tsx: image dimensions, descriptive alt/decorative alt; no original screenshot as background. Selected-model illustration is explicitly not a product photograph.
- src/product-os.css: focus-visible treatment, contained tablet bleed, tabular prices, safe-area footer, color-scheme, only opacity/transform transition animations, reduced-motion duration/delay zero; no transition:all in added stylesheet.
- index.html: theme-color added.

## Verification / limitations (not blanket certification)
Build + unit tests and 17 automated local Chromium checks, 4 widths; report in qc/product-os-report.json. Tests inspect state, API invocation and reduced-motion computed styles; no claim of human video review or Safari/Firefox testing. Native API may still be invoked by React Router with reduced-motion, but duration is zero. Responsive overflow defect at 768px was fixed by containing intentional artwork bleed.

Not applicable: Next server/RSC cache, server waterfalls, streaming/SSR/hydration, Next prefetch conventions. Not implemented: every possible route/Suspense recipe; only purposeful product continuity. Existing compressed source formatting/legacy CSS and legacy storage keys remain technical debt. Checkout has no dispatch, payment or real business data; no production readiness claim. Error-boundary/network-failure coverage and cross-browser audit remain future work.
