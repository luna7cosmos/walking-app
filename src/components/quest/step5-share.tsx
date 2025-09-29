'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BookCheck, Star } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type StepProps = {
  onNext: () => void;
};

export default function Step5Share({ onNext }: StepProps) {
  const trophyData = PlaceHolderImages.find(p => p.id === 'quest-complete-trophy');

  return (
    <div className="w-full max-w-md text-center animate-fade-in-up">
      <h1 className="flex items-center justify-center gap-3 text-4xl font-headline font-bold text-primary mb-4">
        <Star className="w-10 h-10" />
        참 잘했어요!
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        축하합니다! 오늘의 산책 퀘스트를 모두 완수하셨습니다.
      </p>

      <div className="w-2/3 mx-auto">
        <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-2">
          {trophyData ? (
            <Image 
              src={trophyData.imageUrl} 
              alt="참 잘했어요 도장" 
              fill 
              className="object-contain"
              data-ai-hint={trophyData.imageHint} 
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">도장 이미지 로딩 중...</p>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-8">출처: Gemini</p>
      </div>

      <Button onClick={onNext} size="lg" className="shadow-lg">
        <BookCheck className="mr-2" />
        일기 갤러리로 가기
      </Button>
    </div>
  );
}
