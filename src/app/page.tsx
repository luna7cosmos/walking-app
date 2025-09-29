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
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Sort entries by date descending to show newest first
    const sortedEntries = [...initialDiaryEntries].sort((a, b) => b.date.getTime() - a.date.getTime());
    setEntries(sortedEntries);
  }, []);

  const handleOpenDialog = (entry: DiaryEntry | null = null) => {
    setEditingEntry(entry);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingEntry(null);
    setIsDialogOpen(false);
  };

  const saveEntry = (entryData: Omit<DiaryEntry, 'id' | 'date'>, id?: string) => {
    if (id) {
      // Editing existing entry
      setEntries(prevEntries =>
        prevEntries.map(entry =>
          entry.id === id ? { ...entry, ...entryData, date: entry.date } : entry
        )
      );
    } else {
      // Adding new entry
      const newEntry: DiaryEntry = {
        ...entryData,
        id: `entry-${Date.now()}`,
        date: new Date(),
      };
      setEntries(prevEntries => [newEntry, ...prevEntries]);
    }
    handleCloseDialog();
  };
  
  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header onNewEntry={() => handleOpenDialog()} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DiaryGallery entries={entries} onEntryClick={handleOpenDialog} />
      </main>
      <NewEntryDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={saveEntry}
        entry={editingEntry}
      />
    </div>
  );
}
