import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full border-t border-black/[0.05] dark:border-white/[0.05] bg-white dark:bg-[#191919]">
            <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col md:flex-row justify-between gap-8">
                <div>
                    <h3 className="font-semibold text-lg mb-4">AI App Platform</h3>
                    <p className="text-sm text-black/60 dark:text-white/60 max-w-xs">
                        Build web applications blazingly fast and at a fraction of the cost using AI agents.
                    </p>
                </div>
                <div className="flex gap-16">
                    <div className="flex flex-col gap-3">
                        <h4 className="font-medium">Product</h4>
                        <Link href="/products" className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">Marketplace</Link>
                        <Link href="/order" className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">Custom Build</Link>
                        <Link href="/pricing" className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">Pricing</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h4 className="font-medium">Company</h4>
                        <Link href="/about" className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">About</Link>
                        <Link href="/contact" className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">Contact</Link>
                        <Link href="/terms" className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
