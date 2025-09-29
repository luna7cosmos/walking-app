'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type HeaderProps = {
  onNewEntry: () => void;
};

export default function Header({ onNewEntry }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline">산책 일기</h1>
        <Button onClick={onNewEntry} variant="default" size="sm" className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          새로운 일기
        </Button>
      </div>
    </header>
  );
}
