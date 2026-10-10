# Portfolio — GitHub Pages

The portfolio is a dependency-free static site in `docs/`. Existing root files are preserved.

## Publish
1. Merge the portfolio pull request into `main`.
2. Open repository Settings → Pages.
3. Select **Deploy from a branch**, branch **main**, folder **/docs**, then Save.
4. Wait for the Pages deployment to finish.
5. Visit https://olesyalevytskaua-ops.github.io/olesya_levytska_ui-ux/

Do not select the repository root: the site lives in docs.

## Content and maintenance
- Home: docs/index.html
- Work: docs/work.html
- CV: docs/cv.html (based on the original CV; use Save CV as PDF and your browser's PDF destination)
- Contact: docs/contact.html
- Styles: docs/style.css and docs/cv.css
- Carousel: docs/script.js. Swipe, scroll, use buttons or keyboard arrows. No automatic rotation.
- Project visuals are CSS illustrations clearly labelled as concepts. No original product screenshots were available.
- Professional details and project dates are reproduced from the existing CV.
- No build command, dependencies, account credentials, or contact form service are required.

## Search indexing
The four pages have index/follow directives, unique descriptions, canonical URLs, Open Graph metadata, and Person structured data. robots.txt permits crawling; sitemap.xml lists the four public pages. After publication, submit the sitemap URL in Google Search Console. Google decides when and whether to index pages; indexing cannot be guaranteed.

## Validation
Source checks verified relative local links and asset paths, all four navigation pages, preserved original files, and exclusion of the requested project name. Local rendering and browser interaction tests were unavailable because the desktop execution environment failed to start. Before publishing, visually review mobile and desktop layouts, CV printing, and carousel controls.
