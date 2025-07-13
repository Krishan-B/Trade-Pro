# Refactoring Analysis: Portfolio vs. Analytics Pages

## 1. Core Purpose & User Stories

### Portfolio Page (`Portfolio.tsx` -> `PortfolioContainer.tsx`)

*   **Core Purpose:** To provide a comprehensive, real-time snapshot of the user's entire investment portfolio. It serves as the main dashboard for portfolio management.
*   **User Stories:**
    *   As a user, I want to see the total value of my portfolio, my available cash, and my overall profit or loss at a glance.
    *   As a user, I want to view a list of all my current investment positions (assets) and their performance.
    *   As a user, I want to see a historical performance chart of my portfolio's value over different timeframes.
    *   As a user, I want to track key performance indicators (KPIs) like win rate and profit factor.
    *   As a user, I want to view my closed positions to review my trading history.

### Analytics Page (`PortfolioAnalyticsPage.tsx`)

*   **Core Purpose:** To offer a more focused, in-depth analysis of portfolio performance, highlighting historical trends and identifying key contributors to gains and losses.
*   **User Stories:**
    *   As a user, I want to visualize my win rate to understand the success ratio of my trades.
    *   As a user, I want to see a chart of my cumulative profit and loss over time to track my long-term performance.
    *   As a user, I want to quickly identify my best and worst-performing assets to inform my strategy.

## 2. UI Components & Layout

| Component/Feature | Portfolio Page | Analytics Page | Shared/Similar |
| :--- | :--- | :--- | :--- |
| **Layout** | Multi-section dashboard | Grid of cards | Both use `Card` components |
| **PnL Chart** | `PerformanceChart` | `PnLChart` | **Yes (High Similarity)** |
| **Win Rate Display**| Metric in `PortfolioMetricsCards` | `WinRatePieChart` | **Yes** |
| **Asset List** | `PositionsSection` (all assets) | `AssetPerformanceList` (top/worst) | **Yes (Different views of same data)** |
| **Summary Metrics** | `PortfolioSummary`, `PortfolioMetricsCards` | N/A | No |
| **Allocation Chart**| `PortfolioSideSection` | N/A | No |
| **Data Loading/Error**| Custom components | `Skeleton` components | Both handle these states |

## 3. Data Sources & API Endpoints

| Data Aspect | Portfolio Page | Analytics Page | Shared/Similar |
| :--- | :--- | :--- | :--- |
| **Primary Hook** | `usePortfolioData` | `usePortfolioAnalytics` | **Yes (Hooks fetch overlapping data)** |
| **API Endpoint** | Likely a comprehensive portfolio endpoint | `supabase.functions.invoke('portfolio-analytics')` | **Yes (High Overlap)** |
| **Data Points** | | | |
| - Win Rate | **Yes** | **Yes** | **Yes** |
| - PnL History | **Yes** (`performanceData`) | **Yes** (`pnl_history`) | **Yes** |
| - Asset Performance| **Yes** (inferred from `assets`) | **Yes** (`top_performers`, `worst_performers`) | **Yes** |
| - Total Value | **Yes** | **Yes** | **Yes** |
| - Balances | **Yes** | **Yes** | **Yes** |

The `usePortfolioAnalytics` hook fetches a `PortfolioAnalytics` object which contains many of the same fields as the data fetched by `usePortfolioData`. This indicates a high level of data source redundancy.

## 4. State Management

*   **Portfolio Page:** State is primarily managed within the `usePortfolioData` hook (which uses `react-query`). Local state is minimal (`timeframe`).
*   **Analytics Page:** State is managed entirely within the `usePortfolioAnalytics` hook (also using `react-query`). There is no local component state.
*   **Conclusion:** Both pages use the same state management strategy (`react-query`) to handle server state (fetching, caching, etc.).

## 5. Business Logic & User Flows

*   **Portfolio Page:**
    *   Checks for user authentication.
    *   Handles loading and error states for a large dataset.
    *   Allows the user to change the timeframe for the performance chart.
    *   Provides actions like "Export" and "View Tax Events".
    *   Navigates to asset details.
*   **Analytics Page:**
    *   Fetches a specific slice of analytics data.
    *   Handles loading and error states.
    *   Displays data in specialized chart components.

The business logic is largely centered around fetching and displaying data. The logic in the Analytics Page is a subset of the logic that would be required for a comprehensive portfolio view.

## 6. Conclusion & Overlap Score

The analysis reveals a significant degree of overlap between the two pages. The `PortfolioAnalyticsPage` is essentially a specialized "detail view" of data that is already present or could be easily derived on the main `PortfolioPage`.

*   **Data Overlap:** 80-90%
*   **Functional Overlap:** 70-80%

**Overall Estimated Overlap: > 75%**

A merge is highly recommended.