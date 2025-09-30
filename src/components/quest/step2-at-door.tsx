'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

type StepProps = {
  onNext: () => void;
};

const quotes = [
  '세상은 문 밖에 있다.',
  '모든 문은 새로운 기회로 열립니다.',
  '탐험은 문을 여는 것에서 시작됩니다.',
  '길을 떠나기 전, 우리는 모두 문 앞에 서 있습니다.',
  '두드려라, 그러면 열릴 것이다.',
];

export default function Step2AtDoor({ onNext }: StepProps) {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className="text-center animate-fade-in-up">
      <h1 className="text-4xl font-headline font-bold text-primary mb-4">2단계: 현관문 앞에 서서 이어폰과 데이터 켜기</h1>
      <p className="text-2xl italic text-foreground/90 font-semibold mb-8 max-w-lg">
        {quote || '좋아요! 이제 현관문 앞으로 나아갔군요. 정말 대단해요!'}
      </p>
      <Button onClick={onNext} size="lg" className="shadow-lg">도착!</Button>
    </div>
  );
}
