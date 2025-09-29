'use client';

import { Button } from '@/components/ui/button';

type StepProps = {
  onNext: () => void;
  onShowGallery: () => void;
};

export default function Step1GetDressed({ onNext, onShowGallery }: StepProps) {
  return (
    <div className="text-center animate-fade-in-up">
      <h1 className="text-4xl font-headline font-bold text-primary mb-4">1단계: 옷 입기</h1>
      <p className="text-lg text-muted-foreground mb-8">산책할 준비를 해볼까요? 편안한 옷을 입어보세요!</p>
      <Button onClick={onNext} size="lg" className="shadow-lg">준비 완료!</Button>
      <Button variant="link" onClick={onShowGallery} className="mt-8">
        갤러리 보기
      </Button>
    </div>
  );
}
