'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BookCheck } from 'lucide-react';

type StepProps = {
  onNext: () => void;
};

const quotes = [
  '잘했어, 넌 할 수 있어!',
  '오늘도 해냈군요! 정말 자랑스러워요.',
  '당신의 노력은 결코 헛되지 않아요. 멋진 하루였어요!',
  '수고했어요! 오늘의 작은 성공이 내일의 큰 기쁨을 가져다줄 거예요.',
  '참 잘했어요! 당신은 이미 충분히 빛나고 있어요.',
];

export default function Step8Share({ onNext }: StepProps) {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className="w-full max-w-md text-center animate-fade-in-up">
      <h1 className="flex items-center justify-center gap-3 text-4xl font-headline font-bold text-primary mb-4">
        퀘스트 완료!
      </h1>
      <p className="text-2xl italic text-foreground/90 font-semibold mb-12">
        {quote || '축하합니다! 오늘의 산책 퀘스트를 모두 완수하셨습니다.'}
      </p>

      <Button onClick={onNext} size="lg" className="shadow-lg">
        <BookCheck className="mr-2" />
        일기 갤러리로 가기
      </Button>
    </div>
  );
}
