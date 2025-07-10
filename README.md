# Trade-Pro: Multi Asset CFD Simulated Trading Platform

## Overview

This project is a comprehensive web-based Multi Asset CFD (Contract for Difference) simulated
trading platform. It enables users to practice trading strategies across multiple asset classes
without financial risk, with real-time market data simulation, advanced order management, analytics,
and educational tools.

## Key Features

- Real-time market data simulation (Yahoo Finance)
- Advanced order management (market, entry, TP, trailing stop)
- Comprehensive analytics and risk metrics
- Multi-device responsive design
- TradingView chart integration
- Social trading features (leaderboards, sharing)
- Educational resources

## Tech Stack

- React, TypeScript, Vite
- Tailwind CSS, Radix UI
- Supabase (auth, database, storage, real-time)
- TradingView chart widget
- Jest, Vitest, React Testing Library
- ESLint, Prettier, Husky, lint-staged

## Configuration

All configuration files are centralized in the `/config` directory, organized by tool (ESLint, Prettier, TypeScript, etc.). For detailed information about configuration structure, best practices, and usage, please refer to our [Configuration Guide](docs/CONFIGURATION.md).

Key configuration areas:

- Code Style & Linting: ESLint, Prettier
- TypeScript & Build: TypeScript, Vite
- Testing: Jest, Vitest
- Database: Supabase

- All configs are in `/config/` (eslint, jest, typescript, vite)
- Environment variables use `VITE_SUPABASE_*` for frontend
- Modular diagnostics scripts in `/scripts/diagnostics/`

## Getting Started

1. `npm install`
2. `npm run setup:all`
3. `npm run dev`

## Documentation

- See `docs/PRD.md` for product requirements
- See `SETUP.md` and `SUPABASE-CODESPACES.md` for environment setup
- See `docs/` for architecture, migration, and troubleshooting
