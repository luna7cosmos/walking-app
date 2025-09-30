'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

type StepProps = {
  onNext: () => void;
  onShowGallery: () => void;
};

const quotes = [
    '날씨를 확인하고, 완벽한 산책을 준비하세요.',
    '오늘의 하늘은 어떤 이야기를 들려줄까요?',
    '바람의 방향을 아는 것은 지혜의 시작입니다.',
    '햇살이든 비든, 모든 날씨는 그 자체로 선물입니다.',
    '준비된 자만이 날씨의 변덕에 웃을 수 있습니다.',
];

export default function Step0WeatherCheck({ onNext, onShowGallery }: StepProps) {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className="text-center animate-fade-in-up">
      <h1 className="text-4xl font-headline font-bold text-primary mb-4">1단계: 날씨와 온도 확인하기</h1>
      <p className="text-2xl italic text-foreground/90 font-semibold mb-8 max-w-lg">
        {quote || '산책 나가기 전, 잠시 창밖을 보거나 앱으로 날씨를 확인해 보세요. 옷차림을 결정하는 데 도움이 될 거예요.'}
      </p>
      <Button onClick={onNext} size="lg" className="shadow-lg">확인 완료!</Button>
       <Button variant="link" onClick={onShowGallery} className="mt-8">
        갤러리 보기
      </Button>
    </div>
  );
}
