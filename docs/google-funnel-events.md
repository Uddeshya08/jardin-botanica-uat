# GA4 event tracking

GA4 uses the existing Google tag and measurement ID from src/lib/util/google-purchase.ts.
These browser events run independently of Meta Pixel and CAPI. No GA API secret or backend
database migration is needed for this GA4 addition.

## Event map

| Customer action | GA4 event | Meta equivalent |
| --- | --- | --- |
| View a product | view_item | ViewContent |
| Successfully add quantity to cart | add_to_cart | AddToCart |
| Enter checkout with a non-empty cart | begin_checkout | InitiateCheckout |
| Successfully continue after payment setup | add_payment_info | AddPaymentInfo |
| Commit a search or select a search-menu result | search | Search |
| Successful newsletter/early-access subscription | generate_lead | Lead |
| Create a new email/Google account | sign_up | CompleteRegistration |
| Confirm a qualifying order | purchase (existing implementation) | Purchase |

```text
view_item -> add_to_cart -> begin_checkout -> add_payment_info -> purchase
```

- Existing Google tag page-view behavior is unchanged; no second manual page_view sender is added.
- Cart quantity decreases, unchanged replacements, failed mutations, failed subscriptions and existing-account logins do not emit their corresponding success event.
- Checkout sends once per cart per browser session. Payment info sends once per cart/payment selection per session.
- Signup sends once per new customer per session. Product/search effects ignore React replays.
- COD payment_type is cod: this means a confirmed method, not cash capture.
- The gift-set page uses the shared tracked cart action and is covered by add_to_cart.
- Direct enquiry links do not prove a successful lead submission and do not emit generate_lead.

## Payloads and privacy

- Ecommerce events use items arrays with variant IDs, matching existing purchase item IDs.
- Cart values use discounted merchandise totals minus item tax. Shipping and tax are not included in value.
- Added-cart values represent only the added quantity; price remains a per-unit amount in major currency units.
- Product views use the lowest-priced displayed variant. Tax-exclusive price is included only when available or explicitly known to exclude tax.
- When net pricing is unknown, item identity/quantity can still be sent without an invented monetary value.
- sign_up sends method=email or google; generate_lead sends lead_source=newsletter or early-access.
- No email, phone, account form values, fbp or fbc are added to GA4 payloads.
- Search terms are normalized. Obvious contact details, URLs, encoded values, long numeric identifiers and terms over 100 characters become [redacted]. This is a basic filter, not a guarantee that all free-text personal data can be detected.
- New event page_location values omit query strings and fragments. Existing automatic Google-tag collection is a separate configuration to review.
- New events honor the existing explicit cookie refusal. They wait up to about 30 seconds for Google-tag initialization, with a bounded in-memory queue. Ad blockers or unloads can still prevent delivery.

## Verification

1. Run `node scripts/google-tracking.test.cjs` and `node scripts/meta-tracking.test.cjs`.
2. On an approved test session, enable Google Tag Assistant/debug mode and open the matching GA4 property's DebugView.
3. Visit a product, add one unit, begin checkout and successfully continue with a payment method.
4. Confirm event names, item IDs, quantities, currency, net value and payment_type.
5. Submit a search, subscribe with a test address and create an approved test account. Verify search, generate_lead and sign_up.
6. Repeat checkout rendering, fail a payment setup, decline cookies and log into an existing account; verify no unwanted repeat/success events.
7. Use a fresh browser session or a new cart to retest once-per-session checkout receipts.
8. Check DevTools network requests to the Google Analytics collect endpoint. Automated tests mock delivery and do not prove live property ingestion.

Google documents per-session debugging with:

```js
gtag('config', 'G-2XT3X045KM', { debug_mode: true, send_page_view: false });
```

Enable this only for your test session; it is not hardcoded into production events.

## GA4 property settings

- No live GA4 property settings were changed.
- Enhanced measurement may already emit view_search_results from the q URL parameter. It is distinct from the explicit search event; use one definition in a funnel instead of adding both counts together.
- Review enhanced-measurement site-search collection/data redaction separately: automatic collection does not pass through this code's search-term filter.
- lead_source is a custom parameter. Register an event-scoped custom dimension if you want it in standard/custom reports.
- Mark generate_lead or sign_up as key events only if they match the reporting objective; not every funnel interaction should become a key event.
- Standard report processing can lag; DebugView/Realtime are the first verification tools.

## References

- [Google recommended events](https://developers.google.com/analytics/devguides/collection/ga4/reference/events?hl=en)
- [Google verification guide](https://developers.google.com/analytics/devguides/collection/ga4/troubleshoot?community_post=true)
- [Enhanced measurement](https://support.google.com/analytics/answer/9216061)
