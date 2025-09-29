'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BookCheck, Award } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type StepProps = {
  onNext: () => void;
};

export default function Step5Share({ onNext }: StepProps) {
  const trophyImage = PlaceHolderImages.find(p => p.id === 'quest-complete-trophy');

  return (
    <div className="w-full max-w-md text-center animate-fade-in-up">
      <h1 className="flex items-center justify-center gap-3 text-4xl font-headline font-bold text-primary mb-4">
        <Award className="w-10 h-10" />
        퀘스트 완료!
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        축하합니다! 오늘의 산책 퀘스트를 모두 완수하셨습니다.
      </p>

      <div className="relative aspect-video w-full rounded-lg overflow-hidden border shadow-sm mb-2">
        {trophyImage ? (
           <Image 
            src={trophyImage.imageUrl} 
            alt="퀘스트 완료 트로피" 
            fill 
            className="object-cover"
            data-ai-hint={trophyImage.imageHint} 
           />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
             <p className="text-muted-foreground">트로피 이미지 로딩 중...</p>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-8">출처: Gemini</p>

      <div className="flex gap-4 justify-center">
        <Button onClick={onNext} size="lg" className="shadow-lg">
          <BookCheck className="mr-2" />
          일기 갤러리로 가기
        </Button>
      </div>
    </div>
  );
}
