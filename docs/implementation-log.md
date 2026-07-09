# Implementation Log

This file tracks real implementation work completed during the project.

Do not add fake entries.
Only update this file after a real implementation step was completed.

---

## Entry Template

### Date

YYYY-MM-DD

### Feature / Task

[Name of the feature or task]

### Goal

[What we wanted to implement]

### Plan Reference

docs/plans/[plan-file].md

If no plan file was created, write:

No plan file was created because this was a small task.

### Implemented Changes

- 
- 
- 

### Files Changed

- `path/to/file`
- `path/to/file`

### Important Decisions

- 

### Follow-up Tasks

- 

---

## Entries

### Date

2026-05-11

### Feature / Task

Site stability, consent, and verification improvements

### Goal

Improve safe baseline behavior after the project review: remove a Vite asset warning, make cookie consent stricter, respect reduced motion preferences, and add a clear API 404 response.

### Plan Reference

No plan file was created because this was a small targeted task.

### Implemented Changes

- Removed the unresolved `YoungBest-Regular.ttf` font reference that caused a Vite build warning.
- Added reduced-motion CSS safeguards for reveal, hero zoom, transition, scroll, and marquee behavior.
- Updated cookie consent so analytics and marketing are opt-in, with separate choices and runtime consent updates.
- Updated the cookie consent hook to refresh when consent changes.
- Added an `/api` 404 JSON handler before the Express error handler.

### Files Changed

- `client/src/index.css`
- `client/src/components/CookieBanner.jsx`
- `client/src/hooks/useCookieConsent.js`
- `server/src/app.js`

### Important Decisions

- No dependencies were added or upgraded.
- Legal/business identity placeholders were not filled because the real business details must come from the site owner.
- Context7 review focused on React 19, Vite 8, and Express 5 guidance relevant to the existing stack.

### Follow-up Tasks

- Provide real business details for legal pages: official business name, registration number, address, service contact details, accessibility coordinator, shipping/returns details, and privacy/cookie wording.
- Run manual browser checks for storefront, cart, checkout, auth, profile, admin, and legal pages with live environment variables and services.
- Decide whether to implement a broader luxury editorial redesign phase after approval.

---

### Date

2026-05-11

### Feature / Task

Luxury editorial dynamic storefront

### Goal

Make the front store feel more premium, dynamic, and editorial across the shopping journey without changing backend logic, payment logic, auth logic, product schemas, or dependencies.

### Plan Reference

No plan file was created because the user approved the implementation plan directly in chat.

### Implemented Changes

- Added a shared CSS motion layer for page entrance, lift hover, image depth, CTA shimmer, drawer entrance, staggered grids, and reduced-motion fallbacks.
- Added route-level page entrance animation without changing existing routes or guards.
- Extended scroll reveal support with `reveal-scale`.
- Applied richer motion to home sections, product cards, shop filters, mobile filter drawer, product gallery, add-to-cart feedback, cart items, checkout panels, and wishlist cards.
- Kept all changes in the React client and did not install or upgrade animation dependencies.

### Files Changed

- `client/src/App.jsx`
- `client/src/index.css`
- `client/src/hooks/useScrollReveal.js`
- `client/src/pages/Home.jsx`
- `client/src/pages/Shop.jsx`
- `client/src/pages/ProductDetail.jsx`
- `client/src/pages/Cart.jsx`
- `client/src/pages/Checkout.jsx`
- `client/src/pages/Wishlist.jsx`
- `docs/implementation-log.md`
- `docs/verification.md`

### Important Decisions

- Implemented the first pass with existing CSS/React rather than adding Motion/Framer Motion, because dependency changes still need explicit approval.
- Preserved RTL/Hebrew structure, React Context usage, existing routes, API service usage, auth/payment flows, and checkout behavior.
- Kept checkout motion restrained so the payment flow remains trustworthy and calm.

### Follow-up Tasks

- Run a full manual browser pass on desktop, tablet, and mobile with valid server/API data.
- If a stronger next phase is approved, add a dedicated animation library and replace CSS-only page transitions with richer enter/exit transitions.

---

### Date

2026-05-11

### Feature / Task

Slower storefront motion tuning

### Goal

Make the luxury storefront animations slower and more noticeable across the front without changing behavior or adding dependencies.

### Plan Reference

No plan file was created because this was a small tuning task.

### Implemented Changes

- Increased global page, reveal, drawer, grid, CTA, hover, image, hero, and marquee animation durations.
- Increased reveal and drawer travel distance so entrances feel more visible.
- Increased stagger delays so product grids enter with a clearer sequence.
- Preserved reduced-motion fallbacks.

### Files Changed

- `client/src/index.css`
- `docs/implementation-log.md`
- `docs/verification.md`

### Important Decisions

- Tuned the shared CSS motion layer instead of editing each page separately.
- No dependencies were added or upgraded.

### Follow-up Tasks

- Manually review the storefront in a browser and reduce durations slightly if the checkout or product browsing flow feels too slow.

---

### Date

2026-05-11

### Feature / Task

Handwritten editorial font accents

### Goal

Add the requested handwritten font stack for luxury editorial accent text without using it for long Hebrew copy.

### Plan Reference

No plan file was created because this was a small typography task.

### Implemented Changes

- Added Google Fonts import for `Caveat` and `Architects Daughter`.
- Added `--hand: 'Caveat', 'Architects Daughter', cursive`.
- Added `.editorial-hand` CSS utility and `font-hand` Tailwind token.
- Applied handwritten accent lines on home, shop, and product detail pages.

### Files Changed

- `client/src/index.css`
- `client/tailwind.config.js`
- `client/src/pages/Home.jsx`
- `client/src/pages/Shop.jsx`
- `client/src/pages/ProductDetail.jsx`
- `docs/implementation-log.md`
- `docs/verification.md`

### Important Decisions

- Used the handwritten font as an English/editorial accent only, not for long Hebrew text, to preserve readability.
- No npm dependencies were added.

### Follow-up Tasks

- Review the accents visually in the browser and decide whether to use the hand font in more areas such as product labels or campaign notes.

---

### Date

2026-05-11

### Feature / Task

Luxury editorial scrollytelling phase

### Goal

Add Apple/Rockstar-inspired cinematic scrolling to the storefront while keeping the buying flow stable and avoiding new dependencies.

### Plan Reference

No plan file was created because the user approved the implementation plan directly in chat.

### Implemented Changes

- Added `useScrollProgress` to read section scroll progress for cinematic effects.
- Upgraded the home hero with parallax-style image movement, copy movement/fade, and a vertical progress indicator.
- Added a pinned Collection Story section with three chapters: New In, Ceremony, and Tailoring.
- Added sticky desktop storytelling and mobile-friendly non-pinned fallbacks.
- Upgraded product detail gallery with mask reveal, gallery frame, scroll progress, and richer thumbnail feedback.
- Added CSS utilities for cinematic hero, pinned story, scroll progress, gallery framing, and reduced-motion fallbacks.

### Files Changed

- `client/src/hooks/useScrollProgress.js`
- `client/src/index.css`
- `client/src/pages/Home.jsx`
- `client/src/pages/ProductDetail.jsx`
- `docs/implementation-log.md`
- `docs/verification.md`

### Important Decisions

- No dependencies were added or upgraded.
- No backend, auth, payment, cart, stock, analytics, or product schema logic was changed.
- Desktop gets the pinned cinematic story; mobile uses a lighter layout to reduce scroll and performance risk.

### Follow-up Tasks

- Manually review home and product detail on desktop, tablet, and mobile.
- Tune chapter lengths or animation intensity after visual review if the scroll feels too slow or too dramatic.

---

### Date

2026-05-12

### Feature / Task

Production-ready storefront upgrade: hero, lookbook, i18n, and cleanup

### Goal

Prepare the storefront for longer-term production use by adding a maintainable bilingual storefront foundation, improving the luxury editorial campaign experience, and removing unused Vite template files.

### Plan Reference

No plan file was created because the user approved the implementation plan directly in chat.

### Implemented Changes

- Added `i18next` and `react-i18next` to the client.
- Added a client i18n setup with Hebrew fallback, Hebrew/English resources, localStorage language persistence, and automatic document `lang`/`dir` updates.
- Added a language switcher to the navbar.
- Moved static storefront text for Navbar, Footer, Home, Shop, Product Detail, Cart, Wishlist, and Checkout into translation dictionaries.
- Strengthened the home campaign experience with a clearer luxury editorial lookbook section and translated campaign copy.
- Preserved existing routes, React Context state, API service usage, cart, wishlist, auth, checkout, payment, and backend behavior.
- Removed unused Vite template files: `client/src/assets/react.svg`, `client/src/assets/vite.svg`, and `client/src/App.css`.

### Files Changed

- `client/package.json`
- `client/package-lock.json`
- `client/src/i18n/index.js`
- `client/src/i18n/locales/he.js`
- `client/src/i18n/locales/en.js`
- `client/src/main.jsx`
- `client/src/components/layout/Navbar.jsx`
- `client/src/components/layout/Footer.jsx`
- `client/src/pages/Home.jsx`
- `client/src/pages/Shop.jsx`
- `client/src/pages/ProductDetail.jsx`
- `client/src/pages/Cart.jsx`
- `client/src/pages/Wishlist.jsx`
- `client/src/pages/Checkout.jsx`
- `client/src/assets/react.svg`
- `client/src/assets/vite.svg`
- `client/src/App.css`

### Important Decisions

- Product names and product descriptions still come from the database as-is; product schema was not changed for multilingual product content.
- Admin, backend, payment logic, auth logic, product schema, and database behavior were not changed.
- The first i18n phase covers storefront UI copy only.

### Follow-up Tasks

- Manually verify Hebrew RTL and English LTR in a browser across home, shop, product detail, wishlist, cart, and checkout.
- Decide later whether product data should become multilingual in the database, for example `name.he/name.en` and `description.he/description.en`.
- Consider code-splitting if the production bundle warning remains important after final visual QA.

---

### Date

2026-05-12

### Feature / Task

Home editorial copy language and navbar subtitle cleanup

### Goal

Keep the home page marketing/editorial experience in English even when the active site language is Hebrew, and remove the subtitle under the Dream & Work logo.

### Plan Reference

No plan file was created because the user approved the implementation plan directly in chat.

### Implemented Changes

- Fixed the home page translation function to use the English dictionary for home page copy.
- Kept dynamic product names and descriptions unchanged because they come from the database.
- Replaced local home page House Codes copy with clean English text.
- Removed the `common.editorialMenswear` subtitle display from the navbar logo area.

### Files Changed

- `client/src/pages/Home.jsx`
- `client/src/components/layout/Navbar.jsx`

### Important Decisions

- The change is limited to home page marketing/editorial copy and the navbar subtitle.
- The language switcher and the rest of the storefront i18n behavior remain unchanged.

### Follow-up Tasks

- Manually check the home page in Hebrew and English modes to confirm the home content remains English and the navbar logo has no subtitle.

---

### Date

2026-05-12

### Feature / Task

Launch-ready legal UX and accessibility pass

### Goal

Prepare the storefront for launch by organizing legal/customer-service information in a professional structure, adding a contact page, surfacing transaction cancellation access, cleaning legal pages, and improving basic ARIA coverage.

### Plan Reference

No plan file was created because the user approved the implementation plan directly in chat.

### Implemented Changes

- Added a central `BUSINESS_INFO` placeholder source for missing official business details.
- Rebuilt the footer as structured columns for brand, customer service, legal information, and business details.
- Added a `/contact` page with service details and clearly marked placeholders.
- Added a subtle home page cancellation CTA near the service/trust area, not in the hero.
- Rewrote Terms, Returns, Privacy, and Accessibility pages to remove mojibake and keep placeholders explicit.
- Added basic ARIA labels and focus improvements for navbar, cart quantity controls, wishlist buttons, shop color filters, product accordions, and gallery thumbnails.

### Files Changed

- `client/src/data/businessInfo.js`
- `client/src/components/layout/Footer.jsx`
- `client/src/pages/Contact.jsx`
- `client/src/App.jsx`
- `client/src/pages/Home.jsx`
- `client/src/pages/legal/Terms.jsx`
- `client/src/pages/legal/Returns.jsx`
- `client/src/pages/legal/Privacy.jsx`
- `client/src/pages/legal/Accessibility.jsx`
- `client/src/components/layout/Navbar.jsx`
- `client/src/pages/Shop.jsx`
- `client/src/pages/Cart.jsx`
- `client/src/pages/ProductDetail.jsx`
- `client/src/pages/Wishlist.jsx`

### Important Decisions

- Real business details were not invented; placeholders remain visible and highlighted.
- No backend, auth, payment, cart, product schema, database, or dependency changes were made.
- Accessibility copy avoids claiming full compliance before a real manual audit.

### Follow-up Tasks

- Replace placeholders with official business details before launch.
- Run a manual accessibility pass with keyboard navigation and screen-reader checks.
- Have the legal pages reviewed by a qualified legal professional before publishing.

---

### Date

2026-05-12

### Feature / Task

Fashion-site inspired footer cleanup

### Goal

Make the footer match the clean link-column pattern used by Israeli fashion sites and remove the business-details block from the footer.

### Plan Reference

No plan file was created because the user approved the implementation plan directly in chat.

### Implemented Changes

- Removed business identity details from the footer.
- Removed the footer placeholder notice.
- Rebuilt the footer as four clean link columns: brand, help, legal information, and magazine.
- Kept business placeholders available only through Contact and legal pages.
- Cleaned mojibake in `businessInfo` and Contact, and used Unicode escapes in Footer labels to avoid encoding corruption.

### Files Changed

- `client/src/components/layout/Footer.jsx`
- `client/src/pages/Contact.jsx`
- `client/src/data/businessInfo.js`

### Important Decisions

- The footer no longer displays company name, company ID, address, phone, email, or placeholder explanations.
- Contact and legal pages remain the source for business details.

### Follow-up Tasks

- Visually review the footer against the user-provided examples on desktop and mobile.

---

### Date

2026-05-12

### Feature / Task

Original luxury editorial footer refinement

### Goal

Correct the footer so it uses the reference screenshots only for structure, not copied styling, and remove duplicated footer links.

### Plan Reference

No plan file was created because this was a follow-up correction to the approved footer plan.

### Implemented Changes

- Reworked the footer visual style back into the Dream & Work luxury editorial palette and typography.
- Removed the red reference-inspired heading color.
- Kept the clean column structure without the business-details block.
- Removed duplicated `/contact` link from the footer bottom bar.
- Reduced duplicated destination links across footer columns.

### Files Changed

- `client/src/components/layout/Footer.jsx`

### Important Decisions

- The reference screenshots are now used only for layout inspiration.
- The footer remains free of company ID, address, phone, email, and business placeholders.

### Follow-up Tasks

- Visually review the footer on desktop and mobile to confirm it feels like Dream & Work rather than the reference sites.

---

### Date

2026-05-12

### Feature / Task

Homepage campaign image management

### Goal

Allow admins to manage campaign-style images for the home page without editing code, while keeping home-page text unchanged.

### Plan Reference

No plan file was created because the user approved the implementation direction directly in chat.

### Implemented Changes

- Added a server model for home-page campaign image sets by slot.
- Added public and admin API routes for home-page image slots.
- Registered the new API route in the Express app.
- Added an admin tab for uploading, removing, and saving multiple campaign images per slot.
- Updated the home page to use one randomly selected image per slot on page load.
- Preserved fallbacks to existing product images or `hero.png` when no campaign image exists.

### Files Changed

- `server/src/models/HomepageImageSet.js`
- `server/src/routes/homepageImages.js`
- `server/src/app.js`
- `client/src/pages/admin/Dashboard.jsx`
- `client/src/pages/Home.jsx`

### Important Decisions

- The admin manages images only, not home-page copy.
- Random image selection happens on page load, not during scrolling.
- Slots are: `hero`, `collectionStory`, `lookbookWorkday`, `lookbookEvening`, and `lookbookEvent`.

### Follow-up Tasks

- Manually verify upload and save behavior with an admin account and configured Cloudinary credentials.
- Visually review home-page campaign image cropping on desktop and mobile.

---

### Date

2026-05-12

### Feature / Task

Panel-based home hero and equal lookbook panels

### Goal

Move the home-page first impression toward the approved panel-based luxury editorial direction and keep campaign imagery controllable through the existing home image slots.

### Plan Reference

No plan file was created because this was a direct follow-up to the approved visual direction.

### Implemented Changes

- Added a panel-based hero layout with a campaign image panel and editorial text panels.
- Kept the hero image connected to the existing admin-managed `hero` slot.
- Added an “Every moment” panel using the same GSAP entrance group as the main hero copy.
- Kept the existing hero text animation references active in the new panel layout.
- Removed the staggered vertical offset from the Lookbook cards so all three image panels stay the same size.

### Files Changed

- `client/src/pages/Home.jsx`

### Important Decisions

- The old hero markup is hidden rather than deleted in this pass to reduce risk while preserving the existing animation wiring.
- Lookbook images still come from the admin-managed `lookbookWorkday`, `lookbookEvening`, and `lookbookEvent` slots with existing fallbacks.

### Follow-up Tasks

- Browser-review the new hero panels on desktop and mobile.
- If approved visually, remove the hidden legacy hero markup in a cleanup pass.

---

### Date

2026-05-12

### Feature / Task

Compact panel-based home page

### Goal

Make the home page closer to the approved compact panel mockup and reduce the amount of vertical scrolling compared with the previous long editorial page.

### Plan Reference

No plan file was created because this was a direct follow-up correction requested in chat.

### Implemented Changes

- Added a compact Lookbook panel directly after the hero and marquee.
- Added equal-size Workday, Evening, and Event image panels using the existing admin-managed Lookbook image slots.
- Added a compact service strip for shipping, returns, styling, and secure payments.
- Hid the older long home-page sections after the compact panel area to reduce page length.

### Files Changed

- `client/src/pages/Home.jsx`

### Important Decisions

- This pass prioritizes matching the compact visual direction and reducing scroll length.
- Older home sections are hidden rather than deleted until the user approves the new layout visually.

### Follow-up Tasks

- Browser-review the compact home page against the reference mockup.
- If approved, remove the hidden legacy sections from `Home.jsx` in a cleanup pass.

---

### Date

2026-05-12

### Feature / Task

Luxury cinematic Lookbook motion

### Goal

Make the compact home-page Lookbook section feel slower, more dynamic, and more premium without adding dependencies or changing product/admin/backend behavior.

### Plan Reference

Approved chat plan: "Luxury Cinematic Lookbook Motion".

### Implemented Changes

- Added dedicated Lookbook motion classes to the compact Lookbook section in `Home.jsx`.
- Removed the compact Lookbook cards from the generic `.product-card` animation path so they can use their own reveal behavior.
- Added slow section reveal, staggered card entrance, image breathing, champagne hover glow, card focus dimming, title lift, and text-panel light sweep styles.
- Added reduced-motion fallbacks for the new Lookbook animation classes.

### Files Changed

- `client/src/pages/Home.jsx`
- `client/src/index.css`

### Important Decisions

- No dependency was added; the effect uses existing React markup and CSS.
- No pinned or scroll-linked animation was added, to avoid the previous jumpy scroll behavior.
- Admin-managed Lookbook image slots and product fallbacks were preserved.

### Follow-up Tasks

- Browser-review the Lookbook section on desktop and mobile.
- Tune motion speed/intensity after visual review if it feels too subtle or too strong.

---

### Date

2026-05-12

### Feature / Task

Admin image resolution guidance

### Goal

Make the admin image upload areas clearer by showing recommended image resolution and aspect ratio for home-page campaign images and product/model images.

### Plan Reference

No plan file was created because this was a small admin copy/UI clarification.

### Implemented Changes

- Added per-slot resolution guidance in the admin home-page campaign image editor.
- Added shared product/model image guidance for the general product gallery.
- Added the same product/model guidance for color-specific product images.

### Files Changed

- `client/src/pages/admin/Dashboard.jsx`

### Important Decisions

- This is guidance-only; upload validation, compression, Cloudinary behavior, and schemas were not changed.
- Product/model images are recommended at 1600×2000px with a 4:5 ratio.
- Lookbook images are recommended at 1600×2000px; hero and collection story have slot-specific recommendations.

### Follow-up Tasks

- Visually review the admin upload sections to confirm the guidance is clear and not too crowded.

---

### Date

2026-05-12

### Feature / Task

Light hero palette update

### Goal

Change only the home hero section to the site's light palette while keeping direct hex classes available for VS Code color picker editing.

### Plan Reference

Approved chat plan: "Light Hero Palette Update".

### Implemented Changes

- Changed the home hero wrapper from a translucent white/dark text setup to `#F7F3EA` with dark text.
- Changed the hero text panels from dark navy to light surface panels with `#FFFFFF`, `#E5E7EB`, `#111827`, `#4B5563`, and gold accents.
- Kept the image-overlay text white because it sits on top of the campaign image.
- Kept the home image/admin logic and animations unchanged.

### Files Changed

- `client/src/pages/Home.jsx`

### Important Decisions

- The change is scoped to the hero block only; global Tailwind `primary` was not changed.
- Hex classes were used intentionally so VS Code can show color pickers on the hero colors.

### Follow-up Tasks

- Visually review the hero in the browser to confirm the light palette is readable and not too flat.

---

### Date

2026-05-12

### Feature / Task

Restore blue hero palette

### Goal

Return the home hero colors from the temporary light palette back to the previous blue/dark palette.

### Plan Reference

Approved in chat after the user asked to restore the previous color.

### Implemented Changes

- Restored the hero wrapper to `bg-primary` with white text.
- Restored the main hero text panel to `bg-[#142844]`.
- Restored hero text, CTA, secondary panel, and progress-line colors to the previous white/gold-on-blue styling.

### Files Changed

- `client/src/pages/Home.jsx`

### Important Decisions

- Only the hero color classes were restored; layout, images, animations, admin-managed image logic, and other sections were not changed.

### Follow-up Tasks

- Visually review the home hero to confirm it matches the preferred blue palette again.

---

### Date

2026-05-12

### Feature / Task

Navy, cream, and sage editorial palette

### Goal

Refresh the storefront color system to keep navy as the anchor color, move the light surfaces toward cream/stone, and replace yellow/gold accents with sage.

### Plan Reference

Approved chat plan: "Navy, Cream & Sage Editorial Palette".

### Implemented Changes

- Updated Tailwind color tokens and root CSS variables to the navy, cream, stone, and sage palette.
- Kept existing `gold`/`gold-dark` class names for compatibility, but changed their values to sage/deep sage.
- Replaced hardcoded yellow accents in shared CSS, splash screen, and footer with sage tones.
- Changed the PayPal button style from gold to black to avoid a yellow checkout accent.
- Updated the home hero inner panel to the planned deep navy value.

### Files Changed

- `client/tailwind.config.js`
- `client/src/index.css`
- `client/src/pages/Home.jsx`
- `client/src/pages/Checkout.jsx`
- `client/src/components/SplashScreen.jsx`
- `client/src/components/layout/Footer.jsx`

### Important Decisions

- Admin screens were not redesigned.
- Storefront class names such as `gold`, `gold-dark`, and `gold-shimmer` were retained to avoid broad JSX churn; they now render as sage rather than yellow.
- Existing routes, API calls, payment logic, cart/auth behavior, and admin image logic were not changed.

### Follow-up Tasks

- Visually review Home, Shop, Product Detail, Wishlist, Cart, and Checkout on desktop and mobile.
- If the sage feels too muted or too green in real imagery, tune only the token values.

---

### Date

2026-07-09

### Feature / Task

Server code review cleanup: encoding fix, dead code removal, and deduplication

### Goal

Fix broken and dead server code found during a full code review, and consolidate duplicated logic to a single source of truth, without changing runtime behavior, auth logic, payment flows, or dependencies.

### Plan Reference

No plan file was created because the user approved the code-review fixes directly in chat.

### Implemented Changes

- Fixed double-encoded (mojibake) Hebrew strings in the forgot-password and reset-password handlers, including user-facing response messages; logic was left unchanged.
- Removed unused `User` schema fields (`wishlist`, `address`, `newsletter`) that no route ever read or wrote (wishlist is client-side localStorage only).
- Added `isDeleted` and `deletedAt` to the `User` schema so the existing account-deletion route's soft-delete flags actually persist (Mongoose was silently dropping them).
- Removed a fully duplicated `STATUS_META` key block in the email service (JS kept only the second copy; the first was dead).
- Simplified the `me` controller to use the already-loaded `req.user` instead of issuing a second `findById` on every authenticated page load.
- Extracted the coupon validation logic into a shared `services/couponService.js` and reused it from both the payment flow and the `/coupons/validate` route, removing the duplicated checks.
- Extracted the duplicated Cloudinary config into a shared `config/cloudinary.js` used by both the product controller and the upload route.

### Files Changed

- `server/src/routes/auth.js`
- `server/src/models/User.js`
- `server/src/services/emailService.js`
- `server/src/controllers/authController.js`
- `server/src/services/couponService.js`
- `server/src/routes/payment.js`
- `server/src/routes/coupons.js`
- `server/src/config/cloudinary.js`
- `server/src/controllers/productController.js`
- `server/src/routes/upload.js`

### Important Decisions

- No dependencies were added or changed.
- The Stripe webhook flow, payment logic, and the `req.user.id`/`req.user._id` style inconsistency were intentionally left untouched to avoid risk in payment-critical code.
- Removing dead schema fields does not delete existing MongoDB documents; a separate migration would be needed to purge stored values, and none was run.

### Follow-up Tasks

- If desired, write a migration to physically unset the removed `wishlist`/`address`/`newsletter` fields from existing user documents.
- Optionally standardize `req.user.id` vs `req.user._id` usage across routes in a later low-risk pass.
