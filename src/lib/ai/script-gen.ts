export async function generateScript(prompt: string) {
  // Simple logic to break down prompts until Groq is connected
  return {
    fullText: `Video about ${prompt}`,
    scenes: [{ visualPrompt: prompt, text: prompt }]
  };
}