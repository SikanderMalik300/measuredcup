# MeasuredCup.com photos

Date: 2026-10-14. Chosen and checked by the browser agent. The coding agent downloads each file from its "Download" URL, processes it per `measuredcup-design.md` section 7, and records it in `lib/data/photos.ts`.

Checks passed for every photo below (browser agent): real photograph, page title confirms "Free Photo on Unsplash" (Unsplash License, not Unsplash+), no watermark, no brand logo or readable product label, no face as the subject, bright natural light, subject clear at 1:1 crop.
Coding agent checks: original long side at least 1600px (if smaller, stop and report the slot; do not upscale); crop at the focal point given.

Credit format: hero caption "Photo: Name / Unsplash"; homepage "Photo credits" lists every homepage photo with links to the photo page and the photographer profile.

| id | Slot / used on | Subject | Photo page | Download | Photographer | Profile | Alt text | Focal X/Y |
|---|---|---|---|---|---|---|---|---|
| hero-flour-cup | Home hero | Hands holding a measuring cup of flour over a checked cloth, eggs nearby | https://unsplash.com/photos/O-WdR304HnM | https://unsplash.com/photos/O-WdR304HnM/download?force=true | Ben McLeod | https://unsplash.com/@ben_mcleod | Hands holding a metal measuring cup filled with flour above a mixing bowl | 50% / 45% |
| scale-flour | /grams-to-cups/ tile and in-page photo | Flour in a container on a digital kitchen scale reading 125.0 | https://unsplash.com/photos/u3gMcNvqrnI | https://unsplash.com/photos/u3gMcNvqrnI/download?force=true | Arwen | https://unsplash.com/@arwen42 | Container of white flour on a black digital kitchen scale showing 125.0 | 50% / 55% |
| four-cups | /cups-to-grams/ tile and in-page photo | Four measuring cups in a row filled with coffee beans and ground spices | https://unsplash.com/photos/mLlM83CsG3I | https://unsplash.com/photos/mLlM83CsG3I/download?force=true | Mae Mu | https://unsplash.com/@picoftasty | Four measuring cups with wooden handles in a row on a white table | 50% / 45% |
| nested-spoons | /tablespoons-to-grams/ tile and in-page photo | Stacked stainless steel measuring spoons | https://unsplash.com/photos/yvRG4QXsIIY | https://unsplash.com/photos/yvRG4QXsIIY/download?force=true | 裴锦书 (pei_jinshu) | https://unsplash.com/@pei_jinshu | Set of stainless steel measuring spoons nested together on a white surface | 45% / 50% |
| butter-flour-eggs | /butter-converter/ tile and in-page photo | Bowl of cubed butter, flour in a measuring cup, brown eggs, rolling pin on a striped towel | https://unsplash.com/photos/Zqh5l1JWs5M | https://unsplash.com/photos/Zqh5l1JWs5M/download?force=true | Lauren Gray | https://unsplash.com/@laurenagray | Bowl of cubed butter beside brown eggs and a measuring cup of flour on a striped kitchen towel | 70% / 75% |
| copper-cups-paper | /half-a-measurement/ tile and in-page photo | Copper measuring cups and spoons on blank paper | https://unsplash.com/photos/AemWnTSPxoE | https://unsplash.com/photos/AemWnTSPxoE/download?force=true | Kara Eads | https://unsplash.com/@karaeads | Copper measuring cups and measuring spoons laid on a sheet of white paper | 35% / 40% |
| cookbooks-counter | /recipe-scaler/ tile and in-page photo | Open cookbooks on a bright kitchen counter | https://unsplash.com/photos/yjYxtxLOiF4 | https://unsplash.com/photos/yjYxtxLOiF4/download?force=true | Annie Spratt | https://unsplash.com/@anniespratt | Two open cookbooks resting on a wooden kitchen counter | 55% / 60% |
| scale-brown-sugar | /data/ingredient-weights/ tile and in-page photo | Brown sugar in a bowl on a digital scale | https://unsplash.com/photos/zfom3V5vnhg | https://unsplash.com/photos/zfom3V5vnhg/download?force=true | Arwen | https://unsplash.com/@arwen42 | Bowl of brown sugar on a digital kitchen scale | 50% / 40% |

Hub tiles reuse the photo of their first tool (allowed: same page, same photo):
- /converters/ uses scale-flour
- /recipe-tools/ uses copper-cups-paper
- /data/ uses scale-brown-sugar

Rejected while searching (do not use): any photo showing brand packaging (for example a Kerrygold butter wrapper, an "Eddingtons Mini Measure" glass, a printed flour bag); "Sliced cheese on clear glass plate" (094mP_CBdpM), because it is labeled cheese though it looks like butter.

Note for the owner: Unsplash photo pages say a download "triggers" the photographer's download count; downloading with the links above is the expected way to use them.
