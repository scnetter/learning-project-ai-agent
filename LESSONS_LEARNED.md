# AI Agent Project — Lessons Learned & Architecture Notes

This journal tracks key design decisions, technical insights, and takeaways while building this AI Agent project.

---

## 1. Runtime & Package Management (Bun vs. Node.js)
- **Native TypeScript Support**: Bun executes `.ts` files directly (`bun src/index.ts`) without requiring transpilers like `tsx` or `ts-node`.
- **Built-in Environment Loading**: Bun automatically loads `.env` files into `process.env` at startup—no manual `dotenv.config()` required.
- **Watch Mode vs. One-shot Execution**:
  - `bun --watch src/index.ts` keeps the process alive waiting for file changes (great for active development).
  - `bun src/index.ts` runs the script once and completes.
- **HTTP Keep-Alive & Process Exit**: LangChain's `ChatOpenAI` client keeps open HTTP sockets. Use `process.exit(0)` at the end of standalone scripts if immediate termination is needed.

---

## 2. Environment Variable Validation (Zod vs. Manual)
- **Manual Validation**: Checking `process.env[KEY]` with helper functions (`requiredEnv`, `optionalEnv`) works well for simple scripts.
- **Schema-Based Validation (Zod)**:
  - Using `zod` (e.g., `z.object({ OPENAI_API_KEY: z.string().min(1) }).parse(process.env)`) provides declarative schema validation.
  - Automatically infers TypeScript types for `env` without needing manual type annotations.
  - Fails fast at startup with clear structural error messages if environment configuration is invalid.

---

## 3. TypeScript & ES Module Import Resolution
- **`NodeNext` ESM Resolution**: Standard TypeScript and Node ESM require import specifiers to end in `.js` (e.g., `import { env } from "./config/env.js"`), even though the source file is `env.ts`. Bun handles `.js` paths natively.
- **`allowImportingTsExtensions` Option**: If explicitly using `.ts` in import specifiers, `tsconfig.json` requires both `"allowImportingTsExtensions": true` and `"noEmit": true`.

---

## 4. Agent Context & Workspace Rules (`GEMINI.md`)
- **Agent Rules**: Adding `GEMINI.md` to the project root allows the Antigravity agent (`agy`) to automatically discover project guidelines (such as using Bun instead of Node/npm) across all sessions.
- **Slash Commands**: Use `/learn` to store new rules and corrections directly into project memory.

---

## 5. Core Architectural Principle: Validate Data at System Boundaries
- **Boundary Validation Rule**: Whenever untrusted data crosses a boundary into your application logic, validate its shape and content immediately using explicit schemas (e.g. Zod).
- **Key System Boundaries in AI Agent Architecture**:
  1. **OS → Application**: Environment variables validated at startup via Zod schemas (`src/config/env.ts`).
  2. **Model → Tool Execution**: Tool arguments produced by the LLM validated via Zod schemas before executing local functions.
  3. **Model → Application State**: Structured LLM outputs validated via schemas (`.withStructuredOutput()`) to guarantee expected types.
  4. **Storage / External APIs → Prompt Context**: Vector search results and external API responses validated before being injected into prompt templates.

