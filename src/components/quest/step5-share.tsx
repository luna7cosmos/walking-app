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
    const shareData: ShareData = {
        title: '나의 산책',
        text: '오늘 나의 산책을 공유합니다!',
    };

    if (!navigator.share) {
        toast({
            title: '공유 기능 미지원',
            description: '이 브라우저에서는 공유 기능을 지원하지 않습니다.',
            variant: 'destructive',
        });
        return;
    }

    if (photoDataUri && navigator.canShare && navigator.canShare({ files: [] })) {
        try {
            const response = await fetch(photoDataUri);
            const blob = await response.blob();
            const file = new File([blob], 'walk-photo.jpg', { type: blob.type });
            shareData.files = [file];
        } catch (error) {
            console.error('Error creating file from data URI', error);
            toast({
                title: '사진 처리 오류',
                description: '공유할 사진을 처리하는 중 오류가 발생했습니다.',
                variant: 'destructive',
            });
            // 사진 없이 텍스트만 공유하도록 파일 공유 시도를 중단합니다.
            shareData.files = undefined;
        }
    }

    try {
        if (shareData.files) {
             // 파일 공유를 먼저 시도합니다.
            await navigator.share(shareData);
            console.log('Successful share with file');
        } else {
            // 파일 공유가 불가능하거나 실패한 경우 텍스트만 공유합니다.
            await navigator.share({title: shareData.title, text: shareData.text});
            console.log('Successful share with text only');
        }
    } catch (error) {
        console.error('Error sharing', error);
        // 사용자가 공유를 취소한 경우 (AbortError) 외의 에러만 토스트를 띄웁니다.
        if ((error as DOMException).name !== 'AbortError') {
             toast({
                title: '공유 실패',
                description: '공유하는 중 오류가 발생했습니다. 현재 환경에서 지원되지 않을 수 있습니다.',
                variant: 'destructive',
            });
        }
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
        <Button onClick={handleShare} size="lg" className="shadow-lg" variant="outline">
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
