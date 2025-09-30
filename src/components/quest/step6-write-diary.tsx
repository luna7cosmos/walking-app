'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { DiaryEntry } from '@/app/lib/types';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type StepProps = {
  onSave: (newEntry: Omit<DiaryEntry, 'id' | 'date'>) => void;
};

const quotes = [
  '당신의 경험을 기록하세요. 당신의 생각을 기록하세요. 당신의 목소리가 중요합니다.',
  '일기는 당신 자신과 나눌 수 있는 가장 사적인 대화입니다.',
  '쓰기는 인간의 형태를 한 생각입니다.',
  '빈 페이지는 가능성으로 가득 차 있습니다.',
  '당신의 이야기를 들려주세요. 세상이 당신의 목소리를 기다리고 있습니다.',
];


export default function Step6WriteDiary({ onSave }: StepProps) {
  const [quote, setQuote] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);
  

  const handleSave = () => {
    const entryData = {};
    onSave(entryData);
  };

  return (
    <div className="w-full max-w-4xl text-center animate-fade-in-up p-4">
      <h1 className="text-4xl font-headline font-bold text-primary mb-4">4단계: 산책일기 쓰기</h1>
      <p className="text-xl italic text-foreground/90 font-semibold mb-8 max-w-2xl mx-auto">
        {quote || '거의 다 왔어요! 오늘의 산책은 어땠나요? 이제 감상을 기록해주세요.'}
      </p>
      
      <Button onClick={handleSave} size="lg" className="mt-8 shadow-lg">
        <Save className="mr-2" />
        일기 저장하고 계속하기
      </Button>
    </div>
  );
}
