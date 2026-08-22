// components/dashboard/ProfileStatusCard.tsx
type ChecklistItem = { label: string; done: boolean };

export default function ProfileStatusCard({ items }: { items: ChecklistItem[] }) {
  const doneCount = items.filter((i) => i.done).length;
  const percent = Math.round((doneCount / items.length) * 100);

  return (
    <div className="bg-white rounded-xl border border-outline-variant p-6">
      <h2 className="font-headline-md text-headline-md text-primary mb-4 text-lg">
        Estado do perfil
      </h2>

      <div className="flex items-center justify-between mb-2">
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
          Progresso
        </span>
        <span className="font-headline-md text-headline-md text-primary text-2xl">
          {percent}%
        </span>
      </div>
      <div className="w-full h-2 bg-surface-container rounded-full mb-6">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-3">
            <span
              className={`material-symbols-outlined text-lg ${
                item.done ? "text-secondary" : "text-outline-variant"
              }`}
            >
              {item.done ? "check_circle" : "radio_button_unchecked"}
            </span>
            <span
              className={`font-body-md text-body-md ${
                item.done ? "text-on-surface-variant line-through" : "text-on-surface"
              }`}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}