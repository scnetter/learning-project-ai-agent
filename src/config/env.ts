function requiredEnv(name: string): string {
    const value = process.env[name];

    if(!value || value.trim().length === 0) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    
    return value;
}

function optionalEnv(name: string, fallback: string): string {
    const value = process.env[name];

    if(!value || value.trim().length === 0) {
        return fallback;
    }
    
    return value;
}

export const env = {
    openAIApiKey: requiredEnv('OPENAI_API_KEY'),
    langSmithTracing: optionalEnv('LANGSMITH_TRACING', 'false'),
    langSmithApiKey: optionalEnv('LANGSMITH_API_KEY', ''),
    langSmithProject: optionalEnv('LANGSMITH_PROJECT', 'learning-project-ai-agent'),
}