# Close Loop Change Log

## 2026-03-24
- Restored the original pre-redesign site layout.
- Kept the warm paper-style main background instead of flat white.
- Removed the added top gradient treatment after screenshot review showed it was not desired for the current stage.
- Verified the result through refreshed desktop and mobile screenshots.

## Commit note
- Finalized the current stage by keeping the restored original layout.
- Preserved only the warm paper main background as the approved visual change.
- Screenshots were used to confirm that the added top gradient should not remain.

## 2026-03-24 · Research topic links
- Updated the homepage research line to use the shared scope: large language model architectures and post-training.
- Linked both topics to /projects/ using the existing hover style.
- Added monospace styling to those topic links so they match the other interactive labels.
- Validated the wording and styling through refreshed desktop and mobile screenshots.

## 2026-03-31 · Link hover activation
- Fixed the link highlight bug where the colored hover box did not reliably appear until after a click on the deployed site.
- Added explicit pointer and focus-driven interactive states for shared link styles so the color inversion appears as soon as the cursor enters the link.
- Preserved the existing visual language for default, active, and brand-colored link treatments.
- Validated the fix through refreshed screenshots and a browser interaction check.

## 2026-03-31 · Moving link highlighter
- Replaced per-link hover fills with one shared animated highlight block that moves between links, resizes to the target label, and transitions color for black and Northwestern purple states.
- Removed the resting highlight fallback so no link shows a block when the cursor is not hovering or focusing a link.
- Corrected the text inversion logic so only the currently highlighted link turns white while the others remain in their default color.
- Validated the interaction through refreshed screenshots plus hover-state captures for rest, active hover, and cleared states.

## 2026-03-31 · Topic link emphasis
- Increased the emphasis of the homepage research topic links by making `architectures` and `post-training` bold within the existing monospace topic treatment.
- Kept the change scoped to the shared topic-link style so the wording and hover behavior remain unchanged.
- Validated the stronger emphasis through refreshed desktop and mobile screenshots.

## 2026-03-31 · Cache-busted assets and canonical URL cleanup
- Added versioned query strings to the shared CSS and JS asset URLs so deployed browsers fetch fresh files after visual changes instead of reusing stale cached assets.
- Updated the site metadata and feed references from `https://dune-z.github.io/` to `https://yifei-zuo.github.io/`.
- Kept the rendered layout unchanged while validating the site again through refreshed screenshots.

## 2026-06-09 · Remove Projects from menu
- Removed the `Projects` item from the shared header navigation while preserving existing `/projects/` page links in body content.
- Bumped the shared CSS and JS asset query strings so the deployed site fetches the updated menu script.
- Validated the header through refreshed desktop and mobile screenshots plus a DOM check showing `About`, `Scholar`, and `GitHub`.

## 2026-06-09 · Add X profile to menu
- Added an external `𝕏` menu item linking to `https://x.com/YifeiZuoX`.
- Added accessible labeling for the symbol-only link through `aria-label` and `title`.
- Bumped the shared CSS and JS asset query strings so the deployed site fetches the updated menu script.
- Validated the header through refreshed desktop and mobile screenshots plus a DOM check for the X link target.
