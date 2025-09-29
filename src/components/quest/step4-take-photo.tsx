'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Upload, Loader2, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { suggestWritingPrompts } from '@/ai/flows/suggest-writing-prompts';

type StepProps = {
  onPhotoTaken: (photoDataUri: string, prompts: string[]) => void;
  onSkip: () => void;
};

const quotes = [
  '사진은 시간을 멈추게 하는 유일한 방법입니다.',
  '순간을 포착하고, 영원히 간직하세요.',
  '모든 사진에는 이야기가 담겨 있습니다.',
  '오늘은 내 남은 인생의 첫날이다.',
  '인생은 카메라와 같아요. 좋은 것을 담으려면 초점을 맞춰야 해요.',
];

export default function Step4TakePhoto({ onPhotoTaken, onSkip }: StepProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessPhoto = async () => {
    if (!imagePreview) {
      toast({
        variant: 'destructive',
        title: '사진 없음',
        description: '먼저 사진을 선택해주세요.',
      });
      return;
    }
    setIsProcessing(true);

    try {
      const result = await suggestWritingPrompts({ photoDataUri: imagePreview, locationDescription: '산책 중' });
      onPhotoTaken(imagePreview, result.prompts);
    } catch (error) {
      toast({
        title: 'AI 추천 생성 오류',
        description: 'AI 글쓰기 추천을 생성하는 중 오류가 발생했습니다. 사진만으로 진행합니다.',
        variant: 'destructive',
      });
      onPhotoTaken(imagePreview, []);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md text-center animate-fade-in-up">
      <h1 className="text-4xl font-headline font-bold text-primary mb-4">4단계: 산책 사진 선택</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-lg">
        {quote || '벌써 산책을 즐기고 계시는군요! 이번 산책을 가장 잘 나타내는 사진을 선택해주세요.'}
      </p>
      
      <div className="aspect-video w-full rounded-lg border-2 border-dashed border-muted-foreground/50 flex flex-col items-center justify-center text-muted-foreground bg-muted/20 p-4 mb-8">
        {imagePreview ? (
            <div className="relative w-full h-full">
                <Image src={imagePreview} alt="Selected preview" fill className="object-contain rounded-md" />
            </div>
        ) : (
          <>
            <Upload className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-lg font-medium mb-2 text-foreground">사진 선택하기</h3>
            <p className="text-sm text-muted-foreground">기기 갤러리에서 사진을 고릅니다.</p>
          </>
        )}
      </div>
      <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

      <div className="flex justify-center items-center gap-4">
        <Button onClick={() => fileInputRef.current?.click()} variant="outline" disabled={isProcessing}>
            {imagePreview ? '사진 변경' : '사진 선택'}
        </Button>

        <Button onClick={handleProcessPhoto} size="lg" className="shadow-lg" disabled={!imagePreview || isProcessing}>
          {isProcessing ? <Loader2 className="mr-2 animate-spin" /> : null}
          {isProcessing ? '처리 중...' : '사진으로 계속하기'}
        </Button>
      </div>

      <Button onClick={onSkip} variant="link" className="mt-8" disabled={isProcessing}>
          <SkipForward className="mr-2"/>
          사진 없이 계속하기
      </Button>
    </div>
  );
}
