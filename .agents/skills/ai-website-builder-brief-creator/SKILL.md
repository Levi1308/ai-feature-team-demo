# Skill Name

**ai-website-builder-brief-creator**

---

# Purpose

Generate clear, specific, and buildable website briefs for AI-powered website builders such as Wix ADI, Framer AI, Webflow AI, and similar tools. The brief must be focused enough that the AI builder produces a clean, purposeful site — not a bloated, confusing one.

---

# When to Use

Use this skill when a user needs to:

- Launch a new website using an AI website builder
- Rebuild or redesign an existing site with an AI tool
- Create a brief to hand off to a designer or developer who will use an AI builder
- Validate that a site structure makes sense before building

---

# Required Inputs

| Input | Description |
|---|---|
| `business_type` | What kind of business this is (e.g., winery, gym, ecommerce store) |
| `business_name` | The name of the business |
| `location` | City, state, region, or "online only" |
| `target_audience` | Who the customers are (age range, interests, context) |
| `primary_goal` | The single most important thing the website must achieve (e.g., "drive tasting room bookings", "generate free trial signups", "sell products online") |

---

# Optional Inputs

| Input | Description |
|---|---|
| `brand_tone` | Adjectives describing the voice and feel (e.g., "warm, rustic, premium") |
| `key_products_services` | The 3–6 most important offerings to feature |
| `booking_or_checkout` | Whether the site needs a booking system, checkout, or both |
| `existing_branding` | Colors, fonts, logos, or style guides already in use |
| `pages_needed` | Any specific pages the business knows it needs |
| `competitors` | Competitor URLs to reference for context (not to copy) |
| `must_avoid` | Anything the client explicitly does not want (e.g., "no chatbot", "no newsletter popup") |

---

# Workflow

Follow these 9 steps in order when generating a website brief:

1. **Restate the business** — Confirm business name, type, and location. If multiple locations exist, note them but do not create separate nav items for each; use a Locations page instead.
2. **Define the site's job** — State the primary goal in one sentence. Everything else on the site must support this goal.
3. **Define navigation** — Choose 4–6 navigation items. No more than 6. No duplicates. No vague labels (Info, More, Things, Stuff). For multi-location businesses, use a single "Locations" nav item.
4. **Define homepage sections** — Plan 4–6 sections (never more than 7). Each section must have a clear purpose tied to the primary goal.
5. **Define supporting pages** — List each page and its single job (one sentence per page).
6. **Define key features** — Identify the 3–5 must-have functional features (e.g., booking widget, product grid, contact form). Do NOT include features the business does not need.
7. **Define visual tone** — Describe imagery style, color feel, and typography direction in 2–3 sentences. For e-commerce, specify logo top-left and cart top-right in the header.
8. **Run the QA checklist** — Verify all 8 checklist items pass before outputting the brief.
9. **Output the brief** — Produce the full structured brief using the Output Format template below.

---

# Output Format

Use this template exactly when generating a brief:

```
## Website Brief: [Business Name]

**Business Type:** [type]
**Location:** [location]
**Target Audience:** [audience]
**Primary Goal:** [goal]
**Brand Tone:** [tone — if not provided, infer from business type]

---

### Navigation
1. [Item]
2. [Item]
3. [Item]
4. [Item]
5. [Item — optional]
6. [Item — optional]

---

### Homepage Sections
1. **[Section Name]** — [One-sentence description of its job]
2. **[Section Name]** — [One-sentence description of its job]
3. **[Section Name]** — [One-sentence description of its job]
4. **[Section Name]** — [One-sentence description of its job]
5. **[Section Name]** — [One-sentence description, optional]
6. **[Section Name]** — [One-sentence description, optional]

---

### Pages
- **[Page Name]:** [One-sentence description of this page's job]
- **[Page Name]:** [One-sentence description of this page's job]
- (repeat for each page)

---

### Key Features
- [Feature and why it matters]
- [Feature and why it matters]
- (3–5 features max)

---

### Visual Direction
[2–3 sentences describing imagery style, color palette feel, and typography direction.]

---

### Logo & Cart Placement
- **Logo:** Top-left header
- **Cart:** [Top-right header — include only if e-commerce; omit this line for service-only businesses]

---

### Mobile Layout Notes
- [At least one specific note about how the mobile layout should differ from desktop]
- [Additional note if relevant]
```

**Notes on the Output Format:**
- If the business has no products (services only), omit the Cart line from Logo & Cart Placement and remove any product grid from Key Features.
- If the business has no booking flow, omit the booking-related feature from Key Features.
- If the business has multiple locations, list them on a dedicated Locations page rather than adding nav items per location.

---

# Guardrails

These rules are non-negotiable. Violating any of them produces a poor brief.

- **NEVER** create navigation with more than 6 items
- **NEVER** create duplicate navigation labels
- **NEVER** use vague navigation labels (e.g., Info, More, Things, Stuff, Other)
- **NEVER** skip the primary CTA — every homepage must have a clear, prominent call-to-action tied to the primary goal
- **NEVER** suggest features the business does not need (e.g., do not add a booking widget to a pure ecommerce store)
- **NEVER** produce a homepage with more than 6–7 sections
- **ALWAYS** specify logo top-left and cart top-right for any e-commerce site
- **ALWAYS** include at least one mobile layout note in every brief

---

# Example Prompt

**User input:**
> business_type: coffee shop
> business_name: Blue Owl Coffee
> location: Portland, OR
> target_audience: remote workers and coffee enthusiasts aged 25–45
> primary_goal: drive foot traffic and grow loyalty program signups
> brand_tone: cozy, approachable, artisan
> key_products_services: espresso drinks, pour-overs, pastries, loyalty card
> booking_or_checkout: no booking, no checkout
> must_avoid: no online ordering widget

**Generated Brief:**

```
## Website Brief: Blue Owl Coffee

**Business Type:** Coffee shop
**Location:** Portland, OR
**Target Audience:** Remote workers and coffee enthusiasts aged 25–45
**Primary Goal:** Drive foot traffic and grow loyalty program signups
**Brand Tone:** Cozy, approachable, artisan

---

### Navigation
1. Home
2. Menu
3. Our Story
4. Loyalty Program
5. Find Us

---

### Homepage Sections
1. **Hero** — Full-width café atmosphere photo with headline "Your daily ritual, perfected" and CTA "Join the Loyalty Program"
2. **Signature Drinks** — Feature 3 hero drinks (espresso, pour-over, seasonal special) with photography
3. **Why Blue Owl** — Three-column trust block: ethically sourced beans, local bakers, free Wi-Fi
4. **Loyalty Program** — Dedicated section explaining the punch-card program with a prominent signup CTA
5. **Find Us** — Embedded map, address, hours

---

### Pages
- **Menu:** Full drink and pastry menu, organized by category
- **Our Story:** Brand narrative, sourcing values, team photo
- **Loyalty Program:** Full program details, how to join, current rewards
- **Find Us:** Map, address, parking notes, hours

---

### Key Features
- Loyalty program signup form (primary conversion goal)
- High-quality drink photography throughout
- Google Maps embed on Find Us page

---

### Visual Direction
Warm amber and deep brown tones with cream accents. Photography should feel candid and cozy — steaming cups, hands around mugs, natural light through windows. Typography: serif for headlines (feels artisan), clean sans-serif for body text.

---

### Logo & Cart Placement
- **Logo:** Top-left header

---

### Mobile Layout Notes
- Stack the three-column trust block to a single column on mobile
- Ensure the loyalty program CTA button is thumb-reachable (bottom 60% of screen) on mobile
```

---

# QA Checklist

Run this checklist on every brief before outputting it. All 8 items must pass.

- [ ] **Logo placement** — Logo is specified as top-left in the header
- [ ] **Cart placement** — Cart is specified as top-right in the header if the site is e-commerce; line is omitted for service-only businesses
- [ ] **Navigation** — 6 items or fewer, no duplicate labels, no vague labels (Info, More, Things, Stuff)
- [ ] **Relevant images** — At least one specific image type is called out (e.g., "vineyard aerial shots", "action photos of rolling and sparring", "flat-lay product photography")
- [ ] **Products/Services** — The business's key offerings are named and featured in homepage sections or a dedicated page
- [ ] **Booking flow** — If the business takes bookings or appointments, the booking CTA is prominent on the homepage; mark N/A if not applicable
- [ ] **Mobile layout** — At least one mobile-specific layout note is included
- [ ] **No bloat** — Fewer than 7 navigation items, no duplicate homepage sections, no features added that the business does not need

---

# 3 Full Examples

---

## Example 1 — Napa Valley Winery (California)

**Inputs:**
- business_type: Winery and tasting room
- business_name: Ridgecrest Estate Winery
- location: Napa Valley, CA
- target_audience: Wine tourists and enthusiasts aged 30–60, visiting Napa or planning a trip
- primary_goal: Drive tasting room bookings and direct wine sales
- brand_tone: Sophisticated, warm, estate-crafted
- key_products_services: Tasting room experiences, Cabernet Sauvignon, Chardonnay, wine club membership, private events
- booking_or_checkout: Both (tasting room booking + wine shop checkout)

```
## Website Brief: Ridgecrest Estate Winery

**Business Type:** Winery and tasting room
**Location:** Napa Valley, CA
**Target Audience:** Wine tourists and enthusiasts aged 30–60
**Primary Goal:** Drive tasting room bookings and direct wine sales
**Brand Tone:** Sophisticated, warm, estate-crafted

---

### Navigation
1. Home
2. Tastings
3. Our Wines
4. Wine Club
5. Private Events
6. Visit

---

### Homepage Sections
1. **Hero** — Full-width aerial vineyard shot at golden hour with headline "Estate wines, Napa soul" and dual CTAs: "Book a Tasting" and "Shop Wines"
2. **Tasting Experiences** — Feature 3 tasting packages (Classic, Reserve, Private) with pricing and a "Book Now" button for each
3. **Featured Wines** — Showcase 4 flagship wines (Cabernet Sauvignon, Chardonnay, Rosé, Reserve Blend) with short tasting notes and "Add to Cart"
4. **Wine Club** — Section explaining membership tiers, benefits (discounts, early access, event invites), and a "Join the Club" CTA
5. **The Estate** — Brief story of the estate, vineyard philosophy, and family ownership with a horizontal photo strip
6. **Plan Your Visit** — Address, hours, directions, and a "Book a Tasting" CTA repeated

---

### Pages
- **Tastings:** Full list of tasting experiences with descriptions, pricing, group size notes, and booking widget
- **Our Wines:** Complete wine catalog organized by varietal, with tasting notes and add-to-cart for each
- **Wine Club:** Detailed membership tiers, comparison table, signup form
- **Private Events:** Venue hire information, capacity, catering notes, inquiry form
- **Visit:** Interactive map, detailed directions, parking, accessibility info, FAQs
- **About:** Estate history, winemaking philosophy, team, and awards

---

### Key Features
- Tasting room booking widget (Tock, Resy, or similar — primary conversion goal)
- Wine shop with cart and checkout (direct-to-consumer sales)
- Wine club membership signup form
- Photo gallery of vineyard and tasting room to drive desire

---

### Visual Direction
Rich burgundy and warm gold tones on a cream or off-white background. Photography must feature the vineyard at golden hour, close-up wine pours, barrel room atmosphere, and intimate tasting table setups. Typography: elegant serif for headings (conveys estate heritage), clean serif or refined sans-serif for body copy.

---

### Logo & Cart Placement
- **Logo:** Top-left header
- **Cart:** Top-right header (wine shop requires checkout)

---

### Mobile Layout Notes
- The dual CTA hero buttons (Book a Tasting / Shop Wines) must stack vertically on mobile and each be full-width for easy tapping
- The tasting packages section collapses to a vertical card scroll on mobile
- Booking widget must be fully functional on mobile (many tourists will book on-site via phone)
```

---

## Example 2 — Jiu-Jitsu Gym (Austin, TX)

**Inputs:**
- business_type: Martial arts gym (Brazilian Jiu-Jitsu)
- business_name: Lone Star BJJ
- location: Austin, TX
- target_audience: Local adults aged 25–45 interested in fitness, self-defense, and community
- primary_goal: Generate free trial class signups
- brand_tone: Gritty, welcoming, community-driven
- key_products_services: Adult BJJ classes, kids' program, competition team, private lessons, gear shop
- booking_or_checkout: Booking (free trial class), no checkout needed for main goal (gear shop secondary)
- must_avoid: No aggressive sales language, no countdown timers

```
## Website Brief: Lone Star BJJ

**Business Type:** Brazilian Jiu-Jitsu gym
**Location:** Austin, TX
**Target Audience:** Local adults aged 25–45 interested in fitness, self-defense, and community
**Primary Goal:** Generate free trial class signups
**Brand Tone:** Gritty, welcoming, community-driven

---

### Navigation
1. Home
2. Programs
3. Schedule
4. Free Trial
5. About
6. Contact

---

### Homepage Sections
1. **Hero** — Action photo of live rolling/sparring on the mat with headline "Start your journey on the mat" and a single dominant CTA: "Claim Your Free Trial Class"
2. **Why Lone Star BJJ** — Three-column block: "No experience needed", "All fitness levels welcome", "Austin's tightest-knit mat community"
3. **Programs** — Cards for Adult BJJ, Kids Program, Competition Team, and Private Lessons — each with a one-line description and a "Learn More" link
4. **See the Community** — Photo grid of real students training, competing, and celebrating — no stock photos
5. **How to Get Started** — Three-step visual: Step 1 Sign Up → Step 2 Show Up → Step 3 Roll — with "Claim Your Free Trial" CTA at the bottom
6. **Location & Hours** — Address, class schedule snapshot, and embedded map

---

### Pages
- **Programs:** Detailed breakdown of each program (Adult BJJ, Kids, Competition Team, Private Lessons) with instructor bios
- **Schedule:** Full weekly class schedule, filterable by program type
- **Free Trial:** Dedicated landing page with a short signup form (name, email, phone, preferred time) — this is the conversion page
- **About:** Gym story, head instructor biography, competition history, gym values
- **Contact:** Contact form, phone number, address, social links

---

### Key Features
- Free trial class signup form (primary conversion goal — must be simple: name, email, phone, time preference)
- Class schedule display (students check this repeatedly; must be easy to read)
- Program pages with instructor bios to build trust
- Real photo gallery (community authenticity is a key trust signal for this audience)

---

### Visual Direction
Dark charcoal and navy with bold white text and a single high-energy accent color (burnt orange or red). Photography must be authentic — real students rolling, drilling, and competing, not stock imagery. Typography: bold condensed sans-serif for headlines (conveys energy and confidence), clean sans-serif for body.

---

### Logo & Cart Placement
- **Logo:** Top-left header

---

### Mobile Layout Notes
- The "Claim Your Free Trial Class" CTA must be sticky on mobile — visible as a persistent bottom bar or floating button so it's always one tap away
- The class schedule must render as a horizontal scroll or accordion on mobile rather than a full table
- Three-column program cards collapse to a single-column vertical stack on mobile
```

---

## Example 3 — Women's Clothing Ecommerce Store (US)

**Inputs:**
- business_type: Ecommerce clothing store
- business_name: Wren & Thread
- location: United States (online only)
- target_audience: Women aged 22–40 who value style, quality, and sustainability
- primary_goal: Drive online product sales
- brand_tone: Modern, feminine, intentional
- key_products_services: Dresses, tops, bottoms, accessories, seasonal collections, styling tips
- booking_or_checkout: Checkout only
- must_avoid: No aggressive discount popups on homepage load

```
## Website Brief: Wren & Thread

**Business Type:** Women's clothing ecommerce store
**Location:** United States (online only)
**Target Audience:** Women aged 22–40 who value style, quality, and sustainability
**Primary Goal:** Drive online product sales
**Brand Tone:** Modern, feminine, intentional

---

### Navigation
1. Home
2. Shop
3. Collections
4. About
5. Sustainability
6. Contact

---

### Homepage Sections
1. **Hero** — Full-width editorial lifestyle image (model in natural setting) with headline "Dressed with intention" and CTA: "Shop the Collection"
2. **Featured Collection** — Showcase the current seasonal collection with 4–6 product tiles, each with image, name, price, and "Shop Now"
3. **Category Tiles** — Visual grid of 4 categories: Dresses, Tops, Bottoms, Accessories — each tile links to its filtered shop page
4. **Brand Values** — Three-column block: "Sustainably sourced", "Size-inclusive", "Made to last" — each with a short sentence and icon
5. **Style Edit** — Curated "how to wear it" section showing 2–3 outfit pairings with linked products (drives multi-item cart additions)
6. **Instagram / Community** — UGC photo grid showing real customers wearing Wren & Thread pieces, with a soft CTA to tag the brand

---

### Pages
- **Shop:** Full product catalog with filters (category, size, color, price range)
- **Collections:** Seasonal and curated collection landing pages (e.g., "Summer Edit", "Workwear Essentials")
- **Product Pages:** Individual product pages with multiple images, size guide, material details, care instructions, and size reviews
- **About:** Brand story, founding mission, team, and commitment to quality
- **Sustainability:** Sourcing practices, materials, packaging, and brand certifications
- **Contact:** Customer service contact form, returns policy link, FAQ

---

### Key Features
- Product catalog with filters (size, color, category, price — essential for ecommerce UX)
- Shopping cart and checkout with guest checkout option
- Size guide accessible from each product page
- Wishlist / save-for-later functionality (reduces bounce for considered purchases)
- "Complete the look" cross-sell on product pages (increases average order value)

---

### Visual Direction
Soft white and warm ivory backgrounds with dusty rose and sage green accents. Photography must be editorial-quality lifestyle shots — models in natural, aspirational settings (not studio white backgrounds), plus clean flat-lay product photography. Typography: refined serif for headlines (feminine, elevated), lightweight sans-serif for prices and body copy.

---

### Logo & Cart Placement
- **Logo:** Top-left header
- **Cart:** Top-right header (ecommerce checkout required)

---

### Mobile Layout Notes
- Product grid collapses from 3 columns to 2 columns on mobile (1 column only for very small screens)
- Cart icon must remain visible and tappable in the sticky mobile header at all times
- Size selector and "Add to Cart" button must be large touch targets (minimum 44px height) on mobile product pages
- The Style Edit section reflows to a vertical scroll of outfit cards on mobile
```
