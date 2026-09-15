# Arcadran UI

- Read README.md and docs/repository-audit.md before changing the public component scope.
- Keep @arcadran/design-system authoritative for tokens, assets and base styles. UI additions use ar- selectors and existing tokens.
- Never add product APIs, session logic, credentials or provider SDKs to components.
- Preserve Vue SSR compatibility; browser APIs belong in lifecycle hooks/events, never module initialization.
- Every component has a real gallery example. Run pnpm check; run pnpm test:browser after interaction or layout changes.
- Do not migrate or deploy sibling repositories unless requested. Do not publish the package automatically.
- Add components from demonstrated shared needs; see the audit backlog. Avoid speculative adapters and large framework dependencies.
