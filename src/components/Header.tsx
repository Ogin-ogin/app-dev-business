import Link from "next/link";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-[12px] border-b border-black/[0.05] dark:bg-[#191919]/80 dark:border-white/[0.05]">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
                <div className="flex items-center gap-6">
                    <Link href="/" className="font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity">
                        AI App Platform
                    </Link>
                    <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-black/60 dark:text-white/60">
                        <Link href="/products" className="hover:text-black dark:hover:text-white transition-colors">
                            Products
                        </Link>
                        <Link href="/order" className="hover:text-black dark:hover:text-white transition-colors">
                            Custom Dev
                        </Link>
                        <Link href="/pricing" className="hover:text-black dark:hover:text-white transition-colors">
                            Pricing
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-black/80 hover:text-black dark:text-white/80 dark:hover:text-white transition-colors"
                    >
                        Log in
                    </Link>
                    <Link
                        href="/order"
                        className="text-sm font-medium bg-[var(--color-accent)] text-black px-4 py-1.5 rounded-md hover:opacity-90 transition-opacity"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}
