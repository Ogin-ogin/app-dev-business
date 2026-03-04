import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, Send } from "lucide-react";

export default function OrderPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 flex flex-col h-[calc(100vh-140px)]">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Custom AI Development</h1>
                    <p className="text-black/60 dark:text-white/60 text-sm">
                        Chat with our Gemini-powered requirements specialist. It will gather your needs and instantly generate a quote and spec document.
                    </p>
                </div>

                {/* Chat UI Placeholder */}
                <div className="flex-1 border border-black/[0.1] dark:border-white/[0.1] rounded-xl flex flex-col overflow-hidden bg-black/[0.01] dark:bg-white/[0.01]">
                    <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center shrink-0">
                                <Sparkles className="w-4 h-4 text-black" />
                            </div>
                            <div className="bg-white dark:bg-[#222] border border-black/[0.05] dark:border-white/[0.05] p-4 rounded-xl max-w-[85%] text-sm leading-relaxed shadow-sm">
                                Hello! I am your AI Development Assistant. What kind of web application would you like to build today?
                            </div>
                        </div>

                        {/* Example user message */}
                        <div className="flex gap-4 self-end">
                            <div className="bg-black text-white dark:bg-white dark:text-black p-4 rounded-xl max-w-[85%] text-sm leading-relaxed shadow-sm">
                                I want to build a simple task management app for my team.
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-[#191919]">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                disabled
                                className="w-full bg-black/[0.03] dark:bg-white/[0.05] border-none rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                            />
                            <button
                                disabled
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-black/40 dark:text-white/40"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
