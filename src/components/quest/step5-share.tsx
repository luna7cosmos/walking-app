'use client';

import { Button } from '@/components/ui/button';
import { BookCheck, Star, Award } from 'lucide-react';

type StepProps = {
  onNext: () => void;
};

export default function Step5Share({ onNext }: StepProps) {
  return (
    <div className="w-full max-w-md text-center animate-fade-in-up">
      <div className="flex justify-center mb-8">
        <Award className="w-24 h-24 text-primary" strokeWidth={1} />
      </div>
      <h1 className="flex items-center justify-center gap-3 text-4xl font-headline font-bold text-primary mb-4">
        <Star className="w-10 h-10" />
        참 잘했어요!
      </h1>
      <p className="text-lg text-muted-foreground mb-12">
        축하합니다! 오늘의 산책 퀘스트를 모두 완수하셨습니다.
      </p>

      <Button onClick={onNext} size="lg" className="shadow-lg">
        <BookCheck className="mr-2" />
        일기 갤러리로 가기
      </Button>
    </div>
  );
}
