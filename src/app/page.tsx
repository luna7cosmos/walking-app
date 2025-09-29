'use client';

import { useState } from 'react';
import QuestView from '@/components/quest/quest-view';
import DiaryGallery from '@/components/diary/diary-gallery';
import type { DiaryEntry } from '@/app/lib/types';
import { initialDiaryEntries } from '@/app/lib/mock-data';
import RecordsHeader from '@/components/layout/records-header';

export default function Home() {
  const [isQuestMode, setIsQuestMode] = useState(false);
  const [entries, setEntries] = useState<DiaryEntry[]>(initialDiaryEntries);

  const handleQuestComplete = (newEntry: Omit<DiaryEntry, 'id' | 'date'>) => {
    const entry: DiaryEntry = {
      ...newEntry,
      id: `entry-${Date.now()}`,
      date: new Date(),
    };
    setEntries(prevEntries => [entry, ...prevEntries].sort((a, b) => b.date.getTime() - a.date.getTime()));
    setIsQuestMode(false);
  };

  const handleShowGallery = () => {
    setIsQuestMode(false);
  };
  
  const handleStartQuest = () => {
    setIsQuestMode(true);
  }

  if (isQuestMode) {
    return <QuestView onQuestComplete={handleQuestComplete} onShowGallery={handleShowGallery} />;
  }

  return (
    <div className="flex flex-col min-h-screen font-body">
      <RecordsHeader onStartQuest={handleStartQuest} activeView="gallery" />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DiaryGallery entries={entries} onEntryClick={() => {}} />
      </main>
    </div>
  );
}
