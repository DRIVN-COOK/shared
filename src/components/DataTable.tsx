// shared/src/components/DataTable.tsx
import React from 'react';

type SortDir = 'asc' | 'desc' | null;

export type Column<T> = {
  /** Titre d’en-tête */
  header: React.ReactNode;
  /** Rendu de la cellule (reçoit la donnée de la ligne) */
  render: (row: T, rowIndex: number) => React.ReactNode;
  /** Optionnel: valeur utilisée pour le tri (ex: (row)=>row.email) */
  getSortValue?: (row: T) => string | number | null | undefined;
  /** Optionnel: classes Tailwind par cellule */
  className?: string;
  /** Optionnel: classes pour l’en-tête */
  thClassName?: string;
  /** Optionnel: largeur fixe/min */
  width?: string; // ex: 'w-40', 'min-w-[200px]'
  /** Optionnel: alignement texte */
  align?: 'left' | 'center' | 'right';
  /** Optionnel: clé de test/accès */
  key?: string;
};

export type DataTableProps<T> = {
  items: T[];
  columns: Column<T>[];
  /** Clé unique par ligne (par défaut : index) */
  rowKey?: (row: T, index: number) => React.Key;
  /** État de chargement */
  loading?: boolean;
  /** Texte si vide */
  emptyText?: string;

  /** Pagination contrôlée */
  page?: number;         // 1-based
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;

  /** Tri contrôlé */
  sortBy?: number | null;     // index de colonne
  sortDir?: SortDir;          // 'asc' | 'desc' | null
  onSortChange?: (colIndex: number, dir: Exclude<SortDir, null>) => void;

  /** Classes table/container */
  tableClassName?: string;
  containerClassName?: string;
  /** Taille minimale (utile sur mobile) */
  minTableWidth?: string; // ex: 'min-w-[1100px]'
};

export function DataTable<T>({
  items,
  columns,
  rowKey,
  loading,
  emptyText = 'Aucune donnée',

  page,
  pageSize,
  total,
  onPageChange,

  sortBy = null,
  sortDir = null,
  onSortChange,

  tableClassName = 'w-full text-sm',
  containerClassName = 'overflow-x-auto border rounded',
  minTableWidth = 'min-w-[900px]',
}: DataTableProps<T>) {
  const pages =
    page && pageSize && typeof total === 'number' ? Math.max(1, Math.ceil(total / pageSize)) : 1;

  function handleSortClick(colIndex: number) {
    if (!onSortChange) return;
    if (sortBy !== colIndex) {
      onSortChange(colIndex, 'asc');
    } else {
      // toggle asc -> desc -> none -> asc...
      if (sortDir === 'asc') onSortChange(colIndex, 'desc');
      else if (sortDir === 'desc') onSortChange(colIndex, 'asc'); // (ou null si tu veux cycle à 3 états)
      else onSortChange(colIndex, 'asc');
    }
  }

  return (
    <div className={containerClassName}>
      <table className={`${minTableWidth} ${tableClassName}`}>
        <thead className="bg-black/5">
          <tr>
            {columns.map((col, i) => {
              const alignClass =
                col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left';
              const isSortable = !!col.getSortValue && !!onSortChange;
              const isActive = sortBy === i && sortDir;
              return (
                <th
                  key={col.key ?? i}
                  className={`${alignClass} px-3 py-2 whitespace-nowrap ${col.width ?? ''} ${col.thClassName ?? ''}`}
                >
                  {isSortable ? (
                    <button
                      type="button"
                      onClick={() => handleSortClick(i)}
                      className="inline-flex items-center gap-1 select-none"
                    >
                      <span>{col.header}</span>
                      <SortIndicator active={!!isActive} dir={isActive ? (sortDir as Exclude<SortDir, null>) : 'asc'} />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan={columns.length} className="px-3 py-4 text-center opacity-60">
                Chargement…
              </td>
            </tr>
          )}

          {!loading && items.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-3 py-6 text-center opacity-60">
                {emptyText}
              </td>
            </tr>
          )}

          {!loading &&
            items.map((row, rowIndex) => (
              <tr key={rowKey ? rowKey(row, rowIndex) : rowIndex} className="border-t">
                {columns.map((col, colIndex) => {
                  const alignClass =
                    col.align === 'center'
                      ? 'text-center'
                      : col.align === 'right'
                      ? 'text-right'
                      : 'text-left';

                  // data-sort permet aux libs de tri client de s'appuyer sur une valeur stable
                  const sortVal = col.getSortValue?.(row);
                  return (
                    <td
                      key={(col.key ?? colIndex) + ':' + rowIndex}
                      className={`${alignClass} px-3 py-2 ${col.className ?? ''}`}
                      data-sort={sortVal ?? undefined}
                    >
                      {col.render(row, rowIndex)}
                    </td>
                  );
                })}
              </tr>
            ))}
        </tbody>
      </table>

      {/* Pagination (optionnelle si props présentes) */}
      {typeof page === 'number' && typeof pageSize === 'number' && typeof total === 'number' && onPageChange && (
        <div className="flex items-center gap-2 justify-end p-2">
          <button
            className="border rounded px-2 py-1 disabled:opacity-50"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
          >
            Précédent
          </button>
          <span className="text-sm">Page {page} / {pages}</span>
          <button
            className="border rounded px-2 py-1 disabled:opacity-50"
            onClick={() => onPageChange(Math.min(pages, page + 1))}
            disabled={page >= pages}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}

function SortIndicator({ active, dir }: { active: boolean; dir: 'asc' | 'desc' }) {
  return (
    <span
      className={`inline-block transition-transform ${
        active ? (dir === 'asc' ? 'rotate-0' : 'rotate-180') : 'opacity-30'
      }`}
      aria-hidden
    >
      ▲
    </span>
  );
}
