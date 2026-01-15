export function buildSystemPrompt(input: {
  memories: Array<{ type: string; summary: string; tags?: string[] }>;
}) {
  const memoryBlock =
    input.memories.length === 0
      ? 'No stored memories.'
      : input.memories
          .map((m, i) => {
            const tags = (m.tags ?? []).slice(0, 5).join(', ');
            return `${i + 1}. [${m.type}] ${m.summary}${tags ? ` (tags: ${tags})` : ''}`;
          })
          .join('\n');

  return `
You are an AI assistant.

You have access to the user's long-term memory records.
Use them only when relevant, do not hallucinate.
If memory conflicts with user message, prefer the latest user message.

User Memories:
${memoryBlock}
`.trim();
}
