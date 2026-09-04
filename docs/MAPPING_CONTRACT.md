# Asana-to-MarketMap Mapping Contract

**Phase:** Phase 1 — Define how the product works

**Status:** Complete

**Approved:** 4 September 2026

## Purpose

This contract defines what MarketMap reads from Asana and what MarketMap's built-in AI may suggest. It keeps the first version focused on project-level planning and keeps the marketer in control of the final map.

## Approved Asana scope

MarketMap imports **Asana projects only** in the MVP.

MarketMap does not import or manage tasks and subtasks as planning objects.

## Approved Asana fields

MarketMap may read:

- Project name
- Project description
- Start date
- Due date
- Project owner
- Current status
- Tags
- Relevant custom fields
- Direct Asana project link

## Excluded Asana information

MarketMap does not read for the MVP:

- Tasks
- Subtasks
- Comments
- Conversations
- Attachments
- Private messages

These exclusions reduce unnecessary access and preserve MarketMap's project-level focus.

## Approved AI suggestions

Using the approved Asana project information, MarketMap AI may suggest:

- Journey
- Primary funnel stage
- Supporting funnel stages, when relevant
- Project category
- Format or channel
- Short objective summary
- Timing interpretation
- Confidence level
- Plain-language explanation for the suggested placement

## Information AI must not invent

AI must not invent:

- Project owner
- Start date or due date
- Current project status
- KPI

If this information is unavailable in Asana, MarketMap marks it as missing and asks the marketer to review it.

## Approved journey creation

Journeys are organization-specific groupings such as a product line, audience, market, service, or customer motion.

During onboarding:

1. MarketMap reviews the selected Asana projects.
2. AI suggests a small number of journey groups.
3. The marketer can rename, remove, or add journeys.
4. The marketer approves the journey list.
5. AI places projects into the approved journeys.

AI must not create or rename journeys after this approval without asking the marketer. If a project does not fit an approved journey with sufficient confidence, MarketMap marks its journey as needing review.

## Approved funnel-stage placement

MarketMap starts with three default stages:

- Awareness
- Consideration
- Action

The marketer may rename these stages. AI chooses placement according to the project's intended effect on the audience rather than using its format alone.

Every mapped project has one primary stage. It may also have a supporting stage when its objective genuinely spans more than one part of the funnel.

- A single-stage project appears inside that stage.
- A project supporting two stages appears between those stages as one project card, not as duplicates.
- A project that does not belong in the funnel appears in an Outside funnel area.
- A project with insufficient information is marked Needs review rather than being assigned through guesswork.

Example:

```text
Project: Industry webinar
Primary stage: Consideration
Supporting stage: Awareness
Visual placement: Between Awareness and Consideration
```

## Approved category and format/channel structure

MarketMap uses two fields so that the type of project is not confused with how or where it is delivered.

### Project category

- Campaign
- Content
- Event
- Programme
- Product launch
- Partnership
- Website or digital experience
- Internal or operational
- Other

### Format or channel

- Paid ads
- Online event
- Onsite event
- Email
- Organic social
- Website
- Partner channel
- Multi-channel
- Not applicable

AI chooses from the marketer's approved lists and must not silently create a new value. The marketer may rename the values and configure their visual colours.

Across MarketMap views:

- Funnel stage controls the project's position.
- Project category controls the main card colour and category label.
- Format or channel appears as a visible badge.
- A project that cannot be classified reliably is marked Other — needs review.

Examples:

```text
Project: Google Search Campaign
Category: Campaign
Format or channel: Paid ads

Project: Customer Webinar
Category: Event
Format or channel: Online event

Project: Industry Exhibition
Category: Event
Format or channel: Onsite event
```

## Approved timing interpretation

MarketMap normally calculates timing directly from Asana without AI.

- Start and due dates come from Asana.
- MarketMap calculates the relevant weeks, quarter, and duration.
- AI must never invent exact dates.
- When both dates exist, MarketMap shows the full project duration.
- When only the due date exists, MarketMap shows the deadline week and flags Start date missing.
- When only the start date exists, MarketMap shows when the project begins and flags End date missing.
- When neither date exists, MarketMap places the project under Unscheduled and requests review.
- A project crossing the selected planning year is shown as continuing from the previous year or into the next year.
- If the Asana description contains broad timing such as Launch in Q3, AI may suggest that period, but the marketer must approve it before MarketMap treats it as official timing.

Example:

```text
Asana start date: 10 March
Asana due date: 28 March
MarketMap quarter: Q1
MarketMap active weeks: Week 11–13
Source: Confirmed from Asana
```

## Approved confidence and review experience

MarketMap keeps technical AI confidence hidden from the marketer. The onboarding experience uses only two clear groups:

### Mapped for you

The available project information clearly supports the suggested journey, stage, category, and format/channel. MarketMap places the project on the draft map automatically. The marketer can still review and change it.

### Needs your help

The project information is missing, unclear, contradictory, or supports more than one reasonable interpretation. MarketMap does not guess. The marketer is asked to complete or choose the unclear fields.

The onboarding summary uses plain language, for example:

```text
We found 40 projects.
34 have been mapped for you.
6 need your help.
```

Internal confidence may be stored for product logic and quality monitoring, but MarketMap does not show technical percentages or high, medium, and low labels to customers.

A project is added to Needs your help when any essential placement field cannot be suggested reliably. MarketMap provides a short explanation based on the available Asana information. Every automatically mapped project remains editable.

## Approved correction and workspace-learning rules

The marketer's correction always becomes the final decision for that project. MarketMap also uses approved corrections to improve future suggestions for the same workspace.

For every correction, MarketMap stores:

- The original AI suggestion
- The marketer's approved value
- The relevant project wording and context used as a reusable example
- The affected journey, stage, category, or format/channel field
- The time of the correction

When MarketMap receives a similar project later, it provides relevant previous corrections as examples for the next AI mapping request. Repeated corrections can become stronger workspace-specific preferences.

The correction experience includes a selected-by-default option:

> Remember this choice for similar projects

Learning boundaries:

- Learning remains private to the customer's workspace.
- One customer's corrections do not influence another customer's map.
- A manual decision is never overwritten automatically.
- The marketer can view, change, or delete learned preferences.
- The marketer can reset workspace learning.
- Customer corrections are not automatically used to train an external shared model.

For the MVP, MarketMap learns through stored workspace examples and preferences rather than training a separate AI model for each customer.

## Approved Asana synchronization

- MarketMap performs a complete import when Asana is first connected.
- MarketMap checks for updates when the marketer opens the product, but no more than once every 24 hours.
- The marketer can select Sync now at any time.
- Asana remains the source of truth for project name, owner, dates, and status, so those factual fields update automatically.
- New Asana projects receive mapping suggestions using the workspace's approved journeys, taxonomy, and learned corrections.
- A removed or archived Asana project is labelled No longer active in Asana rather than being deleted immediately.
- MarketMap-specific journeys, stages, relationships, and learned corrections remain protected during synchronization.
- AI does not run again when no strategically important information has changed.

## Approved remapping rules

MarketMap never replaces a marketer-approved placement automatically.

When a project's important wording or context changes in Asana, MarketMap displays:

> This project changed in Asana. Review its placement?

AI produces a new suggestion only after the marketer approves that review or manually selects Suggest placement again. Factual Asana updates such as dates, owner, and status do not trigger remapping by themselves.

## Example output

```text
Project: Payment Solution Webinar
Journey: Customer acquisition
Primary stage: Consideration
Supporting stage: Awareness
Category: Event
Format or channel: Online event
Objective: Educate prospective customers
Review result: Mapped for you
Reason: The webinar introduces the solution and helps prospects evaluate it.
```

## Phase 1 result

The Asana-to-MarketMap mapping contract is complete and ready for manual testing in Phase 2.
