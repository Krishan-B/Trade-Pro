# Merge Proposal: Unifying Portfolio and Analytics Pages

## 1. Justification

Based on the detailed analysis in `Refactoring_Analysis.md`, a functional and data overlap of over 75% exists between the `PortfolioPage` and `PortfolioAnalyticsPage`. Merging these two pages is highly recommended to:

*   **Reduce Code Complexity:** Eliminate redundant components, hooks, and data-fetching logic.
*   **Improve UX:** Provide a single, cohesive view of portfolio performance and analytics, removing the need for users to navigate between two separate pages.
*   **Enhance Maintainability:** A single, unified component is easier to understand, debug, and extend in the future.
*   **Increase Performance:** Consolidating API calls will reduce network requests and improve data loading times.

## 2. Target Page Selection

*   **Target Page:** `PortfolioPage` (via `PortfolioContainer.tsx`)
*   **Deprecated Page:** `PortfolioAnalyticsPage.tsx`

The `PortfolioPage` will be enhanced to include the analytics features, making it the single source of truth for all portfolio-related information.

## 3. New Information Architecture

The analytics components will be integrated into the `PortfolioContainer` as a new "Analytics" tab or a dedicated section. A tabbed interface is recommended for a clean user experience.

**Proposed Layout (Tabbed Interface):**

```
[Portfolio Page]
  |
  +-- [Portfolio Summary]
  |
  +-- [Portfolio Metrics Cards]
  |
  +-- [Tabs: Overview | Analytics | Positions]
        |
        +-- [Overview Tab (Default)]
        |     |
        |     +-- [PerformanceChart]
        |     +-- [PortfolioSideSection (Allocation)]
        |
        +-- [Analytics Tab]
        |     |
        |     +-- [WinRatePieChart]
        |     +-- [PnLChart (can be the same as PerformanceChart)]
        |     +-- [AssetPerformanceList - Top]
        |     +-- [AssetPerformanceList - Worst]
        |
        +-- [Positions Tab]
              |
              +-- [PositionsSection (Open & Closed)]
```

## 4. Component Migration Plan

*   **Keep:**
    *   `PortfolioContainer.tsx` (will be modified)
    *   `PortfolioSummary.tsx`
    *   `PortfolioMetricsCards.tsx`
    *   `PerformanceChart.tsx`
    *   `PositionsSection.tsx`
    *   `PortfolioSideSection.tsx`
    *   `WinRatePieChart.tsx`
    *   `PnLChart.tsx`
    *   `AssetPerformanceList.tsx`
*   **Modify:**
    *   `PortfolioContainer.tsx`: Will be the main container for the merged page, incorporating the new tabbed layout and logic.
*   **Create:**
    *   A new `Tabs` component might be needed if a suitable one from the UI library isn't already in use.
*   **Deprecate:**
    *   `PortfolioAnalyticsPage.tsx`

## 5. Data & State Consolidation Strategy

1.  **Single Data Hook:** The `usePortfolioData` hook will be enhanced to become the single source of truth. It will fetch all necessary data currently retrieved by both `usePortfolioData` and `usePortfolioAnalytics`.
2.  **API Consolidation:** The backend Supabase function `portfolio-analytics` should be reviewed. Ideally, the primary portfolio data endpoint should return all the required data in a single call. If not, `usePortfolioData` will be responsible for making the necessary calls and consolidating the data.
3.  **State Unification:** All portfolio-related state (data, loading, error, etc.) will be managed by the `usePortfolioData` hook and passed down to the components. This eliminates state duplication and ensures data consistency across the unified page.