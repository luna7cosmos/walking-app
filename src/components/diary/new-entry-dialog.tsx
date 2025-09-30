'use client';

import { useState, useEffect, useMemo } from 'react';
import { BookText, BarChart, Route, Timer, Footprints, Clock, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { DiaryEntry } from '@/app/lib/types';
import { useDiary } from '@/contexts/DiaryContext';
import { z } from 'zod';


import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type NewEntryDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  entry: DiaryEntry | null;
};

const diaryEntrySchema = z.object({
  location: z.object({
    description: z.string().max(100),
  }),
  text: z.string().max(5000),
  stats: z.object({
    distance: z.number().int().positive().optional(),
    time: z.number().int().positive().optional(),
    steps: z.number().int().positive().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  }),
});


export default function NewEntryDialog({ isOpen, onOpenChange, entry }: NewEntryDialogProps) {
  const [text, setText] = useState('');
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState('');
  const [steps, setSteps] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const { addEntry, updateEntry } = useDiary();

  const { toast } = useToast();
  
  const duration = useMemo(() => {
    if (startTime && endTime) {
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      if (!isNaN(startH) && !isNaN(startM) && !isNaN(endH) && !isNaN(endM) && startH >= 0 && startH < 24 && startM >= 0 && startM < 60 && endH >= 0 && endH < 24 && endM >= 0 && endM < 60) {
        const startTotalMinutes = startH * 60 + startM;
        let endTotalMinutes = endH * 60 + endM;
        if (endTotalMinutes < startTotalMinutes) {
          endTotalMinutes += 24 * 60;
        }
        return endTotalMinutes - startTotalMinutes;
      }
    }
    return null;
  }, [startTime, endTime]);


  const resetState = () => {
    setText('');
    setLocation('');
    setDistance('');
    setSteps('');
    setStartTime('');
    setEndTime('');
  };
  
  useEffect(() => {
    if (isOpen) {
      if (entry) {
        setText(entry.text);
        setLocation(entry.location.description);
        setDistance(entry.stats?.distance?.toString() ?? '');
        setSteps(entry.stats?.steps?.toString() ?? '');
        setStartTime(entry.stats?.startTime ?? '');
        setEndTime(entry.stats?.endTime ?? '');
      } else {
        resetState();
      }
    }
  }, [isOpen, entry]);

  const handleSave = () => {
    const calculatedDuration = duration;
    const entryData = {
      location: {
        description: location || '나의 산책길',
      },
      text: text,
      stats: {
        distance: distance ? parseInt(distance, 10) : undefined,
        time: calculatedDuration !== null ? calculatedDuration : undefined,
        steps: steps ? parseInt(steps, 10) : undefined,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
      }
    };

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
        </DialogHeader>
        <ScrollArea className="pr-6 -mr-6">
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col gap-4">
              <div className="space-y-3 pt-2">
                <Label className="flex items-center gap-2 text-sm font-medium"><BarChart className="w-4 h-4 text-muted-foreground"/>산책 기록 (선택)</Label>
                
                <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="start-time" type="time" placeholder="시작 (HH:mm)" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="pl-8" />
                    </div>
                    <div className="relative">
                       <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                       <Input id="end-time" type="time" placeholder="종료 (HH:mm)" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="pl-8" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <Route className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="distance" type="number" placeholder="거리 (m)" value={distance} onChange={(e) => setDistance(e.target.value)} className="pl-8" />
                  </div>
                   <div className="relative">
                    <Timer className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="time" type="number" placeholder="총 시간(분)" value={duration !== null ? duration : ''} readOnly className="pl-8 bg-muted/50" />
                  </div>
                  <div className="relative">
                    <Footprints className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="steps" type="number" placeholder="걸음 수" value={steps} onChange={(e) => setSteps(e.target.value)} className="pl-8" />
                  </div>
                </div>
              </div>

            </div>
            
            <div className="flex flex-col gap-4 h-full">
                <div>
                     <label htmlFor="location-text" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2"><MapPin className="w-4 h-4"/>어디를 산책했나요?</label>
                      <Input
                          id="location-text"
                          placeholder="예: 서울숲, 집 앞 공원"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                      />
                </div>
                <div className="flex-grow flex flex-col">
                  <label htmlFor="diary-text" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2"><BookText className="w-4 h-4"/>오늘의 산책은 어땠나요?</label>
                  <Textarea
                      id="diary-text"
                      placeholder="이곳에 감상을 기록해보세요..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="flex-grow text-base resize-none min-h-[150px]"
                  />
                </div>
            </div>
          </div>
        </div>
        </ScrollArea>
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
