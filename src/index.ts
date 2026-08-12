console.log("Hello from Bun + TypeScript!");

import {HumanMessage, SystemMessage} from "@langchain/core/messages";
import {createChatModel} from "./models/chatModels.js";

const model = createChatModel();

const response = await model.invoke([
    new SystemMessage("You are a concise assistant for a TypeScript agent application."),
    new HumanMessage("Summarize what a production AI agent needs in one sentence.")
]);

console.log("Response:", response.content);

process.exit(0);
