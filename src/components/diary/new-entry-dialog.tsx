'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, MapPin, Loader2, Sparkles, BookText, BarChart, Route, Timer, Footprints } from 'lucide-react';
import { suggestWritingPrompts } from '@/ai/flows/suggest-writing-prompts';
import { useToast } from '@/hooks/use-toast';
import type { DiaryEntry } from '@/app/lib/types';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type NewEntryDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (entry: Omit<DiaryEntry, 'id' | 'date'>) => void;
};

export default function NewEntryDialog({ isOpen, onOpenChange, onSave }: NewEntryDialogProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [text, setText] = useState('');
  const [prompts, setPrompts] = useState<string[]>([]);
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [steps, setSteps] = useState('');

  const [isLocating, setIsLocating] = useState(false);
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const mapPlaceholder = PlaceHolderImages.find(p => p.id === 'map-placeholder');

  const resetState = () => {
    setImagePreview(null);
    setImageFile(null);
    setLocation(null);
    setText('');
    setPrompts([]);
    setDistance('');
    setTime('');
    setSteps('');
    setIsLocating(false);
    setIsGeneratingPrompts(false);
    setLocationError(null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        setLocationError('위치 정보를 가져올 수 없습니다. 권한을 확인해주세요.');
        toast({
          title: '오류',
          description: '위치 정보를 가져올 수 없습니다. 권한을 확인해주세요.',
          variant: 'destructive',
        });
        setIsLocating(false);
      }
    );
  };

  const handleGeneratePrompts = async () => {
    if (!imageFile) {
      toast({
        title: '사진 필요',
        description: 'AI 추천을 받으려면 먼저 사진을 올려주세요.',
        variant: 'destructive',
      });
      return;
    }
    setIsGeneratingPrompts(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = async () => {
        const photoDataUri = reader.result as string;
        const locationDescription = location ? `위도: ${location.lat.toFixed(4)}, 경도: ${location.lng.toFixed(4)}` : '어느 멋진 곳';
        const result = await suggestWritingPrompts({ photoDataUri, locationDescription });
        setPrompts(result.prompts);
      };
    } catch (error) {
      toast({
        title: 'AI 추천 생성 오류',
        description: 'AI 추천을 생성하는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingPrompts(false);
    }
  };

  const handleSave = () => {
    if (!imagePreview || !text) {
      toast({
        title: '필수 항목 누락',
        description: '사진과 일기 내용은 필수입니다.',
        variant: 'destructive',
      });
      return;
    }
    onSave({
      photoUrl: imagePreview,
      imageHint: 'user uploaded',
      location: {
        lat: location?.lat ?? 0,
        lng: location?.lng ?? 0,
        description: location ? `위도: ${location.lat.toFixed(4)}, 경도: ${location.lng.toFixed(4)}` : '알 수 없는 장소',
      },
      text: text,
      stats: {
        distance: distance ? parseFloat(distance) : undefined,
        time: time ? parseInt(time, 10) : undefined,
        steps: steps ? parseInt(steps, 10) : undefined,
      }
    });
    resetState();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if(!open) resetState();
        onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-lg md:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-headline text-primary text-2xl">새로운 산책 일기</DialogTitle>
        </DialogHeader>
        <ScrollArea className="pr-6 -mr-6">
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col gap-4">
              {imagePreview ? (
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border shadow-sm">
                  <Image src={imagePreview} alt="Uploaded preview" fill className="object-cover" />
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video w-full rounded-lg border-2 border-dashed border-muted-foreground/50 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                >
                  <Camera className="h-10 w-10 mb-2" />
                  <span className="font-semibold">사진 올리기</span>
                </button>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

              <Button onClick={handleLocation} disabled={isLocating} variant="outline">
                {isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                {location ? '위치 재설정' : '현재 위치 가져오기'}
              </Button>
              {location && (
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border shadow-sm">
                  <Image src={mapPlaceholder?.imageUrl || ''} data-ai-hint={mapPlaceholder?.imageHint || 'map aerial'} alt="Map" fill className="object-cover opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <MapPin className="h-8 w-8 text-destructive animate-pulse" />
                  </div>
                  <Badge variant="secondary" className="absolute bottom-2 right-2">{`위도: ${location.lat.toFixed(2)}, 경도: ${location.lng.toFixed(2)}`}</Badge>
                </div>
              )}
               {locationError && <p className="text-sm text-destructive">{locationError}</p>}

              <div className="space-y-3 pt-2">
                <Label className="flex items-center gap-2 text-sm font-medium"><BarChart className="w-4 h-4 text-muted-foreground"/>산책 기록 (선택)</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <Route className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="distance" type="number" placeholder="거리 (km)" value={distance} onChange={(e) => setDistance(e.target.value)} className="pl-8" />
                  </div>
                  <div className="relative">
                    <Timer className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="time" type="number" placeholder="시간 (분)" value={time} onChange={(e) => setTime(e.target.value)} className="pl-8" />
                  </div>
                  <div className="relative">
                    <Footprints className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="steps" type="number" placeholder="걸음 수" value={steps} onChange={(e) => setSteps(e.target.value)} className="pl-8" />
                  </div>
                </div>
              </div>

            </div>
            
            <div className="flex flex-col gap-4 h-full">
                <div className="flex-grow flex flex-col">
                    <label htmlFor="diary-text" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2"><BookText className="w-4 h-4"/>오늘의 산책은 어땠나요?</label>
                    <Textarea
                        id="diary-text"
                        placeholder="이곳에 감상을 기록해보세요..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="flex-grow text-base resize-none min-h-[150px]"
                    />
                </div>
              <Button onClick={handleGeneratePrompts} disabled={isGeneratingPrompts} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {isGeneratingPrompts ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                AI 글쓰기 추천
              </Button>
              {prompts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">추천 프롬프트:</h4>
                  <div className="flex flex-col gap-2">
                    {prompts.map((p, i) => (
                      <Button key={i} variant="outline" size="sm" className="text-left justify-start h-auto" onClick={() => setText(prev => `${prev}${prev ? '\n\n' : ''}${p}`)}>
                        <p className="whitespace-normal">{p}</p>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">취소</Button>
          </DialogClose>
          <Button onClick={handleSave}>저장하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
