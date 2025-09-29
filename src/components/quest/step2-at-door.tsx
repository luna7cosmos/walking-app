'use client';

import { Button } from '@/components/ui/button';

type StepProps = {
  onNext: () => void;
};

export default function Step2AtDoor({ onNext }: StepProps) {
  return (
    <div className="text-center animate-fade-in-up">
      <h1 className="text-4xl font-headline font-bold text-primary mb-4">2단계: 현관문 앞에 서기</h1>
      <p className="text-lg text-muted-foreground mb-8">좋아요! 이제 현관문 앞으로 나아가 보세요.</p>
      <Button onClick={onNext} size="lg" className="shadow-lg">도착!</Button>
    </div>
  );
}
