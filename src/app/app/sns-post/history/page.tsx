"use client";

import { Clock, Search } from "lucide-react";

export default function HistoryPage() {
    // Mock data
    const history = [
        { id: 1, date: "2026-03-04 14:00", topic: "AI App Platform Launch Announcement", tone: "Professional", platforms: "X, LinkedIn" },
        { id: 2, date: "2026-03-02 10:30", topic: "New features for freelancers: tax automation", tone: "Casual", platforms: "Insta, X" },
        { id: 3, date: "2026-02-28 16:45", topic: "Why AI won't replace developers but empower them", tone: "Enthusiastic", platforms: "LinkedIn" },
    ];

    return (
        <div className="flex flex-col gap-8 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold mb-2">Generation History</h1>
                <p className="text-sm text-black/60 dark:text-white/60">
                    View your previously generated posts and reuse them.
                </p>
            </div>

            <div className="flex items-center bg-white dark:bg-[#191919] border border-black/[0.1] dark:border-white/[0.1] rounded-lg p-2 max-w-sm">
                <Search className="w-4 h-4 text-black/40 dark:text-white/40 ml-2" />
                <input
                    type="text"
                    placeholder="Search topics..."
                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm w-full px-3"
                />
            </div>

            <div className="border border-black/[0.1] dark:border-white/[0.1] rounded-xl overflow-hidden bg-white dark:bg-[#191919]">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-black/[0.1] dark:border-white/[0.1] text-black/60 dark:text-white/60 bg-black/[0.02] dark:bg-white/[0.02]">
                            <th className="font-medium p-4 font-normal">Date (JST)</th>
                            <th className="font-medium p-4 font-normal">Topic</th>
                            <th className="font-medium p-4 font-normal">Tone</th>
                            <th className="font-medium p-4 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map(item => (
                            <tr key={item.id} className="border-b border-black/[0.05] dark:border-white/[0.05] last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                <td className="p-4 text-black/60 dark:text-white/60 flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5" />
                                    {item.date}
                                </td>
                                <td className="p-4 font-medium truncate max-w-[200px] md:max-w-xs">{item.topic}</td>
                                <td className="p-4 text-black/60 dark:text-white/60">{item.tone}</td>
                                <td className="p-4 text-right">
                                    <button className="text-[var(--color-accent)] font-medium text-xs hover:underline">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
