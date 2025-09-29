'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Share2, BookCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type StepProps = {
  photoDataUri: string;
  onNext: () => void;
};

export default function Step5Share({ photoDataUri, onNext }: StepProps) {
  const { toast } = useToast();
  
  const handleShare = async () => {
    if (!photoDataUri) {
      toast({
        title: '공유할 사진 없음',
        description: '공유할 사진이 없습니다.',
        variant: 'destructive',
      });
      return;
    }

    if (navigator.share) {
      try {
        const response = await fetch(photoDataUri);
        const blob = await response.blob();
        const file = new File([blob], 'walk-photo.jpg', { type: blob.type });
        
        await navigator.share({
          title: '나의 산책',
          text: '오늘 나의 산책을 공유합니다!',
          files: [file],
        });
        console.log('Successful share');
      } catch (error) {
        console.error('Error sharing', error);
        toast({
          title: '공유 실패',
          description: '사진을 공유하는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: '공유 기능 미지원',
        description: '이 브라우저에서는 공유 기능을 지원하지 않습니다.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="w-full max-w-md text-center animate-fade-in-up">
      <h1 className="text-4xl font-headline font-bold text-primary mb-4">6단계: 자랑하기</h1>
      <p className="text-lg text-muted-foreground mb-8">멋진 사진이네요! 친구들에게 자랑하거나 퀘스트를 완료하세요.</p>
      
      {photoDataUri ? (
        <div className="relative aspect-video w-full rounded-lg overflow-hidden border shadow-sm mb-8">
          <Image src={photoDataUri} alt="Captured from walk" fill className="object-cover" />
        </div>
      ) : (
        <div className="relative aspect-video w-full rounded-lg bg-muted flex items-center justify-center border shadow-sm mb-8">
          <p className="text-muted-foreground">공유할 사진이 없습니다.</p>
        </div>
      )}

      <div className="flex gap-4 justify-center">
        <Button onClick={handleShare} size="lg" className="shadow-lg" variant="outline" disabled={!photoDataUri}>
          <Share2 className="mr-2" />
          공유하기
        </Button>
        <Button onClick={onNext} size="lg" className="shadow-lg">
          <BookCheck className="mr-2" />
          퀘스트 완료
        </Button>
      </div>
    </div>
  );
}
