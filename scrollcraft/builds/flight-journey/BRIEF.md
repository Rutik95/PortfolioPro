# BRIEF: flight-journey

**Self-authored under explicit creative delegation.** Rutik's brief told me to
"make strong creative decisions and proceed", so I did not run the interview.
The parts in quotation marks are Rutik's own words from the brief. Everything
else is a decision I made, and it says so.

Evidence used: the source on `origin/master` (same as `redesign`, which is what
is live at portfolio-pro-gules-sigma.vercel.app), the CV in the repo root
(`Rutik_Tarerkar_CV (4).pdf`), and the brief.

---

## The eight topics

1. **Vibe.** Rutik: "premium aviation, cinematic, sophisticated, futuristic but
   professional, dark OLED-friendly, realistic rather than cartoonish, smooth and
   restrained." My references: a night departure seen from the jet bridge window;
   the ALSF approach lighting "rabbit" racing toward a runway; Jeppesen approach
   plates; the restraint of a flight deck after dark, where the only colour is
   the instruments.
2. **Journey, in Rutik's words.** Departure, Takeoff, Cruising altitude, Flight
   path / career, Airport / destinations, Flight control / engineering, Landing,
   Final destination. I kept the order and changed two things. The career
   becomes the route itself, drawn on the cloud deck. Engineering moves to just
   before landing, as the **approach checklist**, because that is where crews
   actually run a checklist, and it gives the peak the quiet act it needs in
   front of it.
3. **Energy curve.** Low at the gate, rising through the takeoff roll, flat and
   calm at cruise, curious over the destinations, deliberately still through the
   checklist, highest at the landing, then quiet on arrival.
4. **Feeling, and the one moment.** Rutik: "The landing should be one of the
   strongest visual moments." The peak is the landing.
5. **What no other site does.** You fly the aircraft with your scroll wheel. Your
   career is drawn as the route over the clouds: the flown part is the contrail
   behind the aircraft and the part ahead is a dashed line. Each year is a fix
   the aircraft passes over.
6. **How far from premium-minimal.** Rutik asked for premium, restrained and
   OLED-dark, so the page stays premium-minimal. The world carries the drama,
   and the interface stays quiet.
7. **One unbroken world, or distinct scenes?** One unbroken world. The brief is
   literally a flight. Cloud layers hide the scene changes the way real cloud
   does.
8. **Assets on hand.** No footage, no photos, and no budget for generation ("I
   do NOT currently want to spend money on KIE AI"). **Decision:** the world is
   rendered live in WebGL (Three.js). The aircraft, runway lighting, city, cloud
   deck and destinations are all built in code. That makes the night setting a
   strength: real aircraft at night show up as lights and rim-lit silhouettes,
   which a code-built model can do convincingly. Each leg carries a poster
   rendered from the real scene, used for reduced motion and when WebGL is
   unavailable. A leg can take a `<video>` later without changing the page
   structure.

## Content truth (source of record: the CV)

- Name: the hero uses **Rutik Tarekar**, the spelling Rutik typed in the brief
  and the one in the git user, email and LinkedIn handle. The CV and the old site
  spell it "Tarerkar". This needs Rutik to confirm. It is a one-line change in
  `src/config/site.ts`.
- Experience: Software Developer (T3), Thomas Cook (client), payroll Risosu
  Consulting LLP, Mumbai, 10/2025 to now. Web Developer, Swegon BlueBox Pvt. Ltd,
  Navi Mumbai, 09/2022 to 10/2025.
- The old About page had **wrong dates** (Thomas Cook "Oct 2023") and a
  **made-up third role** (Swegon 2021 to 2022). Both are corrected to the CV.
- Projects in the CV: Flights work, Live Cricket Scoreboard, Helmet and Number
  Plate Detection. The old Projects page also listed an e-commerce platform, a
  Nuxt blog and a task manager, which are not in the CV, and every project link
  was `#`. Those three are **left out** until Rutik confirms them.
- No statistics anywhere. The only numbers are dates, a CGPA quoted from the CV,
  and the aircraft's altitude readout, which shows the scene's own state.

## The feeling curve

| Leg | Feeling | What causes it |
|---|---|---|
| Departure | Anticipation | A dark runway at night. Edge lights run to a vanishing point, the beacon pulses, the aircraft holds on the centreline. Name and role. |
| Takeoff | Momentum | Edge lights stream faster under the reader's hand. The nose rotates and the city drops away below. |
| Cruise | Calm | The aircraft climbs through cloud into moonlight over a cloud sea under stars. Who he is, said plainly. |
| Flight path | Recognition | The route is drawn on the cloud deck, contrail behind and dashes ahead. Each fix is a year, and the aircraft flies over them to "now". |
| Destinations ×3 | Curiosity | Gaps open in the cloud deck. Below each gap is a different lit place: an airport, a floodlit cricket ground, a highway of headlights with detection boxes. |
| Approach checklist | Composure | Close on the wing and its green navigation light, descending slowly. Checklist lines check off one at a time. This is the quietest leg. |
| Landing (peak) | Awe | Down into grey cloud, then out underneath: the whole city lit below, approach lights racing toward the runway, the PAPI lights, flare, touchdown. |
| Arrival | Resolve | Rolled out and stopped. Quiet. One invitation and the ways to reach him. |

**The peak.** "The plane dropped out of the clouds and the whole city was lit up
underneath, and the runway lights were racing toward me." It lives in the
Landing leg, which has the largest weight on the track (2.6vh).

**Authored silence.** About 0.3vh of plain cloud grey in the Landing leg, between
leaving the checklist and breaking out below the cloud. It is intentional and
should not be reported as dead scroll.

**Tell-someone sentence.** "It's the site where you take off from a night runway,
fly his career as a route over the clouds, and land in a city of lights to find
his email."

## Grammar: Continuous world (uniqueness.md §2.4)

Why the other seven lost:
- **Filmic one-shot**: it cuts between acts, and the brief is one flight with no
  cuts.
- **Chaptered editorial**: page-turns would make the flight decoration.
- **Live surface**: there is no product to operate.
- **Typographic poster**: it drops the aviation world, which is the whole idea.
- **Gallery/catalog**: three projects is not a collection, and the story is a
  sequence rather than a set of options.
- **Split stage**: there is no two-sided argument.
- **Rhythmic cutlist**: the energy is wrong for "smooth and restrained".

Consequences: worldflight mode, one fixed stage, one spacer, and copy only in the
fixed copy layer. The nav is a **map**: a vertical flight-profile rail along the
bottom that you can click to jump to any waypoint.

## Signature move

**The contrail ledger.** The career is laid on the cloud deck as a flight route.
The part already flown is the aircraft's real contrail, and the part ahead is a
dashed planned track. Fixes are years. Labels are real HTML anchored to points
in 3D, and they reveal as the aircraft passes overhead.
Secondary, pointer only: the aircraft banks slightly toward the cursor.

## Score (legs, weights in vh)

| Leg | w | Device |
|---|---|---|
| Departure | 1.0 | worldflight leg, hero window, linger 0.3 |
| Takeoff | 1.6 | leg, copy window |
| Cruise | 1.2 | leg, copy window |
| Flight path | 1.8 | leg, contrail ledger (signature) |
| Flights | 0.7 | leg, destination label |
| Scoreboard | 0.7 | leg, destination label |
| Detection | 0.7 | leg, destination label |
| Checklist | 1.0 | leg, scroll-checked list |
| Landing | 2.6 | leg, peak, almost no copy |
| Arrival | 1.1 | leg, finale window |

Total 12.4 + 1 = 13.4vh across 10 legs.

## Fingerprint gate

The registry is empty, so this first build has nothing to clear.

---

## Feel check (after build, scrolled cold, then diffed)

| Leg | Intended | Felt | Change made |
|---|---|---|---|
| Departure | Anticipation | Anticipation, but hazy and brown at first | Darkened the overcast, added low-altitude haze extinction, tilted the camera so the horizon clears the name |
| Takeoff | Momentum | Momentum | none |
| Cruise | Calm | Calm, but the deck read as rippled metal | Replaced cloud slices with a raymarched volume, lit for moonlight |
| Flight path | Recognition | Confusion: the aircraft didn't sit on its own route, and labels piled up | Route moved to flight level; only the next fix and the one just passed speak |
| Destinations | Curiosity | Curiosity once the lights carried; at first the gaps were black | Fixed sub-pixel light falloff and ground depth precision |
| Checklist | Composure | Composure | Re-blocked as a window seat over the wing |
| Landing | Awe (peak) | Awe: the largest visual change and the longest leg | Pulled the flare shot back |
| Arrival | Resolve | Resolve, but the aircraft sat behind the headline | Re-aimed so the aircraft holds the right half; copy over dark ground |

## Verification (production build, `dist/`)

- ScrollCraft harness: all 10 legs reach full opacity; every copy line at 4.5:1 or better, desktop 1440x900 and phone 390x844; zero console errors, zero failed requests.
- Reduced motion: posters only, every copy window still opens.
- Dead-scroll flags in the landing leg are a harness limit: worldflight mode reads only video legs and copy opacity, while the published `data-sc-verify-state` (track position, altitude, in-cloud) changes at every sample.
- `worldflight-assert`: spacer, fixed stage and fixed copy layer pass. "Nothing in flow" flags `#app` and `<main>`, which are ancestors of the spacer that any Vue app has. The lerp test assumes video legs and does not apply.
- Not verified: a real phone (iOS Safari GPU and memory), or low-end Android frame rate.
