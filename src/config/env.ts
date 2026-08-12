import {z} from 'zod';

const EnvSchema = z.object({
    OPENAI_API_KEY: z.string().min(1, "Missing required environment variable: OPENAI_API_KEY"),
    LANGSMITH_TRACING: z.string().optional().default('false'),
    LANGSMITH_API_KEY: z.string().optional(),
    LANGSMITH_PROJECT: z.string().optional().default('learning-project-ai-agent'),
});

const parsedEnv = EnvSchema.parse(process.env);

export const env = {
    openAIApiKey: parsedEnv.OPENAI_API_KEY,
    langSmithTracing: parsedEnv.LANGSMITH_TRACING,
    langSmithApiKey: parsedEnv.LANGSMITH_API_KEY,
    langSmithProject: parsedEnv.LANGSMITH_PROJECT
}