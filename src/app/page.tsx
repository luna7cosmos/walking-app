'use client';

import { useState, useEffect } from 'react';
import type { DiaryEntry } from '@/app/lib/types';
import Header from '@/components/layout/header';
import DiaryGallery from '@/components/diary/diary-gallery';
import NewEntryDialog from '@/components/diary/new-entry-dialog';
import { initialDiaryEntries } from '@/app/lib/mock-data';

export default function Home() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setEntries(initialDiaryEntries);
  }, []);

  const addEntry = (newEntryData: Omit<DiaryEntry, 'id' | 'date'>) => {
    const newEntry: DiaryEntry = {
      ...newEntryData,
      id: `entry-${Date.now()}`,
      date: new Date(),
    };
    setEntries(prevEntries => [newEntry, ...prevEntries]);
    setIsDialogOpen(false);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header onNewEntry={() => setIsDialogOpen(true)} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DiaryGallery entries={entries} />
      </main>
      <NewEntryDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={addEntry}
      />
    </div>
  );
}
