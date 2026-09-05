# Phase 2 Source Comparison Test

**Status:** In progress

**Started:** 5 September 2026

## Objective

Test two separate questions using the same 10 marketing projects:

1. Can MarketMap receive complete and correct project information from Asana, Excel, and Google Sheets?
2. Can MarketMap interpret that information and create useful mapping suggestions?

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

The controlled source records are ready in Asana. The local spreadsheet-authoring runtime and the Google Drive import connection were unavailable in the current session, so the matching Excel and native Google Sheets artifacts remain pending rather than being created through an unsupported workaround.
