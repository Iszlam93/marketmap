# MarketMap Execution Checklist

**Status:** Active

**Updated:** 1 September 2026

## Current objective

Prove that an experienced B2B marketer can connect Asana, review AI suggestions, and receive a useful MarketMap in 20 minutes or less.

## Progress overview

| Phase | Outcome | Status |
|---|---|---|
| Foundation | Product direction and repository aligned | **Done** |
| Phase 1 | Define how Asana projects become MarketMap projects | **In progress** |
| Phase 2 | Prove the proposed mapping works on real projects | **Not started** |
| Phase 3 | Design the complete onboarding journey | **Not started** |
| Phase 4 | Test onboarding with five Asana-using marketers | **Not started** |
| Phase 5 | Build the Asana-connected private alpha | **Not started** |
| Phase 6 | Make the private alpha safe for real teams | **Not started** |
| Phase 7 | Run the design-partner programme | **Not started** |
| Phase 8 | Prepare a focused go-to-market launch | **Not started** |

Update a phase to **In progress** when work begins and **Done** only when its completion conditions are met.

## Foundation — Product direction

**Status: Done**

- [x] Define the core problem MarketMap addresses.
- [x] Select B2B marketing teams as the initial customer context.
- [x] Keep the product focused on projects rather than tasks and subtasks.
- [x] Create the flow, year, and strategy prototype views.
- [x] Make Asana-first, AI-assisted onboarding the official MVP direction.
- [x] Confirm `Desktop\MarketMap` as the canonical local repository.
- [x] Synchronize the product documents with GitHub.

## Phase 1 — Define how the product works

**Status: In progress**

### Actions

- [x] Decide which Asana objects are imported in v1: projects only.
- [x] Define the exact Asana fields MarketMap reads.
- [x] Define the exact MarketMap fields AI returns.
- [x] Define how AI chooses the journey.
- [x] Define how AI chooses the primary and supporting funnel stages.
- [x] Define how AI chooses the project category and format/channel.
- [x] Define how dates and timing are interpreted.
- [x] Define the internal AI confidence rule and simple customer-facing result.
- [x] Decide which suggestions require marketer review.
- [x] Define how marketer corrections are saved and used for workspace learning.
- [ ] Define when MarketMap synchronizes with Asana.
- [ ] Define when AI is allowed to remap an existing project.

### Completion condition

Phase 1 is done when one written mapping contract clearly describes the information entering from Asana, the information returned by AI, the review rules, and the synchronization rules.

## Phase 2 — Test the mapping manually

**Status: Not started**

### Actions

- [ ] Collect approximately 20 real or safely anonymized Asana marketing projects.
- [ ] Run the proposed classification instructions against those projects.
- [ ] Compare the suggestions with senior-marketer judgment.
- [ ] Record incorrect and uncertain mappings.
- [ ] Improve the mapping instructions and rules.
- [ ] Confirm whether Asana contains enough useful project information.
- [ ] Measure the percentage of suggestions accepted without correction.

### Completion condition

Phase 2 is done when at least 80% of mapping suggestions are accepted without correction, or when we have enough evidence to revise the mapping approach before building it.

## Phase 3 — Design the onboarding journey

**Status: Not started**

### Actions

- [ ] Design account creation and the first workspace.
- [ ] Design the Connect Asana screen.
- [ ] Design Asana workspace and project selection.
- [ ] Design import progress in marketer-friendly language.
- [ ] Design the AI mapping-review screen.
- [ ] Explain uncertain suggestions without technical language.
- [ ] Make corrections fast and easy.
- [ ] Design the Create my map moment.
- [ ] Show the first useful gap, risk, overlap, or dependency.
- [ ] Design empty, incomplete, permission-denied, failed-import, and disconnected states.

### Completion condition

Phase 3 is done when the entire onboarding journey can be tested as a clickable prototype without explaining how it works to the participant.

## Phase 4 — Test with marketers

**Status: Not started**

### Actions

- [ ] Recruit five B2B marketers who currently use Asana.
- [ ] Understand their existing planning workflow before showing MarketMap.
- [ ] Test with 15–25 representative projects per participant.
- [ ] Measure time to first useful map.
- [ ] Record where participants become confused.
- [ ] Record every mapping correction and its reason.
- [ ] Check whether the map reveals a real planning insight.
- [ ] Ask whether they would use it in their next planning meeting.
- [ ] Ask for a concrete design-partner commitment.

### Completion condition

Phase 4 is done when the evidence shows whether onboarding is understandable, the map creates a useful decision or insight, and at least several participants want to use it with real work.

## Phase 5 — Build the private alpha

**Status: Not started**

### Actions

- [ ] Add user signup and login.
- [ ] Add isolated customer workspaces.
- [ ] Implement Asana OAuth securely.
- [ ] Import only the approved project-level fields.
- [ ] Add the MarketMap-owned OpenAI API connection on the server.
- [ ] Return structured suggestions with confidence and explanations.
- [ ] Build the mapping-review experience.
- [ ] Save approved mappings and marketer corrections.
- [ ] Populate the flow, year, and strategy maps from imported data.
- [ ] Add selective synchronization for new or materially changed Asana projects.
- [ ] Add connection and import error handling.
- [ ] Add AI usage limits and cost monitoring.

### Completion condition

Phase 5 is done when a real invited user can complete the Asana-to-map journey without manual technical intervention.

## Phase 6 — Make the alpha safe

**Status: Not started**

### Actions

- [ ] Explain what Asana data MarketMap reads and why.
- [ ] Store credentials and secrets securely.
- [ ] Verify that one customer's data cannot be accessed by another.
- [ ] Add Disconnect Asana.
- [ ] Add workspace and data deletion.
- [ ] Add data export.
- [ ] Add basic privacy policy and terms.
- [ ] Add backups and recovery checks.
- [ ] Add application error monitoring.
- [ ] Clearly label the product as a private alpha.

### Completion condition

Phase 6 is done when five design partners can use the product with clear consent, reliable data separation, recovery options, and an understood alpha support process.

## Phase 7 — Run the design-partner programme

**Status: Not started**

### Actions

- [ ] Onboard five teams personally.
- [ ] Observe use in real planning or reporting meetings where possible.
- [ ] Track whether maps remain current.
- [ ] Track decisions made with MarketMap.
- [ ] Record product objections and missing essentials.
- [ ] Confirm whether four teams return across two consecutive planning cycles.
- [ ] Ask at least three teams for a paid-pilot commitment.

### Completion condition

Phase 7 is done when recurring usage and willingness to pay are demonstrated, or when evidence shows that the product or target customer must change.

## Phase 8 — Prepare go-to-market

**Status: Not started**

### Actions

- [ ] Continue the LinkedIn build-in-public story as a supporting activity.
- [ ] Create a simple landing page focused on the concrete problem and outcome.
- [ ] Add a request-access form.
- [ ] Produce a short product demonstration.
- [ ] Publish real before-and-after planning examples.
- [ ] Define the design-partner pilot offer.
- [ ] Collect the first testimonial or case study.
- [ ] Define free-trial limits only after activation and cost behavior are understood.

### Completion condition

Phase 8 is done when MarketMap has a clear promise, proof from real users, a focused pilot offer, and one repeatable way to recruit suitable teams.

## Not now

- Integrations beyond Asana
- Tasks and subtasks
- AI chatbot or AI-generated marketing strategy
- Deep analytics and attribution
- Detailed budget management
- Publishing and marketing automation
- Complex enterprise permissions
- Native mobile editing
- A broad public free plan
- Extensive subscription infrastructure

## Overall decision gate

Do not expand MarketMap until the Asana-first workflow proves that teams can create a useful map quickly, use it during recurring planning, keep it current with little effort, and demonstrate willingness to pay.
