'use client';

import { useState } from 'react';
import QuestView from '@/components/quest/quest-view';
import DiaryGallery from '@/components/diary/diary-gallery';
import NewEntryDialog from '@/components/diary/new-entry-dialog';
import ActionSelectionDialog from '@/components/diary/action-selection-dialog';
import type { DiaryEntry } from '@/app/lib/types';
import RecordsHeader from '@/components/layout/records-header';
import { useDiary } from '@/contexts/DiaryContext';


export default function Home() {
  const [isQuestMode, setIsQuestMode] = useState(false);
  const { addEntry } = useDiary();

  const [isNewEntryDialogOpen, setIsNewEntryDialogOpen] = useState(false);
  const [isActionSelectionDialogOpen, setIsActionSelectionDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);

  const handleQuestComplete = (newEntry: Omit<DiaryEntry, 'id' | 'date'>) => {
    addEntry(newEntry);
    setIsQuestMode(false);
  };

  const handleShowGallery = () => {
    setIsQuestMode(false);
  };
  
  const handleStartQuest = () => {
    setIsQuestMode(true);
  }

  const handleEntryClick = (entry: DiaryEntry) => {
    setSelectedEntry(entry);
    setIsActionSelectionDialogOpen(true);
  };

  const handleEdit = () => {
    setIsNewEntryDialogOpen(true);
    setIsActionSelectionDialogOpen(false);
  };

  const handleNewEntry = () => {
    setSelectedEntry(null);
    setIsNewEntryDialogOpen(true);
  };
  
  if (isQuestMode) {
    return <QuestView onQuestComplete={handleQuestComplete} onShowGallery={handleShowGallery} />;
  }

  return (
    <div className="flex flex-col min-h-screen font-body">
      <RecordsHeader onStartQuest={handleStartQuest} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DiaryGallery onEntryClick={handleEntryClick} />
      </main>
      <NewEntryDialog
        isOpen={isNewEntryDialogOpen}
        onOpenChange={setIsNewEntryDialogOpen}
        entry={selectedEntry}
      />
      <ActionSelectionDialog
        isOpen={isActionSelectionDialogOpen}
        onOpenChange={setIsActionSelectionDialogOpen}
        onEdit={handleEdit}
        entryId={selectedEntry?.id}
      />
    </div>
  );
}
