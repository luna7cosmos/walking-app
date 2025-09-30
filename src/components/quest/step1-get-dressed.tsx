'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

type StepProps = {
  onNext: () => void;
  onShowGallery: () => void;
};

const quotes = [
  '가장 긴 여행도 한 걸음부터 시작됩니다.',
  '오늘 걷지 않으면, 내일은 뛰어야 할지도 모릅니다.',
  '세상의 모든 위대한 일은 작은 시작에서 비롯됩니다.',
  '문 밖에는 새로운 세상이 당신을 기다리고 있어요.',
  '가장 중요한 것은 눈에 보이지 않아. 마음으로 봐야 해.',
];

export default function Step1GetDressed({ onNext, onShowGallery }: StepProps) {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className="text-center animate-fade-in-up">
      <h1 className="text-4xl font-headline font-bold text-primary mb-4">1단계: 옷 입기</h1>
      <p className="text-xl italic text-foreground/90 font-semibold mb-8 max-w-lg">
        {quote || '산책할 준비를 해볼까요? 편안한 옷을 입는 것부터가 시작이에요. 아주 잘하고 있어요!'}
      </p>
      <Button onClick={onNext} size="lg" className="shadow-lg">준비 완료!</Button>
      <Button variant="link" onClick={onShowGallery} className="mt-8">
        갤러리 보기
      </Button>
    </div>
  );
}
