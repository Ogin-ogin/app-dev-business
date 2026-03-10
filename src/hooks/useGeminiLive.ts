"use client";

import { useRef, useState, useCallback, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CallStatus = "idle" | "connecting" | "active" | "ending" | "ended" | "error";

export interface TranscriptEntry {
  role: "user" | "ai";
  text: string;
}

export interface UseGeminiLiveReturn {
  status: CallStatus;
  transcript: TranscriptEntry[];
  error: string | null;
  isMuted: boolean;
  duration: number;
  startCall: () => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
  resetCall: () => void;
}

// ─── System Prompt (愚痴の聞き方.md ベース) ───────────────────────────────────

const SYSTEM_PROMPT = `あなたは共感的な愚痴聞き相手です。カール・ロジャーズの来談者中心療法に基づき、無条件の肯定的配慮で相手の話を聞きます。

【3段階の対話フロー】
1. 愚痴聞き段階：相手が話す状況を聴きながら、8つのスロット（原因・対象・不満の理由・影響・背景・頻度・深刻さ・価値観）を自然な会話で理解していく
2. 感情緩和段階：状況が把握できたら、共感・労い・励ましに集中する。相手の感情（怒り・不満・悲しみ）を推定して適切に応答する
3. 終了・話題転換段階：感情が落ち着いたと判断した場合のみ、自然な形でポジティブな会話へ誘導する

【会話技術】
- 伝え返し（リフレクション）：相手の言葉や感情を反映して理解確認
- 短い応答：一度に1〜2文。音声対話では特に重要
- 相槌：「うんうん」「そうなんだ」「わかるわかる」「それで？」のみで返す場面も大切
- 感情の代弁：「それはむかつくね」「許せないよね」「つらかったね」など

【禁止事項】
- アドバイス・解決策・改善案を一切提示しない
- 自分の体験談や他人の話を持ち出さない
- 価値判断（良い・悪い・常識的かどうか）をしない
- 「でも」「だけど」「しかし」で相手の気持ちを否定しない

【話し方】
- タメ口でカジュアルに（「〜だよ」「〜だね」「〜なんだ」）
- 感情を込めたい言葉はひらがなで（つらい→つらかったね）
- 沈黙を尊重し、急かさない
- 日本語のみで会話する

最初の一言は「こんにちは！今日はどんなことがあったの？なんでも話してね。」と自然に始めてください。`;

// ─── AudioWorklet Processor (Blob URL方式) ────────────────────────────────────

const WORKLET_CODE = `
class MicrophoneProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buffer = [];
    this._bufferSize = 2048;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const samples = input[0];
    for (let i = 0; i < samples.length; i++) {
      this._buffer.push(samples[i]);
    }

    while (this._buffer.length >= this._bufferSize) {
      const chunk = this._buffer.splice(0, this._bufferSize);
      // Float32 → Int16 PCM
      const pcm = new Int16Array(chunk.length);
      for (let i = 0; i < chunk.length; i++) {
        const s = Math.max(-1, Math.min(1, chunk[i]));
        pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
      // Int16Array → base64
      const bytes = new Uint8Array(pcm.buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const b64 = btoa(binary);
      this.port.postMessage({ type: 'audio', data: b64 });
    }
    return true;
  }
}

registerProcessor('microphone-processor', MicrophoneProcessor);
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function base64ToFloat32(b64: string): Float32Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768.0;
  }
  return float32;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGeminiLive(): UseGeminiLiveReturn {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);

  const sessionRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const workletBlobUrlRef = useRef<string | null>(null);
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playbackQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);
  const recognitionRef = useRef<any>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cleanup = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    if (workletBlobUrlRef.current) {
      URL.revokeObjectURL(workletBlobUrlRef.current);
      workletBlobUrlRef.current = null;
    }
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch {}
      sessionRef.current = null;
    }
    playbackQueueRef.current = [];
    isPlayingRef.current = false;
  }, []);

  const playNextChunk = useCallback((ctx: AudioContext) => {
    if (isPlayingRef.current || playbackQueueRef.current.length === 0) return;
    isPlayingRef.current = true;
    const samples = playbackQueueRef.current.shift()!;
    const buffer = ctx.createBuffer(1, samples.length, 24000);
    buffer.copyToChannel(new Float32Array(samples.buffer as ArrayBuffer), 0);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = () => {
      isPlayingRef.current = false;
      playNextChunk(ctx);
    };
    source.start();
  }, []);

  const startCall = useCallback(async () => {
    setError(null);
    setStatus("connecting");
    setTranscript([]);
    setDuration(0);

    try {
      // 1. Check API key
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("NEXT_PUBLIC_GEMINI_API_KEY が設定されていません");

      // 2. Mic permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // 3. AudioContext for mic (16kHz capture)
      const micCtx = new AudioContext({ sampleRate: 16000 });
      // iOS Safari requires resume after user gesture
      if (micCtx.state === "suspended") {
        await micCtx.resume();
      }

      // 4. AudioContext for playback (24kHz, Gemini output)
      const playCtx = new AudioContext({ sampleRate: 24000 });
      if (playCtx.state === "suspended") {
        await playCtx.resume();
      }
      audioCtxRef.current = playCtx;

      // 5. AudioWorklet (Blob URL)
      const blob = new Blob([WORKLET_CODE], { type: "application/javascript" });
      const blobUrl = URL.createObjectURL(blob);
      workletBlobUrlRef.current = blobUrl;
      await micCtx.audioWorklet.addModule(blobUrl);

      // 6. Connect mic → worklet
      const source = micCtx.createMediaStreamSource(stream);
      const workletNode = new AudioWorkletNode(micCtx, "microphone-processor");
      workletNodeRef.current = workletNode;
      source.connect(workletNode);

      // 7. Connect to Gemini Live API
      // Dynamic import to avoid SSR issues
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      const session = await ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-12-2025",
        config: {
          responseModalities: ["AUDIO"] as any,
          systemInstruction: SYSTEM_PROMPT,
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Aoede" },
            },
          },
        } as any,
        callbacks: {
          onopen: () => {
            setStatus("active");
            // Start duration timer
            durationIntervalRef.current = setInterval(() => {
              setDuration(d => d + 1);
            }, 1000);
          },
          onmessage: (msg: any) => {
            const data = msg?.data || msg;
            // Audio playback
            const audioParts = data?.serverContent?.modelTurn?.parts?.filter(
              (p: any) => p.inlineData?.mimeType?.startsWith("audio/")
            ) ?? [];
            for (const part of audioParts) {
              const samples = base64ToFloat32(part.inlineData.data);
              playbackQueueRef.current.push(samples);
              playNextChunk(playCtx);
            }
            // Text transcript (AI)
            const textParts = data?.serverContent?.modelTurn?.parts?.filter(
              (p: any) => typeof p.text === "string" && p.text.trim()
            ) ?? [];
            for (const part of textParts) {
              setTranscript(prev => [...prev, { role: "ai", text: part.text }]);
            }
          },
          onerror: (e: any) => {
            const msg = e?.message || "接続エラーが発生しました";
            setError(msg);
            setStatus("error");
            cleanup();
          },
          onclose: () => {
            setStatus("ended");
            cleanup();
          },
        },
      });
      sessionRef.current = session;

      // 8. Pipe worklet output to Gemini
      workletNode.port.onmessage = (e: MessageEvent) => {
        if (e.data?.type === "audio" && sessionRef.current) {
          try {
            sessionRef.current.sendRealtimeInput({
              audio: { data: e.data.data, mimeType: "audio/pcm;rate=16000" },
            });
          } catch {}
        }
      };

      // 9. Web Speech API for user transcript (best-effort)
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = "ja-JP";
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.onresult = (ev: any) => {
          for (let i = ev.resultIndex; i < ev.results.length; i++) {
            if (ev.results[i].isFinal) {
              const text = ev.results[i][0].transcript.trim();
              if (text) {
                setTranscript(prev => [...prev, { role: "user", text }]);
              }
            }
          }
        };
        recognition.onerror = () => {};
        recognition.start();
        recognitionRef.current = recognition;
      }
    } catch (e: any) {
      const msg =
        e?.message?.includes("getUserMedia") || e?.name === "NotAllowedError"
          ? "マイクへのアクセスが拒否されました。ブラウザの設定でマイクを許可してください。"
          : e?.message || "通話の開始に失敗しました";
      setError(msg);
      setStatus("error");
      cleanup();
    }
  }, [cleanup, playNextChunk]);

  const endCall = useCallback(() => {
    setStatus("ending");
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch {}
      sessionRef.current = null;
    }
    cleanup();
    setStatus("ended");
  }, [cleanup]);

  const toggleMute = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(m => !m);
    }
  }, []);

  const resetCall = useCallback(() => {
    cleanup();
    setStatus("idle");
    setTranscript([]);
    setError(null);
    setDuration(0);
    setIsMuted(false);
  }, [cleanup]);

  return {
    status,
    transcript,
    error,
    isMuted,
    duration,
    startCall,
    endCall,
    toggleMute,
    resetCall,
  };
}
