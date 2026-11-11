# Product page performance

Pilot: `/in/products/santal-pepper`. The changes live in shared product components,
so other product pages receive them automatically.

## Baseline

SpeedVitals report supplied by the user, tested 10 November 2026, mobile, India:

| Metric | Before | After |
| --- | --- | --- |
| Performance | 43/100 | Pending deployed measurement |
| LCP | 16.4 s | Pending deployed measurement |
| FCP | 8.6 s | Pending deployed measurement |
| TBT | 543 ms | Pending deployed measurement |
| CLS | 0 | Pending deployed measurement |
| Transfer size | 3.3 MB | Pending deployed measurement |
| Images | 2 MB | Pending deployed measurement |

The PDF is a summary, without an LCP element, request waterfall, or detailed
Lighthouse diagnostics. Treat the code findings as hypotheses until retested.

## Implemented

- ProductHero uses Next Image with responsive widths and priority for the initial
  gallery image. Existing image selection, crop, and frame sizes are preserved.
- Initial product information and gallery are visible in server HTML instead of
  waiting for entrance animations during hydration.
- PeopleAlsoBought and FeaturedRitualTwo use responsive, default lazy-loaded Next
  images. Relative image containers preserve the existing layout.
- Contentful image CDN is allowed by the Next image optimizer.
- Removed four external Google font imports; DIN fonts already have local font
  declarations. All local font faces use font-display: swap.
- Clarity loads with lazyOnload. Google Analytics and Meta event timing remain as
  before to preserve attribution.

Loading order:

```text
Server HTML -> visible product + priority responsive gallery
            -> hydration and shopping controls
            -> nearby lower-page images as the visitor scrolls
Window load -> idle Clarity initialization
```

## Validation and rollout

Local verification on 11 November 2026:

- Santal Pepper route returned HTTP 200 with responsive gallery markup.
- The original gallery WebP was 359,658 bytes; the 640px optimized WebP was
  20,890 bytes (94.2% smaller), both HTTP 200. This comparison is for that single
  candidate; actual transfer size depends on viewport and device pixel ratio.
- TypeScript diagnostic comparison against the original versions of the changed
  components: 97 errors before and after, zero new diagnostics.
- Production compilation succeeded. The full build failed during static product
  generation after upstream connection timeouts and repeated generation attempts.
- git diff --check passed. Mobile (390px) and desktop (1440px) gallery checks passed locally; deployed
  Lighthouse checks remain pending.

1. Use a preview production deployment with the same backend and CMS as production.
2. Verify at 390px mobile width and desktop: initial gallery image, next/previous
   controls, crop, price, variant selection, accordions, cart, and recommendations.
3. In Network, verify the gallery uses /_next/image, returns 200 with an image
   content type, and selects an appropriate srcset candidate. Check every CMS
   image hostname is allowed; add only known hosts if content sources change.
4. Repeat the mobile India SpeedVitals test three times with identical settings;
   compare medians and retain the reports. Measure cold and warm image caches.
5. Target LCP <= 2.5 s, TBT <= 200 ms, CLS <= 0.1. These are targets, not measured
   results of this patch.
6. Check other product types before applying the pattern to listing and home
   pages: prioritize only above-the-fold images, set sizes from the actual layout,
   lazy-load lower content, and keep initial content visible before hydration.

## Further investigation

- Capture a full Lighthouse JSON report or trace to attribute remaining blocking
  JavaScript and LCP delay.
- The product route contains sequential CMS queries and fallback chains. Parallel
  independent sections while preserving each fallback order in a separate change.
- Review shared navigation/cart bundles and lower-page code splitting with a
  bundle analyzer before altering hydration boundaries.
- Clarity lazyOnload can miss very short visits before window load; verify this
  tradeoff with the analytics owner.
