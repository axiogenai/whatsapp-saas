import Groq, { toFile } from 'groq-sdk';
import { getTenantConfig } from './config';
import { TOOL_DEFINITIONS, executeTool } from './tools';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content?: string;
  timestamp?: number;
  tool_calls?: any[];
  tool_call_id?: string;
}

// Conversation histories keyed by "tenantId:jid"
const conversationHistories = new Map<string, any[]>();
const MAX_HISTORY_PER_CHAT = 20;

function getHistoryKey(tenantId: string, jid: string): string {
  return `${tenantId}:${jid}`;
}

export function getChatHistory(tenantId: string, jid: string): any[] {
  const key = getHistoryKey(tenantId, jid);
  return conversationHistories.get(key) || [];
}

export function appendMessage(
  tenantId: string,
  jid: string,
  role: 'user' | 'assistant',
  content: string
): void {
  const key = getHistoryKey(tenantId, jid);
  const history = conversationHistories.get(key) || [];
  history.push({
    role,
    content,
    timestamp: Date.now(),
  });
  if (history.length > MAX_HISTORY_PER_CHAT) {
    history.splice(0, history.length - MAX_HISTORY_PER_CHAT);
  }
  conversationHistories.set(key, history);
}

export function clearChatHistory(tenantId?: string, jid?: string): void {
  if (tenantId && jid) {
    conversationHistories.delete(getHistoryKey(tenantId, jid));
  } else if (tenantId) {
    for (const k of conversationHistories.keys()) {
      if (k.startsWith(`${tenantId}:`)) {
        conversationHistories.delete(k);
      }
    }
  } else {
    conversationHistories.clear();
  }
}

// Fallback models in priority order
const MODEL_FALLBACKS = [
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-20b',
  'groq/compound',
];

/**
 * Clean & sanitize reply:
 * 1. Strip markdown tables (| col | col |).
 * 2. Strip all asterisks (*, **, ***) so no bold/italics appear.
 * 3. Strip bullet point dashes/asterisks/bullets.
 * 4. Strip markdown headers (#, ##).
 * 5. Guarantee complete sentence endings (never cut off mid-sentence).
 */
export function sanitizeReply(raw: string): string {
  if (!raw) return '';
  let text = raw.trim();

  // Strip markdown tables entirely if generated
  text = text.replace(/\|[^\n]+\|/g, ' ');
  text = text.replace(/^[ \t]*\|.*$/gm, '');
  text = text.replace(/^[ \t]*[-=]{3,}[ \t]*$/gm, '');

  // Strip all asterisks (*bold*, **bold**, *bullets) and backticks/tildes
  text = text.replace(/[*_~`]+/g, '');

  // Strip bullet prefixes at line starts (- item, • item, 1. item)
  text = text.replace(/^[ \t]*[-•][ \t]+/gm, '');
  text = text.replace(/^[ \t]*\d+[\.\)][ \t]+/gm, '');

  // Strip markdown headers (# Title, ## Subtitle)
  text = text.replace(/^[ \t]*#+[ \t]+/gm, '');

  // Clean up multiple horizontal spaces
  text = text.replace(/[ \t]{2,}/g, ' ');

  // Collapse multiple empty lines
  text = text.replace(/\n{2,}/g, '\n').trim();

  // Check if sentence was cut off mid-thought
  const lastChar = text.slice(-1);
  const validPunctuation = ['.', '!', '?', '"', "'", '’', ')'];
  if (!validPunctuation.includes(lastChar)) {
    const lastValidIdx = Math.max(
      text.lastIndexOf('.'),
      text.lastIndexOf('!'),
      text.lastIndexOf('?')
    );
    if (lastValidIdx > 20) {
      text = text.slice(0, lastValidIdx + 1).trim();
    } else {
      text = text + '.';
    }
  }

  return text;
}

/**
 * Audio / Voice Note Transcription via Groq Whisper (whisper-large-v3)
 */
export async function transcribeAudioBuffer(
  tenantId: string,
  buffer: Buffer
): Promise<string | null> {
  const config = getTenantConfig(tenantId);
  const apiKey = config.groqApiKey;

  if (!apiKey) {
    console.error(`[Whisper] No API key available for tenant '${tenantId}'.`);
    return null;
  }

  try {
    const groq = new Groq({ apiKey });
    const file = await toFile(buffer, 'audio.ogg', { type: 'audio/ogg' });

    console.log(`[Whisper] Transcribing voice note (${buffer.length} bytes) for tenant '${tenantId}'...`);
    const result = await groq.audio.transcriptions.create({
      file,
      model: 'whisper-large-v3',
      temperature: 0.0,
      response_format: 'json',
    });

    const text = result.text?.trim() || null;
    if (text) {
      console.log(`[Whisper] Transcription: "${text}"`);
    }
    return text;
  } catch (err: any) {
    console.error(`[Whisper] Failed to transcribe voice note for tenant '${tenantId}':`, err?.message || err);
    return null;
  }
}

/**
 * Autonomous AI Reply with Tool Execution
 */
export interface AiReplyOptions {
  isVip?: boolean;
  vipRule?: string;
  vipNotes?: string;
}

export async function generateAiReply(
  arg1: string,
  arg2: string,
  arg3?: string,
  arg4?: string,
  arg5?: AiReplyOptions
): Promise<string | null> {
  let tenantId = 'default';
  let jid = '';
  let userMessage = '';
  let contactName: string | undefined;
  let options: AiReplyOptions | undefined = arg5;

  if (arg4 !== undefined || (arg3 && arg3.length > 0 && !arg3.startsWith('+') && !arg1.includes('@'))) {
    tenantId = arg1;
    jid = arg2;
    userMessage = arg3 || '';
    contactName = arg4;
  } else {
    jid = arg1;
    userMessage = arg2;
    contactName = arg3;
  }

  const config = getTenantConfig(tenantId);
  const apiKey = config.groqApiKey;

  if (!apiKey) {
    console.error(`[Groq] Critical: No API key found for tenant ${tenantId}.`);
    return null;
  }

  const groq = new Groq({ apiKey });

  // Append user message
  appendMessage(tenantId, jid, 'user', userMessage);

  // Recipient contact identity & greeting directives
  const isSavedName = Boolean(
    contactName &&
      contactName.trim().length > 0 &&
      !contactName.startsWith('+') &&
      !/^\d+$/.test(contactName.replace(/[\s\-\+\(\)]/g, ''))
  );

  let recipientPromptInstruction = '';
  if (isSavedName && config.useSavedContactNames !== false) {
    recipientPromptInstruction = `RECIPIENT CONTACT:
- Recipient Saved Contact Name/Title: "${contactName}"
- If referring to or greeting this contact, use their exact saved name and title ("${contactName}") naturally without altering honorifics.
- Obey the system prompt instructions below for message content, greeting style, rules, and behavior.`;
  }

  if (options?.isVip) {
    recipientPromptInstruction += `\n- VIP STATUS: This recipient is an honored VIP client/contact.${
      options.vipNotes ? ` (Notes: ${options.vipNotes})` : ''
    } Give them highest priority, polite, and attentive service.`;
  }

  const history = getChatHistory(tenantId, jid);
  const formattedMessages: any[] = [
    {
      role: 'system',
      content: [
        config.systemPrompt?.trim() || 'You are an AI assistant helping contacts on WhatsApp.',
        recipientPromptInstruction || (contactName ? `(WhatsApp contact name: "${contactName}")` : ''),
        'Technical Delivery Rule: Deliver plain text only. Never use markdown asterisks (*), hashtags, or markdown tables.',
      ]
        .filter(Boolean)
        .join('\n\n'),
    },
    ...history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  ];

  const modelsToTry = [
    config.groqModel || 'openai/gpt-oss-120b',
    ...MODEL_FALLBACKS.filter((m) => m !== config.groqModel),
  ];

  for (const model of modelsToTry) {
    try {
      console.log(`[Groq] Tenant '${tenantId}': Invoking ${model} for ${jid}...`);

      // First turn: invoke with tool definitions
      const completion = await groq.chat.completions.create({
        model,
        messages: formattedMessages,
        tools: TOOL_DEFINITIONS,
        tool_choice: 'auto',
        temperature: 0.65,
        max_tokens: 1024,
      });

      const choice = completion.choices[0];
      const aiMsg = choice?.message;

      // Check if tool calls were triggered by the model
      if (aiMsg?.tool_calls && aiMsg.tool_calls.length > 0) {
        console.log(
          `[Groq Engine] Model invoked ${aiMsg.tool_calls.length} tool(s):`,
          aiMsg.tool_calls.map((tc: any) => tc.function.name)
        );

        formattedMessages.push(aiMsg);

        for (const toolCall of aiMsg.tool_calls) {
          let args: any = {};
          try {
            args = JSON.parse(toolCall.function.arguments);
          } catch {
            args = {};
          }

          const toolResult = await executeTool(toolCall.function.name, args, {
            tenantId,
            jid,
            contactName,
          });

          formattedMessages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(toolResult),
          });
        }

        // Second turn: generate final conversational reply acknowledging the executed action
        const followUp = await groq.chat.completions.create({
          model,
          messages: formattedMessages,
          temperature: 0.65,
          max_tokens: 512,
        });

        const followUpReply = followUp.choices[0]?.message?.content?.trim();
        if (followUpReply) {
          const cleanReply = sanitizeReply(followUpReply);
          appendMessage(tenantId, jid, 'assistant', cleanReply);
          console.log(`[Groq] Clean response with tool execution generated using ${model}`);
          return cleanReply;
        }
      }

      // Direct text reply without tool calls
      const rawReply = aiMsg?.content?.trim();
      if (rawReply) {
        const cleanReply = sanitizeReply(rawReply);
        appendMessage(tenantId, jid, 'assistant', cleanReply);
        console.log(`[Groq] Clean response generated using ${model} (${cleanReply.length} chars)`);
        return cleanReply;
      }
    } catch (err: any) {
      console.warn(
        `[Groq] Tenant '${tenantId}' failed with model ${model}: ${err?.message || err}. Trying next fallback...`
      );
    }
  }

  // Graceful fallback: retry without tools if all tool-calling attempts failed
  for (const model of modelsToTry) {
    try {
      const basicCompletion = await groq.chat.completions.create({
        model,
        messages: formattedMessages.filter((m) => m.role === 'system' || m.role === 'user' || m.role === 'assistant'),
        temperature: 0.65,
        max_tokens: 512,
      });
      const rawReply = basicCompletion.choices[0]?.message?.content?.trim();
      if (rawReply) {
        const cleanReply = sanitizeReply(rawReply);
        appendMessage(tenantId, jid, 'assistant', cleanReply);
        return cleanReply;
      }
    } catch (_) {}
  }

  console.error(`[Groq] Tenant '${tenantId}': All model fallbacks failed.`);
  return null;
}
