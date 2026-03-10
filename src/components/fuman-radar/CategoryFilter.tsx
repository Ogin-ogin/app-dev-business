"use client";

const CATEGORY_LABELS: Record<string, string> = {
  economy: "経済・お金",
  politics: "政治",
  healthcare: "医療・健康",
  education: "教育",
  work: "仕事・職場",
  housing: "住まい",
  transport: "交通",
  food: "食事・飲食",
  service: "サービス・接客",
  tech: "テクノロジー",
  other: "その他",
};

const ALL_CATEGORIES = [
  "economy",
  "politics",
  "healthcare",
  "education",
  "work",
  "housing",
  "transport",
  "food",
  "service",
  "tech",
  "other",
];

interface Props {
  value: string;
  onChange: (cat: string) => void;
  counts?: Record<string, number>;
}

export default function CategoryFilter({ value, onChange, counts }: Props) {
  const chips = [
    { key: "", label: "すべて" },
    ...ALL_CATEGORIES.map((cat) => ({ key: cat, label: CATEGORY_LABELS[cat] })),
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {chips.map(({ key, label }) => {
        const isSelected = value === key;
        const count = key && counts ? counts[key] : key === "" && counts ? Object.values(counts).reduce((a, b) => a + b, 0) : undefined;

        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex-none flex items-center gap-1 text-sm px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
              isSelected
                ? "bg-[var(--color-accent)] text-black"
                : "bg-black/[0.05] dark:bg-white/[0.1] text-black/70 dark:text-white/70 hover:bg-black/[0.1] dark:hover:bg-white/[0.15]"
            }`}
          >
            {label}
            {count !== undefined && (
              <span className={`text-xs ${isSelected ? "text-black/70" : "text-black/40 dark:text-white/40"}`}>
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
