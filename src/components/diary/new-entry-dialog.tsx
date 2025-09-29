'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Camera, Loader2, Sparkles, BookText, BarChart, Route, Timer, Footprints, Clock } from 'lucide-react';
import { suggestWritingPrompts } from '@/ai/flows/suggest-writing-prompts';
import { useToast } from '@/hooks/use-toast';
import type { DiaryEntry } from '@/app/lib/types';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type NewEntryDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (entry: Omit<DiaryEntry, 'id' | 'date'>, id?: string) => void;
  entry: DiaryEntry | null;
};

export default function NewEntryDialog({ isOpen, onOpenChange, onSave, entry }: NewEntryDialogProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [locationDescription, setLocationDescription] = useState('');
  const [text, setText] = useState('');
  const [prompts, setPrompts] = useState<string[]>([]);
  const [distance, setDistance] = useState('');
  const [steps, setSteps] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const duration = useMemo(() => {
    if (startTime && endTime) {
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      if (!isNaN(startH) && !isNaN(startM) && !isNaN(endH) && !isNaN(endM) && startH >= 0 && startH < 24 && startM >= 0 && startM < 60 && endH >= 0 && endH < 24 && endM >= 0 && endM < 60) {
        const startTotalMinutes = startH * 60 + startM;
        const endTotalMinutes = endH * 60 + endM;
        if (endTotalMinutes >= startTotalMinutes) {
          return endTotalMinutes - startTotalMinutes;
        }
      }
    }
    return null;
  }, [startTime, endTime]);


  const resetState = () => {
    setImagePreview(null);
    setImageFile(null);
    setLocationDescription('');
    setText('');
    setPrompts([]);
    setDistance('');
    setSteps('');
    setStartTime('');
    setEndTime('');
    setIsGeneratingPrompts(false);
  };
  
  useEffect(() => {
    if (isOpen) {
      if (entry) {
        setImagePreview(entry.photoUrl);
        setLocationDescription(entry.location.description);
        setText(entry.text);
        setDistance(entry.stats?.distance?.toString() ?? '');
        setSteps(entry.stats?.steps?.toString() ?? '');
        setStartTime(entry.stats?.startTime ?? '');
        setEndTime(entry.stats?.endTime ?? '');
        setImageFile(null);
        setPrompts([]);
      } else {
        resetState();
      }
    }
  }, [isOpen, entry]);

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

  const handleGeneratePrompts = async () => {
    const imageSource = imageFile || imagePreview;
    if (!imageSource) {
      toast({
        title: '사진 필요',
        description: 'AI 추천을 받으려면 먼저 사진을 올려주세요.',
        variant: 'destructive',
      });
      return;
    }
    setIsGeneratingPrompts(true);

    try {
        let photoDataUri: string;
        if (imageFile) {
            photoDataUri = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(imageFile);
            });
        } else {
            photoDataUri = imagePreview as string;
        }

        const result = await suggestWritingPrompts({ photoDataUri, locationDescription: locationDescription || '어느 멋진 곳' });
        setPrompts(result.prompts);
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
    onSave({
      photoUrl: imagePreview || '',
      imageHint: imageFile ? 'user uploaded' : entry?.imageHint || 'edited image',
      location: {
        description: locationDescription,
      },
      text: text,
      stats: {
        distance: distance ? parseInt(distance, 10) : undefined,
        time: duration ?? undefined,
        steps: steps ? parseInt(steps, 10) : undefined,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
      }
    }, entry?.id);
    onOpenChange(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetState();
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg md:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-headline text-primary text-2xl">{entry ? '산책 일기 수정' : '새로운 산책 일기'}</DialogTitle>
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
               {imagePreview && <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>사진 변경</Button>}

              <div className="space-y-3 pt-2">
                <Label className="flex items-center gap-2 text-sm font-medium"><BarChart className="w-4 h-4 text-muted-foreground"/>산책 기록 (선택)</Label>
                
                <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="start-time" type="text" placeholder="시작 (HH:mm)" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="pl-8" />
                    </div>
                    <div className="relative">
                       <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                       <Input id="end-time" type="text" placeholder="종료 (HH:mm)" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="pl-8" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <Route className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="distance" type="number" placeholder="거리 (m)" value={distance} onChange={(e) => setDistance(e.target.value)} className="pl-8" />
                  </div>
                   <div className="relative">
                    <Timer className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="time" type="number" placeholder="총 시간(분)" value={duration !== null ? duration : ''} readOnly className="pl-8 bg-muted/50" />
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
                  <div className="mb-4">
                      <Label htmlFor="location-description" className="text-sm font-medium text-foreground mb-2">어디를 산책했나요?</Label>
                      <Input
                          id="location-description"
                          placeholder="예: 서울숲, 집 앞 공원"
                          value={locationDescription}
                          onChange={(e) => setLocationDescription(e.target.value)}
                      />
                  </div>
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
