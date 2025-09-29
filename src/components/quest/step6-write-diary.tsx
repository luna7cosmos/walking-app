'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { DiaryEntry } from '@/app/lib/types';
import { BookText, Sparkles } from 'lucide-react';

type StepProps = {
  photoDataUri: string;
  prompts: string[];
  onSave: (newEntry: Omit<DiaryEntry, 'id' | 'date'>) => void;
};

export default function Step6WriteDiary({ photoDataUri, prompts, onSave }: StepProps) {
  const [text, setText] = useState('');

  const handleSave = () => {
    onSave({
      photoUrl: photoDataUri,
      imageHint: 'user uploaded',
      location: { description: '나의 산책길' },
      text: text,
    });
  };

  return (
    <div className="w-full max-w-lg text-center animate-fade-in-up p-4">
      <h1 className="text-4xl font-headline font-bold text-primary mb-4">6단계: 산책일기 쓰기</h1>
      <p className="text-lg text-muted-foreground mb-8">오늘의 산책은 어땠나요? 마지막으로 감상을 기록해주세요.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start text-left">
        {photoDataUri && (
          <div className="relative aspect-video w-full rounded-lg overflow-hidden border shadow-sm">
            <Image src={photoDataUri} alt="Captured from walk" fill className="object-cover" />
          </div>
        )}
        
        <div className="flex flex-col gap-4 h-full">
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
        일기 저장하고 완료!
      </Button>
    </div>
  );
}
