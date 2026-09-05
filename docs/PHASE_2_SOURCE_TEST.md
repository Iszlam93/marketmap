# Phase 2 Source Comparison Test

**Status:** In progress

**Started:** 5 September 2026

## Objective

Test two separate questions using the same 10 marketing projects:

1. Can MarketMap receive complete and correct project information from Asana, Excel, and Google Sheets?
2. Can MarketMap interpret that information and create useful mapping suggestions?

## Approved test order

Sources are tested sequentially rather than in parallel:

1. **Asana:** Complete the connection, field, and mapping test first.
2. **Excel:** Start only after the Asana result is documented.
3. **Google Sheets:** Start only after the Excel result is documented.

Each source must reach a clear pass, revise, or stop decision before work begins on the next source.

## Controlled test set

The following private projects were created in the Asana `My workspace` team. Every name is prefixed with `MarketMap Test` to distinguish test data from normal work.

| # | Project | Timing case | Purpose in the test |
|---|---|---|---|
| 01 | Price Increase Campaign | Complete dates | Retention work outside the acquisition funnel |
| 02 | Technical Services Awareness and Prospecting Campaign | Complete, long duration | Awareness and multi-channel work |
| 03 | Technical Services Partner Recruitment Campaign | No dates | Action-oriented partner recruitment with incomplete information |
| 04 | Let Me Introduce Myself Campaign | No dates | Deliberately ambiguous project that should need help |
| 05 | Solution Marketplace Partner Adoption | No dates | Existing-partner adoption outside acquisition |
| 06 | ISV Connect Event | Complete dates | Onsite event |
| 07 | ISV Partner Portal Content and Expansion Programme | Complete dates | Content programme and partner enablement |
| 08 | Marketing Services Promotion and Delivery Programme | Complete, long duration | Multi-channel and multi-stage programme |
| 09 | Accelerating Global Reach Webinar | Complete dates | Online event |
| 10 | Technical Services Paid Search Campaign | Complete dates | Paid advertising and action-oriented traffic |

## Source comparison

| Source | Test method | Status |
|---|---|---|
| Asana | Ten private projects created and verified through the connected Asana account | **Test data ready** |
| Excel | Create one structured workbook containing the identical ten records | Pending |
| Google Sheets | Import the verified workbook as a native Google Sheet | Pending |

## Source decision gates

### Asana gate — current

- Ten controlled projects exist.
- Authenticated create and read access works.
- Key imported fields have been inspected.
- Mapping suggestions, marketer review, and acceptance measurement remain to be completed.

Do not begin the Excel test until the Asana mapping result is reviewed.

### Excel gate

Create, import, map, review, and score the identical 10 records. Do not begin Google Sheets until the Excel result is reviewed.

### Google Sheets gate

Create or import the identical 10 records, map them, review them, and score the result. Then compare all three sources.

## Initial Asana connection result

The connected account successfully created and read all 10 controlled projects. A detailed check of complete, undated, and ambiguous examples returned:

| Approved field | Initial result |
|---|---|
| Project name | Received correctly |
| Description | Received correctly through Asana project notes |
| Start date | Received when present; null when deliberately omitted |
| Due date | Received when present; null when deliberately omitted |
| Owner | Received correctly |
| Current status | Field is available but empty on the controlled projects |
| Custom fields | Field is available but no custom fields are configured on the controlled projects |
| Direct project link | Received correctly |
| Tags | Not observed at project level in the initial result; requires a specific product decision or alternate Asana structure |

This proves basic authenticated project creation and read access. It does not yet prove MarketMap's production OAuth implementation, which remains part of the private-alpha build.

## Fields to compare

- Project name
- Description
- Start date
- Due date
- Owner
- Status
- Tags
- Relevant custom fields
- Source project link

## Results to record

- Projects discovered
- Fields imported correctly
- Fields missing from the source
- Fields changed during import
- Projects mapped for the marketer
- Projects needing the marketer's help
- Corrections required
- Time to first useful map
- Mapping acceptance rate

## Current limitation

The controlled source records are ready in Asana. Excel and Google Sheets work is intentionally deferred until the Asana decision gate is complete. The local spreadsheet-authoring runtime and Google Drive import connection will be checked again only when their respective test stages begin.
