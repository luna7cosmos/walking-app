import type { DiaryEntry } from '@/app/lib/types';
import DiaryCard from './diary-card';

type DiaryGalleryProps = {
  entries: DiaryEntry[];
};

export default function DiaryGallery({ entries }: DiaryGalleryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {entries.map((entry, index) => (
        <DiaryCard key={entry.id} entry={entry} index={index} />
      ))}
    </div>
  );
}
