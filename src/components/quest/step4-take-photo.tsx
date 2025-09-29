'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { suggestWritingPrompts } from '@/ai/flows/suggest-writing-prompts';

type StepProps = {
  onPhotoTaken: (photoDataUri: string, prompts: string[]) => void;
};

export default function Step4TakePhoto({ onPhotoTaken }: StepProps) {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const getCameraPermission = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: '카메라를 지원하지 않는 환경입니다.',
        description: '이 브라우저에서는 카메라 기능을 사용할 수 없습니다.',
      });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setHasCameraPermission(true);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: '카메라 접근 권한 필요',
        description: '산책 사진을 찍으려면 카메라 권한을 허용해주세요.',
      });
    }
  };

  useEffect(() => {
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, []);

  const handleTakePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsProcessing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    const photoDataUri = canvas.toDataURL('image/jpeg');

    try {
      const result = await suggestWritingPrompts({ photoDataUri, locationDescription: '산책 중' });
      onPhotoTaken(photoDataUri, result.prompts);
    } catch (error) {
      toast({
        title: 'AI 추천 생성 오류',
        description: 'AI 글쓰기 추천을 생성하는 중 오류가 발생했습니다. 사진만으로 진행합니다.',
        variant: 'destructive',
      });
      onPhotoTaken(photoDataUri, []);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md text-center animate-fade-in-up">
      <h1 className="text-4xl font-headline font-bold text-primary mb-4">4단계: 산책 사진 찍기</h1>
      <p className="text-lg text-muted-foreground mb-8">지금 당신의 눈 앞에 있는 풍경을 사진으로 남겨보세요.</p>
      
      {showCamera ? (
        <>
          <div className="relative aspect-video w-full rounded-lg overflow-hidden border shadow-sm bg-muted">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {hasCameraPermission === false && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>카메라를 사용할 수 없습니다</AlertTitle>
              <AlertDescription>
                카메라 접근 권한을 허용하거나, 지원되는 브라우저에서 다시 시도해주세요.
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={handleTakePhoto} size="lg" className="mt-8 shadow-lg" disabled={hasCameraPermission !== true || isProcessing}>
            {isProcessing ? <Loader2 className="mr-2 animate-spin" /> : <Camera className="mr-2" />}
            {isProcessing ? '처리 중...' : '사진 찍기'}
          </Button>
        </>
      ) : (
        <div className="aspect-video w-full rounded-lg border-2 border-dashed border-muted-foreground/50 flex flex-col items-center justify-center text-muted-foreground bg-muted/20 p-4">
            <Camera className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-lg font-medium mb-2 text-foreground">카메라 사용하기</h3>
            <p className="text-sm text-muted-foreground mb-6">산책의 순간을 기록하려면 카메라 접근 권한이 필요합니다.</p>
            <Button onClick={getCameraPermission}>카메라 사용</Button>
        </div>
      )}
    </div>
  );
}
