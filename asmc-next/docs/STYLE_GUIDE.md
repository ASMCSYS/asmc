# Code Style & Conventions

## Linting & Formatting
- ESLint config extends `next/core-web-vitals` and `plugin:prettier/recommended` (`eslintrc.json`).
- Prettier settings (`.prettierrc`):
  - `tabWidth: 4`, `semi: true`, `trailingComma: 'es5'`, `printWidth: 120`, `arrowParens: 'always'`.

## Naming
- Use descriptive names for variables and functions (avoid single letters).
- Components are PascalCase; hooks/functions are camelCase.
- File/Folder names reflect domain (e.g., `mastersApis`, `commonParser`).

## React & Next.js
- Prefer function components and hooks.
- Data fetching via RTK Query hooks in containers; pass data to presentational components.
- Keep components pure; avoid side effects in render.

## Redux Toolkit
- Keep UI state in slices; server data should live in RTK Query cache when possible.
- Use `transformResponse` to shape API responses close to UI needs.

## CSS/SCSS
- Global styles in `styles/style.scss`; prefer BEM-like classes for new styles.
- Avoid inline styles; co-locate SCSS with global styles when practical.

## Imports & Aliases
- Use `@/*` alias from `jsconfig.json`.
- Group imports: libs, utils, redux, components, local files.

## Commits & PRs
- Write clear commit messages (scope: summary). E.g., `booking: fix date validation on hall flow`.
- Small, focused PRs; include screenshots for UI changes.

## Comments
- Explain "why" over "what". Avoid redundant comments.

## Do & Don't
- Do handle loading and error states explicitly.
- Do centralize constants and shared logic in `utils/`.
- Don't duplicate API call logic; reuse RTK Query or axios wrappers.