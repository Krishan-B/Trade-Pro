# Codebase Refactoring & Migration Plan

This document outlines the strategy for refactoring the existing "Markets Page" codebase and migrating to the new architecture.

## 1. Audit of Existing Code

The first step is to audit the existing code in `src/components/markets/` and the `supabase/functions/fetch-market-data/` edge function.

*   **`src/components/markets/`**:
    *   **Objective**: Identify any reusable UI components, styling, or utility functions.
    *   **Action**: Create a new directory `src/components/markets_new/` to house the new modular components. The existing components in `src/components/markets/` will be deprecated and eventually removed.
*   **`supabase/functions/fetch-market-data/`**:
    *   **Objective**: The existing function is fundamentally flawed (fetches single symbols, lacks correct data transformation). It will be completely replaced.
    *   **Action**: A new edge function will be created at `supabase/functions/get-market-data-new/`. The old function will be deprecated and removed after the new one is fully tested and integrated.

## 2. Deprecation Strategy

We will follow a phased deprecation strategy to minimize disruption.

1.  **Build the New Components**: Develop the new `MarketsPage`, `AssetClassSection`, `MarketsTable`, `AssetRow`, and `AddToWatchlistButton` components in the `src/components/markets_new/` directory.
2.  **Develop the New Edge Function**: Create the new `get-market-data-new` edge function with batching, caching, and the correct data transformation logic.
3.  **Feature Flagging**: The new Markets Page will be introduced into the application behind a feature flag. This will allow us to test the new implementation in production with a limited audience before a full rollout.
4.  **Staged Rollout**: Once the new implementation is validated, we will gradually roll it out to all users.
5.  **Removal of Old Code**: After the new Markets Page has been successfully rolled out to 100% of users and has been stable for a designated period (e.g., one week), the old components in `src/components/markets/` and the old `fetch-market-data` edge function will be deleted.

## 3. Integration Plan

The new `MarketsPage` will be integrated into the main application's routing and navigation.

*   The main navigation link that previously pointed to the old markets page will be updated to point to the new `MarketsPage` component.
*   The feature flag will control which version of the page is rendered.

This phased approach ensures that we can build and test the new implementation in isolation, without affecting the existing application until we are confident in its stability and performance.