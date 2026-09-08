import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const VOICE_HOST = process.env.AXIOGEN_VOICE_HOST || 'localhost';
const VOICE_PORT = parseInt(process.env.AXIOGEN_VOICE_PORT || '7860', 10);
const VOICE_MASTER_TOKEN = process.env.AXIOGEN_VOICE_KEY || 'teamaxiogen_admin_master';

export interface VoiceSynthesisOptions {
  voice?: string;
  speed?: number;
}

/**
 * Clean text for natural speech synthesis:
 * - Strip URLs (e.g. https://team.axiogen.in) into clean spoken words
 * - Strip emojis, asterisks, bullet dashes
 */
export function cleanTextForSpeech(raw: string): string {
  if (!raw) return '';
  let text = raw.trim();

  // Convert team.axiogen.in URL into spoken words
  text = text.replace(/https?:\/\/team\.axiogen\.in[^\s]*/gi, 'team dot axiogen dot in');
  text = text.replace(/https?:\/\/axiogen\.in[^\s]*/gi, 'axiogen dot in');
  text = text.replace(/https?:\/\/[^\s]+/gi, 'our website');

  // Strip asterisks, hashes, markdown tables, brackets
  text = text.replace(/[*_~`#]+/g, '');
  text = text.replace(/\|[^\n]+\|/g, ' ');
  text = text.replace(/^[ \t]*[-•][ \t]+/gm, '');

  // Strip non-standard emojis that may confuse TTS phonemizer
  text = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

  // Collapse excess whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

/**
 * Synthesize text into high-fidelity 24kHz WAV using Axiogen Voice Engine v2
 */
async function requestTtsWav(text: string, options?: VoiceSynthesisOptions): Promise<Buffer> {
  const voice = options?.voice || 'am_adam';
  const speed = options?.speed || 1.0;

  const payload = JSON.stringify({
    model: 'axiogen-v2',
    input: text,
    voice,
    speed,
  });

  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: VOICE_HOST,
        port: VOICE_PORT,
        path: '/v1/audio/speech',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${VOICE_MASTER_TOKEN}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
        timeout: 10000,
      },
      (res) => {
        if (res.statusCode !== 200) {
          let errBody = '';
          res.on('data', (d) => (errBody += d));
          res.on('end', () => {
            reject(new Error(`Axiogen Voice Engine returned HTTP ${res.statusCode}: ${errBody}`));
          });
          return;
        }

        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
      }
    );

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Axiogen Voice synthesis timed out (10s limit)'));
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Convert WAV audio to WhatsApp-standard Opus OGG format using ffmpeg
 */
async function convertWavToOpusOgg(wavBuffer: Buffer): Promise<Buffer> {
  const tempId = `tts_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const tempDir = os.tmpdir();
  const inputWav = path.join(tempDir, `${tempId}.wav`);
  const outputOgg = path.join(tempDir, `${tempId}.ogg`);

  try {
    await fs.promises.writeFile(inputWav, wavBuffer);

    // Optimized encoding for WhatsApp voice notes (Push-to-Talk)
    const cmd = `ffmpeg -y -i "${inputWav}" -c:a libopus -b:a 32k -vbr on -compression_level 10 -application voip "${outputOgg}"`;
    await execAsync(cmd);

    const oggBuffer = await fs.promises.readFile(outputOgg);
    return oggBuffer;
  } finally {
    // Cleanup temporary files
    try {
      if (fs.existsSync(inputWav)) await fs.promises.unlink(inputWav);
      if (fs.existsSync(outputOgg)) await fs.promises.unlink(outputOgg);
    } catch (_) {}
  }
}

/**
 * Synthesize speech from text and return WhatsApp-ready Opus OGG buffer
 */
export async function synthesizeSpeech(
  rawText: string,
  options?: VoiceSynthesisOptions
): Promise<Buffer | null> {
  const cleanText = cleanTextForSpeech(rawText);
  if (!cleanText || cleanText.length < 2) {
    return null;
  }

  try {
    const startTime = Date.now();
    console.log(`[Axiogen Voice] Synthesizing speech (${cleanText.length} chars, voice: ${options?.voice || 'am_adam'})...`);

    const wavBuffer = await requestTtsWav(cleanText, options);
    const oggBuffer = await convertWavToOpusOgg(wavBuffer);

    const elapsed = Date.now() - startTime;
    console.log(`[Axiogen Voice] Synthesis complete in ${elapsed}ms (OGG size: ${oggBuffer.length} bytes)`);

    return oggBuffer;
  } catch (err: any) {
    console.error(`[Axiogen Voice] Synthesis failed:`, err?.message || err);
    return null;
  }
}

/**
 * Generate raw WAV buffer for browser preview
 */
export async function synthesizeSpeechWav(
  rawText: string,
  options?: VoiceSynthesisOptions
): Promise<Buffer | null> {
  const cleanText = cleanTextForSpeech(rawText);
  if (!cleanText) return null;
  try {
    return await requestTtsWav(cleanText, options);
  } catch (err) {
    console.error('[Axiogen Voice] Preview WAV failed:', err);
    return null;
  }
}
