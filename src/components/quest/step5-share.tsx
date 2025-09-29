'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

type StepProps = {
  photoDataUri: string;
  onNext: () => void;
};

export default function Step5Share({ photoDataUri, onNext }: StepProps) {
  
  const handleShare = () => {
    // Basic share functionality, can be improved
    if (navigator.share) {
      fetch(photoDataUri)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'walk-photo.jpg', { type: 'image/jpeg' });
          navigator.share({
            title: '나의 산책',
            text: '오늘 나의 산책을 공유합니다!',
            files: [file],
          })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
        });
    } else {
      alert("이 브라우저에서는 공유 기능을 지원하지 않습니다.");
    }
  };
  
  return (
    <div className="w-full max-w-md text-center animate-fade-in-up">
      <h1 className="text-4xl font-headline font-bold text-primary mb-4">5단계: 자랑하기</h1>
      <p className="text-lg text-muted-foreground mb-8">멋진 사진이네요! 친구들에게 자랑해보세요.</p>
      
      {photoDataUri && (
        <div className="relative aspect-video w-full rounded-lg overflow-hidden border shadow-sm mb-8">
          <Image src={photoDataUri} alt="Captured from walk" fill className="object-cover" />
        </div>
      )}

      <div className="flex gap-4 justify-center">
        <Button onClick={handleShare} size="lg" className="shadow-lg" variant="outline">
          <Share2 className="mr-2" />
          공유하기
        </Button>
        <Button onClick={onNext} size="lg" className="shadow-lg">
          일기 쓰러가기
        </Button>
      </div>
    </div>
  );
}
