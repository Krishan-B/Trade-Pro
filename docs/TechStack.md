# Tech Stack

This document outlines the technology stack used in the Trade-Pro application.

## Frontend

*   **Framework:** [React](https://reactjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
*   **Charting:** [TradingView Advanced Charts](https://www.tradingview.com/HTML5-stock-forex-bitcoin-charting-library/)
*   **State Management:** React Context API (inferred from `TradingContext.tsx` and `TradePanelProvider.tsx`)
*   **Routing:** (Not explicitly defined, but likely `react-router-dom` for a standard React application)

## Backend

*   **Platform:** [Supabase](https://supabase.io/)
    *   **Database:** [PostgreSQL](https://www.postgresql.org/)
    *   **Authentication:** Supabase Auth
    *   **Serverless Functions:** Supabase Functions (Deno runtime)
    *   **Storage:** Supabase Storage

## Integrations

*   **Data Fetching:** Serverless functions (`fetch-market-data`, `fetch-market-news`) are used to interact with external market data APIs.

## Development

*   **Package Manager:** npm
*   **Linting:** [ESLint](https://eslint.org/)
