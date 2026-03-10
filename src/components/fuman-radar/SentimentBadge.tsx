interface Props {
    sentiment: number;
}

export default function SentimentBadge({ sentiment }: Props) {
    if (sentiment < -0.3) {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                ネガティブ
            </span>
        );
    }
    if (sentiment > 0.3) {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                ポジティブ
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block" />
            中立
        </span>
    );
}
