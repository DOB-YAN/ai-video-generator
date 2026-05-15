export async function generateScript(prompt: string) {
  return { fullText: prompt, scenes: [{ visualPrompt: prompt, text: prompt }] };
}