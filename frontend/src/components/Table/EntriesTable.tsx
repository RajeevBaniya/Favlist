import type { Entry } from "../../types";

interface EntriesTableProps {
  entries: Entry[];
  onEdit: (entry: Entry) => void;
  onDelete: (entry: Entry) => void;
}

export const EntriesTable = ({
  entries,
  onEdit,
  onDelete,
}: EntriesTableProps) => {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-white/60 bg-white/70 sm:rounded-xl shadow-lg ring-1 ring-black/5 backdrop-blur">
          <table className="min-w-full divide-y divide-border/60">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Title
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Type
                </th>
                <th className="hidden md:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Director
                </th>
                <th className="hidden lg:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Budget
                </th>
                <th className="hidden lg:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Location
                </th>
                <th className="hidden xl:table-cell px-3 sm:px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Duration
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Year
                </th>
                <th className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="odd:bg-card even:bg-secondary/20 hover:bg-secondary/40 transition-colors"
                >
                  <td className="px-3 sm:px-4 py-3 text-sm font-medium max-w-xs truncate">
                    {entry.title}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-sm whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${
                        entry.type === "MOVIE"
                          ? "bg-blue-100 text-blue-800 ring-1 ring-blue-200"
                          : "bg-purple-100 text-purple-800 ring-1 ring-purple-200"
                      }`}
                    >
                      <span>{entry.type === "MOVIE" ? "🎬" : "📺"}</span>
                      <span>{entry.type === "MOVIE" ? "Movie" : "TV Show"}</span>
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-3 sm:px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                    {entry.director}
                  </td>
                  <td className="hidden lg:table-cell px-3 sm:px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                    {entry.budget}
                  </td>
                  <td className="hidden lg:table-cell px-3 sm:px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">
                    {entry.location}
                  </td>
                  <td className="hidden xl:table-cell px-3 sm:px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                    {entry.duration}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                    {entry.yearTime}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-sm text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(entry)}
                        className="text-primary hover:opacity-90 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(entry)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
