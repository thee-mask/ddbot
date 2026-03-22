# Deriv Bot (DBot)

A web-based automated trading platform built with React that allows users to create and run trading bots without writing code. It uses a visual programming interface powered by Blockly.

## Architecture

- **Framework**: React 18 + TypeScript
- **Build Tool**: Rsbuild (v1.0.1-beta.1) backed by Rspack
- **State Management**: MobX + MobX-React-Lite
- **Visual Programming**: Blockly v10
- **Trading API**: @deriv/deriv-api
- **Styling**: Sass (SCSS)
- **Routing**: react-router-dom v6

## Project Structure

- `src/app/` - Core application, routing, global providers
- `src/pages/` - Main views: bot-builder, dashboard, chart, tutorials, free-bots
- `src/components/` - Reusable UI components
- `src/stores/` - MobX state stores (root-store pattern)
- `src/external/bot-skeleton/` - Trading engine + Blockly integration
- `public/` - Static assets, PWA manifest, bot XML templates

## Development

- **Start**: `npm start` (runs `./node_modules/.bin/rsbuild dev`)
- **Build**: `npm run build`
- **Port**: 5000

## Replit Configuration

- The `npm start` script uses a direct path `./node_modules/.bin/rsbuild dev` because the workflow shell doesn't automatically add `node_modules/.bin` to PATH
- The `prepare` (husky) script was removed to prevent issues during `npm install`
- Rsbuild is pinned to `1.0.1-beta.1` to use a compatible version of the rspack native binding (`1.0.0-alpha.3`) that works on this Replit environment
- Icon stubs were created for missing icons in `@deriv/quill-icons` v2.4.10 (the index file references files not included in that version)
- `HUSKY=0` environment variable prevents the husky git hooks from running during installs

## Known Warnings

- Sass deprecation warnings in `wallet.scss` (non-breaking, related to `if()` function syntax)
- Engine warning for `@deriv-com/analytics` (requires Node 18.x, running on Node 20.x — no functional impact)
