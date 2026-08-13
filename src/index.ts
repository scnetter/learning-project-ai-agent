import { explainConcept } from "./agents/conceptExplainer.js";

console.log("Running concept explainer agent...");

const explanation = await explainConcept({
    concept: "Prompt Templates in LangChain",
    audience: "junior TypeScript developers"
});

console.log("\n--- Explanation ---");
console.log(explanation);

process.exit(0);
