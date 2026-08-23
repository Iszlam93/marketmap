# 2025 Calendar Normalization Review

**Status:** Draft for founder review

## Purpose

This review converts the real `Marketing - Calendar ISV 2025.xlsx` planning artifact into initiative-level data for the first MarketMap prototype.

The source workbook itself is not stored in the repository. The normalized JSON keeps cell-range traceability without copying the original document.

## Result

- 17 candidate initiatives
- 10 initiatives with a suggested TOFU, MOFU, or BOFU stage
- 7 initiatives intentionally kept outside the acquisition funnel
- 0 owners inferred because ownership was not reliably available in the extracted source values
- All historical statuses require review because the source has no reliable legend for its green and amber markers

## Candidate initiatives

| ID | Initiative | Suggested context | Period | Confidence |
|---|---|---|---|---|
| 001 | Price Increase Campaign | Retention/Expansion | Q1 | High |
| 002 | Technical Services Awareness and Prospecting | TOFU | Q1–Q3 | High |
| 003 | Technical Services Partner Recruitment | BOFU | Q3 | Medium |
| 004 | Let Me Introduce Myself Campaign | TOFU | Q3 | Low |
| 005 | Solution Marketplace Partner Adoption | Activation/Adoption | Q1 | High |
| 006 | ISV Connect Event | MOFU | Q1–Q2 | High |
| 007 | ISV Partner Portal Content and Expansion | Activation/Enablement | Q2–Q3 | Medium |
| 008 | Marketing Services Promotion and Delivery | MOFU | Q1–Q4 | Medium |
| 009 | Global Reach with Companial and Seer 365 | MOFU | Q2 | High |
| 010 | B2B Software Growth Academy Webinar | MOFU | Q3 | High |
| 011 | Strategy and Action Plan Webinar | MOFU | Q3 | High |
| 012 | LinkedIn Strategy Webinar | MOFU | Q4 | High |
| 013 | Product Management Webinar Idea | MOFU | Unscheduled | Medium |
| 014 | Partner Marketing Education Content Plan | Retention/Enablement | Q3 | Medium |
| 015 | ISV Partner and Marketing Services Survey | Research/Insight | Q3 | High |
| 016 | Solution Marketplace Performance Reporting | Measurement/Operations | Q2–Q4 | High |
| 017 | 2026 Marketing Delivery Planning | Internal Planning | Q3–Q4 | High |

## Product insight: the funnel is necessary but insufficient

The calendar confirms that TOFU, MOFU, and BOFU are useful for acquisition initiatives, but a real marketing plan also contains:

- Retention and expansion
- Partner activation and enablement
- Customer or partner research
- Measurement and reporting
- Internal marketing operations

Forcing those initiatives into the acquisition funnel would create a misleading picture. The prototype should therefore show the funnel as the primary landscape while providing an explicit place for non-funnel initiatives—such as a supporting orbit, operations layer, or separate journey context.

This is a hypothesis to test, not a final interface decision.

## What the simulated AI did

1. Identified likely parent initiatives from category and campaign rows.
2. Grouped channel, audience, content, and delivery rows as supporting activities.
3. Merged repeated initiatives found in the full-year and H2 sheets.
4. Converted calendar markers into dates where the header mapping was clear.
5. Suggested funnel stages only where the initiative meaning supported them.
6. Added confidence levels and review flags for ambiguous interpretations.

## Decisions needed before prototype design

Please review these questions:

1. Are the full-year and H2 technical-services campaigns one initiative or separate campaigns?
2. Is Technical Services Partner Recruitment separate from the awareness campaign?
3. What was the purpose of the “Let Me Introduce Myself” campaign?
4. Should Partner Marketing Education remain inside the Partner Portal program?
5. Is Marketing Services one ongoing program or multiple separate campaigns?
6. Should the 2026 marketing-services price change be separate from delivery planning?
7. What did green and amber calendar markers mean?

## Prototype recommendation

Use all 17 initiatives in the first realistic prototype. The mixture is valuable because it tests whether MarketMap can remain understandable when a plan contains acquisition, lifecycle, research, reporting, and internal work—not just idealized campaigns.
