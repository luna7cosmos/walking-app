'use client';

import { useState, useEffect } from 'react';
import type { DiaryEntry } from '@/app/lib/types';
import Header from '@/components/layout/header';
import DiaryGallery from '@/components/diary/diary-gallery';
import NewEntryDialog from '@/components/diary/new-entry-dialog';
import ActionSelectionDialog from '@/components/diary/action-selection-dialog';
import { initialDiaryEntries } from '@/app/lib/mock-data';

export default function Home() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isNewEntryDialogOpen, setIsNewEntryDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const sortedEntries = [...initialDiaryEntries].sort((a, b) => b.date.getTime() - a.date.getTime());
    setEntries(sortedEntries);
  }, []);

  const handleOpenNewEntryDialog = (entry: DiaryEntry | null = null) => {
    setSelectedEntry(entry);
    setIsNewEntryDialogOpen(true);
  };
  
  const handleEntryClick = (entry: DiaryEntry) => {
    setSelectedEntry(entry);
    setIsActionDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedEntry) {
      setEntries(prevEntries => prevEntries.filter(entry => entry.id !== selectedEntry.id));
    }
    setIsActionDialogOpen(false);
    setSelectedEntry(null);
  };

  const handleEdit = () => {
    setIsActionDialogOpen(false);
    if(selectedEntry){
        handleOpenNewEntryDialog(selectedEntry);
    }
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
    setIsNewEntryDialogOpen(false);
    setSelectedEntry(null);
  };
  
  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header onNewEntry={() => handleOpenNewEntryDialog()} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DiaryGallery entries={entries} onEntryClick={handleEntryClick} />
      </main>
      <NewEntryDialog
        isOpen={isNewEntryDialogOpen}
        onOpenChange={(isOpen) => {
            if (!isOpen) {
                setSelectedEntry(null);
            }
            setIsNewEntryDialogOpen(isOpen)
        }}
        onSave={saveEntry}
        entry={selectedEntry}
      />
      <ActionSelectionDialog
        isOpen={isActionDialogOpen}
        onOpenChange={setIsActionDialogOpen}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
