# GA4 purchase on order confirmation

The existing Google tag sends `purchase` to `G-2XT3X045KM` when a customer reaches
the order confirmation screen. This is mounted alongside Meta Purchase but does
not depend on the Meta relay secret, dataset, queue or availability.

As requested, this measures order placement, including COD; it is not a record of
COD cash collection. Orders whose confirmation screen is never visited will not
be reported by this browser integration. Cancellation/refund reporting is not
part of this change.

Only a server-retrieved, non-canceled order created within the last 24 hours is
eligible. Historical confirmation pages are excluded to avoid backfilling old
orders when this feature launches. Missing/invalid financial data suppresses the
event rather than inventing totals. No customer email, phone or address is sent.

`transaction_id` is the full stable Medusa order ID. Item prices use discounted
line totals minus line tax, divided by quantity. GA4 `value` is the sum of those
item prices times quantities. Tax and net shipping are separate parameters, per
Google's specification: https://developers.google.com/analytics/devguides/collection/ga4/reference/events#purchase
Medusa v2 amounts are already in major currency units and are not divided by 100.

The component waits up to 30 seconds for the Google tag and honors the existing
explicit cookie decline. A localStorage receipt suppresses refresh/revisit sends;
an in-memory guard covers repeated effects, and the stable transaction ID is
also sent to GA4. Receipts mean queued to the Google tag, not confirmed delivery
to Google. Browser blocking, network failures or unavailable storage may prevent
measurement. Clearing browser storage can allow another browser send with the
same transaction ID.

## Verification after deployment

1. Connect Google Tag Assistant to the production storefront to enable debug
   inspection. Place a new order and reach its confirmation screen.
2. In GA4 DebugView, verify `purchase` has the full order ID, uppercase currency,
   correct item IDs, quantities, discounted net prices, tax and shipping.
3. Refresh the confirmation page and verify no second purchase request is queued.
4. Check the existing imported GA4 Purchase conversion in Google Ads later.
   Google Ads attribution requires an eligible ad interaction; an ordinary test
   order is not guaranteed to appear as an attributed Ads conversion.

No new GTM container, Vercel variable, backend deployment or database migration is
required. Do not additionally configure GTM to send the same purchase.

Local regression suite: `node scripts/meta-tracking.test.cjs`.
