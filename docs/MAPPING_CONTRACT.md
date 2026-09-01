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

- How AI chooses the journey
- How AI chooses primary and supporting funnel stages
- How AI chooses a project category
- How dates and timing are interpreted
- What high, medium, and low confidence mean
- Which suggestions require marketer review
- How marketer corrections are saved
- When MarketMap synchronizes with Asana
- When AI may remap an existing project
