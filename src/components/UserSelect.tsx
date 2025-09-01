import { useEffect, useRef, useState } from 'react';

export type UserOption = { id: string; label: string; email: string };

type Props = {
  value: string;
  onChange: (id: string) => void;
  onSearch: (q: string) => Promise<UserOption[]>;
  placeholder?: string;
  debounceMs?: number;
};

export function UserSelect({ value, onChange, onSearch, placeholder = 'nom, prénom ou email', debounceMs = 300 }: Props) {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<UserOption[]>([]);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function run(q: string) {
    setLoading(true);
    try {
      const res = await onSearch(q);
      setOptions(res);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => run(q), debounceMs);
    return () => { if (t.current) clearTimeout(t.current); };
  }, [q, debounceMs]);

  useEffect(() => { run(''); }, []);

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="border rounded px-2 py-1 w-full"
        placeholder={placeholder}
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 border rounded px-2 py-1 w-full"
      >
        <option value="">— Sélectionner —</option>
        {options.map((u) => (
          <option key={u.id} value={u.id}>{u.label} — {u.email}</option>
        ))}
      </select>
      {loading && <span className="text-xs opacity-60">Recherche…</span>}
    </div>
  );
}
