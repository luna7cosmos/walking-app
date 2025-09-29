'use client';

import { useState } from 'react';
import QuestView from '@/components/quest/quest-view';
import DiaryGallery from '@/components/diary/diary-gallery';
import type { DiaryEntry } from '@/app/lib/types';
import { initialDiaryEntries } from '@/app/lib/mock-data';

export default function Home() {
  const [isQuestMode, setIsQuestMode] = useState(true);
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
    <div className="flex flex-col min-h-screen bg-background font-body">
      <header className="sticky top-0 z-20 w-full bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline">나의 산책 일기</h1>
          <button onClick={handleStartQuest} className="text-sm font-medium text-primary hover:underline">
            새로운 퀘스트 시작
          </button>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DiaryGallery entries={entries} onEntryClick={() => {}} />
      </main>
    </div>
  );
}
