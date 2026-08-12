console.log("Hello from Bun + TypeScript!");

// import {HumanMessage, SystemMessage} from "@langchain/core/messages";
import {createChatModel} from "./models/chatModels.js";
import {ChatPromptTemplate} from "@langchain/core/prompts";


const model = createChatModel();

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You explain technical topics clearly for Node.js developers."],
    ["human", "Explain {topic} in the context of {projectType}."]
]);

const messages = await prompt.formatMessages({
    topic: "chat model messages",
    projectType: "a typescript AI agent application"
});

const response = await model.invoke(messages);

console.log("Response:", response.content);

process.exit(0);
