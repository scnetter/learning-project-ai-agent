import {ChatOpenAI} from "@langchain/openai";
import {env} from "../config/env.js";

export function createChatModel(): ChatOpenAI {
    return new ChatOpenAI({
        apiKey: env.openAIApiKey,
        model: "gpt-4.1-mini",
        temperature: 0,
    });
}