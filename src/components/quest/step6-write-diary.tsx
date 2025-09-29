'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { DiaryEntry } from '@/app/lib/types';
import { BookText, Sparkles, Save, BarChart, Route, Timer, Footprints, Clock, MapPin } from 'lucide-react';

type StepProps = {
  photoDataUri: string;
  prompts: string[];
  onSave: (newEntry: Omit<DiaryEntry, 'id' | 'date'>) => void;
};

export default function Step6WriteDiary({ photoDataUri, prompts, onSave }: StepProps) {
  const [text, setText] = useState('');
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState('');
  const [steps, setSteps] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  const duration = useMemo(() => {
    if (startTime && endTime) {
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      if (!isNaN(startH) && !isNaN(startM) && !isNaN(endH) && !isNaN(endM) && startH >= 0 && startH < 24 && startM >= 0 && startM < 60 && endH >= 0 && endH < 24 && endM >= 0 && endM < 60) {
        const startTotalMinutes = startH * 60 + startM;
        let endTotalMinutes = endH * 60 + endM;
        if (endTotalMinutes < startTotalMinutes) {
          // Handle overnight case
          endTotalMinutes += 24 * 60;
        }
        return endTotalMinutes - startTotalMinutes;
      }
    }
    return null;
  }, [startTime, endTime]);

  const handleSave = () => {
    const calculatedDuration = duration;
    onSave({
      photoUrl: photoDataUri,
      imageHint: 'user uploaded',
      location: { description: location || '나의 산책길' },
      text: text,
      stats: {
        distance: distance ? parseInt(distance, 10) : undefined,
        time: calculatedDuration !== null ? calculatedDuration : undefined,
        steps: steps ? parseInt(steps, 10) : undefined,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
      }
    });
  };

  return (
    <div className="w-full max-w-4xl text-center animate-fade-in-up p-4">
      <h1 className="text-4xl font-headline font-bold text-primary mb-4">5단계: 산책일기 쓰기</h1>
      <p className="text-lg text-muted-foreground mb-8">오늘의 산책은 어땠나요? 이제 감상을 기록해주세요.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start text-left">
        <div className="flex flex-col gap-4">
            {photoDataUri ? (
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border shadow-sm">
                <Image src={photoDataUri} alt="Captured from walk" fill className="object-cover" />
              </div>
            ) : (
              <div className="relative aspect-video w-full rounded-lg bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">사진을 건너뛰었습니다.</p>
              </div>
            )}
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
            <label htmlFor="diary-text" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2"><BookText className="w-4 h-4"/>오늘의 감상</label>
            <Textarea
                id="diary-text"
                placeholder="이곳에 감상을 기록해보세요..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-grow text-base resize-none min-h-[150px]"
            />
          </div>
          {prompts.length > 0 && (
            <div className="space-y-2">
              <h4 className="flex items-center gap-2 text-sm font-medium"><Sparkles className="w-4 h-4 text-accent"/> AI 글쓰기 추천</h4>
              <div className="flex flex-col gap-2">
                {prompts.map((p, i) => (
                  <Button key={i} variant="outline" size="sm" className="text-left justify-start h-auto" onClick={() => setText(prev => `${prev}${prev ? '\n\n' : ''}${p}`)}>
                    <p className="whitespace-normal">{p}</p>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Button onClick={handleSave} size="lg" className="mt-8 shadow-lg">
        <Save className="mr-2" />
        일기 저장하고 계속하기
      </Button>
    </div>
  );
}
