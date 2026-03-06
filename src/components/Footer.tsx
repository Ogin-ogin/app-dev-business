import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full border-t border-black/[0.05] dark:border-white/[0.05] bg-white dark:bg-[#191919]">
            <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col md:flex-row justify-between gap-8">
                <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-1.5">
                        <span>⭐</span>
                        <span>HoshiApp</span>
                    </h3>
                    <p className="text-sm text-black/60 dark:text-white/60 max-w-xs">
                        AIエージェントを使って、高品質なウェブアプリを爆速・激安で提供します。
                    </p>
                </div>
                <div className="flex gap-16">
                    <div className="flex flex-col gap-3">
                        <h4 className="font-medium">サービス</h4>
                        <Link href="/products" className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">既製品アプリ</Link>
                        <Link href="/order" className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">カスタム開発</Link>
                        <Link href="/products#pricing" className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">料金</Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h4 className="font-medium">会社情報</h4>
                        <Link href="/about" className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">HoshiAppについて</Link>
                        <Link href="/contact" className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">お問い合わせ</Link>
                        <Link href="/terms" className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">利用規約</Link>
                        <Link href="/privacy" className="text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">プライバシーポリシー</Link>
                    </div>
                </div>
            </div>
            <div className="border-t border-black/[0.05] dark:border-white/[0.05]">
                <p className="text-center text-xs text-black/40 dark:text-white/40 py-4">
                    © 2026 HoshiApp. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
