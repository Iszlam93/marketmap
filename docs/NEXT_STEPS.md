# MarketMap Next Steps

**Status:** Active working checklist  
**Updated:** 1 September 2026

## Current objective

Build and validate one complete Asana-first onboarding journey that enables an experienced B2B marketer to move from connecting Asana to reviewing a useful visual marketing map in 20 minutes or less.

## Definition of success

The next milestone is achieved when a marketer can:

1. Create a MarketMap account.
2. Connect an Asana workspace securely.
3. Select the projects they want to map.
4. Receive sensible AI suggestions for journey, funnel stage, category, and timing.
5. Review only uncertain or incomplete suggestions.
6. Open the resulting flow, year, and strategy maps.
7. Identify at least one useful gap, risk, overlap, or dependency.

## To-do list

### 1. Define the mapping contract

- [ ] Decide which Asana objects are imported in v1: projects only.
- [ ] List the Asana fields MarketMap reads: name, description, dates, owner, status, tags, and selected custom fields.
- [ ] Define the MarketMap output fields: journey, primary stage, supporting stages, category, objective, timing, confidence, and explanation.
- [ ] Define what counts as high, medium, and low confidence.
- [ ] Decide which suggestions can be prefilled and which require review.
- [ ] Define how user corrections are saved and protected from unnecessary remapping.

### 2. Design the onboarding experience

- [ ] Create the signup and first-workspace screens.
- [ ] Create the Connect Asana screen.
- [ ] Let the user choose an Asana workspace and projects.
- [ ] Show import progress in marketer-friendly language.
- [ ] Create the mapping-review screen.
- [ ] Show why MarketMap made each uncertain suggestion.
- [ ] Provide a clear Create my map action.
- [ ] Design empty, permission-denied, incomplete-data, and failed-import states.

### 3. Validate before full automation

- [ ] Recruit the first five Asana-using B2B marketers.
- [ ] Ask them to show a real planning workflow before showing MarketMap.
- [ ] Use 15–25 real or safely anonymized Asana projects per test.
- [ ] Manually simulate AI suggestions where the integration is not ready.
- [ ] Measure time to first useful map.
- [ ] Record mapping corrections and reasons.
- [ ] Record whether the map reveals a real gap, risk, overlap, or dependency.
- [ ] Ask for a concrete design-partner commitment.

### 4. Build the private alpha

- [ ] Add authentication and isolated customer workspaces.
- [ ] Implement Asana OAuth securely.
- [ ] Import only the approved project fields.
- [ ] Add the MarketMap-owned OpenAI API connection on the server.
- [ ] Return structured mapping suggestions with confidence and explanations.
- [ ] Save approved mappings in the MarketMap database.
- [ ] Add selective synchronization for new or materially changed Asana projects.
- [ ] Add usage limits and cost monitoring for AI calls.
- [ ] Add basic error monitoring, export, and data deletion.

### 5. Run the design-partner alpha

- [ ] Onboard five teams with hands-on support.
- [ ] Observe use in real weekly, monthly, or quarterly planning meetings.
- [ ] Track whether maps remain current.
- [ ] Track recurring decisions made with MarketMap.
- [ ] Confirm whether at least four teams return across two consecutive planning cycles.
- [ ] Ask at least three teams for a paid pilot commitment.

## Not now

- Additional integrations such as monday.com, ClickUp, Jira, or Trello
- Tasks and subtasks
- AI-generated marketing strategy or campaigns
- Deep analytics and attribution
- Budget management
- Publishing and marketing automation
- Enterprise permissions
- Native mobile editing

## Decision gate

Do not expand the product until the Asana-first workflow proves that teams can create a useful map quickly, use it during recurring planning, keep it current with little effort, and demonstrate willingness to pay.
