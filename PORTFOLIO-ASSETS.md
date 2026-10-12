# Portfolio sources and maintenance

## Pages
The portfolio has Home, Work, a native HTML CV, Contact, and nine standalone case-study pages in docs/. Each case page has a readable text overview and the original Figma visual story. Case images use a picture element to select the mobile export at 600px or below.

Case studies: Harmoni, VesselHaven, Vaults1, Remedy Design System 2.0, She Matters, Caraway Health, Between Health, Breakthrough Therapy, and ThePause.

## Image mapping
- docs/images/cases/between-desktop.png — 1200 × 6372 px; source: Between.png
- docs/images/cases/between-mobile.png — 375 × 5984 px; source: Between-1.png
- docs/images/cases/breakthrough-desktop.png — 1200 × 5036 px; source: Breakthrough therapy.png
- docs/images/cases/breakthrough-mobile.png — 375 × 6292 px; source: Breakthrough therapy-1.png
- docs/images/cases/caraway-desktop.png — 1200 × 5191 px; source: Caraway Desctop.png
- docs/images/cases/caraway-mobile.png — 375 × 5497 px; source: Caraway Mobile.png
- docs/images/cases/design-system-desktop.png — 1200 × 12806 px; source: Design system.png
- docs/images/cases/design-system-mobile.png — 375 × 7237 px; source: Design system-1.png
- docs/images/cases/harmoni-desktop.png — 1200 × 9068 px; source: Harmoni.png
- docs/images/cases/harmoni-mobile.png — 375 × 18535 px; source: Harmoni mobile.png
- docs/images/cases/she-matters-desktop.png — 1200 × 8240 px; source: She matters.png
- docs/images/cases/she-matters-mobile.png — 375 × 8615 px; source: She matters-1.png
- docs/images/cases/the-pause-desktop.png — 1200 × 8477 px; source: The pause-1.png
- docs/images/cases/the-pause-mobile.png — 375 × 6734 px; source: The pause.png
- docs/images/cases/vaults-desktop.png — 1200 × 5067 px; source: Vaults Desctop.png
- docs/images/cases/vaults-mobile.png — 375 × 7535 px; source: Vaults Mobile.png
- docs/images/cases/vesselhaven-desktop.png — 1200 × 8035 px; source: VesselHaven.png
- docs/images/cases/vesselhaven-mobile.png — 375 × 13590 px; source: VesselHaven mobile.png

Additional originals: docs/images/olesya-banner.png, docs/images/olesya-portrait.png, docs/images/ux-button-contrast-09.png.

The desktop and mobile contact exports and CV exports serve as layout references. Contact and CV are implemented as native HTML with functional links and selectable text. No screenshot-only contact form is used; the email button opens the visitor's mail application.

## Content
Profile text and the six highlighted tools come from the owner's supplied LinkedIn About section. The CV preserves the broader skills, tools, and career history in the original repository CV. Case summaries are grounded in the owner's Figma exports and original CV. The original root CV and README are retained.

The #9 UX card links to the owner's profile until its direct post URL is supplied. #4 and #8 use their public post links. Automatic LinkedIn syncing is not configured.

## Publishing
Merge PR #2 into main. Keep GitHub Pages source set to main and /docs. Static relative links work under the repository URL. The sitemap lists all 13 pages.

## Validation and limits
Checks cover asset references, internal links and anchors, one main landmark per page, HTML tag balance, JSON-LD syntax, script syntax, mobile image selection, and the excluded project name.

Case PNG originals total approximately 42 MB; only the appropriate desktop/mobile source is selected on each case page. Secondary images and galleries use lazy loading. The images have not yet been converted to smaller WebP files or generated as separate thumbnails. This remains a performance improvement for a working image-processing environment.

Local command and browser runtimes continue to fail during sandbox initialization. Visual browser QA, print preview, and image optimization could not be performed. No successful browser test is claimed.

## VesselHaven actual development screenshots — 11 October 2026
Owner-supplied mobile screenshots replace the white calendar and event-editor illustrations, which were not part of the app. Original screenshots are retained unchanged, including mobile browser chrome. All five images are 709 × 1536 px.

- docs/images/cases/vesselhaven-onboarding-role.jpg — source: IMG_0889.jpeg
- docs/images/cases/vesselhaven-onboarding-complete.jpg — source: IMG_0890.jpeg
- docs/images/cases/vesselhaven-plan-calendar.jpg — source: IMG_0894.jpeg
- docs/images/cases/vesselhaven-plan-calendar-weekend.jpg — source: IMG_0895.jpeg
- docs/images/cases/vesselhaven-event-details.jpg — source: IMG_0896.jpeg

The case now shows two owner onboarding screens, two weekly calendar views, and one event-detail screen. It does not present these screenshots as an event-creation wizard or as proof of measured conversion improvement.

## Photographer Portfolio side project — 12 October 2026
Secondary case (card 10 on Work, after ThePause in the next-project chain). Source: Figma file "Portfolio-Photographer" and the owner's prototype screen recording.

- docs/case-photographer.html — case page; links to the live Figma prototype
- docs/images/cases/photographer-walkthrough.mp4 — 1440 px H.264, no audio, ~2.4 MB; source: Screen Recording 2026-10-12 at 14.25.38.mov (49 s)
- docs/images/cases/photographer-walkthrough-poster.webp, photographer-cover.webp — frame from the recording
- docs/images/cases/photographer-{home,portrait,family,events,about}.webp — owner-supplied page exports, 1200 px wide
- docs/images/cases/photographer-components.webp — cropped component sheet
- docs/images/cases/photographer-contact.webp — exported, not currently used on the page

## Midlife quiz case study — 12 October 2026

Three character WebP files (Cat Queen, Gym Rat, Mountain Addict) copied unchanged from the user's published quiz repository into docs/images/quiz. These are original project illustrations, not interface screenshots. The case records illustration studies, emotional-pattern scoring, AI-assisted delivery, and a marketing hypothesis; it makes no audience-impact or psychological-validation claims.
