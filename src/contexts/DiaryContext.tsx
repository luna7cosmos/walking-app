'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { DiaryEntry } from '@/app/lib/types';
import { initialDiaryEntries } from '@/app/lib/mock-data';

interface DiaryContextType {
  entries: DiaryEntry[];
  addEntry: (entry: Omit<DiaryEntry, 'id' | 'date'>) => void;
  updateEntry: (entry: DiaryEntry) => void;
  deleteEntry: (id: string) => void;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export function DiaryProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<DiaryEntry[]>(initialDiaryEntries.map(e => ({...e, id: e.id || `entry-${Math.random()}`})).sort((a,b) => b.date.getTime() - a.date.getTime()));

  const addEntry = (newEntry: Omit<DiaryEntry, 'id' | 'date'>) => {
    const entry: DiaryEntry = {
      ...newEntry,
      id: `entry-${Date.now()}`,
      date: new Date(),
    };
    setEntries(prevEntries => [entry, ...prevEntries].sort((a, b) => b.date.getTime() - a.date.getTime()));
  };

  const updateEntry = (updatedEntry: DiaryEntry) => {
    setEntries(prevEntries => 
      prevEntries.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry))
        .sort((a, b) => b.date.getTime() - a.date.getTime())
    );
  };

  const deleteEntry = (id: string) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
  };

  return (
    <DiaryContext.Provider value={{ entries, addEntry, updateEntry, deleteEntry }}>
      {children}
    </DiaryContext.Provider>
  );
}

export function useDiary() {
  const context = useContext(DiaryContext);
  if (context === undefined) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
}
