"use client";

import VoiceCall from "@/components/fuman-radar/VoiceCall";

export default function VoiceCallPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white">AI愚痴通話</h1>
        <p className="text-sm text-black/60 dark:text-white/60 mt-1">
          AIがあなたの愚痴を共感的に聞きます。アドバイスなし、判断なし、ただ聞くだけ。
        </p>
      </div>

      <VoiceCall />
    </div>
  );
}
