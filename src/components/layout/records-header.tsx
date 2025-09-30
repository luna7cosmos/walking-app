'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type RecordsHeaderProps = {
  onStartQuest: () => void;
};

export default function RecordsHeader({ onStartQuest }: RecordsHeaderProps) {
  return (
    <header className="sticky top-0 z-20 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline">
            나의 산책 일기
          </h1>
        </div>
        <Button onClick={onStartQuest} variant="default" size="sm" className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          새로운 퀘스트
        </Button>
      </div>
    </header>
  );
}
