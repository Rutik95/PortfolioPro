# Rutik Tarekar: portfolio

A frontend engineer's portfolio presented as one night flight. Scrolling flies
the aircraft: departure, takeoff, cruise, the career laid out as a route over
the clouds, three projects seen through gaps in the deck, the approach
checklist, and a landing into a city of lights that ends at the contact details.

Built with Vue 3, Vite, vite-ssg (every route is prerendered to static HTML),
Three.js for the world and the ScrollCraft worldflight engine for the scroll
track and copy windows.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/, deployed by Vercel
```

## Where things live

| Path | What |
|---|---|
| `src/config/site.ts` | Name, URLs, email, CV path. Change the name here and every page follows. |
| `src/data/profile.ts` | Every fact on the site, taken from the CV. Roles, career fixes, projects, the checklist, skills. |
| `src/views/HomeView.vue` | The flight page: worldflight markup, copy at each waypoint, the bridge between scroll and renderer. |
| `src/components/FlightRail.vue` | The flight-profile rail at the bottom. It is the home page's navigation. |
| `src/flight/path.ts` | The timeline: legs, aircraft position and attitude, and camera keys for desktop and phone. |
| `src/flight/world.ts` | Renderer, post-processing, lights, the per-frame update. |
| `src/flight/aircraft.ts`, `ground.ts`, `clouds.ts`, `sky.ts`, `route.ts` | The aircraft, cities and airports, the volumetric cloud deck, sky, contrail and route. |
| `src/vendor/scrollcraft/` | ScrollCraft engine, vendored unmodified. |
| `public/flight/posters/` | One frame per leg, rendered from the live scene. Shown under reduced motion or when WebGL is unavailable. |
| `scrollcraft/builds/flight-journey/BRIEF.md` | The creative brief: journey, feeling curve, peak, grammar. |

## Regenerating assets

Posters and the social card are rendered from the real scene, so re-run them
after changing the world (dev server running):

```bash
npm run flight:posters
npm run og
```

## Swapping in real footage later

Each leg in `HomeView.vue` is a `data-sc-segment` holding a poster. Add a
`<video data-sc-src="..." data-sc-src-mobile="...">` inside a leg and the
ScrollCraft engine will scrub it with the scroll. Encode scrub clips with a
dense GOP (keyframe every 4 to 8 frames) and no audio track.

## Accessibility and fallbacks

- `prefers-reduced-motion`: no WebGL; the leg posters cross-dissolve at the same scroll positions and every line of copy still appears.
- No WebGL: same poster path.
- No JavaScript: the home page lays its copy out as a plain document.
- Experience, Projects and Contact are ordinary documents and carry the full content.
