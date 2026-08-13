import {ChatPromptTemplate} from "@langchain/core/prompts";
import {z} from "zod";
import {createChatModel} from "../models/chatModels.js";

// use zod to create a schema for input validation
const ExplainConceptInputSchema = z.object({
    concept: z.string().min(2).max(120),
    audience: z.string().min(2).max(160)
});

type ExplainConceptInput = z.infer<typeof ExplainConceptInputSchema>;

const model = createChatModel();

const prompt = ChatPromptTemplate.fromMessages([
    [ 
        "system", "You explain technical topics accurately, directly, and with practical context."
    ],
    [
        "human", "Explain the {concept} for {audience}. Include why it matters in a production applications."
    ]
]);

const chain = prompt.pipe(model);

export async function explainConceptValidated(input: ExplainConceptInput): Promise<string> {
    const parsedInput = ExplainConceptInputSchema.parse(input);
    const response = await chain.invoke(parsedInput);
    
    if (typeof response.content !== "string") {
        throw new Error("Expected the model response content to be a string.");
    }

    return response.content;
}

