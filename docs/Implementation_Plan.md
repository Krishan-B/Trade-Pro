# Step-by-Step Implementation Plan

This document outlines the phased implementation plan for the new "Markets Page" feature.

## Phase 1: Backend & Data Layer

*   **Objective**: Build the data foundation for the new feature.
*   **Tasks**:
    1.  Create the new Supabase edge function at `supabase/functions/get-market-data-new/`.
    2.  Implement the data fetching logic from the Yahoo Finance API, including request batching and API key management.
    3.  Implement the 5-minute caching mechanism.
    4.  Implement the data transformation logic to calculate `buy_price` and `sell_price`.
    5.  Write unit tests for the data transformation logic.
    6.  Manually test the API endpoint using a tool like Postman or cURL.

## Phase 2: Frontend Development (Component Scaffolding)

*   **Objective**: Build the UI components with mock data.
*   **Tasks**:
    1.  Create the new `src/components/markets_new/` directory.
    2.  Build the `AssetRow` component with mock data.
    3.  Build the `MarketsTable` component, which will render a list of `AssetRow` components.
    4.  Build the `AssetClassSection` component, which will contain the `MarketsTable`.
    5.  Build the main `MarketsPage` component, which will assemble the `AssetClassSection` components.
    6.  Write unit tests for each component.

## Phase 3: Integration & State Management

*   **Objective**: Connect the frontend to the backend and manage application state.
*   **Tasks**:
    1.  Integrate **React Query** into the application.
    2.  Connect the `AssetClassSection` components to the new `/api/get-market-data-new` endpoint to fetch real data.
    3.  Implement **Zustand** for managing the user's watchlist state.
    4.  Ensure real-time data flows correctly and the UI updates smoothly.
    5.  Write integration tests to verify the connection between the frontend and backend.

## Phase 4: Watchlist Functionality

*   **Objective**: Implement the "MyWatchList" feature.
*   **Tasks**:
    1.  Create the `watchlist` table in the Supabase database as per the schema.
    2.  Implement the `AddToWatchlistButton` component's logic to add/remove assets from the watchlist.
    3.  Connect the button to the Zustand store and the Supabase database.
    4.  Update the UI to reflect the user's watchlist.
    5.  Write E2E tests for the watchlist functionality.

## Phase 5: Testing & Deployment

*   **Objective**: Ensure a high-quality, bug-free release.
*   **Tasks**:
    1.  Conduct a thorough QA cycle, including manual testing of all user stories and acceptance criteria.
    2.  Perform performance testing to ensure the page is fast and responsive under load.
    3.  Implement the feature flag and deploy the new Markets Page to a staging environment.
    4.  Begin a staged rollout to production.
    5.  Monitor for any issues and be prepared to roll back if necessary.
    6.  Once the rollout is complete and stable, remove the old code and the feature flag.