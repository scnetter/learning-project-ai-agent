import {ChatPromptTemplate} from "@langchain/core/prompts";
import {z} from "zod";
import {createChatModel} from "../models/chatModels.js";

const ClassifyInputSchema = z.object({
    message: z.string().min(10).max(5000)
});

const ClassificationSchema = z.object({
    category: z.enum(["billing", "technical", "account", "general"]),
    urgency: z.enum(["low", "medium", "high"]),
    summary: z.string().min(1),
    needsHumanReview: z.boolean()
});

type ClassifyInput = z.infer<typeof ClassifyInputSchema>;
type Classification = z.infer<typeof ClassificationSchema>;


const model = createChatModel().withStructuredOutput(ClassificationSchema);

const prompt = ChatPromptTemplate.fromMessages([
    [
        "system", "You classify suport messages for routing. Use the provided schema exactly."
    ],
    [
        "human", "Classify this suport message:\n\n{message}"
    ]
]);

const chain = prompt.pipe(model);

export async function classifySupportMessage(
    input: ClassifyInput
): Promise<Classification> {
    const parsedInput = ClassifyInputSchema.parse(input);
    return chain.invoke(parsedInput)
}


