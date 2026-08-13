import {ChatPromptTemplate} from "@langchain/core/prompts";
import {StringOutputParser} from "@langchain/core/output_parsers";
import {createChatModel} from "../models/chatModels.js";
import {z} from "zod";

const model = createChatModel();

// This is a simple version that doesn't do validation. It is commented out because it is not used in the project, but it is left here for reference.
// const prompt = ChatPromptTemplate.fromMessages([
//     ["system", "You summarize support messages clearly and presevrve the main issue."],
//     ["human", "Summarize this message in two sentences:\n\n{message}"]
// ]);

// const chain = prompt.pipe(model).pipe(new StringOutputParser());

// export async function summarizeSupportMessage(message: string): Promise<string> {
//     // shorthand for { message: message }
//     return chain.invoke({ message });
// }

// This is a version that does validation using zod. It is used in the project.
const SummarizeInputSchema = z.object({
    message: z.string().min(10).max(5000)
});

type SummarizeInput = z.infer<typeof SummarizeInputSchema>;

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You summarize support messages clearly. Preserve the issue, affected feature, and requested outcome when present."],
    ["human", "Summarize this message in two sentences:\n\n{message}"]
]);

const chain = prompt.pipe(model).pipe(new StringOutputParser());

export async function summarizeSupportMessageValidated(input: SummarizeInput): Promise<string> {
    const parsedInput = SummarizeInputSchema.parse(input);
    const response = await chain.invoke(parsedInput);
    return response;
}