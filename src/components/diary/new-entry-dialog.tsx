'use client';

import { useEffect } from 'react';
import type { DiaryEntry } from '@/app/lib/types';
import { useDiary } from '@/contexts/DiaryContext';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

type NewEntryDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  entry: DiaryEntry | null;
};

export default function NewEntryDialog({ isOpen, onOpenChange, entry }: NewEntryDialogProps) {
  const { addEntry, updateEntry } = useDiary();
  
  const resetState = () => {
    // No state to reset anymore
  };
  
  useEffect(() => {
    if (isOpen) {
      if (entry) {
        // No fields to populate
      } else {
        resetState();
      }
    }
  }, [isOpen, entry]);

  const handleSave = () => {
    const entryData = {};

    if (entry && entry.id) {
        updateEntry({ ...entry, ...entryData, date: entry.date });
    } else {
        addEntry(entryData);
    }

    handleClose(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetState();
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg md:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-headline text-primary text-2xl">{entry ? '산책 일기 수정' : '새로운 산책 일기'}</DialogTitle>
           <DialogDescription>
            {entry ? '이 날짜의 산책 기록을 수정합니다.' : '오늘 날짜로 새로운 산책 기록을 추가합니다.'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-center">
          <p>오늘의 산책을 기록합니다.</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">취소</Button>
          </DialogClose>
          <Button onClick={handleSave}>저장하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
