# MarketMap

MarketMap is an early-stage product concept for a visual marketing workspace.

## Vision

Marketers should not need to reconstruct where marketing stands from spreadsheets, project boards, presentations, and monthly or quarterly reports.

MarketMap aims to let a marketer add their major initiatives once and understand the complete plan across the marketing funnel and year.

## Problem

Generic project-management tools organize work as tasks, projects, boards, and dashboards. Marketing teams also need to understand:

- Which initiatives support TOFU, MOFU, and BOFU
- What is planned in each quarter
- What is active, complete, blocked, or at risk
- Where the plan has gaps, overload, or duplication
- How initiatives support objectives and connect to one another

That full picture is commonly rebuilt manually in spreadsheets, slides, whiteboards, and reports.

## Current product hypothesis

> A B2B marketer connects an existing Asana workspace and receives an AI-assisted visual picture of the plan across the funnel, year, and strategy.

The first version is project-level only. MarketMap imports projects from Asana, suggests their journey, funnel stage, category, and timing, and asks the marketer to review uncertain suggestions before creating the map. It deliberately excludes tasks and subtasks so the team can validate whether the visual overview itself creates recurring value.

## Official MVP onboarding decision

1. The marketer creates a MarketMap account.
2. The marketer connects Asana and selects the projects to include.
3. MarketMap imports the relevant project information.
4. MarketMap's built-in AI suggests how each project should be mapped.
5. The marketer reviews uncertain suggestions and remains in control of the final placement.
6. MarketMap creates the flow, year, and strategy views from one shared project record.

The customer connects only Asana. The OpenAI API is an internal MarketMap service and is not connected or configured by the customer.

## Target customer hypothesis

Cross-functional B2B marketing teams managing multiple simultaneous campaigns, programs, launches, events, content initiatives, and other marketing projects.

This is not currently defined as a demand-generation-only product.

## Current phase

**Discovery and prototype validation.**

No public-launch or full-build decision has been made. The next milestone is evidence that experienced marketers can understand a realistic map quickly, discover useful planning insights, and want to use it in a real planning or reporting cycle.

## Product documentation

- [MVP definition](docs/MVP.md)
- [Asana-to-MarketMap mapping contract](docs/MAPPING_CONTRACT.md)
- [Validation plan](docs/VALIDATION.md)
- [Next steps](docs/NEXT_STEPS.md)
- [Product readiness review](PRODUCT_READINESS_REVIEW.md)
- [2025 calendar normalization review](docs/NORMALIZATION_REVIEW.md)
- [Normalized 2025 initiative dataset](data/normalized-initiatives-2025.json)

## Working principles

- The visual map is the product, not decoration over a generic project-management interface.
- Initiative-level clarity comes before task management.
- Funnel and quarter are two views of the same underlying initiatives.
- Asana remains the execution source; MarketMap is the visual planning and decision layer.
- AI reduces setup and maintenance, while marketers approve the resulting structure.
- Beauty earns attention; usefulness and low maintenance earn retention.
- Product decisions should be based on observed behavior and real planning artifacts.

## Repository status

Private product-discovery repository. Product name, positioning, scope, and visual language remain working hypotheses.
