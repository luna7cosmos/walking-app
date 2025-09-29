'use client';

import type { DiaryEntry } from '@/app/lib/types';
import DiaryCard from './diary-card';
import { useDiary } from '@/contexts/DiaryContext';

type DiaryGalleryProps = {
  onEntryClick: (entry: DiaryEntry) => void;
};

export default function DiaryGallery({ onEntryClick }: DiaryGalleryProps) {
  const { entries } = useDiary();
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
