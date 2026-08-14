import { explainConcept } from "./agents/conceptExplainer.js";
import { classifySupportMessage } from "./agents/classifySupportMessage.js";

// console.log("Running concept explainer agent...");

// const explanation = await explainConcept({
//     concept: "Prompt Templates in LangChain",
//     audience: "junior TypeScript developers"
// });

const classifiedMessage = await classifySupportMessage({message: "I am having trouble logging into my account and need help resetting my password."});

console.log("\n--- Classified Message ---");
console.log(classifiedMessage);

process.exit(0);
