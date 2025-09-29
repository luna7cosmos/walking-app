'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BookCheck, Award, Upload } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type StepProps = {
  onNext: () => void;
};

export default function Step5Share({ onNext }: StepProps) {
  const defaultTrophyImage = PlaceHolderImages.find(p => p.id === 'quest-complete-trophy');
  const [trophyImage, setTrophyImage] = useState(defaultTrophyImage?.imageUrl);
  const [imageHint, setImageHint] = useState(defaultTrophyImage?.imageHint);
  const [imageSource, setImageSource] = useState('Gemini');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTrophyImage(reader.result as string);
        setImageHint('user uploaded');
        setImageSource('사용자');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-md text-center animate-fade-in-up">
      <h1 className="flex items-center justify-center gap-3 text-4xl font-headline font-bold text-primary mb-4">
        <Award className="w-10 h-10" />
        퀘스트 완료!
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        축하합니다! 오늘의 산책 퀘스트를 모두 완수하셨습니다.
      </p>

      <div className="w-2/3 mx-auto">
        <div className="relative aspect-square w-full rounded-lg overflow-hidden border shadow-sm mb-2">
          {trophyImage ? (
            <Image 
              src={trophyImage} 
              alt="퀘스트 완료 트로피" 
              fill 
              className="object-cover"
              data-ai-hint={imageHint} 
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">트로피 이미지 로딩 중...</p>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-8">출처: {imageSource}</p>
      </div>

      <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          <Upload className="mr-2"/>
          트로피 사진 변경
        </Button>
        <Button onClick={onNext} size="lg" className="shadow-lg">
          <BookCheck className="mr-2" />
          일기 갤러리로 가기
        </Button>
      </div>
    </div>
  );
}
