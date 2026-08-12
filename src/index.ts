console.log("Hello from Bun + TypeScript!");

// import {HumanMessage, SystemMessage} from "@langchain/core/messages";
import {createChatModel} from "./models/chatModels.js";
import {ChatPromptTemplate} from "@langchain/core/prompts";


const model = createChatModel();

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a precise assistant for backend TypeScript development."],
    ["human", "Give a concise explanation of {concept}"]
]);

const chain = prompt.pipe(model);

const response = await chain.invoke({
    concept: "prompt templates in LangChain.js"
})

console.log("Response:", response.content);

process.exit(0);
