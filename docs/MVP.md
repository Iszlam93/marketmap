# MarketMap MVP Definition

**Status:** Approved direction for prototype validation and private alpha
**Updated:** 1 September 2026

## MVP outcome

A marketer can connect Asana, review an AI-suggested project map, and understand the complete marketing plan across the funnel, year, and strategy without rebuilding a spreadsheet, board, or presentation.

## Primary user

An experienced marketer in a cross-functional B2B marketing team who manages or coordinates multiple simultaneous initiatives and participates in recurring planning, status, or reporting cycles.

## Core object: initiative

The underlying product object is an **initiative**. The interface may later let an organization label this object as a project, campaign, program, launch, or activity.

Examples include:

- Product launch
- Webinar series
- Brand campaign
- SEO program
- Nurture campaign
- Customer event
- ABM initiative

## Minimum initiative fields

- Name
- Primary objective
- Primary funnel stage: TOFU, MOFU, or BOFU
- Optional supporting funnel stages
- Quarter or start/end date
- Status: planned, active, at risk, blocked, or complete
- Owner
- Expected outcome
- Optional priority
- Optional connection to another initiative

The same initiative data powers every view. A user should never re-enter a project separately for the funnel and quarterly views.

## Core experience

### Asana-first onboarding

The marketer creates an account, connects Asana, selects the relevant workspace or projects, and authorizes MarketMap to read the project-level information needed for mapping. Asana remains the execution system of record.

MarketMap then uses its own OpenAI API connection to suggest each project's journey, primary and supporting funnel stages, category, and timing. High-confidence suggestions are prepared automatically. Uncertain or incomplete projects are clearly separated for review. The marketer approves or corrects suggestions before creating the map.

Customers do not connect a personal ChatGPT account, provide an OpenAI API key, or manage AI tokens. AI usage is a MarketMap operating cost controlled through product limits and selective remapping.

### Funnel view

Shows how initiatives support TOFU, MOFU, and BOFU. It should help users identify stage gaps, concentration, initiative relationships, and current state.

### Quarterly view

Shows the same initiatives across Q1–Q4 or a selected date range. It should expose timing, overlap, overload, inactive periods, and what is happening now or next.

### Initiative detail

Selecting an initiative reveals its essential fields and connections. The MVP does not include tasks or subtasks.

### Presentation mode

A clean, view-only experience suitable for a planning or reporting conversation. Details remain available progressively without turning the primary view into a dashboard.

## MVP capabilities

- Create, edit, duplicate, and archive initiatives
- Sign up and create one MarketMap workspace
- Connect one Asana workspace through OAuth
- Select which Asana projects MarketMap should include
- Import project-level fields from Asana
- Generate structured AI mapping suggestions with confidence levels
- Review and correct uncertain suggestions before creating the map
- Preserve the approved mapping instead of rerunning AI on every page view
- Sync new or materially changed Asana projects
- Funnel and quarterly views generated from the same data
- Strategy view generated from the same data
- Filter by status, owner, objective, quarter, and funnel stage
- Show current state through accessible visual cues
- Connect related or dependent initiatives
- Share a view-only plan

## Explicitly excluded

- Tasks and subtasks
- Content creation and approval workflows
- Detailed budget management
- Attribution and deep performance analytics
- Marketing automation or publishing
- AI-generated strategy or campaigns as a core feature; AI classification for onboarding is included
- Separate ABM, lifecycle, and product-launch visual systems
- Complex enterprise permissions
- Native mobile editing
- Integrations beyond Asana before the Asana-first workflow is validated
- Spreadsheet or CSV import as the primary onboarding experience

## Experience requirements

- A user with 20 Asana projects can connect, review, and create a useful map in 15–20 minutes.
- A first-time viewer can identify what is active, at risk, missing, and overloaded without training.
- The interface remains comprehensible with at least 50 initiatives.
- Status meaning never depends on color alone.
- Empty-canvas anxiety is reduced through guided entry and realistic examples.

## Prototype scenario

The first prototype should contain 15–25 realistic B2B marketing initiatives distributed across:

- TOFU, MOFU, and BOFU
- Four quarters
- Multiple owners
- All key statuses
- Several cross-stage initiatives
- Several initiative relationships or dependencies

The prototype should be realistic enough to expose density and comprehension problems, not arranged only for visual polish.

## Product promise under test

> Connect Asana, review the suggested structure, and see the complete marketing plan across your funnel, year, and strategy.

## Build gate

Do not expand into task management, additional source integrations, or a broader platform until testing shows that the Asana-first initiative map creates recurring, paid value.
