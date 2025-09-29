import type { DiaryEntry } from '@/app/lib/types';
import DiaryCard from './diary-card';

type DiaryGalleryProps = {
  entries: DiaryEntry[];
  onEntryClick: (entry: DiaryEntry) => void;
};

export default function DiaryGallery({ entries, onEntryClick }: DiaryGalleryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {entries.map((entry, index) => (
        <div key={entry.id} onClick={() => onEntryClick(entry)} className="cursor-pointer">
          <DiaryCard entry={entry} index={index} />
        </div>
      ))}
    </div>
  );
}
