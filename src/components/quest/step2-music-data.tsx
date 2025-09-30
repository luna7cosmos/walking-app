'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

type StepProps = {
  onNext: () => void;
};

const quotes = [
  '음악은 감정의 언어입니다.',
  '데이터는 세상을 이해하는 새로운 눈입니다.',
  '리듬에 맞춰 걸으면, 발걸음이 가벼워져요.',
  '세상의 모든 지식은 당신의 손 안에 있습니다.',
  '음악과 함께라면, 어떤 길이든 외롭지 않아요.',
];

export default function Step2MusicData({ onNext }: StepProps) {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className="text-center animate-fade-in-up">
      <h1 className="text-4xl font-headline font-bold text-primary mb-4">2단계: 이어폰과 데이터 켜기</h1>
      <p className="text-2xl italic text-foreground/90 font-semibold mb-8 max-w-lg mx-auto">
        {quote || '산책길의 BGM을 준비하고, 세상과 연결될 준비를 하세요.'}
      </p>
      <Button onClick={onNext} size="lg" className="shadow-lg">준비 완료!</Button>
    </div>
  );
}
