# Asana-to-MarketMap Mapping Contract

**Phase:** Phase 1 — Define how the product works

**Status:** In progress

**Approved:** 1 September 2026

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

## Example output

```text
Project: Payment Solution Webinar
Journey: Customer acquisition
Primary stage: Consideration
Supporting stage: Awareness
Category: Webinar
Objective: Educate prospective customers
Confidence: 86%
Reason: The webinar introduces the solution and helps prospects evaluate it.
```

## Decisions still required in Phase 1

- How AI chooses a project category
- How dates and timing are interpreted
- What high, medium, and low confidence mean
- Which suggestions require marketer review
- How marketer corrections are saved
- When MarketMap synchronizes with Asana
- When AI may remap an existing project
