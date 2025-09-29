'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { initialDiaryEntries } from '@/app/lib/mock-data';
import type { DiaryEntry } from '@/app/lib/types';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DiaryCard from '@/components/diary/diary-card';
import RecordsHeader from '@/components/layout/records-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ko } from 'date-fns/locale';

export default function RecordsPage() {
  const [entries] = useState<DiaryEntry[]>(initialDiaryEntries);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const recordedDates = useMemo(() => entries.map(entry => entry.date), [entries]);

  const entriesForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return entries.filter(entry => 
      entry.date.getDate() === selectedDate.getDate() &&
      entry.date.getMonth() === selectedDate.getMonth() &&
      entry.date.getFullYear() === selectedDate.getFullYear()
    );
  }, [selectedDate, entries]);

  const handleStartQuest = () => {
    // This would ideally use a router to navigate to a quest page
    // For now, we just log it. A full implementation would require QuestView integration.
    console.log("Starting new quest...");
  };

  return (
    <div className="flex flex-col min-h-screen font-body">
      <RecordsHeader onStartQuest={handleStartQuest} activeView="records" />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  modifiers={{ recorded: recordedDates }}
                  modifiersClassNames={{ recorded: 'bg-primary/20 rounded-full' }}
                  locale={ko}
                  className="w-full"
                />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold font-headline text-primary mb-4">
              {selectedDate ? selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '날짜를 선택하세요'}
            </h2>
            {entriesForSelectedDate.length > 0 ? (
              <div className="space-y-6">
                {entriesForSelectedDate.map((entry, index) => (
                  <DiaryCard key={entry.id} entry={entry} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">이 날짜에는 산책 기록이 없습니다.</p>
                <Button onClick={handleStartQuest}>
                  <Plus className="mr-2"/>
                  새로운 산책 기록하기
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
