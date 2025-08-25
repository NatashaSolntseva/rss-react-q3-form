import type { FormEntry } from '@/features/UserForm/model/formsSlice';

export function InfoCard({ entry }: { entry: FormEntry }) {
  const isNew = Date.now() - entry.createdAt < 5000;
  return (
    <div
      className={`rounded-2xl border p-4 shadow-md transition
        ${isNew ? 'border-fuchsia-400/60 bg-fuchsia-500/10' : 'border-white/10 bg-white/5'}`}
    >
      <div className="flex items-center gap-3">
        {entry.pictureBase64 ? (
          <img
            src={entry.pictureBase64}
            alt={entry.name}
            className="h-14 w-14 rounded-xl object-cover border border-white/10"
          />
        ) : (
          <div className="h-14 w-14 rounded-xl bg-white/10" />
        )}
        <div>
          <div className="text-lg font-semibold">{entry.name}</div>
          <div className="text-white/70 text-sm">{entry.email}</div>
        </div>
        <span className="ml-auto rounded-full bg-indigo-500/20 px-2 py-1 text-xs text-indigo-200">
          {entry.source.toUpperCase()}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-white/80">
        <div>
          <span className="text-white/50">Age:</span> {entry.age}
        </div>
        <div>
          <span className="text-white/50">Gender:</span> {entry.gender}
        </div>
        <div className="col-span-2">
          <span className="text-white/50">Country:</span> {entry.country}
        </div>
      </div>
    </div>
  );
}
