import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createChatModel } from "../models/chatModels.js";

export type ExplainConceptInput = {
    concept: string;
    audience: string;
};

const model = createChatModel();

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You explain technical topics accurately and avoid unsupported claims."],
    ["human", "Explain the {concept} for {audience}. Keep the explanation practical."]
]);

const chain = prompt.pipe(model);

export async function explainConcept(input: ExplainConceptInput): Promise<string> {
    const response = await chain.invoke(input);
    
    if (typeof response.content !== "string") {
        throw new Error("Expected the model response content to be a string.");
    }
    return response.content;
}
