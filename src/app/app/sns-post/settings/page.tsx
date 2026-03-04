"use client";

import { Save } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-8 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold mb-2">App Settings</h1>
                <p className="text-sm text-black/60 dark:text-white/60">
                    Manage your defaults and AI model preferences.
                </p>
            </div>

            <div className="bg-white dark:bg-[#191919] p-6 rounded-xl border border-black/[0.1] dark:border-white/[0.1] flex flex-col gap-6">
                <div>
                    <h3 className="text-[15px] font-semibold mb-1">AI Model Strategy</h3>
                    <p className="text-xs text-black/60 dark:text-white/60 mb-4">Choose which AI model powers your generations.</p>

                    <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-3 p-3 border border-black/[0.1] dark:border-white/[0.1] rounded-lg cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                            <input type="radio" name="model" defaultChecked className="accent-[var(--color-accent)] w-4 h-4" />
                            <div>
                                <div className="font-medium text-sm">Gemini Flash 2.0 (Fast)</div>
                                <div className="text-xs text-black/50 dark:text-white/50">Included in standard plan</div>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 border border-black/[0.1] dark:border-white/[0.1] rounded-lg cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                            <input type="radio" name="model" className="accent-[var(--color-accent)] w-4 h-4" />
                            <div>
                                <div className="font-medium text-sm">Claude 3.5 Sonnet (High Quality)</div>
                                <div className="text-xs text-black/50 dark:text-white/50">Uses Pro credits</div>
                            </div>
                        </label>
                    </div>
                </div>

                <hr className="border-black/[0.05] dark:border-white/[0.05]" />

                <div>
                    <h3 className="text-[15px] font-semibold mb-1">Default Hashtags</h3>
                    <p className="text-xs text-black/60 dark:text-white/60 mb-4">These will be appended to your Instagram and LinkedIn posts automatically.</p>
                    <input
                        type="text"
                        defaultValue="#business #entrepreneur #tech"
                        className="w-full bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.1] dark:border-white/[0.1] rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                    />
                </div>

                <button className="self-start bg-black text-white dark:bg-white dark:text-black font-semibold rounded-md px-5 py-2.5 text-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <Save className="w-4 h-4" /> Save Preferences
                </button>
            </div>
        </div>
    );
}
