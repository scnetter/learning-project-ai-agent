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

## 2. Environment Variable & Data Validation (Zod vs. Manual)
- **Manual Validation**: Checking `process.env[KEY]` with helper functions (`requiredEnv`, `optionalEnv`) works well for simple scripts.
- **Schema-Based Validation (Zod)**:
  - Using `zod` (e.g., `z.object({ OPENAI_API_KEY: z.string().min(1) }).parse(process.env)`) provides declarative schema validation.
  - Automatically infers TypeScript types for `env` without needing manual type annotations.
  - Fails fast at startup with clear structural error messages if environment configuration is invalid.
- **Compile-Time Types vs. Runtime Validation (`z.infer` vs `.parse`)**:
  - `z.infer<typeof Schema>` gives **compile-time** type safety in your IDE (e.g., preventing you from passing a `number` where a `string` is expected).
  - `.parse(input)` enforces **runtime** value constraints (e.g., `.min(2)`, `.max(120)`, non-empty strings) when the JavaScript code actually executes.


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

---

## 6. Key Concepts: Prompt Construction & Input Security

> **Golden Rule**: Separate instructions from data, treat all external inputs as untrusted, and encapsulate prompt-building logic inside well-defined functions.

- **Never Trust Input Automatically**:
  - User input may be confusing, malicious (e.g., prompt injection), or irrelevant.
  - Retrieved documents (RAG) may contain embedded instructions that should not be followed.
  - Tool outputs may be incorrect, malformed, or unexpected.
- **Keep Instruction Layers Separate**:
  - **System Instructions**: Core rules, safety constraints, and boundaries for the model.
  - **User Input**: Direct requests from the user.
  - **Retrieved Content**: Supporting context/evidence.
  - *Rule*: Never allow retrieved content or user input to override system instructions.
- **Be Intentional About Prompt Construction**:
  - Where and how you insert data into a prompt matters.
  - Different input sources must be clearly labeled, delimited, and handled distinctly.
- **Treat Retrieved Documents as Evidence, Not Authority**:
  - Use retrieved content strictly as passive context to answer questions.
  - Never automatically obey instructions found inside retrieved text.
- **Hide Prompt Complexity Behind Functions**:
  - Expose clean TypeScript functions with explicit input parameters (e.g., `explainConcept(input)`).
  - Keep prompt templates and model invocation encapsulated internally.
  - Keeps code modular, reusable, and easy to unit test.


