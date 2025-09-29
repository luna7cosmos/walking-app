'use client';

import { Button } from '@/components/ui/button';

type StepProps = {
  onNext: () => void;
};

export default function Step3Outside({ onNext }: StepProps) {
  return (
    <div className="text-center animate-fade-in-up">
      <h1 className="text-4xl font-headline font-bold text-primary mb-4">3단계: 집 밖으로!</h1>
      <p className="text-lg text-muted-foreground mb-8">문을 열고 나가보세요. 새로운 공기가 당신을 기다립니다.</p>
      <Button onClick={onNext} size="lg" className="shadow-lg">밖으로 나왔어요!</Button>
    </div>
  );
}
