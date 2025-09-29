'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type RecordsHeaderProps = {
  onStartQuest: () => void;
  activeView: 'gallery' | 'records';
};

export default function RecordsHeader({ onStartQuest, activeView }: RecordsHeaderProps) {
  return (
    <header className="sticky top-0 z-20 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline hidden sm:block">
            나의 산책 일기
          </h1>
          <nav className="flex items-center gap-4">
            <Link href="/" className={cn(
              "text-sm font-medium transition-colors",
              activeView === 'gallery' ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}>
              일기 갤러리
            </Link>
            <Link href="/records" className={cn(
              "text-sm font-medium transition-colors",
              activeView === 'records' ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}>
              나의 산책 기록
            </Link>
          </nav>
        </div>
        <Button onClick={onStartQuest} variant="default" size="sm" className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          새로운 퀘스트
        </Button>
      </div>
    </header>
  );
}
