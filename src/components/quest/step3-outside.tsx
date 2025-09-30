'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

type StepProps = {
  onNext: () => void;
};

const quotes = [
  '그리고 갑자기, 모든 노래가 당신에 관한 것이 되었습니다.',
  '나는 숲으로 들어갔다. 왜냐하면 나는 의도적으로 살고 싶었기 때문이다.',
  '자연 속에서 걷는 것은 영혼을 집으로 데려오는 것과 같다.',
  '세상을 보라, 위험한 일도 마다하지 말고, 벽 뒤에 숨지도 말고, 다가가 서로를 알아가고 느끼는 것이다. 그것이 바로 인생의 목적이다.',
  '바람이 어디로 부는지 신경 쓰지 말고, 당신의 돛을 조정하여 목적지에 도달하라.',
];

export default function Step3Outside({ onNext }: StepProps) {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className="text-center animate-fade-in-up">
      <h1 className="text-4xl font-headline font-bold text-primary mb-4">3단계: 집 밖으로!</h1>
      <p className="text-xl italic text-foreground/90 font-semibold mb-8 max-w-lg">
        {quote || '문을 열고 밖으로 나오셨군요! 새로운 공기가 당신을 기다립니다. 정말 멋진 시작이에요!'}
      </p>
      <Button onClick={onNext} size="lg" className="shadow-lg">밖으로 나왔어요!</Button>
    </div>
  );
}
