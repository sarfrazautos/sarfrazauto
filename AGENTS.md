<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


# Frontend & UI Guidelines

## Component Library (shadcn/ui)
- **Use shadcn/ui components by default**: Always prioritize shadcn/ui primitives.
- **Installing missing components**: If a component is not installed, install it using the CLI command:
  ```bash
  npx shadcn@latest add <component-name>
  ```
  *(Example: `npx shadcn@latest add button`)*

## Styling & Theme Rules
- **Color Theme**: Stick to the default shadcn/ui color theme and CSS variables. Do not alter or introduce custom conflicting color palettes.
- **Minimalist Aesthetic**:
  - **Shadows**: Avoid heavy box shadows; keep them minimal or flat.
  - **Borders & Radius**: Avoid exaggerated borders or excessive corner radius 
  - **Simplicity**: Keep the interface clean, lightweight, and breathable. Avoid heavy visual noise, cluttered layouts, or walls of text.

# Code Style Guidelines
- **Simplicity & Conciseness**: Write simple, straightforward, and minimal code. Avoid over-engineering or complex boilerplate.
- **JavaScript Only**: Do not use too much TypeScript, types, or interfaces; write simple and clean code Just use a normal simple syntax.
- **No Comments in Code**: Do not write comments inside the code files.